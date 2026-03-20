import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function checkDuplicates() {
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
        let totalDuplicatesFound = 0;

        for (const state of states) {
            const hospitals = state.hospitals || [];
            const nameMap: Record<string, number[]> = {};
            const dupesInState: string[] = [];

            hospitals.forEach((h: any, idx: number) => {
                const normalizedName = String(h.name || "").toLowerCase().trim();
                if (!normalizedName) return;

                if (!nameMap[normalizedName]) {
                    nameMap[normalizedName] = [];
                }
                nameMap[normalizedName].push(idx);
            });

            Object.entries(nameMap).forEach(([name, indices]) => {
                if (indices.length > 1) {
                    dupesInState.push(`${name} (${indices.length} times)`);
                    totalDuplicatesFound += (indices.length - 1);
                }
            });

            if (dupesInState.length > 0) {
                console.log(`[${state.name}] Found potential duplicates:`);
                dupesInState.forEach(d => console.log(`  - ${d}`));
            }
        }

        if (totalDuplicatesFound === 0) {
            console.log('No exact name duplicates found across all states.');
        } else {
            console.log(`\nFound ${totalDuplicatesFound} total duplicate entries.`);
        }
        
    } catch (error) {
        console.error('Error during duplicate check:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

checkDuplicates();
