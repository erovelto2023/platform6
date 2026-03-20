import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function check() {
    try {
        await mongoose.connect(process.env.MONGODB_URI!);
        console.log('Connected to MongoDB');
        
        const Location = mongoose.models.Location || mongoose.model('Location', new mongoose.Schema({
            slug: String,
            type: String,
            name: String,
            hospitals: [Object],
            hospitalStats: Object
        }));

        const s = await Location.findOne({ slug: 'alaska', type: 'state' });
        console.log('ALASKA DETAILS in DB:');
        console.log('Stats:', JSON.stringify(s.hospitalStats, null, 2));
        console.log('Hospitals Count:', s.hospitals.length);
        console.log('First Hospital Safety:', s.hospitals[0]?.safetyGrade);
        console.log('First Hospital Beds:', s.hospitals[0]?.beds);
        
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

check();
