import connectToDatabase from "@/lib/db/connect";
import Location from "@/lib/db/models/Location";
import { revalidatePath } from "next/cache";

/**
 * Import Alabama cities data
 */
export async function importAlabamaCities() {
    try {
        await connectToDatabase();
        
        // Alabama major cities with market data
        const alabamaCities = [
            { name: "Birmingham", population: 200733, description: "Largest city in Alabama, major healthcare and financial hub" },
            { name: "Montgomery", population: 204528, description: "State capital and second-largest city" },
            { name: "Mobile", population: 191011, description: "Port city on the Gulf Coast" },
            { name: "Huntsville", population: 215006, description: "Technology and aerospace hub" },
            { name: "Tuscaloosa", population: 101113, description: "Home to University of Alabama" },
            { name: "Hoover", population: 92814, description: "Suburban city near Birmingham" },
            { name: "Auburn", population: 76143, description: "Home to Auburn University" },
            { name: "Decatur", population: 54944, description: "Industrial city on Tennessee River" },
            { name: "Madison", population: 56933, description: "Technology corridor near Huntsville" },
            { name: "Dothan", population: 71684, description: "Peanut capital of the world" },
            { name: "Florence", population: 40049, description: "Northwest Alabama cultural center" },
            { name: "Prattville", population: 37191, description: "Suburb of Montgomery" },
            { name: "Gadsden", population: 33945, description: "Northeast Alabama industrial city" },
            { name: "Phenix City", population: 32822, description: "Border city near Columbus, GA" },
            { name: "Alabaster", population: 33284, description: "Birmingham suburb" }
        ];

        // Update Alabama state with cities data using raw MongoDB
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${alabamaCities.length} cities`);
            
            const updateResult = await locations.updateOne(
                { slug: 'alabama', type: 'state' },
                { 
                    $set: { 
                        cities: alabamaCities,
                        cityStats: {
                            count: alabamaCities.length,
                            totalPopulation: alabamaCities.reduce((sum, city) => sum + (city.population || 0), 0)
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB cities update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("Alabama state document not found");
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${alabamaCities.length} Alabama cities`);

        // Revalidate the Alabama page
        revalidatePath('/locations/alabama');

        return { 
            success: true, 
            message: `Successfully imported ${alabamaCities.length} Alabama cities`,
            count: alabamaCities.length
        };

    } catch (error: any) {
        console.error("Error importing Alabama cities:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Alaska cities data
 */
export async function importAlaskaCities() {
    try {
        await connectToDatabase();
        
        // Alaska major cities with market data
        const alaskaCities = [
            { name: "Anchorage", population: 291247, description: "Largest city and major economic hub" },
            { name: "Fairbanks", population: 32975, description: "Interior Alaska's largest city" },
            { name: "Juneau", population: 32255, description: "State capital and coastal city" },
            { name: "Sitka", population: 8458, description: "Historic coastal community" },
            { name: "Ketchikan", population: 8192, description: "Salmon fishing hub" },
            { name: "Wasilla", population: 9057, description: "Gateway to Denali" },
            { name: "Kenai", population: 7424, description: "Oil and fishing city" },
            { name: "Kodiak", population: 6130, description: "Island fishing community" },
            { name: "Bethel", population: 6379, description: "Yukon-Kuskokwim Delta hub" },
            { name: "Palmer", population: 7908, description: "Agricultural center" },
            { name: "Homer", population: 5440, description: "Scenic coastal town" },
            { name: "Unalaska", population: 4525, description: "Fishing port in Aleutian Islands" },
            { name: "North Pole", population: 2333, description: "Suburb of Fairbanks" },
            { name: "Soldotna", population: 4568, description: "Kenai Peninsula hub" },
            { name: "Valdez", population: 3835, description: "Oil terminus port city" }
        ];

        // Update Alaska state with cities data using raw MongoDB
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${alaskaCities.length} cities`);
            
            const updateResult = await locations.updateOne(
                { slug: 'alaska', type: 'state' },
                { 
                    $set: { 
                        cities: alaskaCities,
                        cityStats: {
                            count: alaskaCities.length,
                            totalPopulation: alaskaCities.reduce((sum, city) => sum + (city.population || 0), 0)
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB cities update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("Alaska state document not found");
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${alaskaCities.length} Alaska cities`);

        // Revalidate the Alaska page
        revalidatePath('/locations/alaska');

        return { 
            success: true, 
            message: `Successfully imported ${alaskaCities.length} Alaska cities`,
            count: alaskaCities.length
        };

    } catch (error: any) {
        console.error("Error importing Alaska cities:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Alabama educational institutions
 */
export async function importAlabamaEducation() {
    try {
        await connectToDatabase();
        
        // Alabama major educational institutions
        const alabamaEducation = [
            { name: "University of Alabama", url: "https://www.ua.edu" },
            { name: "Auburn University", url: "https://www.auburn.edu" },
            { name: "University of Alabama at Birmingham", url: "https://www.uab.edu" },
            { name: "University of South Alabama", url: "https://www.southalabama.edu" },
            { name: "University of North Alabama", url: "https://www.una.edu" },
            { name: "University of Alabama in Huntsville", url: "https://www.uah.edu" },
            { name: "Troy University", url: "https://www.troy.edu" },
            { name: "Jacksonville State University", url: "https://www.jsu.edu" },
            { name: "University of Montevallo", url: "https://www.montevallo.edu" },
            { name: "Alabama State University", url: "https://www.alasu.edu" },
            { name: "Alabama A&M University", url: "https://www.aamu.edu" },
            { name: "University of West Alabama", url: "https://www.uwa.edu" },
            { name: "Samford University", url: "https://www.samford.edu" },
            { name: "Birmingham-Southern College", url: "https://www.bsc.edu" },
            { name: "Spring Hill College", url: "https://www.shc.edu" },
            { name: "Huntingdon College", url: "https://www.huntingdon.edu" },
            { name: "Miles College", url: "https://www.miles.edu" },
            { name: "Oakwood University", url: "https://www.oakwood.edu" },
            { name: "Faulkner University", url: "https://www.faulkner.edu" },
            { name: "University of Mobile", url: "https://www.umobile.edu" }
        ];

        // Update Alabama state with education data using raw MongoDB
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${alabamaEducation.length} educational institutions`);
            
            const updateResult = await locations.updateOne(
                { slug: 'alabama', type: 'state' },
                { 
                    $set: { 
                        educationalInstitutions: alabamaEducation,
                        educationStats: {
                            count: alabamaEducation.length
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB education update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("Alabama state document not found");
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${alabamaEducation.length} Alabama educational institutions`);

        // Revalidate the Alabama page
        revalidatePath('/locations/alabama');

        return { 
            success: true, 
            message: `Successfully imported ${alabamaEducation.length} Alabama educational institutions`,
            count: alabamaEducation.length
        };

    } catch (error: any) {
        console.error("Error importing Alabama education:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}

/**
 * Import Alaska educational institutions
 */
export async function importAlaskaEducation() {
    try {
        await connectToDatabase();
        
        // Alaska major educational institutions
        const alaskaEducation = [
            { name: "University of Alaska Anchorage", url: "https://www.uaa.alaska.edu" },
            { name: "University of Alaska Fairbanks", url: "https://www.uaf.edu" },
            { name: "University of Alaska Southeast", url: "https://www.uas.alaska.edu" },
            { name: "Alaska Pacific University", url: "https://www.alaskapacific.edu" },
            { name: "Ilisagvik College", url: "https://www.ilisagvik.edu" },
            { name: "Alaska Bible College", url: "https://www.alaskabible.edu" },
            { name: "Charter College", url: "https://www.chartercollege.edu" },
            { name: "Kenai Peninsula College", url: "https://www.kpc.alaska.edu" },
            { name: "Prince William Sound College", url: "https://www.pwscc.edu" },
            { name: "University of Alaska Anchorage Matanuska-Susitna College", url: "https://www.matsu.alaska.edu" },
            { name: "Alaska Career College", url: "https://www.alaskacareercollege.edu" },
            { name: "AVTEC - Alaska Vocational Technical Center", url: "https://www.avtec.edu" },
            { name: "University of Alaska Fairbanks Community and Technical College", url: "https://www.ctc.uaf.edu" },
            { name: "Alaska Learning Network", url: "https://www.alaskalearns.org" },
            { name: "Northwest Arctic Borough School District", url: "https://www.nwarctic.org" }
        ];

        // Update Alaska state with education data using raw MongoDB
        const { MongoClient } = require('mongodb');
        const client = new MongoClient(process.env.MONGODB_URI!);
        
        try {
            await client.connect();
            const db = client.db();
            const locations = db.collection('locations');
            
            console.log(`[Import] Connected to MongoDB directly`);
            console.log(`[Import] About to update with ${alaskaEducation.length} educational institutions`);
            
            const updateResult = await locations.updateOne(
                { slug: 'alaska', type: 'state' },
                { 
                    $set: { 
                        educationalInstitutions: alaskaEducation,
                        educationStats: {
                            count: alaskaEducation.length
                        }
                    }
                }
            );

            console.log(`[Import] MongoDB education update result:`, updateResult);
            
            if (updateResult.matchedCount === 0) {
                throw new Error("Alaska state document not found");
            }

        } finally {
            await client.close();
        }

        console.log(`[Import] Successfully imported ${alaskaEducation.length} Alaska educational institutions`);

        // Revalidate the Alaska page
        revalidatePath('/locations/alaska');

        return { 
            success: true, 
            message: `Successfully imported ${alaskaEducation.length} Alaska educational institutions`,
            count: alaskaEducation.length
        };

    } catch (error: any) {
        console.error("Error importing Alaska education:", error);
        return { 
            success: false, 
            error: error?.message || "Unknown error" 
        };
    }
}
