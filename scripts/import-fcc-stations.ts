import fs from "fs";
import path from "path";
import * as XLSX from "xlsx";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

if (!MONGO_URI) {
  console.error("MONGODB_URI is not set in .env.local");
  process.exit(1);
}

const STATE_ABBR_TO_SLUG: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
  MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
  NM: "new-mexico", NY: "new-york", NC: "north-carolina", ND: "north-dakota", OH: "ohio",
  OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
  SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west-virginia", WI: "wisconsin", WY: "wyoming"
};

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, (m) => m.toUpperCase());
}

export interface BroadcastStationDoc {
  callSign: string;
  facilityId: number;
  type: string;
  city: string;
  state: string;
  licensee: string;
  network: string;
  rfChannel: number;
  virtualChannel: number;
  dma: string;
}

async function importFccStations() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI!);
    console.log("Connected to MongoDB.");

    const excelPath = path.join(process.cwd(), "docs", "DOC-306948A1.xls");
    if (!fs.existsSync(excelPath)) {
      throw new Error(`Excel file not found at: ${excelPath}`);
    }

    console.log(`Reading FCC Radio & TV Excel file: ${excelPath}`);
    const fileBuffer = fs.readFileSync(excelPath);
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rawRows: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (rawRows.length < 3) {
      throw new Error("Excel sheet contains insufficient data rows");
    }

    // Row 2 (index 1) contains the actual headers
    const headers = rawRows[1].map((h: any) => String(h).trim());
    console.log("Parsed headers:", headers);

    const callSignIdx = 0;
    const facIdIdx = 1;
    const facTypeIdx = 2;
    const cityIdx = 3;
    const stateIdx = 4;
    const licenseeIdx = 5;
    const netIdx = 6;
    const rfChannelIdx = 7;
    const virtualChannelIdx = 8;
    const dmaIdx = 9;

    const stationsByState: Record<string, BroadcastStationDoc[]> = {};
    let totalParsed = 0;

    for (let i = 2; i < rawRows.length; i++) {
      const row = rawRows[i];
      if (!row || row.length < 5) continue;

      const callSign = String(row[callSignIdx] || "").trim();
      const stateAbbr = String(row[stateIdx] || "").trim().toUpperCase();

      if (!callSign || !stateAbbr || !STATE_ABBR_TO_SLUG[stateAbbr]) continue;

      const facId = Number(row[facIdIdx]) || 0;
      const rawFacType = String(row[facTypeIdx] || "").trim().toUpperCase();
      const facType = rawFacType.includes("EDT") ? "Educational / Non-Commercial" : "Commercial Broadcast";

      const city = toTitleCase(String(row[cityIdx] || ""));
      const licensee = toTitleCase(String(row[licenseeIdx] || ""));
      const network = String(row[netIdx] || "INDEPENDENT").trim().toUpperCase();
      const rfChannel = Number(row[rfChannelIdx]) || 0;
      const virtualChannel = Number(row[virtualChannelIdx]) || 0;
      const dma = toTitleCase(String(row[dmaIdx] || ""));

      const stationDoc: BroadcastStationDoc = {
        callSign,
        facilityId: facId,
        type: facType,
        city,
        state: stateAbbr,
        licensee,
        network,
        rfChannel,
        virtualChannel,
        dma
      };

      if (!stationsByState[stateAbbr]) {
        stationsByState[stateAbbr] = [];
      }
      stationsByState[stateAbbr].push(stationDoc);
      totalParsed++;
    }

    console.log(`Successfully parsed ${totalParsed} FCC broadcast stations across ${Object.keys(stationsByState).length} states.`);

    const LocationModel = mongoose.models.Location || mongoose.model("Location", new mongoose.Schema({}, { strict: false }));

    let updatedStatesCount = 0;
    for (const [stateAbbr, stations] of Object.entries(stationsByState)) {
      const stateSlug = STATE_ABBR_TO_SLUG[stateAbbr];
      if (!stateSlug) continue;

      const result = await LocationModel.updateOne(
        { slug: stateSlug, type: "state" },
        {
          $set: {
            broadcastStations: stations
          }
        },
        { upsert: true }
      );

      if (result.acknowledged) {
        updatedStatesCount++;
        console.log(` -> Seeded ${stateAbbr} (${stateSlug}): ${stations.length} broadcast stations.`);
      }
    }

    console.log(`\nImport complete! ${updatedStatesCount} state location records populated with FCC broadcast stations.`);
    process.exit(0);
  } catch (err: any) {
    console.error("Import failed with error:", err);
    process.exit(1);
  }
}

importFccStations();
