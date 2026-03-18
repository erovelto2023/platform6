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

const rawData = `State Flag (1927)
State Seal (1861)
State Motto: Ad astra per aspera ("To the stars through difficulties")
State Nickname: "The Sunflower State"
State Capital: Topeka
State Banner (1925)
State Quarter Design: Buffalo and Sunflower
State Language: English
State Animal: American Buffalo / Bison (1955)
State Bird: Western Meadowlark (1937)
State Insect: Honey Bee (1976)
State Reptile: Ornate Box Turtle (1986)
State Amphibian: Barred Tiger Salamander (1994)
State Fish: Channel Catfish (2018)
State Flower: Wild Native Sunflower (1903)
State Tree: Eastern Cottonwood (1937)
State Grass: Little Bluestem (2010)
State Fruit: Sandhill Plum (2022)
State Red Wine Grape: Chambourcin (2019)
State White Wine Grape: Vignoles (2019)
State Soil: Harney Silt Loam (1990)
State Rock: Greenhorn Limestone (2018)
State Mineral: Galena (2018)
State Gemstone: Jelinite (fossilized amber) (2018)
State Marine Fossil: Tylosaurus (2014)
State Flying Fossil: Pteranodon (2014)
State Land Fossil: Silvisaurus condrayi (2023)
State Song: "Home on the Range" (1947)
State Marches: "The Kansas March" and "Here's Kansas" (1935, 1992)`;

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
    
    const state = await Location.findOne({ name: 'Kansas', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Kansas with " + facts.length + " extended facts!");
    } else {
        console.log("Kansas not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Kansas",
            slug: "kansas",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Kansas with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
