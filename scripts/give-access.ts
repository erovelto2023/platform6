/**
 * Script to grant a user 'Student' tier access (paid features)
 * Usage: npx tsx scripts/give-access.ts <clerk_user_id>
 * Example: npx tsx scripts/give-access.ts user_37GTh884hQWHUvffv3RlsW2GAH4
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import { clerkClient } from '@clerk/nextjs/server';
import connectDB from '../lib/db/connect';
import User from '../lib/db/models/User';

async function giveAccess() {
    const clerkId = process.argv[2];

    if (!clerkId) {
        console.error('❌ Error: Please provide a Clerk User ID');
        console.log('Usage: npx tsx scripts/give-access.ts <clerk_user_id>');
        process.exit(1);
    }

    try {
        await connectDB();

        // 1. Update Clerk's publicMetadata
        console.log(`\n⏳ Updating Clerk data for user: ${clerkId}...`);
        const client = await clerkClient();
        
        try {
            await client.users.updateUser(clerkId, {
                publicMetadata: {
                    plan: 'student'
                }
            });
            console.log('✅ Clerk publicMetadata.plan updated to: "student"');
        } catch (clerkError: any) {
            console.error('❌ Error updating Clerk user. Make sure your CLERK_SECRET_KEY is valid.');
            console.error('   Error detail:', clerkError.message);
            process.exit(1);
        }

        // 2. Update local database
        const user = await User.findOne({ clerkId });

        if (user) {
            user.role = 'student';
            await user.save();
            console.log(`✅ Success! Database role updated for ${user.email} -> student`);
        } else {
            console.log(`⚠️  Warning: User not found in local database, but Clerk was updated.`);
        }

        console.log(`\n🎉 Done! User ${clerkId} now has access to all Student-tier features.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Unexpected error:', error);
        process.exit(1);
    }
}

giveAccess();
