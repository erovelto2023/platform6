import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import dbConnect from '../lib/dbConnect';
import { TemplateFamily, User } from '../models';
import mongoose from 'mongoose';

async function test() {
  try {
    await dbConnect();
    console.log("Connected to MongoDB.");

    // Find an admin user or any user to test with
    const dbUser = await User.findOne();
    if (!dbUser) {
      console.log("No user found in database.");
      return;
    }
    console.log("Found user:", dbUser.email, "role:", dbUser.role);

    const userId = dbUser._id;

    const query: any = {
      $or: [
        { isSystem: true },
        { userId: userId }
      ]
    };

    const { StoryTemplate } = require('../models');
    console.log("Querying families with query:", query);
    const families = await TemplateFamily.find(query).sort({ name: 1 }).lean();
    console.log("Found families count:", families.length);
    
    for (let f of families) {
      f.templateCount = await StoryTemplate.countDocuments({ familyId: f._id });
      console.log(`- Family: ${f.name}, templates: ${f.templateCount}`);
    }
    
    console.log("TEST SUCCESSFUL!");
  } catch (error: any) {
    console.error("TEST FAILED:", error);
  }
  process.exit(0);
}

test();
