import dotenv from 'dotenv';
import path from 'path';

// Load .env.local from project root
const envPath = path.resolve(process.cwd(), '.env.local');
console.log(`Loading env from ${envPath}`);
dotenv.config({ path: envPath });

import mongoose from 'mongoose';
import connectToDatabase from '../lib/db/connect';
import Tool from '../lib/db/models/Tool';
import { tools } from '../app/(dashboard)/tools/pdf-suite/_config/tools';
import { toolContentEn } from '../app/(dashboard)/tools/pdf-suite/_config/tool-content/en';

async function seed() {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error("MONGODB_URI is missing from .env.local");
        }

        console.log("Connecting to DB...");
        await connectToDatabase();
        console.log("Connected to MongoDB.");

        console.log(`Found ${tools.length} tools to seed.`);

        let successCount = 0;
        let errorCount = 0;

        for (const toolConfig of tools) {
            try {
                const content = toolContentEn[toolConfig.id];
                if (!content) {
                    console.warn(`Warning: No content found for tool ${toolConfig.id}`);
                }

                const toolData = {
                    name: content?.title || toolConfig.id, // Fallback to ID if no title
                    slug: toolConfig.slug,
                    description: content?.metaDescription || "",
                    icon: toolConfig.icon,
                    path: `/tools/pdf-suite/${toolConfig.slug}`,
                    category: toolConfig.category || "General",
                    isEnabled: true,
                    // Additional fields based on model schema
                };

                // Upsert tool
                await Tool.findOneAndUpdate(
                    { slug: toolConfig.slug },
                    toolData,
                    { upsert: true, new: true, setDefaultsOnInsert: true }
                );

                process.stdout.write('.');
                successCount++;
            } catch (err) {
                console.error(`\nError seeding ${toolConfig.id}:`, err);
                errorCount++;
            }
        }

        console.log(`\nSeeding complete. Success: ${successCount}, Errors: ${errorCount}`);
        process.exit(0);
    } catch (error) {
        console.error("\nFatal Error:", error);
        process.exit(1);
    }
}

seed();
