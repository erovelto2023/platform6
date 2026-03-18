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

const rawData = `State Flag (1861/1950)
State Seal (1776)
State Coat of Arms (1776)
State Motto: Sic semper tyrannis (1776)
State Nickname: "The Old Dominion"
State Capital: Richmond
State Song 1: "Our Great Virginia" (1997)
State Song 2: "Sweet Virginia Breeze" (1997)
State Quarter Design: Jamestown settlement ships (2000)
State Dog: American Foxhound (1966)
State Bird: Northern Cardinal (1950)
State Fish: Brook Trout (1993)
State Insect: Tiger Swallowtail Butterfly (1991)
State Butterfly: Tiger Swallowtail (1991)
State Shell: Oyster Shell (1974)
State Fossil: Chesapecten jeffersonius (1993)
State Bat: Virginia Big-Eared Bat (2005)
State Fox: Gray Fox (2024)
State Flower: American Dogwood (1918)
State Tree: Flowering Dogwood (1956)
State Grass: Orchard Grass (2024)
State Rock: Nelsonite (2024)
State Mineral: Amazonite (2024)
State Soil: Pamunkey Soil Series (1997)
State Folk Dance: Square Dance (1991)
State Beverage: Milk (1982)`;

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
    
    const state = await Location.findOne({ name: 'Virginia', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Virginia with " + facts.length + " extended facts!");
    } else {
        console.log("Virginia not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Virginia",
            slug: "virginia",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Virginia with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
