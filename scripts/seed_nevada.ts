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

const rawData = `State Flag (1915/1991)
State Seal (1866)
State Motto: All For Our Country (1866)
State Nickname: "The Silver State"
State Capital: Carson City
State Song: "Home Means Nevada" (1933)
State Quarter Design: Wild mustangs, Lake Tahoe, and silver (2006)
State Bird: Mountain Bluebird (1967)
State Animal: Desert Bighorn Sheep (1973)
State Fish: Lahontan Cutthroat Trout (1981)
State Reptile: Desert Tortoise (1989)
State Fossil: Ichthyosaur (1977)
State Metal: Silver (1977)
State Precious Gemstone: Virgin Valley Black Fire Opal (1987)
State Semi-Precious Gemstone: Turquoise (1987)
State Artifact: Tule Duck Decoy (1995)
State Flower: Sagebrush (1917/1967)
State Tree: Single-Leaf Piñon Pine (1953)
State Grass: Indian Ricegrass (2017)
State Rock: Sandstone (1987)
State Soil: Orovada Series (1993)
State Folk Dance: Square Dance (1991)
State Colors: Silver and Blue (1983)
State Tartan: Nevada State Tartan (1991)
State March: "Nevada State March" (1991)
State Popular Song: "Nevada" (2001)
State Neon Sign: "Welcome to Fabulous Las Vegas Nevada" (2023)`;

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
    
    const state = await Location.findOne({ name: 'Nevada', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Nevada with " + facts.length + " extended facts!");
    } else {
        console.log("Nevada not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Nevada",
            slug: "nevada",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Nevada with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
