/**
 * enrich-dog-parks.ts
 * 
 * Phase 2 dog park enrichment: visits each park's detail page on animalshelter.org
 * and pulls address, city, ZIP, and description — then updates the local MongoDB.
 * 
 * Run AFTER scrape-dog-parks.ts has already seeded the names.
 * 
 * Usage: npx ts-node --project tsconfig.json scripts/enrich-dog-parks.ts
 */

import mongoose from "mongoose";
import https from "https";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI!;
if (!MONGO_URI) { console.error("MONGODB_URI not set"); process.exit(1); }

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function fetchHtml(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { "User-Agent": "Mozilla/5.0", Accept: "text/html" },
      timeout: 12000,
    }, (res: any) => {
      if (res.statusCode >= 300 && res.statusCode < 400) {
        const loc: string = res.headers.location;
        return fetchHtml(loc.startsWith("http") ? loc : `https://www.animalshelter.org${loc}`)
          .then(resolve).catch(reject);
      }
      let data = "";
      res.on("data", (c: any) => (data += c));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => { req.destroy(); reject(new Error(`Timeout: ${url}`)); });
  });
}

interface ParkDetail {
  address: string;
  city: string;
  stateAbbr: string;
  zip: string;
  description: string;
}

function parseDetailPage(html: string): ParkDetail {
  // Address line 1: <div>4165 Proton Dr\n</div>
  const addrMatch = html.match(/<div class="about-park[^"]*"[\s\S]*?<h3>[^<]+<\/h3>\s*<div>([^<]+)<\/div>\s*<div>([^<]+)<\/div>/i);
  
  let address = "";
  let city = "";
  let stateAbbr = "";
  let zip = "";

  if (addrMatch) {
    address = addrMatch[1].replace(/\s+/g, " ").trim();
    // Second div is like "Addison, TX&nbsp;75001"
    const cityLine = addrMatch[2].replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
    // Parse "City, ST ZIP"
    const cityStateZip = cityLine.match(/^(.+),\s*([A-Z]{2})\s+(\d{5})/);
    if (cityStateZip) {
      city = cityStateZip[1].trim();
      stateAbbr = cityStateZip[2];
      zip = cityStateZip[3];
    } else {
      city = cityLine;
    }
  }

  // Description: inside <blockquote>
  const descMatch = html.match(/<blockquote>([\s\S]*?)<\/blockquote>/i);
  let description = "";
  if (descMatch) {
    description = descMatch[1]
      .replace(/<[^>]+>/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 500); // cap at 500 chars
  }

  return { address, city, stateAbbr, zip, description };
}

// Extract park name + detail URL from listing HTML
function parseParkLinks(html: string): Array<{ name: string; urlSlug: string }> {
  const parks: Array<{ name: string; urlSlug: string }> = [];
  const re = /href="(\/dogParks\/([^"]+_rId\d+_rS_pC\.html))"[^>]*>\s*<strong>([^<]+)<\/strong>\s*<\/a>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    parks.push({ urlSlug: m[2], name: m[3].trim() });
  }
  return parks;
}

function getMaxPage(html: string, abbr: string): number {
  const re = new RegExp(`/dogParks/[^/]+/${abbr}/(\\d+)\\.html`, "gi");
  let max = 1;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    const p = parseInt(m[1]);
    if (p > max) max = p;
  }
  return max;
}

const STATES = [
  { urlName: "Alabama", abbr: "AL", slug: "alabama" },
  { urlName: "Alaska", abbr: "AK", slug: "alaska" },
  { urlName: "Arizona", abbr: "AZ", slug: "arizona" },
  { urlName: "Arkansas", abbr: "AR", slug: "arkansas" },
  { urlName: "California", abbr: "CA", slug: "california" },
  { urlName: "Colorado", abbr: "CO", slug: "colorado" },
  { urlName: "Connecticut", abbr: "CT", slug: "connecticut" },
  { urlName: "Delaware", abbr: "DE", slug: "delaware" },
  { urlName: "Florida", abbr: "FL", slug: "florida" },
  { urlName: "Georgia", abbr: "GA", slug: "georgia" },
  { urlName: "Hawaii", abbr: "HI", slug: "hawaii" },
  { urlName: "Idaho", abbr: "ID", slug: "idaho" },
  { urlName: "Illinois", abbr: "IL", slug: "illinois" },
  { urlName: "Indiana", abbr: "IN", slug: "indiana" },
  { urlName: "Iowa", abbr: "IA", slug: "iowa" },
  { urlName: "Kansas", abbr: "KS", slug: "kansas" },
  { urlName: "Kentucky", abbr: "KY", slug: "kentucky" },
  { urlName: "Louisiana", abbr: "LA", slug: "louisiana" },
  { urlName: "Maine", abbr: "ME", slug: "maine" },
  { urlName: "Maryland", abbr: "MD", slug: "maryland" },
  { urlName: "Massachusetts", abbr: "MA", slug: "massachusetts" },
  { urlName: "Michigan", abbr: "MI", slug: "michigan" },
  { urlName: "Minnesota", abbr: "MN", slug: "minnesota" },
  { urlName: "Mississippi", abbr: "MS", slug: "mississippi" },
  { urlName: "Missouri", abbr: "MO", slug: "missouri" },
  { urlName: "Montana", abbr: "MT", slug: "montana" },
  { urlName: "Nebraska", abbr: "NE", slug: "nebraska" },
  { urlName: "Nevada", abbr: "NV", slug: "nevada" },
  { urlName: "New_Hampshire", abbr: "NH", slug: "new-hampshire" },
  { urlName: "New_Jersey", abbr: "NJ", slug: "new-jersey" },
  { urlName: "New_Mexico", abbr: "NM", slug: "new-mexico" },
  { urlName: "New_York", abbr: "NY", slug: "new-york" },
  { urlName: "North_Carolina", abbr: "NC", slug: "north-carolina" },
  { urlName: "North_Dakota", abbr: "ND", slug: "north-dakota" },
  { urlName: "Ohio", abbr: "OH", slug: "ohio" },
  { urlName: "Oklahoma", abbr: "OK", slug: "oklahoma" },
  { urlName: "Oregon", abbr: "OR", slug: "oregon" },
  { urlName: "Pennsylvania", abbr: "PA", slug: "pennsylvania" },
  { urlName: "Rhode_Island", abbr: "RI", slug: "rhode-island" },
  { urlName: "South_Carolina", abbr: "SC", slug: "south-carolina" },
  { urlName: "South_Dakota", abbr: "SD", slug: "south-dakota" },
  { urlName: "Tennessee", abbr: "TN", slug: "tennessee" },
  { urlName: "Texas", abbr: "TX", slug: "texas" },
  { urlName: "Utah", abbr: "UT", slug: "utah" },
  { urlName: "Vermont", abbr: "VT", slug: "vermont" },
  { urlName: "Virginia", abbr: "VA", slug: "virginia" },
  { urlName: "Washington", abbr: "WA", slug: "washington" },
  { urlName: "West_Virginia", abbr: "WV", slug: "west-virginia" },
  { urlName: "Wisconsin", abbr: "WI", slug: "wisconsin" },
  { urlName: "Wyoming", abbr: "WY", slug: "wyoming" },
];

async function run() {
  console.log("🐕 Dog Park Enrichment — Phase 2 (Address + Description)");
  console.log("============================================================");

  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB\n");

  const db = mongoose.connection.db!;
  let grandTotal = 0;
  let enriched = 0;

  for (const state of STATES) {
    const baseUrl = `https://www.animalshelter.org/dogParks/${state.urlName}/${state.abbr}.html`;
    const allParkLinks: Array<{ name: string; urlSlug: string }> = [];

    // Collect all park detail links from listing pages
    try {
      const html1 = await fetchHtml(baseUrl);
      allParkLinks.push(...parseParkLinks(html1));
      const maxPage = getMaxPage(html1, state.abbr);
      for (let page = 2; page <= maxPage; page++) {
        await sleep(400);
        try {
          const htmlN = await fetchHtml(
            `https://www.animalshelter.org/dogParks/${state.urlName}/${state.abbr}/${page}.html`
          );
          allParkLinks.push(...parseParkLinks(htmlN));
        } catch { break; }
      }
    } catch (err: any) {
      console.warn(`  ⚠ Skipping ${state.slug}: ${err.message}`);
      continue;
    }

    // Deduplicate by name
    const seen = new Set<string>();
    const unique = allParkLinks.filter(p => {
      if (seen.has(p.name)) return false;
      seen.add(p.name);
      return true;
    });

    if (unique.length === 0) continue;

    console.log(`\n${state.slug} (${unique.length} parks):`);
    const enrichedParks = [];

    // Fetch each detail page
    for (const park of unique) {
      const detailUrl = `https://www.animalshelter.org/dogParks/${park.urlSlug}`;
      try {
        const detailHtml = await fetchHtml(detailUrl);
        const detail = parseDetailPage(detailHtml);
        enrichedParks.push({
          name: park.name,
          address: detail.address,
          city: detail.city || "",
          stateAbbr: detail.stateAbbr || state.abbr,
          zip: detail.zip,
          description: detail.description,
          detailUrl: `https://www.animalshelter.org/dogParks/${park.urlSlug}`,
          source: "animalshelter.org",
        });
        process.stdout.write(".");
        enriched++;
      } catch {
        // fallback: keep name only
        enrichedParks.push({
          name: park.name, address: "", city: "", stateAbbr: state.abbr,
          zip: "", description: "", detailUrl: "", source: "animalshelter.org",
        });
        process.stdout.write("x");
      }
      await sleep(350); // polite rate limit
    }

    // Save enriched parks to DB
    await db.collection("locations").updateOne(
      { slug: state.slug, type: "state" },
      { $set: { dogParks: enrichedParks } },
      { upsert: true }
    );

    grandTotal += enrichedParks.length;
    console.log(`\n  → Saved ${enrichedParks.length} enriched parks for ${state.slug}`);
    await sleep(500);
  }

  console.log("\n============================================================");
  console.log(`✅ DONE! ${enriched}/${grandTotal} parks enriched with address + description.`);
  console.log("============================================================");
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
