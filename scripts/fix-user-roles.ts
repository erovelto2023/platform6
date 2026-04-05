/**
 * Script to ensure all users have a role field set
 * This will update any users missing the role field to 'student'
 * Usage: npx tsx scripts/fix-user-roles.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db/connect';
import User from '../lib/db/models/User';

async function fixUserRoles() {
    try {
        await connectDB();

        // Find all users
        const allUsers = await User.find({});

        console.log(`\n📋 Found ${allUsers.length} users in database\n`);
        console.log('─'.repeat(80));

        let updatedCount = 0;
        let adminCount = 0;
        let studentCount = 0;
        let freeCount = 0;

        for (const user of allUsers) {
            const roleIcon = user.role === 'admin' ? '👑' : user.role === 'student' ? '🎓' : user.role === 'free' ? '👤' : '❓';
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';

            console.log(`${roleIcon} ${user.email}`);
            console.log(`   Name: ${name}`);
            console.log(`   Current Role: ${user.role || 'MISSING'}`);

            // If role is missing or invalid, set to free
            if (!user.role || (user.role !== 'admin' && user.role !== 'student' && user.role !== 'free')) {
                user.role = 'free';
                await user.save();
                console.log(`   ✅ Updated to: free`);
                updatedCount++;
            }

            if (user.role === 'admin') adminCount++;
            if (user.role === 'student') studentCount++;
            if (user.role === 'free') freeCount++;

            console.log('─'.repeat(80));
        }

        console.log(`\n📊 Summary:`);
        console.log(`   Total Users: ${allUsers.length}`);
        console.log(`   👑 Admins: ${adminCount}`);
        console.log(`   🎓 Students: ${studentCount}`);
        console.log(`   👤 Free: ${freeCount}`);
        console.log(`   ✅ Updated: ${updatedCount}`);

        if (updatedCount > 0) {
            console.log(`\n✅ Successfully updated ${updatedCount} user(s) with missing roles`);
        } else {
            console.log(`\n✅ All users already have valid roles`);
        }

        console.log(`\n💡 Tip: Run 'npm run make-admin <email>' to promote a user to admin\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing user roles:', error);
        process.exit(1);
    }
}

fixUserRoles();
