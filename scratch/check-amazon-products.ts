import mongoose from 'mongoose';
import GlossaryTerm from './lib/db/models/GlossaryTerm.js';

async function check() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/platform6');
  const term = await GlossaryTerm.findOne({ slug: 'acquisition-deals' }).lean();
  console.log('Term:', term.term);
  console.log('Amazon Products:', term.amazonProducts);
  process.exit();
}

check();
