"use server";

import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";

/**
 * Fetch all states from the database.
 */
export async function getStates() {
    const logPath = path.join(process.cwd(), "debug_locations.log");
    const log = (msg: string) => {
        const time = new Date().toISOString();
        fs.appendFileSync(logPath, `[${time}] ${msg}\n`);
    };

    try {
        log("getStates started");
        const conn = await connectToDatabase();
        log(`Connected to DB: ${conn.name}`);
        
        const countAll = await Location.countDocuments();
        log(`Total documents in Location collection: ${countAll}`);
        
        const statesCount = await Location.countDocuments({ type: 'state' });
        log(`States count: ${statesCount}`);

        const states = await Location.find({ type: 'state' }).sort({ name: 1 }).lean();
        log(`Found ${states.length} states`);
        
        return JSON.parse(JSON.stringify(states));
    } catch (error: any) {
        log(`Error in getStates: ${error?.message || 'Unknown error'}`);
        console.error("DEBUG: Error in getStates:", error);
        return [];
    }
}

/**
 * Fetch all cities for a specific state.
 */
export async function getCitiesByState(stateSlug: string) {
    try {
        await connectToDatabase();
        const cities = await Location.find({ type: 'city', stateSlug }).sort({ name: 1 }).lean();
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
        
        const states = [
            { name: "Alabama", slug: "alabama", type: "state" },
            { name: "Alaska", slug: "alaska", type: "state" },
            { name: "Arizona", slug: "arizona", type: "state" },
            { name: "Arkansas", slug: "arkansas", type: "state" },
            { name: "California", slug: "california", type: "state" },
            { name: "Colorado", slug: "colorado", type: "state" },
            { name: "Connecticut", slug: "connecticut", type: "state" },
            { name: "Delaware", slug: "delaware", type: "state" },
            { name: "Florida", slug: "florida", type: "state" },
            { name: "Georgia", slug: "georgia", type: "state" },
            { name: "Hawaii", slug: "hawaii", type: "state" },
            { name: "Idaho", slug: "idaho", type: "state" },
            { name: "Illinois", slug: "illinois", type: "state" },
            { name: "Indiana", slug: "indiana", type: "state" },
            { name: "Iowa", slug: "iowa", type: "state" },
            { name: "Kansas", slug: "kansas", type: "state" },
            { name: "Kentucky", slug: "kentucky", type: "state" },
            { name: "Louisiana", slug: "louisiana", type: "state" },
            { name: "Maine", slug: "maine", type: "state" },
            { name: "Maryland", slug: "maryland", type: "state" },
            { name: "Massachusetts", slug: "massachusetts", type: "state" },
            { name: "Michigan", slug: "michigan", type: "state" },
            { name: "Minnesota", slug: "minnesota", type: "state" },
            { name: "Mississippi", slug: "mississippi", type: "state" },
            { name: "Missouri", slug: "missouri", type: "state" },
            { name: "Montana", slug: "montana", type: "state" },
            { name: "Nebraska", slug: "nebraska", type: "state" },
            { name: "Nevada", slug: "nevada", type: "state" },
            { name: "New Hampshire", slug: "new-hampshire", type: "state" },
            { name: "New Jersey", slug: "new-jersey", type: "state" },
            { name: "New Mexico", slug: "new-mexico", type: "state" },
            { name: "New York", slug: "new-york", type: "state" },
            { name: "North Carolina", slug: "north-carolina", type: "state" },
            { name: "North Dakota", slug: "north-dakota", type: "state" },
            { name: "Ohio", slug: "ohio", type: "state" },
            { name: "Oklahoma", slug: "oklahoma", type: "state" },
            { name: "Oregon", slug: "oregon", type: "state" },
            { name: "Pennsylvania", slug: "pennsylvania", type: "state" },
            { name: "Rhode Island", slug: "rhode-island", type: "state" },
            { name: "South Carolina", slug: "south-carolina", type: "state" },
            { name: "South Dakota", slug: "south-dakota", type: "state" },
            { name: "Tennessee", slug: "tennessee", type: "state" },
            { name: "Texas", slug: "texas", type: "state" },
            { name: "Utah", slug: "utah", type: "state" },
            { name: "Vermont", slug: "vermont", type: "state" },
            { name: "Virginia", slug: "virginia", type: "state" },
            { name: "Washington", slug: "washington", type: "state" },
            { name: "West Virginia", slug: "west-virginia", type: "state" },
            { name: "Wisconsin", slug: "wisconsin", type: "state" },
            { name: "Wyoming", slug: "wyoming", type: "state" }
        ];

        const cities = [
            { name: "Birmingham", slug: "birmingham", type: "city", stateSlug: "alabama" },
            { name: "Montgomery", slug: "montgomery", type: "city", stateSlug: "alabama" },
            { name: "Anchorage", slug: "anchorage", type: "city", stateSlug: "alaska" },
            { name: "Phoenix", slug: "phoenix", type: "city", stateSlug: "arizona" },
            { name: "Tucson", slug: "tucson", type: "city", stateSlug: "arizona" },
            { name: "Little Rock", slug: "little-rock", type: "city", stateSlug: "arkansas" },
            { name: "Los Angeles", slug: "los-angeles", type: "city", stateSlug: "california" },
            { name: "San Francisco", slug: "san-francisco", type: "city", stateSlug: "california" },
            { name: "San Diego", slug: "san-diego", type: "city", stateSlug: "california" },
            { name: "Denver", slug: "denver", type: "city", stateSlug: "colorado" },
            { name: "Bridgeport", slug: "bridgeport", type: "city", stateSlug: "connecticut" },
            { name: "Wilmington", slug: "wilmington", type: "city", stateSlug: "delaware" },
            { name: "Jacksonville", slug: "jacksonville", type: "city", stateSlug: "florida" },
            { name: "Miami", slug: "miami", type: "city", stateSlug: "florida" },
            { name: "Tampa", slug: "tampa", type: "city", stateSlug: "florida" },
            { name: "Orlando", slug: "orlando", type: "city", stateSlug: "florida" },
            { name: "Atlanta", slug: "atlanta", type: "city", stateSlug: "georgia" },
            { name: "Honolulu", slug: "honolulu", type: "city", stateSlug: "hawaii" },
            { name: "Boise", slug: "boise", type: "city", stateSlug: "idaho" },
            { name: "Chicago", slug: "chicago", type: "city", stateSlug: "illinois" },
            { name: "Indianapolis", slug: "indianapolis", type: "city", stateSlug: "indiana" },
            { name: "Des Moines", slug: "des-moines", type: "city", stateSlug: "iowa" },
            { name: "Wichita", slug: "wichita", type: "city", stateSlug: "kansas" },
            { name: "Louisville", slug: "louisville", type: "city", stateSlug: "kentucky" },
            { name: "New Orleans", slug: "new-orleans", type: "city", stateSlug: "louisiana" },
            { name: "Portland", slug: "portland", type: "city", stateSlug: "maine" },
            { name: "Baltimore", slug: "baltimore", type: "city", stateSlug: "maryland" },
            { name: "Boston", slug: "boston", type: "city", stateSlug: "massachusetts" },
            { name: "Detroit", slug: "detroit", type: "city", stateSlug: "michigan" },
            { name: "Minneapolis", slug: "minneapolis", type: "city", stateSlug: "minnesota" },
            { name: "Jackson", slug: "jackson", type: "city", stateSlug: "mississippi" },
            { name: "Kansas City", slug: "kansas-city", type: "city", stateSlug: "missouri" },
            { name: "St. Louis", slug: "st-louis", type: "city", stateSlug: "missouri" },
            { name: "Billings", slug: "billings", type: "city", stateSlug: "montana" },
            { name: "Omaha", slug: "omaha", type: "city", stateSlug: "nebraska" },
            { name: "Las Vegas", slug: "las-vegas", type: "city", stateSlug: "nevada" },
            { name: "Manchester", slug: "manchester", type: "city", stateSlug: "new-hampshire" },
            { name: "Newark", slug: "newark", type: "city", stateSlug: "new-jersey" },
            { name: "Albuquerque", slug: "albuquerque", type: "city", stateSlug: "new-mexico" },
            { name: "New York City", slug: "new-york-city", type: "city", stateSlug: "new-york" },
            { name: "Charlotte", slug: "charlotte", type: "city", stateSlug: "north-carolina" },
            { name: "Fargo", slug: "fargo", type: "city", stateSlug: "north-dakota" },
            { name: "Columbus", slug: "columbus", type: "city", stateSlug: "ohio" },
            { name: "Oklahoma City", slug: "oklahoma-city", type: "city", stateSlug: "oklahoma" },
            { name: "Portland", slug: "portland-ore", type: "city", stateSlug: "oregon" },
            { name: "Philadelphia", slug: "philadelphia", type: "city", stateSlug: "pennsylvania" },
            { name: "Providence", slug: "providence", type: "city", stateSlug: "rhode-island" },
            { name: "Charleston", slug: "charleston", type: "city", stateSlug: "south-carolina" },
            { name: "Sioux Falls", slug: "sioux-falls", type: "city", stateSlug: "south-dakota" },
            { name: "Nashville", slug: "nashville", type: "city", stateSlug: "tennessee" },
            { name: "Houston", slug: "houston", type: "city", stateSlug: "texas" },
            { name: "Dallas", slug: "dallas", type: "city", stateSlug: "texas" },
            { name: "Austin", slug: "austin", type: "city", stateSlug: "texas" },
            { name: "Salt Lake City", slug: "salt-lake-city", type: "city", stateSlug: "utah" },
            { name: "Burlington", slug: "burlington", type: "city", stateSlug: "vermont" },
            { name: "Virginia Beach", slug: "virginia-beach", type: "city", stateSlug: "virginia" },
            { name: "Seattle", slug: "seattle", type: "city", stateSlug: "washington" },
            { name: "Charleston", slug: "charleston-wv", type: "city", stateSlug: "west-virginia" },
            { name: "Milwaukee", slug: "milwaukee", type: "city", stateSlug: "wisconsin" },
            { name: "Cheyenne", slug: "cheyenne", type: "city", stateSlug: "wyoming" }
        ];

        let stateCount = 0;
        for (const state of states) {
            await Location.findOneAndUpdate(
                { slug: state.slug, type: 'state' },
                { $set: state },
                { upsert: true }
            );
            stateCount++;
        }

        let cityCount = 0;
        for (const city of cities) {
            await Location.findOneAndUpdate(
                { slug: city.slug, stateSlug: city.stateSlug, type: 'city' },
                { $set: city },
                { upsert: true }
            );
            cityCount++;
        }

        revalidatePath("/locations");
        
        return {
            success: true,
            message: `Seeded ${stateCount} states and ${cityCount} cities successfully.`
        };
    } catch (error: any) {
        console.error("Error seeding locations:", error);
        return {
            success: false,
            error: error?.message || "Failed to seed locations"
        };
    }
}
