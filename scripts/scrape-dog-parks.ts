import mongoose from "mongoose";
import dotenv from "dotenv";
import https from "https";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

// State list matching animalshelter.org URL structure
const STATES: { name: string; abbr: string; urlName: string; slug: string }[] = [
  { name: "Alabama", abbr: "AL", urlName: "Alabama", slug: "alabama" },
  { name: "Alaska", abbr: "AK", urlName: "Alaska", slug: "alaska" },
  { name: "Arizona", abbr: "AZ", urlName: "Arizona", slug: "arizona" },
  { name: "Arkansas", abbr: "AR", urlName: "Arkansas", slug: "arkansas" },
  { name: "California", abbr: "CA", urlName: "California", slug: "california" },
  { name: "Colorado", abbr: "CO", urlName: "Colorado", slug: "colorado" },
  { name: "Connecticut", abbr: "CT", urlName: "Connecticut", slug: "connecticut" },
  { name: "Delaware", abbr: "DE", urlName: "Delaware", slug: "delaware" },
  { name: "Florida", abbr: "FL", urlName: "Florida", slug: "florida" },
  { name: "Georgia", abbr: "GA", urlName: "Georgia", slug: "georgia" },
  { name: "Hawaii", abbr: "HI", urlName: "Hawaii", slug: "hawaii" },
  { name: "Idaho", abbr: "ID", urlName: "Idaho", slug: "idaho" },
  { name: "Illinois", abbr: "IL", urlName: "Illinois", slug: "illinois" },
  { name: "Indiana", abbr: "IN", urlName: "Indiana", slug: "indiana" },
  { name: "Iowa", abbr: "IA", urlName: "Iowa", slug: "iowa" },
  { name: "Kansas", abbr: "KS", urlName: "Kansas", slug: "kansas" },
  { name: "Kentucky", abbr: "KY", urlName: "Kentucky", slug: "kentucky" },
  { name: "Louisiana", abbr: "LA", urlName: "Louisiana", slug: "louisiana" },
  { name: "Maine", abbr: "ME", urlName: "Maine", slug: "maine" },
  { name: "Maryland", abbr: "MD", urlName: "Maryland", slug: "maryland" },
  { name: "Massachusetts", abbr: "MA", urlName: "Massachusetts", slug: "massachusetts" },
  { name: "Michigan", abbr: "MI", urlName: "Michigan", slug: "michigan" },
  { name: "Minnesota", abbr: "MN", urlName: "Minnesota", slug: "minnesota" },
  { name: "Mississippi", abbr: "MS", urlName: "Mississippi", slug: "mississippi" },
  { name: "Missouri", abbr: "MO", urlName: "Missouri", slug: "missouri" },
  { name: "Montana", abbr: "MT", urlName: "Montana", slug: "montana" },
  { name: "Nebraska", abbr: "NE", urlName: "Nebraska", slug: "nebraska" },
  { name: "Nevada", abbr: "NV", urlName: "Nevada", slug: "nevada" },
  { name: "New Hampshire", abbr: "NH", urlName: "New_Hampshire", slug: "new-hampshire" },
  { name: "New Jersey", abbr: "NJ", urlName: "New_Jersey", slug: "new-jersey" },
  { name: "New Mexico", abbr: "NM", urlName: "New_Mexico", slug: "new-mexico" },
  { name: "New York", abbr: "NY", urlName: "New_York", slug: "new-york" },
  { name: "North Carolina", abbr: "NC", urlName: "North_Carolina", slug: "north-carolina" },
  { name: "North Dakota", abbr: "ND", urlName: "North_Dakota", slug: "north-dakota" },
  { name: "Ohio", abbr: "OH", urlName: "Ohio", slug: "ohio" },
  { name: "Oklahoma", abbr: "OK", urlName: "Oklahoma", slug: "oklahoma" },
  { name: "Oregon", abbr: "OR", urlName: "Oregon", slug: "oregon" },
  { name: "Pennsylvania", abbr: "PA", urlName: "Pennsylvania", slug: "pennsylvania" },
  { name: "Rhode Island", abbr: "RI", urlName: "Rhode_Island", slug: "rhode-island" },
  { name: "South Carolina", abbr: "SC", urlName: "South_Carolina", slug: "south-carolina" },
  { name: "South Dakota", abbr: "SD", urlName: "South_Dakota", slug: "south-dakota" },
  { name: "Tennessee", abbr: "TN", urlName: "Tennessee", slug: "tennessee" },
  { name: "Texas", abbr: "TX", urlName: "Texas", slug: "texas" },
  { name: "Utah", abbr: "UT", urlName: "Utah", slug: "utah" },
  { name: "Vermont", abbr: "VT", urlName: "Vermont", slug: "vermont" },
  { name: "Virginia", abbr: "VA", urlName: "Virginia", slug: "virginia" },
  { name: "Washington", abbr: "WA", urlName: "Washington", slug: "washington" },
  { name: "West Virginia", abbr: "WV", urlName: "West_Virginia", slug: "west-virginia" },
  { name: "Wisconsin", abbr: "WI", urlName: "Wisconsin", slug: "wisconsin" },
  { name: "Wyoming", abbr: "WY", urlName: "Wyoming", slug: "wyoming" },
];

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}

function fetchPage(url: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; DogParkScraper/1.0)",
        "Accept": "text/html",
      },
      timeout: 15000,
    }, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        const redirectUrl = res.headers.location!;
        fetchPage(redirectUrl.startsWith("http") ? redirectUrl : `https://www.animalshelter.org${redirectUrl}`)
          .then(resolve)
          .catch(reject);
        return;
      }
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(data));
    });
    req.on("error", reject);
    req.on("timeout", () => {
      req.destroy();
      reject(new Error(`Timeout fetching ${url}`));
    });
  });
}

// Extract dog park names from raw HTML
// Actual format: <a href="/dogParks/Name_rId123_rS_pC.html"><strong>Park Name</strong></a>
function parseParkNames(html: string): string[] {
  const parks: string[] = [];
  const parkLinkRegex = /href="\/dogParks\/[^"]+_rId\d+_rS_pC\.html"[^>]*>\s*<strong>([^<]+)<\/strong>\s*<\/a>/gi;
  let match: RegExpExecArray | null;
  while ((match = parkLinkRegex.exec(html)) !== null) {
    const name = match[1].trim();
    if (name && name.length > 1) {
      parks.push(name);
    }
  }
  return parks;
}

// Detect if there are more pages by looking for pagination links
function getMaxPage(html: string, abbr: string): number {
  // Look for pagination links like /dogParks/Texas/TX/2.html
  const pageRegex = new RegExp(`/dogParks/[^/]+/${abbr}/(\\d+)\\.html`, "gi");
  let maxPage = 1;
  let match: RegExpExecArray | null;
  while ((match = pageRegex.exec(html)) !== null) {
    const page = parseInt(match[1]);
    if (page > maxPage) maxPage = page;
  }
  return maxPage;
}

async function scrapeState(state: typeof STATES[0]): Promise<string[]> {
  const allParks: string[] = [];
  const baseUrl = `https://www.animalshelter.org/dogParks/${state.urlName}/${state.abbr}.html`;

  try {
    // Fetch page 1
    const html1 = await fetchPage(baseUrl);
    const page1Parks = parseParkNames(html1);
    allParks.push(...page1Parks);

    // Check for more pages
    const maxPage = getMaxPage(html1, state.abbr);

    for (let page = 2; page <= maxPage; page++) {
      await sleep(500); // polite delay
      const pageUrl = `https://www.animalshelter.org/dogParks/${state.urlName}/${state.abbr}/${page}.html`;
      try {
        const htmlN = await fetchPage(pageUrl);
        const pageParks = parseParkNames(htmlN);
        allParks.push(...pageParks);
      } catch (err: any) {
        console.warn(`  ⚠ Page ${page} fetch failed for ${state.name}: ${err.message}`);
        break;
      }
    }
  } catch (err: any) {
    console.warn(`  ⚠ Failed to fetch ${state.name}: ${err.message}`);
  }

  // Deduplicate
  return [...new Set(allParks)];
}

async function runScrape() {
  console.log("🐕 Dog Park Scraper — animalshelter.org");
  console.log("=========================================");

  await mongoose.connect(MONGO_URI!);
  console.log("✅ Connected to MongoDB\n");

  const LocationModel =
    mongoose.models.Location ||
    mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

  let grandTotal = 0;
  let statesUpdated = 0;

  for (const state of STATES) {
    process.stdout.write(`Scraping ${state.name}...`);
    const parks = await scrapeState(state);
    process.stdout.write(` ${parks.length} parks found\n`);

    if (parks.length === 0) {
      console.log(`  → No parks found for ${state.name}, skipping DB write.`);
      continue;
    }

    // Convert to structured objects for DB
    const dogParkDocs = parks.map((name) => ({
      name,
      city: "",        // city not available in listing view
      description: "",
      source: "animalshelter.org",
    }));

    // Upsert into Location document
    const result = await LocationModel.updateOne(
      { slug: state.slug, type: "state" },
      { $set: { dogParks: dogParkDocs } },
      { upsert: true }
    );

    if (result.acknowledged) {
      statesUpdated++;
      grandTotal += parks.length;
      console.log(`  → Seeded ${state.slug}: ${parks.length} dog parks`);
    }

    // Polite delay between states
    await sleep(800);
  }

  console.log("\n=========================================");
  console.log(`🎉 DONE! ${grandTotal} dog parks seeded across ${statesUpdated} states.`);
  console.log("=========================================");

  process.exit(0);
}

runScrape().catch((err) => {
  console.error("Scrape failed:", err);
  process.exit(1);
});
