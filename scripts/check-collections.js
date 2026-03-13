
const mongoose = require('mongoose');
const fs = require('fs');

async function checkCollections() {
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
        const collections = await db.listCollections().toArray();
        console.log('Collections:', collections.map(c => c.name));

        for (const col of collections) {
            const count = await db.collection(col.name).countDocuments();
            console.log(`Collection ${col.name}: ${count} documents`);
            if (col.name.toLowerCase().includes('niche')) {
                const samples = await db.collection(col.name).find({}).limit(5).toArray();
                console.log(`Samples from ${col.name}:`, samples.map(s => s.nicheName || s.title || n.name || s._id));
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Check failed:', err);
        process.exit(1);
    }
}

checkCollections();
