import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse/sync';
import dotenv from 'dotenv';
import Location from '../lib/db/models/Location';

dotenv.config({ path: '.env.local' });

interface RaceRecord {
  IBRC_Geo_ID: string;
  Statefips: string;
  Countyfips: string;
  Description: string;
  Year: string;
  'Total Population': string;
  'White Alone': string;
  'Black or African American Alone': string;
  'American Indian and Alaska Native Alone': string;
  'Asian Alone': string;
  'Native Hawaiian and Other Pacific Islander Alone': string;
  'Two or More Races': string;
  'Not Hispanic': string;
  Hispanic: string;
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env.local");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB.");

  const csvPath = path.join(process.cwd(), 'excel', 'Population by Race - US, States, Counties.csv');
  const fileContent = fs.readFileSync(csvPath, 'utf-8');

  const records = parse(fileContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as RaceRecord[];

  console.log(`📊 Loaded ${records.length} records from CSV.`);

  const targetYear = '2024';
  let updatedCount = 0;

  for (const record of records) {
    // Filter for state totals (Countyfips === '000') and target year
    if (record.Countyfips !== '000' || record.Year !== targetYear || record.Description === 'U.S.') {
      continue;
    }

    const stateName = record.Description.trim();
    const parseNum = (val: string) => parseInt(val?.replace(/,/g, '') || '0') || 0;

    const raceData = {
      white: parseNum(record['White Alone']),
      black: parseNum(record['Black or African American Alone']),
      native: parseNum(record['American Indian and Alaska Native Alone']),
      asian: parseNum(record['Asian Alone']),
      pacificIslander: parseNum(record['Native Hawaiian and Other Pacific Islander Alone']),
      twoOrMore: parseNum(record['Two or More Races']),
      hispanic: parseNum(record['Hispanic']),
      notHispanic: parseNum(record['Not Hispanic']),
    };

    const result = await (Location as any).updateOne(
      { type: 'state', name: stateName },
      { $set: { racePopulation: raceData } }
    );

    if (result.matchedCount > 0) {
      console.log(`✅ Updated race population for ${stateName}`);
      updatedCount++;
    } else {
      console.warn(`⚠️ State ${stateName} not found in database.`);
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
