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

const rawData = `State Flag (1911/1943)
State Seal (1889)
State Motto: Liberty and Union, Now and Forever, One and Inseparable (1889)
State Nickname: "The Peace Garden State" (1957)
State Capital: Bismarck
State Song: "North Dakota Hymn" (1947)
State Quarter Design: American bison in prairie landscape (2006)
State Bird: Western Meadowlark (1947)
State Mammal: Nokota Horse (1993)
State Fish: Northern Pike (1969)
State Grass: Western Wheatgrass (1977)
State Fossil: Petrified Wood (1967)
State Insect: Convergent Lady Beetle (2011)
State Butterfly: Mourning Cloak (2024)
State Flower: Wild Prairie Rose (1907)
State Tree: American Elm (1947)
State Fruit: Chokecherry (2007)
State Beverage: Milk (1983)
State Soil: Williams Soil Series (2023)
State Gemstone: Fairburn Agate (2025)
State Folk Dance: Square Dance (1995)
State Honor Guard: North Dakota Honor Guard (2023)
State Rodeo: North Dakota State Fair Rodeo (2023)`;

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
    
    const state = await Location.findOne({ name: 'North Dakota', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated North Dakota with " + facts.length + " extended facts!");
    } else {
        console.log("North Dakota not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "North Dakota",
            slug: "north-dakota",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created North Dakota with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
