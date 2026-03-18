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

const rawData = `State Flag (1907)
State Seal (1791)
State Coat of Arms (1791)
State Motto: Virtue, Liberty, and Independence (1875)
State Nickname: "The Keystone State"
State Capital: Harrisburg
State Song: "Pennsylvania" (1990)
State Quarter Design: Keystone, Commonwealth statue, and state outline (1999)
State Steam Locomotive: K4s Pacific #1361 (1987)
State Electric Locomotive: GG1 #4859 (1987)
State Railroad: Pennsylvania Railroad
State Bird: Ruffed Grouse (1931)
State Animal: White-tailed Deer (1959)
State Dog: Great Dane (1965)
State Fish: Brook Trout (1970)
State Insect: Firefly / Lightning Bug (1974)
State Fossil: Phacops rana (trilobite) (1988)
State Flower: Mountain Laurel (1933)
State Tree: Eastern Hemlock (1931)
State Beauty Flower: Penngift Crownvetch (1982)
State Mineral: Iron (2025)
State Rock: Limestone (2025)
State Soil: Hazleton Soil Series (1997)
State Ship: U.S. Brig Niagara (1988)
State Folk Dance: Square Dance (1994)
State Beverage: Milk (1982)
State Cookie: Chocolate Chip Cookie (2024)
State Instrument: Saxophone (2025)
State War Memorial: Pennsylvania Memorial at Gettysburg (1999)
State War Memorial: Pennsylvania World War II Memorial (2002)
State War Memorial: Pennsylvania Korean War Veterans Memorial (2002)
State War Memorial: Pennsylvania Vietnam Veterans Memorial (1993)
State War Memorial: Pennsylvania Memorial for the War on Terrorism (2007)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9#]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Pennsylvania', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Pennsylvania with " + facts.length + " extended facts!");
    } else {
        console.log("Pennsylvania not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Pennsylvania",
            slug: "pennsylvania",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Pennsylvania with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
