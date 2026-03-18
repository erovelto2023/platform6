"use server";

import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";
import { revalidatePath } from "next/cache";
import fs from "fs";
import path from "path";

function slugify(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-") // Replace spaces with -
        .replace(/[^\w-]+/g, "") // Remove all non-word chars
        .replace(/--+/g, "-"); // Replace multiple - with single -
}

/**
 * Bulk seed locations from a JSON file.
 */
export async function seedComprehensiveLocations() {
    try {
        await connectToDatabase();
        
        const dataPath = path.join(process.cwd(), "tmp", "locations_data.json");
        if (!fs.existsSync(dataPath)) {
            throw new Error("locations_data.json not found in tmp directory");
        }

        const data = JSON.parse(fs.readFileSync(dataPath, "utf8"));
        const states = Object.keys(data);
        
        console.log(`Starting bulk seed for ${states.length} states...`);

        let statesCount = 0;
        let citiesCount = 0;

        for (const stateName of states) {
            const stateSlug = slugify(stateName);
            
            // Upsert State
            await Location.findOneAndUpdate(
                { slug: stateSlug, type: 'state' },
                { 
                    $set: { 
                        name: stateName, 
                        slug: stateSlug, 
                        type: 'state' 
                    } 
                },
                { upsert: true }
            );
            statesCount++;

            const cities = data[stateName];
            const cityOps = cities.map((cityName: string) => {
                const citySlug = slugify(cityName);
                return {
                    updateOne: {
                        filter: { slug: citySlug, stateSlug: stateSlug, type: 'city' },
                        update: {
                            $set: {
                                name: cityName,
                                slug: citySlug,
                                type: 'city',
                                stateSlug: stateSlug
                            }
                        },
                        upsert: true
                    }
                };
            });

            if (cityOps.length > 0) {
                // Process cities in chunks to avoid overwhelming the DB
                const chunkSize = 100;
                for (let i = 0; i < cityOps.length; i += chunkSize) {
                    const chunk = cityOps.slice(i, i + chunkSize);
                    await Location.bulkWrite(chunk);
                }
                citiesCount += cityOps.length;
            }
            
            console.log(`Finished seeding ${stateName} (${cities.length} cities)`);
        }

        revalidatePath("/locations");

        return {
            success: true,
            message: `Successfully seeded ${statesCount} states and ${citiesCount} cities.`
        };
    } catch (error: any) {
        console.error("Error in seedComprehensiveLocations:", error);
        return {
            success: false,
            error: error?.message || "Failed to seed locations"
        };
    }
}
