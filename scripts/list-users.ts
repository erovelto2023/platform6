/**
 * Script to list all users and their roles
 * Usage: npx tsx scripts/list-users.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables from .env.local
config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db/connect';
import User from '../lib/db/models/User';

async function listUsers() {
    try {
        await connectDB();

        const users = await User.find({}).select('email firstName lastName role createdAt').sort({ createdAt: -1 });

        if (users.length === 0) {
            console.log('No users found in the database');
            process.exit(0);
        }

        console.log(`\n📋 Total Users: ${users.length}\n`);
        console.log('─'.repeat(80));

        users.forEach((user, index) => {
            const roleIcon = user.role === 'admin' ? '👑' : '👤';
            const name = `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'N/A';

            console.log(`${index + 1}. ${roleIcon} ${user.email}`);
            console.log(`   Name: ${name}`);
            console.log(`   Role: ${user.role}`);
            console.log(`   Created: ${user.createdAt?.toLocaleDateString() || 'N/A'}`);
            console.log('─'.repeat(80));
        });

        const adminCount = users.filter(u => u.role === 'admin').length;
        const studentCount = users.filter(u => u.role === 'student').length;

        console.log(`\n📊 Summary:`);
        console.log(`   👑 Admins: ${adminCount}`);
        console.log(`   👤 Students: ${studentCount}\n`);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error listing users:', error);
        process.exit(1);
    }
}

listUsers();
