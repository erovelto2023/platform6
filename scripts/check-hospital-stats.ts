import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

async function checkHospitals() {
  await mongoose.connect(MONGO_URI!);
  const Location = mongoose.models.Location || mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

  const states = await Location.find({ type: "state" }).select("name slug postal hospitals hospitalStats");
  
  let totalHospitals = 0;
  let statesWithHospitals = 0;

  console.log("--- MongoDB Hospital Records Audit ---");
  for (const s of states) {
    const count = s.hospitals?.length || 0;
    totalHospitals += count;
    if (count > 0) statesWithHospitals++;
    console.log(`${s.name} (${s.postal || s.slug}): ${count} hospitals registered.`);
  }

  console.log("\n=================================");
  console.log(`Total States with Hospitals: ${statesWithHospitals} / ${states.length}`);
  console.log(`Total Hospital Records in MongoDB: ${totalHospitals.toLocaleString()}`);
  console.log("=================================\n");

  process.exit(0);
}

checkHospitals();
