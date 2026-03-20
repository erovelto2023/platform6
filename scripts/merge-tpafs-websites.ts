import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function mergeWebsites() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error("MONGODB_URI not found");

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const csvPath = path.resolve(process.cwd(), 'excel', 'tpafs-hospitals.csv');
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV not found at ${csvPath}`);
        }

        const fileContent = fs.readFileSync(csvPath, 'utf8');
        interface TpafsRecord {
            reporting_entity_name_common?: string;
            reporting_entity_name_legal?: string;
            machine_readable_page?: string;
            machine_readable_url?: string;
            supplemental_url?: string;
        }

        const records = parse(fileContent, {
            columns: true,
            skip_empty_lines: true,
            relax_column_count: true
        }) as TpafsRecord[];

        console.log(`Loaded ${records.length} TPAFS records.`);

        // Create a mapping of Name -> Website
        const websiteMap: Record<string, string> = {};
        for (const record of records) {
            const name = (record.reporting_entity_name_common || record.reporting_entity_name_legal || "").toLowerCase().trim();
            let url = record.machine_readable_page || record.machine_readable_url || record.supplemental_url || "";
            
            if (url && url.startsWith('http')) {
                // Try to get base domain or original URL if it's a page
                try {
                    const parsed = new URL(url);
                    const baseWebsite = `${parsed.protocol}//${parsed.hostname}`;
                    // Prefer the base website if it's a deep link, or just use the page if it's a landing page
                    websiteMap[name] = baseWebsite;
                } catch (e) {
                    websiteMap[name] = url;
                }
            }
        }

        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            type: String,
            hospitals: [Object]
        }));

        const states = await Location.find({ type: 'state' });
        let totalRestored = 0;

        for (const state of states) {
            let restoredInState = 0;
            const hospitals = [...(state.hospitals || [])];
            let updated = false;

            for (let i = 0; i < hospitals.length; i++) {
                if (!hospitals[i].website || hospitals[i].website === "" || hospitals[i].website === "N/A") {
                    const hName = String(hospitals[i].name || "").toLowerCase().trim();
                    
                    // Direct match
                    let foundUrl = websiteMap[hName];

                    // Fuzzy match (if direct fails)
                    if (!foundUrl) {
                        const matchKey = Object.keys(websiteMap).find(k => 
                            hName.includes(k) || k.includes(hName)
                        );
                        if (matchKey) foundUrl = websiteMap[matchKey];
                    }

                    if (foundUrl) {
                        hospitals[i].website = foundUrl;
                        restoredInState++;
                        updated = true;
                    }
                }
            }

            if (updated) {
                totalRestored += restoredInState;
                console.log(`[${state.name}] Restored ${restoredInState} websites.`);
                await Location.updateOne({ _id: state._id }, { $set: { hospitals } });
            }
        }

        console.log(`\nMerge Complete! Total websites added: ${totalRestored}`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

mergeWebsites();
