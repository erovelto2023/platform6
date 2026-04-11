import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function debug() {
  await mongoose.connect(process.env.MONGODB_URI as string);
  const db = mongoose.connection.db;
  const term = await db.collection('glossaryterms').findOne({ slug: 'acquisition-deals' });
  console.log(JSON.stringify(term, null, 2));
  process.exit(0);
}

debug();
