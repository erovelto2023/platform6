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

const rawData = `State Flag (1921)
State Seal (1847)
State Motto: Our liberties we prize and our rights we will maintain (1847)
State Nickname: "The Hawkeye State" (1838)
State Capital: Des Moines
State Song: "The Song of Iowa" (1911)
State Quarter Design: Iowa State Quarter
State Bird: American Goldfinch (1933)
State Insect: Honey Bee (1975)
State Flower: Wild Rose (1897)
State Tree: Oak (1961)
State Fossil: Crinoid (sea lily) (2023)
State Rock: Geode (1967)
State Soil: Tama Soil Series (1997)
State Ballad: "Iowa" by Donald Swartz (2024)
State Children's Book: "The Little Engine That Could" (2024)
State Folk Dance: Square Dance (1998)`;

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
    
    const state = await Location.findOne({ name: 'Iowa', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Iowa with " + facts.length + " extended facts!");
    } else {
        console.log("Iowa not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Iowa",
            slug: "iowa",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Iowa with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
