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

const rawData = `State Flag (1839)
State Seal (1845)
State Motto: Friendship (1930)
State Nicknames: "The Lone Star State", "The Friendship State"
State Capital: Austin
State Song: "Texas, Our Texas" (1929)
State Quarter Design: Alamo, Lone Star, and state outline (2004)
State Bird: Northern Mockingbird (1927)
State Mammal (Large): Texas Longhorn (1995)
State Mammal (Small): Nine-Banded Armadillo (1995)
State Mammal (Flying): Mexican Free-Tailed Bat (1995)
State Reptile: Texas Horned Lizard (1993)
State Amphibian: Texas Toad (2023)
State Fish (Freshwater): Guadalupe Bass (1989)
State Fish (Saltwater): Red Drum / Redfish (1993)
State Insect: Monarch Butterfly (1995)
State Spider: Texas Brown Tarantula (2023)
State Dinosaur: Paluxysaurus jonesi / Sauroposeidon (2009)
State Flower: Bluebonnet (1901)
State Tree: Pecan (1919)
State Grass: Sideoats Grama (1971)
State Fruit: Texas Red Grapefruit (1993)
State Vegetable: Texas Sweet Onion (2023)
State Pepper: Jalapeño (1995)
State Herb: Mexican Oregano (2023)
State Native Shrub: Agarito (2023)
State Cactus: Prickly Pear (1995)
State Fiber & Fabric: Cotton (1997)
State Stone: Petrified Palmwood (1969)
State Gem: Texas Blue Topaz (1969)
State Mineral: Silver (2023)
State Metal: Iron (2023)
State Soil: Houston Black Soil Series (2023)
State Fossil: Pleurocoelus / Paluxysaurus (2009)
State Dish: Chili (1977)
State Snack: Tortilla Chips & Salsa (2023)
State Pastry: Sopapilla (2023)
State Pie: Pecan Pie (2013)
State Cookie: Texas Chocolate Chip Cookie (2023)
State Beverage/Soft Drink: Dr Pepper (2023)
State Spirit: Texas Whiskey (2023)
State Cooking Vessel: Dutch Oven (2023)
State Hat: Cowboy Hat (2023)
State Boot: Cowboy Boot (2023)
State Vehicle: Chuck Wagon (2023)
State Ship: USS Texas (BB-35) (1983)
State Tall Ship: Elissa (2023)
State Railroad: Texas State Railroad (2023)
State Airline: Southwest Airlines (2023)
State Aircraft: F-16 Fighting Falcon (2023)
State Spacecraft: Space Shuttle Columbia (2023)
State Sport: Rodeo (1997)
State Sport 2: High School Football (2023)`;

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
    
    const state = await Location.findOne({ name: 'Texas', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Texas with " + facts.length + " extended facts!");
    } else {
        console.log("Texas not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Texas",
            slug: "texas",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Texas with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
