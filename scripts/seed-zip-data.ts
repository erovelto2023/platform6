import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import Papa from "papaparse";
import dotenv from "dotenv";
import { STATE_ABBR_TO_NAME, STATE_NAME_TO_ABBR } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("MONGODB_URI is not set in .env");
    process.exit(1);
}

// Define Schema locally to avoid issues with compiled imports
const LocationSchema = new mongoose.Schema({
    name: String,
    slug: String,
    type: String,
    stateSlug: String,
    zipCodes: [String],
    areaCodes: [String],
    timezone: String,
}, { timestamps: true });

const Location = mongoose.models.Location || mongoose.model("Location", LocationSchema);

const STATE_TO_AREA_CODES: { [key: string]: string[] } = {
    "al": ["205", "251", "256", "334", "938"],
    "ak": ["907"],
    "az": ["480", "520", "602", "623", "928"],
    "ar": ["479", "501", "870"],
    "ca": ["209", "213", "310", "323", "408", "415", "424", "442", "510", "530", "559", "562", "619", "626", "650", "657", "661", "707", "714", "747", "760", "805", "818", "831", "858", "909", "916", "925", "949", "951"],
    "co": ["303", "719", "720", "970"],
    "ct": ["203", "475", "860", "959"],
    "de": ["302"],
    "fl": ["239", "305", "321", "352", "386", "407", "561", "727", "754", "772", "786", "813", "850", "863", "904", "941", "954"],
    "ga": ["229", "404", "470", "478", "678", "706", "762", "770", "912"],
    "hi": ["808"],
    "id": ["208"],
    "il": ["217", "224", "309", "312", "331", "618", "630", "708", "773", "779", "815", "847", "872"],
    "in": ["219", "260", "317", "574", "765", "812", "930"],
    "ia": ["319", "515", "563", "641", "712"],
    "ks": ["316", "620", "785", "913"],
    "ky": ["270", "364", "502", "606", "859"],
    "la": ["225", "318", "337", "504", "985"],
    "me": ["207"],
    "md": ["240", "301", "410", "443", "667"],
    "ma": ["339", "351", "413", "508", "617", "774", "781", "857", "978"],
    "mi": ["231", "248", "269", "313", "517", "586", "616", "734", "810", "906", "947", "989"],
    "mn": ["218", "320", "507", "612", "651", "763", "952"],
    "ms": ["228", "601", "662", "769"],
    "mo": ["314", "417", "573", "636", "660", "816"],
    "mt": ["406"],
    "ne": ["308", "402", "531"],
    "nv": ["702", "725", "775"],
    "nh": ["603"],
    "nj": ["201", "551", "609", "732", "848", "856", "862", "908", "973"],
    "nm": ["505", "575"],
    "ny": ["212", "315", "332", "347", "516", "518", "585", "607", "631", "646", "680", "716", "718", "845", "914", "917", "929", "934"],
    "nc": ["252", "336", "704", "743", "828", "910", "919", "980", "984"],
    "nd": ["701"],
    "oh": ["216", "234", "330", "419", "440", "513", "567", "614", "740", "937"],
    "ok": ["405", "539", "580", "918"],
    "or": ["458", "503", "541", "971"],
    "pa": ["215", "267", "272", "412", "484", "570", "610", "717", "724", "814", "878"],
    "ri": ["401"],
    "sc": ["803", "843", "864"],
    "sd": ["605"],
    "tn": ["423", "615", "629", "731", "865", "901", "931"],
    "tx": ["210", "214", "254", "281", "325", "361", "409", "430", "432", "469", "512", "682", "713", "737", "806", "817", "830", "832", "903", "915", "936", "940", "956", "972", "979"],
    "ut": ["385", "435", "801"],
    "vt": ["802"],
    "va": ["276", "434", "540", "571", "703", "757", "804"],
    "wa": ["206", "253", "360", "425", "509"],
    "wv": ["304", "681"],
    "wi": ["262", "414", "608", "715", "920"],
    "wy": ["307"]
};

async function seed() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGO_URI!);
        console.log("Connected to MongoDB.");

        const csvPath = path.join(process.cwd(), "excel", "ZIP_Locale_Detail_utf8.csv");
        if (!fs.existsSync(csvPath)) {
            throw new Error(`CSV file not found at ${csvPath}`);
        }

        console.log("Reading CSV file...");
        const csvData = fs.readFileSync(csvPath, "utf-8");
        
        console.log("Parsing CSV data...");
        const results = Papa.parse(csvData, {
            header: true,
            skipEmptyLines: true,
        });

        console.log(`Parsed ${results.data.length} rows.`);

        // Map to hold aggregated ZIPs: stateSlug -> cityName -> Set of ZIPs
        const cityZipMap: { [stateSlug: string]: { [cityName: string]: Set<string> } } = {};

        const slugify = (text: string) => text.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

        for (const row of results.data as any[]) {
            const cityName = row["PHYSICAL CITY"];
            const stateAbbr = row["PHYSICAL STATE"]?.toLowerCase();
            const zipCode = row["DELIVERY ZIPCODE"];

            if (!cityName || !stateAbbr || !zipCode) continue;

            const stateName = STATE_ABBR_TO_NAME[stateAbbr];
            if (!stateName) continue;

            const stateSlug = slugify(stateName);
            const cityKey = cityName.trim(); // Match exactly as in DB if possible, or fuzzy later

            if (!cityZipMap[stateSlug]) cityZipMap[stateSlug] = {};
            if (!cityZipMap[stateSlug][cityKey]) cityZipMap[stateSlug][cityKey] = new Set();
            
            cityZipMap[stateSlug][cityKey].add(zipCode);
        }

        console.log("Starting database updates...");
        let updatedCount = 0;
        let cityNotFoundCount = 0;

        for (const fullStateSlug in cityZipMap) {
            console.log(`Processing state: ${fullStateSlug}...`);
            const cities = cityZipMap[fullStateSlug];
            
            // Get state abbreviation for area codes mapping
            const stateNameMatch = Object.keys(STATE_NAME_TO_ABBR).find(name => slugify(name) === fullStateSlug);
            const stateAbbr = stateNameMatch ? STATE_NAME_TO_ABBR[stateNameMatch] : null;
            const areaCodes = stateAbbr ? (STATE_TO_AREA_CODES[stateAbbr] || []) : [];
            
            for (const cityName in cities) {
                const zips = Array.from(cities[cityName]);
                const citySlug = slugify(cityName);

                // Try to find the city in the database
                // Attempt 1: Regular slug match
                let cityDoc = await Location.findOne({ 
                    slug: citySlug, 
                    stateSlug: fullStateSlug, 
                    type: 'city' 
                });

                if (!cityDoc) {
                    // Attempt 2: Case-insensitive name match if slug fails due to special chars
                    cityDoc = await Location.findOne({
                        name: { $regex: new RegExp(`^${cityName}$`, "i") },
                        stateSlug: fullStateSlug,
                        type: 'city'
                    });
                }

                if (cityDoc) {
                    cityDoc.zipCodes = zips;
                    cityDoc.areaCodes = areaCodes;
                    await cityDoc.save();
                    updatedCount++;
                } else {
                    cityNotFoundCount++;
                }
            }
        }

        console.log(`Seed completed successfully.`);
        console.log(`Cities updated: ${updatedCount}`);
        console.log(`Cities not found in DB: ${cityNotFoundCount}`);

        // Also update state documents with area codes
        console.log("Updating state area codes...");
        for (const stateSlug in STATE_TO_AREA_CODES) {
            const fullStateName = Object.keys(STATE_ABBR_TO_NAME).find(abbr => abbr === stateSlug) || stateSlug;
            // Actually stateSlug is the full name slug "kentucky"
            // Let's iterate our database states
        }

        const statesInDb = await Location.find({ type: 'state' });
        for (const state of statesInDb) {
            const abbr = Object.entries(STATE_ABBR_TO_NAME).find(([a, name]) => slugify(name) === state.slug)?.[0];
            if (abbr && STATE_TO_AREA_CODES[abbr]) {
                state.areaCodes = STATE_TO_AREA_CODES[abbr];
                await state.save();
            }
        }

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

seed();
