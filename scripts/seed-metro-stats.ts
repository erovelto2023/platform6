import mongoose from 'mongoose';
import * as XLSX from 'xlsx';
import path from 'path';
import dotenv from 'dotenv';
import Location from '../lib/db/models/Location';

dotenv.config({ path: '.env.local' });

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env.local");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB.");

  const excelPath = path.join(process.cwd(), 'excel', 'metro_statistics_rankings_2025.xlsx');
  const workbook = XLSX.readFile(excelPath);
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const data = XLSX.utils.sheet_to_json(sheet, { header: 1 }) as any[][];

  console.log(`📊 Loaded ${data.length} rows from Excel.`);

  // Headers are in rows 0 and 1
  // Row 2+ is data
  let updatedCitiesCount = 0;

  for (let i = 2; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const metroName = row[0] as string;
    if (!metroName) continue;

    // Parse values and ranks (Rank is first, then Value)
    const stats = {
      smallBusinessCount: { value: Number(row[2]), rank: Number(row[1]) },
      smallManufacturerCount: { value: Number(row[4]), rank: Number(row[3]) },
      employmentShare: { value: Number(row[6]), rank: Number(row[5]) },
      payrollShare: { value: Number(row[8]), rank: Number(row[7]) },
      minorityShare: { value: Number(row[10]), rank: Number(row[9]) },
      womenShare: { value: Number(row[12]), rank: Number(row[11]) },
      veteranShare: { value: Number(row[14]), rank: Number(row[13]) },
    };

    // Extract Cities and States from "MetroArea, ST-ST"
    const parts = metroName.split(',');
    if (parts.length < 2) continue;

    const cityPart = parts[0].trim();
    const statePart = parts[1].trim();

    const citiesInMetro = cityPart.split('-').map(c => c.trim());
    const statesInMetro = statePart.split('-').map(s => s.trim());

    // Mapping of State Abbreviations to Slugs
    const STATE_SLUG_MAP: Record<string, string> = {
        "AL": "alabama", "AK": "alaska", "AZ": "arizona", "AR": "arkansas", "CA": "california",
        "CO": "colorado", "CT": "connecticut", "DE": "delaware", "FL": "florida", "GA": "georgia",
        "HI": "hawaii", "ID": "idaho", "IL": "illinois", "IN": "indiana", "IA": "iowa",
        "KS": "kansas", "KY": "kentucky", "LA": "louisiana", "ME": "maine", "MD": "maryland",
        "MA": "massachusetts", "MI": "michigan", "MN": "minnesota", "MS": "mississippi", "MO": "missouri",
        "MT": "montana", "NE": "nebraska", "NV": "nevada", "NH": "new-hampshire", "NJ": "new-jersey",
        "NM": "new-mexico", "NY": "new-york", "NC": "north-carolina", "ND": "north-dakota", "OH": "ohio",
        "OK": "oklahoma", "OR": "oregon", "PA": "pennsylvania", "RI": "rhode-island", "SC": "south-carolina",
        "SD": "south-dakota", "TN": "tennessee", "TX": "texas", "UT": "utah", "VT": "vermont",
        "VA": "virginia", "WA": "washington", "WV": "west-virginia", "WI": "wisconsin", "WY": "wyoming"
    };

    const targetStateSlugs = statesInMetro.map(s => STATE_SLUG_MAP[s]).filter(Boolean);

    // Update each city found in the database
    for (const cityName of citiesInMetro) {
      // Find city in any of the associated states
      const result = await (Location as any).updateMany(
        { 
          type: 'city', 
          name: new RegExp(`^${cityName}$`, 'i'),
          stateSlug: { $in: targetStateSlugs }
        },
        { 
          $set: { 
            metroName: metroName,
            metroStats: stats 
          } 
        }
      );

      if (result.matchedCount > 0) {
        console.log(`✅ Updated ${result.matchedCount} records for city: ${cityName} (${metroName})`);
        updatedCitiesCount += result.matchedCount;
      }
    }
  }

  console.log(`\n🎉 Done! Updated ${updatedCitiesCount} city records.`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error("💥 Error:", err);
  process.exit(1);
});
