const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const GlossaryTermSchema = new Schema({
    id: String,
    term: String,
    slug: String,
    amazonProducts: [{ name: String, url: String }]
}, { strict: false });

const GlossaryTerm = mongoose.models.GlossaryTerm || mongoose.model('GlossaryTerm', GlossaryTermSchema);

async function check() {
  await mongoose.connect('mongodb://localhost:27017/planova_db');
  const term = await GlossaryTerm.findOne({ slug: 'acquisition-deals' }).lean();
  if (term) {
    console.log('Term:', term.term);
    console.log('Amazon Products:', JSON.stringify(term.amazonProducts || [], null, 2));
  } else {
    console.log('Term not found in planova_db');
    const count = await GlossaryTerm.countDocuments();
    console.log('Total glossary terms:', count);
  }
  process.exit();
}

check();
