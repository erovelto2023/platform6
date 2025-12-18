const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

async function fixUser() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        const clerkId = "user_36gkd1uS42SAnNsDE08y6yNe1RH";
        const result = await mongoose.connection.db.collection('users').updateOne(
            { clerkId: clerkId },
            {
                $set: {
                    aiSettings: {
                        provider: 'local',
                        defaultModel: 'deepseek-llm:latest'
                    }
                }
            }
        );

        console.log("Update result:", result);

    } catch (error) {
        console.error("Error:", error);
    } finally {
        await mongoose.disconnect();
    }
}

fixUser();
