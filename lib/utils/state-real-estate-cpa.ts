export interface RealtorAssoc {
  name: string;
  type: "State REALTOR® Association" | "State CPA Society";
  city: string;
  url: string;
  description: string;
}

export const US_STATE_REALTOR_CPA: Record<string, RealtorAssoc[]> = {
  alabama: [
    { name: "Alabama REALTORS® Association", type: "State REALTOR® Association", city: "Montgomery", url: "https://www.alabamarealtors.com", description: "Official trade association representing over 19,000 real estate professionals across Alabama." },
    { name: "Alabama Society of CPAs (ASCPA)", type: "State CPA Society", city: "Montgomery", url: "https://www.ascpa.org", description: "Premier professional organization representing CPAs in public practice, industry, and education." }
  ],
  alaska: [
    { name: "Alaska Association of REALTORS®", type: "State REALTOR® Association", city: "Anchorage", url: "https://www.alaskarealtors.com", description: "Statewide real estate association serving licensed agents and brokers." },
    { name: "Alaska Society of CPAs (AKCPA)", type: "State CPA Society", city: "Anchorage", url: "https://www.akcpa.org", description: "Advocating for CPA professionals and accounting standards across Alaska." }
  ],
  arizona: [
    { name: "Arizona REALTORS® Association", type: "State REALTOR® Association", city: "Phoenix", url: "https://www.aaronline.com", description: "Largest trade association in Arizona representing over 55,000 real estate practitioners." },
    { name: "Arizona Society of CPAs (ASCPA)", type: "State CPA Society", city: "Phoenix", url: "https://www.ascpa.com", description: "Statewide accounting society offering professional education, networking, and legislative advocacy." }
  ],
  arkansas: [
    { name: "Arkansas REALTORS® Association", type: "State REALTOR® Association", city: "Little Rock", url: "https://www.arkansasrealtors.com", description: "Statewide association promoting real estate professionalism and property rights." },
    { name: "Arkansas Society of CPAs (ARCPA)", type: "State CPA Society", city: "Little Rock", url: "https://www.arcpa.org", description: "Professional society serving over 3,000 certified public accountants." }
  ],
  california: [
    { name: "California Association of REALTORS® (C.A.R.)", type: "State REALTOR® Association", city: "Los Angeles", url: "https://www.car.org", description: "Statewide real estate powerhouse representing over 200,000 licensed real estate agents and brokers." },
    { name: "California Society of CPAs (CalCPA)", type: "State CPA Society", city: "Burlingame / Sacramento", url: "https://www.calcpa.org", description: "Largest state CPA society in the US with over 40,000 accounting and finance members." }
  ],
  colorado: [
    { name: "Colorado Association of REALTORS®", type: "State REALTOR® Association", city: "Englewood / Denver", url: "https://www.coloradorealtors.com", description: "Statewide organization serving 29,000 real estate professionals across Colorado." },
    { name: "Colorado Society of CPAs (COCPA)", type: "State CPA Society", city: "Englewood", url: "https://www.cocpa.org", description: "Advocating for CPAs in public practice, corporate finance, and consulting." }
  ],
  connecticut: [
    { name: "Connecticut Association of REALTORS®", type: "State REALTOR® Association", city: "East Hartford", url: "https://www.ctrealtors.com", description: "Representing 19,000 real estate professionals in residential and commercial markets." },
    { name: "Connecticut Society of CPAs (CTCPA)", type: "State CPA Society", city: "Rocky Hill", url: "https://www.ctcpa.org", description: "Statewide community of CPAs and financial executives in Connecticut." }
  ],
  delaware: [
    { name: "Delaware Association of REALTORS®", type: "State REALTOR® Association", city: "Dover", url: "https://www.delawarerealtor.com", description: "Statewide trade organization protecting private property rights and real estate practice." },
    { name: "Delaware Society of CPAs", type: "State CPA Society", city: "Wilmington", url: "https://www.dscpa.org", description: "Professional home for Delaware CPAs and tax advisory professionals." }
  ],
  florida: [
    { name: "Florida REALTORS® Association", type: "State REALTOR® Association", city: "Orlando", url: "https://www.floridarealtors.org", description: "Largest trade association in Florida representing 238,000 real estate professionals." },
    { name: "Florida Institute of CPAs (FICPA)", type: "State CPA Society", city: "Orlando / Tallahassee", url: "https://www.ficpa.org", description: "Official association for over 19,500 CPAs and financial decision-makers." }
  ],
  georgia: [
    { name: "Georgia Association of REALTORS® (GAR)", type: "State REALTOR® Association", city: "Atlanta", url: "https://www.garealtor.com", description: "Statewide real estate organization representing 50,000 commercial and residential brokers." },
    { name: "Georgia Society of CPAs (GSCPA)", type: "State CPA Society", city: "Atlanta", url: "https://www.gscpa.org", description: "Premier professional organization for CPAs across Georgia's financial sector." }
  ],
  hawaii: [
    { name: "Hawaii Association of REALTORS®", type: "State REALTOR® Association", city: "Honolulu", url: "https://www.hawaiirealtors.com", description: "Statewide voice of real estate in Hawaii representing 10,000 members." },
    { name: "Hawaii Society of CPAs (HSCPA)", type: "State CPA Society", city: "Honolulu", url: "https://www.hscpa.org", description: "Professional association serving certified public accountants in Hawaii." }
  ],
  idaho: [
    { name: "Idaho REALTORS® Association", type: "State REALTOR® Association", city: "Boise", url: "https://www.idahorealtors.com", description: "Promoting real estate professionalism and private property rights across Idaho." },
    { name: "Idaho Society of CPAs (ISCPA)", type: "State CPA Society", city: "Boise", url: "https://www.idcpa.org", description: "Advocating for CPAs, financial managers, and accounting educators." }
  ],
  illinois: [
    { name: "Illinois REALTORS® Association", type: "State REALTOR® Association", city: "Springfield", url: "https://www.illinoisrealtors.org", description: "Statewide trade organization representing 50,000 real estate brokers and appraisers." },
    { name: "Illinois CPA Society (ICPAS)", type: "State CPA Society", city: "Chicago", url: "https://www.icpas.org", description: "One of the largest state CPA societies in the US with over 23,000 financial members." }
  ],
  indiana: [
    { name: "Indiana Association of REALTORS®", type: "State REALTOR® Association", city: "Indianapolis", url: "https://www.indianarealtors.com", description: "Representing 21,000 real estate professionals in commercial and residential markets." },
    { name: "Indiana CPA Society (INCPAS)", type: "State CPA Society", city: "Indianapolis", url: "https://www.incpas.org", description: "Statewide network empowering CPAs and financial advisory firms." }
  ],
  iowa: [
    { name: "Iowa Association of REALTORS®", type: "State REALTOR® Association", city: "West Des Moines", url: "https://www.iowarealtors.com", description: "Voice for real estate in Iowa serving 8,500 real estate professionals." },
    { name: "Iowa Society of CPAs (ISCPA)", type: "State CPA Society", city: "West Des Moines", url: "https://www.iacpa.org", description: "Professional organization representing over 4,600 CPAs across Iowa." }
  ],
  kansas: [
    { name: "Kansas Association of REALTORS®", type: "State REALTOR® Association", city: "Topeka", url: "https://www.kansasrealtor.com", description: "Statewide association for real estate brokers, agents, and property managers." },
    { name: "Kansas Society of CPAs (KSCPA)", type: "State CPA Society", city: "Topeka", url: "https://www.kscpa.org", description: "Statewide community for CPAs in public accounting, corporate finance, and tech." }
  ],
  kentucky: [
    { name: "Kentucky REALTORS® Association", type: "State REALTOR® Association", city: "Lexington", url: "https://www.kyrealtors.com", description: "Representing 12,000 real estate practitioners across Kentucky." },
    { name: "Kentucky Society of CPAs (KyCPA)", type: "State CPA Society", city: "Louisville", url: "https://www.kycpa.org", description: "Professional organization promoting financial reporting standards and CPA education." }
  ],
  louisiana: [
    { name: "Louisiana REALTORS® Association", type: "State REALTOR® Association", city: "Baton Rouge", url: "https://www.larealtors.org", description: "Statewide advocate for property owners and real estate professionals." },
    { name: "Society of Louisiana CPAs (LCPA)", type: "State CPA Society", city: "Kenner / New Orleans", url: "https://www.lcpa.org", description: "Premier association representing over 6,000 Louisiana CPAs." }
  ],
  maine: [
    { name: "Maine Association of REALTORS®", type: "State REALTOR® Association", city: "Augusta", url: "https://www.mainerealtors.com", description: "Representing over 6,500 real estate professionals across Maine." },
    { name: "Maine Society of CPAs (MECPA)", type: "State CPA Society", city: "Portland", url: "https://www.mecpa.org", description: "Statewide association of certified public accountants and financial managers." }
  ],
  maryland: [
    { name: "Maryland REALTORS® Association", type: "State REALTOR® Association", city: "Annapolis", url: "https://www.mdrealtor.org", description: "Statewide association representing over 25,000 real estate practitioners." },
    { name: "Maryland Association of CPAs (MACPA)", type: "State CPA Society", city: "Towson / Baltimore", url: "https://www.macpa.org", description: "Innovative CPA society providing legislative advocacy and professional development." }
  ],
  massachusetts: [
    { name: "Massachusetts Association of REALTORS® (MAR)", type: "State REALTOR® Association", city: "Waltham", url: "https://www.marealtor.com", description: "Statewide trade association representing 26,000 real estate professionals." },
    { name: "Massachusetts Society of CPAs (MassCPAs)", type: "State CPA Society", city: "Boston", url: "https://www.masscpas.org", description: "Premier professional organization representing 11,000 CPAs and accounting professionals." }
  ],
  michigan: [
    { name: "Michigan REALTORS® Association", type: "State REALTOR® Association", city: "Lansing", url: "https://www.mirealtors.com", description: "Advocating for real estate property rights and over 34,000 Realtor members." },
    { name: "Michigan Association of CPAs (MICPA)", type: "State CPA Society", city: "Troy / Lansing", url: "https://www.micpa.org", description: "Leading accounting association representing over 17,000 CPAs across Michigan." }
  ],
  minnesota: [
    { name: "Minnesota REALTORS® Association", type: "State REALTOR® Association", city: "Minnetonka", url: "https://www.mnrealtor.com", description: "Statewide association serving 22,000 real estate professionals." },
    { name: "Minnesota Society of CPAs (MNCPA)", type: "State CPA Society", city: "Bloomington", url: "https://www.mncpa.org", description: "Professional society of over 8,000 CPAs in public accounting and corporate finance." }
  ],
  mississippi: [
    { name: "Mississippi REALTORS® Association", type: "State REALTOR® Association", city: "Jackson", url: "https://www.msrealtors.org", description: "Representing 7,000 real estate agents, brokers, and appraisers in Mississippi." },
    { name: "Mississippi Society of CPAs (MSCPA)", type: "State CPA Society", city: "Jackson", url: "https://www.ms-cpa.org", description: "Professional organization for CPAs serving Mississippi businesses." }
  ],
  missouri: [
    { name: "Missouri REALTORS® Association", type: "State REALTOR® Association", city: "Columbia", url: "https://www.missourirealtor.org", description: "Statewide trade association representing over 25,000 real estate members." },
    { name: "Missouri Society of CPAs (MOCPA)", type: "State CPA Society", city: "St. Louis", url: "https://www.mocpa.org", description: "Statewide association serving 9,000 CPAs in corporate finance and public accounting." }
  ],
  montana: [
    { name: "Montana Association of REALTORS®", type: "State REALTOR® Association", city: "Helena", url: "https://www.montanarealtors.org", description: "Representing over 5,000 real estate professionals across Montana." },
    { name: "Montana Society of CPAs (MTSCPA)", type: "State CPA Society", city: "Helena", url: "https://www.montanacpa.org", description: "Professional home for Montana certified public accountants." }
  ],
  nebraska: [
    { name: "Nebraska REALTORS® Association", type: "State REALTOR® Association", city: "Lincoln", url: "https://www.nebraskarealtors.com", description: "Statewide association representing 5,000 licensed real estate professionals." },
    { name: "Nebraska Society of CPAs (NESCPA)", type: "State CPA Society", city: "Lincoln", url: "https://www.nescpa.org", description: "Advocating for CPAs, financial managers, and accounting educators across Nebraska." }
  ],
  nevada: [
    { name: "Nevada REALTORS® Association", type: "State REALTOR® Association", city: "Reno / Las Vegas", url: "https://nevadarealtors.org", description: "Statewide association representing 20,000 commercial and residential real estate agents." },
    { name: "Nevada Society of CPAs (NVCPA)", type: "State CPA Society", city: "Reno", url: "https://www.nevadacpa.org", description: "Professional organization representing CPAs in gaming, finance, and public accounting." }
  ],
  "new-hampshire": [
    { name: "New Hampshire Association of REALTORS®", type: "State REALTOR® Association", city: "Concord", url: "https://www.nhar.com", description: "Representing 7,000 real estate professionals across New Hampshire." },
    { name: "New Hampshire Society of CPAs (NHSCPA)", type: "State CPA Society", city: "Manchester", url: "https://www.nhscpa.org", description: "Statewide organization supporting accounting professionals and tax specialists." }
  ],
  "new-jersey": [
    { name: "New Jersey REALTORS® Association", type: "State REALTOR® Association", city: "Trenton", url: "https://www.njrealtor.com", description: "Statewide real estate organization representing over 60,000 members." },
    { name: "New Jersey Society of CPAs (NJCPA)", type: "State CPA Society", city: "Roseland", url: "https://www.njcpa.org", description: "Premier state accounting society representing 14,000 CPAs and financial managers." }
  ],
  "new-mexico": [
    { name: "New Mexico Association of REALTORS®", type: "State REALTOR® Association", city: "Santa Fe", url: "https://www.nmrealtor.com", description: "Statewide association serving over 7,000 real estate practitioners." },
    { name: "New Mexico Society of CPAs (NMSCPA)", type: "State CPA Society", city: "Albuquerque", url: "https://www.nmscpa.org", description: "Professional organization for CPAs across public accounting and industry." }
  ],
  "new-york": [
    { name: "New York State Association of REALTORS® (NYSAR)", type: "State REALTOR® Association", city: "Albany", url: "https://www.nysar.com", description: "Statewide real estate trade association representing over 60,000 real estate professionals." },
    { name: "New York State Society of CPAs (NYSSCPA)", type: "State CPA Society", city: "New York City", url: "https://www.nysscpa.org", description: "Historic CPA society representing 24,000 certified public accountants." }
  ],
  "north-carolina": [
    { name: "NC REALTORS® Association", type: "State REALTOR® Association", city: "Greensboro / Raleigh", url: "https://www.ncrealtors.org", description: "Statewide trade organization serving over 55,000 real estate members." },
    { name: "NC Association of CPAs (NCACPA)", type: "State CPA Society", city: "Raleigh", url: "https://www.ncacpa.org", description: "Premier association representing over 13,000 accounting professionals in North Carolina." }
  ],
  "north-dakota": [
    { name: "North Dakota Association of REALTORS®", type: "State REALTOR® Association", city: "Bismarck", url: "https://www.ndrealtors.com", description: "Representing real estate agents and brokers across North Dakota." },
    { name: "North Dakota Society of CPAs (NDCPA)", type: "State CPA Society", city: "Grand Forks", url: "https://www.ndcpa.org", description: "Advocating for CPAs, financial advisors, and corporate controllers." }
  ],
  ohio: [
    { name: "Ohio REALTORS® Association", type: "State REALTOR® Association", city: "Columbus", url: "https://www.ohiorealtors.org", description: "Largest professional trade association in Ohio with over 36,000 real estate members." },
    { name: "The Ohio Society of CPAs (OSCPA)", type: "State CPA Society", city: "Columbus", url: "https://www.ohiocpa.com", description: "Leading professional association serving 27,000 CPAs and financial executives." }
  ],
  oklahoma: [
    { name: "Oklahoma Association of REALTORS®", type: "State REALTOR® Association", city: "Oklahoma City", url: "https://www.okrealtors.com", description: "Statewide association representing 14,000 real estate professionals." },
    { name: "Oklahoma Society of CPAs (OSCPA)", type: "State CPA Society", city: "Oklahoma City", url: "https://www.oscpa.com", description: "Statewide community for CPAs in public accounting, industry, and education." }
  ],
  oregon: [
    { name: "Oregon REALTORS® Association", type: "State REALTOR® Association", city: "Salem", url: "https://www.oregonrealtors.org", description: "Representing 18,000 real estate agents, brokers, and appraisers in Oregon." },
    { name: "Oregon Society of CPAs (OSCPA)", type: "State CPA Society", city: "Beaverton", url: "https://www.orcpa.org", description: "Professional organization for CPAs across public practice and corporate enterprise." }
  ],
  pennsylvania: [
    { name: "Pennsylvania Association of REALTORS® (PAR)", type: "State REALTOR® Association", city: "Harrisburg", url: "https://www.parealtors.org", description: "Statewide trade organization representing 35,000 real estate professionals." },
    { name: "Pennsylvania Institute of CPAs (PICPA)", type: "State CPA Society", city: "Philadelphia / Harrisburg", url: "https://www.picpa.org", description: "Premier professional association serving 20,000 CPAs and financial advisors." }
  ],
  "rhode-island": [
    { name: "Rhode Island Association of REALTORS®", type: "State REALTOR® Association", city: "Warwick", url: "https://www.rirealtors.org", description: "Representing over 6,000 real estate professionals across Rhode Island." },
    { name: "Rhode Island Society of CPAs (RISCPA)", type: "State CPA Society", city: "Cranston", url: "https://www.riscpa.org", description: "Advocating for CPAs, financial officers, and tax professionals." }
  ],
  "south-carolina": [
    { name: "South Carolina REALTORS® Association", type: "State REALTOR® Association", city: "Columbia", url: "https://www.screaltors.org", description: "Statewide real estate association representing 29,000 members." },
    { name: "South Carolina Association of CPAs (SCACPA)", type: "State CPA Society", city: "Columbia", url: "https://www.scacpa.org", description: "Statewide association representing over 4,000 certified public accountants." }
  ],
  "south-dakota": [
    { name: "South Dakota Association of REALTORS®", type: "State REALTOR® Association", city: "Pierre", url: "https://www.sdrealtor.org", description: "Representing real estate professionals and private property rights in South Dakota." },
    { name: "South Dakota CPA Society (SDCPA)", type: "State CPA Society", city: "Sioux Falls", url: "https://www.sdcpa.org", description: "Professional organization serving CPAs and financial managers across South Dakota." }
  ],
  tennessee: [
    { name: "Tennessee REALTORS® Association", type: "State REALTOR® Association", city: "Nashville", url: "https://www.tnrealtors.com", description: "Statewide real estate association representing 35,000 members." },
    { name: "Tennessee Society of CPAs (TSCPA)", type: "State CPA Society", city: "Brentwood / Nashville", url: "https://www.tscpa.com", description: "Premier professional association serving over 10,000 CPAs in Tennessee." }
  ],
  texas: [
    { name: "Texas REALTORS® Association", type: "State REALTOR® Association", city: "Austin", url: "https://www.texasrealestate.com", description: "Massive state association representing over 150,000 real estate professionals." },
    { name: "Texas Society of CPAs (TXCPA)", type: "State CPA Society", city: "Dallas", url: "https://www.tx.cpa", description: "Largest state CPA society in Texas representing 28,000 financial members." }
  ],
  utah: [
    { name: "Utah Association of REALTORS®", type: "State REALTOR® Association", city: "Sandy / Salt Lake City", url: "https://utahrealtors.com", description: "Statewide real estate organization representing 19,000 members." },
    { name: "Utah Association of CPAs (UACPA)", type: "State CPA Society", city: "Salt Lake City", url: "https://www.uacpa.org", description: "Professional home for Utah CPAs, tax managers, and corporate auditors." }
  ],
  vermont: [
    { name: "Vermont Association of REALTORS®", type: "State REALTOR® Association", city: "Montpelier", url: "https://www.vermontrealtors.com", description: "Representing over 1,800 real estate professionals across Vermont." },
    { name: "Vermont Society of CPAs (VTCPA)", type: "State CPA Society", city: "Burlington", url: "https://www.vtcpa.org", description: "Advocating for CPAs and financial managers in Vermont." }
  ],
  virginia: [
    { name: "Virginia REALTORS® Association", type: "State REALTOR® Association", city: "Glen Allen / Richmond", url: "https://www.virginiarealtors.org", description: "Statewide real estate association representing over 38,000 Realtor members." },
    { name: "Virginia Society of CPAs (VSCPA)", type: "State CPA Society", city: "Richmond", url: "https://www.vscpa.com", description: "Leading professional association representing 13,000 CPAs across Virginia." }
  ],
  washington: [
    { name: "Washington REALTORS® Association", type: "State REALTOR® Association", city: "Olympia", url: "https://www.warealtor.org", description: "Statewide trade organization serving 22,000 real estate professionals." },
    { name: "Washington Society of CPAs (WSCPA)", type: "State CPA Society", city: "Bellevue", url: "https://www.wscpa.org", description: "Premier accounting association serving 7,500 CPAs and financial managers." }
  ],
  "west-virginia": [
    { name: "West Virginia Association of REALTORS®", type: "State REALTOR® Association", city: "Charleston", url: "https://www.wvrealtors.com", description: "Representing real estate agents and brokers across West Virginia." },
    { name: "West Virginia Society of CPAs (WVSCPA)", type: "State CPA Society", city: "Charleston", url: "https://www.wvscpa.org", description: "Professional home for West Virginia certified public accountants." }
  ],
  wisconsin: [
    { name: "Wisconsin REALTORS® Association (WRA)", type: "State REALTOR® Association", city: "Madison", url: "https://www.wra.org", description: "One of the largest trade associations in Wisconsin representing 17,000 real estate members." },
    { name: "Wisconsin Institute of CPAs (WICPA)", type: "State CPA Society", city: "Brookfield / Milwaukee", url: "https://www.wicpa.org", description: "Premier professional organization representing 7,000 CPAs across Wisconsin." }
  ],
  wyoming: [
    { name: "Wyoming Association of REALTORS®", type: "State REALTOR® Association", city: "Casper", url: "https://www.wyomingrealtors.org", description: "Representing real estate professionals and property rights across Wyoming." },
    { name: "Wyoming Society of CPAs (WYOCPA)", type: "State CPA Society", city: "Cheyenne", url: "https://www.wyocpa.org", description: "Professional society serving certified public accountants in Wyoming." }
  ]
};

export function getStateRealtorsCPAs(stateSlugOrName: string): RealtorAssoc[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_REALTOR_CPA[normalized] || [];
}
