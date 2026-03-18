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
State Seal (1776/1931)
State Motto: Live Free or Die (1945)
State Nickname: "The Granite State"
State Capital: Concord
State Song: "Old New Hampshire" (1949)
State Quarter Design: Old Man of the Mountain (2000)
State Bird: Purple Finch (1957)
State Mammal: White-tailed Deer (1983)
State Amphibian: Red-spotted Newt (1985)
State Butterfly: Karner Blue (1992)
State Freshwater Fish: Brook Trout (1994)
State Saltwater Fish: Striped Bass (1994)
State Insect: Ladybug / Lady Beetle (1977)
State Flower: Purple Lilac (1919)
State Tree: White Birch (1947)
State Wildflower: Pink Lady's Slipper (1991)
State Herb: Purple Coneflower (2024)
State Gem: Smoky Quartz (1985)
State Mineral: Beryl (1985)
State Rock: Granite (1985)
State Soil: Scantic Soil Series (1999)
State Folk Dance: Square Dance (1995)
State Tartan: New Hampshire Tartan (1995)
State Sport: Skiing (1998)
State Beverage: Apple Cider (2010)`;

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
    
    const state = await Location.findOne({ name: 'New Hampshire', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated New Hampshire with " + facts.length + " extended facts!");
    } else {
        console.log("New Hampshire not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "New Hampshire",
            slug: "new-hampshire",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created New Hampshire with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
