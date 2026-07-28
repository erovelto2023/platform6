import { getLocation } from "../lib/actions/location.actions";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verifyAirports() {
  console.log("--- US Commercial Airports Verification Audit ---");
  const testStates = ["georgia", "california", "illinois", "texas", "florida", "colorado", "new-york", "alaska"];

  let totalFound = 0;
  for (const slug of testStates) {
    const loc = await getLocation(slug);
    const count = loc?.airports?.length || 0;
    totalFound += count;
    console.log(`State: ${loc?.name} (${slug}) -> ${count} Commercial Airports loaded.`);
    if (count > 0) {
      console.log(`   Sample airport: ${loc.airports[0].name} (${loc.airports[0].code}) - ${loc.airports[0].city} [${loc.airports[0].type}]`);
    }
  }

  console.log("=================================");
  console.log(`Total Commercial Airports audited across 8 states: ${totalFound}`);
  console.log("=================================");

  process.exit(0);
}

verifyAirports();
