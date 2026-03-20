"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";
import { RapidApiService } from "@/lib/services/rapidapi.service";
import { OpenStatesService } from "@/lib/services/openstates.service";
import { HospitalService } from "../services/hospital.service";
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
            console.error(`[Sync] Failed to fetch basic metadata for ${state.name} - API returned null`);
            return { success: false, error: "No data returned from RapidAPI. The API key might be invalid or exhausted." };
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

        // Update database with structured data from RapidAPI
        state.postal = meta.postal || stateAbbr;
        state.capital = meta.capital;
        
        // Handle variations in field names
        state.date = meta.date || meta.statehood_date || meta.date_of_statehood;
        state.nickname = meta.nickname || meta.Nickname;
        state.fips = meta.fips || meta.fips_code || meta.fipsCode;
        state.demonym = meta.demonym || meta.Demonym;
        state.status = meta.status || 'state';
        
        // If meta fully matches schema, map direct objects
        if (meta.population) state.population = meta.population;
        if (meta.elevation) state.elevation = meta.elevation;
        if (meta.area) state.area = meta.area;
        if (meta.website) state.website = meta.website;
        if (meta.per_capita_income) state.per_capita_income = meta.per_capita_income;
        if (meta.median_household_income) state.median_household_income = meta.median_household_income;
        if (meta.lowest_point) state.lowest_point = meta.lowest_point;
        if (meta.highest_point) state.highest_point = meta.highest_point;
        if (meta.other_nicknames) state.other_nicknames = meta.other_nicknames;
        if (meta.standard_federal_region) state.standard_federal_region = meta.standard_federal_region;
        if (meta.census_bureau) state.census_bureau = meta.census_bureau;
        if (meta.koppen_climate) state.koppen_climate = meta.koppen_climate;
        if (meta.motto) state.motto = meta.motto;
        if (meta.ap_abbreviation) state.ap_abbreviation = meta.ap_abbreviation;
        if (meta.gpo_abbreviation) state.gpo_abbreviation = meta.gpo_abbreviation;
        if (meta.representatives) state.representatives = meta.representatives;
        if (meta.cities && Array.isArray(meta.cities)) state.cities = meta.cities;
        
        // Timezones can be array or string
        if (meta.time_zones && Array.isArray(meta.time_zones)) {
            state.time_zones = meta.time_zones;
        } else if (meta.timezone || meta.timeZone || meta.time_zone) {
            state.time_zones = [meta.timezone || meta.timeZone || meta.time_zone];
        }
        
        // Census bureau fallback mapping just in case
        if (!state.census_bureau && (meta.region || meta.division)) {
            state.census_bureau = {
                region: meta.region || meta.Region,
                division: meta.division || meta.Division
            };
        }

        // Map available symbols
        if (meta.symbols) {
            state.symbols = meta.symbols;
        } else if (symbols) {
            state.symbols = symbols;
        }
        
        // Map subdivisions
        if (meta.subdivisions) {
            state.subdivisions = meta.subdivisions;
        } else if (subdivisions) {
            state.subdivisions = subdivisions;
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

/**
 * Sync educational institutions data for a specific state.
 */
export async function syncEducationalInstitutions(stateSlug: string, shouldRevalidate: boolean = true) {
    try {
        await connectToDatabase();
        
        const state = await Location.findOne({ slug: stateSlug, type: 'state' });
        if (!state) throw new Error("State not found");

        console.log(`[Sync] Starting educational institutions sync for state: ${state.name} (${stateSlug})`);

        // Sample educational institutions data - you can expand this with real data
        const sampleInstitutions: Array<{ name: string; url?: string }> = [
            {
                name: `${state.name} Department of Education`,
                url: `https://www.${state.name.toLowerCase().replace(/\s+/g, '')}.gov/education`
            },
            {
                name: `${state.name} State University System`,
                url: `https://www.${state.name.toLowerCase().replace(/\s+/g, '')}.edu`
            },
            {
                name: `${state.name} Community College System`,
                url: `https://www.${state.name.toLowerCase().replace(/\s+/g, '')}.edu/community`
            },
            {
                name: `${state.name} Public Schools`,
                url: `https://www.${state.name.toLowerCase().replace(/\s+/g, '')}.k12.gov`
            }
        ];

        (state as any).educationalInstitutions = sampleInstitutions;

        await state.save();
        if (shouldRevalidate) {
            revalidatePath(`/locations/${stateSlug}`);
        }
        
        console.log(`[Sync] Educational institutions sync successful for ${stateSlug}. Added ${sampleInstitutions.length} institutions.`);
        
        return { success: true, data: JSON.parse(JSON.stringify(state)) };
    } catch (error: any) {
        console.error("Error syncing educational institutions data:", error);
        return { success: false, error: error?.message };
    }
}

/**
 * Sync hospital data from Hospital Safety Grade API for a specific state.
 */
export async function syncHospitalData(stateSlug: string, shouldRevalidate: boolean = true) {
    try {
        await connectToDatabase();
        
        const state = await Location.findOne({ slug: stateSlug, type: 'state' });
        if (!state) throw new Error("State not found");

        console.log(`[Sync] Starting hospital sync for state: ${state.name} (${stateSlug})`);

        const stateAbbr = STATE_NAME_TO_ABBR[state.name.toLowerCase()];
        if (!stateAbbr) throw new Error(`Abbreviation not found for state: ${state.name}`);

        // Fetch from Hospital Safety Grade API
        const hospitalData = await HospitalService.fetchHospitalsByState(stateAbbr);
        
        console.log(`[DEBUG] Hospital data fetched for ${stateAbbr}:`, {
            success: !!hospitalData,
            hospitalsCount: hospitalData?.hospitals?.length || 0,
            firstHospital: hospitalData?.hospitals?.[0] ? {
                name: hospitalData.hospitals[0].name,
                address: hospitalData.hospitals[0].address,
                website: hospitalData.hospitals[0].website,
                phone: hospitalData.hospitals[0].phone
            } : null
        });
        
        if (!hospitalData) {
            console.warn(`[Sync] Failed to fetch hospital data for ${state.name}, using sample data`);
            // Fallback to sample data for demonstration
            const sampleData = HospitalService.getSampleHospitalData(stateAbbr);
            console.log(`[DEBUG] Sample data for ${stateAbbr}:`, {
                hospitalsCount: sampleData.hospitals.length,
                firstHospital: sampleData.hospitals[0] ? {
                    name: sampleData.hospitals[0].name,
                    address: sampleData.hospitals[0].address,
                    website: sampleData.hospitals[0].website,
                    phone: sampleData.hospitals[0].phone
                } : null
            });
            state.hospitals = sampleData.hospitals.map((h: any) => ({
                ...h,
                state: stateAbbr
            }));
            state.hospitalStats = sampleData.stats;
        } else {
            // Update database with real hospital data
            console.log(`[DEBUG] Using real hospital data for ${stateAbbr}`);
            state.hospitals = hospitalData.hospitals.map((h: any) => ({
                ...h,
                state: stateAbbr
            }));
            state.hospitalStats = hospitalData.stats;
        }
        
        console.log(`[DEBUG] Final hospital data being saved:`, {
            hospitalsCount: state.hospitals.length,
            firstHospital: state.hospitals[0] ? {
                name: state.hospitals[0].name,
                address: state.hospitals[0].address,
                website: state.hospitals[0].website,
                phone: state.hospitals[0].phone
            } : null
        });

        await state.save();
        
        console.log(`[DEBUG] After save - checking what was actually saved:`);
        console.log(`[DEBUG] Hospitals count in saved state:`, state.hospitals?.length || 0);
        if (state.hospitals && state.hospitals.length > 0) {
            console.log(`[DEBUG] First hospital in saved state:`, {
                name: state.hospitals[0].name,
                address: state.hospitals[0].address,
                website: state.hospitals[0].website,
                phone: state.hospitals[0].phone,
                safetyGrade: state.hospitals[0].safetyGrade
            });
        }
        
        if (shouldRevalidate) {
            revalidatePath(`/locations/${stateSlug}`);
        }
        
        return { success: true, data: JSON.parse(JSON.stringify(state)) };
    } catch (error: any) {
        console.error("Error syncing hospital data:", error);
        return { success: false, error: error?.message };
    }
}
