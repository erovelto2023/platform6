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
State Seal (1835)
State Coat of Arms (1835/1911)
State Motto: Si quaeris peninsulam amoenam, circumspice ("If you seek a pleasant peninsula, look about you") (1835)
State Nickname: "The Great Lakes State", "The Wolverine State"
State Capital: Lansing
State Song: "My Michigan" (1937)
State Quarter Design: Michigan State Quarter (2004)
State Bird: American Robin (1931)
State Fish: Brook Trout (1965/1988)
State Game Mammal: White-tailed Deer (1997)
State Reptile: Painted Turtle (1995)
State Fossil: Mastodon (2002)
State Flower: Apple Blossom (1897)
State Tree: Eastern White Pine (1955)
State Wildflower: Dwarf Lake Iris (1998)
State Native Grain: Manoomin / Wild Rice (2023)
State Gem: Isle Royale Greenstone / Chlorastrolite (1972)
State Stone: Petoskey Stone (1965)
State Soil: Kalkaska Soil Series (1990)
State Children's Book: "The Legend of Sleeping Bear" (1999)
State Historical Society: Historical Society of Michigan`;

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
    
    const state = await Location.findOne({ name: 'Michigan', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Michigan with " + facts.length + " extended facts!");
    } else {
        console.log("Michigan not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Michigan",
            slug: "michigan",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Michigan with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
