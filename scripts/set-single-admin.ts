import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env.local') });

import connectDB from '../lib/db/connect';
import User from '../lib/db/models/User';

async function setSingleAdmin() {
    await connectDB();
    const soleAdminEmail = "erovelto1@gmail.com";

    // 1. Demote all users to 'student'
    await User.updateMany({ email: { $ne: soleAdminEmail } }, { role: 'student' });

    // 2. Ensure erovelto1@gmail.com exists as sole admin
    let admin = await User.findOne({ email: soleAdminEmail });
    if (!admin) {
        admin = await User.create({
            clerkId: 'admin_erovelto1_sole',
            email: soleAdminEmail,
            firstName: 'Eric',
            lastName: 'Rovelto',
            role: 'admin',
            membershipStatus: 'active',
            username: 'erovelto1'
        });
        console.log('✅ Created sole admin account for:', soleAdminEmail);
    } else {
        admin.role = 'admin';
        admin.membershipStatus = 'active';
        await admin.save();
        console.log('✅ Promoted sole admin account for:', soleAdminEmail);
    }

    const all = await User.find({}).select('email role').lean();
    console.log('📋 Updated Database Roles:');
    console.log(all);
    process.exit(0);
}

setSingleAdmin();
