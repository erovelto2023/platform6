import axios from "axios";
import * as cheerio from "cheerio";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { STATE_NAME_TO_ABBR } from "../lib/utils/state-mapping";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
    console.error("MONGODB_URI is not set in .env.local");
    process.exit(1);
}

// Define Schema locally
const LocationSchema = new mongoose.Schema({
    name: String,
    slug: String,
    type: String,
    stateSlug: String,
    educationalInstitutions: [{
        name: String,
        url: String,
    }],
}, { timestamps: true });

const Location = mongoose.models.Location || mongoose.model("Location", LocationSchema);

const slugify = (text: string) => text.toLowerCase().trim().replace(/[^\w ]+/g, '').replace(/ +/g, '-');

async function scrape() {
    try {
        console.log("Connecting to database...");
        await mongoose.connect(MONGO_URI!);
        console.log("Connected to MongoDB.");

        const url = "https://university.graduateshotline.com/ubystate.html";
        console.log(`Fetching data from ${url}...`);
        const https = require('https');
        const { data: html } = await axios.get(url, {
            httpsAgent: new https.Agent({ rejectUnauthorized: false })
        });
        const $ = cheerio.load(html);

        console.log("Starting state-machine parsing...");
        const stateInstitutions: { [stateName: string]: Array<{ name: string, url: string }> } = {};
        
        let currentStateAbbr = "";
        const abbrToStateName = Object.fromEntries(
            Object.entries(STATE_NAME_TO_ABBR).map(([name, abbr]) => [abbr.toUpperCase(), name])
        );

        // Find all elements that could be state markers or school lists
        // Note: The page has schools inside <li> of a large <ol>
        $('body *').each((i, el) => {
            const $el = $(el);
            
            // 1. Check if this element is or contains a state anchor
            const anchor = $el.is('a[name]') ? $el : $el.find('a[name]').first();
            if (anchor.length) {
                const nameAttr = anchor.attr('name');
                if (nameAttr && nameAttr.length <= 3 && nameAttr !== 'top' && abbrToStateName[nameAttr]) {
                    currentStateAbbr = nameAttr;
                    const stateName = abbrToStateName[currentStateAbbr];
                    if (!stateInstitutions[stateName]) {
                        stateInstitutions[stateName] = [];
                        console.log(` -> Found start of state: ${stateName} (${currentStateAbbr})`);
                    }
                }
            }

            // 2. If we have a current state, and this is an <li>, look for a school link
            if (currentStateAbbr && $el.is('li')) {
                const link = $el.find('a[href^="http"]').first();
                if (link.length) {
                    const name = link.text().trim();
                    const url = link.attr('href');
                    const stateName = abbrToStateName[currentStateAbbr];
                    
                    // Filter out non-university links (return to top, ads, etc)
                    if (name && url && !url.includes('graduateshotline.com') && !name.includes('return to top')) {
                        // Avoid duplicates (in case of nested tags triggering multiple times)
                        if (!stateInstitutions[stateName].some(inst => inst.url === url)) {
                            stateInstitutions[stateName].push({ name, url });
                        }
                    }
                }
            }
        });

        console.log("\nParsing complete. Results:");
        for (const state in stateInstitutions) {
            console.log(` - ${state}: ${stateInstitutions[state].length} found`);
        }

        console.log("\nStarting database updates...");
        let updatedCount = 0;

        for (const stateName in stateInstitutions) {
            const stateSlug = slugify(stateName);
            const institutions = stateInstitutions[stateName];
            
            if (institutions.length === 0) continue;

            const stateDoc = await Location.findOne({ 
                slug: stateSlug, 
                type: 'state' 
            });

            if (stateDoc) {
                stateDoc.educationalInstitutions = institutions;
                await stateDoc.save();
                updatedCount++;
            }
        }

        console.log(`Seed completed successfully.`);
        console.log(`States updated with education data: ${updatedCount}`);

        process.exit(0);
    } catch (error) {
        console.error("Seed failed:", error);
        process.exit(1);
    }
}

scrape();
