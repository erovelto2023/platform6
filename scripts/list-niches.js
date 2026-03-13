
const mongoose = require('mongoose');
const fs = require('fs');

async function listAll() {
    try {
        const env = fs.readFileSync('.env.local', 'utf8');
        const envVars = {};
        env.split('\n').forEach(line => {
            const [k, v] = line.split('=');
            if (k && v) envVars[k.trim()] = v.trim().replace(/'/g, '').replace(/"/g, '');
        });

        const MONGODB_URI = envVars.MONGODB_URI;
        if (!MONGODB_URI) throw new Error('MONGODB_URI not found');

        await mongoose.connect(MONGODB_URI);
        console.log('Connected to DB');

        const NicheBox = mongoose.models.NicheBox || mongoose.model('NicheBox', new mongoose.Schema({}, { strict: false }));

        const niches = await NicheBox.find({});
        console.log(`Total niches found: ${niches.length}`);
        
        niches.forEach((n, i) => {
            console.log(`\nNiche ${i + 1}:`);
            console.log(`ID: ${n._id}`);
            console.log(`nicheName: ${n.nicheName}`);
            console.log(`title: ${n.title}`);
            console.log(`nicheSlug: ${n.nicheSlug}`);
            console.log(`slug: ${n.slug}`);
            console.log(`status: ${n.status}`);
            console.log(`createdBy: ${n.createdBy}`);
        });

        process.exit(0);
    } catch (err) {
        console.error('Listing failed:', err);
        process.exit(1);
    }
}

listAll();
