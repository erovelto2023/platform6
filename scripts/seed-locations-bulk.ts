import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedBulk() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error("MONGODB_URI not found");

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            slug: String,
            type: String,
            stateSlug: String
        }, { timestamps: true }));

        const filePath = path.join(process.cwd(), "states.txt");
        if (!fs.existsSync(filePath)) throw new Error("states.txt not found");

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

        console.log(`Preparing bulk operations for ${lines.length} lines...`);

        const bulkOps = [];
        let skipped = 0;

        for (const line of lines) {
            let trimmedLine = line.trim();
            let stateMatch = "";
            
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

                    bulkOps.push({
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
                    });
                } else {
                    skipped++;
                }
            } else {
                skipped++;
            }
        }

        console.log(`Total operations prepared: ${bulkOps.length} (Skipped: ${skipped})`);

        // Execute in chunks
        const chunkSize = 1000;
        for (let i = 0; i < bulkOps.length; i += chunkSize) {
            const chunk = bulkOps.slice(i, i + chunkSize);
            console.log(`Executing chunk ${Math.floor(i / chunkSize) + 1} of ${Math.ceil(bulkOps.length / chunkSize)}...`);
            await Location.bulkWrite(chunk, { ordered: false });
        }

        console.log('Bulk seeding complete!');
        
    } catch (error) {
        console.error('Error during bulk seed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

seedBulk();
