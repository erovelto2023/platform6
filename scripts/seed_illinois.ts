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

const rawData = `State Flag (1969)
State Seal (1867)
State Motto: State Sovereignty, National Union (1818)
State Nickname: "The Prairie State"
State Slogan: "Land of Lincoln" (1955)
State Capital: Springfield
State Language: English
State Quarter Design: Illinois State Quarter
State Animal: White-tailed Deer (1982)
State Bird: Northern Cardinal (1929)
State Fish: Bluegill (1986)
State Insect: Monarch Butterfly (1975)
State Reptile: Painted Turtle (2006)
State Amphibian: Eastern Tiger Salamander (2005)
State Snake: Eastern Milk Snake (2022)
State Horse: Thoroughbred Horse (2006)
State Pet: Shelter Dogs and Shelter Cats (2017)
State Flower: Violet (1908)
State Tree: White Oak (1973)
State Prairie Grass: Big Bluestem (1989)
State Wildflower: Milkweed (2017)
State Fruit: GoldRush Apple (2007)
State Vegetable: Sweet Corn (2015)
State Grain: Corn (2018)
State Mushroom: Giant Puffball (2024)
State Fossil: Tully Monster (1989)
State Mineral: Fluorite (Calcium fluoride) (1965)
State Rock: Dolostone (2022)
State Soil: Drummer Silty Clay Loam (2001)
State Song: "Illinois" (1925)
State Folk Dance: Square Dance (1990)
State Exercise: Cycling (2018)
State Snack Food: Popcorn (2004)
State Pie: Pumpkin Pie (2016)
State Tartan: Illinois Saint Andrew Society Tartan (2012)
State Theater: The Great American People Show (1995)
State Artifact: Pirogue (2017)`;

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
    
    const state = await Location.findOne({ name: 'Illinois', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Illinois with " + facts.length + " extended facts!");
    } else {
        console.log("Illinois not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Illinois",
            slug: "illinois",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Illinois with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
