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

const rawData = `State Flag (2021)
State Seal (2014)
State Coat of Arms (2001)
State Motto: Virtute et armis ("By valor and arms")
State Nicknames: "The Magnolia State", "The Hospitality State"
State Capital: Jackson
State Language: English
State Bird: Northern Mockingbird (1944)
State Land Mammal 1: White-tailed Deer (1974)
State Land Mammal 2: Red Fox (1997)
State Water Mammal: Bottlenose Dolphin (1974)
State Reptile: American Alligator (1987)
State Waterfowl: Wood Duck (1974)
State Fish: Largemouth Bass (1974)
State Insect: Western Honey Bee (1980)
State Butterfly: Spicebush Swallowtail (1991)
State Shell: Eastern Oyster (1974)
State Fossil: Prehistoric Whales (Basilosaurus cetoides and Zygorhiza kochii) (1981)
State Flower: Magnolia (1900)
State Tree: Southern Magnolia (1952)
State Fruit: Blueberry (2023)
State Wildflower: Coreopsis (Tickseed)
State Stone: Petrified Wood (1976)
State Gemstone: Mississippi Opal
State Soil: Natchez Silt Loam (2003)
State Song 1: "Go, Mississippi" (1962)
State Song 2: "One Mississippi" by Steve Azar (2022)
State Folk Dance: Square Dance (1995)
State Toy: Teddy Bear (2003)`;

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
    
    const state = await Location.findOne({ name: 'Mississippi', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Mississippi with " + facts.length + " extended facts!");
    } else {
        console.log("Mississippi not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Mississippi",
            slug: "mississippi",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Mississippi with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
