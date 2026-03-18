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

const rawData = `State Flag (1909)
State Seal (1820)
State Motto: Dirigo ("I lead") (1820)
State Nickname: "The Pine Tree State"
State Capital: Augusta
State Song: "State of Maine Song" (1937)
State Poem: "Maine" (1999)
State Quarter Design: Pemaquid Point Lighthouse
State Bird: Black-capped Chickadee (1927)
State Animal: Moose (1979)
State Cat: Maine Coon Cat (1985)
State Fish (Freshwater): Landlocked Salmon (1969)
State Fish (Saltwater): Atlantic Cod (2023)
State Crustacean: American Lobster (1989)
State Insect: Honey Bee (1975)
State Butterfly: Monarch Butterfly (2024)
State Marine Mammal: Harbor Seal (2024)
State Flower: White Pine Cone and Tassel (1895)
State Tree: Eastern White Pine (1945)
State Herb: Wintergreen (1999)
State Berry: Wild Blueberry (2011)
State Treat: Blueberry Pie (2011)
State Fossil: Pertica quadrifaria (1985)
State Gemstone: Tourmaline (1971)
State Mineral: Tourmaline (1971)
State Rock: Granite (1985)
State Soil: Chesuncook Soil Series (1999)
State Folk Dance: Square Dance (1993)
State Soft Drink: Moxie (2005)
State Vessel: Schooner Bowdoin (1987)
State Lighthouse: Portland Head Light (2024)`;

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
    
    const state = await Location.findOne({ name: 'Maine', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Maine with " + facts.length + " extended facts!");
    } else {
        console.log("Maine not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Maine",
            slug: "maine",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Maine with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
