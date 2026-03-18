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
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const alaskaData = `State Flag (1927)
State Seal (1912/1959)
State Motto: "North to the Future" (1967)
State Capital: Juneau
State Nickname: "The Last Frontier"
State Bird: Willow Ptarmigan (1955)
State Dog: Alaskan Malamute (2010)
State Fish: King Salmon (1962)
State Insect: Four-Spot Skimmer Dragonfly (1995)
State Land Mammal: Moose (1998)
State Marine Mammal: Bowhead Whale (1983)
State Flower: Wild Forget-Me-Not (1917)
State Tree: Sitka Spruce (1962)
State Fossil: Woolly Mammoth (1986)
State Gem: Jade (1968)
State Mineral: Gold (1968)
State Soil: Tanana Soil Series (unofficial)
State Song: "Alaska's Flag" (1955)
State Sport: Dog Mushing (1972)
State Bolt-Action Rifle: Pre-1964 Winchester Model 70 (2014)
State Hostess: Miss Alaska (1970)
State Languages: English + 20 Alaska Native Languages (1998)
State Holidays: Seward's Day & Alaska Day (October 18)`;

async function seed() {
    console.log("Connecting to live database at:", MONGODB_URI?.substring(0, 20) + "...");
    await connectToDatabase();
    
    // Safety check: ensure schema has extendedFacts even if compiled without it
    const facts = [];
    
    for (let line of alaskaData.split('\n')) {
        line = line.trim();
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
    
    const state = await Location.findOne({ name: 'Alaska', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Alaska with " + facts.length + " extended facts in the live database!");
    } else {
        console.log("Alaska not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Alaska",
            slug: "alaska",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Alaska with exactly " + facts.length + " facts.");
    }
    
    console.log("✅ Done! You can now view the live website.");
    process.exit(0);
}

seed();
