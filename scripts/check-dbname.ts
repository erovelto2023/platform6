import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';

async function checkDbName() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI!);
        console.log('Connected to DB:', mongoose.connection.name);
        
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log('Collections in this DB:');
        collections.forEach(c => console.log(`- ${c.name}`));
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

checkDbName();
