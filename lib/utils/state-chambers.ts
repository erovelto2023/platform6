export interface StateChamber {
  name: string;
  type: "State Chamber of Commerce" | "Economic Development Corporation (EDC)" | "SBDC Business Center" | "State Trade Association";
  city: string;
  url: string;
  description: string;
}

export const US_STATE_CHAMBERS: Record<string, StateChamber[]> = {
  alabama: [
    { name: "Business Council of Alabama (State Chamber)", type: "State Chamber of Commerce", city: "Montgomery", url: "https://www.bcatoday.org", description: "Official state chamber of commerce representing over 1 million working Alabamians." },
    { name: "Economic Development Partnership of Alabama (EDPA)", type: "Economic Development Corporation (EDC)", city: "Birmingham", url: "https://www.edpa.org", description: "Private non-profit organization driving business attraction, innovation, and startup growth." },
    { name: "Alabama Small Business Development Center Network (SBDC)", type: "SBDC Business Center", city: "Tuscaloosa", url: "https://asbdc.org", description: "Statewide business consulting and technical assistance network for entrepreneurs." },
    { name: "Manufacture Alabama", type: "State Trade Association", city: "Montgomery", url: "https://www.manufacturealabama.org", description: "Trade association representing industrial manufacturers and technology producers." }
  ],
  alaska: [
    { name: "State of Alaska Chamber of Commerce", type: "State Chamber of Commerce", city: "Anchorage", url: "https://www.alaskachamber.com", description: "Statewide business advocacy group supporting policy and economic expansion." },
    { name: "Alaska Development Team / Dept of Commerce", type: "Economic Development Corporation (EDC)", city: "Juneau", url: "https://www.commerce.alaska.gov", description: "State agency leading trade missions, business incentives, and capital projects." },
    { name: "Alaska Small Business Development Center", type: "SBDC Business Center", city: "Anchorage", url: "https://aksbdc.org", description: "Providing business counseling, financial modeling, and export assistance across Alaska." }
  ],
  arizona: [
    { name: "Arizona Chamber of Commerce and Industry", type: "State Chamber of Commerce", city: "Phoenix", url: "https://azchamber.com", description: "Leading statewide business organization promoting free enterprise and job creation." },
    { name: "Arizona Commerce Authority (ACA)", type: "Economic Development Corporation (EDC)", city: "Phoenix", url: "https://www.azcommerce.com", description: "Full-service economic development agency focused on growing Arizona's tech economy." },
    { name: "Arizona Small Business Development Center Network", type: "SBDC Business Center", city: "Tempe", url: "https://azsbdc.net", description: "Providing operational training, capital access, and strategic guidance to local small businesses." },
    { name: "Arizona Technology Council", type: "State Trade Association", city: "Phoenix", url: "https://www.aztechcouncil.org", description: "Premier trade association for science, tech, and bioscience enterprises." }
  ],
  arkansas: [
    { name: "Arkansas State Chamber of Commerce", type: "State Chamber of Commerce", city: "Little Rock", url: "https://www.arkansasstatechamber.com", description: "Voice of Arkansas business, fostering economic development and regulatory reform." },
    { name: "Arkansas Economic Development Commission (AEDC)", type: "Economic Development Corporation (EDC)", city: "Little Rock", url: "https://www.arkansasedc.com", description: "State agency offering business incentives, site selection, and workforce training." },
    { name: "Arkansas Small Business and Technology Development Center (ASBTDC)", type: "SBDC Business Center", city: "Little Rock", url: "https://asbtdc.org", description: "Higher-education-based business center supporting tech startups and small enterprises." }
  ],
  california: [
    { name: "California Chamber of Commerce (CalChamber)", type: "State Chamber of Commerce", city: "Sacramento", url: "https://www.calchamber.com", description: "Largest state chamber in California advocating for business competitiveness and compliance." },
    { name: "Governor's Office of Business and Economic Development (GO-Biz)", type: "Economic Development Corporation (EDC)", city: "Sacramento", url: "https://business.ca.gov", description: "Lead state agency for business investment, export assistance, and tax credit incentives." },
    { name: "California Small Business Development Center Network", type: "SBDC Business Center", city: "Statewide", url: "https://www.californiasbdc.org", description: "Network of over 40 regional centers offering free business consulting and capital access." },
    { name: "California Manufacturers & Technology Association (CMTA)", type: "State Trade Association", city: "Sacramento", url: "https://cmta.net", description: "Advocating for manufacturing, technology, and clean energy innovation." }
  ],
  colorado: [
    { name: "Colorado Chamber of Commerce", type: "State Chamber of Commerce", city: "Denver", url: "https://cochamber.com", description: "Champions for Colorado business growth, regulatory policy, and workforce initiatives." },
    { name: "Colorado Office of Economic Development and International Trade (OEDIT)", type: "Economic Development Corporation (EDC)", city: "Denver", url: "https://oedit.colorado.gov", description: "State agency driving international trade, opportunity zone grants, and venture capital." },
    { name: "Colorado Small Business Development Center Network", type: "SBDC Business Center", city: "Denver", url: "https://sbdc-colorado.org", description: "Consulting network helping startups secure loans and scale operations." }
  ],
  connecticut: [
    { name: "Connecticut Business & Industry Association (CBIA)", type: "State Chamber of Commerce", city: "Hartford", url: "https://www.cbia.com", description: "Largest business organization in Connecticut advocating for economic prosperity." },
    { name: "Advance CT (Connecticut Economic Development)", type: "Economic Development Corporation (EDC)", city: "New Haven", url: "https://www.advancect.org", description: "Nonprofit organization attracting corporate investment and retaining expanding businesses." },
    { name: "Connecticut Small Business Development Center", type: "SBDC Business Center", city: "Storrs", url: "https://ctsbdc.com", description: "Providing confidential business counseling and financial planning services." }
  ],
  delaware: [
    { name: "Delaware State Chamber of Commerce", type: "State Chamber of Commerce", city: "Wilmington", url: "https://www.dscc.com", description: "Promoting an optimal business climate and networking opportunities across Delaware." },
    { name: "Delaware Division of Small Business", type: "Economic Development Corporation (EDC)", city: "Dover", url: "https://business.delaware.gov", description: "State agency supporting corporate relocations, EDGE grants, and small business capital." }
  ],
  florida: [
    { name: "Florida Chamber of Commerce", type: "State Chamber of Commerce", city: "Tallahassee", url: "https://www.flchamber.com", description: "Securing Florida's economic future through business-friendly policy and infrastructure." },
    { name: "SelectFlorida (State Economic Development)", type: "Economic Development Corporation (EDC)", city: "Orlando", url: "https://www.selectflorida.org", description: "Official economic development authority promoting global commerce and corporate recruitment." },
    { name: "Florida Small Business Development Center Network", type: "SBDC Business Center", city: "Pensacola", url: "https://floridasbdc.org", description: "Statewide network providing business continuity, market research, and capital access." },
    { name: "Associated Industries of Florida (AIF)", type: "State Trade Association", city: "Tallahassee", url: "https://aif.com", description: "Voice of Florida business representing diverse industry sectors before the legislature." }
  ],
  georgia: [
    { name: "Georgia Chamber of Commerce", type: "State Chamber of Commerce", city: "Atlanta", url: "https://www.gachamber.com", description: "Keeping Georgia the #1 state for business through advocacy and regional economic development." },
    { name: "Georgia Department of Economic Development (GDEcD)", type: "Economic Development Corporation (EDC)", city: "Atlanta", url: "https://www.georgia.org", description: "State agency planning international trade, film production incentives, and job creation." },
    { name: "University of Georgia SBDC Network", type: "SBDC Business Center", city: "Athens", url: "https://www.georgiasbdc.org", description: "Consulting network assisting small business owners with strategic expansion." }
  ],
  hawaii: [
    { name: "Chamber of Commerce Hawaii", type: "State Chamber of Commerce", city: "Honolulu", url: "https://www.cochawaii.org", description: "Statewide business organization supporting local commerce, trade, and workforce development." },
    { name: "Hawaii Dept of Business, Economic Development & Tourism (DBEDT)", type: "Economic Development Corporation (EDC)", city: "Honolulu", url: "https://dbedt.hawaii.gov", description: "State agency encouraging economic diversification, clean energy, and international trade." }
  ],
  idaho: [
    { name: "Idaho Association of Commerce & Industry (IACI)", type: "State Chamber of Commerce", city: "Boise", url: "https://iaci.org", description: "Premier business advocate promoting legislative policy and business development." },
    { name: "Idaho Commerce", type: "Economic Development Corporation (EDC)", city: "Boise", url: "https://commerce.idaho.gov", description: "State agency offering tax incentives, rural development grants, and export support." }
  ],
  illinois: [
    { name: "Illinois Chamber of Commerce", type: "State Chamber of Commerce", city: "Chicago / Springfield", url: "https://www.ilchamber.org", description: "Unifying business voice lobbying for pro-growth fiscal policy and economic development." },
    { name: "Intersect Illinois", type: "Economic Development Corporation (EDC)", city: "Chicago", url: "https://intersectillinois.org", description: "Statewide economic development organization attracting global corporate headquarters." },
    { name: "Illinois Small Business Development Center Network", type: "SBDC Business Center", city: "Springfield", url: "https://dceo.illinois.gov", description: "State agency network assisting entrepreneurs with business plans and access to capital." }
  ],
  indiana: [
    { name: "Indiana Chamber of Commerce", type: "State Chamber of Commerce", city: "Indianapolis", url: "https://www.indianachamber.com", description: "Pro-business organization representing over 25,000 corporate members." },
    { name: "Indiana Economic Development Corporation (IEDC)", type: "Economic Development Corporation (EDC)", city: "Indianapolis", url: "https://iedc.in.gov", description: "State authority offering innovation grants, venture development, and site selection." }
  ],
  iowa: [
    { name: "Iowa Association of Business and Industry (ABI)", type: "State Chamber of Commerce", city: "Des Moines", url: "https://www.iowaabi.org", description: "Iowa's largest statewide business network promoting job growth and workforce training." },
    { name: "Iowa Economic Development Authority (IEDA)", type: "Economic Development Corporation (EDC)", city: "Des Moines", url: "https://www.iowaeda.com", description: "State agency providing tax incentives, innovation funds, and main street development." }
  ],
  kansas: [
    { name: "Kansas Chamber of Commerce", type: "State Chamber of Commerce", city: "Topeka", url: "https://www.kansaschamber.org", description: "Advocating for small business growth, tax reduction, and regulatory modernization." },
    { name: "Kansas Department of Commerce", type: "Economic Development Corporation (EDC)", city: "Topeka", url: "https://www.kansascommerce.gov", description: "State economic development agency offering job creation incentives and trade support." }
  ],
  kentucky: [
    { name: "Kentucky Chamber of Commerce", type: "State Chamber of Commerce", city: "Frankfort", url: "https://www.kychamber.com", description: "Premier business advocacy group advancing competitiveness and education reform." },
    { name: "Cabinet for Economic Development", type: "Economic Development Corporation (EDC)", city: "Frankfort", url: "https://ced.ky.gov", description: "Primary state agency encouraging corporate investment and industrial expansion." }
  ],
  louisiana: [
    { name: "Louisiana Association of Business and Industry (LABI)", type: "State Chamber of Commerce", city: "Baton Rouge", url: "https://labi.org", description: "Official state chamber leading advocacy for business tax reform and workforce development." },
    { name: "Louisiana Economic Development (LED)", type: "Economic Development Corporation (EDC)", city: "Baton Rouge", url: "https://www.opportunitylouisiana.gov", description: "State department offering tax relief programs, FASTStart workforce training, and capital." }
  ],
  maine: [
    { name: "Maine State Chamber of Commerce", type: "State Chamber of Commerce", city: "Augusta", url: "https://www.mainechamber.org", description: "Statewide advocate for business growth, energy policy, and international trade." },
    { name: "Maine Dept of Economic and Community Development", type: "Economic Development Corporation (EDC)", city: "Augusta", url: "https://www.maine.gov/decd", description: "State agency leading innovation grants, tourism promotion, and business retention." }
  ],
  maryland: [
    { name: "Maryland Chamber of Commerce", type: "State Chamber of Commerce", city: "Annapolis", url: "https://mdchamber.org", description: "Leading advocacy voice for over 6,000 corporate and small business members." },
    { name: "Maryland Department of Commerce", type: "Economic Development Corporation (EDC)", city: "Baltimore", url: "https://commerce.maryland.gov", description: "State economic agency promoting biohealth, aerospace, cybersecurity, and international trade." }
  ],
  massachusetts: [
    { name: "Associated Industries of Massachusetts (AIM)", type: "State Chamber of Commerce", city: "Boston", url: "https://aimnet.org", description: "Statewide employer association promoting economic opportunity and business growth." },
    { name: "MassEcon (Massachusetts Economic Development Partnership)", type: "Economic Development Corporation (EDC)", city: "Watertown", url: "https://massecon.com", description: "Private-public partnership providing site selection and expansion resources for tech firms." }
  ],
  michigan: [
    { name: "Michigan Chamber of Commerce", type: "State Chamber of Commerce", city: "Lansing", url: "https://www.michamber.com", description: "Unifying business advocate fighting for free enterprise and tax reform." },
    { name: "Michigan Economic Development Corporation (MEDC)", type: "Economic Development Corporation (EDC)", city: "Lansing", url: "https://www.michiganbusiness.org", description: "State agency managing Michigan business incentives, venture funds, and Pure Michigan tourism." }
  ],
  minnesota: [
    { name: "Minnesota Chamber of Commerce", type: "State Chamber of Commerce", city: "St. Paul", url: "https://www.mnchamber.com", description: "Statewide business organization helping companies start, stay, and grow in Minnesota." },
    { name: "Minnesota Dept of Employment and Economic Development (DEED)", type: "Economic Development Corporation (EDC)", city: "St. Paul", url: "https://mn.gov/deed", description: "State agency leading business financing, workforce training, and international trade." }
  ],
  mississippi: [
    { name: "Mississippi Economic Council (State Chamber)", type: "State Chamber of Commerce", city: "Jackson", url: "https://msmec.com", description: "Official state chamber promoting economic growth, education, and transportation." },
    { name: "Mississippi Development Authority (MDA)", type: "Economic Development Corporation (EDC)", city: "Jackson", url: "https://www.mississippi.org", description: "State lead agency for industrial recruitment, energy projects, and tourism." }
  ],
  missouri: [
    { name: "Missouri Chamber of Commerce and Industry", type: "State Chamber of Commerce", city: "Jefferson City", url: "https://mochamber.com", description: "Leading statewide business organization promoting legal reform and economic competitiveness." },
    { name: "Missouri Department of Economic Development", type: "Economic Development Corporation (EDC)", city: "Jefferson City", url: "https://ded.mo.gov", description: "State agency offering tax credits, workforce training, and community development grants." }
  ],
  montana: [
    { name: "Montana Chamber of Commerce", type: "State Chamber of Commerce", city: "Helena", url: "https://www.montanachamber.com", description: "Advocating for business prosperity, infrastructure improvement, and legal reform." },
    { name: "Montana Department of Commerce", type: "Economic Development Corporation (EDC)", city: "Helena", url: "https://commerce.mt.gov", description: "State agency promoting business expansion, film incentives, and tourism development." }
  ],
  nebraska: [
    { name: "Nebraska Chamber of Commerce & Industry", type: "State Chamber of Commerce", city: "Lincoln", url: "https://www.nechamber.com", description: "Voice of Nebraska business promoting tax relief and economic diversification." },
    { name: "Nebraska Department of Economic Development", type: "Economic Development Corporation (EDC)", city: "Lincoln", url: "https://opportunity.nebraska.gov", description: "State agency offering customized job training, business tax incentives, and site selection." }
  ],
  nevada: [
    { name: "Vegas Chamber / Nevada Business Alliance", type: "State Chamber of Commerce", city: "Las Vegas", url: "https://vegaschamber.com", description: "Largest business organization in Nevada advocating for regional and statewide commercial growth." },
    { name: "Nevada Governor's Office of Economic Development (GOED)", type: "Economic Development Corporation (EDC)", city: "Carson City", url: "https://goed.nv.gov", description: "State economic development agency promoting tech innovation, trade, and tax abatements." }
  ],
  "new-hampshire": [
    { name: "Business & Industry Association of NH (State Chamber)", type: "State Chamber of Commerce", city: "Concord", url: "https://www.biaofnh.com", description: "New Hampshire's statewide chamber advocate for pro-growth business policies." },
    { name: "NH Department of Business and Economic Affairs", type: "Economic Development Corporation (EDC)", city: "Concord", url: "https://www.nheconomy.com", description: "State agency assisting businesses with site selection, workforce recruiting, and international export." }
  ],
  "new-jersey": [
    { name: "New Jersey State Chamber of Commerce", type: "State Chamber of Commerce", city: "Trenton", url: "https://www.njchamber.com", description: "Statewide business advocacy leader fighting for lower taxes and job growth." },
    { name: "Choose New Jersey / NJ Economic Development Authority (NJEDA)", type: "Economic Development Corporation (EDC)", city: "Newark", url: "https://www.choosenj.com", description: "Nonprofit and state authority attracting global life sciences, tech, and offshore wind capital." }
  ],
  "new-mexico": [
    { name: "New Mexico Chamber of Commerce", type: "State Chamber of Commerce", city: "Albuquerque", url: "https://nmchamber.org", description: "Statewide advocate for competitive business climates, energy, and education." },
    { name: "New Mexico Economic Development Department", type: "Economic Development Corporation (EDC)", city: "Santa Fe", url: "https://edd.newmexico.gov", description: "State agency providing JTIP job training funds, LEDA capital grants, and film incentives." }
  ],
  "new-york": [
    { name: "Business Council of New York State", type: "State Chamber of Commerce", city: "Albany", url: "https://www.bcnys.org", description: "Premier statewide advocate representing over 3,500 commercial and industrial employers." },
    { name: "Empire State Development (ESD)", type: "Economic Development Corporation (EDC)", city: "New York City / Albany", url: "https://esd.ny.gov", description: "State lead agency for business expansion, Excelsior tax credits, and regional economic councils." },
    { name: "Partnership for New York City", type: "State Trade Association", city: "New York City", url: "https://pfnyc.org", description: "Network of top corporate CEOs maintaining NYC as a global commercial center." }
  ],
  "north-carolina": [
    { name: "North Carolina Chamber", type: "State Chamber of Commerce", city: "Raleigh", url: "https://ncchamber.com", description: "Leading business advocacy organization driving competitive tax policy and infrastructure." },
    { name: "Economic Development Partnership of North Carolina (EDPNC)", type: "Economic Development Corporation (EDC)", city: "Raleigh", url: "https://edpnc.com", description: "Public-private partnership recruiting corporate headquarters, advanced manufacturing, and tech." }
  ],
  "north-dakota": [
    { name: "Greater North Dakota Chamber", type: "State Chamber of Commerce", city: "Bismarck", url: "https://www.ndchamber.com", description: "Statewide business advocate supporting energy, agriculture, and tech expansion." },
    { name: "North Dakota Commerce Department", type: "Economic Development Corporation (EDC)", city: "Bismarck", url: "https://www.commerce.nd.gov", description: "State agency offering venture funds, agricultural grants, and drone research incentives." }
  ],
  ohio: [
    { name: "Ohio Chamber of Commerce", type: "State Chamber of Commerce", city: "Columbus", url: "https://ohiochamber.com", description: "Independent business advocate leading legislative reform and economic research." },
    { name: "JobsOhio", type: "Economic Development Corporation (EDC)", city: "Columbus", url: "https://www.jobsohio.com", description: "Private economic development corporation driving corporate investment, R&D, and job creation." }
  ],
  oklahoma: [
    { name: "State Chamber of Oklahoma", type: "State Chamber of Commerce", city: "Oklahoma City", url: "https://okstatechamber.com", description: "Unifying state voice for pro-business legislation, workforce, and regulatory policy." },
    { name: "Oklahoma Department of Commerce", type: "Economic Development Corporation (EDC)", city: "Oklahoma City", url: "https://www.okcommerce.gov", description: "State agency administering Quality Jobs tax rebates, site selection, and export assistance." }
  ],
  oregon: [
    { name: "Oregon Business & Industry (OBI)", type: "State Chamber of Commerce", city: "Salem", url: "https://oregonbusinessindustry.com", description: "Oregon's largest statewide business advocate representing over 1,600 member companies." },
    { name: "Business Oregon", type: "Economic Development Corporation (EDC)", city: "Salem", url: "https://www.oregon.gov/biz", description: "State agency providing business loans, infrastructure grants, and international trade support." }
  ],
  pennsylvania: [
    { name: "Pennsylvania Chamber of Business and Industry", type: "State Chamber of Commerce", city: "Harrisburg", url: "https://www.pachamber.org", description: "Largest broad-based business association in PA advocating for competitiveness." },
    { name: "PA Department of Community & Economic Development (DCED)", type: "Economic Development Corporation (EDC)", city: "Harrisburg", url: "https://dced.pa.gov", description: "State agency administering Keystone Opportunity Zones, R&D credits, and small business grants." }
  ],
  "rhode-island": [
    { name: "Rhode Island Public Expenditure Council / RI Chamber", type: "State Chamber of Commerce", city: "Providence", url: "https://www.ri-chamber.com", description: "Statewide coalition advocating for commercial expansion and fiscal responsibility." },
    { name: "Rhode Island Commerce Corporation", type: "Economic Development Corporation (EDC)", city: "Providence", url: "https://commerceri.com", description: "Official economic agency providing tax credits, innovation vouchers, and small business loans." }
  ],
  "south-carolina": [
    { name: "South Carolina Chamber of Commerce", type: "State Chamber of Commerce", city: "Columbia", url: "https://www.scchamber.net", description: "Leading statewide voice for business, tax competitiveness, and workforce readiness." },
    { name: "South Carolina Department of Commerce", type: "Economic Development Corporation (EDC)", city: "Columbia", url: "https://www.sccommerce.com", description: "State agency attracting automotive, aerospace, life sciences, and logistics investments." }
  ],
  "south-dakota": [
    { name: "South Dakota Chamber of Commerce & Industry", type: "State Chamber of Commerce", city: "Pierre", url: "https://www.sdchamber.biz", description: "Advocating for South Dakota's zero-corporate-tax business environment." },
    { name: "Governor's Office of Economic Development (GOED)", type: "Economic Development Corporation (EDC)", city: "Pierre", url: "https://sdgoed.org", description: "State agency managing REDI loan funds and business expansion incentives." }
  ],
  tennessee: [
    { name: "Tennessee Chamber of Commerce & Industry", type: "State Chamber of Commerce", city: "Nashville", url: "https://www.tnchamber.org", description: "Statewide business advocate driving legislative policy and economic growth." },
    { name: "Tennessee Dept of Economic and Community Development (TNECD)", type: "Economic Development Corporation (EDC)", city: "Nashville", url: "https://tnecd.com", description: "State lead agency recruiting corporate headquarters, automotive, and tech hubs." }
  ],
  texas: [
    { name: "Texas Association of Business (State Chamber)", type: "State Chamber of Commerce", city: "Austin", url: "https://www.txbiz.org", description: "Official state chamber representing over 1,500 corporate members and local chambers." },
    { name: "Texas Economic Development & Tourism (Governor's Office)", type: "Economic Development Corporation (EDC)", city: "Austin", url: "https://gov.texas.gov/business", description: "State agency managing Texas Enterprise Fund grants, Moving Image incentives, and trade." },
    { name: "Texas Association of Manufacturers", type: "State Trade Association", city: "Austin", url: "https://www.manufacturetexas.org", description: "Advocating for industrial tech, manufacturing, and energy production." }
  ],
  utah: [
    { name: "Utah State Chamber / Salt Lake Chamber", type: "State Chamber of Commerce", city: "Salt Lake City", url: "https://slchamber.com", description: "Utah's business leader championing the Silicon Slopes innovation ecosystem." },
    { name: "Utah Governor's Office of Economic Opportunity (Go Utah)", type: "Economic Development Corporation (EDC)", city: "Salt Lake City", url: "https://business.utah.gov", description: "State agency providing EDTIF tax credits, outdoor recreation grants, and startup funding." }
  ],
  vermont: [
    { name: "Vermont Chamber of Commerce", type: "State Chamber of Commerce", city: "Montpelier", url: "https://www.vtchamber.com", description: "Statewide business association supporting economic growth, trade, and tourism." },
    { name: "Vermont Department of Economic Development", type: "Economic Development Corporation (EDC)", city: "Montpelier", url: "https://accd.vermont.gov/economic-development", description: "State agency providing VEGI tax incentives, worker relocation grants, and trade support." }
  ],
  virginia: [
    { name: "Virginia Chamber of Commerce", type: "State Chamber of Commerce", city: "Richmond", url: "https://www.vachamber.com", description: "Statewide business leader creating the Blueprint Virginia economic roadmap." },
    { name: "Virginia Economic Development Partnership (VEDP)", type: "Economic Development Corporation (EDC)", city: "Richmond", url: "https://www.vedp.org", description: "State authority facilitating site selection, corporate relocation, and international trade." }
  ],
  washington: [
    { name: "Association of Washington Business (AWB - State Chamber)", type: "State Chamber of Commerce", city: "Olympia", url: "https://www.awb.org", description: "Washington's premier state chamber representing manufacturing, tech, and agriculture." },
    { name: "Washington State Department of Commerce", type: "Economic Development Corporation (EDC)", city: "Seattle / Olympia", url: "https://www.commerce.wa.gov", description: "State agency administering clean energy grants, export assistance, and trade missions." }
  ],
  "west-virginia": [
    { name: "West Virginia Chamber of Commerce", type: "State Chamber of Commerce", city: "Charleston", url: "https://www.wvchamber.com", description: "Statewide business advocate promoting energy innovation, tax relief, and job creation." },
    { name: "West Virginia Department of Economic Development", type: "Economic Development Corporation (EDC)", city: "Charleston", url: "https://westvirginia.gov", description: "State agency managing industrial development, workforce training, and site selection." }
  ],
  wisconsin: [
    { name: "Wisconsin Manufacturers & Commerce (WMC - State Chamber)", type: "State Chamber of Commerce", city: "Madison", url: "https://www.wmc.org", description: "Statewide chamber representing over 3,800 business employers in Wisconsin." },
    { name: "Wisconsin Economic Development Corporation (WEDC)", type: "Economic Development Corporation (EDC)", city: "Madison", url: "https://wedc.org", description: "State lead agency providing business tax credits, venture development, and main street grants." }
  ],
  wyoming: [
    { name: "Wyoming State Chamber of Commerce", type: "State Chamber of Commerce", city: "Cheyenne", url: "https://wyomingchamber.biz", description: "Statewide advocate for business growth, energy, and zero-state-income-tax benefits." },
    { name: "Wyoming Business Council", type: "Economic Development Corporation (EDC)", city: "Cheyenne", url: "https://wyomingbusiness.org", description: "State agency offering BSRF business grants, site selection, and venture capital." }
  ]
};

export function getStateChambers(stateSlugOrName: string): StateChamber[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_CHAMBERS[normalized] || [];
}
