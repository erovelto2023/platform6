/**
 * Script to promote a user to admin role
 * Usage: npx tsx scripts/make-admin.ts <email>
 * Example: npx tsx scripts/make-admin.ts admin@example.com
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db/connect';
import User from '../lib/db/models/User';

async function makeAdmin() {
    const email = process.argv[2];

    if (!email) {
        console.error('❌ Error: Please provide an email address');
        console.log('Usage: npx tsx scripts/make-admin.ts <email>');
        process.exit(1);
    }

    try {
        await connectDB();

        const user = await User.findOne({ email });

        if (!user) {
            console.error(`❌ Error: User with email "${email}" not found`);
            process.exit(1);
        }

        if (user.role === 'admin') {
            console.log(`ℹ️  User "${email}" is already an admin`);
            process.exit(0);
        }

        user.role = 'admin';
        await user.save();

        console.log(`✅ Success! User "${email}" has been promoted to admin`);
        console.log(`   Name: ${user.firstName} ${user.lastName}`);
        console.log(`   Role: ${user.role}`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error promoting user to admin:', error);
        process.exit(1);
    }
}

makeAdmin();
