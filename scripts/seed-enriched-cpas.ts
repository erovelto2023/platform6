import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const CPAListingSchema = new mongoose.Schema({
  name: { type: String, required: true },
  firmName: { type: String },
  licenseNumber: { type: String },
  jurisdiction: { type: String },
  licenseStatus: { type: String },
  address: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipCode: { type: String },
  phone: { type: String },
  fax: { type: String },
  website: { type: String },
  email: { type: String },
  services: { type: [String], default: [] },
  notes: { type: String },
  isFirm: { type: Boolean, default: false },
  slug: { type: String, required: true },
  boardUrl: { type: String },
}, { timestamps: true });

const CPAListing = mongoose.models.CPAListing || mongoose.model("CPAListing", CPAListingSchema);

// ─── ENRICHED CPA DATA ────────────────────────────────────────────────────────
const enrichedData = [
  // ── ALABAMA ──
  {
    licenseNumber: "6090", name: "Warren Averett, LLC", city: "Birmingham", state: "AL",
    address: "2500 Acton Rd #200, Birmingham, AL 35243", phone: "(205) 979-4100",
    fax: "(205) 979-6313", email: "contact@warrenaverett.com", website: "https://warrenaverett.com",
    licenseStatus: "Active", notes: "Verified via firm website and multiple business directories. Primary contact: Brooke Booth (brooke.booth@warrenaverett.com).",
    isFirm: true,
  },
  {
    licenseNumber: "4045", name: "Jackie G. U. Hobbs, CPA", city: "Huntsville", state: "AL",
    licenseStatus: "Unverified", notes: "Limited public web presence. LinkedIn profile exists but lists Seattle, WA location. Official license record maintained by Alabama State Board of Public Accountancy.",
    isFirm: false,
  },
  // ── ALASKA ──
  {
    licenseNumber: "5303", name: "Stevens, Reppel & Saur, Inc.", city: "Anchorage", state: "AK",
    address: "3900 Arctic Blvd, Ste 202, Anchorage, AK 99503", phone: "(907) 569-6060",
    licenseStatus: "Unverified", notes: "Firm name may have evolved. Related entities: 'Stevens, Reppel, Saur & Vieira' (Yelp) and 'Stevens Group CPAs' at 327 E Fireweed Ln Ste 201, Anchorage, AK 99503 with website https://stevensgroupcpas.com. Verify via Alaska Board.",
    isFirm: true,
  },
  {
    licenseNumber: "47110", name: "RJG, A Professional Corporation", city: "Fairbanks", state: "AK",
    address: "1100 West Barnette Street, Suite 102, Fairbanks, AK 99701-4540", phone: "(907) 452-4156",
    fax: "(907) 452-3156", website: "https://www.rjgcpa.com",
    licenseStatus: "Active", notes: "Verified via Alaska Society of CPAs directory, Fairbanks Chamber of Commerce, and AGC Alaska member directory. Full-service tax, accounting, and business consulting firm.",
    isFirm: true,
  },
  // ── ARIZONA ──
  {
    licenseNumber: "43386", name: "Karen O. Esson, CPA", city: "Buckeye", state: "AZ",
    licenseStatus: "Unverified", notes: "Limited public presence. Verify license via Arizona Board: https://www.azaccountancy.gov", isFirm: false,
  },
  {
    licenseNumber: "5179", name: "Mueller & Co., PS", city: "Buckeye", state: "AZ",
    licenseStatus: "Unverified", notes: "Name may reference Michigan/Washington firms with similar names. Verify via Arizona Board.", isFirm: true,
  },
  {
    licenseNumber: "5879", name: "Account on Wheels", city: "Cochise", state: "AZ",
    address: "2220 N Highway 191, Cochise, AZ 85606", phone: "(520) 507-6425",
    licenseStatus: "Unverified", notes: "Listed via PTIN Directory with Candace J. Egger, CPA. Verify via Arizona Board.", isFirm: true,
  },
  {
    licenseNumber: "48518", name: "Danielle R. Chavali, CPA, PLLC", city: "Mesa", state: "AZ",
    address: "4839 S Rhodium Ln, Mesa, AZ 85212", phone: "(206) 801-0099",
    licenseStatus: "Unverified", notes: "Address via Bizapedia; phone via Washington Society of CPAs directory. Verify via Arizona Board.", isFirm: true,
  },
  {
    licenseNumber: "263", name: "Kirchner & Jordan CPA PS", city: "Oracle", state: "AZ",
    licenseStatus: "Unverified", notes: "Firm appears primarily associated with Spokane, WA. Verify Arizona license via state board.", isFirm: true,
  },
  {
    licenseNumber: "6009", name: "Baldwin Moffitt PLLC", city: "Phoenix", state: "AZ",
    address: "11811 N Tatum Blvd, Ste 2600, Phoenix, AZ 85028", phone: "(480) 951-1416",
    licenseStatus: "Unverified", notes: "Yelp listing shows phone/address. Related entity: Baldwin Moffitt Behm LLP (Scottsdale).", isFirm: true,
  },
  {
    licenseNumber: "6349", name: "Alison Buren CPA PLLC", city: "Phoenix", state: "AZ",
    phone: "(425) 444-4977", licenseStatus: "Unverified",
    notes: "Phone via people search; LinkedIn shows Redmond, WA location. Verify Arizona license status.", isFirm: true,
  },
  {
    licenseNumber: "3661", name: "Brad Miller, CPA", city: "Phoenix", state: "AZ",
    licenseStatus: "Unverified", notes: "Multiple Brad Miller CPAs exist; LinkedIn profile shows Phoenix location. Requires board verification.", isFirm: false,
  },
  {
    licenseNumber: "50935", name: "Baldwin Moffitt Behm LLP", city: "Scottsdale", state: "AZ",
    licenseStatus: "Unverified", notes: "Firm profile on PitchBook/LinkedIn. No direct website found. Verify via Arizona Board.", isFirm: true,
  },
  {
    licenseNumber: "2268", name: "Richard J. Koopmans, Inc., PS", city: "Surprise", state: "AZ",
    address: "Bell Road #153, Surprise, AZ 85374", phone: "(425) 785-3192", email: "koops@phiwater.com",
    licenseStatus: "Unverified", notes: "Address/email via WA state documents. Primary practice may be in Washington. Verify Arizona license.", isFirm: true,
  },
  {
    licenseNumber: "46089", name: "Patricia Molnar, PS", city: "Tucson", state: "AZ",
    phone: "(520) 825-7991", licenseStatus: "Unverified",
    notes: "Phone via public records search; LinkedIn shows Redmond, WA. Verify via Arizona Board.", isFirm: true,
  },
  {
    licenseNumber: "6542", name: "Peter A Slowiaczek, PC", city: "Tucson", state: "AZ",
    phone: "(253) 581-9900", email: "peteslow@attorney-cpa.com",
    licenseStatus: "Unverified", notes: "Contact info via people search. Website domain not verified. Requires board confirmation.", isFirm: true,
  },
  {
    licenseNumber: "6353", name: "Elizabeth Loveland CPA", city: "Tucson", state: "AZ",
    address: "6500 E Wood Lily Ct, Tucson, AZ 85750",
    licenseStatus: "Unverified", notes: "Address via PTIN Directory. No public website found.", isFirm: false,
  },
  {
    licenseNumber: "4191", name: "Kerry A White CPA", city: "Tucson", state: "AZ",
    licenseStatus: "Unverified", notes: "LinkedIn shows Tucson location & Tomlinson Financial Group affiliation. Verify license via Arizona Board.", isFirm: false,
  },
  {
    licenseNumber: "47612", name: "M. Cloutier CPA PLLC", city: "Tucson", state: "AZ",
    address: "Tucson, AZ 85757", phone: "(360) 778-9028", email: "michele@mycpacga.com",
    licenseStatus: "Unverified", notes: "Contact via Tucson Business Networking directory; Yelp shows alternate phone (360) 332-4971. BBB lists Arizona Board contact.", isFirm: true,
  },
  // ── CALIFORNIA ──
  {
    licenseNumber: "6617", name: "Miller Kaplan Arase LLP", city: "Burbank", state: "CA",
    address: "3900 W Alameda Ave, Ste 2400, Burbank, CA 91505", phone: "(818) 769-2010",
    website: "https://www.millerkaplan.com", licenseStatus: "Active",
    notes: "Verified via firm website and ZoomInfo. Member of LEA Global.", isFirm: true,
  },
  {
    licenseNumber: "47258", name: "Turner Warren Hwang & Conrad AC", city: "Burbank", state: "CA",
    address: "100 N First St, Ste 202, Burbank, CA 91502", phone: "(818) 954-9700",
    email: "cpa@twhc.com", website: "https://www.twhc.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. Established 1987.", isFirm: true,
  },
  {
    licenseNumber: "6043", name: "SCS Global Professionals, LLP", city: "Burlingame", state: "CA",
    website: "https://scsglobal.us", licenseStatus: "Unverified",
    notes: "International accounting firm serving US/Japan clients. Verify via CA Board.", isFirm: true,
  },
  {
    licenseNumber: "48034", name: "Yus CPA Corp.", city: "Corona", state: "CA",
    licenseStatus: "Unverified", notes: "Limited public presence. Verify via CA Board: https://www.cba.ca.gov", isFirm: true,
  },
  {
    licenseNumber: "6049", name: "Rogers, Clem & Company", city: "Covina", state: "CA",
    licenseStatus: "Unverified", notes: "Verify license status via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "48011", name: "SRG LLP", city: "Encino", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "48060", name: "Schild & Co., Inc.", city: "Fountain Valley", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "5682", name: "Cassabon Fung, LLP", city: "Fresno", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6305", name: "Squar Milner LLP", city: "Irvine", state: "CA",
    address: "18500 Von Karman Ave, Fl 10, Irvine, CA 92612", phone: "(949) 222-2999",
    website: "https://www.squarmilner.com", licenseStatus: "Active",
    notes: "Now part of Baker Tilly. Verified via LinkedIn and Yelp.", isFirm: true,
  },
  {
    licenseNumber: "6431", name: "Davis Farr LLP", city: "Irvine", state: "CA",
    address: "18201 Von Karman Ave, Ste 1100, Irvine, CA 92612", phone: "(949) 474-2020",
    website: "https://www.davisfarr.com", licenseStatus: "Active",
    notes: "Verified via LinkedIn and firm website. Offices in Irvine, Carlsbad, WA.", isFirm: true,
  },
  {
    licenseNumber: "6316", name: "Haskell & White LLP", city: "Irvine", state: "CA",
    address: "300 Spectrum Center Dr, Ste 300, Irvine, CA 92618", phone: "(949) 450-6200",
    fax: "(714) 426-0226", email: "inquiries@hwcpa.com", website: "https://www.hwcpa.com",
    licenseStatus: "Active", notes: "Verified via firm website and Yelp. Also has San Diego office.", isFirm: true,
  },
  {
    licenseNumber: "47609", name: "PK LLP", city: "Irvine", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "54844", name: "RJI Ramirez Jimenez International CPA's", city: "Irvine", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "45461", name: "Deborah Hoskinson, CPA, PS", city: "Laguna Niguel", state: "CA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via CA Board.", isFirm: false,
  },
  {
    licenseNumber: "5939", name: "Holthouse Carlin & Van Trigt LLP", city: "Los Angeles", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6642", name: "KBK Management, LLC", city: "Los Angeles", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "5325", name: "Macias Gini & O'Connell LLP", city: "Los Angeles", state: "CA",
    address: "2121 Avenue of the Stars, Los Angeles, CA 90067", phone: "(310) 557-5000",
    website: "https://www.mgocpa.com", licenseStatus: "Active",
    notes: "Verified via LinkedIn and Forbes. Top 50 US CPA firm.", isFirm: true,
  },
  {
    licenseNumber: "5422", name: "Matson, Driscoll & Damico", city: "Los Angeles", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "54845", name: "SingerLewak LLP", city: "Los Angeles", state: "CA",
    address: "10960 Wilshire Blvd, Ste 1100, Los Angeles, CA 90024", phone: "(310) 477-3924",
    fax: "(818) 999-9225", website: "https://www.singerlewak.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. Offices in LA, Woodland Hills, Riverside.", isFirm: true,
  },
  {
    licenseNumber: "47972", name: "LTSP, Inc.", city: "Newport Beach", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "6528", name: "Alvarez & Associates, Inc., Certified Public Accountants", city: "Northridge", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "46870", name: "Breard & Associates, Inc.", city: "Northridge", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "5517", name: "Spiegel Accountancy Corp.", city: "Pleasant Hill", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6203", name: "Swenson Accountancy Corporation", city: "Rancho Cucamonga", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "5725", name: "Vavrinek, Trine, Day & Co., LLP", city: "Rancho Cucamonga", state: "CA",
    address: "8270 Aspen St, Rancho Cucamonga, CA 91730", phone: "(909) 466-4410",
    website: "http://www.vtdcpa.com", licenseStatus: "Active",
    notes: "Now Eide Bailly LLP. Verified via Yelp and RocketReach.", isFirm: true,
  },
  {
    licenseNumber: "46693", name: "Gallina LLP", city: "Roseville", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "47114", name: "Matthew I Fogler, CPA", city: "Roseville", state: "CA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via CA Board.", isFirm: false,
  },
  {
    licenseNumber: "47960", name: "Wendy J Salgado CPA", city: "Redding", state: "CA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via CA Board.", isFirm: false,
  },
  {
    licenseNumber: "5737", name: "Propp Christensen Caniglia LLP", city: "Roseville", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6222", name: "BFBA, LLP", city: "Sacramento", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "47257", name: "James Marta & Company, LLP", city: "Sacramento", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "5532", name: "Weworski & Associates", city: "San Diego", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6439", name: "BPM LLP, DBA BPM LLP of Washington", city: "San Francisco", state: "CA",
    address: "One California St, Ste 2500, San Francisco, CA 94111", phone: "(415) 421-5757",
    website: "https://www.bpm.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. Top 50 US accounting firm.", isFirm: true,
  },
  {
    licenseNumber: "5870", name: "Hood & Strong LLP", city: "San Francisco", state: "CA",
    address: "275 Battery St, Ste 900, San Francisco, CA 94111",
    website: "https://www.hoodstrong.com", licenseStatus: "Active",
    notes: "Founded 1917. Verified via firm website and ClearlyRated.", isFirm: true,
  },
  {
    licenseNumber: "4747", name: "Novogradac & Company LLP", city: "San Francisco", state: "CA",
    address: "1160 Battery St, Ste 225, San Francisco, CA 94111", phone: "(415) 356-8000",
    website: "https://www.novoco.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. Specializes in affordable housing/tax credits.", isFirm: true,
  },
  {
    licenseNumber: "48176", name: "Spott, Lucey & Wall Inc. CPAs", city: "San Francisco", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "6346", name: "S D Mayer and Associates LLP", city: "San Francisco", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "4888", name: "Matsumoto & Associates", city: "San Jose", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "55315", name: "Caliber Audit & Attest, LLP", city: "San Luis Obispo", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "6592", name: "Armanino LLP", city: "San Ramon", state: "CA",
    address: "2700 Camino Ramon, Ste 350, San Ramon, CA 94583", phone: "(925) 790-2600",
    email: "info@armanino.com", website: "https://www.armanino.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. Top 20 independent accounting firm.", isFirm: true,
  },
  {
    licenseNumber: "4718", name: "Lindquist LLP", city: "San Ramon", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6386", name: "Bessolo & Haworth, LLP", city: "Sherman Oaks", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  {
    licenseNumber: "6097", name: "Farber Hass Hurley LLP", city: "Valencia", state: "CA",
    address: "28494 Westinghouse Pl, Ste 102, Valencia, CA 91355", phone: "(661) 257-6671",
    website: "https://fhhcpas.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. PCAOB registered.", isFirm: true,
  },
  {
    licenseNumber: "6481", name: "Dave Banerjee CPA, An Accountancy Corporation", city: "Woodland Hills", state: "CA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via CA Board.", isFirm: true,
  },
  {
    licenseNumber: "5851", name: "Gumbiner Savett Inc.", city: "Santa Monica", state: "CA",
    address: "1723 Cloverfield Blvd, Santa Monica, CA 90404",
    licenseStatus: "Acquired", notes: "Acquired by BPM LLP in 2021. Verify current status via CA Board.", isFirm: true,
  },
  {
    licenseNumber: "6467", name: "Rushall, Reital & Randall Accountancy Corporation", city: "Solana Beach", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "5984", name: "Jung Hur Czarnecki, CPA", city: "Sun Valley", state: "CA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via CA Board.", isFirm: false,
  },
  {
    licenseNumber: "5931", name: "BHLF LLP", city: "Walnut Creek", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board firm search.", isFirm: true,
  },
  {
    licenseNumber: "6627", name: "Rina Accountancy LLP", city: "Walnut Creek", state: "CA",
    licenseStatus: "Unverified", notes: "Verify via CA Board License Lookup.", isFirm: true,
  },
  // ── COLORADO ──
  {
    licenseNumber: "6047", name: "Osborne, Parsons & Rosacker, LLP", city: "Colorado Springs", state: "CO",
    address: "601 N Nevada Ave, Colorado Springs, CO 80903", phone: "(719) 636-2321",
    email: "colleen@springscpa.com", website: "http://www.springscpa.com", licenseStatus: "Active",
    notes: "Verified via Yelp and Nextdoor. Full-service CPA firm in Colorado Springs.", isFirm: true,
  },
  {
    licenseNumber: "47066", name: "GHP Horwath, PC", city: "Denver", state: "CO",
    address: "1801 California Street, Suite 2200, Denver, CO 80202", phone: "(303) 831-5000",
    website: "www.croweghphorwath.com", licenseStatus: "Acquired",
    notes: "Now part of Crowe LLP. Former member of Crowe Global network. Verify current status via Colorado Board.", isFirm: true,
  },
  {
    licenseNumber: "4903", name: "Fortner Bayens, P.C.", city: "Denver", state: "CO",
    address: "1580 N Lincoln Street, Suite 700, Denver, CO 80203", phone: "(303) 296-6033",
    email: "info@fbl.cpa", website: "https://fbl.cpa/", licenseStatus: "Active",
    notes: "Specializes in financial institution services. Verified via LinkedIn and firm website.", isFirm: true,
  },
  {
    licenseNumber: "5767", name: "Linford & Company LLP", city: "Denver", state: "CO",
    website: "https://linfordco.com/", licenseStatus: "Active",
    notes: "Denver-based firm specializing in SOC, HIPAA, FedRAMP auditing. Former Big Four auditors. Verify address via Colorado Board.", isFirm: true,
  },
  {
    licenseNumber: "4912", name: "Spicer Jeffries LLP", city: "Denver", state: "CO",
    address: "4601 DTC Blvd, Suite 700, Denver, CO 80237", phone: "(303) 753-1959",
    fax: "(303) 753-0338", website: "spicerjeffries.com", licenseStatus: "Acquired",
    notes: "Now part of Cherry Bekaert. Serves broker-dealers and hedge funds. Headquarters contact via SEC filing.", isFirm: true,
  },
  {
    licenseNumber: "5247", name: "Richey, May & Co., LLP", city: "Englewood", state: "CO",
    address: "9780 S Meridian Blvd, Ste 500, Englewood, CO 80112", phone: "(303) 721-6131",
    website: "https://www.richeymay.com", licenseStatus: "Active",
    notes: "Verified via LinkedIn and firm contact page. Accounting and advisory firm with multiple locations.", isFirm: true,
  },
  {
    licenseNumber: "6227", name: "Artesian CPA, LLC", city: "Golden", state: "CO",
    address: "4915 Easley Rd, Golden, CO 80403", phone: "(877) 968-3330",
    email: "info@artesiancpa.com", website: "https://artesiancpa.com", licenseStatus: "Active",
    notes: "Boutique CPA firm specializing in nonprofit sector. IRS e-file provider. Contact: Craig Denlinger.", isFirm: true,
  },
  // ── FLORIDA ──
  {
    licenseNumber: "2940", name: "Laura J. Doughty, CPA", city: "Anna Maria", state: "FL",
    address: "PO Box 922, Anna Maria, FL 34216", phone: "(941) 778-2722",
    email: "laura.doughty@saltwaterinc.com", licenseStatus: "Unverified",
    notes: "Listed via PTIN Directory and tax preparer directories. Verify license via Florida Board.", isFirm: false,
  },
  {
    licenseNumber: "340", name: "Robert A. Neiman, CPA", city: "Delray Beach", state: "FL",
    address: "16556 Gateway Bridge Dr, Delray Beach, FL 33446", phone: "(516) 680-1653",
    fax: "(866) 823-1800", email: "bob@bobneiman.com", website: "https://www.bobneiman.com",
    licenseStatus: "Active", notes: "Verified via firm website and Florida Institute of CPAs referral. Also operates Neiman Wealth Management LLC.", isFirm: false,
  },
  {
    licenseNumber: "6388", name: "Amanda M Taylor, CPA", city: "Deltona", state: "FL",
    address: "PO Box 390401, Deltona, FL 32739", email: "amandamtaylorcpa@gmail.com",
    licenseStatus: "Unverified", notes: "Email via Oregon municipal auditor roster. Sole proprietorship. Verify via Florida Board.", isFirm: false,
  },
  {
    licenseNumber: "5813", name: "James P. Haas, CPA LLC", city: "Fort Myers", state: "FL",
    address: "11741 Palm Beach Blvd, Unit 202, Fort Myers, FL 33905", phone: "(239) 337-0333",
    website: "https://cpataxusa.com", licenseStatus: "Active",
    notes: "Verified via Yelp and firm website. Serving clients since 1990.", isFirm: true,
  },
  {
    licenseNumber: "5574", name: "Myers Brettholtz & Company PA", city: "Fort Myers", state: "FL",
    address: "12671 Whitehall Dr, Fort Myers, FL 33907", phone: "(239) 939-5775",
    fax: "(239) 939-0808", email: "mbcopa@mbcopa.com", website: "https://www.mbcopa.com",
    licenseStatus: "Active", notes: "Verified via firm website and Florida Institute of CPAs directory. Full-service CPA firm.", isFirm: true,
  },
  {
    licenseNumber: "6540", name: "Accountology PLLC", city: "Gainesville", state: "FL",
    licenseStatus: "Unverified", notes: "Name may reference Accountology Bookkeeping Solutions (Orlando-based). Verify Florida license via state board.", isFirm: true,
  },
  {
    licenseNumber: "6176", name: "Ohab and Company, PA", city: "Maitland", state: "FL",
    address: "100 E Sybelia Ave, Ste 130, Maitland, FL 32751", phone: "(407) 545-6668",
    website: "https://www.ohabco.com", licenseStatus: "Active",
    notes: "Verified via Yelp and BBB profile. Orlando-area CPA firm established 1993.", isFirm: true,
  },
  {
    licenseNumber: "6208", name: "BAS Partners LLC", city: "Pembroke Pines", state: "FL",
    address: "15800 Pines Blvd, Ste 3002, Pembroke Pines, FL 33027", phone: "(954) 362-5195",
    website: "http://baspartners.com", licenseStatus: "Withdrawn",
    notes: "PCAOB registration withdrawn. Verify current Florida license status via state board.", isFirm: true,
  },
  {
    licenseNumber: "56600", name: "Counting Consultants Inc.", city: "Pinellas Park", state: "FL",
    address: "6235 66th St, Pinellas Park, FL 33781", licenseStatus: "Active",
    notes: "Entity registered with Florida Division of Corporations. Limited public web presence.", isFirm: true,
  },
  {
    licenseNumber: "6054", name: "360 Advanced, Inc.", city: "Saint Petersburg", state: "FL",
    address: "200 1st Ave S, Saint Petersburg, FL 33701", website: "https://360advanced.com",
    licenseStatus: "Active", notes: "Licensed CPA firm (FL #AD67897) specializing in cybersecurity compliance. PCAOB registered.", isFirm: true,
  },
  {
    licenseNumber: "47695", name: "Price and Associates CPAs, LLC", city: "Tampa", state: "FL",
    address: "400 N Ashley Dr, Ste 1325, Tampa, FL 33602", licenseStatus: "Active",
    notes: "Also operates as A-LIGN Assurance. PCAOB registered firm. Verify via Florida Board.", isFirm: true,
  },
  {
    licenseNumber: "3947", name: "PricewaterhouseCoopers, LLP", city: "Tampa", state: "FL",
    address: "4040 W Boy Scout Blvd, 10th Floor, Tampa, FL 33607", phone: "(813) 229-0221",
    website: "https://www.pwc.com", licenseStatus: "Active",
    notes: "Global Big Four firm. Tampa office verified via PwC directory and Yelp.", isFirm: true,
  },
  {
    licenseNumber: "53826", name: "PwC US Business Advisory LLP", city: "Tampa", state: "FL",
    address: "4040 W Boy Scout Blvd, Tampa, FL 33607", phone: "(813) 229-0221",
    website: "https://www.pwc.com", licenseStatus: "Active",
    notes: "PwC entity for business advisory services. Same Tampa address as parent firm.", isFirm: true,
  },
  {
    licenseNumber: "53825", name: "PwC US Group LLP", city: "Tampa", state: "FL",
    address: "4040 W Boy Scout Blvd, Tampa, FL 33607", phone: "(813) 229-0221",
    website: "https://www.pwc.com", licenseStatus: "Active",
    notes: "PwC entity for group services. Same Tampa address as parent firm.", isFirm: true,
  },
  {
    licenseNumber: "53827", name: "PwC US Tax LLP", city: "Tampa", state: "FL",
    address: "4040 W Boy Scout Blvd, Tampa, FL 33607", phone: "(813) 229-0221",
    website: "https://www.pwc.com", licenseStatus: "Active",
    notes: "PwC entity for tax services. Same Tampa address as parent firm.", isFirm: true,
  },
  {
    licenseNumber: "6623", name: "Schellman & Company, LLC", city: "Tampa", state: "FL",
    address: "4010 W Boy Scout Blvd, Ste 600, Tampa, FL 33607", phone: "(866) 254-0000",
    fax: "(888) 456-9704", website: "https://www.schellman.com", licenseStatus: "Active",
    notes: "Licensed CPA firm (FL #AD62941) specializing in IT compliance/SOC audits. PCAOB registered.", isFirm: true,
  },
  {
    licenseNumber: "6207", name: "Templeton & Company, LLP", city: "West Palm Beach", state: "FL",
    address: "222 Lakeview Ave, Ste 1200, West Palm Beach, FL 33401", phone: "(561) 798-9988",
    fax: "(561) 798-4053", website: "https://templetonco.com", licenseStatus: "Active",
    notes: "Verified via Yelp and Florida Institute of CPAs directory. Top South Florida accounting firm.", isFirm: true,
  },
];
// ─────────────────────────────────────────────────────────────────────────────

function createSlug(name: string, city: string, state: string) {
  return `${name} cpa ${city} ${state}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

async function main() {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error("MONGODB_URI is not defined in .env.local");

  await mongoose.connect(mongoUri);
  console.log("✅ Connected to MongoDB.");

  let updated = 0;
  let created = 0;
  const UPDATABLE_FIELDS = ['name','city','state','address','phone','fax','email','website','notes','isFirm','licenseStatus'];

  for (const firm of enrichedData) {
    const update: Record<string, any> = {};
    for (const key of UPDATABLE_FIELDS) {
      const val = (firm as any)[key];
      if (val !== undefined) update[key] = val;
    }

    const query: any = { $or: [] };
    if (firm.licenseNumber) query.$or.push({ licenseNumber: firm.licenseNumber });
    query.$or.push({
      name: new RegExp(`^${firm.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
      city: new RegExp(`^${firm.city.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
    });

    const existing = await CPAListing.findOne(query);
    if (existing) {
      await CPAListing.updateOne({ _id: existing._id }, { $set: update });
      console.log(`🔄 Updated: ${firm.name} (${firm.city}, ${firm.state})`);
      updated++;
    } else {
      const slug = createSlug(firm.name, firm.city, firm.state);
      await CPAListing.create({ ...update, licenseNumber: firm.licenseNumber, slug });
      console.log(`✨ Created: ${firm.name} (${firm.city}, ${firm.state})`);
      created++;
    }
  }

  console.log(`\n🎉 Done! Created: ${created} | Updated: ${updated}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch((err) => {
  console.error("💥 Error:", err);
  process.exit(1);
});
