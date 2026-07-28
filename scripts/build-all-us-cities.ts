import mongoose from "mongoose";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI!;

const USER_CITY_LIST = [
  // Alaska
  "Anchorage Alaska", "Anderson Alaska", "Angoon Alaska", "Atqasuk Alaska", "Barrow Alaska", "Bethel Bethel Alaska", "Clear Alaska", "Cordova Alaska", "Craig Alaska", "Delta Junction Alaska", "Dillingham Dillingham Alaska", "Eielson Air Force Base Alaska", "Elmendorf Air Force Base Alaska", "Fairbanks Alaska", "Galena Alaska", "Glennallen Alaska", "Gustavus Alaska", "Haines Haines Alaska", "Healy Alaska", "Homer Alaska", "Hoonah Alaska", "Juneau Juneau Alaska", "Kenai Alaska", "Ketchikan Alaska", "Klawock Alaska", "Kodiak Alaska", "Kotzebue Alaska", "McGrath Alaska", "Metlakatla Alaska", "Mountain Village Alaska", "Nikiski Alaska", "Nome Nome Alaska", "North Pole Alaska", "Palmer Alaska", "Pelican Alaska", "Petersburg Alaska", "Port Lions Alaska", "Seward Alaska", "Sitka Sitka Alaska", "Skagway Alaska", "Soldotna Alaska", "Tanacross Alaska", "Thorne Bay Alaska", "Tok Alaska", "Tununak Alaska", "Unalaska Alaska", "Valdez Alaska", "Wasilla Alaska", "Whittier Alaska", "Wrangell Alaska", "Yakutat Yakutat Alaska",
  // Alabama
  "Abbeville Alabama", "Adamsville Alabama", "Addison Alabama", "Adger Alabama", "Alabaster Alabama", "Albertville Alabama", "Alexander City Alabama", "Alexandria Alabama", "Allgood Alabama", "Alpine Alabama", "Andalusia Alabama", "Anniston Alabama", "Arab Alabama", "Arlington Alabama", "Ashford Alabama", "Ashland Alabama", "Ashville Alabama", "Athens Alabama", "Atmore Alabama", "Attalla Alabama", "Auburn Alabama", "Autaugaville Alabama", "Axis Alabama", "Bay Minette Alabama", "Berry Alabama", "Bessemer Alabama", "Birmingham Alabama", "Blountsville Alabama", "Boaz Alabama", "Bremen Alabama", "Brewton Alabama", "Brookwood Alabama", "Brownsboro Alabama", "Bucks Alabama", "Buhl Alabama", "Butler Alabama", "Calera Alabama", "Camden Alabama", "Carrollton Alabama", "Centre Alabama", "Centreville Alabama", "Chapman Alabama", "Chelsea Alabama", "Cherokee Alabama", "Childersburg Alabama", "Clanton Alabama", "Clayton Alabama", "Clio Alabama", "Coffeeville Alabama", "Columbia Alabama", "Columbiana Alabama", "Cottondale Alabama", "Cottonwood Alabama", "Cowarts Alabama", "Creola Alabama", "Crossville Alabama", "Cullman Alabama", "Daleville Alabama", "Daphne Alabama", "Dauphin Island Alabama", "Deatsville Alabama", "Decatur Alabama", "Demopolis Alabama", "Dixons Mills Alabama", "Dothan Alabama", "Eastaboga Alabama", "Eclectic Alabama", "Elba Alabama", "Elberta Alabama", "Enterprise Alabama", "Eufaula Alabama", "Eutaw Alabama", "Evergreen Alabama", "Excel Alabama", "Fairfield Alabama", "Fairhope Alabama", "Fayette Alabama", "Florence Alabama", "Foley Alabama", "Fruitdale Alabama", "Fort Deposit Alabama", "Fort Payne Alabama", "Fort Rucker Alabama", "Fulton Alabama", "Fultondale Alabama", "Gadsden Alabama", "Gardendale Alabama", "Geneva Alabama", "Glenwood Alabama", "Goodwater Alabama", "Gordo Alabama", "Grand Bay Alabama", "Graysville Alabama", "Greensboro Alabama", "Greenville Alabama", "Grove Hill Alabama", "Guin Alabama", "Gulf Shores Alabama", "Guntersville Alabama", "Haleyville Alabama", "Hamilton Alabama", "Hanceville Alabama", "Hartselle Alabama", "Hatchechubbee Alabama", "Hayden Alabama", "Hayneville Alabama", "Hazel Green Alabama", "Headland Alabama", "Heflin Alabama", "Helena Alabama", "Hodges Alabama", "Hope Hull Alabama", "Huntsville Alabama", "Huxford Alabama", "Ider Alabama", "Jack Alabama", "Jackson Alabama", "Jacksonville Alabama", "Jasper Alabama", "Jefferson Alabama", "Kellyton Alabama", "Killen Alabama", "Laceys Spring Alabama", "La Fayette Alabama", "Lanett Alabama", "Leeds Alabama", "Leesburg Alabama", "Lillian Alabama", "Lincoln Alabama", "Linden Alabama", "Lineville Alabama", "Livingston Alabama", "Loachapoka Alabama", "Locust Fork Alabama", "Loxley Alabama", "Luverne Alabama", "Madison Alabama", "Marion Alabama", "Mathews Alabama", "Millport Alabama", "Millry Alabama", "Mobile Alabama", "Monroeville Alabama", "Montevallo Alabama", "Montgomery Alabama", "Montrose Alabama", "Morris Alabama", "Moulton Alabama", "Munford Alabama", "Muscle Shoals Alabama", "New Brockton Alabama", "New Market Alabama", "Newton Alabama", "Newville Alabama", "Northport Alabama", "Notasulga Alabama", "Oakman Alabama", "Oneonta Alabama", "Opelika Alabama", "Opp Alabama", "Orange Beach Alabama", "Oxford Alabama", "Ozark Alabama", "Paint Rock Alabama", "Pelham Alabama", "Pell City Alabama", "Pennington Alabama", "Perdue Hill Alabama", "Phenix City Alabama", "Piedmont Alabama", "Pike Road Alabama", "Pine Hill Alabama", "Pinson Alabama", "Pleasant Grove Alabama", "Prattville Alabama", "Quinton Alabama", "Ragland Alabama", "Rainbow City Alabama", "Rainsville Alabama", "Ramer Alabama", "Red Bay Alabama", "Reform Alabama", "Roanoke Alabama", "Robertsdale Alabama", "Russellville Alabama", "Rutledge Alabama", "Saginaw Alabama", "Saraland Alabama", "Scottsboro Alabama", "Selma Alabama", "Semmes Alabama", "Sheffield Alabama", "Shelby Alabama", "Spanish Fort Alabama", "Springville Alabama", "Sulligent Alabama", "Sumiton Alabama", "Summerdale Alabama", "Sycamore Alabama", "Sylacauga Alabama", "Talladega Alabama", "Tallassee Alabama", "Theodore Alabama", "Thomasville Alabama", "Toney Alabama", "Troy Alabama", "Trussville Alabama", "Tuscaloosa Alabama", "Tuscumbia Alabama", "Tuskegee Alabama", "Union Springs Alabama", "Valley Alabama", "Vernon Alabama", "Vinemont Alabama", "Wadley Alabama", "Walnut Grove Alabama", "Warrior Alabama", "Webb Alabama", "Wedowee Alabama", "Wetumpka Alabama", "Winfield Alabama", "York Alabama",
  // Arkansas
  "Adona Arkansas", "Alexander Arkansas", "Alma Arkansas", "Altheimer Arkansas", "Amity Arkansas", "Arkadelphia Arkansas", "Armorel Arkansas", "Ash Flat Arkansas", "Ashdown Arkansas", "Augusta Arkansas", "Bald Knob Arkansas", "Barling Arkansas", "Batesville Arkansas", "Bauxite Arkansas", "Bay Arkansas", "Beebe Arkansas", "Bella Vista Arkansas", "Benton Arkansas", "Bentonville Arkansas", "Berryville Arkansas", "Bigelow Arkansas", "Blytheville Arkansas", "Booneville Arkansas", "Bradford Arkansas", "Branch Arkansas", "Brinkley Arkansas", "Brockwell Arkansas", "Brookland Arkansas", "Bryant Arkansas", "Burdette Arkansas", "Cabot Arkansas", "Calico Rock Arkansas", "Camden Arkansas", "Carlisle Arkansas", "Carthage Arkansas", "Cave City Arkansas", "Center Ridge Arkansas", "Charleston Arkansas", "Charlotte Arkansas", "Cherokee Village Arkansas", "Clarendon Arkansas", "Clarksville Arkansas", "Clinton Arkansas", "Compton Arkansas", "Conway Arkansas", "Corning Arkansas", "Crossett Arkansas", "Danville Arkansas", "Dardanelle Arkansas", "De Queen Arkansas", "DeWitt Arkansas", "Decatur Arkansas", "Dermott Arkansas", "Des Arc Arkansas", "Dumas Arkansas", "Dyess Arkansas", "El Dorado Arkansas", "Elm Springs Arkansas", "England Arkansas", "Enola Arkansas", "Eureka Springs Arkansas", "Fairfield Bay Arkansas", "Farmington Arkansas", "Fayetteville Arkansas", "Flippin Arkansas", "Floral Arkansas", "Fordyce Arkansas", "Forrest City Arkansas", "Fountain Hill Arkansas", "Friendship Arkansas", "Fort Smith Arkansas", "Gassville Arkansas", "Gentry Arkansas", "Gillham Arkansas", "Glenwood Arkansas", "Gould Arkansas", "Grady Arkansas", "Gravette Arkansas", "Greenbrier Arkansas", "Greenwood Arkansas", "Guion Arkansas", "Hackett Arkansas", "Hamburg Arkansas", "Hardy Arkansas", "Harrisburg Arkansas", "Harrison Arkansas", "Hartford Arkansas", "Hattieville Arkansas", "Hazen Arkansas", "Heber Springs Arkansas", "Hector Arkansas", "Higden Arkansas", "Hope Arkansas", "Hot Springs National Park Arkansas", "Hot Springs Village Arkansas", "Hoxie Arkansas", "Humphrey Arkansas", "Huntsville Arkansas", "Imboden Arkansas", "Jacksonville Arkansas", "Jasper Arkansas", "Jessieville Arkansas", "Joiner Arkansas", "Jonesboro Arkansas", "Keiser Arkansas", "Kensett Arkansas", "Lake Village Arkansas", "Lavaca Arkansas", "Lead Hill Arkansas", "Lepanto Arkansas", "Leslie Arkansas", "Little Rock Arkansas", "Little Rock Air Force Base Arkansas", "Lockesburg Arkansas", "London Arkansas", "Lonoke Arkansas", "Lowell Arkansas", "Luxora Arkansas", "Lynn Arkansas", "Magnolia Arkansas", "Malvern Arkansas", "Mammoth Spring Arkansas", "Mansfield Arkansas", "Marianna Arkansas", "Marion Arkansas", "Marked Tree Arkansas", "Marmaduke Arkansas", "Marshall Arkansas", "Maumelle Arkansas", "Maynard Arkansas", "McCrory Arkansas", "McGehee Arkansas", "McRae Arkansas", "Melbourne Arkansas", "Mena Arkansas", "Monticello Arkansas", "Morrilton Arkansas", "Mount Holly Arkansas", "Mount Ida Arkansas", "Mount Pleasant Arkansas", "Mount Vernon Arkansas", "Mountain Home Arkansas", "Mountain View Arkansas", "Mountainburg Arkansas", "Nashville Arkansas", "Newark Arkansas", "Newport Arkansas", "Norfork Arkansas", "Norman Arkansas", "North Little Rock Arkansas", "Osceola Arkansas", "Ozark Arkansas", "Palestine Arkansas", "Paragould Arkansas", "Paris Arkansas", "Pea Ridge Arkansas", "Pearcy Arkansas", "Piggott Arkansas", "Pine Bluff Arkansas", "Plainview Arkansas", "Plumerville Arkansas", "Pocahontas Arkansas", "Poplar Grove Arkansas", "Pottsville Arkansas", "Prairie Grove Arkansas", "Prescott Arkansas", "Quitman Arkansas", "Rector Arkansas", "Rison Arkansas", "Rogers Arkansas", "Romance Arkansas", "Rosston Arkansas", "Russellville Arkansas", "Salem Arkansas", "Scotland Arkansas", "Searcy Arkansas", "Sheridan Arkansas", "Sherwood Arkansas", "Siloam Springs Arkansas", "Smackover Arkansas", "Springdale Arkansas", "Stamps Arkansas", "Star City Arkansas", "Stuttgart Arkansas", "Subiaco Arkansas", "Sulphur Rock Arkansas", "Swifton Arkansas", "Texarkana Arkansas", "Timbo Arkansas", "Tontitown Arkansas", "Trumann Arkansas", "Valley Springs Arkansas", "Van Buren Arkansas", "Vilonia Arkansas", "Waldo Arkansas", "Waldron Arkansas", "Walnut Ridge Arkansas", "Ward Arkansas", "Warren Arkansas", "Washington Arkansas", "Weiner Arkansas", "West Fork Arkansas", "West Memphis Arkansas", "White Hall Arkansas", "Winslow Arkansas", "Wiseman Arkansas", "Wrightsville Arkansas", "Wynne Arkansas", "Yellville Arkansas",
  // Arizona
  "Ajo Arizona", "Alpine Arizona", "Amado Arizona", "Apache Junction Arizona", "Arizona City Arizona", "Ash Fork Arizona", "Avondale Arizona", "Benson Arizona", "Bisbee Arizona", "Buckeye Arizona", "Bullhead City Arizona", "Camp Verde Arizona", "Carefree Arizona", "Casa Grande Arizona", "Catalina Arizona", "Cave Creek Arizona", "Central Arizona", "Chandler Arizona", "Chinle Arizona", "Chino Valley Arizona", "Clarkdale Arizona", "Clifton Arizona", "Cochise Arizona", "Colorado City Arizona", "Congress Arizona", "Coolidge Arizona", "Cortaro Arizona", "Cottonwood Arizona", "Dateland Arizona", "Douglas Arizona", "Duncan Arizona", "Ehrenberg Arizona", "El Mirage Arizona", "Elgin Arizona", "Eloy Arizona", "Flagstaff Arizona", "Florence Arizona", "Fountain Hills Arizona", "Fredonia Arizona", "Fort Defiance Arizona", "Fort Huachuca Arizona", "Fort Mohave Arizona", "Fort Thomas Arizona", "Ganado Arizona", "Gila Bend Arizona", "Gilbert Arizona", "Glendale Arizona", "Globe Arizona", "Goodyear Arizona", "Grand Canyon National Park Arizona", "Green Valley Arizona", "Hayden Arizona", "Holbrook Arizona", "Hotevilla-Bacavi Arizona", "Joseph City Arizona", "Kayenta Arizona", "Keams Canyon Arizona", "Kearny Arizona", "Kingman Arizona", "Kykotsmovi Village Arizona", "Lake Havasu City Arizona", "Lake Montezuma Arizona", "Litchfield Park Arizona", "Littlefield Arizona", "Luke Air Force Base Arizona", "Mammoth Arizona", "Many Farms Arizona", "Marana Arizona", "Maricopa Arizona", "Mayer Arizona", "Mesa Arizona", "Miami Arizona", "Mohave Valley Arizona", "Morenci Arizona", "Morristown Arizona", "Naco Arizona", "New River Arizona", "Nogales Arizona", "Oracle Arizona", "Page Arizona", "Palo Verde Arizona", "Paradise Valley Arizona", "Parker Arizona", "Parks Arizona", "Payson Arizona", "Peoria Arizona", "Phoenix Arizona", "Pima Arizona", "Poston Arizona", "Prescott Arizona", "Prescott Valley Arizona", "Quartzsite Arizona", "Queen Creek Arizona", "Red Rock Arizona", "Rio Rico Arizona", "Rio Verde Arizona", "Sacaton Arizona", "Safford Arizona", "Sahuarita Arizona", "Salome Arizona", "San Carlos Arizona", "San Luis Arizona", "San Manuel Arizona", "San Simon Arizona", "Sanders Arizona", "Scottsdale Arizona", "Sedona Arizona", "Seligman Arizona", "Sells Arizona", "Show Low Arizona", "Sierra Vista Arizona", "Skull Valley Arizona", "Snowflake Arizona", "Solomon Arizona", "Somerton Arizona", "Springerville Arizona", "Saint David Arizona", "Saint Johns Arizona", "Saint Michaels Arizona", "Stanfield Arizona", "Sun City Arizona", "Sun City West Arizona", "Superior Arizona", "Surprise Arizona", "Teec Nos Pos Arizona", "Tempe Arizona", "Thatcher Arizona", "Tolleson Arizona", "Tombstone Arizona", "Tonopah Arizona", "Topawa Arizona", "Tuba City Arizona", "Tucson Arizona", "Vail Arizona", "Waddell Arizona", "Wellton Arizona", "Whiteriver Arizona", "Wickenburg Arizona", "Wikieup Arizona", "Willcox Arizona", "Williams Arizona", "Window Rock Arizona", "Winkelman Arizona", "Winslow Arizona", "Wittmann Arizona", "Youngtown Arizona", "Yuma Arizona",
  // Colorado
  "Agate Colorado", "Akron Colorado", "Alamosa Colorado", "Allenspark Colorado", "Alma Colorado", "Anton Colorado", "Arapahoe Colorado", "Arvada Colorado", "Aspen Colorado", "Ault Colorado", "Aurora Colorado", "Avon Colorado", "Bailey Colorado", "Basalt Colorado", "Bayfield Colorado", "Bennett Colorado", "Berthoud Colorado", "Bethune Colorado", "Black Hawk Colorado", "Boulder Colorado", "Breckenridge Colorado", "Briggsdale Colorado", "Brighton Colorado", "Broomfield Colorado", "Brush Colorado", "Buena Vista Colorado", "Buffalo Creek Colorado", "Burlington Colorado", "Byers Colorado", "Calhan Colorado", "Campo Colorado", "Canon City Colorado", "Carbondale Colorado", "Castle Rock Colorado", "Cedaredge Colorado", "Center Colorado", "Central City Colorado", "Cheraw Colorado", "Cheyenne Wells Colorado", "Clifton Colorado", "Coal Creek Colorado", "Collbran Colorado", "Colorado Springs Colorado", "Commerce City Colorado", "Aspen Park Colorado", "Cortez Colorado", "Craig Colorado", "Crawford Colorado", "Creede Colorado", "Crested Butte Colorado", "Cripple Creek Colorado", "Dacono Colorado", "De Beque Colorado", "Deer Trail Colorado", "Del Norte Colorado", "Delta Colorado", "Denver Colorado", "Dillon Colorado", "Dinosaur Colorado", "Divide Colorado", "Dolores Colorado", "Dove Creek Colorado", "Dupont Colorado", "Durango Colorado", "Eagle Colorado", "Eaton Colorado", "Edwards Colorado", "Elbert Colorado", "Eldorado Springs Colorado", "Elizabeth Colorado", "Empire Colorado", "Englewood Colorado", "Erie Colorado", "Estes Park Colorado", "Evergreen Colorado", "Fairplay Colorado", "Firestone Colorado", "Fleming Colorado", "Florence Colorado", "Florissant Colorado", "Fountain Colorado", "Franktown Colorado", "Frederick Colorado", "Frisco Colorado", "Fruita Colorado", "Fort Collins Colorado", "Fort Lupton Colorado", "Fort Morgan Colorado", "Georgetown Colorado", "Gilcrest Colorado", "Glen Haven Colorado", "Glenwood Springs Colorado", "Golden Colorado", "Granby Colorado", "Grand Junction Colorado", "Grand Lake Colorado", "Grant Colorado", "Greeley Colorado", "Grover Colorado", "Guffey Colorado", "Gunnison Colorado", "Gypsum Colorado", "Hartman Colorado", "Haxtun Colorado", "Hayden Colorado", "Henderson Colorado", "Holyoke Colorado", "Hot Sulphur Springs Colorado", "Hotchkiss Colorado", "Hudson Colorado", "Hugo Colorado", "Hygiene Colorado", "Idaho Springs Colorado", "Idledale Colorado", "Ignacio Colorado", "Indian Hills Colorado", "Jamestown Colorado", "Jefferson Colorado", "Joes Colorado", "Johnstown Colorado", "Julesburg Colorado", "Keenesburg Colorado", "Kersey Colorado", "Kiowa Colorado", "Kittredge Colorado", "Kremmling Colorado", "La Jara Colorado", "La Junta Colorado", "La Salle Colorado", "Lafayette Colorado", "Lamar Colorado", "Laporte Colorado", "Larkspur Colorado", "Las Animas Colorado", "Leadville Colorado", "Limon Colorado", "Littleton Colorado", "Livermore Colorado", "Longmont Colorado", "Louisville Colorado", "Louviers Colorado", "Loveland Colorado", "Lyons Colorado", "Mancos Colorado", "Manitou Springs Colorado", "Mead Colorado", "Meeker Colorado", "Merino Colorado", "Mesa Colorado", "Minturn Colorado", "Moffat Colorado", "Monte Vista Colorado", "Montrose Colorado", "Monument Colorado", "Morrison Colorado", "Nederland Colorado", "New Castle Colorado", "Raymer Colorado", "Niwot Colorado", "Nucla Colorado", "Nunn Colorado", "Oak Creek Colorado", "Otis Colorado", "Ouray Colorado", "Ovid Colorado", "Pagosa Springs Colorado", "Palmer Lake Colorado", "Paonia Colorado", "Parachute Colorado", "Parker Colorado", "Peetz Colorado", "Penrose Colorado", "Peyton Colorado", "Pine Colorado", "Pinecliffe Colorado", "Pitkin Colorado", "Platteville Colorado", "Pleasant View Colorado", "Pueblo Colorado", "Rangely Colorado", "Red Feather Lakes Colorado", "Ridgway Colorado", "Rifle Colorado", "Rocky Ford Colorado", "Roggen Colorado", "Rye Colorado", "Saguache Colorado", "Salida Colorado", "San Luis Colorado", "Sanford Colorado", "Sedalia Colorado", "Shawnee Colorado", "Silt Colorado", "Silver Plume Colorado", "Silverthorne Colorado", "Silverton Colorado", "Simla Colorado", "Snowmass Colorado", "Somerset Colorado", "Springfield Colorado", "Steamboat Springs Colorado", "Sterling Colorado", "Strasburg Colorado", "Telluride Colorado", "Towaoc Colorado", "Trinidad Colorado", "U.S. Air Force Academy Colorado", "Vail Colorado", "Victor Colorado", "Vilas Colorado", "Walden Colorado", "Walsenburg Colorado", "Ward Colorado", "Weldona Colorado", "Wellington Colorado", "Westcliffe Colorado", "Westminster Colorado", "Wheat Ridge Colorado", "Wiggins Colorado", "Windsor Colorado", "Winter Park Colorado", "Wolcott Colorado", "Woodland Park Colorado", "Woody Creek Colorado", "Wray Colorado", "Yuma Colorado",
  // Connecticut
  "Andover Connecticut", "Ansonia Connecticut", "Ashford Connecticut", "Avon Connecticut", "Barkhamsted Connecticut", "Beacon Falls Connecticut", "Berlin Connecticut", "Bethany Connecticut", "Bethlehem Connecticut", "Bloomfield Connecticut", "Bolton Connecticut", "Bozrah Connecticut", "Branford Connecticut", "Bridgeport Connecticut", "Bridgewater Connecticut", "Bristol Connecticut", "Brookfield Connecticut", "Brooklyn Connecticut", "Burlington Connecticut", "Canaan Connecticut", "Canterbury Connecticut", "Canton Connecticut", "Chaplin Connecticut", "Cheshire Connecticut", "Chester Connecticut", "Clinton Connecticut", "Colebrook Connecticut", "Columbia Connecticut", "Cornwall Connecticut", "Coventry Connecticut", "Cromwell Connecticut", "Danbury Connecticut", "Darien Connecticut", "Derby Connecticut", "East Granby Connecticut", "East Haddam Connecticut", "East Hartford Connecticut", "East Haven Connecticut", "East Lyme Connecticut", "East Windsor Connecticut", "Eastford Connecticut", "Easton Connecticut", "Ellington Connecticut", "Enfield Connecticut", "Essex Connecticut", "Fairfield Connecticut", "Farmington Connecticut", "Georgetown Connecticut", "Glastonbury Connecticut", "Goshen Connecticut", "Granby Connecticut", "Greenwich Connecticut", "Haddam Connecticut", "Hamden Connecticut", "Hampton Connecticut", "Hartford Connecticut", "Harwinton Connecticut", "Hebron Connecticut", "Kent Connecticut", "Killingworth Connecticut", "Lebanon Connecticut", "Ledyard Connecticut", "Marlborough Connecticut", "Meriden Connecticut", "Middlebury Connecticut", "Middlefield Connecticut", "Middletown Connecticut", "Milford Connecticut", "Monroe Connecticut", "Montville Connecticut", "Morris Connecticut", "Naugatuck Connecticut", "New Britain Connecticut", "New Canaan Connecticut", "New Fairfield Connecticut", "New Hartford Connecticut", "New Haven Connecticut", "New London Connecticut", "New Milford Connecticut", "Newington Connecticut", "Norfolk Connecticut", "North Branford Connecticut", "North Haven Connecticut", "North Stonington Connecticut", "Northford Connecticut", "Norwalk Connecticut", "Norwich Connecticut", "Old Lyme Connecticut", "Old Saybrook Connecticut", "Orange Connecticut", "Oxford Connecticut", "Plainfield Connecticut", "Plainville Connecticut", "Plymouth Connecticut", "Pomfret Connecticut", "Preston Connecticut", "Prospect Connecticut", "Putnam Connecticut", "Redding Connecticut", "Ridgefield Connecticut", "Rocky Hill Connecticut", "Roxbury Connecticut", "Salem Connecticut", "Salisbury Connecticut", "Scotland Connecticut", "Seymour Connecticut", "Sharon Connecticut", "Shelton Connecticut", "Sherman Connecticut", "Somers Connecticut", "South Windsor Connecticut", "Southbury Connecticut", "Southington Connecticut", "Stafford Connecticut", "Stamford Connecticut", "Sterling Connecticut", "Stratford Connecticut", "Suffield Connecticut", "Thomaston Connecticut", "Thompson Connecticut", "Tolland Connecticut", "Torrington Connecticut", "Trumbull Connecticut", "Vernon Connecticut", "Voluntown Connecticut", "Washington Connecticut", "Waterbury Connecticut", "Watertown Connecticut", "West Hartford Connecticut", "West Hartland Connecticut", "West Haven Connecticut", "Weston Connecticut", "Westport Connecticut", "Wethersfield Connecticut", "Willington Connecticut", "Wilton Connecticut", "Windham Connecticut", "Windsor Connecticut", "Windsor Locks Connecticut", "Wolcott Connecticut", "Woodbridge Connecticut", "Woodbury Connecticut", "Woodstock Connecticut",
  // Delaware
  "Bear Delaware", "Bethany Beach Delaware", "Bridgeville Delaware", "Cheswold Delaware", "Claymont Delaware", "Clayton Delaware", "Dagsboro Delaware", "Delaware City Delaware", "Delmar Delaware", "Dover Delaware", "Dover Air Force Base Delaware", "Felton Delaware", "Fenwick Island Delaware", "Frederica Delaware", "Georgetown Delaware", "Greenwood Delaware", "Harrington Delaware", "Hartly Delaware", "Hockessin Delaware", "Houston Delaware", "Kenton Delaware", "Laurel Delaware", "Lewes Delaware", "Little Creek Delaware", "Magnolia Delaware", "Middletown Delaware", "Milford Delaware", "Millsboro Delaware", "Milton Delaware", "New Castle Delaware", "Newark Delaware", "Ocean View Delaware", "Odessa Delaware", "Rehoboth Beach Delaware", "Rockland Delaware", "Seaford Delaware", "Selbyville Delaware", "Smyrna Delaware", "Saint Georges Delaware", "Townsend Delaware", "Viola Delaware", "Wilmington Delaware", "Winterthur Delaware", "Woodside Delaware", "Yorklyn Delaware",
  // Florida
  "Alachua Florida", "Altamonte Springs Florida", "Altha Florida", "Anna Maria Florida", "Anthony Florida", "Apalachicola Florida", "Apopka Florida", "Arcadia Florida", "Atlantic Beach Florida", "Auburndale Florida", "Avon Park Florida", "Bartow Florida", "Belle Glade Florida", "Belleview Florida", "Big Pine Key Florida", "Blountstown Florida", "Boca Grande Florida", "Boca Raton Florida", "Bonifay Florida", "Bonita Springs Florida", "Boynton Beach Florida", "Bradenton Florida", "Brandon Florida", "Branford Florida", "Bronson Florida", "Brooksville Florida", "Bunnell Florida", "Bushnell Florida", "Callahan Florida", "Candler Florida", "Cape Canaveral Florida", "Cape Coral Florida", "Casselberry Florida", "Century Florida", "Chattahoochee Florida", "Chiefland Florida", "Chipley Florida", "Clarcona Florida", "Clearwater Florida", "Clermont Florida", "Clewiston Florida", "Cocoa Florida", "Cocoa Beach Florida", "Cottondale Florida", "Crawfordville Florida", "Crescent City Florida", "Crestview Florida", "Cross City Florida", "Crystal River Florida", "Crystal Springs Florida", "Dade City Florida", "Dania Beach Florida", "Davenport Florida", "Daytona Beach Florida", "De Leon Springs Florida", "DeBary Florida", "Deerfield Beach Florida", "DeFuniak Springs Florida", "DeLand Florida", "Delray Beach Florida", "Deltona Florida", "Destin Florida", "Dover Florida", "Dundee Florida", "Dunedin Florida", "Eagle Lake Florida", "Eastpoint Florida", "Eglin Air Force Base Florida", "Elfers Florida", "Ellenton Florida", "Englewood Florida", "Estero Florida", "Eustis Florida", "Fernandina Beach Florida", "Flagler Beach Florida", "Freeport Florida", "Frostproof Florida", "Fruitland Park Florida", "Fort Lauderdale Florida", "Fort Meade Florida", "Fort Myers Florida", "Fort Myers Beach Florida", "Fort Pierce Florida", "Fort Walton Beach Florida", "Gainesville Florida", "Geneva Florida", "Gibsonton Florida", "Glenwood Florida", "Goldenrod Florida", "Graceville Florida", "Graham Florida", "Green Cove Springs Florida", "Groveland Florida", "Gulf Breeze Florida", "Haines City Florida", "Hallandale Beach Florida", "Havana Florida", "Hawthorne Florida", "Hernando Florida", "Hialeah Florida", "High Springs Florida", "Hilliard Florida", "Hobe Sound Florida", "Holiday Florida", "Hollywood Florida", "Homestead Florida", "Homosassa Florida", "Homosassa Springs Florida", "Hudson Florida", "Hurlburt Field Florida", "Immokalee Florida", "Indialantic Florida", "Indian Rocks Beach Florida", "Indiantown Florida", "Inverness Florida", "Islamorada Florida", "Jacksonville Florida", "Jacksonville Beach Florida", "Jasper Florida", "Jay Florida", "Jensen Beach Florida", "Jupiter Florida", "Kenansville Florida", "Key Biscayne Florida", "Key Largo Florida", "Key West Florida", "Keystone Heights Florida", "Kissimmee Florida", "LaBelle Florida", "Lady Lake Florida", "Lake City Florida", "Lake Helen Florida", "Lake Mary Florida", "Lake Placid Florida", "Lake Wales Florida", "Lake Worth Florida", "Lakeland Florida", "Land O' Lakes Florida", "Largo Florida", "Laurel Hill Florida", "Lecanto Florida", "Lee Florida", "Leesburg Florida", "Lehigh Acres Florida", "Live Oak Florida", "Longboat Key Florida", "Longwood Florida", "Loxahatchee Groves Florida", "Lutz Florida", "Lynn Haven Florida", "Macclenny Florida", "Madison Florida", "Maitland Florida", "Malabar Florida", "Marathon Florida", "Marco Island Florida", "Marianna Florida", "Mary Esther Florida", "Mayo Florida", "McDavid Florida", "Melbourne Florida", "Merritt Island Florida", "Mexico Beach Florida", "Miami Florida", "Miami Beach Florida", "Middleburg Florida", "Milton Florida", "Minneola Florida", "Molino Florida", "Monticello Florida", "Montverde Florida", "Mount Dora Florida", "Mount Pleasant Florida", "Mulberry Florida", "Myakka City Florida", "Naples Florida", "Navarre Florida", "Neptune Beach Florida", "New Port Richey Florida", "New Smyrna Beach Florida", "Newberry Florida", "Niceville Florida", "Nokomis Florida", "North Fort Myers Florida", "North Miami Beach Florida", "North Palm Beach Florida", "North Port Florida", "Ocala Florida", "Ocoee Florida", "Odessa Florida", "Okahumpka Florida", "Okeechobee Florida", "Oldsmar Florida", "Opa-locka Florida", "Orange City Florida", "Orange Park Florida", "Orlando Florida", "Ormond Beach Florida", "Osprey Florida", "Oviedo Florida", "Pahokee Florida", "Palatka Florida", "Palm Bay Florida", "Palm Beach Florida", "Palm City Florida", "Palm Coast Florida", "Palm Harbor Florida", "Palmetto Florida", "Panama City Florida", "Panama City Beach Florida", "Patrick Air Force Base Florida", "Pembroke Pines Florida", "Pensacola Florida", "Perry Florida", "Pierson Florida", "Pinellas Park Florida", "Placida Florida", "Plant City Florida", "Plymouth Florida", "Polk City Florida", "Pomona Park Florida", "Pompano Beach Florida", "Ponte Vedra Beach Florida", "Port Charlotte Florida", "Port Orange Florida", "Port Richey Florida", "Port Saint Joe Florida", "Port St. Lucie Florida", "Punta Gorda Florida", "Quincy Florida", "Reddick Florida", "Riverview Florida", "Rockledge Florida", "Safety Harbor Florida", "San Antonio Florida", "Sanford Florida", "Sanibel Florida", "Sarasota Florida", "Satellite Beach Florida", "Sebastian Florida", "Sebring Florida", "Seffner Florida", "Seminole Florida", "Shalimar Florida", "Silver Springs Florida", "Sorrento Florida", "South Bay Florida", "Spring Hill Florida", "St. Augustine Florida", "Saint Cloud Florida", "Saint James City Florida", "St. Petersburg Florida", "Starke Florida", "Stuart Florida", "Summerland Key Florida", "Sun City Florida", "Sunnyside Florida", "Tallahassee Florida", "Tampa Florida", "Tarpon Springs Florida", "Tavares Florida", "Tavernier Florida", "Thonotosassa Florida", "Titusville Florida", "Trenton Florida", "Valparaiso Florida", "Valrico Florida", "Venice Florida", "Venus Florida", "Vero Beach Florida", "Wabasso Florida", "Wauchula Florida", "Wellborn Florida", "West Palm Beach Florida", "Weston Florida", "Wildwood Florida", "Williston Florida", "Wimauma Florida", "Windermere Florida", "Winter Garden Florida", "Winter Haven Florida", "Winter Park Florida", "Winter Springs Florida", "Yulee Florida", "Zellwood Florida", "Zephyrhills Florida"
];

const STATE_NAMES: Record<string, string> = {
  "alabama": "Alabama", "alaska": "Alaska", "arizona": "Arizona", "arkansas": "Arkansas",
  "california": "California", "colorado": "Colorado", "connecticut": "Connecticut", "delaware": "Delaware",
  "florida": "Florida", "georgia": "Georgia", "hawaii": "Hawaii", "idaho": "Idaho",
  "illinois": "Illinois", "indiana": "Indiana", "iowa": "Iowa", "kansas": "Kansas",
  "kentucky": "Kentucky", "louisiana": "Louisiana", "maine": "Maine", "maryland": "Maryland",
  "massachusetts": "Massachusetts", "michigan": "Michigan", "minnesota": "Minnesota", "mississippi": "Mississippi",
  "missouri": "Missouri", "montana": "Montana", "nebraska": "Nebraska", "nevada": "Nevada",
  "new-hampshire": "New Hampshire", "new-jersey": "New Jersey", "new-mexico": "New Mexico", "new-york": "New York",
  "north-carolina": "North Carolina", "north-dakota": "North Dakota", "ohio": "Ohio", "oklahoma": "Oklahoma",
  "oregon": "Oregon", "pennsylvania": "Pennsylvania", "rhode-island": "Rhode Island", "south-carolina": "South Carolina",
  "south-dakota": "South Dakota", "tennessee": "Tennessee", "texas": "Texas", "utah": "Utah",
  "vermont": "Vermont", "virginia": "Virginia", "washington": "Washington", "west-virginia": "West Virginia",
  "wisconsin": "Wisconsin", "wyoming": "Wyoming"
};

const STATE_ABBR_TO_SLUG: Record<string, string> = {
  AL: "alabama", AK: "alaska", AZ: "arizona", AR: "arkansas", CA: "california",
  CO: "colorado", CT: "connecticut", DE: "delaware", FL: "florida", GA: "georgia",
  HI: "hawaii", ID: "idaho", IL: "illinois", IN: "indiana", IA: "iowa",
  KS: "kansas", KY: "kentucky", LA: "louisiana", ME: "maine", MD: "maryland",
  MA: "massachusetts", MI: "michigan", MN: "minnesota", MS: "mississippi", MO: "missouri",
  MT: "montana", NE: "nebraska", NV: "nevada", NH: "new-hampshire", NJ: "new-jersey",
  NM: "new-mexico", NY: "new-york", NC: "north-carolina", ND: "north-dakota", OH: "ohio",
  OK: "oklahoma", OR: "oregon", PA: "pennsylvania", RI: "rhode-island", SC: "south-carolina",
  SD: "south-dakota", TN: "tennessee", TX: "texas", UT: "utah", VT: "vermont",
  VA: "virginia", WA: "washington", WV: "west-virginia", WI: "wisconsin", WY: "wyoming"
};

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let currentValue = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(currentValue.trim());
      currentValue = '';
    } else {
      currentValue += char;
    }
  }
  values.push(currentValue.trim());
  return values;
}

function toTitleCase(str: string): string {
  if (!str) return "";
  return str.toLowerCase().replace(/(?:^|\s|-|\/)\S/g, (m) => m.toUpperCase());
}

async function extractAndSeedAllCities() {
  console.log("🏙️ Extracting All US Cities from CMS Hospitals, FCC Stations & Dog Parks Datasets...");

  const citiesByState: Record<string, Set<string>> = {};
  for (const slug of Object.keys(STATE_NAMES)) {
    citiesByState[slug] = new Set<string>();
  }

  // 0. Parse USER_CITY_LIST
  for (const item of USER_CITY_LIST) {
    for (const [slug, name] of Object.entries(STATE_NAMES)) {
      if (item.toLowerCase().endsWith(name.toLowerCase())) {
        const cityName = item.substring(0, item.length - name.length).trim();
        if (cityName) {
          citiesByState[slug].add(toTitleCase(cityName));
        }
        break;
      }
    }
  }

  // 1. Extract from CMS Hospitals CSV
  const hospitalCsvPath = path.join(process.cwd(), "docs", "hospital_directory.csv");
  if (fs.existsSync(hospitalCsvPath)) {
    const lines = fs.readFileSync(hospitalCsvPath, "utf-8").split("\n");
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      const cols = parseCsvLine(line);
      const rawCity = cols[3];
      const stateAbbr = cols[4];
      const stateSlug = STATE_ABBR_TO_SLUG[stateAbbr];
      if (stateSlug && rawCity) {
        citiesByState[stateSlug].add(toTitleCase(rawCity));
      }
    }
  }

  // 2. Extract from FCC Stations JSON
  const fccJsonPath = path.join(process.cwd(), "docs", "fcc_broadcast_stations.json");
  if (fs.existsSync(fccJsonPath)) {
    const stations = JSON.parse(fs.readFileSync(fccJsonPath, "utf-8"));
    for (const st of stations) {
      const stateSlug = STATE_ABBR_TO_SLUG[st.state];
      if (stateSlug && st.city) {
        citiesByState[stateSlug].add(toTitleCase(st.city));
      }
    }
  }

  // 3. Extract from Dog Parks Dataset JSON
  const dogParksJsonPath = path.join(process.cwd(), "docs", "dog_parks_dataset.json");
  if (fs.existsSync(dogParksJsonPath)) {
    const dataset = JSON.parse(fs.readFileSync(dogParksJsonPath, "utf-8"));
    for (const [stateSlug, parks] of Object.entries(dataset)) {
      if (citiesByState[stateSlug] && Array.isArray(parks)) {
        for (const p of parks) {
          if (p.city) citiesByState[stateSlug].add(toTitleCase(p.city));
        }
      }
    }
  }

  // Connect to DB and seed
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB.");
  const db = mongoose.connection.db!;

  let totalCityDocs = 0;

  for (const [stateSlug, citySet] of Object.entries(citiesByState)) {
    const cityList = Array.from(citySet).sort();
    if (cityList.length === 0) continue;

    console.log(`📍 ${STATE_NAMES[stateSlug]}: Seeding ${cityList.length} cities...`);

    for (const cityName of cityList) {
      const citySlug = cityName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
      if (!citySlug) continue;

      await db.collection("locations").updateOne(
        { slug: citySlug, stateSlug: stateSlug, type: "city" },
        {
          $set: {
            name: cityName,
            slug: citySlug,
            stateSlug: stateSlug,
            type: "city",
            updatedAt: new Date(),
          },
          $setOnInsert: {
            createdAt: new Date(),
          }
        },
        { upsert: true }
      );
      totalCityDocs++;
    }
  }

  console.log(`\n=================================`);
  console.log(`🎉 SUCCESS! Seeded ${totalCityDocs} Total Cities Across 50 US States into MongoDB!`);
  console.log(`=================================\n`);
  process.exit(0);
}

extractAndSeedAllCities().catch(err => {
  console.error(err);
  process.exit(1);
});
