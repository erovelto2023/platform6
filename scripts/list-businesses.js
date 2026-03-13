
const mongoose = require('mongoose');
const fs = require('fs');

async function listBusinesses() {
    try {
        const env = fs.readFileSync('.env.local', 'utf8');
        const envVars = {};
        env.split('\n').forEach(line => {
            const [k, v] = line.split('=');
            if (k && v) envVars[k.trim()] = v.trim().replace(/'/g, '').replace(/"/g, '');
        });

        const MONGODB_URI = envVars.MONGODB_URI;
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const db = mongoose.connection.db;
        const businesses = await db.collection('businesses').find({}).toArray();
        console.log(`Total businesses found: ${businesses.length}`);
        
        businesses.forEach((b, i) => {
            console.log(`\nBusiness ${i + 1}:`);
            console.log(`ID: ${b._id}`);
            console.log(`name: ${b.name}`);
            console.log(`slug: ${b.slug}`);
            console.log(`createdBy: ${b.createdBy}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Listing failed:', err);
        process.exit(1);
    }
}

listBusinesses();
