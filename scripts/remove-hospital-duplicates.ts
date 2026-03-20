import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function deduplicate() {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) throw new Error("MONGODB_URI not found");

        await mongoose.connect(mongoUri);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            slug: String,
            type: String,
            hospitals: [Object],
            hospitalStats: Object
        }));

        const states = await Location.find({ type: 'state' });
        let totalRemoved = 0;

        for (const state of states) {
            const hospitals = state.hospitals || [];
            if (hospitals.length === 0) continue;

            const uniqueHospitals: any[] = [];
            const seenNames = new Set<string>();
            let stateRemoved = 0;

            hospitals.forEach((h: any) => {
                const name = String(h.name || "").toLowerCase().trim();
                if (!name) return;

                if (!seenNames.has(name)) {
                    seenNames.add(name);
                    uniqueHospitals.push(h);
                } else {
                    stateRemoved++;
                    totalRemoved++;
                }
            });

            if (stateRemoved > 0) {
                console.log(`[${state.name}] Removing ${stateRemoved} duplicates...`);
                
                const totalBeds = uniqueHospitals.reduce((sum, h) => sum + (Number(h.beds) || 0), 0);
                
                await Location.updateOne(
                    { _id: state._id },
                    { 
                        $set: { 
                            hospitals: uniqueHospitals,
                            "hospitalStats.count": uniqueHospitals.length,
                            "hospitalStats.staffedBeds": totalBeds
                        } 
                    }
                );
            }
        }

        console.log(`\nDeduplication complete! Total duplicates removed: ${totalRemoved}`);
        
    } catch (error) {
        console.error('Error during deduplication:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

deduplicate();
