/**
 * Database Migration Script
 * Run this after deployment to update existing data
 * 
 * Usage: node scripts/migrate-database.js
 */

import connectDB from "../lib/db/connect.js";
import WebPage from "../lib/db/models/WebPage.js";
import User from "../lib/db/models/User.js";

async function migrateDatabase() {
    try {
        console.log("🔄 Starting database migration...");

        await connectDB();
        console.log("✅ Connected to database");

        // Example 1: Add new fields to existing documents
        console.log("📝 Adding SEO fields to pages without them...");
        const result1 = await WebPage.updateMany(
            { metaTitle: { $exists: false } },
            {
                $set: {
                    metaTitle: "",
                    metaDescription: "",
                    ogTitle: "",
                    ogDescription: "",
                    ogImage: "",
                    twitterTitle: "",
                    twitterDescription: "",
                    twitterImage: "",
                    keywords: "",
                    canonicalUrl: ""
                }
            }
        );
        console.log(`✅ Updated ${result1.modifiedCount} pages with SEO fields`);

        // Example 2: Add order field to sections
        console.log("📝 Adding order to sections...");
        const pages = await WebPage.find({});
        let updatedPages = 0;

        for (const page of pages) {
            let needsUpdate = false;
            const sections = page.sections.map((section, index) => {
                if (section.order === undefined) {
                    needsUpdate = true;
                    return { ...section.toObject(), order: index };
                }
                return section;
            });

            if (needsUpdate) {
                page.sections = sections;
                await page.save();
                updatedPages++;
            }
        }
        console.log(`✅ Updated ${updatedPages} pages with section order`);

        // Example 3: Create indexes
        console.log("📝 Creating indexes...");
        await WebPage.createIndexes();
        await User.createIndexes();
        console.log("✅ Indexes created");

        // Example 4: Clean up old data
        console.log("📝 Cleaning up old data...");
        const result2 = await WebPage.deleteMany({
            isPublished: false,
            updatedAt: { $lt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) } // 90 days old
        });
        console.log(`✅ Deleted ${result2.deletedCount} old draft pages`);

        console.log("🎉 Migration completed successfully!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Migration failed:", error);
        process.exit(1);
    }
}

migrateDatabase();
