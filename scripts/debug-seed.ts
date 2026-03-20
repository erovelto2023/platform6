import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debugSeed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            slug: String,
            type: String,
            stateSlug: String
        }));

        const filePath = path.join(process.cwd(), "states.txt");
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

        let cityCount = 0;
        let processedLines = 0;
        
        console.log(`Starting debug seed for Alaska...`);
        
        for (const line of lines) {
            processedLines++;
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

                    if (stateSlug === 'alaska') {
                        console.log(`[ALASKA] Line ${processedLines}: Found city ${cityName} (${citySlug})`);
                        const existing = await Location.findOne({ slug: citySlug, stateSlug: stateSlug, type: 'city' });
                        if (existing) {
                            console.log(`[ALASKA]   Already exists: ${existing.name}`);
                        } else {
                            console.log(`[ALASKA]   Creating new...`);
                            await Location.create({ name: cityName, slug: citySlug, type: 'city', stateSlug: stateSlug });
                            cityCount++;
                        }
                    }
                }
            }
            
            if (processedLines > 1000) break; // Limit for now
        }
        
    } catch (error) {
        console.error('Error during debug seed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

debugSeed();
