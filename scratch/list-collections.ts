import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import connectDB from '../lib/db/connect';
import mongoose from 'mongoose';

async function main() {
  try {
    await connectDB();
    console.log("Connected to MongoDB.");

    const db = mongoose.connection.db;
    if (!db) {
      console.log("No database object found.");
      return;
    }
    const collections = await db.listCollections().toArray();
    console.log("Collections and counts:");
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`- ${col.name}: ${count} documents`);
    }
  } catch (error) {
    console.error("ERROR listing collections:", error);
  }
  process.exit(0);
}

main();
