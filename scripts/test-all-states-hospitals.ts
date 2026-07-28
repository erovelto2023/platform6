import { getStateFacts } from "../lib/utils/state-facts";
import { HospitalService } from "../lib/services/hospital.service";
import { getLocation } from "../lib/actions/location.actions";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const testSlugs = [
  "alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "florida", "georgia",
  "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland",
  "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new-hampshire", "new-jersey",
  "new-mexico", "new-york", "north-carolina", "north-dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode-island", "south-carolina",
  "south-dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west-virginia", "wisconsin", "wyoming"
];

async function testAll() {
  console.log("--- Testing All 50 States Hospital Resolution ---");
  let totalHospitals = 0;
  let zeroCount = 0;

  for (const slug of testSlugs) {
    const state = await getLocation(slug);
    const facts = getStateFacts(slug || state?.name);
    const hospitalData = await HospitalService.fetchHospitalsByState(state?.postal || facts.abbreviation || slug);

    const count = state?.hospitals?.length || hospitalData?.hospitals?.length || 0;
    totalHospitals += count;
    if (count === 0) zeroCount++;

    console.log(`State: ${slug} | DB Name: ${state?.name} | Abbr: ${facts.abbreviation} | Hospitals: ${count}`);
  }

  console.log("=================================");
  console.log(`Total 50 States Resolved Hospitals: ${totalHospitals.toLocaleString()}`);
  console.log(`Zero Count States: ${zeroCount}`);
  console.log("=================================");

  process.exit(0);
}

testAll();
