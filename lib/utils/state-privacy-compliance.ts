export interface ComplianceItem {
  name: string;
  category: "State Privacy Law / Regulation" | "SOS Entity Search Portal" | "Major Festival & Trade Conference";
  city: string;
  url: string;
  description: string;
}

export const US_STATE_COMPLIANCE: Record<string, ComplianceItem[]> = {
  alabama: [
    { name: "Alabama Secretary of State Business Entity Search", category: "SOS Entity Search Portal", city: "Montgomery", url: "https://sos.alabama.gov/government-records/business-entity-records", description: "Official state database for verifying corporate, LLC, and trademark registrations." },
    { name: "Alabama Data Breach Notification Act", category: "State Privacy Law / Regulation", city: "Montgomery", url: "https://www.alabamaag.gov", description: "State law requiring notification of security breaches involving personal info." },
    { name: "Hangout Music Festival", category: "Major Festival & Trade Conference", city: "Gulf Shores", url: "https://www.hangoutmusicfest.com", description: "Major annual beach festival drawing 45,000+ national visitors and commercial brand sponsors." }
  ],
  alaska: [
    { name: "Alaska Corporations & Entity Search", category: "SOS Entity Search Portal", city: "Juneau", url: "https://www.commerce.alaska.gov/cbp/main/search/entities", description: "Official business database for verifying Alaska entities and professional licenses." },
    { name: "Alaska State Fair", category: "Major Festival & Trade Conference", city: "Palmer", url: "https://www.alaskastatefair.org", description: "Largest annual 12-day state festival drawing 300,000+ attendees and vendor partners." }
  ],
  arizona: [
    { name: "Arizona Corporation Commission Business Search", category: "SOS Entity Search Portal", city: "Phoenix", url: "https://ecorp.azcc.gov/EntitySearch/Index", description: "Official eCorp portal for corporate entity filings and trade name reservations." },
    { name: "Arizona Consumer Privacy Protection Standards", category: "State Privacy Law / Regulation", city: "Phoenix", url: "https://azag.gov", description: "State regulations governing consumer data breach disclosures and identity protection." },
    { name: "Waste Management Phoenix Open", category: "Major Festival & Trade Conference", city: "Scottsdale", url: "https://wmphoenixopen.com", description: "Highest attended golf tournament in the world drawing 700,000+ fans and corporate hospitality buyers." }
  ],
  arkansas: [
    { name: "Arkansas SOS Business Entity Search", category: "SOS Entity Search Portal", city: "Little Rock", url: "https://www.sos.arkansas.gov/corps/search_all.php", description: "Official database to verify LLC, corporation, and franchise filings." },
    { name: "Walmart NW Arkansas Championship (LPGA)", category: "Major Festival & Trade Conference", city: "Rogers", url: "https://www.nwarchampionship.com", description: "Premier regional sporting festival and CPG vendor conference." }
  ],
  california: [
    { name: "California Consumer Privacy Act (CCPA / CPRA)", category: "State Privacy Law / Regulation", city: "Sacramento / Statewide", url: "https://oag.ca.gov/privacy/ccpa", description: "Landmark data privacy law establishing consumer opt-out rights, data access, and strict penalties." },
    { name: "California Secretary of State Business Search (bizfile Online)", category: "SOS Entity Search Portal", city: "Sacramento", url: "https://bizfileonline.sos.ca.gov/search/business", description: "Official state portal to look up 2.5 million active California corporations and LLCs." },
    { name: "Coachella Valley Music & Arts Festival", category: "Major Festival & Trade Conference", city: "Indio", url: "https://www.coachella.com", description: "Global cultural event drawing 250,000+ attendees with major brand activations and sponsors." },
    { name: "San Diego Comic-Con International", category: "Major Festival & Trade Conference", city: "San Diego", url: "https://www.comic-con.org", description: "Premier global pop-culture summit drawing 135,000+ attendees and media executives." }
  ],
  colorado: [
    { name: "Colorado Privacy Act (CPA)", category: "State Privacy Law / Regulation", city: "Denver", url: "https://coag.gov/resources/colorado-privacy-act", description: "Comprehensive state privacy act granting consumers data deletion and opt-out rights." },
    { name: "Colorado Secretary of State Business Search", category: "SOS Entity Search Portal", city: "Denver", url: "https://www.sos.state.co.us/biz/BusinessEntityCriteriaExt.do", description: "Official portal for verifying registered business names, LLCs, and trade status." }
  ],
  connecticut: [
    { name: "Connecticut Data Privacy Act (CTDPA)", category: "State Privacy Law / Regulation", city: "Hartford", url: "https://portal.ct.gov/AG/Sections/Privacy/Connecticut-Data-Privacy-Act", description: "State law providing strict privacy protections and consumer data safeguards." },
    { name: "Connecticut Business Entity Search", category: "SOS Entity Search Portal", city: "Hartford", url: "https://service.ct.gov/business/s/onlinebusinesssearch", description: "Official state database for searching registered business entities." }
  ],
  delaware: [
    { name: "Delaware Division of Corporations Entity Search", category: "SOS Entity Search Portal", city: "Dover / Wilmington", url: "https://icmp.icis.delaware.gov", description: "Corporate capital of the US — verify status of Fortune 500 Delaware entities." },
    { name: "Firefly Music Festival", category: "Major Festival & Trade Conference", city: "Dover", url: "https://fireflyfestival.com", description: "Premier East Coast music festival drawing 50,000+ attendees at Dover Motor Speedway." }
  ],
  florida: [
    { name: "Sunbiz.org (Florida Division of Corporations)", category: "SOS Entity Search Portal", city: "Tallahassee", url: "https://search.sunbiz.org/Inquiry/CorporationSearch/ByName", description: "Most visited state business portal in the US for searching LLCs, corporations, and fictitious names." },
    { name: "Florida Digital Bill of Rights (FDBR)", category: "State Privacy Law / Regulation", city: "Tallahassee", url: "https://www.myfloridalegal.com", description: "State privacy law establishing consumer rights regarding data processing and targeted ads." },
    { name: "Art Basel Miami Beach", category: "Major Festival & Trade Conference", city: "Miami Beach", url: "https://www.artbasel.com/miami-beach", description: "Premier international art fair bringing high-net-worth global buyers and luxury sponsors." }
  ],
  georgia: [
    { name: "Georgia Secretary of State Corporations Search", category: "SOS Entity Search Portal", city: "Atlanta", url: "https://ecorp.sos.ga.gov/BusinessSearch", description: "Official database to verify business licenses, LLCs, and trademarks." },
    { name: "Atlanta Food & Wine Festival", category: "Major Festival & Trade Conference", city: "Atlanta", url: "https://atlfoodandwinefestival.com", description: "Premier Southern culinary expo drawing top CPG brands and hospitality sponsors." }
  ],
  hawaii: [
    { name: "Hawaii BREG (Business Registration Search)", category: "SOS Entity Search Portal", city: "Honolulu", url: "https://hbe.ehawaii.gov/documents/search.html", description: "Official portal for searching Hawaii business documents and trade names." }
  ],
  idaho: [
    { name: "Idaho SOS Business Search", category: "SOS Entity Search Portal", city: "Boise", url: "https://sosbiz.idaho.gov/search/business", description: "Official state portal to look up registered LLCs and corporations." }
  ],
  illinois: [
    { name: "Illinois Secretary of State Corporate Search", category: "SOS Entity Search Portal", city: "Springfield / Chicago", url: "https://apps.ilsos.gov/corporatellc", description: "Official database to verify active Illinois corporate registrations." },
    { name: "Lollapalooza Chicago", category: "Major Festival & Trade Conference", city: "Chicago", url: "https://www.lollapalooza.com", description: "Four-day festival in Grant Park drawing 400,000+ global music fans and major sponsors." }
  ],
  indiana: [
    { name: "INBiz Business Search (Indiana SOS)", category: "SOS Entity Search Portal", city: "Indianapolis", url: "https://bsd.sos.in.gov/publicbusinesssearch", description: "One-stop state business portal to verify registered business entities." }
  ],
  iowa: [
    { name: "Iowa SOS Business Search", category: "SOS Entity Search Portal", city: "Des Moines", url: "https://sos.iowa.gov/search/business/search.aspx", description: "Official state database for checking Iowa corporations and LLCs." }
  ],
  kansas: [
    { name: "Kansas Business Entity Search (Kansas Center)", category: "SOS Entity Search Portal", city: "Topeka", url: "https://www.kansas.gov/bess/flow/main", description: "Official database to verify active Kansas corporations and trademarks." }
  ],
  kentucky: [
    { name: "Kentucky SOS FastTrack Business Search", category: "SOS Entity Search Portal", city: "Frankfort", url: "https://web.sos.ky.gov/ftsearch", description: "Official portal to verify corporate standing in Kentucky." },
    { name: "Kentucky Derby Festival", category: "Major Festival & Trade Conference", city: "Louisville", url: "https://kdf.org", description: "Month-long festival featuring 70+ events leading to the Kentucky Derby." }
  ],
  louisiana: [
    { name: "geauxBIZ (Louisiana SOS Business Search)", category: "SOS Entity Search Portal", city: "Baton Rouge", url: "https://geauxbiz.sos.la.gov", description: "Official state portal for business registration and entity lookup." },
    { name: "New Orleans Jazz & Heritage Festival", category: "Major Festival & Trade Conference", city: "New Orleans", url: "https://www.nojazzfest.com", description: "Historic 7-day cultural festival drawing 475,000+ visitors." }
  ],
  maine: [
    { name: "Maine Corporate Name Search", category: "SOS Entity Search Portal", city: "Augusta", url: "https://icrs.informe.org/meiow/me_corps", description: "Official state database for verifying corporate records." }
  ],
  maryland: [
    { name: "Maryland Business Express (SDAT Search)", category: "SOS Entity Search Portal", city: "Baltimore", url: "https://egov.maryland.gov/BusinessExpress/EntitySearch", description: "Official state portal to look up Maryland business entities and personal property." }
  ],
  massachusetts: [
    { name: "Massachusetts Corporations Division Search", category: "SOS Entity Search Portal", city: "Boston", url: "https://corp.sec.state.ma.us/corp-search/corpsearchinput.aspx", description: "Official database to verify active Massachusetts business filings." }
  ],
  michigan: [
    { name: "Michigan LARA Business Entity Search", category: "SOS Entity Search Portal", city: "Lansing", url: "https://cofs.lara.state.mi.us/SearchCorporation/SearchCorporation.aspx", description: "Official state portal for verifying corporations, LLCs, and partnerships." }
  ],
  minnesota: [
    { name: "Minnesota Business Filing Search (MBLS)", category: "SOS Entity Search Portal", city: "St. Paul", url: "https://mblsportal.sos.state.mn.us/Business/Search", description: "Official database to verify Minnesota business filings." },
    { name: "Minnesota State Fair", category: "Major Festival & Trade Conference", city: "St. Paul", url: "https://www.mnstatefair.org", description: "Second-largest state fair in the US drawing over 2 million attendees." }
  ],
  mississippi: [
    { name: "Mississippi Business Search (SOS)", category: "SOS Entity Search Portal", city: "Jackson", url: "https://corp.sos.ms.gov/corp/portal/c/page/corpBusinessIdSearch/portal.aspx", description: "Official state portal to verify business entity records." }
  ],
  missouri: [
    { name: "Missouri SOS Business Entity Search", category: "SOS Entity Search Portal", city: "Jefferson City", url: "https://bsd.sos.mo.gov/BusinessEntity/BESearch.aspx", description: "Official database to verify active Missouri corporate records." }
  ],
  montana: [
    { name: "Montana Business Search (SOS)", category: "SOS Entity Search Portal", city: "Helena", url: "https://biz.sosmt.gov/search/business", description: "Official state portal for searching Montana business entity records." }
  ],
  nebraska: [
    { name: "Nebraska Corporate Search (SOS)", category: "SOS Entity Search Portal", city: "Lincoln", url: "https://www.nebraska.gov/sos/corp/corpsearch.cgi", description: "Official portal for checking Nebraska corporations and LLCs." }
  ],
  nevada: [
    { name: "SilverFlume (Nevada Business Search)", category: "SOS Entity Search Portal", city: "Carson City / Las Vegas", url: "https://www.nvsilverflume.gov", description: "Official portal to look up Nevada corporations, LLCs, and state business licenses." },
    { name: "Consumer Electronics Show (CES)", category: "Major Festival & Trade Conference", city: "Las Vegas", url: "https://www.ces.tech", description: "World's most influential technology trade show drawing 135,000+ global executives." }
  ],
  "new-hampshire": [
    { name: "NH Business Search (SOS)", category: "SOS Entity Search Portal", city: "Concord", url: "https://quickstart.sos.nh.gov/online/Account/LandingPage", description: "Official state portal for searching NH registered business entities." }
  ],
  "new-jersey": [
    { name: "New Jersey Business Records Search (DOR)", category: "SOS Entity Search Portal", city: "Trenton", url: "https://www.njportal.com/DOR/BusinessRecords", description: "Official state database for checking NJ corporate status and certificates." }
  ],
  "new-mexico": [
    { name: "New Mexico Business Search (NMSOS)", category: "SOS Entity Search Portal", city: "Santa Fe", url: "https://portal.sos.state.nm.us/BFS/online/CorporationBusinessSearch", description: "Official database to verify registered New Mexico entities." }
  ],
  "new-york": [
    { name: "New York Department of State Corporation Search", category: "SOS Entity Search Portal", city: "Albany / NYC", url: "https://apps.dos.ny.gov/publicInquiry", description: "Official NY state portal to verify active corporations, LLCs, and limited partnerships." },
    { name: "New York Fashion Week (NYFW)", category: "Major Festival & Trade Conference", city: "New York City", url: "https://nyfw.com", description: "Global fashion summit drawing top media, brands, and luxury retail buyers." }
  ],
  "north-carolina": [
    { name: "North Carolina SOS Business Search", category: "SOS Entity Search Portal", city: "Raleigh", url: "https://www.sosnc.gov/search/index/corp", description: "Official database to verify active NC corporate filings." }
  ],
  "north-dakota": [
    { name: "FirstStop (North Dakota SOS Search)", category: "SOS Entity Search Portal", city: "Bismarck", url: "https://firststop.sos.nd.gov/search/business", description: "Official portal for checking North Dakota business records." }
  ],
  ohio: [
    { name: "Ohio SOS Business Search", category: "SOS Entity Search Portal", city: "Columbus", url: "https://businesssearch.ohiosos.gov", description: "Official portal to verify active Ohio LLCs, corporations, and trade names." }
  ],
  oklahoma: [
    { name: "Oklahoma Business Entity Search (SOS)", category: "SOS Entity Search Portal", city: "Oklahoma City", url: "https://www.sos.ok.gov/corp/corpInquiryFind.aspx", description: "Official state database to verify Oklahoma business filings." }
  ],
  oregon: [
    { name: "Oregon Business Registry Search", category: "SOS Entity Search Portal", city: "Salem", url: "https://egov.sos.state.or.us/br/pkg_br_web_regist_ind.login", description: "Official state database for checking Oregon business registrations." }
  ],
  pennsylvania: [
    { name: "PA Business Entity Search (DOS)", category: "SOS Entity Search Portal", city: "Harrisburg", url: "https://file.dos.pa.gov/search/business", description: "Official state database for searching Pennsylvania corporations and LLCs." }
  ],
  "rhode-island": [
    { name: "Rhode Island Corporate Database Search", category: "SOS Entity Search Portal", city: "Providence", url: "https://business.sos.ri.gov/CorpWeb/CorpSearch/CorpSearch.aspx", description: "Official portal to verify Rhode Island business records." }
  ],
  "south-carolina": [
    { name: "South Carolina SOS Business Search", category: "SOS Entity Search Portal", city: "Columbia", url: "https://businessfilings.sc.gov/BusinessFiling/Entity/Search", description: "Official portal for searching South Carolina business entities." }
  ],
  "south-dakota": [
    { name: "South Dakota Business Information Search", category: "SOS Entity Search Portal", city: "Pierre", url: "https://sosenterprise.sd.gov/BusinessServices/BusinessInformation/BusinessSearch.aspx", description: "Official portal for verifying South Dakota corporate records." }
  ],
  tennessee: [
    { name: "Tennessee Business Name Availability Search", category: "SOS Entity Search Portal", city: "Nashville", url: "https://tnbear.tn.gov/Ecommerce/FilingSearch.aspx", description: "Official state database to verify Tennessee business entities." },
    { name: "Bonnaroo Music & Arts Festival", category: "Major Festival & Trade Conference", city: "Manchester", url: "https://www.bonnaroo.com", description: "Iconic 4-day festival on a 700-acre farm drawing 80,000+ national visitors." }
  ],
  texas: [
    { name: "Texas Taxable Entity Search (Comptroller) / SOSDirect", category: "SOS Entity Search Portal", city: "Austin", url: "https://mycpa.cpa.state.tx.us/coa", description: "Official state search for verifying franchise tax standing and corporate status." },
    { name: "Texas Data Privacy and Security Act (TDPSA)", category: "State Privacy Law / Regulation", city: "Austin", url: "https://www.texasattorneygeneral.gov", description: "Comprehensive Texas consumer privacy law establishing opt-out and deletion rights." },
    { name: "SXSW (South by Southwest)", category: "Major Festival & Trade Conference", city: "Austin", url: "https://www.sxsw.com", description: "World-renowned tech, film, and music conference drawing 300,000+ global innovators." }
  ],
  utah: [
    { name: "Utah Consumer Privacy Act (UCPA)", category: "State Privacy Law / Regulation", city: "Salt Lake City", url: "https://attorneygeneral.utah.gov", description: "State privacy law providing consumer rights regarding data processing and targeted advertising." },
    { name: "Utah Business Entity Search", category: "SOS Entity Search Portal", city: "Salt Lake City", url: "https://secure.utah.gov/bes", description: "Official state database to verify active Utah business entities." },
    { name: "Sundance Film Festival", category: "Major Festival & Trade Conference", city: "Park City / Salt Lake City", url: "https://www.sundance.org", description: "Premier independent film festival drawing global media executives and corporate sponsors." }
  ],
  vermont: [
    { name: "Vermont Business Search (SOS)", category: "SOS Entity Search Portal", city: "Montpelier", url: "https://bizfilings.vermont.gov/online/BusinessInquiry", description: "Official portal for searching Vermont corporate records." }
  ],
  virginia: [
    { name: "Virginia Consumer Data Protection Act (VCDPA)", category: "State Privacy Law / Regulation", city: "Richmond", url: "https://www.oag.state.va.us", description: "Landmark Virginia privacy law granting consumers data access, correction, and deletion rights." },
    { name: "Virginia SCC Clerk's Information System (CIS)", category: "SOS Entity Search Portal", city: "Richmond", url: "https://cis.scc.virginia.gov", description: "Official portal to look up Virginia corporate entity filings." }
  ],
  washington: [
    { name: "Washington SOS Business Search", category: "SOS Entity Search Portal", city: "Olympia / Seattle", url: "https://ccfs.sos.wa.gov/#/BusinessSearch", description: "Official portal for verifying active Washington state corporations and LLCs." },
    { name: "Bumbershoot Seattle", category: "Major Festival & Trade Conference", city: "Seattle", url: "https://bumbershoot.com", description: "Long-running Pacific Northwest arts and music festival at Seattle Center." }
  ],
  "west-virginia": [
    { name: "West Virginia Business Entity Search", category: "SOS Entity Search Portal", city: "Charleston", url: "https://apps.wv.gov/SOS/BusinessEntitySearch", description: "Official state database to verify West Virginia business records." }
  ],
  wisconsin: [
    { name: "Wisconsin DFI Corporate Search", category: "SOS Entity Search Portal", city: "Madison", url: "https://www.wdfi.org/apps/CorpSearch/Search.aspx", description: "Official portal to verify active Wisconsin financial institutions and LLCs." },
    { name: "Summerfest Milwaukee", category: "Major Festival & Trade Conference", city: "Milwaukee", url: "https://www.summerfest.com", description: "Certified by Guinness World Records as the World's Largest Music Festival drawing 750,000+ attendees." }
  ],
  wyoming: [
    { name: "Wyoming Business Search (SOS)", category: "SOS Entity Search Portal", city: "Cheyenne", url: "https://wyobiz.wyo.gov/Business/FilingSearch.aspx", description: "Premier corporate privacy hub — official portal to verify Wyoming LLCs." }
  ]
};

export function getStateCompliance(stateSlugOrName: string): ComplianceItem[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_COMPLIANCE[normalized] || [];
}
