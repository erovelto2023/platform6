export interface Airport {
  name: string;
  code: string;
  city: string;
  type: "Large Hub International" | "Medium Hub Commercial" | "Small Hub / Regional" | "Cargo & Logistics Hub";
  website: string;
}

export const US_STATE_AIRPORTS: Record<string, Airport[]> = {
  alabama: [
    { name: "Birmingham-Shuttlesworth International Airport", code: "BHM", city: "Birmingham", type: "Medium Hub Commercial", website: "https://www.flybirmingham.com" },
    { name: "Huntsville International Airport", code: "HSV", city: "Huntsville", type: "Medium Hub Commercial", website: "https://www.flyhuntsville.com" },
    { name: "Mobile Regional Airport", code: "MOB", city: "Mobile", type: "Small Hub / Regional", website: "https://www.mobileairportauthority.com" },
    { name: "Montgomery Regional Airport", code: "MGM", city: "Montgomery", type: "Small Hub / Regional", website: "https://flymgm.com" }
  ],
  alaska: [
    { name: "Ted Stevens Anchorage International Airport", code: "ANC", city: "Anchorage", type: "Cargo & Logistics Hub", website: "https://dot.alaska.gov/anc" },
    { name: "Fairbanks International Airport", code: "FAI", city: "Fairbanks", type: "Medium Hub Commercial", website: "https://dot.alaska.gov/fai" },
    { name: "Juneau International Airport", code: "JNU", city: "Juneau", type: "Small Hub / Regional", website: "https://juneau.org/airport" },
    { name: "Ketchikan International Airport", code: "KTN", city: "Ketchikan", type: "Small Hub / Regional", website: "https://www.borough.ketchikan.ak.us" }
  ],
  arizona: [
    { name: "Phoenix Sky Harbor International Airport", code: "PHX", city: "Phoenix", type: "Large Hub International", website: "https://www.skyharbor.com" },
    { name: "Tucson International Airport", code: "TUS", city: "Tucson", type: "Medium Hub Commercial", website: "https://www.flytucson.com" },
    { name: "Phoenix-Mesa Gateway Airport", code: "AZA", city: "Mesa", type: "Medium Hub Commercial", website: "https://www.gatewayairport.com" },
    { name: "Flagstaff Pulliam Airport", code: "FLG", city: "Flagstaff", type: "Small Hub / Regional", website: "https://www.flagstaff.az.gov/airport" }
  ],
  arkansas: [
    { name: "Bill and Hillary Clinton National Airport", code: "LIT", city: "Little Rock", type: "Medium Hub Commercial", website: "https://www.flylit.com" },
    { name: "Northwest Arkansas National Airport", code: "XNA", city: "Highfill / Bentonville", type: "Medium Hub Commercial", website: "https://www.flyxna.com" },
    { name: "Fort Smith Regional Airport", code: "FSM", city: "Fort Smith", type: "Small Hub / Regional", website: "https://www.fortsmithairport.com" }
  ],
  california: [
    { name: "Los Angeles International Airport", code: "LAX", city: "Los Angeles", type: "Large Hub International", website: "https://www.flylax.com" },
    { name: "San Francisco International Airport", code: "SFO", city: "San Francisco", type: "Large Hub International", website: "https://www.flysfo.com" },
    { name: "San Diego International Airport", code: "SAN", city: "San Diego", type: "Large Hub International", website: "https://www.san.org" },
    { name: "San Jose Mineta International Airport", code: "SJC", city: "San Jose", type: "Large Hub International", website: "https://www.flysanjose.com" },
    { name: "Oakland San Francisco Bay Airport", code: "OAK", city: "Oakland", type: "Medium Hub Commercial", website: "https://www.iflyoak.com" },
    { name: "Sacramento International Airport", code: "SMF", city: "Sacramento", type: "Medium Hub Commercial", website: "https://sacramento.aero/smf" },
    { name: "John Wayne Airport", code: "SNA", city: "Santa Ana / Orange County", type: "Medium Hub Commercial", website: "https://www.ocair.com" },
    { name: "Hollywood Burbank Airport", code: "BUR", city: "Burbank", type: "Medium Hub Commercial", website: "https://www.hollywoodburbankairport.com" },
    { name: "Ontario International Airport", code: "ONT", city: "Ontario", type: "Cargo & Logistics Hub", website: "https://www.flyontario.com" },
    { name: "Fresno Yosemite International Airport", code: "FAT", city: "Fresno", type: "Small Hub / Regional", website: "https://flyfresno.com" }
  ],
  colorado: [
    { name: "Denver International Airport", code: "DEN", city: "Denver", type: "Large Hub International", website: "https://www.flydenver.com" },
    { name: "Colorado Springs Airport", code: "COS", city: "Colorado Springs", type: "Medium Hub Commercial", website: "https://coloradosprings.gov/flycos" },
    { name: "Grand Junction Regional Airport", code: "GJT", city: "Grand Junction", type: "Small Hub / Regional", website: "https://www.gjairport.com" },
    { name: "Aspen/Pitkin County Airport", code: "ASE", city: "Aspen", type: "Small Hub / Regional", website: "https://www.aspenairport.com" },
    { name: "Eagle County Regional Airport", code: "EGE", city: "Vail / Eagle", type: "Small Hub / Regional", website: "https://www.flyvail.com" }
  ],
  connecticut: [
    { name: "Bradley International Airport", code: "BDL", city: "Windsor Locks / Hartford", type: "Medium Hub Commercial", website: "https://bradleyairport.com" },
    { name: "Tweed New Haven Airport", code: "HVN", city: "New Haven", type: "Small Hub / Regional", website: "https://flytweed.com" }
  ],
  delaware: [
    { name: "Wilmington Airport", code: "ILG", city: "Wilmington / New Castle", type: "Small Hub / Regional", website: "https://flyilg.com" }
  ],
  florida: [
    { name: "Miami International Airport", code: "MIA", city: "Miami", type: "Large Hub International", website: "https://www.miami-airport.com" },
    { name: "Orlando International Airport", code: "MCO", city: "Orlando", type: "Large Hub International", website: "https://orlandoairports.net" },
    { name: "Fort Lauderdale-Hollywood International Airport", code: "FLL", city: "Fort Lauderdale", type: "Large Hub International", website: "https://www.broward.org/airport" },
    { name: "Tampa International Airport", code: "TPA", city: "Tampa", type: "Large Hub International", website: "https://www.tampaairport.com" },
    { name: "Southwest Florida International Airport", code: "RSW", city: "Fort Myers", type: "Medium Hub Commercial", website: "https://www.flylcpa.com" },
    { name: "Jacksonville International Airport", code: "JAX", city: "Jacksonville", type: "Medium Hub Commercial", website: "https://www.flyjax.com" },
    { name: "Palm Beach International Airport", code: "PBI", city: "West Palm Beach", type: "Medium Hub Commercial", website: "https://www.pbia.org" },
    { name: "Pensacola International Airport", code: "PNS", city: "Pensacola", type: "Small Hub / Regional", website: "https://flypensacola.com" },
    { name: "Sarasota-Bradenton International Airport", code: "SRQ", city: "Sarasota", type: "Small Hub / Regional", website: "https://srq-airport.com" }
  ],
  georgia: [
    { name: "Hartsfield-Jackson Atlanta International Airport", code: "ATL", city: "Atlanta", type: "Large Hub International", website: "https://www.atl.com" },
    { name: "Savannah/Hilton Head International Airport", code: "SAV", city: "Savannah", type: "Medium Hub Commercial", website: "https://savannahairport.com" },
    { name: "Augusta Regional Airport", code: "AGS", city: "Augusta", type: "Small Hub / Regional", website: "https://www.flyags.com" },
    { name: "Columbus Airport", code: "CSG", city: "Columbus", type: "Small Hub / Regional", website: "https://flythecsg.com" }
  ],
  hawaii: [
    { name: "Daniel K. Inouye International Airport", code: "HNL", city: "Honolulu", type: "Large Hub International", website: "https://airports.hawaii.gov/hnl" },
    { name: "Kahului Airport", code: "OGG", city: "Kahului / Maui", type: "Medium Hub Commercial", website: "https://airports.hawaii.gov/ogg" },
    { name: "Ellison Onizuka Kona International Airport", code: "KOA", city: "Kailua-Kona", type: "Medium Hub Commercial", website: "https://airports.hawaii.gov/koa" },
    { name: "Lihue Airport", code: "LIH", city: "Lihue / Kauai", type: "Medium Hub Commercial", website: "https://airports.hawaii.gov/lih" },
    { name: "Hilo International Airport", code: "ITO", city: "Hilo", type: "Small Hub / Regional", website: "https://airports.hawaii.gov/ito" }
  ],
  idaho: [
    { name: "Boise Airport", code: "BOI", city: "Boise", type: "Medium Hub Commercial", website: "https://www.iflyboise.com" },
    { name: "Idaho Falls Regional Airport", code: "IDA", city: "Idaho Falls", type: "Small Hub / Regional", website: "https://www.idahofallsidaho.gov/airport" },
    { name: "Pocatello Regional Airport", code: "PIH", city: "Pocatello", type: "Small Hub / Regional", website: "https://www.pocatello.gov/airport" }
  ],
  illinois: [
    { name: "Chicago O'Hare International Airport", code: "ORD", city: "Chicago", type: "Large Hub International", website: "https://www.flychicago.com/ohare" },
    { name: "Chicago Midway International Airport", code: "MDW", city: "Chicago", type: "Large Hub International", website: "https://www.flychicago.com/midway" },
    { name: "General Wayne A. Downing Peoria International Airport", code: "PIA", city: "Peoria", type: "Small Hub / Regional", website: "https://www.flypia.com" },
    { name: "Quad Cities International Airport", code: "MLI", city: "Moline", type: "Small Hub / Regional", website: "https://www.qcairport.com" },
    { name: "Central Illinois Regional Airport", code: "BMI", city: "Bloomington-Normal", type: "Small Hub / Regional", website: "https://cira.com" }
  ],
  indiana: [
    { name: "Indianapolis International Airport", code: "IND", city: "Indianapolis", type: "Medium Hub Commercial", website: "https://www.ind.com" },
    { name: "Fort Wayne International Airport", code: "FWA", city: "Fort Wayne", type: "Small Hub / Regional", website: "https://fwairport.com" },
    { name: "South Bend International Airport", code: "SBN", city: "South Bend", type: "Small Hub / Regional", website: "https://flysbn.com" },
    { name: "Evansville Regional Airport", code: "EVV", city: "Evansville", type: "Small Hub / Regional", website: "https://flyevv.com" }
  ],
  iowa: [
    { name: "Des Moines International Airport", code: "DSM", city: "Des Moines", type: "Medium Hub Commercial", website: "https://www.flydesmoines.com" },
    { name: "The Eastern Iowa Airport", code: "CID", city: "Cedar Rapids", type: "Small Hub / Regional", website: "https://flycid.com" },
    { name: "Sioux Gateway Airport", code: "SUX", city: "Sioux City", type: "Small Hub / Regional", website: "https://flysuxtoday.com" }
  ],
  kansas: [
    { name: "Wichita Dwight D. Eisenhower National Airport", code: "ICT", city: "Wichita", type: "Medium Hub Commercial", website: "https://www.flywichita.com" },
    { name: "Manhattan Regional Airport", code: "MHK", city: "Manhattan", type: "Small Hub / Regional", website: "https://www.flymhk.com" }
  ],
  kentucky: [
    { name: "Cincinnati/Northern Kentucky International Airport", code: "CVG", city: "Hebron / Northern KY", type: "Cargo & Logistics Hub", website: "https://www.cvgairport.com" },
    { name: "Louisville Muhammad Ali International Airport", code: "SDF", city: "Louisville", type: "Cargo & Logistics Hub", website: "https://flylouisville.com" },
    { name: "Blue Grass Airport", code: "LEX", city: "Lexington", type: "Small Hub / Regional", website: "https://www.bluegrassairport.com" },
    { name: "Owensboro-Daviess County Regional Airport", code: "OWB", city: "Owensboro", type: "Small Hub / Regional", website: "https://owbairport.com" }
  ],
  louisiana: [
    { name: "Louis Armstrong New Orleans International Airport", code: "MSY", city: "New Orleans", type: "Medium Hub Commercial", website: "https://flymsy.com" },
    { name: "Baton Rouge Metropolitan Airport", code: "BTR", city: "Baton Rouge", type: "Small Hub / Regional", website: "https://www.flybtr.com" },
    { name: "Shreveport Regional Airport", code: "SHV", city: "Shreveport", type: "Small Hub / Regional", website: "https://www.flyshreveport.com" },
    { name: "Lafayette Regional Airport", code: "LFT", city: "Lafayette", type: "Small Hub / Regional", website: "https://lftairport.com" }
  ],
  maine: [
    { name: "Portland International Jetport", code: "PWM", city: "Portland", type: "Medium Hub Commercial", website: "https://portlandjetport.org" },
    { name: "Bangor International Airport", code: "BGR", city: "Bangor", type: "Small Hub / Regional", website: "https://flybangor.com" }
  ],
  maryland: [
    { name: "Baltimore/Washington International Thurgood Marshall Airport", code: "BWI", city: "Baltimore / Anne Arundel", type: "Large Hub International", website: "https://www.bwiairport.com" },
    { name: "Salisbury-Ocean City Wicomico Regional Airport", code: "SBY", city: "Salisbury", type: "Small Hub / Regional", website: "https://www.flysby airport.com" }
  ],
  massachusetts: [
    { name: "Boston Logan International Airport", code: "BOS", city: "Boston", type: "Large Hub International", website: "https://www.massport.com/logan-airport" },
    { name: "Worcester Regional Airport", code: "ORH", city: "Worcester", type: "Small Hub / Regional", website: "https://www.massport.com/worcester-airport" },
    { name: "Nantucket Memorial Airport", code: "ACK", city: "Nantucket", type: "Small Hub / Regional", website: "https://www.nantucket-ma.gov/airport" }
  ],
  michigan: [
    { name: "Detroit Metropolitan Wayne County Airport", code: "DTW", city: "Detroit / Romulus", type: "Large Hub International", website: "https://www.metroairport.com" },
    { name: "Gerald R. Ford International Airport", code: "GRR", city: "Grand Rapids", type: "Medium Hub Commercial", website: "https://www.grr.org" },
    { name: "Capital Region International Airport", code: "LAN", city: "Lansing", type: "Small Hub / Regional", website: "https://flylansing.com" },
    { name: "Bishop International Airport", code: "FNT", city: "Flint", type: "Small Hub / Regional", website: "https://bishopairport.org" },
    { name: "Cherry Capital Airport", code: "TVC", city: "Traverse City", type: "Small Hub / Regional", website: "https://www.tvairport.com" }
  ],
  minnesota: [
    { name: "Minneapolis-Saint Paul International Airport", code: "MSP", city: "Minneapolis / St. Paul", type: "Large Hub International", website: "https://www.mspairport.com" },
    { name: "Duluth International Airport", code: "DLH", city: "Duluth", type: "Small Hub / Regional", website: "https://duluthairport.com" },
    { name: "Rochester International Airport", code: "RST", city: "Rochester", type: "Small Hub / Regional", website: "https://flyrst.com" }
  ],
  mississippi: [
    { name: "Jackson-Medgar Wiley Evers International Airport", code: "JAN", city: "Jackson", type: "Medium Hub Commercial", website: "https://jfaa.org" },
    { name: "Gulfport-Biloxi International Airport", code: "GPT", city: "Gulfport", type: "Small Hub / Regional", website: "https://www.flygpt.com" }
  ],
  missouri: [
    { name: "Kansas City International Airport", code: "MCI", city: "Kansas City", type: "Medium Hub Commercial", website: "https://www.flykc.com" },
    { name: "St. Louis Lambert International Airport", code: "STL", city: "St. Louis", type: "Medium Hub Commercial", website: "https://www.flystl.com" },
    { name: "Springfield-Branson National Airport", code: "SGF", city: "Springfield", type: "Small Hub / Regional", website: "https://www.flysgf.com" }
  ],
  montana: [
    { name: "Bozeman Yellowstone International Airport", code: "BZN", city: "Bozeman", type: "Medium Hub Commercial", website: "https://bozemanairport.com" },
    { name: "Billings Logan International Airport", code: "BIL", city: "Billings", type: "Small Hub / Regional", website: "https://www.flybillings.com" },
    { name: "Missoula Montana Airport", code: "MSO", city: "Missoula", type: "Small Hub / Regional", website: "https://flymissoula.com" },
    { name: "Great Falls International Airport", code: "GTF", city: "Great Falls", type: "Small Hub / Regional", website: "https://flygtf.com" }
  ],
  nebraska: [
    { name: "Eppley Airfield", code: "OMA", city: "Omaha", type: "Medium Hub Commercial", website: "https://www.flyoma.com" },
    { name: "Lincoln Airport", code: "LNK", city: "Lincoln", type: "Small Hub / Regional", website: "https://lincolnairport.com" }
  ],
  nevada: [
    { name: "Harry Reid International Airport", code: "LAS", city: "Las Vegas", type: "Large Hub International", website: "https://www.harryreidairport.com" },
    { name: "Reno/Tahoe International Airport", code: "RNO", city: "Reno", type: "Medium Hub Commercial", website: "https://www.renoairport.com" }
  ],
  "new-hampshire": [
    { name: "Manchester-Boston Regional Airport", code: "MHT", city: "Manchester", type: "Medium Hub Commercial", website: "https://www.flymanchester.com" },
    { name: "Portsmouth International Airport at Pease", code: "PSM", city: "Portsmouth", type: "Small Hub / Regional", website: "https://www.peasedev.org/airport" }
  ],
  "new-jersey": [
    { name: "Newark Liberty International Airport", code: "EWR", city: "Newark", type: "Large Hub International", website: "https://www.newarkairport.com" },
    { name: "Atlantic City International Airport", code: "ACY", city: "Atlantic City", type: "Small Hub / Regional", website: "https://www.sjta.com/acairport" }
  ],
  "new-mexico": [
    { name: "Albuquerque International Sunport", code: "ABQ", city: "Albuquerque", type: "Medium Hub Commercial", website: "https://www.abqsunport.com" },
    { name: "Santa Fe Regional Airport", code: "SAF", city: "Santa Fe", type: "Small Hub / Regional", website: "https://www.flysantafe.com" }
  ],
  "new-york": [
    { name: "John F. Kennedy International Airport", code: "JFK", city: "New York City / Queens", type: "Large Hub International", website: "https://www.jfkairport.com" },
    { name: "LaGuardia Airport", code: "LGA", city: "New York City / Queens", type: "Large Hub International", website: "https://www.laguardiaairport.com" },
    { name: "Buffalo Niagara International Airport", code: "BUF", city: "Buffalo", type: "Medium Hub Commercial", website: "https://www.buffaloairport.com" },
    { name: "Frederick Douglass Greater Rochester International Airport", code: "ROC", city: "Rochester", type: "Small Hub / Regional", website: "https://www.monroecounty.gov/airport" },
    { name: "Syracuse Hancock International Airport", code: "SYR", city: "Syracuse", type: "Small Hub / Regional", website: "https://flysyracuse.com" },
    { name: "Albany International Airport", code: "ALB", city: "Albany", type: "Small Hub / Regional", website: "https://www.albanyairport.com" }
  ],
  "north-carolina": [
    { name: "Charlotte Douglas International Airport", code: "CLT", city: "Charlotte", type: "Large Hub International", website: "https://www.cltairport.com" },
    { name: "Raleigh-Durham International Airport", code: "RDU", city: "Raleigh / Durham", type: "Large Hub International", website: "https://www.rdu.com" },
    { name: "Piedmont Triad International Airport", code: "GSO", city: "Greensboro", type: "Cargo & Logistics Hub", website: "https://flyptia.org" },
    { name: "Asheville Regional Airport", code: "AVL", city: "Asheville", type: "Small Hub / Regional", website: "https://flyavl.com" },
    { name: "Wilmington International Airport", code: "ILM", city: "Wilmington", type: "Small Hub / Regional", website: "https://flyilm.com" }
  ],
  "north-dakota": [
    { name: "Hector International Airport", code: "FAR", city: "Fargo", type: "Small Hub / Regional", website: "https://www.fargoairport.com" },
    { name: "Bismarck Municipal Airport", code: "BIS", city: "Bismarck", type: "Small Hub / Regional", website: "https://www.bismarcknd.gov/airport" },
    { name: "Grand Forks International Airport", code: "GFK", city: "Grand Forks", type: "Small Hub / Regional", website: "https://gfkairport.com" }
  ],
  ohio: [
    { name: "John Glenn Columbus International Airport", code: "CMH", city: "Columbus", type: "Medium Hub Commercial", website: "https://flycolumbus.com" },
    { name: "Cleveland Hopkins International Airport", code: "CLE", city: "Cleveland", type: "Medium Hub Commercial", website: "https://www.clevelandairport.com" },
    { name: "Dayton International Airport", code: "DAY", city: "Dayton", type: "Small Hub / Regional", website: "https://flydayton.com" },
    { name: "Akron-Canton Airport", code: "CAK", city: "Akron / Canton", type: "Small Hub / Regional", website: "https://www.akroncantonairport.com" }
  ],
  oklahoma: [
    { name: "Will Rogers World Airport", code: "OKC", city: "Oklahoma City", type: "Medium Hub Commercial", website: "https://flyokc.com" },
    { name: "Tulsa International Airport", code: "TUL", city: "Tulsa", type: "Medium Hub Commercial", website: "https://flytulsa.com" },
    { name: "Lawton-Fort Sill Regional Airport", code: "LAW", city: "Lawton", type: "Small Hub / Regional", website: "https://flylawton.com" }
  ],
  oregon: [
    { name: "Portland International Airport", code: "PDX", city: "Portland", type: "Large Hub International", website: "https://www.flypdx.com" },
    { name: "Eugene Airport", code: "EUG", city: "Eugene", type: "Small Hub / Regional", website: "https://www.eugene-or.gov/airport" },
    { name: "Rogue Valley International-Medford Airport", code: "MFR", city: "Medford", type: "Small Hub / Regional", website: "https://jacksoncountyor.gov/airport" },
    { name: "Redmond Municipal Airport", code: "RDM", city: "Redmond / Bend", type: "Small Hub / Regional", website: "https://www.flyrdm.com" }
  ],
  pennsylvania: [
    { name: "Philadelphia International Airport", code: "PHL", city: "Philadelphia", type: "Large Hub International", website: "https://www.phl.org" },
    { name: "Pittsburgh International Airport", code: "PIT", city: "Pittsburgh", type: "Medium Hub Commercial", website: "https://flypittsburgh.com" },
    { name: "Harrisburg International Airport", code: "MDT", city: "Harrisburg", type: "Small Hub / Regional", website: "https://www.flyhia.com" },
    { name: "Lehigh Valley International Airport", code: "ABE", city: "Allentown", type: "Small Hub / Regional", website: "https://flyabe.com" },
    { name: "Erie International Airport", code: "ERI", city: "Erie", type: "Small Hub / Regional", website: "https://www.erieairport.org" }
  ],
  "rhode-island": [
    { name: "Rhode Island T. F. Green International Airport", code: "PVD", city: "Providence / Warwick", type: "Medium Hub Commercial", website: "https://www.pvdairport.com" }
  ],
  "south-carolina": [
    { name: "Charleston International Airport", code: "CHS", city: "Charleston", type: "Medium Hub Commercial", website: "https://www.iflychs.com" },
    { name: "Greenville-Spartanburg International Airport", code: "GSP", city: "Greer / Greenville", type: "Medium Hub Commercial", website: "https://www.gspairport.com" },
    { name: "Columbia Metropolitan Airport", code: "CAE", city: "Columbia", type: "Small Hub / Regional", website: "https://flycae.com" },
    { name: "Myrtle Beach International Airport", code: "MYR", city: "Myrtle Beach", type: "Medium Hub Commercial", website: "https://www.flymyrtlebeach.com" }
  ],
  "south-dakota": [
    { name: "Sioux Falls Regional Airport", code: "FSD", city: "Sioux Falls", type: "Medium Hub Commercial", website: "https://www.sfairport.com" },
    { name: "Rapid City Regional Airport", code: "RAP", city: "Rapid City", type: "Small Hub / Regional", website: "https://www.rapairport.com" }
  ],
  tennessee: [
    { name: "Nashville International Airport", code: "BNA", city: "Nashville", type: "Large Hub International", website: "https://flynashville.com" },
    { name: "Memphis International Airport", code: "MEM", city: "Memphis", type: "Cargo & Logistics Hub", website: "https://flymemphis.com" },
    { name: "McGhee Tyson Airport", code: "TYS", city: "Knoxville", type: "Small Hub / Regional", website: "https://flytyson.com" },
    { name: "Chattanooga Metropolitan Airport", code: "CHA", city: "Chattanooga", type: "Small Hub / Regional", website: "https://www.chattairport.com" }
  ],
  texas: [
    { name: "Dallas/Fort Worth International Airport", code: "DFW", city: "Dallas-Fort Worth", type: "Large Hub International", website: "https://www.dfwairport.com" },
    { name: "George Bush Intercontinental Airport", code: "IAH", city: "Houston", type: "Large Hub International", website: "https://www.fly2houston.com/iah" },
    { name: "Austin-Bergstrom International Airport", code: "AUS", city: "Austin", type: "Large Hub International", website: "https://www.austintexas.gov/airport" },
    { name: "San Antonio International Airport", code: "SAT", city: "San Antonio", type: "Medium Hub Commercial", website: "https://www.flysanantonio.com" },
    { name: "Dallas Love Field", code: "DAL", city: "Dallas", type: "Medium Hub Commercial", website: "https://www.dallas-lovefield.com" },
    { name: "William P. Hobby Airport", code: "HOU", city: "Houston", type: "Medium Hub Commercial", website: "https://www.fly2houston.com/hou" },
    { name: "El Paso International Airport", code: "ELP", city: "El Paso", type: "Small Hub / Regional", website: "https://www.elpasointernationalairport.com" },
    { name: "McAllen International Airport", code: "MFE", city: "McAllen", type: "Small Hub / Regional", website: "https://www.mcallenairport.com" },
    { name: "Corpus Christi International Airport", code: "CRP", city: "Corpus Christi", type: "Small Hub / Regional", website: "https://www.corpuschristiairport.com" }
  ],
  utah: [
    { name: "Salt Lake City International Airport", code: "SLC", city: "Salt Lake City", type: "Large Hub International", website: "https://slcairport.com" },
    { name: "St. George Regional Airport", code: "SGU", city: "St. George", type: "Small Hub / Regional", website: "https://www.sgcity.org/airport" },
    { name: "Provo Municipal Airport", code: "PVU", city: "Provo", type: "Small Hub / Regional", website: "https://www.provo.org/airport" }
  ],
  vermont: [
    { name: "Patrick Leahy Burlington International Airport", code: "BTV", city: "Burlington", type: "Medium Hub Commercial", website: "https://www.btv.aero" }
  ],
  virginia: [
    { name: "Washington Dulles International Airport", code: "IAD", city: "Dulles / Loudoun", type: "Large Hub International", website: "https://www.flydulles.com" },
    { name: "Ronald Reagan Washington National Airport", code: "DCA", city: "Arlington", type: "Large Hub International", website: "https://www.flyreagan.com" },
    { name: "Richmond International Airport", code: "RIC", city: "Richmond", type: "Medium Hub Commercial", website: "https://flyrichmond.com" },
    { name: "Norfolk International Airport", code: "ORF", city: "Norfolk", type: "Medium Hub Commercial", website: "https://www.norfolkairport.com" },
    { name: "Roanoke-Blacksburg Regional Airport", code: "ROA", city: "Roanoke", type: "Small Hub / Regional", website: "https://www.flyroa.com" }
  ],
  washington: [
    { name: "Seattle-Tacoma International Airport", code: "SEA", city: "Seattle / SeaTac", type: "Large Hub International", website: "https://www.portseattle.org/sea-tac" },
    { name: "Spokane International Airport", code: "GEG", city: "Spokane", type: "Medium Hub Commercial", website: "https://spokaneairports.net" },
    { name: "Tri-Cities Airport", code: "PSC", city: "Pasco", type: "Small Hub / Regional", website: "https://www.flytricities.com" },
    { name: "Paine Field Passenger Terminal", code: "PAE", city: "Everett", type: "Small Hub / Regional", website: "https://www.flypainefield.com" }
  ],
  "west-virginia": [
    { name: "West Virginia International Yeager Airport", code: "CRW", city: "Charleston", type: "Small Hub / Regional", website: "https://flycrw.com" },
    { name: "Huntington Tri-State Airport", code: "HTS", city: "Huntington", type: "Small Hub / Regional", website: "https://www.tristateairport.com" }
  ],
  wisconsin: [
    { name: "Milwaukee Mitchell International Airport", code: "MKE", city: "Milwaukee", type: "Medium Hub Commercial", website: "https://www.mitchellairport.com" },
    { name: "Dane County Regional Airport", code: "MSN", city: "Madison", type: "Medium Hub Commercial", website: "https://www.msnairport.com" },
    { name: "Green Bay Austin Straubel International Airport", code: "GRB", city: "Green Bay", type: "Small Hub / Regional", website: "https://flygrb.com" },
    { name: "Appleton International Airport", code: "ATW", city: "Appleton", type: "Small Hub / Regional", website: "https://atwairport.com" }
  ],
  wyoming: [
    { name: "Jackson Hole Airport", code: "JAC", city: "Jackson Hole", type: "Medium Hub Commercial", website: "https://www.jacksonholeairport.com" },
    { name: "Cheyenne Regional Airport", code: "CYS", city: "Cheyenne", type: "Small Hub / Regional", website: "https://cheyenneairport.com" },
    { name: "Casper-Natrona County International Airport", code: "CPR", city: "Casper", type: "Small Hub / Regional", website: "https://iflycasper.com" }
  ]
};

export function getStateAirports(stateSlugOrName: string): Airport[] {
  const normalized = (stateSlugOrName || '').toLowerCase().trim().replace(/\s+/g, '-');
  return US_STATE_AIRPORTS[normalized] || [];
}
