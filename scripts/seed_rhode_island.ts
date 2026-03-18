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

const rawData = `State Flag (1897)
State Seal (1647/1875)
State Motto: Hope (1664)
State Nickname: "The Ocean State" (1971)
State Capital: Providence
State Quarter Design: Pell Bridge and Narragansett Bay (2001)
State Bird: Rhode Island Red Chicken (1954)
State Fish: Striped Bass (2000)
State Shell: Quahog / Hard Clam (1987)
State Flower: Violet (1968)
State Tree: Red Maple (1964)
State Rock: Cumberlandite (1966)
State Mineral: Bowenite (1966)
State Soil: Narragansett Soil Series (1997)
State Drink: Coffee Milk (1993)
State Yacht: Courageous (1987)
State Frigate: USS Providence (1990)
State Ship: Providence (1775)`;

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
    
    const state = await Location.findOne({ name: 'Rhode Island', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Rhode Island with " + facts.length + " extended facts!");
    } else {
        console.log("Rhode Island not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Rhode Island",
            slug: "rhode-island",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Rhode Island with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
