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

const rawData = `State Flag (1917/1955)
State Seal (1816)
State Motto: Crossroads of America (1937)
State Nickname: "The Hoosier State"
State Capital: Indianapolis
State Quarter Design: Indiana State Quarter
State Language 1: English (1984)
State Language 2: American Sign Language (1995)
State Bird: Northern Cardinal (1933)
State Insect: Say's Firefly (2018)
State Flower: Peony (1957)
State Tree: Tulip Tree / Yellow Poplar (1931)
State Fossil: Mastodon (2022)
State Stone: Indiana Limestone (1971)
State River: Wabash River (1996)
State Song: "On the Banks of the Wabash, Far Away" (1913)
State Poem: "Indiana" (1963)
State Poet Laureate: Official Position (2005)
State Aircraft: Republic P-47 Thunderbolt Hoosier Spirit II (2015)
State Firearm: Grouseland Rifle (2012)
State Snack: Indiana-Grown Popcorn (2021)
State Pie: Sugar Cream Pie ("Hoosier Pie") (unofficial)
State Soil: Miami Series (unofficial)
State Beverage: Water (unofficial)`;

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
    
    const state = await Location.findOne({ name: 'Indiana', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Indiana with " + facts.length + " extended facts!");
    } else {
        console.log("Indiana not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Indiana",
            slug: "indiana",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Indiana with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
