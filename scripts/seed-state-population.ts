import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import Location from '../lib/db/models/Location';

dotenv.config({ path: '.env.local' });

interface PopulationRecord {
  State: string;
  Year: string;
  'Total Population': string;
  'Population 0-4': string;
  'Population 5-17': string;
  'Population 18-24': string;
  'Population 25-44': string;
  'Population 45-64': string;
  'Population 65+': string;
  'Population Under 18': string;
  'Population 18-54': string;
  'Population 55+': string;
  'Male Population': string;
  'Female Population': string;
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env.local");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB.");

  const csvPath = path.join(process.cwd(), 'excel', 'Population by Age and Sex - EDDs.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as PopulationRecord[];

  console.log(`📊 Loaded ${records.length} records from CSV.`);

  const stateData: Record<string, any> = {};
  const targetYear = '2024';

  for (const record of records) {
    if (record.Year !== targetYear) continue;

    const stateAbbr = record.State;
    if (!stateData[stateAbbr]) {
      stateData[stateAbbr] = {
        total: 0,
        male: 0,
        female: 0,
        age0to4: 0,
        age5to17: 0,
        age18to24: 0,
        age25to44: 0,
        age45to64: 0,
        age65plus: 0,
        ageUnder18: 0,
        age18plus: 0,
        age18to54: 0,
        age55plus: 0,
      };
    }

    const s = stateData[stateAbbr];
    const parseNum = (val: string) => parseInt(val?.replace(/,/g, '') || '0') || 0;

    s.total += parseNum(record['Total Population']);
    s.male += parseNum(record['Male Population']);
    s.female += parseNum(record['Female Population']);
    s.age0to4 += parseNum(record['Population 0-4']);
    s.age5to17 += parseNum(record['Population 5-17']);
    s.age18to24 += parseNum(record['Population 18-24']);
    s.age25to44 += parseNum(record['Population 25-44']);
    s.age45to64 += parseNum(record['Population 45-64']);
    s.age65plus += parseNum(record['Population 65+']);
    s.ageUnder18 += parseNum(record['Population Under 18']);
    s.age18to54 += parseNum(record['Population 18-54']);
    s.age55plus += parseNum(record['Population 55+']);
    
    // Calculate 18+
    s.age18plus = s.total - s.ageUnder18;
  }

  const stateAbbrToName: Record<string, string> = {
    AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California",
    CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia",
    HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa",
    KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland",
    MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri",
    MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey",
    NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio",
    OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina",
    SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont",
    VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming",
    PR: "Puerto Rico"
  };

  let updatedCount = 0;
  for (const stateAbbr of Object.keys(stateData)) {
    const data = stateData[stateAbbr];
    const stateName = stateAbbrToName[stateAbbr];

    if (!stateName) {
      console.warn(`⚠️ No mapping found for abbreviation: ${stateAbbr}`);
      continue;
    }

    // Find state by name
    const result = await (Location as any).updateOne(
      { type: 'state', name: stateName },
      { $set: { detailedPopulation: data, postal: stateAbbr } }
    );

    if (result.modifiedCount > 0) {
      console.log(`✅ Updated population and postal for ${stateName} (${stateAbbr})`);
      updatedCount++;
    } else {
      // Check if it exists at all
      const exists = await (Location as any).findOne({ type: 'state', name: stateName });
      if (exists) {
        console.log(`ℹ️ Population for ${stateName} already up to date or unchanged.`);
      } else {
        console.warn(`⚠️ State ${stateName} (${stateAbbr}) not found in database.`);
      }
    }
  }

  console.log(`\n🎉 Done! Updated ${updatedCount} states.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error("💥 Error:", err);
  process.exit(1);
});
