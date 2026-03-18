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

const rawData = `State Flag (1909/1963/1992)
State Seal (1885)
State Motto: Under God the People Rule (1885)
State Nickname: "The Mount Rushmore State"
State Capital: Pierre
State Song: "Hail! South Dakota" (1943)
State Quarter Design: Mount Rushmore (2006)
State Bird: Ring-necked Pheasant (1943)
State Animal: Coyote (1949/1997)
State Fish: Walleye (1982)
State Insect: Honey Bee (1978)
State Butterfly: Mourning Cloak (2009)
State Fossil: Triceratops (1988)
State Flower: American Pasque Flower (1903)
State Tree: Black Hills Spruce (1947)
State Grass: Western Wheatgrass (1970)
State Gemstone: Fairburn Agate (1966)
State Mineral: Rose Quartz (1966)
State Soil: Houdek Soil Series (1990)
State Folk Dance: Square Dance (1989)
State Beverage: Milk (1986)
State Dessert: Kuchen (2000)`;

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
    
    const state = await Location.findOne({ name: 'South Dakota', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated South Dakota with " + facts.length + " extended facts!");
    } else {
        console.log("South Dakota not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "South Dakota",
            slug: "south-dakota",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created South Dakota with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
