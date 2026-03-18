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

const rawData = `State Flag (1905)
State Seal (1865/1965)
State Coat of Arms
State Motto: Oro y Plata ("Gold and Silver") (1865)
State Nicknames: "The Treasure State," "Big Sky Country"
State Slogans: "Land of the Shining Mountains," "The Last Best Place"
State Capital: Helena
State Quarter Design: Montana State Quarter (2006)
State Animal: Grizzly Bear (1983)
State Bird: Western Meadowlark (1931)
State Fish: Westslope Cutthroat Trout (1977)
State Butterfly: Mourning Cloak (2001)
State Flower: Bitterroot (1895)
State Tree: Ponderosa Pine (1949)
State Grass: Bluebunch Wheatgrass (1973)
State Fruit: Huckleberry (2023)
State Fossil: Duck-billed Dinosaur / Maiasaura peeblesorum (1985)
State Gemstone 1: Sapphire (1969)
State Gemstone 2: Montana Agate (1969)
State Soil: Scobey Soil Series (1997)
State Song: "Montana" (1945)
State Ballad: "Montana Melody" (1983)
State Lullaby: "Montana Lullaby" (1995)
State Language: English (1995)
State Sport: Rodeo (2025)
State Arboretum: University of Montana Missoula Campus (2009)
State Cowboy Hall of Fame: Montana Cowboy Hall of Fame & Western Heritage Center (2005)
State Medal of Valor: Montana Medal of Valor (2007)`;

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
    
    const state = await Location.findOne({ name: 'Montana', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Montana with " + facts.length + " extended facts!");
    } else {
        console.log("Montana not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Montana",
            slug: "montana",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Montana with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
