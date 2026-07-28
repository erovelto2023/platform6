import { getLocation } from "../lib/actions/location.actions";
import { HospitalService } from "../lib/services/hospital.service";
import { getStateFacts } from "../lib/utils/state-facts";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function testSC() {
  const stateSlug = "south-carolina";
  const state = await getLocation(stateSlug);
  const verifiedFacts = getStateFacts(stateSlug || state.name);
  const hospitalData = await HospitalService.fetchHospitalsByState(verifiedFacts.abbreviation);

  const hospitals = (state?.hospitals && state.hospitals.length > 0) 
      ? state.hospitals 
      : (hospitalData?.hospitals || []);

  console.log("\n=== SOUTH CAROLINA FINAL TEST ===");
  console.log("State name:", state?.name);
  console.log("State slug:", state?.slug);
  console.log("Verified Abbr:", verifiedFacts.abbreviation);
  console.log("HospitalData count:", hospitalData?.hospitals?.length);
  console.log("Final Hospitals count:", hospitals.length);
  console.log("First 3 hospitals:", hospitals.slice(0, 3).map((h: any) => h.name));
  console.log("=================================\n");

  process.exit(0);
}

testSC();
