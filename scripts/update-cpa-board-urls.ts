import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

// User-provided clean mappings
const stateBoardUrls: Record<string, string> = {
  "Alabama": "https://www.asbpa.alabama.gov",
  "Alaska": "https://commerce.alaska.gov/web/cbpl/ProfessionalLicenses/BoardofPublicAccountancy",
  "Arizona": "https://azaccountancy.gov",
  "Arkansas": "https://www.ark.org/asbpa",
  "California": "https://www.cba.ca.gov",
  "Colorado": "https://dpo.colorado.gov/Accountancy",
  "Connecticut": "https://portal.ct.gov/DCP/Professional-Licensing/Accountancy",
  "Delaware": "https://dpr.delaware.gov/boards/accountancy",
  "District of Columbia": "https://dcra.dc.gov/service/accountancy-board",
  "Florida": "https://floridasboardofaccountancy.gov",
  "Georgia": "https://gsba.georgia.gov",
  "Hawaii": "https://cca.hawaii.gov/pvl/boards/accountancy",
  "Idaho": "https://isba.idaho.gov",
  "Illinois": "https://idfpr.illinois.gov", // User provided two for IL. Using the primary regulatory site.
  "Indiana": "https://www.in.gov/pla/accountancy",
  "Iowa": "https://accountancy.iowa.gov",
  "Kansas": "https://ksboa.org",
  "Kentucky": "https://cpa.ky.gov",
  "Louisiana": "https://cpaboard.state.la.us",
  "Maine": "https://www.maine.gov/pfr/professionallicensing/board_opa",
  "Maryland": "https://www.mbon.org",
  "Michigan": "https://www.michigan.gov/lara/bpl/accountancy",
  "Minnesota": "https://mn.gov/accountancy",
  "Mississippi": "https://www.msbpa.ms.gov",
  "Missouri": "https://pr.mo.gov/boards/accountancy",
  "Montana": "https://boards.bsd.dli.mt.gov/accountancy",
  "Nebraska": "https://nebaccountancy.gov",
  "Nevada": "https://nvaccountancy.com",
  "New Hampshire": "https://www.oplc.nh.gov/accountancy",
  "New Jersey": "https://www.njconsumeraffairs.gov/obo",
  "New Mexico": "https://www.rld.nm.gov/accountancy",
  "New York": "https://www.op.nysed.gov/professions/certified-public-accountants",
  "North Carolina": "https://nccpaboard.gov",
  "North Dakota": "https://www.nd.gov/ndaccountancy",
  "Ohio": "https://accountancy.ohio.gov",
  "Oklahoma": "https://oklahoma.gov/oab",
  "Oregon": "https://www.oregon.gov/boa",
  "Pennsylvania": "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/Accountancy",
  "Puerto Rico": "https://ddec.pr.gov/contabilidad",
  "Rhode Island": "https://www.dbr.ri.gov/divisions/board-accountancy",
  "South Carolina": "https://llr.sc.gov/accountancy",
  "South Dakota": "https://sdboraccountancy.gov",
  "Tennessee": "https://www.tn.gov/commerce/regboards/accountancy",
  "Texas": "https://www.tsbpa.texas.gov",
  "Utah": "https://dopl.utah.gov/licensing/types/accountancy",
  "Vermont": "https://sos.vermont.gov/opr/boards/accountancy",
  "Virgin Islands": "https://dlca.vi.gov/boards-commissions/accountancy-board",
  "Virginia": "https://www.dpor.virginia.gov/Boards/Accountancy",
  "Washington": "https://acb.wa.gov",
  "West Virginia": "https://wvboa.wv.gov",
  "Wisconsin": "https://dsps.wisconsin.gov/Boards/Accountancy",
  "Wyoming": "https://cpa.wyo.gov"
};

const CPAListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jurisdiction: { type: String },
  state: { type: String, required: true },
  boardUrl: { type: String },
}, { timestamps: true, strict: false });

const CPAListing = mongoose.models.CPAListing || mongoose.model("CPAListing", CPAListingSchema);

async function updateStateUrls() {
  console.log("🚀 Starting CPA Board URL updates using user-provided list...");
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    let updatedCount = 0;
    
    for (const [stateName, url] of Object.entries(stateBoardUrls)) {
      console.log(`Updating all records for State: ${stateName} with clean URL: ${url}`);
      
      const result = await CPAListing.updateMany(
        { 
          $or: [
            { jurisdiction: new RegExp(`^${stateName}$`, 'i') }, 
            { state: new RegExp(`^${stateName}$`, 'i') },
            { state: stateName === 'Washington' ? 'WA' : undefined }
          ] 
        },
        { $set: { boardUrl: url } }
      );
      
      if (result.matchedCount > 0) {
        console.log(` ✅ Updated ${result.modifiedCount} / ${result.matchedCount} records for ${stateName}`);
        updatedCount += result.modifiedCount;
      }
    }

    console.log(`\n🎉 Update Complete!`);
    console.log(`✅ Total CPAListing records updated: ${updatedCount}`);

  } catch (error) {
    console.error("💥 Error during update:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

updateStateUrls();
