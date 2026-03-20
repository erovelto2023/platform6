import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

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

// Load environment variables
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// Helper function to create a URL-friendly slug
function createSlug(name: string, city: string, state: string) {
  const base = `${name} cpa ${city} ${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return base;
}

// Function to clean "Not publicly listed"
function cleanValue(val: string | undefined): string | undefined {
  if (!val) return undefined;
  const lower = val.toLowerCase().trim();
  if (lower === "not publicly listed" || lower === "none" || lower === "n/a" || lower === "" || lower === "null") {
    return undefined;
  }
  return val.trim();
}

async function main() {
  const args = process.argv.slice(2);
  const filePathArg = args[0];

  if (!filePathArg) {
    console.error(`❌ Usage: npx tsx scripts/import-enriched-cpas.ts <path/to/file.csv>`);
    process.exit(1);
  }

  const csvFilePath = path.resolve(process.cwd(), filePathArg);

  if (!fs.existsSync(csvFilePath)) {
    console.error(`❌ File not found: ${csvFilePath}`);
    process.exit(1);
  }

  console.log(`🚀 Starting Enriched CPA Import from: ${csvFilePath}`);

  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in .env.local");
    }

    await mongoose.connect(mongoUri);
    console.log("✅ Connected to MongoDB.");

    // Read and parse the CSV
    const fileContent = fs.readFileSync(csvFilePath, 'utf8');
    
    // Parse using csv-parse
    const records = parse(fileContent, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      relax_quotes: true,
    });

    console.log(`📄 Found ${records.length} records in CSV. Processing...`);

    let newCount = 0;
    let updateCount = 0;
    let errorCount = 0;

    for (let i = 0; i < records.length; i++) {
        const row = records[i] as any;
        
        try {
            // Data Mapping based on provided headers:
            // Firm_ID,Firm_Name,City,State,Address,Phone,Fax,Email,Website,Notes
            
            const rawName = row['Firm_Name'] || row['Name'];
            const rawCity = row['City'];
            const rawState = row['State'];
            const rawId = row['Firm_ID'] || row['License'];
            
            if (!rawName || !rawCity || !rawState) {
                console.warn(`⚠️ Skipped row ${i+1}: Missing required name/city/state.`);
                errorCount++;
                continue;
            }

            const cleanId = cleanValue(rawId)?.replace(/^#/, '');

            const mappedData = {
                name: rawName.trim(),
                isFirm: true,
                slug: createSlug(rawName, rawCity, rawState),
                city: rawCity.trim(),
                state: rawState.trim(),
                licenseNumber: cleanId,
                address: cleanValue(row['Address']),
                phone: cleanValue(row['Phone']),
                fax: cleanValue(row['Fax']),
                email: cleanValue(row['Email']),
                website: cleanValue(row['Website']),
                notes: cleanValue(row['Notes']),
            };

            // Remove undefined fields so we don't accidentally overwrite existing good data with undefined
            const updateData: any = {};
            for (const [key, value] of Object.entries(mappedData)) {
                if (value !== undefined) {
                    updateData[key] = value;
                }
            }

            // Find existing by License Number OR exact Name+City match
            const query: any = { $or: [] };
            
            if (cleanId) {
                query.$or.push({ licenseNumber: cleanId });
            }
            query.$or.push({ 
                name: { $regex: new RegExp(`^${escapeRegex(mappedData.name)}$`, 'i') }, 
                city: { $regex: new RegExp(`^${escapeRegex(mappedData.city)}$`, 'i') } 
            });

            const existingCpa = await CPAListing.findOne(query);

            if (existingCpa) {
                // Update
                await CPAListing.updateOne({ _id: existingCpa._id }, { $set: updateData });
                updateCount++;
            } else {
                // Insert
                await CPAListing.create(updateData);
                newCount++;
            }

        } catch (err: any) {
            console.error(`💥 Error processing row ${i+1} (${row['Firm_Name']}): ${err.message}`);
            errorCount++;
        }
    }

    console.log(`\n🎉 Import Complete!`);
    console.log(`✨ New CPAs Created: ${newCount}`);
    console.log(`🔄 Existing CPAs Updated: ${updateCount}`);
    if (errorCount > 0) console.log(`⚠️ Errors/Skipped: ${errorCount}`);

  } catch (error) {
    console.error("💥 Fatal error during import:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
    process.exit(0);
  }
}

// Helper to escape regex special characters in firm names
function escapeRegex(text: string) {
    return text.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&');
}

main();
