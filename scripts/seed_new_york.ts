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

const rawData = `State Flag (1778)
State Seal (1778)
State Coat of Arms (1778)
State Motto: Excelsior ("Ever upward") (1784)
State Nickname: "The Empire State" (1784)
State Slogan: "I Love New York" (1977)
State Capital: Albany
State Quarter Design: Statue of Liberty, Hudson River, Erie Canal (1999)
State Animal: North American Beaver (1975)
State Bird: Eastern Bluebird (1970)
State Dog: Working Dog (2015)
State Reptile: Common Snapping Turtle (2006)
State Freshwater Fish: Brook Trout (1975)
State Saltwater Fish: Striped Bass (2006)
State Insect: Nine-Spotted Ladybug (1989)
State Butterfly: Red-Spotted Purple/White Admiral (2008)
State Flower: Rose (1955)
State Tree: Sugar Maple (1956)
State Bush: Lilac (2006)
State Gemstone: Garnet (1969)
State Fossil: Sea Scorpion / Eurypterus remipes (1984)
State Shell: Bay Scallop (1988)
State Beverage: Milk (1981)
State Fruit: Apple (1976)
State Muffin: Apple Muffin (1987)
State Snack: Yogurt (2014)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'New York', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated New York with " + facts.length + " extended facts!");
    } else {
        console.log("New York not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "New York",
            slug: "new-york",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created New York with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
