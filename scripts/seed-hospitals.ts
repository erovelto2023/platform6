/**
 * seed-hospitals.ts
 * 
 * Seeds hospital data per state using the CMS Provider Data CSV download.
 * Source: https://data.cms.gov/provider-data/dataset/xubh-q36u
 * Hospital General Information — publicly available, no auth required.
 */
import axios from "axios";
import mongoose from "mongoose";
import dotenv from "dotenv";
import Papa from "papaparse";
import { STATE_NAME_TO_ABBR } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) { console.error("MONGODB_URI not set"); process.exit(1); }

const LocationSchema = new mongoose.Schema({
    name: String, slug: String, type: String,
    hospitals: [{ name: String, city: String, type: String, beds: Number, url: String }],
}, { timestamps: true });

const Location = mongoose.models.LocationTemp || mongoose.model("LocationTemp", LocationSchema, "locations");
const slugify = (t: string) => t.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');
const abbrToStateName = Object.fromEntries(
    Object.entries(STATE_NAME_TO_ABBR).map(([n, a]) => [a.toUpperCase(), n])
);

async function seed() {
    await mongoose.connect(MONGO_URI!);
    console.log("Connected to MongoDB.");

    // CMS direct CSV download URL
    const CSV_URL = "https://data.cms.gov/provider-data/sites/default/files/resources/893c372430d9d71a1c52737d01239d47_1770163599/Hospital_General_Information.csv";

    console.log("Downloading hospital CSV from CMS...");
    const { data: csvText } = await axios.get(CSV_URL, {
        responseType: "text",
        timeout: 60000,
        headers: { "Accept": "text/csv,*/*" }
    });

    console.log(`Downloaded ${(csvText.length / 1024).toFixed(0)} KB. Parsing...`);

    const parsed = Papa.parse(csvText, { header: true, skipEmptyLines: true });
    const rows = parsed.data as any[];
    console.log(`Parsed ${rows.length} rows. Sample keys: ${Object.keys(rows[0] || {}).slice(0, 8).join(', ')}`);

    const stateHospitals: { [s: string]: Array<{ name: string; city: string; type: string; beds: number }> } = {};

    for (const row of rows) {
        // CMS columns: "Facility Name", "City/Town", "State", "Hospital Type"
        const name = (row["Facility Name"] || row["facility_name"] || '').trim();
        const city = (row["City/Town"] || row["city"] || row["City"] || '').trim();
        const stateAbbr = (row["State"] || row["state"] || '').trim().toUpperCase();
        const type = (row["Hospital Type"] || row["hospital_type"] || 'General Hospital').trim();

        if (!name || !stateAbbr) continue;
        const stateName = abbrToStateName[stateAbbr];
        if (!stateName) continue;

        if (!stateHospitals[stateName]) stateHospitals[stateName] = [];
        stateHospitals[stateName].push({ name, city, type, beds: 0 });
    }

    console.log(`\nResults by state:`);
    let updated = 0;
    const collection = mongoose.connection.db!.collection('locations');

    for (const stateName in stateHospitals) {
        const hospitals = stateHospitals[stateName];
        const stateSlug = slugify(stateName);
        
        try {
            const res = await collection.updateOne(
                { slug: stateSlug, type: 'state' },
                { $set: { hospitals } }
            );
            if (res.modifiedCount > 0 || res.matchedCount > 0) {
                updated++;
                console.log(` ✓ ${stateName}: ${hospitals.length} hospitals`);
            }
        } catch (err: any) {
            console.error(` ✗ Failed to update ${stateName}:`, err.message);
        }
    }

    console.log(`\nDone. States updated: ${updated}`);
    process.exit(0);
}

seed().catch(e => { console.error("Seed failed:", e.message); process.exit(1); });
