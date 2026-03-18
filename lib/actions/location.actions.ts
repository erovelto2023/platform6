"use server";

import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";

/**
 * Fetch all states from the database.
 */
export async function getStates() {
    try {
        await connectToDatabase();
        const states = await Location.find({ type: 'state' }).sort({ name: 1 }).lean();
        return JSON.parse(JSON.stringify(states));
    } catch (error) {
        console.error("Error fetching states:", error);
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
