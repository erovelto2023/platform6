/**
 * seed-dog-parks-hostinger.ts
 * 
 * Seeds the dog parks data (already scraped and saved in local DB) to Hostinger.
 * 
 * Usage:
 *   $env:HOSTINGER_URI="mongodb+srv://user:pass@host/dbname"; npx ts-node --project tsconfig.json scripts/seed-dog-parks-hostinger.ts
 *
 * What it does:
 *   1. Reads dog parks from LOCAL MongoDB (localhost)
 *   2. Writes them to HOSTINGER MongoDB (production)
 */

import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const LOCAL_URI = process.env.MONGODB_URI!;
const HOSTINGER_URI = process.env.HOSTINGER_URI;

if (!LOCAL_URI) {
  console.error("❌ MONGODB_URI not set in .env.local");
  process.exit(1);
}

if (!HOSTINGER_URI) {
  console.error("❌ HOSTINGER_URI not set. Run with:");
  console.error('   $env:HOSTINGER_URI="mongodb+srv://user:pass@host/db"; npx ts-node --project tsconfig.json scripts/seed-dog-parks-hostinger.ts');
  process.exit(1);
}

async function syncDogParks() {
  console.log("🐕 Dog Parks → Hostinger Sync");
  console.log("================================");

  // Connect to LOCAL
  const localConn = await mongoose.createConnection(LOCAL_URI).asPromise();
  console.log("✅ Connected to LOCAL MongoDB");

  // Connect to HOSTINGER
  const hostConn = await mongoose.createConnection(HOSTINGER_URI!).asPromise();
  console.log("✅ Connected to HOSTINGER MongoDB\n");

  const localDb = localConn.db!;
  const hostDb = hostConn.db!;

  // Get all state locations from local that have dog parks
  const localStates = await localDb
    .collection("locations")
    .find({ type: "state", "dogParks.0": { $exists: true } })
    .project({ slug: 1, dogParks: 1, _id: 0 })
    .toArray();

  console.log(`Found ${localStates.length} states with dog parks in local DB.\n`);

  let updated = 0;
  let totalParks = 0;

  for (const state of localStates) {
    const result = await hostDb.collection("locations").updateOne(
      { slug: state.slug, type: "state" },
      { $set: { dogParks: state.dogParks } },
      { upsert: false } // only update existing records — don't create new ones
    );

    if (result.matchedCount > 0) {
      updated++;
      totalParks += state.dogParks.length;
      console.log(`  → ${state.slug}: ${state.dogParks.length} dog parks`);
    } else {
      console.warn(`  ⚠ No matching state doc found for: ${state.slug}`);
    }
  }

  console.log("\n================================");
  console.log(`🎉 DONE! ${totalParks} dog parks pushed to Hostinger across ${updated} states.`);
  console.log("================================");

  await localConn.close();
  await hostConn.close();
  process.exit(0);
}

syncDogParks().catch((err) => {
  console.error("Sync failed:", err.message);
  process.exit(1);
});
