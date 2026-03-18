"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";

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
