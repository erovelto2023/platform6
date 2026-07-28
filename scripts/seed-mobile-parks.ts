import mongoose from "mongoose";
import fs from "fs";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI!;

async function updateMobileParks() {
  console.log("🏙️ Updating Alabama Dog Parks & Mobile City Parks with official cityofmobile.gov links...");

  await mongoose.connect(MONGO_URI);
  console.log("Connected to MongoDB.");

  const LocationModel = mongoose.models.Location || mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

  // Read raw HTML
  const rawHtml = fs.readFileSync("mobile_parks_raw.html", "utf-8");

  // Extract bldgData and centersData JSON
  const bldgMatch = rawHtml.match(/bldgData\s*=\s*(\{"type":"FeatureCollection"[\s\S]*?\});/);
  const centersMatch = rawHtml.match(/centersData\s*=\s*(\{"type":"FeatureCollection"[\s\S]*?\});/);

  const bldgFeatures = bldgMatch ? JSON.parse(bldgMatch[1]).features : [];
  const centersFeatures = centersMatch ? JSON.parse(centersMatch[1]).features : [];

  const allMobileParks = [...bldgFeatures, ...centersFeatures];
  console.log(`Extracted ${allMobileParks.length} official Mobile city parks.`);

  // Find Alabama state location document
  const alabamaDoc = await LocationModel.findOne({ slug: "alabama", type: "state" });
  if (!alabamaDoc) {
    console.error("Alabama state document not found!");
    process.exit(1);
  }

  const existingDogParks: any[] = alabamaDoc.dogParks || [];
  console.log(`Current Alabama dogParks count: ${existingDogParks.length}`);

  // Map each Mobile feature into structured park doc
  const mobileParkDocs = allMobileParks.map((feat: any) => {
    const props = feat.properties;
    const title = (props.title || "").trim();
    const slug = props.slug;
    const detailUrl = `https://www.cityofmobile.gov/parks-rec/${slug}/`;
    const formattedAddress = (props.formatted_address || "").replace(/\t/g, " ").replace(/\s+/g, " ").trim();

    // parse address components if possible
    let address = formattedAddress;
    let city = "Mobile";
    let zip = "";
    const zipMatch = formattedAddress.match(/\b(\d{5}(-\d{4})?)\b/);
    if (zipMatch) zip = zipMatch[1];

    return {
      name: title,
      address,
      city: "Mobile",
      stateAbbr: "AL",
      zip,
      description: `Official City of Mobile park & recreational facility located at ${formattedAddress}.`,
      detailUrl,
      source: "cityofmobile.gov",
    };
  });

  // Merge Mobile parks with existing dogParks (updating matching ones, appending new ones)
  const parkMap = new Map<string, any>();

  // Add existing dog parks first
  for (const park of existingDogParks) {
    parkMap.set(park.name.toLowerCase().trim(), park);
  }

  // Update or insert Mobile city parks
  let updatedCount = 0;
  let addedCount = 0;

  for (const mobilePark of mobileParkDocs) {
    const key = mobilePark.name.toLowerCase().trim();
    
    // Check if fuzzy match exists (e.g. "Medal Of Honor Park" vs "Medal of Honor Park")
    let matchedKey = Array.from(parkMap.keys()).find(k => k === key || k.includes(key) || key.includes(k));

    if (matchedKey) {
      const existing = parkMap.get(matchedKey);
      parkMap.set(matchedKey, {
        ...existing,
        name: mobilePark.name,
        address: mobilePark.address || existing.address,
        city: "Mobile",
        stateAbbr: "AL",
        zip: mobilePark.zip || existing.zip,
        detailUrl: mobilePark.detailUrl,
        source: "cityofmobile.gov",
        description: existing.description || mobilePark.description,
      });
      updatedCount++;
    } else {
      parkMap.set(key, mobilePark);
      addedCount++;
    }
  }

  const updatedDogParksList = Array.from(parkMap.values());

  await LocationModel.updateOne(
    { slug: "alabama", type: "state" },
    { $set: { dogParks: updatedDogParksList } }
  );

  console.log(`\n=================================`);
  console.log(`✅ SUCCESS! Updated Alabama dog parks.`);
  console.log(`- Total Parks now: ${updatedDogParksList.length}`);
  console.log(`- Updated with official links: ${updatedCount}`);
  console.log(`- Newly added Mobile parks: ${addedCount}`);
  console.log(`=================================\n`);

  process.exit(0);
}

updateMobileParks().catch(err => {
  console.error("Update failed:", err);
  process.exit(1);
});
