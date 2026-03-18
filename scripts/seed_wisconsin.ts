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

const rawData = `State Flag (1913/1981)
State Seal (1849/1881)
State Coat of Arms (1849/1881)
State Motto: Forward (1851)
State Nickname: "The Badger State"
State Capital: Madison
State Song: "On, Wisconsin!" (1959)
State Quarter Design: Badger, cow, round of cheese, and corn (2004)
State Tartan: Wisconsin State Tartan (1997)
State Bird: American Robin (1949)
State Animal: Badger (1957)
State Domesticated Animal: Dairy Cow (1971)
State Wildlife Animal: White-tailed Deer (1957)
State Dog: American Water Spaniel (1985)
State Fish: Muskellunge (1955)
State Insect: Honey Bee (1977)
State Symbol of Peace: Mourning Dove (2023)
State Flower: Wood Violet (1909)
State Tree: Sugar Maple (1949)
State Grain: Corn (1989)
State Fruit: Cranberry (2003)
State Vegetable: Sweet Corn (2023)
State Fossil: Trilobite (1985)
State Mineral: Galena (Lead sulfide) (1971)
State Rock: Red Granite (1971)
State Soil: Antigo Silt Loam (1983)
State Folk Dance: Polka (1993)
State Beverage: Milk (1987)
State Dairy Product: Cheese (2010)
State Pastry: Kringle (2013)
State Ballad: "Oh Wisconsin, Land of My Dreams" (2023)`;

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
    
    const state = await Location.findOne({ name: 'Wisconsin', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Wisconsin with " + facts.length + " extended facts!");
    } else {
        console.log("Wisconsin not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Wisconsin",
            slug: "wisconsin",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Wisconsin with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
