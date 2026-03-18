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
State Seal (1893)
State Motto: Equal Rights (1893)
State Nickname: "The Equality State"
State Capital: Cheyenne
State Song: "Wyoming" (1955)
State Quarter Design: Bucking horse and rider (2007)
State Bird: Western Meadowlark (1927)
State Mammal: American Bison (1985)
State Fish: Cutthroat Trout (1987)
State Reptile: Horned Lizard (2024)
State Dinosaur: Triceratops / Tyrannosaurus rex (2024)
State Fossil: Knightia (Eocene fish) (1987)
State Flower: Indian Paintbrush (1917)
State Tree: Plains Cottonwood (1947)
State Grass: Western Wheatgrass (1995)
State Gemstone: Jade (1967)
State Soil: Forkwood Soil Series (1997)
State Folk Dance: Square Dance (1993)
State Sport: Rodeo (2003)
State Code: Cowboy Code (2024)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9#&()]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Wyoming', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Wyoming with " + facts.length + " extended facts!");
    } else {
        console.log("Wyoming not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Wyoming",
            slug: "wyoming",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Wyoming with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
