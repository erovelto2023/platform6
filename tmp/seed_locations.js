const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Use a more reliable way to find the URI or just use a default for local
const dbUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/platform6';

async function standaloneSeeder() {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(dbUri);
        console.log('Connected successfully.');

        // Define schema inside the script to avoid dependency issues in standalone run
        const LocationSchema = new mongoose.Schema({
            name: { type: String, required: true },
            slug: { type: String, required: true },
            type: { type: String, enum: ['state', 'city'], required: true },
            stateSlug: { type: String },
            description: { type: String },
            metaTitle: { type: String },
            metaDescription: { type: String }
        });

        // Ensure unique index for performance/correctness
        LocationSchema.index({ slug: 1, type: 1, stateSlug: 1 }, { unique: true });

        const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);

        const dataPath = path.join(process.cwd(), 'tmp', 'locations_data.json');
        if (!fs.existsSync(dataPath)) {
            console.error('Data file not found at:', dataPath);
            process.exit(1);
        }

        const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
        const states = Object.keys(data);
        
        console.log(`Starting bulk seed for ${states.length} states...`);

        const slugify = (text) => text
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-')
            .replace(/[^\w-]+/g, '')
            .replace(/--+/g, '-');

        for (const stateName of states) {
            const stateSlug = slugify(stateName);
            
            // Upsert State
            await Location.findOneAndUpdate(
                { slug: stateSlug, type: 'state' },
                { $set: { name: stateName, slug: stateSlug, type: 'state' } },
                { upsert: true, new: true }
            );

            const cities = data[stateName];
            console.log(`Processing ${stateName} (${cities.length} cities)...`);

            const cityOps = cities.map(cityName => {
                const citySlug = slugify(cityName);
                return {
                    updateOne: {
                        filter: { slug: citySlug, stateSlug: stateSlug, type: 'city' },
                        update: { $set: { name: cityName, slug: citySlug, type: 'city', stateSlug: stateSlug } },
                        upsert: true
                    }
                };
            });

            if (cityOps.length > 0) {
                const chunkSize = 500;
                for (let i = 0; i < cityOps.length; i += chunkSize) {
                    const chunk = cityOps.slice(i, i + chunkSize);
                    await Location.bulkWrite(chunk);
                }
            }
            console.log(`Finished ${stateName}`);
        }
        
        console.log('Seeding completed successfully.');
        process.exit(0);
    } catch (err) {
        console.error('Seeding failed:', err);
        process.exit(1);
    }
}

standaloneSeeder();
