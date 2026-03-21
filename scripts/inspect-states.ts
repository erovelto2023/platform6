import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Location from '../lib/db/models/Location';

dotenv.config({ path: '.env.local' });

async function run() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const state = await (Location as any).findOne({ type: 'state' });
  console.log("State Sample:", JSON.stringify(state, null, 2));
  
  const allStatePostals = await (Location as any).distinct('postal', { type: 'state' });
  console.log("All State Postals:", allStatePostals);

  const allStateNames = await (Location as any).distinct('name', { type: 'state' });
  console.log("All State Names:", allStateNames);

  process.exit(0);
}

run();
