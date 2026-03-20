import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI!);
  const CPAListing = mongoose.models.CPAListing || mongoose.model("CPAListing", new mongoose.Schema({ city: String, state: String, name: String }));
  
  const sample = await CPAListing.find({ state: "WA" }).limit(10);
  console.log("Sample WA CPAs:");
  console.log(JSON.stringify(sample, null, 2));

  const cities = await CPAListing.distinct("city", { state: "WA" });
  console.log("\nDistinct cities in WA with CPAs:", cities.slice(0, 10));

  await mongoose.disconnect();
}

verify();
