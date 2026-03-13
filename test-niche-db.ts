import { config } from 'dotenv';
config({ path: '.env.local' });

import mongoose from 'mongoose';
import NicheBox from './lib/db/models/NicheBox';

async function test() {
  console.log('Testing NicheBox DB connection and query...');
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('No MONGODB_URI in .env.local');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected. Querying...');
    
    const query = {};
    const niches = await NicheBox.find(query).sort({ createdAt: -1 }).lean();
    console.log(`Success! Found ${niches.length} niches.`);
  } catch (e) {
    console.error('Error encountered:', e);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

test();
