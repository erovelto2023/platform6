/**
 * Script to grant a user 'Student' tier access (paid features)
 * Usage: npx tsx scripts/give-access.ts <clerk_user_id>
 * Example: npx tsx scripts/give-access.ts user_37GTh884hQWHUvffv3RlsW2GAH4
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
const envPath = resolve(process.cwd(), '.env.local');
const result = config({ path: envPath });

if (result.error) {
    console.error('❌ Error loading .env.local:', result.error.message);
} else {
    console.log(`✅ Loaded variables from ${envPath}`);
}

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
        // Debug environment
        const clerkKeys = Object.keys(process.env).filter(k => k.startsWith('CLERK'));
        console.log(`🔍 Environment Check: Found ${clerkKeys.length} Clerk-related keys.`);

        // Ensure CLERK_SECRET_KEY is present
        if (!process.env.CLERK_SECRET_KEY && process.env.CLERK_API_KEY) {
            process.env.CLERK_SECRET_KEY = process.env.CLERK_API_KEY;
            console.log('💡 Using CLERK_API_KEY as fallback');
        }

        if (!process.env.CLERK_SECRET_KEY) {
            console.error('❌ Error: CLERK_SECRET_KEY is missing from environment.');
            console.log('   Please check your .env.local for CLERK_SECRET_KEY.');
            process.exit(1);
        }

        await connectDB();

        // 1. Update Clerk's publicMetadata using dynamic import to ensure ENV is ready
        console.log(`\n⏳ Updating Clerk data for user: ${clerkId}...`);
        
        try {
            const { clerkClient } = await import('@clerk/nextjs/server');
            const client = await clerkClient();
            
            await client.users.updateUser(clerkId, {
                publicMetadata: {
                    plan: 'student'
                }
            });
            console.log('✅ Clerk publicMetadata.plan updated to: "student"');
        } catch (clerkError: any) {
            console.error('❌ Clerk API Error:');
            console.error('   ' + (clerkError.message || clerkError));
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
