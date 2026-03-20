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
            hospitalStats: Object,
            hospitals: Array
        }));

        const states = await Location.find({ type: 'state' }).limit(5);
        if (states.length === 0) {
            console.log('No state locations found');
        }
        
        states.forEach(s => {
            console.log(`State: ${s.slug}`);
            console.log(`Stats:`, JSON.stringify(s.hospitalStats, null, 2));
            if (s.hospitals && s.hospitals.length > 0) {
                console.log(`First Hospital Beds:`, s.hospitals[0].beds);
            }
            console.log('---');
        });
    } catch (error) {
        console.error('Error during check:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

check();
