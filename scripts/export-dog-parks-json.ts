import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI!;

async function exportDogParksJSON() {
  console.log("📦 Exporting local Dog Parks dataset to JSON file for Hostinger deployment...");

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to local MongoDB.");

  const db = mongoose.connection.db!;
  const statesWithParks = await db
    .collection("locations")
    .find({ type: "state", "dogParks.0": { $exists: true } })
    .project({ slug: 1, postal: 1, name: 1, dogParks: 1, _id: 0 })
    .toArray();

  console.log(`Found ${statesWithParks.length} states with dog parks.`);

  const dataset: Record<string, any[]> = {};
  let totalParks = 0;

  for (const s of statesWithParks) {
    dataset[s.slug] = s.dogParks;
    totalParks += s.dogParks.length;
  }

  const outputPath = path.join(process.cwd(), "docs", "dog_parks_dataset.json");
  fs.writeFileSync(outputPath, JSON.stringify(dataset, null, 2));

  const fileSizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);

  console.log("\n=========================================");
  console.log(`🎉 SUCCESS! Saved ${totalParks.toLocaleString()} dog parks across ${Object.keys(dataset).length} states.`);
  console.log(`File location: ${outputPath} (${fileSizeKb} KB)`);
  console.log("=========================================\n");

  process.exit(0);
}

exportDogParksJSON().catch(err => {
  console.error("Export failed:", err);
  process.exit(1);
});
