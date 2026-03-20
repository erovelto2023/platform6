import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const stateBoardUrls: Record<string, string> = {
  "Alabama": "https://www.asbpa.alabama.gov/",
  "Alaska": "https://nasba.org/exams/cpaexam/alaska/",
  "Arizona": "https://www.azaccountancy.gov/Exam/FAQs.aspx#Q2",
  "Arkansas": "https://www.asbpa.arkansas.gov/cpa-exam/",
  "California": "https://dca.ca.gov/cba/applicants/cpa_exam_quick_tips.pdf",
  "Colorado": "https://dpo.colorado.gov/Accountancy/Applications",
  "Connecticut": "https://portal.ct.gov/DCP/Occupational-and-Professional-Division/Occupational--Profess/Certified-Public-Accountants#edexam",
  "Delaware": "https://dpr.delaware.gov/boards/accountancy/",
  "District of Columbia": "https://dcra.dc.gov/node/1423866",
  "Florida": "http://www.myfloridalicense.com/DBPR/certified-public-accounting/education-requirements/",
  "Georgia": "https://gsba.georgia.gov/",
  "Hawaii": "https://cca.hawaii.gov/pvl/boards/accountancy/",
  "Idaho": "https://isba.idaho.gov/ISBAPortal/BoardAdditional.aspx?Board=ISBA&BoardLinkID=700",
  "Illinois": "https://www.ilboe.org/education-requirements/",
  "Indiana": "https://www.in.gov/pla/professions/indiana-board-of-accountancy/",
  "Iowa": "https://plb.iowa.gov/board/accountants/faqs",
  "Kansas": "https://ksboa.kansas.gov/cpa-exam-info/cpa-exam-qa/",
  "Kentucky": "https://cpa.ky.gov/examcandidates/Pages/Exam-Requirements.aspx",
  "Louisiana": "http://cpaboard.state.la.us/what-is-the-%e2%80%9c150-hour-requirement%e2%80%9d-that-is-what-are-the-educational-requirements-to-qualify-to-sit-for-the-cpa-exam/",
  "Maine": "https://www.maine.gov/pfr/professionallicensing/professions/accountancy/licensing/public-accountant-and-certified-public-accountant",
  "Maryland": "https://www.dllr.state.md.us/license/cpa/cpaexam/cpaexameducreq.shtml",
  "Michigan": "https://www.michigan.gov/lara/bureau-list/bpl/occ/prof/accountancy",
  "Minnesota": "https://boa.state.mn.us/",
  "Mississippi": "https://www.msbpa.ms.gov/",
  "Missouri": "https://nasba.org/exams/cpaexam/missouri/",
  "Montana": "https://boards.bsd.dli.mt.gov/public-accountants/license-information/",
  "Nebraska": "https://nbpa.nebraska.gov/",
  "Nevada": "https://www.nvaccountancy.com/exam_education.fx",
  "New Hampshire": "https://nasba.org/licensure/nasbalicensing/new-hampshire/",
  "New Jersey": "https://www.njconsumeraffairs.gov/acc/Pages/applications.aspx",
  "New Mexico": "https://www.rld.nm.gov/boards-and-commissions/individual-boards-and-commissions/accountancy/instructors-training-requirements-and-continuing-education/",
  "New York": "https://www.op.nysed.gov/certified-public-accountants",
  "North Carolina": "https://nccpaboard.gov/applicants/exam-applicants/#heading-3",
  "North Dakota": "https://www.ndsba.nd.gov/requirements-become-cpa",
  "Ohio": "https://acc.ohio.gov/becoming-licensed",
  "Oklahoma": "https://oklahoma.gov/oab/departments/examination/new-applicant-information.html",
  "Oregon": "https://www.oregon.gov/BOA/Pages/License-Application-Requirements.aspx",
  "Pennsylvania": "https://www.dos.pa.gov/ProfessionalLicensing/BoardsCommissions/Accountancy/Pages/CPA-licensure-requirements-snapshot.aspx",
  "Puerto Rico": "https://nasba.org/exams/cpaexam/puertorico/",
  "Rhode Island": "https://dbr.ri.gov/documents/divisions/accountancy/BOA-Frequently-Asked-Questions.pdf",
  "South Carolina": "https://llr.sc.gov/acct/Info/CPAExamSittingReqs.aspx",
  "South Dakota": "https://dlr.sd.gov/accountancy/cpa_exam.aspx#eligibility",
  "Tennessee": "https://www.tn.gov/commerce/regboards/accountancy/license-applicant-resources/licensing-requirements-exams.html",
  "Texas": "https://www.tsbpa.texas.gov/exam-qualification/examination-requirements.html",
  "Utah": "https://nasba.org/exams/cpaexam/utah/?openform&038%3Bstateabbrev=UT",
  "Vermont": "https://sos.vermont.gov/accountancy/forms-instructions/",
  "Virgin Islands": "https://dlca.vi.gov/boardcertifications/steps/cparequirements/",
  "Virginia": "https://boa.virginia.gov/",
  "Washington": "https://acb.wa.gov/",
  "West Virginia": "https://www.boa.wv.gov/exam/ExamFAQ.asp",
  "Wisconsin": "https://dsps.wi.gov/Pages/Professions/Accountant/Default.aspx",
  "Wyoming": "https://sites.google.com/a/wyo.gov/wyoming-cpa/exam-info"
};

const CPAListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  jurisdiction: { type: String },
  state: { type: String, required: true },
  boardUrl: { type: String }, // NEW FIELD
}, { timestamps: true, strict: false });

const CPAListing = mongoose.models.CPAListing || mongoose.model("CPAListing", CPAListingSchema);

async function updateStateUrls() {
  console.log("🚀 Starting CPA Board URL updates...");
  
  try {
    const mongoUri = process.env.MONGODB_URI;
    if (!mongoUri) throw new Error("MONGODB_URI not found");

    await mongoose.connect(mongoUri);
    console.log("Connected to MongoDB.");

    let updatedCount = 0;
    
    for (const [stateName, url] of Object.entries(stateBoardUrls)) {
      console.log(`Updating all records for State/Jurisdiction: ${stateName} with URL: ${url}`);
      
      const result = await CPAListing.updateMany(
        { 
          $or: [
            { jurisdiction: new RegExp(`^${stateName}$`, 'i') }, 
            { state: new RegExp(`^${stateName}$`, 'i') },
            // match state abbrev for WA etc if used
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
