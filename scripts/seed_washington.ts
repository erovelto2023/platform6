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

const rawData = `State Flag (1923)
State Seal (1889)
State Motto: Al-ki ("By and by") (1889)
State Nickname: "The Evergreen State"
State Capital: Olympia
State Song: "Washington, My Home" (1959)
State Quarter Design: Mount Rainier and salmon (2007)
State Tartan: Washington State Tartan (1991)
State Bird: American Goldfinch (1951)
State Mammal: Olympic Marmot (2009)
State Fish: Steelhead Trout (1969)
State Insect: Green Darner Dragonfly (1997)
State Amphibian: Pacific Chorus Frog (2007)
State Marine Mammal: Orca / Killer Whale (2005)
State Dance Animal: Appaloosa Horse (1975)
State Fossil: Columbian Mammoth (1998)
State Flower: Coast Rhododendron (1892)
State Tree: Western Hemlock (1947)
State Grass: Bluebunch Wheatgrass (1989)
State Fruit: Apple (1989)
State Vegetable: Walla Walla Sweet Onion (2007)
State Gem: Petrified Wood (1975)
State Soil: Tokul Soil Series (2024)
State Folk Dance: Square Dance (1979)
State Ship: Lady Washington (2007)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9#&()]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Washington', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Washington with " + facts.length + " extended facts!");
    } else {
        console.log("Washington not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Washington",
            slug: "washington",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Washington with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
