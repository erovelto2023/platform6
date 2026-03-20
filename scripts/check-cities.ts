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
            stateSlug: String
        }));

        const stateCount = await Location.countDocuments({ type: 'state' });
        const cityCount = await Location.countDocuments({ type: 'city' });
        
        console.log(`Total States: ${stateCount}`);
        console.log(`Total Cities: ${cityCount}`);
        
        // Sample city counts for first 5 states
        const states = await Location.find({ type: 'state' }).sort({ name: 1 }).limit(5);
        for (const s of states) {
            const count = await Location.countDocuments({ type: 'city', stateSlug: s.slug });
            console.log(`State: ${s.slug}, City Count: ${count}`);
        }
        
    } catch (error) {
        console.error('Error during check:', error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
}

check();
