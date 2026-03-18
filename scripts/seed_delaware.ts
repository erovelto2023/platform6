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

const rawData = `State Flag (1913)
State Seal (1777/2004)
State Coat of Arms
State Motto: Liberty and Independence (1847)
State Nicknames: "The First State" (2002), "The Diamond State", "Blue Hen State", "Small Wonder"
State Capital: Dover
State Colors: Colonial Blue and Buff
State Quarter Design: Delaware State Quarter
State License Plate Design
State Bird: Delaware Blue Hen Chicken (1939)
State Animal/Wildlife: Grey Fox (2010)
State Dog: Rescue Dogs (2023)
State Fish: Weakfish (1981)
State Marine Animal: Atlantic Horseshoe Crab (2002)
State Sea Turtle: Loggerhead Sea Turtle (2022)
State Insect/Bug: Ladybug (1974)
State Butterfly: Eastern Tiger Swallowtail (1999)
State Dragonfly: Blue Dasher (2025)
State Macroinvertebrate: Stonefly (2005)
State Migratory Bird: Red Knot (2025)
State Dinosaur: Dryptosauridae (2022)
State Flower: Peach Blossom (1895)
State Tree: American Holly (1939)
State Fruit: Strawberry (2010)
State Herb: Sweet Goldenrod (1996)
State Fossil: Belemnite (1996)
State Mineral: Sillimanite (1977)
State Soil: Greenwich Loam (2000)
State Shell: Channeled Whelk (2014)
State Star: TYC 3429-697-1 "The Delaware Diamond" (2000)
State Song: "Our Delaware" (1925)
State Beverage: Milk (1983)
State Dessert: Peach Pie (2009)
State Cocktail: Orange Crush (2024)
State Dance: Maypole Dancing
State Sport: Bicycling (2014)
State Tall Ship: Kalmar Nyckel (2016)
State Historical Aircraft: Bellanca Cruisair (2019)
State Holiday: Delaware Day (December 7)`;

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
    
    const state = await Location.findOne({ name: 'Delaware', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Delaware with " + facts.length + " extended facts!");
    } else {
        console.log("Delaware not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Delaware",
            slug: "delaware",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Delaware with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
