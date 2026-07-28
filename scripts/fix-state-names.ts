import mongoose from "mongoose";
import dotenv from "dotenv";
import { STATE_NAME_TO_ABBR, STATE_ABBR_TO_NAME } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

function toTitleCase(str: string): string {
  return str.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

async function fixStateNames() {
  await mongoose.connect(MONGO_URI!);
  const Location = mongoose.models.Location || mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

  console.log("--- Fixing State Names & Postals in MongoDB ---");

  for (const [stateName, abbr] of Object.entries(STATE_NAME_TO_ABBR)) {
    const slug = stateName.replace(/\s+/g, "-");
    const formattedName = toTitleCase(stateName);
    const postal = abbr.toUpperCase();

    const result = await Location.updateOne(
      { slug, type: "state" },
      {
        $set: {
          name: formattedName,
          slug: slug,
          postal: postal,
          type: "state"
        }
      },
      { upsert: true }
    );

    console.log(`Updated state: ${formattedName} (${postal}) -> slug: ${slug}`);
  }

  console.log("Finished fixing state names & postals.");
  process.exit(0);
}

fixStateNames();
