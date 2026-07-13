import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db/connect';
import Resource from '../lib/db/models/Resource';

async function migrate() {
    try {
        await connectDB();
        console.log("Connected to MongoDB.");

        // 1. Identify and update media assets
        const mediaUpdateResult = await Resource.updateMany(
            {
                $or: [
                    { originalFilename: { $exists: true, $ne: null } },
                    { storedFilename: { $exists: true, $ne: null } },
                    { mimeType: { $exists: true, $ne: null } }
                ]
            },
            {
                $set: { isMedia: true }
            }
        );

        console.log(`✅ Updated ${mediaUpdateResult.modifiedCount} media asset records to isMedia: true`);

        // 2. Identify and update standard downloadable resources
        const resourceUpdateResult = await Resource.updateMany(
            {
                isMedia: { $exists: false }
            },
            {
                $set: { isMedia: false }
            }
        );

        console.log(`✅ Updated ${resourceUpdateResult.modifiedCount} standard resources to isMedia: false`);

        console.log("Migration completed successfully.");
        process.exit(0);
    } catch (error) {
        console.error("Migration failed:", error);
        process.exit(1);
    }
}

migrate();
