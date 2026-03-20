import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { parse } from 'csv-parse/sync';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

interface WARecord {
  "Firm.Name": string;
  "City": string;
  "State": string;
  "Firm.Number": string;
}

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
  website: { type: String },
  email: { type: String },
  services: { type: [String], default: [] },
  isFirm: { type: Boolean, default: false },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true });

const CPAListing = mongoose.models.CPAListing || mongoose.model("CPAListing", CPAListingSchema);

async function importWACPAs() {
  console.log("🚀 Starting Washington CPA Import (Self-Contained)...");
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI not found in .env.local");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB established.");

    const csvPath = path.resolve(process.cwd(), "excel", "wa-cpas.csv");
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV not found at ${csvPath}`);
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const records = parse(fileContent.trim(), {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_column_count: true
    }) as WARecord[];

    console.log(`📊 Found ${records.length} records in CSV.`);
    
    if (records.length > 0) {
      console.log("📝 Sample Headers:", Object.keys(records[0]));
    }

    let importedCount = 0;
    let skippedCount = 0;

    for (const record of records) {
      const firmName = record["Firm.Name"] || "Unknown Firm";
      const city = record["City"] || "Unknown";
      const state = record["State"] || "WA";
      const licenseNum = record["Firm.Number"];

      if (!firmName || firmName === "Firm.Name") {
         skippedCount++;
         continue;
      }

      const baseSlug = slugify(`${state}-${city}-${firmName}`);
      
      const existing = await CPAListing.findOne({ slug: baseSlug });
      if (existing) {
        skippedCount++;
        continue;
      }

      await CPAListing.create({
        name: firmName,
        firmName: firmName,
        licenseNumber: licenseNum,
        jurisdiction: "Washington",
        licenseStatus: "Active",
        city: city,
        state: state,
        isFirm: true,
        slug: baseSlug,
      });

      importedCount++;
      if (importedCount % 500 === 0) {
        console.log(`✅ Progress: ${importedCount} records imported...`);
      }
    }

    console.log(`\n🎉 Import Complete!`);
    console.log(`✅ Total Imported: ${importedCount}`);
    console.log(`⏭️ Total Skipped: ${skippedCount}`);

  } catch (error) {
    console.error("💥 Error during import:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

importWACPAs();
