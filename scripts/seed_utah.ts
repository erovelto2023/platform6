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

const rawData = `State Flag (2024 redesign)
State Seal (1896)
State Motto: Industry (1896)
State Nickname: "The Beehive State"
State Capital: Salt Lake City
State Song: "Utah, This Is the Place" (2003)
State Quarter Design: Golden Spike and Transcontinental Railroad (2007)
State Bird: California Gull (1955)
State Animal: Rocky Mountain Elk (1971)
State Fish: Bonneville Cutthroat Trout (1997)
State Insect: Honey Bee (1983)
State Butterfly: Western Tiger Swallowtail (2024)
State Reptile: Gila Monster (2024)
State Amphibian: Tiger Salamander (2024)
State Fossil/Dinosaur: Allosaurus (1988)
State Flower: Sego Lily (1911)
State Tree: Blue Spruce / Quaking Aspen (2014)
State Grass: Indian Ricegrass (1990)
State Fruit: Cherry (1997)
State Vegetable: Spanish Sweet Onion (2002)
State Gem: Topaz (1969)
State Rock: Coal (1991)
State Mineral: Copper (1994)
State Fossil Site: Cleveland-Lloyd Dinosaur Quarry (1999)
State Historical Song: "Utah We Love Thee" (1903)
State Folk Dance: Square Dance (1994)
State Cooking Pot: Dutch Oven (1997)
State Star: Dubhe (Alpha Ursae Majoris) (2024)
State Railroad: Transcontinental Railroad (2024)
State Aviation: Wright Flyer Replica (2024)
State Historic Site: Golden Spike National Historical Park (2024)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9&()]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Utah', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Utah with " + facts.length + " extended facts!");
    } else {
        console.log("Utah not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Utah",
            slug: "utah",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Utah with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
