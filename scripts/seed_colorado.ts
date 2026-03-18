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

const rawData = `State Flag (1911)
State Seal: Great Seal of Colorado (1861/1877)
State Coat of Arms (1861/1877)
State Motto: Nil sine numine ("Nothing without providence") (1861)
State Nickname: "The Centennial State" (1876)
State Capital: Denver
State Government Logo (2019)
State Slogan: Colorful Colorado (unofficial, 1950)
State Animal: Rocky Mountain Bighorn Sheep (1961)
State Bird: Lark Bunting (1931)
State Amphibian: Western Tiger Salamander (2012)
State Fish: Greenback Cutthroat Trout (1994)
State Reptile: Western Painted Turtle (2008)
State Insect: Colorado Hairstreak Butterfly (1996)
State Cactus: Claret Cup Cactus (2014)
State Grass: Blue Grama Grass (1987)
State Mushroom: Emperor Mushroom (Agaricus julius) (2025)
State Pets: Dogs and Cats from Colorado Shelters & Rescues (2013)
State Flower: Rocky Mountain Columbine (1899)
State Tree: Colorado Blue Spruce (1939)
State Fossil: Stegosaurus (1982)
State Gemstone: Aquamarine (1971)
State Mineral: Rhodochrosite (2002)
State Rock: Yule Marble (2004)
State Soil: Seitz Soil Series (unofficial)
State Folk Dance: Square Dance (1992)
State Song 1: "Where the Columbines Grow" (1915)
State Song 2: "Rocky Mountain High" by John Denver (2007)
State Tartan: Colorado District Tartan (1997)
State Summer Heritage Sport: Pack Burro Racing (2012)
State Winter Sport: Skiing and Snowboarding (2008)
State Museum: History Colorado Center`;

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
            const match = line.match(/(State [a-zA-Z\s]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Colorado', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Colorado with " + facts.length + " extended facts!");
    } else {
        console.log("Colorado not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Colorado",
            slug: "colorado",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Colorado with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
