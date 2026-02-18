const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    username: String,
    clerkId: String,
    email: String,
    role: String,
    profileImage: String,
    onboardingCompleted: { type: Boolean, default: true }
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', UserSchema);

const TEST_USERS = [
    {
        firstName: "Mark",
        lastName: "Twain",
        username: "marktwain",
        clerkId: "mock_mark_twain",
        email: "mark@example.com",
        role: "student",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mark"
    },
    {
        firstName: "Alice",
        lastName: "Smith",
        username: "alicesmith",
        clerkId: "mock_alice_smith",
        email: "alice@example.com",
        role: "student",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alice"
    },
    {
        firstName: "Bob",
        lastName: "Johnson",
        username: "bobjohnson",
        clerkId: "mock_bob_johnson",
        email: "bob@example.com",
        role: "student",
        profileImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bob"
    }
];

async function seed() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to DB");

        for (const userData of TEST_USERS) {
            const existing = await User.findOne({ username: userData.username });
            if (!existing) {
                await User.create(userData);
                console.log(`Created user: ${userData.firstName} ${userData.lastName}`);
            } else {
                console.log(`User already exists: ${userData.username}`);
            }
        }

        console.log("Seeding completed!");
    } catch (err) {
        console.error("Seeding failed:", err);
    } finally {
        mongoose.connection.close();
        process.exit(0);
    }
}

seed();
