import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import connectDB from '../lib/db/connect';
import User from '../lib/db/models/User';

async function main() {
  try {
    console.log("Connecting to DB...");
    await connectDB();
    console.log("Connected. Querying user...");
    const user = await User.findOne({ clerkId: 'user_3Bj6dEmUZDloX8iV0KxAgq1PIMS' });
    console.log("User query successful:", user);
  } catch (error) {
    console.error("ERROR QUERYING USER:", error);
  }
  process.exit(0);
}

main();
