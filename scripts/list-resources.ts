import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db/connect';
import Resource from '../lib/db/models/Resource';

async function listResources() {
    try {
        await connectDB();
        const resources = await Resource.find({}).limit(50);
        console.log('Images in DB:');
        resources.forEach(r => {
            console.log(JSON.stringify(r, null, 2));
        });
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

listResources();
