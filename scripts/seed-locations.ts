import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/db/connect";
import Location from "../lib/db/models/Location";

const states = [
    { name: "Alabama", slug: "alabama" },
    { name: "Alaska", slug: "alaska" },
    { name: "Arizona", slug: "arizona" },
    { name: "Arkansas", slug: "arkansas" },
    { name: "California", slug: "california" },
    { name: "Colorado", slug: "colorado" },
    { name: "Connecticut", slug: "connecticut" },
    { name: "Delaware", slug: "delaware" },
    { name: "Florida", slug: "florida" },
    { name: "Georgia", slug: "georgia" },
    { name: "Hawaii", slug: "hawaii" },
    { name: "Idaho", slug: "idaho" },
    { name: "Illinois", slug: "illinois" },
    { name: "Indiana", slug: "indiana" },
    { name: "Iowa", slug: "iowa" },
    { name: "Kansas", slug: "kansas" },
    { name: "Kentucky", slug: "kentucky" },
    { name: "Louisiana", slug: "louisiana" },
    { name: "Maine", slug: "maine" },
    { name: "Maryland", slug: "maryland" },
    { name: "Massachusetts", slug: "massachusetts" },
    { name: "Michigan", slug: "michigan" },
    { name: "Minnesota", slug: "minnesota" },
    { name: "Mississippi", slug: "mississippi" },
    { name: "Missouri", slug: "missouri" },
    { name: "Montana", slug: "montana" },
    { name: "Nebraska", slug: "nebraska" },
    { name: "Nevada", slug: "nevada" },
    { name: "New Hampshire", slug: "new-hampshire" },
    { name: "New Jersey", slug: "new-jersey" },
    { name: "New Mexico", slug: "new-mexico" },
    { name: "New York", slug: "new-york" },
    { name: "North Carolina", slug: "north-carolina" },
    { name: "North Dakota", slug: "north-dakota" },
    { name: "Ohio", slug: "ohio" },
    { name: "Oklahoma", slug: "oklahoma" },
    { name: "Oregon", slug: "oregon" },
    { name: "Pennsylvania", slug: "pennsylvania" },
    { name: "Rhode Island", slug: "rhode-island" },
    { name: "South Carolina", slug: "south-carolina" },
    { name: "South Dakota", slug: "south-dakota" },
    { name: "Tennessee", slug: "tennessee" },
    { name: "Texas", slug: "texas" },
    { name: "Utah", slug: "utah" },
    { name: "Vermont", slug: "vermont" },
    { name: "Virginia", slug: "virginia" },
    { name: "Washington", slug: "washington" },
    { name: "West Virginia", slug: "west-virginia" },
    { name: "Wisconsin", slug: "wisconsin" },
    { name: "Wyoming", slug: "wyoming" }
];

// A more comprehensive list of major cities (seeding all cities for all states would require a large external JSON fetch, 
// so we'll start with a robust selection and can expand via API later)
const cityData: Record<string, string[]> = {
    "alabama": ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"],
    "alaska": ["Anchorage", "Juneau", "Fairbanks", "Sitka", "Ketchikan"],
    "arizona": ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale", "Glendale"],
    "arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"],
    "california": ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Fresno", "Sacramento", "Long Beach", "Oakland", "Bakersfield", "Anaheim"],
    "colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Lakewood", "Pueblo"],
    "connecticut": ["Bridgeport", "New Haven", "Stamford", "Hartford", "Waterbury"],
    "delaware": ["Wilmington", "Dover", "Newark", "Middletown", "Smyrna"],
    "florida": ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg", "Hialeah", "Tallahassee", "Fort Lauderdale"],
    "georgia": ["Atlanta", "Columbus", "Augusta", "Macon", "Savannah", "Athens"],
    "hawaii": ["Honolulu", "Pearl City", "Hilo", "Kailua", "Waipahu"],
    "idaho": ["Boise", "Meridian", "Nampa", "Idaho Falls", "Pocatello"],
    "illinois": ["Chicago", "Aurora", "Rockford", "Joliet", "Naperville", "Springfield"],
    "indiana": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"],
    "iowa": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"],
    "kansas": ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"],
    "kentucky": ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"],
    "louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Metairie", "Lafayette"],
    "maine": ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"],
    "maryland": ["Baltimore", "Columbia", "Germantown", "Silver Spring", "Waldorf"],
    "massachusetts": ["Boston", "Worcester", "Springfield", "Lowell", "Cambridge"],
    "michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor", "Lansing"],
    "minnesota": ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"],
    "mississippi": ["Jackson", "Gulfport", "Southaven", "Hattiesburg", "Biloxi"],
    "missouri": ["Kansas City", "St. Louis", "Springfield", "Independence", "Columbia"],
    "montana": ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"],
    "nebraska": ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"],
    "nevada": ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"],
    "new-hampshire": ["Manchester", "Nashua", "Concord", "Derry", "Dover"],
    "new-jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth", "Lakewood", "Edison"],
    "new-mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"],
    "new-york": ["New York City", "Buffalo", "Rochester", "Yonkers", "Syracuse", "Albany"],
    "north-carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem", "Fayetteville"],
    "north-dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot", "West Fargo"],
    "ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo", "Akron", "Dayton"],
    "oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow", "Edmond"],
    "oregon": ["Portland", "Salem", "Eugene", "Gresham", "Hillsboro"],
    "pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie", "Reading"],
    "rhode-island": ["Providence", "Warwick", "Cranston", "Pawtucket", "East Providence"],
    "south-carolina": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant", "Rock Hill"],
    "south-dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings", "Watertown"],
    "tennessee": ["Nashville", "Memphis", "Knoxville", "Chattanooga", "Clarksville"],
    "texas": ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth", "El Paso", "Arlington", "Corpus Christi", "Plano", "Laredo"],
    "utah": ["Salt Lake City", "West Valley City", "Provo", "West Jordan", "Orem"],
    "vermont": ["Burlington", "South Burlington", "Rutland", "Essex Junction", "Bennington"],
    "virginia": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond", "Newport News", "Alexandria"],
    "washington": ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue", "Kent"],
    "west-virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg", "Wheeling"],
    "wisconsin": ["Milwaukee", "Madison", "Green Bay", "Kenosha", "Racine"],
    "wyoming": ["Cheyenne", "Casper", "Laramie", "Gillette", "Rock Springs"]
};

async function seed() {
    try {
        await connectToDatabase();
        
        console.log("Cleaning existing locations...");
        await Location.deleteMany({});
        
        console.log("Seeding states...");
        const stateDocs = states.map(s => ({
            ...s,
            type: 'state',
            metaTitle: `${s.name} Business Directory | K Business Academy`,
            metaDescription: `Find business opportunities and local resources in ${s.name}.`
        }));
        await Location.insertMany(stateDocs);
        
        console.log("Seeding cities...");
        const cityDocs: any[] = [];
        const { slugify } = await import('@/lib/utils/slugify');

        for (const [stateSlug, cities] of Object.entries(cityData)) {
            cities.forEach(cityName => {
                cityDocs.push({
                    name: cityName,
                    slug: slugify(cityName),
                    stateSlug: stateSlug,
                    type: 'city',
                    metaTitle: `${cityName}, ${stateSlug.charAt(0).toUpperCase() + stateSlug.slice(1)} Opportunities`,
                    metaDescription: `Discover niche business ideas and local resources in ${cityName}.`
                });
            });
        }
        
        await Location.insertMany(cityDocs);
        
        console.log(`Seeding complete! Added ${states.length} states and ${cityDocs.length} cities.`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding failed:", error);
        process.exit(1);
    }
}

seed();
