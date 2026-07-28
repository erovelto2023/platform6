export interface TourismUtilityItem {
  name: string;
  category: "State Tourism Board" | "Public Utility Commission" | "Convention Center / Venue" | "State Park & Destination";
  city: string;
  url: string;
  description: string;
}

export const US_STATE_TOURISM_UTILITIES: Record<string, TourismUtilityItem[]> = {
  alabama: [
    { name: "Alabama Tourism Department", category: "State Tourism Board", city: "Montgomery", url: "https://alabama.travel", description: "Official state tourism and travel marketing department." },
    { name: "Alabama Public Service Commission", category: "Public Utility Commission", city: "Montgomery", url: "https://psc.alabama.gov", description: "State regulatory agency overseeing public utility rates and transportation safety." },
    { name: "Birmingham-Jefferson Convention Complex (BJCC)", category: "Convention Center / Venue", city: "Birmingham", url: "https://www.bjcc.org", description: "Premier sports, entertainment, and convention facility in Alabama." },
    { name: "Gulf State Park", category: "State Park & Destination", city: "Gulf Shores", url: "https://www.alapark.com/gulf-state-park", description: "Coastal resort state park featuring 2 miles of white sand beaches." }
  ],
  alaska: [
    { name: "Travel Alaska (Alaska Travel Industry Association)", category: "State Tourism Board", city: "Anchorage", url: "https://www.travelalaska.com", description: "Official visitor and travel resource for the state of Alaska." },
    { name: "Regulatory Commission of Alaska (RCA)", category: "Public Utility Commission", city: "Anchorage", url: "https://rca.alaska.gov", description: "Regulates public utilities and pipeline carriers in Alaska." },
    { name: "Dena'ina Civic and Convention Center", category: "Convention Center / Venue", city: "Anchorage", url: "https://www.anchorageconventioncenters.com", description: "Largest modern convention center facility in Alaska." },
    { name: "Denali National Park and Preserve", category: "State Park & Destination", city: "Denali", url: "https://www.nps.gov/dena", description: "Home to North America's highest peak, Denali (20,310 ft)." }
  ],
  arizona: [
    { name: "Arizona Office of Tourism", category: "State Tourism Board", city: "Phoenix", url: "https://www.visitarizona.com", description: "Official state tourism marketing and economic destination board." },
    { name: "Arizona Corporation Commission", category: "Public Utility Commission", city: "Phoenix", url: "https://azcc.gov", description: "Regulates public utilities, securities, and corporate incorporation in Arizona." },
    { name: "Phoenix Convention Center", category: "Convention Center / Venue", city: "Phoenix", url: "https://www.phoenixconventioncenter.com", description: "Top-tier convention facility hosting major national medical and tech expos." },
    { name: "Grand Canyon National Park", category: "State Park & Destination", city: "Grand Canyon", url: "https://www.nps.gov/grca", description: "World-renowned natural wonder attracting over 6 million annual visitors." }
  ],
  arkansas: [
    { name: "Arkansas Department of Parks, Heritage and Tourism", category: "State Tourism Board", city: "Little Rock", url: "https://www.arkansas.com", description: "Official travel guide promoting The Natural State." },
    { name: "Arkansas Public Service Commission", category: "Public Utility Commission", city: "Little Rock", url: "https://apsc.arkansas.gov", description: "Regulates electric, gas, telecommunication, and water utilities." },
    { name: "Statehouse Convention Center", category: "Convention Center / Venue", city: "Little Rock", url: "https://www.littlerock.com/convention-center", description: "Prime convention facility connected to the River Market District." }
  ],
  california: [
    { name: "Visit California (California Travel & Tourism Commission)", category: "State Tourism Board", city: "Sacramento", url: "https://www.visitcalifornia.com", description: "Global travel marketing organization promoting California's 12 tourism regions." },
    { name: "California Public Utilities Commission (CPUC)", category: "Public Utility Commission", city: "San Francisco / Sacramento", url: "https://www.cpuc.ca.gov", description: "Regulates essential services, telecom, energy, water, and rail safety." },
    { name: "Los Angeles Convention Center (LACC)", category: "Convention Center / Venue", city: "Los Angeles", url: "https://www.laconventioncenter.com", description: "Host of major trade shows, E3, and international corporate conventions." },
    { name: "Yosemite National Park", category: "State Park & Destination", city: "Mariposa", url: "https://www.nps.gov/yose", description: "Iconic national park famed for Half Dome, El Capitan, and giant sequoias." }
  ],
  colorado: [
    { name: "Colorado Tourism Office", category: "State Tourism Board", city: "Denver", url: "https://www.colorado.com", description: "Official travel guide promoting year-round tourism in Colorado." },
    { name: "Colorado Public Utilities Commission", category: "Public Utility Commission", city: "Denver", url: "https://puc.colorado.gov", description: "Regulates electric, natural gas, telecommunication, and motor carrier services." },
    { name: "Colorado Convention Center", category: "Convention Center / Venue", city: "Denver", url: "https://denverconvention.com", description: "Downtown Denver venue famous for the Blue Bear sculpture and national summits." }
  ],
  connecticut: [
    { name: "CTvisit (Connecticut Office of Tourism)", category: "State Tourism Board", city: "Hartford", url: "https://www.ctvisit.com", description: "Official travel resource for Connecticut history, coastlines, and resorts." },
    { name: "Connecticut Public Utilities Regulatory Authority (PURA)", category: "Public Utility Commission", city: "New Britain", url: "https://portal.ct.gov/pura", description: "State authority regulating electric, gas, water, and telecom providers." }
  ],
  delaware: [
    { name: "Visit Delaware (Delaware Tourism Office)", category: "State Tourism Board", city: "Dover", url: "https://www.visitdelaware.com", description: "Official tourism website for Delaware tax-free shopping and coastal beaches." },
    { name: "Delaware Public Service Commission", category: "Public Utility Commission", city: "Dover", url: "https://depsc.delaware.gov", description: "Regulates investor-owned public utility services in Delaware." }
  ],
  florida: [
    { name: "VISIT FLORIDA (State Tourism Corporation)", category: "State Tourism Board", city: "Tallahassee", url: "https://www.visitflorida.com", description: "Official tourism corporation driving global travel marketing to Sunshine State destinations." },
    { name: "Florida Public Service Commission (FPSC)", category: "Public Utility Commission", city: "Tallahassee", url: "https://www.psc.state.fl.us", description: "State regulatory commission overseeing Florida's investor-owned utilities." },
    { name: "Orange County Convention Center (OCCC)", category: "Convention Center / Venue", city: "Orlando", url: "https://www.occc.net", description: "Second largest convention center in North America with 7 million sq ft space." },
    { name: "Everglades National Park", category: "State Park & Destination", city: "Homestead / South FL", url: "https://www.nps.gov/ever", description: "Largest tropical wilderness reserve in the United States." }
  ],
  georgia: [
    { name: "Explore Georgia (Georgia Dept of Economic Development)", category: "State Tourism Board", city: "Atlanta", url: "https://www.exploregeorgia.org", description: "Official state tourism guide for historic cities, coastlines, and mountains." },
    { name: "Georgia Public Service Commission", category: "Public Utility Commission", city: "Atlanta", url: "https://psc.ga.gov", description: "Constitutional board regulating electric, natural gas, and telecommunications." },
    { name: "Georgia World Congress Center (GWCC)", category: "Convention Center / Venue", city: "Atlanta", url: "https://www.gwccs.com", description: "Third largest convention center in the US located in downtown Atlanta." }
  ],
  hawaii: [
    { name: "Hawaii Tourism Authority (HTA)", category: "State Tourism Board", city: "Honolulu", url: "https://www.hawaiitourismauthority.org", description: "State agency leading global destination management and cultural preservation." },
    { name: "Hawaii Public Utilities Commission", category: "Public Utility Commission", city: "Honolulu", url: "https://puc.hawaii.gov", description: "Regulates franchise public utility providers across Hawaiian islands." },
    { name: "Hawaii Convention Center", category: "Convention Center / Venue", city: "Honolulu / Waikiki", url: "https://www.hawaiiconvention.com", description: "Open-air architectural marvel venue steps from Waikiki Beach." }
  ],
  idaho: [
    { name: "Visit Idaho (Idaho Commerce)", category: "State Tourism Board", city: "Boise", url: "https://visitidaho.org", description: "Official travel guide promoting Idaho's outdoors, rivers, and ski resorts." },
    { name: "Idaho Public Utilities Commission", category: "Public Utility Commission", city: "Boise", url: "https://puc.idaho.gov", description: "Regulates electric, gas, water, and landline telephone utilities." }
  ],
  illinois: [
    { name: "Enjoy Illinois (Illinois Office of Tourism)", category: "State Tourism Board", city: "Chicago / Springfield", url: "https://www.enjoyillinois.com", description: "Official travel and tourism agency promoting Chicago and Route 66." },
    { name: "Illinois Commerce Commission (ICC)", category: "Public Utility Commission", city: "Chicago / Springfield", url: "https://www.icc.illinois.gov", description: "State regulatory commission overseeing public utilities and motor carriers." },
    { name: "McCormick Place", category: "Convention Center / Venue", city: "Chicago", url: "https://www.mccormickplace.com", description: "Largest convention center in North America offering 2.6 million sq ft exhibit space." }
  ],
  indiana: [
    { name: "Visit Indiana (Indiana Destination Development Corp)", category: "State Tourism Board", city: "Indianapolis", url: "https://visitindiana.com", description: "Official travel guide promoting Indiana sports, culture, and state parks." },
    { name: "Indiana Utility Regulatory Commission (IURC)", category: "Public Utility Commission", city: "Indianapolis", url: "https://www.in.gov/iurc", description: "Administrative agency regulating public electric, natural gas, water, and sewer utilities." },
    { name: "Indiana Convention Center", category: "Convention Center / Venue", city: "Indianapolis", url: "https://www.icclos.com", description: "Downtown convention hub connected to Lucas Oil Stadium." }
  ],
  iowa: [
    { name: "Travel Iowa (Iowa Tourism Office)", category: "State Tourism Board", city: "Des Moines", url: "https://www.traveliowa.com", description: "Official tourism guide for Iowa's scenic byways, state parks, and festivals." },
    { name: "Iowa Utilities Board (IUB)", category: "Public Utility Commission", city: "Des Moines", url: "https://iub.iowa.gov", description: "State regulatory body ensuring utility service rates are just and reasonable." }
  ],
  kansas: [
    { name: "Kansas Tourism", category: "State Tourism Board", city: "Topeka", url: "https://www.travelks.com", description: "Official state guide to Kansas prairies, landmarks, and historic trails." },
    { name: "Kansas Corporation Commission (KCC)", category: "Public Utility Commission", city: "Topeka", url: "https://kcc.ks.gov", description: "Regulates public utilities, oil and gas production, and motor carriers." }
  ],
  kentucky: [
    { name: "Kentucky Department of Tourism", category: "State Tourism Board", city: "Frankfort", url: "https://www.kentuckytourism.com", description: "Official travel guide promoting Bourbon country, horse farms, and state parks." },
    { name: "Kentucky Public Service Commission", category: "Public Utility Commission", city: "Frankfort", url: "https://psc.ky.gov", description: "Regulates intrastate rates and services of investor-owned utilities." },
    { name: "Kentucky International Convention Center (KICC)", category: "Convention Center / Venue", city: "Louisville", url: "https://kyconvention.com", description: "State-of-the-art convention facility located in downtown Louisville." }
  ],
  louisiana: [
    { name: "Explore Louisiana (Louisiana Office of Tourism)", category: "State Tourism Board", city: "Baton Rouge", url: "https://www.explorelouisiana.com", description: "Official travel portal for Louisiana music, food, and Mardi Gras culture." },
    { name: "Louisiana Public Service Commission", category: "Public Utility Commission", city: "Baton Rouge", url: "https://lpsc.louisiana.gov", description: "Constitutional agency regulating public utilities and motor carriers." },
    { name: "New Orleans Ernest N. Morial Convention Center", category: "Convention Center / Venue", city: "New Orleans", url: "https://mccno.com", description: "Sixth largest convention center in the US along the Mississippi River." }
  ],
  maine: [
    { name: "Visit Maine (Maine Office of Tourism)", category: "State Tourism Board", city: "Augusta", url: "https://visitmaine.com", description: "Official travel resource for Maine beaches, lighthouses, and Acadia National Park." },
    { name: "Maine Public Utilities Commission", category: "Public Utility Commission", city: "Augusta", url: "https://www.maine.gov/mpuc", description: "Regulates electric, gas, telecommunication, and water utilities in Maine." }
  ],
  maryland: [
    { name: "Visit Maryland (Maryland Office of Tourism)", category: "State Tourism Board", city: "Baltimore", url: "https://www.visitmaryland.org", description: "Official guide to Chesapeake Bay, historic sites, and mountain resorts." },
    { name: "Maryland Public Service Commission", category: "Public Utility Commission", city: "Baltimore", url: "https://www.psc.state.md.us", description: "Regulates public utility rates and clean energy standards across Maryland." },
    { name: "Baltimore Convention Center", category: "Convention Center / Venue", city: "Baltimore", url: "https://bccenter.org", description: "Inner Harbor convention complex hosting national trade shows." }
  ],
  massachusetts: [
    { name: "Visit Massachusetts (MOTT)", category: "State Tourism Board", city: "Boston", url: "https://www.visitma.com", description: "Official state vacation and travel planning agency." },
    { name: "Massachusetts Dept of Public Utilities (DPU)", category: "Public Utility Commission", city: "Boston", url: "https://www.mass.gov/orgs/department-of-public-utilities", description: "Regulates investor-owned electric, gas, water, and bus companies." },
    { name: "Boston Convention and Exhibition Center (BCEC)", category: "Convention Center / Venue", city: "Boston", url: "https://www.signatureboston.com", description: "New England's premier convention center in the Seaport District." }
  ],
  michigan: [
    { name: "Pure Michigan (Michigan Economic Development Corp)", category: "State Tourism Board", city: "Lansing", url: "https://www.michigan.org", description: "Official travel campaign celebrating the Great Lakes and outdoor recreation." },
    { name: "Michigan Public Service Commission (MPSC)", category: "Public Utility Commission", city: "Lansing", url: "https://www.michigan.gov/mpsc", description: "Regulates energy, telecommunications, and electric utility rates." },
    { name: "Huntington Place (formerly Cobo Center)", category: "Convention Center / Venue", city: "Detroit", url: "https://www.huntingtonplacedetroit.com", description: "Downtown Detroit venue host of North American International Auto Show." }
  ],
  minnesota: [
    { name: "Explore Minnesota Tourism", category: "State Tourism Board", city: "St. Paul", url: "https://www.exploreminnesota.com", description: "State tourism office promoting 10,000 lakes, arts, and winter sports." },
    { name: "Minnesota Public Utilities Commission", category: "Public Utility Commission", city: "St. Paul", url: "https://mn.gov/puc", description: "State agency regulating electricity, natural gas, and telecommunications." },
    { name: "Minneapolis Convention Center", category: "Convention Center / Venue", city: "Minneapolis", url: "https://www.minneapolis.org/minneapolis-convention-center", description: "Largest convention facility in the Upper Midwest." }
  ],
  mississippi: [
    { name: "Visit Mississippi", category: "State Tourism Board", city: "Jackson", url: "https://visitmississippi.org", description: "Official guide to Mississippi Delta blues, coastlines, and cuisine." },
    { name: "Mississippi Public Service Commission", category: "Public Utility Commission", city: "Jackson", url: "https://www.psc.ms.gov", description: "State commission overseeing electric, gas, telecommunication, and water utilities." }
  ],
  missouri: [
    { name: "Visit Missouri (Division of Tourism)", category: "State Tourism Board", city: "Jefferson City", url: "https://www.visitmo.com", description: "Official state vacation guide for Branson, St. Louis, and Kansas City." },
    { name: "Missouri Public Service Commission", category: "Public Utility Commission", city: "Jefferson City", url: "https://psc.mo.gov", description: "Regulates investor-owned electric, steam, gas, water, and sewer utilities." },
    { name: "Kansas City Convention Center (Bartle Hall)", category: "Convention Center / Venue", city: "Kansas City", url: "https://kcconvention.com", description: "Iconic downtown KC convention center with column-free exhibit halls." }
  ],
  montana: [
    { name: "Visit Montana (Department of Commerce)", category: "State Tourism Board", city: "Helena", url: "https://www.visitmt.com", description: "Official travel guide for Glacier National Park and Yellowstone." },
    { name: "Montana Public Service Commission", category: "Public Utility Commission", city: "Helena", url: "https://psc.mt.gov", description: "Regulates public utilities and motor transportation services." }
  ],
  nebraska: [
    { name: "Visit Nebraska", category: "State Tourism Board", city: "Lincoln", url: "https://visitnebraska.com", description: "Official travel marketing agency for Nebraska landmarks and parks." },
    { name: "Nebraska Public Service Commission", category: "Public Utility Commission", city: "Lincoln", url: "https://psc.nebraska.gov", description: "Regulates telecommunications, natural gas, grain warehouses, and transportation." }
  ],
  nevada: [
    { name: "Travel Nevada (Nevada Division of Tourism)", category: "State Tourism Board", city: "Carson City", url: "https://travelnevada.com", description: "Official travel resource for Las Vegas, Lake Tahoe, and rural Nevada." },
    { name: "Public Utilities Commission of Nevada (PUCN)", category: "Public Utility Commission", city: "Carson City / Las Vegas", url: "https://puc.nv.gov", description: "Regulates electric, natural gas, telecom, water, and rail safety." },
    { name: "Las Vegas Convention Center (LVCC)", category: "Convention Center / Venue", city: "Las Vegas", url: "https://www.lvcva.com", description: "World's premier trade show venue hosting CES, SEMA, and global summits." }
  ],
  "new-hampshire": [
    { name: "Visit New Hampshire (Division of Travel)", category: "State Tourism Board", city: "Concord", url: "https://www.visitnh.gov", description: "Official state vacation guide for White Mountains and Lakes Region." },
    { name: "New Hampshire Public Utilities Commission", category: "Public Utility Commission", city: "Concord", url: "https://www.puc.nh.gov", description: "Regulates public utility rates and safety compliance." }
  ],
  "new-jersey": [
    { name: "Visit New Jersey (Division of Travel)", category: "State Tourism Board", city: "Trenton", url: "https://www.visitnj.org", description: "Official travel website for Jersey Shore beaches, parks, and historic sites." },
    { name: "New Jersey Board of Public Utilities (NJBPU)", category: "Public Utility Commission", city: "Trenton", url: "https://www.nj.gov/bpu", description: "State regulatory authority for energy, water, telecommunication, and cable." },
    { name: "Atlantic City Convention Center", category: "Convention Center / Venue", city: "Atlantic City", url: "https://www.meetinac.com", description: "Premier East Coast convention center connected to Atlantic City rail terminal." }
  ],
  "new-mexico": [
    { name: "New Mexico True (Tourism Department)", category: "State Tourism Board", city: "Santa Fe", url: "https://www.newmexico.org", description: "Official campaign celebrating Land of Enchantment culture and cuisine." },
    { name: "New Mexico Public Regulation Commission", category: "Public Utility Commission", city: "Santa Fe", url: "https://www.nmprc.state.nm.us", description: "Regulates electric, gas, water, and transportation utilities." }
  ],
  "new-york": [
    { name: "I LOVE NY (Empire State Development)", category: "State Tourism Board", city: "New York City / Albany", url: "https://www.iloveny.com", description: "Iconic official state vacation and travel guide for New York State." },
    { name: "New York State Public Service Commission (PSC)", category: "Public Utility Commission", city: "Albany", url: "https://www3.dps.ny.gov", description: "Regulates electric, gas, steam, telecommunication, and water service providers." },
    { name: "Jacob K. Javits Convention Center", category: "Convention Center / Venue", city: "New York City", url: "https://www.javitscenter.com", description: "Manhattan's premier green convention center host of major global expos." }
  ],
  "north-carolina": [
    { name: "Visit North Carolina (EDPNC)", category: "State Tourism Board", city: "Raleigh", url: "https://www.visitnc.com", description: "Official state vacation resource for Blue Ridge Mountains and Outer Banks." },
    { name: "North Carolina Utilities Commission", category: "Public Utility Commission", city: "Raleigh", url: "https://www.ncuc.gov", description: "State agency regulating public utility rates, service standards, and energy policy." },
    { name: "Raleigh Convention Center", category: "Convention Center / Venue", city: "Raleigh", url: "https://www.raleighconvention.com", description: "Modern downtown convention facility connected to performing arts centers." }
  ],
  "north-dakota": [
    { name: "North Dakota Legendary (Commerce Dept)", category: "State Tourism Board", city: "Bismarck", url: "https://www.ndtourism.com", description: "Official travel guide for Theodore Roosevelt National Park." },
    { name: "North Dakota Public Service Commission", category: "Public Utility Commission", city: "Bismarck", url: "https://www.psc.nd.gov", description: "Regulates public utilities, grain elevators, pipelines, and weights." }
  ],
  ohio: [
    { name: "Ohio. Find It Here (Development Services)", category: "State Tourism Board", city: "Columbus", url: "https://ohio.org", description: "Official travel guide for Ohio theme parks, cities, and Amish country." },
    { name: "Public Utilities Commission of Ohio (PUCO)", category: "Public Utility Commission", city: "Columbus", url: "https://puco.ohio.gov", description: "Regulates investor-owned electric, natural gas, telecom, and water providers." },
    { name: "Greater Columbus Convention Center", category: "Convention Center / Venue", city: "Columbus", url: "https://columbusconventions.com", description: "Architectural masterpiece convention facility in downtown Columbus." }
  ],
  oklahoma: [
    { name: "TravelOK (Oklahoma Tourism Dept)", category: "State Tourism Board", city: "Oklahoma City", url: "https://www.travelok.com", description: "Official travel resource for Route 66, state parks, and Native culture." },
    { name: "Oklahoma Corporation Commission", category: "Public Utility Commission", city: "Oklahoma City", url: "https://oklahoma.gov/occ.html", description: "Regulates public utilities, oil and gas, underground storage tanks, and motor carriers." }
  ],
  oregon: [
    { name: "Travel Oregon (Oregon Tourism Commission)", category: "State Tourism Board", city: "Salem", url: "https://traveloregon.com", description: "Official tourism commission driving sustainable economic travel." },
    { name: "Public Utility Commission of Oregon", category: "Public Utility Commission", city: "Salem", url: "https://www.oregon.gov/puc", description: "Regulates investor-owned electric, natural gas, and telecommunication utilities." },
    { name: "Oregon Convention Center", category: "Convention Center / Venue", city: "Portland", url: "https://www.oregoncc.org", description: "Largest convention center in the Pacific Northwest famous for twin glass spires." }
  ],
  pennsylvania: [
    { name: "Visit PA (PA Dept of Community & Econ Dev)", category: "State Tourism Board", city: "Harrisburg", url: "https://www.visitpa.com", description: "Official travel state guide for historic Philadelphia, Amish country, and mountains." },
    { name: "Pennsylvania Public Utility Commission (PAPUC)", category: "Public Utility Commission", city: "Harrisburg", url: "https://www.puc.pa.gov", description: "Regulates electric, natural gas, water, telecom, and transportation rates." },
    { name: "Pennsylvania Convention Center", category: "Convention Center / Venue", city: "Philadelphia", url: "https://www.paconvention.com", description: "Historic downtown Philadelphia convention complex." }
  ],
  "rhode-island": [
    { name: "Visit Rhode Island (Commerce Corp)", category: "State Tourism Board", city: "Providence", url: "https://www.visitrhodeisland.com", description: "Official travel guide to Newport mansions, coastal beaches, and Providence arts." },
    { name: "Rhode Island Public Utilities Commission", category: "Public Utility Commission", city: "Warwick", url: "https://ripuc.ri.gov", description: "Regulates investor-owned electric, gas, water, and telephone utilities." }
  ],
  "south-carolina": [
    { name: "Discover South Carolina (PRT)", category: "State Tourism Board", city: "Columbia", url: "https://discoversouthcarolina.com", description: "Official state vacation guide for Charleston, Myrtle Beach, and mountain parks." },
    { name: "Public Service Commission of South Carolina", category: "Public Utility Commission", city: "Columbia", url: "https://psc.sc.gov", description: "Regulates utility rates and services for electric, gas, telecommunication, and water." },
    { name: "Charleston Area Convention Center", category: "Convention Center / Venue", city: "North Charleston", url: "https://www.northcharlestoncoliseum-pac.com", description: "Premier coastal convention and performing arts complex." }
  ],
  "south-dakota": [
    { name: "Travel South Dakota (Department of Tourism)", category: "State Tourism Board", city: "Pierre", url: "https://www.travelsouthdakota.com", description: "Official travel guide to Mount Rushmore, Badlands, and Black Hills." },
    { name: "South Dakota Public Utilities Commission", category: "Public Utility Commission", city: "Pierre", url: "https://puc.sd.gov", description: "Regulates electric, natural gas, and telecommunications utility providers." }
  ],
  tennessee: [
    { name: "Visit Tennessee (Department of Tourist Dev)", category: "State Tourism Board", city: "Nashville", url: "https://www.tnvacation.com", description: "Official travel guide celebrating Music City, Memphis, and Smoky Mountains." },
    { name: "Tennessee Public Utility Commission", category: "Public Utility Commission", city: "Nashville", url: "https://www.tn.gov/tpuc", description: "State regulatory commission overseeing public utility service standards." },
    { name: "Music City Center", category: "Convention Center / Venue", city: "Nashville", url: "https://www.nashvillemcc.com", description: "Massive 2.1 million sq ft downtown Nashville convention hub." }
  ],
  texas: [
    { name: "Travel Texas (Governor's Economic Dev)", category: "State Tourism Board", city: "Austin", url: "https://www.traveltexas.com", description: "Official travel guide promoting Texas heritage, cities, and Gulf coastlines." },
    { name: "Public Utility Commission of Texas (PUCT)", category: "Public Utility Commission", city: "Austin", url: "https://www.puc.texas.gov", description: "Regulates state electric, water, and telecommunication utilities including ERCOT oversight." },
    { name: "Kay Bailey Hutchison Convention Center", category: "Convention Center / Venue", city: "Dallas", url: "https://www.dallasconventioncenter.com", description: "One of the largest convention centers in the US located in downtown Dallas." },
    { name: "George R. Brown Convention Center", category: "Convention Center / Venue", city: "Houston", url: "https://www.grbhouston.com", description: "Downtown Houston venue host of major global energy and tech conventions." }
  ],
  utah: [
    { name: "Visit Utah (Office of Tourism)", category: "State Tourism Board", city: "Salt Lake City", url: "https://www.visitutah.com", description: "Official guide to Utah's Mighty 5 national parks and ski resorts." },
    { name: "Public Service Commission of Utah", category: "Public Utility Commission", city: "Salt Lake City", url: "https://psc.utah.gov", description: "Regulates electric, gas, telecommunication, and water public utilities." },
    { name: "Calvin L. Rampton Salt Palace Convention Center", category: "Convention Center / Venue", city: "Salt Lake City", url: "https://www.visitsaltlake.com/salt-palace-convention-center", description: "Downtown SLC convention center host of major outdoor and tech conventions." }
  ],
  vermont: [
    { name: "Vermont Vacation (Dept of Tourism)", category: "State Tourism Board", city: "Montpelier", url: "https://www.vermontvacation.com", description: "Official state guide to Vermont foliage, ski resorts, and local food." },
    { name: "Vermont Public Utility Commission", category: "Public Utility Commission", city: "Montpelier", url: "https://puc.vermont.gov", description: "Quasi-judicial board supervising public utility rates and clean energy siting." }
  ],
  virginia: [
    { name: "Virginia is for Lovers (Virginia Tourism Corp)", category: "State Tourism Board", city: "Richmond", url: "https://www.virginia.org", description: "Iconic official travel guide for Virginia beaches, history, and mountains." },
    { name: "Virginia State Corporation Commission (SCC)", category: "Public Utility Commission", city: "Richmond", url: "https://scc.virginia.gov", description: "Regulates public utilities, insurance, state-chartered financial institutions, and corporations." },
    { name: "Virginia Beach Convention Center", category: "Convention Center / Venue", city: "Virginia Beach", url: "https://www.visitvirginiabeach.com/convention-center", description: "First LEED Gold certified convention center in the US." }
  ],
  washington: [
    { name: "State of Washington Tourism", category: "State Tourism Board", city: "Seattle", url: "https://stateofwashingtontourism.com", description: "Official travel marketing destination for Washington mountains, sound, and wineries." },
    { name: "Washington Utilities and Transportation Commission (UTC)", category: "Public Utility Commission", city: "Olympia", url: "https://www.utc.wa.gov", description: "Regulates investor-owned electric, gas, water, landline phone, and transportation." },
    { name: "Seattle Convention Center (Arch & Summit)", category: "Convention Center / Venue", city: "Seattle", url: "https://seattleconventioncenter.com", description: "Downtown Seattle convention center host of major gaming, tech, and medical summits." }
  ],
  "west-virginia": [
    { name: "Almost Heaven West Virginia (Dept of Tourism)", category: "State Tourism Board", city: "Charleston", url: "https://wvtourism.com", description: "Official travel guide promoting wild and wonderful mountain recreation." },
    { name: "Public Service Commission of West Virginia", category: "Public Utility Commission", city: "Charleston", url: "https://www.psc.state.wv.us", description: "Regulates utility rates and transportation carriers across West Virginia." }
  ],
  wisconsin: [
    { name: "Travel Wisconsin (Department of Tourism)", category: "State Tourism Board", city: "Madison", url: "https://www.travelwisconsin.com", description: "Official state vacation resource for Dells, Northwoods, and lakes." },
    { name: "Public Service Commission of Wisconsin (PSCW)", category: "Public Utility Commission", city: "Madison", url: "https://psc.wi.gov", description: "Regulates public electric, natural gas, water, and telecommunication services." },
    { name: "Baird Center (formerly Wisconsin Center)", category: "Convention Center / Venue", city: "Milwaukee", url: "https://bairdcenter.com", description: "State-of-the-art downtown Milwaukee convention and trade center." }
  ],
  wyoming: [
    { name: "Travel Wyoming (Office of Tourism)", category: "State Tourism Board", city: "Cheyenne", url: "https://www.travelwyoming.com", description: "Official travel guide for Yellowstone, Grand Teton, and historic western trails." },
    { name: "Wyoming Public Service Commission", category: "Public Utility Commission", city: "Cheyenne", url: "https://psc.wyo.gov", description: "Regulates public electric, natural gas, telecommunications, and water utilities." }
  ]
};

export function getStateTourismUtilities(stateSlugOrName: string): TourismUtilityItem[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_TOURISM_UTILITIES[normalized] || [];
}
