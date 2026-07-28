import mongoose from "mongoose";
import dotenv from "dotenv";
import Location from "../lib/db/models/Location";
import connectToDatabase from "../lib/db/connect";

dotenv.config({ path: ".env.local" });

async function checkSC() {
  await connectToDatabase();

  const scDoc = await Location.findOne({ slug: "south-carolina", type: "state" }).lean();
  console.log("--- South Carolina Doc Audit ---");
  console.log("Found SC doc:", !!scDoc);
  console.log("SC doc _id:", scDoc?._id);
  console.log("SC doc name:", scDoc?.name);
  console.log("SC doc slug:", scDoc?.slug);
  console.log("SC doc hospitals count:", (scDoc as any)?.hospitals?.length);

  const allStateDocs = await Location.find({ type: "state" }).select("name slug hospitals").lean();
  console.log("\nAll State Docs in DB count:", allStateDocs.length);
  for (const s of allStateDocs) {
    if (s.slug.includes("carolina")) {
      console.log(`- ${s.name} (${s.slug}): ${(s as any).hospitals?.length || 0} hospitals`);
    }
  }

  process.exit(0);
}

checkSC();
