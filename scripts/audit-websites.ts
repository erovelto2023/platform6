import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function auditWebsites() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            name: String,
            type: String,
            hospitals: [Object]
        }));

        const states = await Location.find({ type: 'state' });
        let totalCount = 0;
        let missingCount = 0;

        for (const state of states) {
            const hospitals = state.hospitals || [];
            totalCount += hospitals.length;
            const missing = hospitals.filter((h: any) => !h.website || h.website === "" || h.website === "N/A").length;
            missingCount += missing;
            
            if (missing > 0) {
                console.log(`[${state.name}] Total: ${hospitals.length}, Missing Website: ${missing}`);
            }
        }

        console.log(`\nGlobal Audit Result:`);
        console.log(`Total Hospitals: ${totalCount}`);
        console.log(`Hospitals missing website: ${missingCount} (${((missingCount/totalCount)*100).toFixed(1)}%)`);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

auditWebsites();
