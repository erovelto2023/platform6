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

const rawData = `State Flag (1917)
State Seal (1911)
State Motto: Ditat Deus ("God Enriches") (1864)
State Nickname: "The Grand Canyon State"
State Capital: Phoenix
State Colors: Blue and Old Gold (1915)
State Tartan: Arizona District Tartan
State Bird: Cactus Wren (1973)
State Mammal: Ringtail (1986)
State Amphibian: Arizona Tree Frog (1986)
State Reptile: Arizona Ridge-Nosed Rattlesnake (1986)
State Fish: Apache Trout (1986)
State Butterfly: Two-Tailed Swallowtail (2001)
State Dinosaur: Sonorasaurus thompsoni (2018)
State Flower: Saguaro Cactus Blossom (1931)
State Tree: Palo Verde (1954)
State Fossil: Petrified Wood (1988)
State Gemstone: Turquoise (1974)
State Mineral: Wulfenite (2017)
State Metal: Copper (2015)
State Soil: Casa Grande Series (unofficial)
State Neckwear: Bolo Tie (1973)
State Firearm: Colt Single Action Army Revolver (2011)
State Songs: "Arizona March Song" (1919) and "Arizona" (1982)
State Drink: Lemonade (2019)
State Planet: Pluto (2024)`;

async function seed() {
    console.log("Connecting to live database at:", MONGODB_URI?.substring(0, 20) + "...");
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
        }
    }
    
    const state = await Location.findOne({ name: 'Arizona', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Arizona with " + facts.length + " extended facts in the live database!");
    } else {
        console.log("Arizona not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Arizona",
            slug: "arizona",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Arizona with exactly " + facts.length + " facts.");
    }
    
    console.log("✅ Done! You can now view the status.");
    process.exit(0);
}

seed();
