const mongoose = require('mongoose');

// Load env vars
require('dotenv').config({ path: '.env.local' });

async function listUsers() {
    if (!process.env.MONGODB_URI) {
        console.error("MONGODB_URI not found in .env.local");
        return;
    }

    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const users = await mongoose.connection.db.collection('users').find({}).limit(5).toArray();
        console.log("Users found:", users.length);
        users.forEach(u => {
            console.log(`- ID: ${u._id}, ClerkID: ${u.clerkId}, AI Settings:`, u.aiSettings);
        });

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

listUsers();
