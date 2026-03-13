
const mongoose = require('mongoose');
const fs = require('fs');

async function searchGlobal() {
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

        for (const col of collections) {
            const docs = await db.collection(col.name).find({}).toArray();
            for (const doc of docs) {
                const str = JSON.stringify(doc).toLowerCase();
                if (str.includes('paintball')) {
                    console.log(`FOUND "paintball" in collection: ${col.name}`);
                    console.log(`Document ID: ${doc._id}`);
                    console.log(`Preview:`, JSON.stringify(doc).substring(0, 200));
                }
            }
        }

        process.exit(0);
    } catch (err) {
        console.error('Search failed:', err);
        process.exit(1);
    }
}

searchGlobal();
