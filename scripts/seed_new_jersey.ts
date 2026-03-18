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

const rawData = `State Flag (1896)
State Seal (1776)
State Coat of Arms (1776/1928)
State Motto: Liberty and Prosperity (1928)
State Nickname: "The Garden State"
State Capital: Trenton
State Quarter Design: Washington crossing the Delaware (1999)
State Bird: Eastern Goldfinch / American Goldfinch (1935)
State Animal: Horse (1977)
State Fish: Brook Trout (1991)
State Insect: Honey Bee (1974)
State Shell: Knobbed Whelk (1995)
State Dinosaur: Hadrosaurus foulkii (1991)
State Amphibian: Northern Pine Barrens Tree Frog (2019)
State Dog: Rescue Dog (2024)
State Flower: Common Blue Violet (1971)
State Tree: Northern Red Oak (1950)
State Fruit: Northern Highbush Blueberry (2004)
State Vegetable: Tomato (2023)
State Herb: Basil (2023)
State Fossil: Hadrosaurus foulkii (1991)
State Soil: Downer Soil Series (1997)
State Folk Dance: Square Dance (1983)
State Tall Ship: A.J. Meerwald (2002)
State Memorial: New Jersey Vietnam Veterans' Memorial (1991)
State Question: "What is the capital of New Jersey?" (2024)`;

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
    
    const state = await Location.findOne({ name: 'New Jersey', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated New Jersey with " + facts.length + " extended facts!");
    } else {
        console.log("New Jersey not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "New Jersey",
            slug: "new-jersey",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created New Jersey with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
