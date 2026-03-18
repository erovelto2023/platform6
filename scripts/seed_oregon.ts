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

const rawData = `State Flag (1925)
State Seal (1859)
State Motto: Alis volat propriis ("She flies with her own wings") (1987)
State Nickname: "The Beaver State"
State Capital: Salem
State Song: "Oregon, My Oregon" (1927)
State Quarter Design: Crater Lake (2005)
State Bird: Western Meadowlark (1927)
State Animal: American Beaver (1969)
State Fish: Chinook Salmon (1961/2023)
State Insect: Oregon Swallowtail Butterfly (1979)
State Crustacean: Dungeness Crab (2009)
State Nutria: Nutria (2023)
State Fossil: Metasequoia / Dawn Redwood (1976)
State Flower: Oregon Grape (1899)
State Tree: Douglas Fir (1939)
State Nut: Hazelnut / Filbert (1989)
State Mushroom: Pacific Golden Chanterelle (1999)
State Berry: Marionberry (2024)
State Rock: Thunderegg (1965)
State Gemstone: Oregon Sunstone (1987)
State Mineral: Sunstone (1987)
State Soil: Jory Soil Series (1997)
State Dance: Square Dance (1977)
State Beverage: Milk (1997)
State Craft: Glass Blowing (2023)
State Hostess: Miss Oregon (1981)
State Microbe: Saccharomyces cerevisiae (Baker's/Brewer's Yeast) (2023)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9&]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Oregon', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Oregon with " + facts.length + " extended facts!");
    } else {
        console.log("Oregon not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Oregon",
            slug: "oregon",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Oregon with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
