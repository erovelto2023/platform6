export interface B2BVentureItem {
  name: string;
  type: "Top Employer / Enterprise" | "Venture Capital / Angel Network" | "Incubator & Accelerator" | "Co-working & Tech Hub";
  city: string;
  url: string;
  description: string;
}

export const US_STATE_B2B_VENTURE: Record<string, B2BVentureItem[]> = {
  alabama: [
    { name: "University of Alabama at Birmingham (UAB Health System)", type: "Top Employer / Enterprise", city: "Birmingham", url: "https://www.uab.edu", description: "Largest single employer in Alabama with over 23,000 healthcare and academic staff." },
    { name: "Redstone Arsenal / NASA Marshall Space Flight Center", type: "Top Employer / Enterprise", city: "Huntsville", url: "https://www.nasa.gov/marshall", description: "Federal aerospace and defense complex employing over 38,000 military and civilian personnel." },
    { name: "Alabama Angel Network", type: "Venture Capital / Angel Network", city: "Birmingham", url: "https://www.alabamaangels.org", description: "Statewide accredited investor network funding high-growth Southeastern startups." },
    { name: "Innovation Depot", type: "Incubator & Accelerator", city: "Birmingham", url: "https://innovationdepot.org", description: "Largest tech incubator in the Southeast spanning 140,000 sq ft for technology enterprise development." }
  ],
  alaska: [
    { name: "Providence Health & Services Alaska", type: "Top Employer / Enterprise", city: "Anchorage", url: "https://www.providence.org/locations/ak", description: "Largest private employer in Alaska operating healthcare facilities statewide." },
    { name: "Alaska Development Fund / Arctic Angel Network", type: "Venture Capital / Angel Network", city: "Anchorage", url: "https://www.arcticangels.org", description: "Investor network financing Alaska-focused energy, logistics, and tech ventures." },
    { name: "The Boardroom Anchorage", type: "Co-working & Tech Hub", city: "Anchorage", url: "https://theboardroomak.com", description: "Premier co-working community and startup hub in downtown Anchorage." }
  ],
  arizona: [
    { name: "Banner Health System", type: "Top Employer / Enterprise", city: "Phoenix", url: "https://www.bannerhealth.com", description: "Largest non-government employer in Arizona with over 50,000 healthcare personnel." },
    { name: "Raytheon Technologies Missiles & Defense", type: "Top Employer / Enterprise", city: "Tucson", url: "https://www.rtx.com", description: "Major aerospace employer with 13,000 engineers and defense researchers." },
    { name: "Arizona Venture Network / Desert Angels", type: "Venture Capital / Angel Network", city: "Tucson / Phoenix", url: "https://www.desertangels.org", description: "One of the most active angel investment groups in the nation for early-stage tech." },
    { name: "Center for Entrepreneurial Innovation (CEI)", type: "Incubator & Accelerator", city: "Phoenix", url: "https://www.ceiaz.com", description: "Award-winning bioscience and hardware tech incubator at Gateway Community College." }
  ],
  arkansas: [
    { name: "Walmart Inc. World Headquarters", type: "Top Employer / Enterprise", city: "Bentonville", url: "https://corporate.walmart.com", description: "Global retail giant employing over 50,000 corporate and logistics personnel in Northwest Arkansas." },
    { name: "Tyson Foods Headquarters", type: "Top Employer / Enterprise", city: "Springdale", url: "https://www.tysonfoods.com", description: "Fortune 500 protein processor employing over 24,000 Arkansans." },
    { name: "Plug and Play Northwest Arkansas", type: "Incubator & Accelerator", city: "Bentonville", url: "https://www.plugandplaytechcenter.com/nwa", description: "Global supply chain and retail tech accelerator partnering with Fortune 500 enterprise leaders." }
  ],
  california: [
    { name: "Apple Inc. (Apple Park)", type: "Top Employer / Enterprise", city: "Cupertino", url: "https://www.apple.com", description: "World's largest technology enterprise employing over 25,000 staff at Cupertino headquarters." },
    { name: "Google / Alphabet Inc. (Googleplex)", type: "Top Employer / Enterprise", city: "Mountain View", url: "https://abc.xyz", description: "Global search and cloud giant employing over 45,000 Silicon Valley personnel." },
    { name: "Sequoia Capital", type: "Venture Capital / Angel Network", city: "Menlo Park", url: "https://www.sequoiacap.com", description: "World-renowned Sand Hill Road VC firm backing Apple, Google, Airbnb, and Stripe." },
    { name: "Y Combinator (YC)", type: "Incubator & Accelerator", city: "San Francisco", url: "https://www.ycombinator.com", description: "Premier startup accelerator having launched Airbnb, DoorDash, Stripe, and Dropbox." }
  ],
  colorado: [
    { name: "Lockheed Martin Space", type: "Top Employer / Enterprise", city: "Littleton / Denver", url: "https://www.lockheedmartin.com", description: "Major aerospace employer with over 10,000 space exploration engineers." },
    { name: "Techstars Boulder & Denver", type: "Incubator & Accelerator", city: "Boulder / Denver", url: "https://www.techstars.com", description: "Global startup accelerator accelerator network headquartered in Colorado." },
    { name: "Colorado Venture Capital Authority", type: "Venture Capital / Angel Network", city: "Denver", url: "https://oedit.colorado.gov/vca", description: "State seed fund financing Colorado tech, outdoor, and bioscience startups." }
  ],
  connecticut: [
    { name: "Hartford HealthCare", type: "Top Employer / Enterprise", city: "Hartford", url: "https://hartfordhealthcare.org", description: "Largest integrated healthcare network in Connecticut with 33,000 employees." },
    { name: "Connecticut Innovations (CI)", type: "Venture Capital / Angel Network", city: "New Haven", url: "https://ctinnovations.com", description: "Connecticut's strategic venture capital arm investing in tech and life sciences." }
  ],
  delaware: [
    { name: "JPMorgan Chase & Co. Delaware Campus", type: "Top Employer / Enterprise", city: "Wilmington", url: "https://www.jpmorganchase.com", description: "Largest financial services employer in Delaware with over 11,000 tech and banking staff." },
    { name: "Delaware Innovation Space", type: "Incubator & Accelerator", city: "Wilmington", url: "https://delinnovationlab.org", description: "Premier science and industrial chemistry incubator created with DuPont and State of Delaware." }
  ],
  florida: [
    { name: "Walt Disney World Resort", type: "Top Employer / Enterprise", city: "Orlando", url: "https://disneyworld.disney.go.com", description: "Largest single-site employer in the US with 77,000 cast members." },
    { name: "Florida Funders", type: "Venture Capital / Angel Network", city: "Tampa", url: "https://www.floridafunders.com", description: "Top hybrid venture capital firm and angel network investing in Florida tech startups." },
    { name: "eMerge Americas", type: "Incubator & Accelerator", city: "Miami", url: "https://emergeamericas.com", description: "Premier tech event and startup accelerator transforming South Florida into a global tech hub." },
    { name: "Embarc Collective", type: "Co-working & Tech Hub", city: "Tampa", url: "https://www.embarccollective.com", description: "32,000 sq ft startup hub backing over 120 tech companies in Central Florida." }
  ],
  georgia: [
    { name: "Delta Air Lines World Headquarters", type: "Top Employer / Enterprise", city: "Atlanta", url: "https://www.delta.com", description: "Global airline leader employing over 34,000 personnel at Hartsfield-Jackson Atlanta." },
    { name: "The Home Depot Corporate Headquarters", type: "Top Employer / Enterprise", city: "Atlanta", url: "https://corporate.homedepot.com", description: "Fortune 50 retail giant employing over 18,000 corporate staff." },
    { name: "Advanced Technology Development Center (ATDC)", type: "Incubator & Accelerator", city: "Atlanta", url: "https://atdc.org", description: "Georgia Tech incubator named by Forbes as one of 10 tech incubators changing the world." },
    { name: "Atlanta Tech Village", type: "Co-working & Tech Hub", city: "Atlanta", url: "https://atlantatechvillage.com", description: "4th largest tech hub in the US having raised over $2 billion in venture capital." }
  ],
  hawaii: [
    { name: "Hawaiian Electric Industries", type: "Top Employer / Enterprise", city: "Honolulu", url: "https://www.hei.com", description: "Major utility and banking enterprise serving 95% of Hawaii state residents." },
    { name: "Blue Startups", type: "Incubator & Accelerator", city: "Honolulu", url: "https://bluestartups.com", description: "Top 20 US tech accelerator connecting East Asia and North American startups." }
  ],
  idaho: [
    { name: "Micron Technology Headquarters", type: "Top Employer / Enterprise", city: "Boise", url: "https://www.micron.com", description: "Global semiconductor manufacturer employing over 6,000 chip design engineers in Boise." },
    { name: "Idaho National Laboratory (INL)", type: "Top Employer / Enterprise", city: "Idaho Falls", url: "https://inl.gov", description: "Department of Energy clean energy research lab employing over 5,700 scientists." }
  ],
  illinois: [
    { name: "Abbott Laboratories / AbbVie", type: "Top Employer / Enterprise", city: "Abbott Park / North Chicago", url: "https://www.abbott.com", description: "Fortune 100 global pharmaceutical and medical device enterprise employing over 20,000." },
    { name: "1871 Chicago Tech Hub", type: "Co-working & Tech Hub", city: "Chicago", url: "https://1871.com", description: "Ranked #1 university-affiliated tech incubator in the world located at the Merchandise Mart." },
    { name: "Hyde Park Venture Partners", type: "Venture Capital / Angel Network", city: "Chicago", url: "https://www.hydeparkvp.com", description: "Early-stage Midwest VC firm investing in B2B software and tech infrastructure." }
  ],
  indiana: [
    { name: "Eli Lilly and Company Headquarters", type: "Top Employer / Enterprise", city: "Indianapolis", url: "https://www.lilly.com", description: "Global pharmaceutical leader employing over 11,000 research and corporate staff." },
    { name: "Elevate Ventures", type: "Venture Capital / Angel Network", city: "Indianapolis", url: "https://www.elevateventures.com", description: "Venture development organization driving early-stage capital across Indiana." }
  ],
  iowa: [
    { name: "John Deere World Headquarters", type: "Top Employer / Enterprise", city: "Moline / Davenport Area", url: "https://www.deere.com", description: "Global agricultural equipment leader employing thousands of engineers in Iowa." },
    { name: "Iowa Startup Accelerator", type: "Incubator & Accelerator", city: "Cedar Rapids", url: "https://www.newbo.co/isa", description: "Tech and ag-tech startup accelerator network backed by NewBoCo." }
  ],
  kansas: [
    { name: "Garmin International Headquarters", type: "Top Employer / Enterprise", city: "Olathe", url: "https://www.garmin.com", description: "Global GPS and aviation technology developer employing over 5,000 in Olathe." },
    { name: "Enterprise University / KEC", type: "Incubator & Accelerator", city: "Wichita / Overland Park", url: "https://www.kansasenterprise.org", description: "Statewide business mentoring and venture development network." }
  ],
  kentucky: [
    { name: "UPS Worldport Global Air Hub", type: "Top Employer / Enterprise", city: "Louisville", url: "https://www.ups.com", description: "Largest automated package handling facility in the world employing over 12,000 personnel." },
    { name: "Kentucky Enterprise Fund (KSTC)", type: "Venture Capital / Angel Network", city: "Lexington", url: "https://www.kstc.com", description: "State seed fund financing Kentucky tech, healthcare, and manufacturing startups." }
  ],
  louisiana: [
    { name: "Ochsner Health System Headquarters", type: "Top Employer / Enterprise", city: "New Orleans", url: "https://www.ochsner.org", description: "Louisiana's largest non-profit healthcare system employing over 38,000 personnel." },
    { name: "LSU Innovation Park", type: "Incubator & Accelerator", city: "Baton Rouge", url: "https://www.lsu.edu/innovationpark", description: "200-acre research park providing laboratory and business incubators." }
  ],
  maine: [
    { name: "Jackson Laboratory", type: "Top Employer / Enterprise", city: "Bar Harbor", url: "https://www.jax.org", description: "World-renowned biomedical genetics research institution employing 1,500 scientists." },
    { name: "Maine Venture Fund", type: "Venture Capital / Angel Network", city: "Brunswick", url: "https://maineventurefund.com", description: "State-sponsored venture fund providing equity financing to Maine companies." }
  ],
  maryland: [
    { name: "Johns Hopkins Medicine & University", type: "Top Employer / Enterprise", city: "Baltimore", url: "https://www.hopkinsmedicine.org", description: "Maryland's largest private employer with over 40,000 healthcare and research staff." },
    { name: "TEDCO (Maryland Technology Development Corp)", type: "Venture Capital / Angel Network", city: "Columbia", url: "https://www.tedcomd.com", description: "State authority fostering technology commercialization and early-stage VC investments." }
  ],
  massachusetts: [
    { name: "Mass General Brigham Healthcare", type: "Top Employer / Enterprise", city: "Boston", url: "https://www.massgeneralbrigham.org", description: "Massachusetts' largest private employer with over 80,000 doctors, nurses, and researchers." },
    { name: "MassChallenge Headquarters", type: "Incubator & Accelerator", city: "Boston", url: "https://masschallenge.org", description: "Global zero-equity startup accelerator having accelerated over 3,000 startups." },
    { name: "Cambridge Innovation Center (CIC)", type: "Co-working & Tech Hub", city: "Cambridge / Boston", url: "https://cic.com", description: "Famous Kendall Square tech center home to thousands of startups and venture firms." }
  ],
  michigan: [
    { name: "General Motors World Headquarters (RenCen)", type: "Top Employer / Enterprise", city: "Detroit", url: "https://www.gm.com", description: "Global automotive icon employing thousands of engineers and software developers." },
    { name: "Ford Motor Company World Headquarters", type: "Top Employer / Enterprise", city: "Dearborn", url: "https://corporate.ford.com", description: "Fortune 20 auto manufacturer developing EV mobility and autonomous systems." },
    { name: "Michigan Founders Fund / Ann Arbor SPARK", type: "Incubator & Accelerator", city: "Ann Arbor / Detroit", url: "https://annarborusa.org", description: "Premier tech accelerator driving mobility, AI, and life sciences innovation." }
  ],
  minnesota: [
    { name: "Mayo Clinic World Headquarters", type: "Top Employer / Enterprise", city: "Rochester", url: "https://www.mayoclinic.org", description: "World-ranked #1 hospital system employing over 43,000 medical and research staff in Minnesota." },
    { name: "Target Corporation Headquarters", type: "Top Employer / Enterprise", city: "Minneapolis", url: "https://corporate.target.com", description: "Fortune 40 retail giant employing over 13,000 corporate personnel in Minneapolis." },
    { name: "Medical Alley Association", type: "Incubator & Accelerator", city: "Golden Valley / Minneapolis", url: "https://medicalalley.org", description: "Global epicenter of health tech and medical device innovation." }
  ],
  mississippi: [
    { name: "Ingalls Shipbuilding (Huntington Ingalls)", type: "Top Employer / Enterprise", city: "Pascagoula", url: "https://ingalls.huntingtoningalls.com", description: "Largest manufacturing employer in Mississippi with 11,500 shipbuilders." },
    { name: "Innovate Mississippi", type: "Venture Capital / Angel Network", city: "Jackson", url: "https://www.innovate.ms", description: "Nonprofit driving innovation, private capital access, and startup scaling." }
  ],
  missouri: [
    { name: "BJC HealthCare", type: "Top Employer / Enterprise", city: "St. Louis", url: "https://www.bjc.org", description: "Non-profit healthcare system employing over 31,000 personnel in St. Louis." },
    { name: "Cortex Innovation Community", type: "Co-working & Tech Hub", city: "St. Louis", url: "https://cortexstl.com", description: "200-acre urban bioscience and technology district in Midtown St. Louis." }
  ],
  montana: [
    { name: "Billings Clinic Healthcare", type: "Top Employer / Enterprise", city: "Billings", url: "https://www.billingsclinic.com", description: "Montana's largest independent healthcare organization with 4,500 employees." },
    { name: "Next Frontier Capital", type: "Venture Capital / Angel Network", city: "Bozeman", url: "https://www.nextfrontiercapital.com", description: "VC firm investing in Rocky Mountain tech, software, and optics startups." }
  ],
  nebraska: [
    { name: "Berkshire Hathaway Inc.", type: "Top Employer / Enterprise", city: "Omaha", url: "https://www.berkshirehathaway.com", description: "Iconic holding company conglomerate headquartered in Omaha." },
    { name: "Nebraska Angels", type: "Venture Capital / Angel Network", city: "Omaha", url: "https://www.nebraskaangels.org", description: "Network of 80+ accredited investors financing Midwest high-growth companies." }
  ],
  nevada: [
    { name: "MGM Resorts International Corporate", type: "Top Employer / Enterprise", city: "Las Vegas", url: "https://www.mgmresorts.com", description: "Largest private employer in Nevada with over 50,000 resort and corporate staff." },
    { name: "Tesla Gigafactory Nevada", type: "Top Employer / Enterprise", city: "Sparks / Reno", url: "https://www.tesla.com/gigafactory", description: "Massive battery and electric motor production facility employing over 7,000 engineers." },
    { name: "Fundit Nevada / Vegas Tech Hub", type: "Venture Capital / Angel Network", city: "Las Vegas", url: "https://www.startupthedesert.com", description: "Nevada startup ecosystem supporting autonomous tech and gaming software." }
  ],
  "new-hampshire": [
    { name: "BAE Systems Electronic Systems", type: "Top Employer / Enterprise", city: "Nashua", url: "https://www.baesystems.com", description: "Defense electronics manufacturer employing over 6,000 engineers in Southern NH." },
    { name: "NH Innovation Commercialization Center", type: "Incubator & Accelerator", city: "Portsmouth", url: "https://www.nhicc.org", description: "Tech incubator partnering with UNH to commercialize research." }
  ],
  "new-jersey": [
    { name: "Johnson & Johnson World Headquarters", type: "Top Employer / Enterprise", city: "New Brunswick", url: "https://www.jnj.com", description: "Global healthcare giant employing thousands of pharma and medical tech researchers." },
    { name: "Prudential Financial Headquarters", type: "Top Employer / Enterprise", city: "Newark", url: "https://www.prudential.com", description: "Fortune 50 financial services enterprise employing over 5,000 corporate staff." },
    { name: "NJIT Enterprise Development Center (EDC)", type: "Incubator & Accelerator", city: "Newark", url: "https://www.njit.edu/edc", description: "Largest high-tech incubator in New Jersey housing 90+ startups." }
  ],
  "new-mexico": [
    { name: "Sandia National Laboratories", type: "Top Employer / Enterprise", city: "Albuquerque", url: "https://www.sandia.gov", description: "Major national security lab employing over 14,000 scientists and engineers." },
    { name: "Los Alamos National Laboratory (LANL)", type: "Top Employer / Enterprise", city: "Los Alamos", url: "https://www.lanl.gov", description: "Premier nuclear science research lab employing over 13,000 personnel." },
    { name: "ABQid Accelerator / CNM Ingenuity", type: "Incubator & Accelerator", city: "Albuquerque", url: "https://cnmingenuity.org/program/abqid", description: "Startup accelerator backing Southwest tech entrepreneurs." }
  ],
  "new-york": [
    { name: "JPMorgan Chase Corporate Headquarters", type: "Top Employer / Enterprise", city: "New York City", url: "https://www.jpmorganchase.com", description: "Largest financial institution in the US employing over 25,000 NYC professionals." },
    { name: "Pfizer World Headquarters", type: "Top Employer / Enterprise", city: "New York City", url: "https://www.pfizer.com", description: "Global biopharmaceutical pioneer headquartered in Manhattan." },
    { name: "Insight Partners / General Atlantic", type: "Venture Capital / Angel Network", city: "New York City", url: "https://www.insightpartners.com", description: "Leading NYC growth equity and VC firms backing global tech scale-ups." },
    { name: "Techstars NYC", type: "Incubator & Accelerator", city: "New York City", url: "https://www.techstars.com/cities/new-york-city", description: "Premier NYC startup accelerator for fintech, AI, and consumer web." }
  ],
  "north-carolina": [
    { name: "Bank of America World Headquarters", type: "Top Employer / Enterprise", city: "Charlotte", url: "https://www.bankofamerica.com", description: "Second largest banking institution in the US employing 15,000 in Charlotte." },
    { name: "Research Triangle Park (RTP)", type: "Co-working & Tech Hub", city: "Raleigh-Durham", url: "https://www.rtp.org", description: "Largest research park in North America spanning 7,000 acres and 300+ tech firms." },
    { name: "Council for Entrepreneurial Development (CED)", type: "Incubator & Accelerator", city: "Durham", url: "https://cednc.org", description: "Southeastern startup organization connecting tech founders with venture capital." }
  ],
  "north-dakota": [
    { name: "Sanford Health Systems Headquarters", type: "Top Employer / Enterprise", city: "Fargo", url: "https://www.sanfordhealth.org", description: "Largest rural healthcare system in the nation with 10,000 Fargo employees." },
    { name: "Emerging Prairie", type: "Incubator & Accelerator", city: "Fargo", url: "https://www.emergingprairie.com", description: "Tech ecosystem organization driving autonomous ag-tech innovation." }
  ],
  ohio: [
    { name: "Cleveland Clinic World Headquarters", type: "Top Employer / Enterprise", city: "Cleveland", url: "https://my.clevelandclinic.org", description: "Top-ranked global healthcare provider employing over 50,000 personnel in Ohio." },
    { name: "Procter & Gamble (P&G) World Headquarters", type: "Top Employer / Enterprise", city: "Cincinnati", url: "https://us.pg.com", description: "Fortune 50 CPG leader employing over 10,000 corporate research staff." },
    { name: "Rev1 Ventures", type: "Venture Capital / Angel Network", city: "Columbus", url: "https://www.rev1ventures.com", description: "Top investor startup studio backing Midwest healthcare and software startups." }
  ],
  oklahoma: [
    { name: "Tinker Air Force Base", type: "Top Employer / Enterprise", city: "Oklahoma City", url: "https://www.tinker.af.mil", description: "Largest single-site employer in Oklahoma with over 26,000 military and civilian staff." },
    { name: "i2E (Innovation to Enterprise)", type: "Venture Capital / Angel Network", city: "Oklahoma City / Tulsa", url: "https://www.i2e.org", description: "State-backed venture startup advisory firm investing in Oklahoma tech." }
  ],
  oregon: [
    { name: "Intel Corporation Oregon Campus (Silicon Forest)", type: "Top Employer / Enterprise", city: "Hillsboro / Portland", url: "https://www.intel.com", description: "Intel's largest global semiconductor manufacturing facility employing over 22,000." },
    { name: "Nike World Headquarters", type: "Top Employer / Enterprise", city: "Beaverton", url: "https://about.nike.com", description: "Global footwear and apparel icon employing 12,000 staff at Beaverton campus." },
    { name: "Oregon Venture Fund", type: "Venture Capital / Angel Network", city: "Portland", url: "https://oregonventurefund.com", description: "Community-backed VC fund investing in Pacific Northwest tech startups." }
  ],
  pennsylvania: [
    { name: "UPMC (University of Pittsburgh Medical Center)", type: "Top Employer / Enterprise", city: "Pittsburgh", url: "https://www.upmc.com", description: "Pennsylvania's largest non-governmental employer with over 92,000 medical staff." },
    { name: "Comcast Corporation Headquarters (Comcast Center)", type: "Top Employer / Enterprise", city: "Philadelphia", url: "https://corporate.comcast.com", description: "Global media and technology giant headquartered in downtown Philadelphia." },
    { name: "Ben Franklin Technology Partners", type: "Incubator & Accelerator", city: "Philadelphia / Pittsburgh / State College", url: "https://www.benfranklin.org", description: "Statewide technology investment program funding PA tech startups for over 35 years." }
  ],
  "rhode-island": [
    { name: "CVS Health World Headquarters", type: "Top Employer / Enterprise", city: "Woonsocket", url: "https://www.cvshealth.com", description: "Fortune 10 healthcare giant employing thousands of corporate personnel in Rhode Island." },
    { name: "Social Enterprise Greenhouse (SEG)", type: "Incubator & Accelerator", city: "Providence", url: "https://segreenhouse.org", description: "Leading social impact and clean tech incubator network." }
  ],
  "south-carolina": [
    { name: "BMW Manufacturing Co. Plant Spartanburg", type: "Top Employer / Enterprise", city: "Greer / Spartanburg", url: "https://www.bmwusfactory.com", description: "Largest BMW assembly plant in the world employing over 11,000 automotive workers." },
    { name: "Boeing South Carolina", type: "Top Employer / Enterprise", city: "North Charleston", url: "https://www.boeing.com/company/about-bca/south-carolina", description: "787 Dreamliner final assembly center employing over 7,000 aerospace engineers." },
    { name: "SCRA (South Carolina Research Authority)", type: "Venture Capital / Angel Network", city: "Columbia / Charleston", url: "https://www.scra.org", description: "State chartered technology development organization funding SC tech startups." }
  ],
  "south-dakota": [
    { name: "Sanford Health Systems", type: "Top Employer / Enterprise", city: "Sioux Falls", url: "https://www.sanfordhealth.org", description: "Major medical and research employer with over 10,000 employees in Sioux Falls." },
    { name: "Zeal Center for Entrepreneurship", type: "Incubator & Accelerator", city: "Sioux Falls", url: "https://www.zealcenter.com", description: "Premier business incubator and tech accelerator in South Dakota." }
  ],
  tennessee: [
    { name: "HCA Healthcare Headquarters", type: "Top Employer / Enterprise", city: "Nashville", url: "https://hcahealthcare.com", description: "Fortune 75 healthcare hospital system employing over 10,000 corporate staff." },
    { name: "FedEx Express World Hub", type: "Top Employer / Enterprise", city: "Memphis", url: "https://www.fedex.com", description: "Global logistics hub employing over 30,000 package handlers and flight crew." },
    { name: "Nashville Entrepreneur Center (EC)", type: "Incubator & Accelerator", city: "Nashville", url: "https://www.ec.co", description: "Premier healthcare, music, and tech startup incubator in Music City." }
  ],
  texas: [
    { name: "Tesla Inc. Gigafactory Texas", type: "Top Employer / Enterprise", city: "Austin", url: "https://www.tesla.com", description: "Global EV manufacturer headquartered in Austin employing over 20,000 staff." },
    { name: "ExxonMobil Global Headquarters", type: "Top Employer / Enterprise", city: "Spring / Houston", url: "https://corporate.exxonmobil.com", description: "Energy giant employing over 12,000 engineers and researchers in Greater Houston." },
    { name: "Central Texas Angel Network (CTAN)", type: "Venture Capital / Angel Network", city: "Austin", url: "https://www.centraltexasangelnetwork.com", description: "One of the most active angel networks in the nation having invested over $100M." },
    { name: "Capital Factory", type: "Co-working & Tech Hub", city: "Austin / Dallas / Houston", url: "https://www.capitalfactory.com", description: "Center of gravity for Texas startups host to 1,000+ tech founders." }
  ],
  utah: [
    { name: "Intermountain Health Headquarters", type: "Top Employer / Enterprise", city: "Salt Lake City", url: "https://intermountainhealthcare.org", description: "Utah's largest private employer with over 33,000 medical and clinical staff." },
    { name: "Silicon Slopes Community", type: "Co-working & Tech Hub", city: "Lehi / Salt Lake City", url: "https://siliconslopes.com", description: "Global brand organization representing Utah's booming tech ecosystem." }
  ],
  vermont: [
    { name: "University of Vermont Medical Center", type: "Top Employer / Enterprise", city: "Burlington", url: "https://www.uvmhealth.org", description: "Largest academic medical center and private employer in Vermont." },
    { name: "Flexible Capital Fund", type: "Venture Capital / Angel Network", city: "Montpelier", url: "https://flexcapfund.com", description: "Impact investment fund backing Vermont clean tech and food systems." }
  ],
  virginia: [
    { name: "Amazon HQ2 (Metropolitan Park)", type: "Top Employer / Enterprise", city: "Arlington", url: "https://www.aboutamazon.com/hq2", description: "Amazon's East Coast headquarters campus employing over 8,000 corporate staff." },
    { name: "Capital One Financial Headquarters", type: "Top Employer / Enterprise", city: "McLean", url: "https://www.capitalone.com", description: "Fortune 100 fintech leader employing 10,000 tech and corporate staff." },
    { name: "Mach37 Cyber Accelerator", type: "Incubator & Accelerator", city: "Tysons Corner / Herndon", url: "https://www.mach37.com", description: "Premier cybersecurity startup accelerator in Northern Virginia." }
  ],
  washington: [
    { name: "Microsoft World Headquarters", type: "Top Employer / Enterprise", city: "Redmond", url: "https://www.microsoft.com", description: "Global software and cloud giant employing over 50,000 personnel in Redmond." },
    { name: "Amazon World Headquarters", type: "Top Employer / Enterprise", city: "Seattle", url: "https://www.amazon.com", description: "E-commerce and cloud infrastructure leader employing 60,000 in Seattle." },
    { name: "Madrona Venture Group", type: "Venture Capital / Angel Network", city: "Seattle", url: "https://www.madrona.com", description: "Premier Pacific Northwest VC firm backing Amazon, Snowflake, and UIPath." },
    { name: "Pioneer Square Labs (PSL)", type: "Incubator & Accelerator", city: "Seattle", url: "https://www.psl.com", description: "Startup studio and venture fund spinning out Seattle software companies." }
  ],
  "west-virginia": [
    { name: "WVU Medicine (West Virginia University Health)", type: "Top Employer / Enterprise", city: "Morgantown", url: "https://wvumedicine.org", description: "Largest employer in West Virginia with over 24,000 healthcare staff." },
    { name: "Vantage Ventures", type: "Incubator & Accelerator", city: "Morgantown", url: "https://vantageventures.io", description: "Tech entrepreneurship hub connecting WV founders with national VC capital." }
  ],
  wisconsin: [
    { name: "Epic Systems Headquarters", type: "Top Employer / Enterprise", city: "Verona / Madison", url: "https://www.epic.com", description: "Global healthcare software giant employing 13,000 software engineers on 1,100-acre campus." },
    { name: "Kohl's Department Stores Headquarters", type: "Top Employer / Enterprise", city: "Menomonee Falls / Milwaukee", url: "https://corporate.kohls.com", description: "Retail enterprise employing thousands of corporate and tech staff." },
    { name: "Gener8tor Accelerator Network", type: "Incubator & Accelerator", city: "Milwaukee / Madison", url: "https://www.gener8tor.com", description: "Top-ranked national startup accelerator headquartered in Wisconsin." }
  ],
  wyoming: [
    { name: "University of Wyoming", type: "Top Employer / Enterprise", city: "Laramie", url: "https://www.uwyo.edu", description: "Premier higher education and research employer in Wyoming." },
    { name: "IMPACT 307 (Wyoming Technology Business Center)", type: "Incubator & Accelerator", city: "Laramie / Cheyenne", url: "https://impact307.org", description: "Statewide business incubator network fostering tech startup growth." }
  ]
};

export function getStateB2BVenture(stateSlugOrName: string): B2BVentureItem[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_B2B_VENTURE[normalized] || [];
}
