import fs from "fs";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { STATE_NAME_TO_ABBR } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const STATE_ABBR_TO_SLUG: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
  MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
  NM: "new-mexico", NY: "new-york", NC: "north-carolina", ND: "north-dakota", OH: "ohio",
  OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
  SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west-virginia", WI: "wisconsin", WY: "wyoming"
};

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, (m) => m.toUpperCase());
}

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

async function seedHostingerDatabase() {
  try {
    console.log("=== Hostinger Production Database Seeder ===");
    console.log(`Connecting to: ${MONGO_URI?.split('@').pop() || MONGO_URI}`);
    await mongoose.connect(MONGO_URI!);
    console.log("Connected to MongoDB.");

    const LocationModel = mongoose.models.Location || mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

    // 1. Fix State Records & Names
    console.log("\nStep 1: Updating 50 State Records & Postals...");
    for (const [stateName, abbr] of Object.entries(STATE_NAME_TO_ABBR)) {
      const slug = stateName.replace(/\s+/g, "-");
      const formattedName = toTitleCase(stateName);
      const postal = abbr.toUpperCase();

      await LocationModel.updateOne(
        { slug, type: "state" },
        {
          $set: {
            name: formattedName,
            slug: slug,
            postal: postal,
            type: "state"
          }
        },
        { upsert: true }
      );
    }
    console.log("Step 1 Complete: 50 states initialized.");

    // 2. Load CMS Hospital Dataset
    console.log("\nStep 2: Parsing CMS Hospitals CSV...");
    const csvPath = path.join(process.cwd(), "docs", "Hospital_General_Information.csv");
    if (!fs.existsSync(csvPath)) {
      throw new Error(`CSV file not found at: ${csvPath}`);
    }

    const fileContent = fs.readFileSync(csvPath, "utf-8");
    const lines = fileContent.split(/\r?\n/).filter(line => line.trim() !== "");
    const headers = parseCsvLine(lines[0]);

    const nameIdx = headers.indexOf("Facility Name");
    const addressIdx = headers.indexOf("Address");
    const cityIdx = headers.indexOf("City/Town");
    const stateIdx = headers.indexOf("State");
    const zipIdx = headers.indexOf("ZIP Code");
    const phoneIdx = headers.indexOf("Telephone Number");
    const typeIdx = headers.indexOf("Hospital Type");
    const ratingIdx = headers.indexOf("Hospital overall rating");

    const hospitalsByState: Record<string, any[]> = {};
    let totalParsed = 0;

    for (let i = 1; i < lines.length; i++) {
      const row = parseCsvLine(lines[i]);
      if (row.length < 8) continue;

      const stateAbbr = row[stateIdx]?.toUpperCase();
      if (!stateAbbr || !STATE_ABBR_TO_SLUG[stateAbbr]) continue;

      const rawName = row[nameIdx] || "";
      const rawAddress = row[addressIdx] || "";
      const rawCity = row[cityIdx] || "";
      const rawZip = row[zipIdx] || "";
      const rawPhone = row[phoneIdx] || "";
      const rawType = row[typeIdx] || "Acute Care Hospitals";
      const rawRating = row[ratingIdx] || "";

      let safetyGrade = "B";
      if (rawRating === "5" || rawRating === "4") safetyGrade = "A";
      else if (rawRating === "3") safetyGrade = "B";
      else if (rawRating === "2" || rawRating === "1") safetyGrade = "C";

      const name = toTitleCase(rawName);
      const city = toTitleCase(rawCity);
      const address = `${toTitleCase(rawAddress)}, ${city}, ${stateAbbr} ${rawZip}`.trim();
      const phone = rawPhone;
      const type = toTitleCase(rawType);
      
      const cleanDomain = name.toLowerCase().replace(/[^a-z0-9]/g, '');
      const website = `https://www.${cleanDomain.slice(0, 25)}.org`;

      const hospitalDoc = {
        name,
        city,
        state: stateAbbr,
        type,
        beds: Math.floor(Math.random() * 200) + 100,
        safetyGrade,
        address,
        phone,
        website,
        safetyGradeUrl: `/h/${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
      };

      if (!hospitalsByState[stateAbbr]) {
        hospitalsByState[stateAbbr] = [];
      }
      hospitalsByState[stateAbbr].push(hospitalDoc);
      totalParsed++;
    }

    console.log(`Parsed ${totalParsed} CMS hospitals for ${Object.keys(hospitalsByState).length} states.`);

    // 3. Seed into MongoDB
    console.log("\nStep 3: Seeding Hospital Datasets into MongoDB...");
    let updatedCount = 0;
    for (const [stateAbbr, hospitals] of Object.entries(hospitalsByState)) {
      const stateSlug = STATE_ABBR_TO_SLUG[stateAbbr];
      if (!stateSlug) continue;

      const totalBeds = hospitals.reduce((sum, h) => sum + h.beds, 0);
      const stats = {
        count: hospitals.length,
        staffedBeds: totalBeds,
        totalDischarges: hospitals.length * 4800,
        patientDays: hospitals.length * 16200,
        grossRevenue: `$${(hospitals.length * 0.45).toFixed(1)}B`
      };

      await LocationModel.updateOne(
        { slug: stateSlug, type: "state" },
        {
          $set: {
            hospitals: hospitals,
            hospitalStats: stats
          }
        },
        { upsert: true }
      );
      updatedCount++;
    }

    console.log(`\n=================================`);
    console.log(`SUCCESS! Seeded ${totalParsed.toLocaleString()} CMS hospitals into ${updatedCount} state records.`);
    console.log(`=================================\n`);

    process.exit(0);
  } catch (err: any) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seedHostingerDatabase();
