import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "../lib/db/models/Location";
import connectToDatabase from "../lib/db/connect";
import { HospitalService } from "../lib/services/hospital.service";
import { getStateFacts } from "../lib/utils/state-facts";

dotenv.config({ path: ".env.local" });

async function debugAlabama() {
  await connectToDatabase();

  const stateDoc = await Location.findOne({ slug: "alabama", type: "state" }).lean();
  console.log("StateDoc found:", !!stateDoc);
  console.log("StateDoc name:", stateDoc?.name);
  console.log("StateDoc hospitals length:", (stateDoc as any)?.hospitals?.length);

  const verifiedFacts = getStateFacts("alabama");
  const hospitalData = await HospitalService.fetchHospitalsByState(verifiedFacts.abbreviation);
  console.log("HospitalService hospitals length:", hospitalData?.hospitals?.length);

  const hospitals = (stateDoc as any)?.hospitals && (stateDoc as any).hospitals.length > 0
    ? (stateDoc as any).hospitals
    : (hospitalData?.hospitals || []);

  console.log("Final hospitals array length:", hospitals.length);
  if (hospitals.length > 0) {
    console.log("First hospital:", hospitals[0]);
  }

  process.exit(0);
}

debugAlabama();
