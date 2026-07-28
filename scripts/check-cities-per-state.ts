import mongoose from "mongoose";
import dotenv from "dotenv";
import { STATE_NAME_TO_ABBR } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

async function checkCitiesPerState() {
  await mongoose.connect(MONGO_URI!);
  const Location = mongoose.models.Location || mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

  console.log("=== Market Cities Per State Audit ===");
  let zeroCitiesCount = 0;
  let totalCitiesCount = 0;

  for (const [stateName, abbr] of Object.entries(STATE_NAME_TO_ABBR)) {
    const stateSlug = stateName.replace(/\s+/g, "-");
    const cityCount = await Location.countDocuments({
      type: "city",
      $or: [
        { stateSlug: stateSlug },
        { state: abbr.toUpperCase() },
        { state: stateName }
      ]
    });

    totalCitiesCount += cityCount;
    if (cityCount === 0) zeroCitiesCount++;
    console.log(`State: ${stateName} (${abbr.toUpperCase()}) -> ${cityCount} Market Cities`);
  }

  console.log("=================================");
  console.log(`Total Market Cities in DB: ${totalCitiesCount.toLocaleString()}`);
  console.log(`States with 0 Cities: ${zeroCitiesCount}`);
  console.log("=================================");

  process.exit(0);
}

checkCitiesPerState();
