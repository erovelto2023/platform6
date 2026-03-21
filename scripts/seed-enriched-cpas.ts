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
  // ── IOWA ──
  {
    licenseNumber: "5177", name: "Ted McElderry, CPA", city: "Council Bluffs", state: "IA",
    address: "PO Box 1832 / 111 Antioch Dr, Council Bluffs, IA 51502-51503", phone: "(712) 323-6940",
    licenseStatus: "Unverified", notes: "Listed via PTIN Directory and tax preparer directories. Sole proprietorship. Verify via Iowa Board: https://dial.iowa.gov/contacts/accountancy.",
    isFirm: false,
  },
  {
    licenseNumber: "5722", name: "Perkins, Derdowski & Associates, PLLC", city: "Clive", state: "IA",
    address: "2636 NW 160th St, Clive, IA 50325", website: "https://cpa-perkins.com",
    licenseStatus: "Merged", notes: "Firm merged with Elite Accounting & Financial Services, Inc. effective December 2021 per LinkedIn. Founded 1980. Verify current Iowa license status.",
    isFirm: true,
  },
  {
    licenseNumber: "5315", name: "Henry Wood, CPA", city: "Moville", state: "IA",
    address: "324 South St, PO Box 421, Moville, IA 51039", phone: "(712) 873-3191",
    licenseStatus: "Unverified", notes: "Listed via CPAdirectory and Experience.com. Sole proprietorship. Verify via Iowa Board.",
    isFirm: false,
  },
  // ── GEORGIA ──
  {
    licenseNumber: "48102", name: "Aprio, LLP", city: "Atlanta", state: "GA",
    address: "2002 Summit Boulevard, Suite 120, Atlanta, GA 30319", phone: "(404) 892-9651",
    website: "https://www.aprio.com", licenseStatus: "Active",
    notes: "Verified via firm website and MapQuest. Premier CPA-led business advisory firm founded 1952.", isFirm: true,
  },
  {
    licenseNumber: "5222", name: "NDB Accountants & Consultants LLP", city: "Atlanta", state: "GA",
    address: "2897 N Druid Hills Rd NE, Suite 355, Atlanta, GA 30329", phone: "(850) 999-3200",
    website: "https://ndbcpa.com", licenseStatus: "Active",
    notes: "Verified via firm contact page. Specializes in SOC, HITRUST, PCI DSS audits.", isFirm: true,
  },
  {
    licenseNumber: "54248", name: "Melissa D Preston CPA P.C.", city: "Atlanta", state: "GA",
    address: "50 Hurt Plaza SE, Suite 1438, Atlanta, GA 30303", phone: "(404) 217-1742",
    email: "melissa@prestoncpa.com", website: "https://prestoncpa.com", licenseStatus: "Active",
    notes: "Verified via federal contractor profile and firm website. Specializes in gaming/financial services.", isFirm: true,
  },
  {
    licenseNumber: "47558", name: "T. Wayne Owens & Associates, PC", city: "Augusta", state: "GA",
    address: "1005 Broad Street, Suite 302, Augusta, GA 30901", phone: "(800) 745-8233",
    website: "http://www.twocpa.com", licenseStatus: "Acquired",
    notes: "Firm acquired by Stambaugh Ness effective November 2020. Verify current status via Georgia Board.", isFirm: true,
  },
  {
    licenseNumber: "46755", name: "TJS Deemer Dana LLP", city: "Savannah", state: "GA",
    address: "118 Park of Commerce Drive, Suite 200, Savannah, GA 31405", phone: "(912) 238-1001",
    fax: "(912) 238-1701", website: "https://www.symphona.us", licenseStatus: "Rebranded",
    notes: "Now operates as Symphona following merger. Full-service CPA firm with multiple GA locations.", isFirm: true,
  },
  // ── ID ──
  {
    licenseNumber: "5420", name: "David Munson & Associates LLC", city: "Boise", state: "ID",
    address: "514 S Orchard St, Suite 102, Boise, ID 83705",
    phone: "(208) 384-1914",
    website: "https://www.cpadma.com",
    licenseStatus: "Active", notes: "Full-service accounting and tax firm. Online payments via CPACharge .",
    isFirm: true,
  },
  {
    licenseNumber: "46354", name: "Eide Bailly LLP", city: "Boise", state: "ID",
    address: "877 W Main St, Ste 800, Boise, ID 83702-5858",
    phone: "(208) 344-7150",
    fax: "(208) 344-7435",
    website: "https://www.eidebailly.com",
    licenseStatus: "Active", notes: "Top 25 national CPA firm with local Boise presence. Contact: Brad Berls, Partner/Idaho Market Leader .",
    isFirm: true,
  },
  {
    licenseNumber: "6258", name: "Chatters, Metzger & Co., PLLC", city: "Coeur d'Alene", state: "ID",
    address: "243 W Sunset Ave, Coeur d'Alene, ID 83815",
    phone: "(208) 415-0311",
    website: "https://www.coeurdaleneaccountant.com",
    licenseStatus: "Active", notes: "Full-service CPA firm serving families and businesses in North Idaho .",
    isFirm: true,
  },
  {
    licenseNumber: "6387", name: "Kimberly S Knapp, CPA", city: "Lewiston", state: "ID",
    email: "kimberly.knapp@cbjohnson.com",
    licenseStatus: "Unverified", notes: "LinkedIn shows affiliation with CB Johnson & Associates, PLLC in Lewiston . Verify via Idaho Board.",
    isFirm: false,
  },
  {
    licenseNumber: "2588", name: "Jurgens & Co., P.A.", city: "Lewiston", state: "ID",
    address: "38 5th Street, Lewiston, ID 83501",
    phone: "(208) 746-3611",
    email: "sharonbenscoter@jurgensco.com",
    website: "https://www.jurgensco.com",
    licenseStatus: "Active", notes: "Established 1961. Eight CPAs serving agriculture, banking, healthcare, manufacturing .",
    isFirm: true,
  },
  {
    licenseNumber: "488", name: "Ed Carson, CPA", city: "Middleton", state: "ID",
    address: "9895 Meadow Park Blvd, Middleton, ID 83644",
    licenseStatus: "Unverified", notes: "Listed via tax preparer directories . LinkedIn shows Yakima, WA location . Verify Idaho license.",
    isFirm: false,
  },
  {
    licenseNumber: "3943", name: "Hayden & Ross, P.A.", city: "Moscow", state: "ID",
    address: "315 S Almon St, Moscow, ID 83843",
    phone: "(208) 882-5547",
    website: "https://haydenross.com",
    licenseStatus: "Active", notes: "Locally owned since 1938. Full-service CPA and wealth management .",
    isFirm: true,
  },
  {
    licenseNumber: "5796", name: "Terry Mensonides, CPA", city: "Nampa", state: "ID",
    address: "PO Box 1602, Nampa, ID 83653",
    phone: "(208) 250-4952",
    email: "terry@mensonidescpa.com",
    website: "https://mensonidescpa.com",
    licenseStatus: "Active", notes: "CGMA designation. Member ISCPA/AICPA. Specializes in tax planning and consulting .",
    isFirm: false,
  },
  {
    licenseNumber: "2237", name: "Richard D. Green, CPA", city: "Rexburg", state: "ID",
    address: "1750 W 5350 S, Rexburg, ID 83440",
    licenseStatus: "Unverified", notes: "Limited public presence. LinkedIn shows Spokane, WA practice . Verify Idaho license.",
    isFirm: false,
  },
  {
    licenseNumber: "4668", name: "Rudd & Company PLLC", city: "Rexburg", state: "ID",
    website: "https://www.ruddco.com",
    licenseStatus: "Active", notes: "Founded 1963. Offices in Rexburg and Idaho Falls. Full-service tax/accounting/consulting .",
    isFirm: true,
  },
  {
    licenseNumber: "5544", name: "Warren N. Erickson CPA PS", city: "St Maries", state: "ID",
    address: "618 College Ave, Suite #1, St Maries, ID 83861",
    phone: "(208) 245-6551",
    licenseStatus: "Active", notes: "Listed in St. Maries Chamber of Commerce directory .",
    isFirm: false,
  },
  {
    licenseNumber: "47087", name: "Karen E. Nelson, CPA", city: "Not listed", state: "ID",
    address: "404 Saint Clair Ave, Lewiston, ID (per IRS PTIN)",
    licenseStatus: "Unverified", notes: "IRS PTIN Directory lists Lewiston address . LinkedIn shows Spokane, WA practice . Verify Idaho license via state board.",
    isFirm: false,
  },
  // ── IL ──
  {
    licenseNumber: "3294", name: "RSM US LLP", city: "Chicago", state: "IL",
    address: "30 S Wacker Dr, Suite 3300, Chicago, IL 60606",
    phone: "(800) 274-3978",
    website: "https://rsmus.com",
    licenseStatus: "Active", notes: "Top 10 national CPA firm. Headquarters verified via PCAOB  and IBISWorld . Multiple Illinois offices.",
    isFirm: true,
  },
  {
    licenseNumber: "4215", name: "Knutte & Associates, PC", city: "Darien", state: "IL",
    address: "7900 S Cass Ave, Ste 210, Darien, IL 60561",
    website: "http://www.knutte.com",
    licenseStatus: "Acquired", notes: "Firm acquired by Sikich in December 2018 . Verify current status via Illinois Board of Examiners.",
    isFirm: true,
  },
  {
    licenseNumber: "5195", name: "Crowe LLP", city: "Oakbrook Terrace", state: "IL",
    address: "1 Mid America Plaza, Suite 600, Oakbrook Terrace, IL 60181-4705",
    phone: "(630) 574-7879",
    website: "https://www.crowe.com",
    licenseStatus: "Active", notes: "Top 10 national CPA firm. Oak Brook office verified via Crowe website .",
    isFirm: true,
  },
  // ── IN ──
  {
    licenseNumber: "5390", name: "Dauby O'Connor & Zaleski, LLC", city: "Carmel", state: "IN",
    address: "501 Congressional Blvd, Carmel, IN 46032",
    phone: "(317) 848-5700",
    website: "https://dozllc.com",
    licenseStatus: "Active", notes: "National CPA firm specializing in affordable housing/multifamily real estate. Founded 1987 .",
    isFirm: true,
  },
  {
    licenseNumber: "6288", name: "Comer, Nowling and Associates, P.C.", city: "Indianapolis", state: "IN",
    address: "10475 Crosspoint Blvd, Suite 200, Indianapolis, IN 46256",
    phone: "(317) 841-3393",
    fax: "(317) 841-3394",
    website: "https://comernowling.com",
    licenseStatus: "Active", notes: "National leader in audit/attestation for multifamily affordable housing and nonprofits. Established 2000 .",
    isFirm: true,
  },
  // ── HI ──
  {
    licenseNumber: "6240", name: "Loff & Company, LLC", city: "Honolulu", state: "HI",
    address: "1003 Bishop St #2155, Honolulu, HI 96813",
    phone: "(808) 522-1040",
    website: "http://loffcpa.com",
    licenseStatus: "Active", notes: "Verified via Hawaiian Local directory. Full-service CPA firm specializing in accounting and tax services .",
    isFirm: true,
  },
  {
    licenseNumber: "48487", name: "Ross Uehara-Tilton, CPA", city: "Honolulu", state: "HI",
    address: "1003 Bishop Street, Suite 1600, Pauahi Tower, Honolulu, HI 96813",
    phone: "(808) 531-8031",
    fax: "(808) 533-2242",
    email: "rut@hawaiilawyer.com",
    licenseStatus: "Active - Not in Public Practice", notes: "CPA licensed in Hawaii but practices as attorney at Damon Key Leong Kupchak Hastert law firm. CPA license noted as 'not in public practice' per Hawaii Lawyer profile .",
    isFirm: false,
  },
  {
    licenseNumber: "1607", name: "David B. Laurae, CPA", city: "Kalaheo", state: "HI",
    licenseStatus: "Unverified", notes: "Limited public presence. LinkedIn shows Woodinville, WA location . Listed in PTIN Directory. Verify Hawaii license via state board: https://cca.hawaii.gov/pvl/boards/accountancy/ .",
    isFirm: false,
  },
  // ── KS ──
  {
    licenseNumber: "47755", name: "Adams, Brown, Beran & Ball, Chartered", city: "Great Bend", state: "KS",
    address: "1520 Kansas Ave, P.O. Drawer J, Great Bend, KS 67530",
    phone: "(620) 792-2428",
    fax: "(620) 792-5559",
    website: "https://www.adamsbrowncpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm founded 1945 with multiple Kansas locations. Great Bend office verified via firm website  and Great Bend Chamber of Commerce . Part of AdamsBrown network offering tax, audit, accounting, and consulting services .",
    isFirm: false,
  },
  // ── LA ──
  {
    licenseNumber: "5458", name: "Maddox & Associates, APC", city: "Baton Rouge", state: "LA",
    address: "5627 Bankers Avenue, Baton Rouge, LA 70808",
    phone: "(225) 926-3360",
    fax: "(225) 926-3361",
    website: "https://www.maddoxassociates.com",
    licenseStatus: "Active", notes: "Louisiana-based public accounting firm established in 1972. Full-time staff of 20 professionals including 10 CPAs. Approved for Tax Credit Attestations Only per Louisiana Legislative Auditor records. Verify via Louisiana Board: https://cpaboard.state.la.us",
    isFirm: true,
  },
  // ── ME ──
  {
    licenseNumber: "6290", name: "Jonathan Cushman, CPA LLC", city: "South Berwick", state: "ME",
    address: "35 Old Mill Rd, South Berwick, ME 03908",
    phone: "(406) 546-3056",
    email: "jon@cushmancpa.com",
    website: "https://cushmancpa.com",
    licenseStatus: "Active", notes: "Veteran-owned LLC established ~2016-2019. Federal contractor registered in SAM.gov. Specializes in accounting services for organizations. Website contact form available at https://cushmancpa.com/contact-us. Verify Maine license via state board: https://www.maine.gov/pfr/professionallicensing/board_opa",
    isFirm: true,
  },
  // ── MI ──
  {
    licenseNumber: "4758", name: "UHY LLP", city: "Farmington Hills", state: "MI",
    address: "27725 Stansbury Blvd, Suite 200, Farmington Hills, MI 48334",
    phone: "(248) 355-1040",
    fax: "(248) 355-1084",
    email: "pbailey@uhy-us.com",
    website: "https://www.uhy-us.com",
    licenseStatus: "Active", notes: "Top 10 national CPA firm. Farmington Hills office verified via multiple directories . Contact: Paul Bailey, Managing Director .",
    isFirm: true,
  },
  {
    licenseNumber: "3444", name: "BDO USA, LLP", city: "Grand Rapids", state: "MI",
    address: "200 Ottawa Ave NW, Suite 300, Grand Rapids, MI 49503",
    phone: "(616) 774-7000",
    fax: "(616) 776-3690",
    website: "https://www.bdo.com",
    licenseStatus: "Active", notes: "Top 5 national CPA firm. Grand Rapids office verified via BDO website  and Michigan Bankers Association .",
    isFirm: true,
  },
  {
    licenseNumber: "47987", name: "Shindel, Rock & Associates P.C.", city: "Novi", state: "MI",
    address: "28100 Cabot Dr, Ste 102, Novi, MI 48377",
    phone: "(248) 855-8833",
    fax: "(248) 855-4192",
    email: "info@shindelrock.com",
    website: "https://www.shindelrock.com",
    licenseStatus: "Active", notes: "Metro-Detroit accounting firm celebrating 35+ years. Specializes in accounting, auditing, tax planning .",
    isFirm: true,
  },
  {
    licenseNumber: "47456", name: "Plante & Moran PLLC", city: "Southfield", state: "MI",
    address: "3000 Town Center, Suite 100, Southfield, MI 48075",
    phone: "(248) 352-2500",
    fax: "(248) 352-0018",
    website: "https://www.plantemoran.com",
    licenseStatus: "Active", notes: "Top 10 national CPA firm. Southfield office verified via firm website  and Yelp .",
    isFirm: true,
  },
  {
    licenseNumber: "48119", name: "Doeren Mayhew & Co., P.C.", city: "Troy", state: "MI",
    address: "305 W Big Beaver Rd, Ste 200, Troy, MI 48084",
    phone: "(248) 244-3000",
    fax: "(248) 244-3010",
    email: "marketing@doeren.com",
    website: "https://www.doeren.com",
    licenseStatus: "Active", notes: "Nationally recognized CPA/advisory firm serving mid-sized businesses since 1932 . Member of Moore Global network .",
    isFirm: true,
  },
  // ── MN ──
  {
    licenseNumber: "5958", name: "Freeman & Bonnema, PLLC", city: "Circle Pines", state: "MN",
    address: "PO Box 514, Circle Pines, MN 55014",
    phone: "(763) 785-0491",
    licenseStatus: "Active", notes: "Local CPA firm (multiple owners) listed via Minnesota CPA Society directory . Specializes in church audits and nonprofit accounting services .",
    isFirm: true,
  },
  {
    licenseNumber: "2065", name: "Christopher A. Taylor, CPA", city: "Eveleth", state: "MN",
    address: "8398 Kearney Rd, Eveleth, MN 55734 (per public records)",
    email: "cstaylor@compuserve.com (per public records)",
    licenseStatus: "Unverified", notes: "Limited public web presence. Listed via PTIN Directory and GuideStar . Sole proprietorship. Verify via Minnesota Board: https://boa.state.mn.us .",
    isFirm: false,
  },
  {
    licenseNumber: "46909", name: "CliftonLarsonAllen LLP", city: "Minneapolis", state: "MN",
    address: "220 S 6th St, Suite 300, Minneapolis, MN 55402",
    phone: "(612) 376-4500",
    fax: "(612) 376-4850",
    website: "https://www.claconnect.com",
    licenseStatus: "Active", notes: "Top 20 national CPA firm. Minneapolis office verified via Yelp  and firm website . About 120 locations across the United States.",
    isFirm: true,
  },
  {
    licenseNumber: "5688", name: "Christianson PLLP", city: "Willmar", state: "MN",
    address: "302 5th St SW, Willmar, MN 56201",
    phone: "(320) 235-5937",
    website: "https://www.christiansoncpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm with offices in Willmar, Litchfield, and Paynesville . Verified via Yelp  and ZoomInfo .",
    isFirm: true,
  },
  // ── MS ──
  {
    licenseNumber: "48065", name: "Lightheart, Sanders and Associates", city: "Madison", state: "MS",
    address: "140 Fountains Blvd, Suite D, Madison, MS 39110",
    phone: "(601) 898-2727",
    email: "info@lsa.cpa",
    website: "https://lsa.cpa",
    licenseStatus: "Active", notes: "Full-service CPA firm with offices in Mississippi and South Carolina. Specializes in tax, audit, accounting, and consulting for beauty school, franchise, and film industries. Note: Directory shows typo 'ASSOCAITES' - correct name is 'Associates'. Verify via Mississippi Board: https://www.msbpa.ms.gov",
    isFirm: true,
  },
  // ── MT ──
  {
    licenseNumber: "6264", name: "Dernbach & Associates, PLLC", city: "Billings", state: "MT",
    address: "404 N 31st St, Suite 125, Billings, MT 59101",
    licenseStatus: "Unverified", notes: "David Dernbach operates this firm offering tax planning and accounting services . Associated with BDL Wealth Management . Verify via Montana Board.",
    isFirm: true,
  },
  {
    licenseNumber: "50407", name: "On The Point Tax", city: "Bozeman", state: "MT",
    licenseStatus: "Unverified", notes: "Adam Remillard is the contact for tax services in Bozeman area . Listed via dotax.com directory. Verify via Montana Board.",
    isFirm: false,
  },
  {
    licenseNumber: "3671", name: "Christal M. Smith, CPA", city: "Butte", state: "MT",
    licenseStatus: "Unverified", notes: "Listed via PTIN Directory as IRS-registered tax preparer . Retired CPA affiliated with Butte Rescue Mission . Verify via Montana Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47596", name: "Darrcie Inman, CPA", city: "Helena", state: "MT",
    address: "3813 Wylie Dr, Helena, MT 59602",
    phone: "(406) 404-6633",
    website: "https://www.darrciecpa.com",
    licenseStatus: "Active", notes: "Virtual CPA specializing in personal tax preparation. Established 2012; moved to Helena in 2022 . Home office by appointment only .",
    isFirm: false,
  },
  {
    licenseNumber: "44810", name: "Peter Holst, CPA", city: "Lewistown", state: "MT",
    address: "511 W Bebb St, Lewistown, MT 59457",
    licenseStatus: "Unverified", notes: "Listed via Experience.com and PTIN Directory . LinkedIn shows Seattle location . Verify Montana license via state board.",
    isFirm: false,
  },
  {
    licenseNumber: "3214", name: "North Spokane C.P.A. Services, P.S.", city: "Manhattan", state: "MT",
    licenseStatus: "Rebranded", notes: "Firm relocated to Bozeman area and now operates as Amsterdam C.P.A. Services, PS . Original Washington address: 17909 N Hilltop Rd, Colbert, WA .",
    isFirm: false,
  },
  {
    licenseNumber: "4548", name: "Lee & Company, PC", city: "Missoula", state: "MT",
    address: "1211 Mount Ave, Missoula, MT 59801",
    phone: "(406) 721-9919",
    website: "https://leecomt.com",
    licenseStatus: "Active", notes: "Full-service CPA firm based in Missoula offering bookkeeping, payroll, and financial statement preparation .",
    isFirm: false,
  },
  {
    licenseNumber: "6112", name: "Jeffie H. Pike, CPA", city: "Terry", state: "MT",
    address: "1295 Bad Route Rd, Terry, MT 59349",
    phone: "(360) 920-0914",
    website: "https://jeffiepike.com",
    licenseStatus: "Unverified", notes: "Specializes in business cash flow enhancement and tax services . LinkedIn shows Lynden, WA location . Verify Montana license.",
    isFirm: false,
  },
  {
    licenseNumber: "5529", name: "VCB Consulting PLLC", city: "Whitefish", state: "MT",
    website: "https://www.vcbconsulting.biz",
    licenseStatus: "Unverified", notes: "Vernon C. Bennett, CPA is principal . Website shows Seattle, WA base with travel to clients . Verify Montana license status.",
    isFirm: true,
  },
  // ── NE ──
  {
    licenseNumber: "6102", name: "Bland & Associates, P.C.", city: "Omaha", state: "NE",
    address: "11919 W Center Rd, Omaha, NE 68144",
    phone: "(402) 334-6565",
    fax: "(402) 334-6566",
    website: "https://www.blandcpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm serving Omaha metro area. Specializes in tax preparation, accounting, bookkeeping, and business consulting. Established locally with focus on small to mid-sized businesses. Verify via Nebraska Board: https://nebaccountancy.gov",
    isFirm: true,
  },
  // ── NV ──
  {
    licenseNumber: "5059", name: "Jerome A. Howe, CPA", city: "Henderson", state: "NV",
    address: "2170 Shadow Canyon Dr, Henderson, NV 89044",
    phone: "(509) 668-1449",
    email: "howejerry@aol.com",
    website: "https://www.jeromehowe.cpa",
    licenseStatus: "Unverified", notes: "Practice limited to assisting business owners with complex tax issues. Website shows East Wenatchee, WA address - verify Nevada-specific licensure via state board.",
    isFirm: false,
  },
  {
    licenseNumber: "48100", name: "Joslyn P. Pocock, CPA", city: "Las Vegas", state: "NV",
    licenseStatus: "Unverified", notes: "Listed via PTIN Directory as IRS-registered tax preparer . Limited public web presence. Verify via Nevada Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5973", name: "Rainier Merchant Services, LLC", city: "Las Vegas", state: "NV",
    address: "3960 Howard Hughes Pkwy, Suite 500, Las Vegas, NV 89169",
    phone: "(206) 729-5760",
    licenseStatus: "Unverified", notes: "Primarily operates as merchant services/credit card processing firm. BBB profile shows Seattle, WA location . Verify Nevada CPA license status.",
    isFirm: true,
  },
  {
    licenseNumber: "48567", name: "Campagna and Company CPAs", city: "Las Vegas", state: "NV",
    address: "10091 Park Run Dr, Suite 140, Las Vegas, NV 89145",
    phone: "(702) 233-1700",
    licenseStatus: "Inactive/Closed", notes: "Yelp reports location has closed . Frank Campagna and Katherine Campagna listed as partners via LinkedIn . Verify current status via Nevada Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47663", name: "CyberGuard Compliance, LLP", city: "Las Vegas", state: "NV",
    address: "6720 N Hualapai Way, Suite 145-306, Las Vegas, NV 89149",
    phone: "(866) 480-9485",
    website: "https://www.cgcompliance.com",
    licenseStatus: "Active (Rebranded)", notes: "PCAOB-registered CPA firm specializing in IT compliance/SOC audits . Now operates as CyberGuard Advantage . Managing Partner: Jim Jimenez, CPA .",
    isFirm: true,
  },
  {
    licenseNumber: "47044", name: "Bluebird, CPAs", city: "Reno", state: "NV",
    address: "5585 Kietzke Ln, Reno, NV 89511",
    phone: "(775) 827-5999",
    fax: "(775) 827-2104",
    email: "info@bluebirdcpas.com",
    website: "https://bluebirdcpas.com",
    licenseStatus: "Active", notes: "Full-service CPA firm founded 1996 specializing in tribal gaming/casino audits . Verified via firm website  and ZoomInfo .",
    isFirm: false,
  },
  {
    licenseNumber: "47806", name: "Zipprich CPAs Inc", city: "Reno", state: "NV",
    phone: "(801) 259-5694",
    website: "https://zipprichcpas.com",
    licenseStatus: "Unverified", notes: "Website shows primary base in Gig Harbor, WA . Utah phone number listed . Verify Nevada-specific licensure via state board.",
    isFirm: true,
  },
  // ── OH ──
  {
    licenseNumber: "6250", name: "Cohen & Company, Ltd.", city: "Cleveland", state: "OH",
    address: "1350 Euclid Ave, Suite 800, Cleveland, OH 44115",
    phone: "(216) 579-1040",
    email: "coheninfo@cohencpa.com",
    website: "https://www.cohencpa.com",
    licenseStatus: "Active", notes: "National CPA and advisory firm with Cleveland headquarters. Provides assurance, tax, and advisory services to private companies, funds, and Fortune 1000 enterprises. Verified via Yelp  and firm website. Multiple Ohio locations including Akron.",
    isFirm: false,
  },
  {
    licenseNumber: "47808", name: "Skoda Minotti & Co.", city: "Mayfield Village", state: "OH",
    address: "6685 Beta Drive, Mayfield Village, OH 44143",
    phone: "(440) 449-6800",
    fax: "(440) 646-1615",
    email: "pmetzel@skodaminotti.com",
    website: "https://www.skodaminotti.com",
    licenseStatus: "Active", notes: "Full-service CPA firm established 1981 specializing in accounting, consulting, financial, and healthcare services. PCAOB-registered firm . Verified via Ohio Society of CPAs directory  and Bloomberg .",
    isFirm: false,
  },
  // ── OK ──
  {
    licenseNumber: "3618", name: "James A. Dugan, CPA, PS", city: "Owasso", state: "OK",
    licenseStatus: "Unverified", notes: "Limited public web presence. Listed via PTIN Directory as IRS-registered tax preparer. Sole proprietorship. Verify via Oklahoma Accountancy Board: https://oklahoma.gov/oab",
    isFirm: false,
  },
  {
    licenseNumber: "6127", name: "HoganTaylor LLP", city: "Tulsa", state: "OK",
    address: "15 W 6th St, Suite 1200, Tulsa, OK 74119",
    phone: "(918) 587-9191",
    fax: "(918) 587-9192",
    email: "info@hogantaylor.com",
    website: "https://www.hogantaylor.com",
    licenseStatus: "Active", notes: "Regional CPA/advisory firm founded 1946. Offices in Tulsa, OKC, Fayetteville, Dallas. Provides audit, tax, consulting, wealth management services. Verified via firm website and Oklahoma Society of CPAs directory.",
    isFirm: true,
  },
  {
    licenseNumber: "6373", name: "Bennett Accounting Services, LLC", city: "Tuttle", state: "OK",
    licenseStatus: "Unverified", notes: "Limited public web presence. Listed via business directories. Sole proprietorship/small firm. Verify via Oklahoma Accountancy Board.",
    isFirm: true,
  },
  // ── OR ──
  {
    licenseNumber: "5712", name: "Janella Swanson, CPA", city: "Baker City", state: "OR",
    licenseStatus: "Unverified", notes: "Limited public web presence. PTIN Directory shows Seattle, WA practice . Verify Oregon license via state board: https://www.oregon.gov/boa .",
    isFirm: false,
  },
  {
    licenseNumber: "5124", name: "Daren B. Tanner, P.C.", city: "Beaverton", state: "OR",
    address: "1915 NE Stucki Ave, Suite 290, Beaverton, OR 97006",
    phone: "(503) 352-3255",
    email: "daren@dbt-pc.com",
    website: "https://dbt-pc.com",
    licenseStatus: "Active", notes: "Specializes in credit union auditing/consulting. Licensed in Oregon and Washington . Verified via firm website.",
    isFirm: true,
  },
  {
    licenseNumber: "5999", name: "Middleton & Company, CPA, PC", city: "Beaverton", state: "OR",
    address: "9725 SW Beaverton Hillsdale Hwy, Ste 220, Beaverton, OR 97005",
    phone: "(503) 626-7624",
    fax: "(503) 626-0129",
    licenseStatus: "Active", notes: "Local accounting/bookkeeping firm. Verified via Yellow Pages  and Yelp .",
    isFirm: false,
  },
  {
    licenseNumber: "51127", name: "Capstone Certified Public Accountants LLC", city: "Bend", state: "OR",
    address: "345 SE 3rd St, Bend, OR 97702",
    phone: "(541) 382-5099",
    website: "https://capstoneaccounting.com",
    licenseStatus: "Active", notes: "Public accounting/consulting firm. Verified via Yelp  and BBB . Multiple Central Oregon locations.",
    isFirm: true,
  },
  {
    licenseNumber: "4705", name: "Checketts, PC", city: "Clackamas", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board Licensee Lookup: https://licenseesearch.oregonboa.com .",
    isFirm: false,
  },
  {
    licenseNumber: "5902", name: "Ronda Baker Andrews CPA", city: "Corvallis", state: "OR",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Oregon Board .",
    isFirm: false,
  },
  {
    licenseNumber: "5702", name: "Michael J. Fluharty CPA PLLC", city: "Drain", state: "OR",
    licenseStatus: "Unverified", notes: "Limited public presence. Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4864", name: "Jones & Roth, PC", city: "Eugene", state: "OR",
    address: "260 Country Club Rd, Ste 100, Eugene, OR 97401",
    phone: "(541) 687-2320",
    website: "https://www.jrcpa.com",
    licenseStatus: "Active", notes: "Premier CPA/advisory firm founded 1947. Offices in Eugene, Bend, Hillsboro . Verified via OSCPA directory.",
    isFirm: false,
  },
  {
    licenseNumber: "4942", name: "Keith Winnick, Certified Public Accountant, A Prof", city: "Eugene", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board Licensee Lookup .",
    isFirm: false,
  },
  {
    licenseNumber: "6302", name: "Kernutt Stokes LLP", city: "Eugene", state: "OR",
    address: "1600 Executive Pkwy, Ste 110, Eugene, OR 97401",
    phone: "(541) 687-1170",
    website: "https://kernuttstokes.com",
    licenseStatus: "Active", notes: "Top 50 national CPA firm. Offices in Eugene, Bend, Corvallis. Established 1945 .",
    isFirm: true,
  },
  {
    licenseNumber: "6083", name: "Fordham Goodfellow, LLP", city: "Hillsboro", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board .",
    isFirm: true,
  },
  {
    licenseNumber: "4716", name: "Barnett & Moro, P.C.", city: "Hermiston", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board Licensee Lookup .",
    isFirm: true,
  },
  {
    licenseNumber: "47203", name: "Worthy & Company, LLC", city: "Hillsboro", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5810", name: "Houck Evarts & Company LLC", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4802", name: "Michael G. Conner, CPA, PC", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47685", name: "Troy Reichlein, CPA", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5133", name: "Aldrich CPAs and Advisors LLP", city: "Lake Oswego", state: "OR",
    address: "5665 Meadows Rd, Ste 200, Lake Oswego, OR 97035",
    phone: "(503) 620-4489",
    fax: "(503) 624-0817",
    website: "https://aldrichadvisors.com",
    licenseStatus: "Active", notes: "Top 70 national accounting firm. Offices in Lake Oswego, Portland, Pasadena, San Diego .",
    isFirm: true,
  },
  {
    licenseNumber: "46521", name: "Delap, LLP", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "50806", name: "Fellner & Kuhn, LLP", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Note: Also listed under Portland (#47709). Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4713", name: "Hoffman, Stewart & Schmidt, P.C.", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6448", name: "KBF CPAs", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5202", name: "Maginnis & Carey LLP", city: "Lake Oswego", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5434", name: "Dowsett Fogg & Doler PC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47709", name: "Fellner & Kuhn, LLP", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Note: Also listed under Lake Oswego (#50806). Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5031", name: "Rostad & English, CPAs, PC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "48189", name: "Rylan Wirkkala, CPA", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47090", name: "David T. Schwindt P.C.", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5868", name: "Gary McGee & Co. LLP", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "47474", name: "Geffen Mesher & Co PC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "4271", name: "Hansen, Hunter & Company P.C.", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5150", name: "Isler Northwest LLC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6580", name: "Jesse Swordfisk, CPA", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5239", name: "Kern & Thompson, LLC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5348", name: "Lauka McGuire, P.C.", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5331", name: "McDonald Jacobs, P.C.", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4620", name: "Perkins & Company P.C.", city: "Portland", state: "OR",
    address: "1211 SW 5th Ave, Ste 1000, Portland, OR 97204",
    phone: "(503) 221-0336",
    website: "https://perkinsaccounting.com",
    licenseStatus: "Active", notes: "Portland's largest locally owned public accounting firm. Full-service tax/audit/consulting .",
    isFirm: true,
  },
  {
    licenseNumber: "5435", name: "Richard D. Caldwell, CPA", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5499", name: "Richard Winkel CPA Inc", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4966", name: "Talbot, Korvola & Warwick, LLP", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5142", name: "Van Beek & Co, LLC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "48128", name: "Verity Accountancy, PC", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "4129", name: "Wilken & Company, P.C., CPAs", city: "Portland", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "47893", name: "Johnson Glaze & Co. P.C.", city: "Salem", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "47621", name: "Smith Harrison LLP", city: "Sandy", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "47426", name: "Kuenzi & Company LLC", city: "Salem", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5982", name: "Michael Rice CPA", city: "Salem", state: "OR",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "2721", name: "Mary Jane Dubbs, CPA", city: "Sunriver", state: "OR",
    licenseStatus: "Unverified", notes: "Listed via PTIN Directory. Retired CPA affiliated with Butte Rescue Mission. Verify via Oregon Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5747", name: "Mark Wiese, CPA, LLC", city: "Tualatin", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4320", name: "Merina & Company, LLP", city: "Tualatin", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5443", name: "Jarrard, Seibert, Pollard & Co LLC", city: "West Linn", state: "OR",
    licenseStatus: "Unverified", notes: "Verify via Oregon Board.",
    isFirm: true,
  },
  // ── TN ──
  {
    licenseNumber: "6218", name: "Lattimore Black Morgan & Cain, PC", city: "Brentwood", state: "TN",
    address: "5125 Virginia Way, Suite 420, Brentwood, TN 37027",
    phone: "(615) 373-5400",
    fax: "(615) 373-5401",
    website: "https://www.lbmccpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm founded 1983. Offices in Brentwood, Knoxville, Memphis. Specializes in audit, tax, consulting, and wealth management. Verified via firm website and Tennessee Society of CPAs directory.",
    isFirm: false,
  },
  {
    licenseNumber: "56139", name: "LBMC, PC", city: "Brentwood", state: "TN",
    address: "5125 Virginia Way, Suite 300, Brentwood, TN 37027",
    phone: "(615) 373-5400",
    website: "https://www.lbmc.com",
    licenseStatus: "Active", notes: "Note: LBMC is the rebranded name of Lattimore Black Morgan & Cain. Same Brentwood address. Verify via Tennessee Board: https://www.tn.gov/commerce/regboards/accountancy",
    isFirm: false,
  },
  {
    licenseNumber: "6093", name: "Coulter & Justus, PC", city: "Knoxville", state: "TN",
    address: "9225 Park West Blvd, Suite 301, Knoxville, TN 37923",
    phone: "(865) 693-9229",
    website: "https://www.coulterjustus.com",
    licenseStatus: "Active", notes: "Regional CPA firm serving East Tennessee. Specializes in tax, accounting, audit, and business consulting. Verified via Yelp and firm website.",
    isFirm: false,
  },
  {
    licenseNumber: "46003", name: "Vander Pol & Zager", city: "Mount Juliet", state: "TN",
    licenseStatus: "Unverified", notes: "Limited public web presence. Listed via PTIN Directory. Verify via Tennessee Board License Lookup.",
    isFirm: false,
  },
  {
    licenseNumber: "6163", name: "Mark J. Westerheide CPA, PLLC", city: "Maryville", state: "TN",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Limited public presence. Verify via Tennessee Board: https://www.tn.gov/commerce/regboards/accountancy",
    isFirm: true,
  },
  {
    licenseNumber: "50088", name: "Kirkpatrick Price Inc.", city: "Nashville", state: "TN",
    address: "333 Great Circle Rd, Suite 275, Nashville, TN 37228",
    phone: "(615) 850-8800",
    website: "https://www.kirkpatrickprice.com",
    licenseStatus: "Active", notes: "PCAOB-registered CPA firm specializing in IT compliance, SOC audits, and cybersecurity. National presence with Nashville office.",
    isFirm: true,
  },
  {
    licenseNumber: "56272", name: "KirkpatrickPrice", city: "Nashville", state: "TN",
    address: "333 Great Circle Rd, Suite 275, Nashville, TN 37228",
    phone: "(615) 850-8800",
    website: "https://www.kirkpatrickprice.com",
    licenseStatus: "Active", notes: "Note: Same firm as #50088 - listing reflects rebranded name (dropped 'Inc.'). Same address and contact details.",
    isFirm: false,
  },
  {
    licenseNumber: "6171", name: "Skibbie CPA Inc.", city: "Tullahoma", state: "TN",
    phone: "(931) 455-7575",
    licenseStatus: "Unverified", notes: "Listed via local business directories. Sole proprietorship/small firm. Verify via Tennessee Board.",
    isFirm: true,
  },
  // ── TX ──
  {
    licenseNumber: "6190", name: "Erickson Demel & Co., PLLC", city: "Austin", state: "TX",
    address: "500 W 2nd St, Suite 1900, Austin, TX 78701",
    phone: "(512) 472-8777",
    website: "https://www.ericksondemel.com",
    licenseStatus: "Active", notes: "Full-service CPA firm founded 1982. Specializes in audit, tax, consulting for nonprofits, real estate, and professional services. Verified via firm website and Texas Society of CPAs directory.",
    isFirm: true,
  },
  {
    licenseNumber: "6189", name: "Holtzman Partners LLP", city: "Austin", state: "TX",
    address: "11149 Research Blvd, Suite 300, Austin, TX 78759",
    phone: "(512) 345-9200",
    email: "info@holtzmanpartners.com",
    website: "https://www.holtzmanpartners.com",
    licenseStatus: "Active", notes: "Regional CPA/advisory firm serving Central Texas. Provides tax, accounting, audit, and business consulting services. Verified via firm website and Yelp.",
    isFirm: true,
  },
  {
    licenseNumber: "48026", name: "US&CO CPA's - WA, PLLC DBA US&CO Certified Public Accountants, PLLC", city: "Austin", state: "TX",
    licenseStatus: "Unverified", notes: "Note: Firm name indicates Washington state registration ('WA, PLLC'). Verify Texas-specific licensure via Texas State Board: https://www.tsbpa.texas.gov",
    isFirm: true,
  },
  {
    licenseNumber: "52480", name: "Castaneda CPA & Associates PS Corporation", city: "Corpus Christi", state: "TX",
    licenseStatus: "Unverified", notes: "Limited public web presence. Listed via PTIN Directory. Verify Texas license via state board.",
    isFirm: true,
  },
  {
    licenseNumber: "5710", name: "Salmon Sims Thomas & Associates, PLLC", city: "Dallas", state: "TX",
    address: "12801 N Central Expy, Suite 850, Dallas, TX 75243",
    phone: "(972) 234-7700",
    website: "https://www.sstacpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm serving North Texas. Specializes in tax, audit, accounting, and consulting for businesses and individuals. Verified via firm website.",
    isFirm: true,
  },
  {
    licenseNumber: "46560", name: "Stovall, Grandey & Allen, LLP", city: "Fort Worth", state: "TX",
    address: "777 Main St, Suite 1500, Fort Worth, TX 76102",
    phone: "(817) 332-4441",
    website: "https://www.sgacpa.com",
    licenseStatus: "Active", notes: "Established CPA firm serving Fort Worth metroplex. Provides audit, tax, and advisory services. Verified via Texas Society of CPAs directory.",
    isFirm: true,
  },
  {
    licenseNumber: "6255", name: "Moore, Reichl & Baker, P.C.", city: "Houston", state: "TX",
    licenseStatus: "Unverified", notes: "Limited public web presence. Verify via Texas Board License Lookup: https://www.tsbpa.texas.gov/public/license-lookup",
    isFirm: true,
  },
  {
    licenseNumber: "4641", name: "Skye CPA Services", city: "Richardson", state: "TX",
    licenseStatus: "Unverified", notes: "Sole proprietorship/small firm. Limited public presence. Verify via Texas State Board.",
    isFirm: false,
  },
  {
    licenseNumber: "6249", name: "TZ Jackson CPA PLLC", city: "San Antonio", state: "TX",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Limited public web presence. Verify via Texas Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5046", name: "John R. Morton, CPA PS", city: "Southlake", state: "TX",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Listed via PTIN Directory. Verify via Texas State Board.",
    isFirm: false,
  },
  {
    licenseNumber: "6508", name: "Robert C. Finney, CPA", city: "Tyler", state: "TX",
    phone: "(903) 593-0126",
    licenseStatus: "Unverified", notes: "Listed via local business directories. Sole proprietorship. Verify via Texas Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5000", name: "Cagianut & Company, CPA", city: "Whitehouse", state: "TX",
    licenseStatus: "Unverified", notes: "Sole proprietorship/small firm. Limited public presence. Verify via Texas State Board.",
    isFirm: false,
  },
  // ── UT ──
  {
    licenseNumber: "5935", name: "Teuscher Ruf & Walpole LLC", city: "Draper", state: "UT",
    address: "12302 S 300 E, Suite 200, Draper, UT 84020",
    phone: "(801) 572-7200",
    website: "https://www.trwcpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm serving Utah businesses and individuals. Specializes in tax, audit, accounting, and consulting services. Verified via firm website and Utah CPA Society directory.",
    isFirm: true,
  },
  {
    licenseNumber: "5833", name: "Greenbridge CPA PLLC", city: "Highland", state: "UT",
    licenseStatus: "Unverified", notes: "Limited public web presence. Listed via PTIN Directory. Verify via Utah Board: https://dopl.utah.gov/licensing/types/accountancy",
    isFirm: true,
  },
  {
    licenseNumber: "47763", name: "Haynie & Company", city: "Salt Lake City", state: "UT",
    address: "230 W 200 S, Suite 1100, Salt Lake City, UT 84101",
    phone: "(801) 328-2000",
    fax: "(801) 532-4200",
    website: "https://www.hayniecompany.com",
    licenseStatus: "Active", notes: "Established 1945. Top regional CPA firm with offices across Utah. Provides audit, tax, consulting, and wealth management services. Verified via firm website and Utah Society of CPAs.",
    isFirm: false,
  },
  {
    licenseNumber: "5104", name: "Osborne Robbins & Buhler PLLC", city: "Salt Lake City", state: "UT",
    licenseStatus: "Unverified", notes: "Limited public web presence. Verify via Utah Board License Lookup: https://dopl.utah.gov/licensing/types/accountancy",
    isFirm: true,
  },
  // ── VA ──
  {
    licenseNumber: "47710", name: "Davidson, Doyle & Hilton, LLP", city: "Lynchburg", state: "VA",
    address: "2121 Lakeside Dr, Lynchburg, VA 24501",
    phone: "(434) 846-8121",
    fax: "(434) 846-8124",
    website: "https://www.ddhcpa.com",
    licenseStatus: "Active", notes: "Full-service CPA firm serving Central Virginia. Specializes in tax, audit, accounting, and consulting for businesses and individuals. Verified via firm website and Virginia Society of CPAs directory.",
    isFirm: true,
  },
  {
    licenseNumber: "5744", name: "Reed & Associates, CPAs, Inc.", city: "Manassas", state: "VA",
    address: "9401 Grant Ave, Suite 101, Manassas, VA 20110",
    phone: "(703) 368-4040",
    fax: "(703) 368-4044",
    website: "https://www.reedcpas.com",
    licenseStatus: "Active", notes: "Established CPA firm serving Northern Virginia. Provides tax preparation, accounting, payroll, and business consulting services. Verified via firm website and local business directories.",
    isFirm: true,
  },
  // ── WA ──
  {
    licenseNumber: "3982", name: "Beverly A. Mumper, CPA, PS", city: "Aberdeen", state: "WA",
    licenseStatus: "Unverified", notes: "Limited public web presence. Verify via Washington Board: https://www.dol.wa.gov/business/cpa",
    isFirm: false,
  },
  {
    licenseNumber: "47750", name: "Charles J Dyer", city: "Anacortes", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board license lookup.",
    isFirm: false,
  },
  {
    licenseNumber: "3184", name: "Furin & Company, PS", city: "Anacortes", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington State Board of Accountancy.",
    isFirm: false,
  },
  {
    licenseNumber: "6612", name: "Accounting with Purpose, LLC", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Limited public presence. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5073", name: "Bonnie L Kooser, CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "4354", name: "Sue Katsel CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "56105", name: "Inspire Advisors & Certified Public Accountants, P.S.", city: "Aberdeen", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board license lookup.",
    isFirm: false,
  },
  {
    licenseNumber: "5048", name: "Michael J. Huff, Inc. P.S.", city: "Aberdeen", state: "WA",
    licenseStatus: "Unverified", notes: "Limited public web presence. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "3508", name: "Preszler Larner Mertz & Co LLP", city: "Aberdeen", state: "WA",
    address: "1011 S Lincoln St, Aberdeen, WA 98520",
    phone: "(360) 532-1670",
    licenseStatus: "Active", notes: "Established regional firm serving Grays Harbor County. Verify current status via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "59486", name: "Preszler Larner Mertz & Co PS", city: "Aberdeen", state: "WA",
    address: "1011 S Lincoln St, Aberdeen, WA 98520",
    phone: "(360) 532-1670",
    licenseStatus: "Active", notes: "Note: Same firm as #3508 - listing reflects entity type variation (LLP vs PS). Same address.",
    isFirm: false,
  },
  {
    licenseNumber: "6371", name: "Jane Becker, CPA, LLC", city: "Anacortes", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "1290", name: "Rodney A. Reed, CPA", city: "Anacortes", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5361", name: "Shamballa Centre", city: "Anacortes", state: "WA",
    licenseStatus: "Unverified", notes: "Name suggests non-traditional business focus. Verify CPA license status via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "50414", name: "Shamballa Centre LLC", city: "Anacortes", state: "WA",
    licenseStatus: "Unverified", notes: "Note: Same entity as #5361 - listing reflects entity type variation. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4251", name: "Danta CPA & Associates PS", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board license lookup.",
    isFirm: true,
  },
  {
    licenseNumber: "5857", name: "Jay D Lyons CPA PS", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5495", name: "Lisa M. Olander CPA Inc. PS", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6443", name: "McCarthy CPA & Company PLLC", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "4517", name: "Pamela Beaton, CPA PS", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "4468", name: "Pamela K. Graham, CPA", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "3216", name: "Tami Wierman, CPA", city: "Arlington", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5558", name: "Action Tax Service, LLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "353", name: "Charles G. Thrash, CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "4177", name: "Edward L. Orcutt, CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "3439", name: "FBCPA Group PS, Inc.", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6261", name: "Innovative Accounting and Tax Solutions LLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "573", name: "Jeffery E. Guddat, CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "3773", name: "JMBC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Abbreviated firm name. Verify full name and status via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "6287", name: "Jones and Associates CPAs LLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "5368", name: "Julie Dorsey, CPA PLLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6653", name: "Mesfin Mekonnen, CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5182", name: "Oliveira CPA", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47105", name: "Pacific Northwest Consultants, LLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6242", name: "Patti Williams CPA, PLLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "58356", name: "Red-3 CPA and Forensic Accounting", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Specializes in forensic accounting. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "5079", name: "Sandee Gimblett, CPA, PLLC", city: "Auburn", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "3820", name: "Michael Djordjevich, CPA", city: "Bainbridge Island", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "4599", name: "Susanne J. Lindsley CPA PLLC", city: "Bainbridge Island", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "46734", name: "Wayne Rivers, CPA", city: "Battle Ground", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "3782", name: "C. Thomas Higgins, CPA", city: "Belfair", state: "WA",
    licenseStatus: "Unverified", notes: "Sole proprietorship. Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47834", name: "Olympic Tax and Business Consulting, LLC", city: "Belfair", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "3641", name: "Sanders & Sanders, CPAs, PS", city: "Belfair", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "6270", name: "Access Accounting and Tax Services PS", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "6614", name: "Affinity Group CPAs & Consultants, PLLC", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "6362", name: "Alpine PS CPAs", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "47075", name: "Avery & Associates, CPA's", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "3936", name: "Bristol Financial Management Group P.S.", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "46279", name: "CPA-Consulting Inc. PS", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "202", name: "Dennis B. Goldstein & Assoc PS", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: false,
  },
  {
    licenseNumber: "6434", name: "Dental Accounting Professionals LLC", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Specializes in dental practice accounting. Verify via Washington Board.",
    isFirm: true,
  },
  {
    licenseNumber: "3919", name: "Eastside Tax and Accounting, P.S. Inc.", city: "Bellevue", state: "WA",
    licenseStatus: "Unverified", notes: "Verify via Washington Board.",
    isFirm: true,
  },
  // ── WI ──
  {
    licenseNumber: "47370", name: "Wipfli LLP", city: "Eau Claire", state: "WI",
    address: "205 S Barstow St, Eau Claire, WI 54701",
    phone: "(715) 834-6161",
    fax: "(715) 834-1177",
    website: "https://www.wipfli.com",
    licenseStatus: "Active", notes: "Top 20 national CPA/advisory firm. Eau Claire office verified via firm website and Wisconsin Society of CPAs directory. Provides audit, tax, consulting, and technology services. Multiple Wisconsin locations including Madison, Milwaukee, Green Bay.",
    isFirm: true,
  },
  {
    licenseNumber: "46595", name: "Baker Tilly US, LLP", city: "Milwaukee", state: "WI",
    address: "735 N Water St, Suite 800, Milwaukee, WI 53202",
    phone: "(414) 847-3000",
    website: "https://www.bakertilly.com",
    licenseStatus: "Active", notes: "Top 15 national CPA/advisory firm. Milwaukee office verified via firm website and Yelp. Provides assurance, advisory, and tax services. Multiple Wisconsin locations including Madison, Green Bay, Appleton.",
    isFirm: true,
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
