import { getLocation } from "../lib/actions/location.actions";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verifyBroadcast() {
  console.log("--- FCC Broadcast Stations Verification Audit ---");
  const testStates = ["texas", "california", "florida", "new-york", "south-carolina", "colorado", "illinois"];

  let totalFound = 0;
  for (const slug of testStates) {
    const loc = await getLocation(slug);
    const count = loc?.broadcastStations?.length || 0;
    totalFound += count;
    console.log(`State: ${loc?.name} (${slug}) -> ${count} Broadcast Stations loaded.`);
    if (count > 0) {
      console.log(`   Sample station: ${loc.broadcastStations[0].callSign} (${loc.broadcastStations[0].network}) - ${loc.broadcastStations[0].city}, ${loc.broadcastStations[0].state}`);
    }
  }

  console.log("=================================");
  console.log(`Total Broadcast Stations audited across 7 states: ${totalFound}`);
  console.log("=================================");

  process.exit(0);
}

verifyBroadcast();
