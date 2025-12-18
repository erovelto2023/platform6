/**
 * Seed Templates to Database
 * Run this to populate templates in production
 * 
 * Usage: node scripts/seed-templates.js
 */

const mongoose = require('mongoose');

// Template Schema
const TemplateSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    componentType: { type: String, required: true },
    defaultContent: { type: Object, default: {} },
    defaultStyle: { type: Object, default: {} },
    thumbnail: String,
    isPremium: { type: Boolean, default: false },
    description: String,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

const Template = mongoose.models.Template || mongoose.model('Template', TemplateSchema);

// Import templates from constants
async function seedTemplates() {
    try {
        console.log('🌱 Starting template seeding...');

        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI;
        if (!MONGODB_URI) {
            throw new Error('MONGODB_URI not found in environment variables');
        }

        await mongoose.connect(MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        // Import the templates
        const { defaultTemplates } = await import('../lib/constants/page-builder-templates.ts');
        const { pageTemplates } = await import('../lib/constants/page-templates.ts');

        console.log(`📦 Found ${defaultTemplates.length} section templates`);
        console.log(`📦 Found ${pageTemplates.length} page templates`);

        // Clear existing templates (optional - comment out to keep existing)
        // await Template.deleteMany({});
        // console.log('🗑️  Cleared existing templates');

        // Insert section templates
        let insertedCount = 0;
        let updatedCount = 0;

        for (const template of defaultTemplates) {
            try {
                const existing = await Template.findOne({ id: template.id });
                if (existing) {
                    await Template.updateOne(
                        { id: template.id },
                        {
                            $set: {
                                ...template,
                                updatedAt: new Date()
                            }
                        }
                    );
                    updatedCount++;
                } else {
                    await Template.create(template);
                    insertedCount++;
                }
            } catch (error) {
                console.error(`❌ Error with template ${template.id}:`, error.message);
            }
        }

        console.log(`✅ Inserted ${insertedCount} new templates`);
        console.log(`✅ Updated ${updatedCount} existing templates`);

        // Create indexes
        await Template.createIndexes();
        console.log('✅ Created indexes');

        console.log('🎉 Template seeding completed successfully!');

        // Show summary
        const totalTemplates = await Template.countDocuments();
        const categories = await Template.distinct('category');

        console.log('\n📊 Summary:');
        console.log(`   Total templates: ${totalTemplates}`);
        console.log(`   Categories: ${categories.join(', ')}`);

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}

seedTemplates();
