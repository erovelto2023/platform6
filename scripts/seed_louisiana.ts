import "dotenv/config";
import mongoose from "mongoose";
import Location from "../lib/db/models/Location";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Please define the MONGODB_URI environment variable inside .env.local");
    process.exit(1);
}

let cached = (global as any).mongoose;
if (!cached) {
    cached = (global as any).mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = mongoose.connect(MONGODB_URI!, { bufferCommands: false }).then((mongoose) => mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const rawData = `State Flag (1912)
State Seal (1902)
State Motto: "Union, Justice, and Confidence" (1902)
State Nickname: "The Pelican State"
State Slogan: "Feed Your Soul"
State Capital: Baton Rouge
State Colors: Blue, White, Gold (1972)
State Tartan: Louisiana Tartan (2001)
State Cultural Symbol: Fleur-de-lis (2008)
State Pledge: Official oath to the Louisiana flag (1981)
State Bird: Brown Pelican (Pelecanus occidentalis) (1958)
State Mammal: Louisiana Black Bear (Ursus americanus luteolus) (1992)
State Amphibian: Green Tree Frog (Hyla cinerea) (1993)
State Reptile: American Alligator (Alligator mississippiensis) (1983)
State Fish (Freshwater): White Perch / Sac-a-lait (1993)
State Fish (Saltwater): Spotted Sea Trout
State Insect: Honey Bee (Apis mellifera) (1977)
State Butterfly: Gulf Fritillary (Dione vanillae) (2022)
State Crustacean: Crawfish (1983)
State Dog: Catahoula Leopard Dog (1979)
State Flower: Magnolia (Magnolia grandiflora) (1900)
State Tree: Bald Cypress (Taxodium distichum) (1963)
State Wildflower: Louisiana Iris (Iris giganticaerulea) (1990)
State Fruit: Strawberry (Fragaria) (1980)
State Vegetable: Sweet Potato (2003)
State Vegetable Plant: Creole Tomato (2003)
State Fossil: Petrified Palmwood (1976)
State Gemstone: Cabochon Cut Oyster Shell (Crassostrea virginica) (2011)
State Mineral: Agate (2011)
State Song 1: "You Are My Sunshine" (1970)
State Song 2: "Give Me Louisiana" (1970)
State March Song: "Louisiana My Home Sweet Home" (1952)
State Environmental Song: "The Gifts of Earth" (1990)
State Musical Instrument: Cajun Accordion / Diatonic Accordion (1990)
State Folk Dance: Square Dance
State Boat: Pirogue
State Cuisine: Gumbo
State Meat Pie: Natchitoches Meat Pie (2003)
State Doughnut: Beignet
State Jellies: Mayhaw Jelly and Louisiana Sugar Cane Jelly (2003)
State Drink: Milk (1983)
State Painting: "Louisiana"
State Judicial Poem: "America, We The People" (1995)
State Senate Poem: "Leadership" (1999)
State Cultural Poem: "I am Louisiana"
State Natural History Museum: LSU Museum of Natural History`;

async function seed() {
    console.log("Connecting to database...");
    await connectToDatabase();
    
    const facts = [];
    
    for (let line of rawData.split('\n')) {
        line = line.replace(/\[\[\d+\]\]/g, '').replace(/\*/g, '').trim();
        if (line.startsWith('-')) line = line.substring(1).trim();
        if (!line) continue;
        
        if (line.includes(':')) {
            const parts = line.split(':');
            facts.push({
                label: parts[0].trim(),
                value: parts.slice(1).join(':').trim()
            });
        } else if (line.startsWith('State ')) {
            const match = line.match(/(State [a-zA-Z\s/]+) \((.*?)\)/);
            if (match) {
                facts.push({
                    label: match[1].trim(),
                    value: `Established ${match[2]}`
                });
            } else {
                facts.push({
                    label: line.trim(),
                    value: "Present"
                });
            }
        } else {
             facts.push({
                label: "Special Designation",
                value: line.trim()
            });
        }
    }
    
    const state = await Location.findOne({ name: 'Louisiana', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Louisiana with " + facts.length + " extended facts!");
    } else {
        console.log("Louisiana not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Louisiana",
            slug: "louisiana",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Louisiana with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
