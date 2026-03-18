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

const rawData = `State Flag (1925)
State Seal (1867)
State Motto: Equality Before the Law (1867)
State Nickname: "The Cornhusker State" (1945)
State Capital: Lincoln
State Quarter Design: Chimney Rock (2006)
State Symbol: Covered wagon pulled by oxen (1963)
State Slogan: "Welcome to NEBRASKAland where the West begins" (1963)
State Bird: Western Meadowlark (1929)
State Mammal: White-tailed Deer (1981)
State Fish: Channel Catfish (1997)
State Insect: Honey Bee (1975)
State Reptile: Ornate Box Turtle (2022)
State Migratory Bird: Sandhill Crane (2023)
State Flower: Goldenrod (1895)
State Tree: Cottonwood (1972)
State Grass: Little Bluestem (1969)
State Fossil: Mammoth (1967)
State Gemstone: Blue Agate / Blue Chalcedony (1967)
State Rock: Prairie Agate (1967)
State Soil: Holdrege Series (1979)
State Song: "Beautiful Nebraska" (1967)
State Ballad: "A Place Like Nebraska" (1997)
State Folk Dance: Square Dance (1997)
State Beverage: Milk (1998)
State Soft Drink: Kool-Aid (1998)
State River: Platte River (1998)
State Baseball Capital: St. Paul / Wakefield (1997)
State Village of Lights: Cody (1997)
State Poet Laureate: Official Position (1921)`;

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
    
    const state = await Location.findOne({ name: 'Nebraska', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Nebraska with " + facts.length + " extended facts!");
    } else {
        console.log("Nebraska not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Nebraska",
            slug: "nebraska",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Nebraska with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
