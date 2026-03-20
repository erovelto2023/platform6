import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CPAListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firmName: { type: String },
  licenseNumber: { type: String },
  jurisdiction: { type: String },
  licenseStatus: { type: String },
  address: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String },
  phone: { type: String },
  fax: { type: String },
  website: { type: String },
  email: { type: String },
  services: { type: [String], default: [] },
  notes: { type: String },
  isFirm: { type: Boolean, default: false },
  slug: { type: String, required: true },
  boardUrl: { type: String },
}, { timestamps: true });

const CPAListing = mongoose.models.CPAListing || mongoose.model("CPAListing", CPAListingSchema);

// ─── ENRICHED CPA DATA ───────────────────────────────────────────────────────
// Add new rows here as you collect more data. Each entry uses the firm's
// licenseNumber to find the existing record (if any) and update it.
// Fields left as undefined will NOT overwrite existing data.
const enrichedData = [
  {
    licenseNumber: "6090",
    name: "Warren Averett, LLC",
    city: "Birmingham",
    state: "AL",
    address: "2500 Acton Rd #200, Birmingham, AL 35243",
    phone: "(205) 979-4100",
    fax: "(205) 979-6313",
    email: "contact@warrenaverett.com",
    website: "https://warrenaverett.com",
    notes: "Verified via firm website and multiple business directories. Primary contact: Brooke Booth (brooke.booth@warrenaverett.com).",
    isFirm: true,
  },
  {
    licenseNumber: "4045",
    name: "Jackie G. U. Hobbs, CPA",
    city: "Huntsville",
    state: "AL",
    address: undefined,
    phone: undefined,
    fax: undefined,
    email: undefined,
    website: undefined,
    notes: "Limited public web presence. LinkedIn profile exists but lists Seattle, WA location. Official license record maintained by Alabama State Board of Public Accountancy.",
    isFirm: false,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function createSlug(name: string, city: string, state: string) {
  return `${name} cpa ${city} ${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env.local");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB.");

  let updated = 0;
  let created = 0;

  for (const firm of enrichedData) {
    // Build the update — skip undefined fields so we don't erase good data
    const update: Record<string, any> = {};
    const fields: (keyof typeof firm)[] = ['name', 'city', 'state', 'address', 'phone', 'fax', 'email', 'website', 'notes', 'isFirm'];
    for (const key of fields) {
      if (firm[key] !== undefined) update[key] = firm[key];
    }

    // Try to find by licenseNumber first, then fall back to name+city
    const query: any = { $or: [] };
    if (firm.licenseNumber) query.$or.push({ licenseNumber: firm.licenseNumber });
    query.$or.push({
      name: new RegExp(`^${firm.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      city: new RegExp(`^${firm.city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });

    const existing = await CPAListing.findOne(query);

    if (existing) {
      await CPAListing.updateOne({ _id: existing._id }, { $set: update });
      console.log(`🔄 Updated: ${firm.name}`);
      updated++;
    } else {
      // Create a new record
      const slug = createSlug(firm.name, firm.city, firm.state);
      await CPAListing.create({ ...update, licenseNumber: firm.licenseNumber, slug });
      console.log(`✨ Created: ${firm.name}`);
      created++;
    }
  }

  console.log(`\n🎉 Done! Created: ${created} | Updated: ${updated}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
