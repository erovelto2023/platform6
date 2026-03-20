import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function restoreWebsites() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error("MONGODB_URI not found");

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            slug: String,
            type: String,
            hospitals: [Object]
        }));

        const states = await Location.find({ type: 'state' });
        console.log(`Checking ${states.length} states for website restoration...`);

        for (const state of states) {
            const stateSlug = state.slug;
            const dataFilePath = path.resolve(process.cwd(), 'lib', 'data', `${stateSlug}-hospitals.ts`);
            
            if (!fs.existsSync(dataFilePath)) {
                console.log(`[${stateSlug}] No data file found at ${dataFilePath}`);
                continue;
            }

            // Read the file content and try to extract the array
            // Since it's a TS file with exports, we'll use a simple regex to find the websites
            const content = fs.readFileSync(dataFilePath, 'utf8');
            
            // Extract hospitals using regex for simplicity in this script
            const hospitalMatch = content.match(/\[[\s\S]*?\]/);
            if (!hospitalMatch) continue;
            
            // Use eval-like approach (safe-ish here since we created the files) or just parse
            // Actually, let's just use string searching to build a mapping
            const websiteMap: Record<string, string> = {};
            const entryRegex = /\{[\s\S]*?name:\s*['"](.*?)['"][\s\S]*?website:\s*['"](.*?)['"][\s\S]*?\}/g;
            let match;
            while ((match = entryRegex.exec(content)) !== null) {
                const name = match[1].toLowerCase().trim();
                const website = match[2];
                if (website && website !== "" && website !== "N/A") {
                    websiteMap[name] = website;
                }
            }

            if (Object.keys(websiteMap).length === 0) continue;

            let restoredCount = 0;
            const currentHospitals = [...(state.hospitals || [])];

            for (let i = 0; i < currentHospitals.length; i++) {
                const h = currentHospitals[i];
                if (!h.website || h.website === "" || h.website === "N/A") {
                    const normalizedName = String(h.name || "").toLowerCase().trim();
                    
                    // Try exact match
                    let foundWebsite = websiteMap[normalizedName];
                    
                    if (!foundWebsite) {
                        // Try fuzzy match (substring)
                        const matchingName = Object.keys(websiteMap).find(sourceName => 
                            normalizedName.includes(sourceName) || sourceName.includes(normalizedName)
                        );
                        if (matchingName) foundWebsite = websiteMap[matchingName];
                    }

                    if (foundWebsite) {
                        currentHospitals[i].website = foundWebsite;
                        restoredCount++;
                    }
                }
            }

            if (restoredCount > 0) {
                console.log(`[${stateSlug}] Restored ${restoredCount} websites.`);
                await Location.updateOne(
                    { _id: state._id },
                    { $set: { hospitals: currentHospitals } }
                );
            }
        }

        console.log('Website restoration complete!');
        
    } catch (error) {
        console.error('Error during restoration:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

restoreWebsites();
