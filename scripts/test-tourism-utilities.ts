import { getLocation } from "../lib/actions/location.actions";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verifyTourismUtilities() {
  console.log("--- Tourism, Public Utility Commissions & Real Estate Audit ---");
  const testStates = ["florida", "texas", "california", "illinois", "nevada", "new-york", "georgia", "hawaii"];

  let totalTourism = 0;
  let totalRealtorCpa = 0;

  for (const slug of testStates) {
    const loc = await getLocation(slug);
    const tCount = loc?.tourismUtilities?.length || 0;
    const rCount = loc?.realtorCpa?.length || 0;

    totalTourism += tCount;
    totalRealtorCpa += rCount;

    console.log(`State: ${loc?.name} (${slug}) -> ${tCount} Tourism/PUCs/Venues | ${rCount} Realtor/CPA Societies`);
    if (tCount > 0) {
      console.log(`   Tourism/PUC: ${loc.tourismUtilities[0].name} [${loc.tourismUtilities[0].category}] - ${loc.tourismUtilities[0].city}`);
    }
    if (rCount > 0) {
      console.log(`   Realtor/CPA: ${loc.realtorCpa[0].name} [${loc.realtorCpa[0].type}] - ${loc.realtorCpa[0].city}`);
    }
  }

  console.log("=================================");
  console.log(`Total Audited across 8 states: ${totalTourism} Tourism/PUCs | ${totalRealtorCpa} Realtor/CPA Societies`);
  console.log("=================================");

  process.exit(0);
}

verifyTourismUtilities();
