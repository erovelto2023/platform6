import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import mongoose from 'mongoose';

async function searchByTitle() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI!);
        const collections = await mongoose.connection.db.listCollections().toArray();
        
        for (const col of collections) {
            const doc = await mongoose.connection.db.collection(col.name).findOne({ title: { $exists: true } });
            if (doc) {
                console.log(`Collection ${col.name} HAS documents with 'title' field.`);
                console.log(`Sample:`, JSON.stringify(doc, null, 2));
            }
        }
        
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

searchByTitle();
