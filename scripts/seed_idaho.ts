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

const rawData = `State Flag (1907/1957)
State Seal (1863/1890)
State Motto: Esto Perpetua ("Let it be perpetual") (1890)
State Nickname: "The Gem State"
State Capital: Boise
State Song: "Here We Have Idaho" (1931)
State Quarter Design: Idaho State Quarter
State Bird: Mountain Bluebird (Sialia currucoides) (1931)
State Horse: Appaloosa (1975)
State Fish: Cutthroat Trout (Oncorhynchus clarkii) (1990)
State Insect: Monarch Butterfly (Danaus plexippus) (1992)
State Raptor: Peregrine Falcon (Falco peregrinus) (2004)
State Amphibian: Tiger Salamander (Ambystoma tigrinum) (2024)
State Fossil: Hagerman Horse (Equus simplicidens) (1988)
State Flower: Syringa / Mock Orange (Philadelphus lewisii) (1931)
State Tree: Western White Pine (Pinus monticola) (1935)
State Grass: Bluebunch Wheatgrass (Pseudoroegneria spicata) (2024)
State Gem: Star Garnet (1967)
State Fruit: Huckleberry (2000)
State Vegetable: Potato (2002)
State Soil: Threebear Soil Series (unofficial)
State Dance: Square Dance (1989)`;

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
    
    const state = await Location.findOne({ name: 'Idaho', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Idaho with " + facts.length + " extended facts!");
    } else {
        console.log("Idaho not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Idaho",
            slug: "idaho",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Idaho with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
