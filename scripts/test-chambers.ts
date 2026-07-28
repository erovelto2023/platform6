import { getLocation } from "../lib/actions/location.actions";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function verifyChambers() {
  console.log("--- Chambers, EDCs & Legal Associations Audit ---");
  const testStates = ["texas", "california", "new-york", "florida", "illinois", "south-carolina", "colorado"];

  let totalChambers = 0;
  let totalLegal = 0;

  for (const slug of testStates) {
    const loc = await getLocation(slug);
    const cCount = loc?.chambers?.length || 0;
    const lCount = loc?.legalAssociations?.length || 0;

    totalChambers += cCount;
    totalLegal += lCount;

    console.log(`State: ${loc?.name} (${slug}) -> ${cCount} Chambers/EDCs | ${lCount} Legal Associations`);
    if (cCount > 0) {
      console.log(`   Chamber: ${loc.chambers[0].name} (${loc.chambers[0].type}) - ${loc.chambers[0].city}`);
    }
    if (lCount > 0) {
      console.log(`   Legal: ${loc.legalAssociations[0].name} (${loc.legalAssociations[0].type}) - ${loc.legalAssociations[0].city}`);
    }
  }

  console.log("=================================");
  console.log(`Total Audited across 7 states: ${totalChambers} Chambers/EDCs | ${totalLegal} Legal Associations`);
  console.log("=================================");

  process.exit(0);
}

verifyChambers();
