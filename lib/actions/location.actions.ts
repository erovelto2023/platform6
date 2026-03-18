"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";
import { RapidApiService } from "@/lib/services/rapidapi.service";
import { OpenStatesService } from "@/lib/services/openstates.service";
import { STATE_NAME_TO_ABBR } from "@/lib/utils/state-mapping";

/**
 * Fetch all states from the database with optional search.
 */
export async function getStates(search?: string) {
    try {
        await connectToDatabase();
        
        const query: any = { type: 'state' };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const states = await Location.find(query).sort({ name: 1 }).lean();
        
        return {
            states: JSON.parse(JSON.stringify(states)),
            debug: {
                statesCount: states.length,
                time: new Date().toISOString()
            }
        };
    } catch (error: any) {
        console.error("Error in getStates:", error);
        return {
            states: [],
            error: error?.message || 'Unknown error',
            debug: {
                time: new Date().toISOString()
            }
        };
    }
}

/**
 * Fetch all cities for a specific state with optional search.
 */
export async function getCitiesByState(stateSlug: string, search?: string) {
    try {
        await connectToDatabase();
        const query: any = { type: 'city', stateSlug };
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        const cities = await Location.find(query).sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(cities));
    } catch (error) {
        console.error("Error fetching cities by state:", error);
        return [];
    }
}

/**
 * Fetch a specific location (state or city).
 */
export async function getLocation(slug: string, stateSlug?: string) {
    try {
        await connectToDatabase();
        const query: any = { slug };
        if (stateSlug) {
            query.stateSlug = stateSlug;
            query.type = 'city';
        } else {
            query.type = 'state';
        }
        
        const location = await Location.findOne(query).lean();
        return JSON.parse(JSON.stringify(location));
    } catch (error) {
        console.error("Error fetching location:", error);
        return null;
    }
}

/**
 * Sync state metadata from RapidAPI for a specific state.
 */
export async function syncStateData(stateSlug: string, shouldRevalidate: boolean = true) {
    try {
        await connectToDatabase();
        
        const state = await Location.findOne({ slug: stateSlug, type: 'state' });
        if (!state) throw new Error("State not found");

        console.log(`[Sync] Starting sync for state: ${state.name} (${stateSlug})`);

        // Fetch from RapidAPI
        const meta = await RapidApiService.fetchStateMetadata(state.name);
        if (!meta) {
            console.error(`[Sync] Failed to fetch basic metadata for ${state.name}`);
            return { success: false, error: "No basic metadata found from API" };
        }

        const stateAbbr = STATE_NAME_TO_ABBR[state.name.toLowerCase()];
        let symbols = null;
        let subdivisions = null;

        if (stateAbbr) {
            // Fetch symbols and subdivisions in parallel
            const [symbolsRes, subdivisionsRes] = await Promise.all([
                RapidApiService.fetchStateSymbols(stateAbbr),
                RapidApiService.fetchStateSubdivisions(stateAbbr)
            ]);
            symbols = symbolsRes;
            subdivisions = subdivisionsRes;
        }

        // Update database with flat structure - only map available fields
        state.postal = (meta as any).postal || stateAbbr;
        state.capital = meta.capital;
        state.date = meta.statehood_date;
        state.nickname = meta.nickname;
        state.fips = meta.fips_code;
        state.demonym = meta.demonym;
        
        // Map available elevation data
        if (meta.elevation_max_feet || meta.elevation_min_feet) {
            const minFeet = meta.elevation_min_feet;
            const maxFeet = meta.elevation_max_feet;
            
            state.elevation = {
                min_ft: minFeet,
                min_m: minFeet ? String(Math.round(Number(minFeet) * 0.3048)) : undefined,
                max_ft: maxFeet,
                max_m: maxFeet ? String(Math.round(Number(maxFeet) * 0.3048)) : undefined,
                // Default values for missing fields
                mean_ft: undefined,
                max_rank: undefined,
                span_ft: undefined,
                mean_rank: undefined,
                span_m: undefined,
                mean_m: undefined,
            };
        }
        
        // Map timezone to array format
        if (meta.timezone) {
            state.time_zones = [meta.timezone];
        }
        
        // Map census bureau data
        if (meta.region || meta.division) {
            state.census_bureau = {
                region: meta.region,
                division: meta.division
            };
        }
        
        // Map available symbols
        if (symbols) {
            state.symbols = symbols;
        }
        
        // Map subdivisions
        if (subdivisions) {
            state.subdivisions = subdivisions;
        }
        
        // Set default status if not present
        if (!state.status) {
            state.status = 'state';
        }

        await state.save();
        if (shouldRevalidate) {
            revalidatePath(`/locations/${stateSlug}`);
        }
        
        return { success: true, data: JSON.parse(JSON.stringify(state)) };
    } catch (error: any) {
        console.error("Error syncing state data:", error);
        return { success: false, error: error?.message };
    }
}

/**
 * Sync legislative data from Open States.
 */
export async function syncLegislativeData(stateSlug: string, shouldRevalidate: boolean = true) {
    try {
        await connectToDatabase();
        
        const state = await Location.findOne({ slug: stateSlug, type: 'state' });
        if (!state) throw new Error("State not found");

        const stateAbbr = STATE_NAME_TO_ABBR[state.name.toLowerCase()];
        if (!stateAbbr) throw new Error(`Abbreviation not found for state: ${state.name}`);

        console.log(`[Sync] Starting legislative sync for: ${state.name} (${stateAbbr})`);

        // Fetch from Open States
        const data = await OpenStatesService.fetchLegislativeData(stateAbbr);
        if (!data) {
            console.error(`[Sync] Failed to fetch legislative data for ${stateAbbr}`);
            return { success: false, error: "No legislative data found" };
        }

        // Update database
        state.legislativeData = {
            jurisdictionId: data.jurisdictionId,
            legislators: data.legislators,
            recentBills: data.recentBills
        };

        await state.save();
        if (shouldRevalidate) {
            revalidatePath(`/locations/${stateSlug}`);
        }
        
        return { success: true, data: JSON.parse(JSON.stringify(state)) };
    } catch (error: any) {
        console.error("Error syncing legislative data:", error);
        return { success: false, error: error?.message };
    }
}

export async function seedLocations() {
    try {
        await connectToDatabase();
        
        const filePath = path.join(process.cwd(), "states.txt");
        if (!fs.existsSync(filePath)) {
            throw new Error("states.txt not found at " + filePath);
        }

        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n").filter(line => line.trim() !== "");

        const statesList = [
            "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", 
            "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", 
            "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", 
            "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", 
            "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
        ];

        const slugify = (text: string) => text.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

        console.log(`Starting seed with ${lines.length} potential locations...`);

        // First, seed all states
        for (const stateName of statesList) {
            await Location.findOneAndUpdate(
                { slug: slugify(stateName), type: 'state' },
                { $set: { name: stateName, slug: slugify(stateName), type: 'state' } },
                { upsert: true }
            );
        }

        let cityCount = 0;
        // Process lines for cities
        for (const line of lines) {
            // Lines are like "Anchorage Alaska"
            let trimmedLine = line.trim();
            let stateMatch = "";
            
            // Check for state name at the end of the line
            for (const state of statesList) {
                if (trimmedLine.endsWith(state)) {
                    stateMatch = state;
                    break;
                }
            }

            if (stateMatch) {
                const cityName = trimmedLine.substring(0, trimmedLine.length - stateMatch.length).trim();
                if (cityName) {
                    const citySlug = slugify(cityName);
                    const stateSlug = slugify(stateMatch);

                    await Location.findOneAndUpdate(
                        { slug: citySlug, stateSlug: stateSlug, type: 'city' },
                        { $set: { name: cityName, slug: citySlug, type: 'city', stateSlug: stateSlug } },
                        { upsert: true }
                    );
                    cityCount++;
                }
            }
        }

        revalidatePath("/locations");
        
        return {
            success: true,
            message: `Seeded ${statesList.length} states and ${cityCount} cities successfully.`
        };
    } catch (error: any) {
        console.error("Error seeding locations:", error);
        return {
            success: false,
            error: error?.message || "Failed to seed locations"
        };
    }
}
