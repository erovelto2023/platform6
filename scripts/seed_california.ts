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

const rawData = `State Flag (1911)
State Seal (1849)
State Motto: Eureka ("I have found it") (1963)
State Nickname: "The Golden State" (1968)
State Capital: Sacramento
State Colors: Blue and Gold (2017)
State Quarter Design: California State Quarter
State Animal: California Grizzly Bear (1958)
State Bird: California Valley Quail (1931)
State Amphibian: California Red-Legged Frog (2014)
State Bat: Pallid Bat (2024)
State Insect: California Dogface Butterfly (1972)
State Reptile: Desert Tortoise (2012)
State Snake: Giant Garter Snake (2025)
State Slug: Banana Slug (Genus Ariolimax) (2024)
State Dinosaur: Augustynolophus morrisi (2017)
State Freshwater Fish: Golden Trout (1947)
State Marine Fish: Garibaldi (2002)
State Marine Mammal: Gray Whale (1975)
State Marine Reptile: Pacific Leatherback Sea Turtle (2012)
State Crustacean: Dungeness Crab (2024)
State Seashell: Black Abalone (2024)
State Flower: California Golden Poppy (1903)
State Tree: California Redwood (Coast Redwood & Giant Sequoia) (1953)
State Grass: Purple Needlegrass (2004)
State Shrub: Bigberry Manzanita (2025)
State Lichen: Lace Lichen (2015)
State Mushroom: California Golden Chanterelle (2023)
State Nuts: Almond, Walnut, Pistachio, and Pecan (2017)
State Fruit: Avocado (2013)
State Vegetable: Artichoke (2013)
State Mineral: Gold (1965)
State Gemstone: Benitoite (1985)
State Rock: Serpentine (1965)
State Fossil: Saber-Toothed Cat (Smilodon californicus) (2017)
State Soil: San Joaquin Soil Series (1997)
State Song: "I Love You, California" (1989)
State Dance: West Coast Swing (1988)
State Folk Dance: Square Dance (1988)
State Fabric: Denim (2016)
State Tartan: California State District Tartan (2001)
State Sport: Surfing (2018)
State Theater: Pasadena Playhouse (1937)
State Outdoor Play: The Ramona Pageant (1993)
State Fife and Drum Band: California Consolidated Drum Band (1997)
State Tall Ship: Californian (2003)
State Prehistoric Artifact: Chipped Stone Bear (1991)
State Pet: A Shelter Pet
State Gold Rush Ghost Town: Bodie (2002)
State Silver Rush Ghost Town: Calico (2005)
State Historical Society: California Historical Society (1979)
State Military Museum: California State Military Museum (2004)
State Vietnam Veterans Memorial: California Vietnam Veterans Memorial (2014)
State LGBTQ Veterans Memorial: Desert Memorial Park, Cathedral City (2018)
State Poet Laureate: Official Position
State Holiday: California Poppy Day`;

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
            const match = line.match(/(State [a-zA-Z\s]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'California', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated California with " + facts.length + " extended facts!");
    } else {
        console.log("California not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "California",
            slug: "california",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created California with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
