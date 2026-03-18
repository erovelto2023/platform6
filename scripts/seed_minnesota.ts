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

const rawData = `State Flag (2024)
State Seal (2024 redesign)
State Motto: L'Étoile du Nord ("Star of the North") (1861)
State Nicknames: "Land of 10,000 Lakes," "Gopher State," "North Star State"
State Capital: Saint Paul
State Bird: Common Loon (1961)
State Bee: Rusty Patched Bumblebee (2019)
State Butterfly: Monarch (2000)
State Fish: Walleye (1965)
State Flower: Pink-and-White Lady's Slipper (1967)
State Tree: Norway Pine / Red Pine (1953)
State Fruit: Honeycrisp Apple (2006)
State Grain: Wild Rice (1977)
State Fossil: Giant Beaver (2025)
State Gemstone: Lake Superior Agate (1969)
State Soil: Lester Soil Series (2012)
State Song: "Hail! Minnesota" (1945)
State Sport: Ice Hockey (2009)
State Drink: Milk (1984)
State Muffin: Blueberry Muffin (1988)
State Mushroom: Common Morel (1984)
State Photograph: "Grace" by Eric Enstrom (2002)
State Fire Museum: Bill and Bonnie Daniels Firefighter Hall and Museum (2023)
State Constellation: Ursa Minor / Little Dipper (2025)`;

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
    
    const state = await Location.findOne({ name: 'Minnesota', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Minnesota with " + facts.length + " extended facts!");
    } else {
        console.log("Minnesota not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Minnesota",
            slug: "minnesota",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Minnesota with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
