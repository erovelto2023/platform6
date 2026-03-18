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

const rawData = `State Flag (1929)
State Seal (1863)
State Coat of Arms (1863)
State Motto: Montani Semper Liberi ("Mountaineers are always free") (1863)
State Nickname: "The Mountain State"
State Capital: Charleston
State Song 1: "The West Virginia Hills" (1947)
State Song 2: "This Is My West Virginia" (1963)
State Song 3: "West Virginia, My Home Sweet Home" (1988)
State Quarter Design: New River Gorge Bridge (2005)
State Bird: Northern Cardinal (1949)
State Animal: Black Bear (1995)
State Fish: Brook Trout (1973)
State Insect: Monarch Butterfly (1995)
State Butterfly: Monarch Butterfly (1995)
State Reptile: Timber Rattlesnake (2008)
State Fossil: Megalonyx jeffersonii (Jefferson's Ground Sloth) (2008)
State Gem: Silicified Mississippi Coral (1990)
State Flower: Rhododendron (1903)
State Tree: Sugar Maple (1949)
State Fruit: Golden Delicious Apple (1995)
State Rock: Bituminous Coal (2009)
State Soil: Monongahela Soil Series (1997)
State Folk Dance: Square Dance (1993)
State Colors: Old Gold and Blue (1962)
State Tartan: West Virginia Tartan (1997)`;

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
    
    const state = await Location.findOne({ name: 'West Virginia', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated West Virginia with " + facts.length + " extended facts!");
    } else {
        console.log("West Virginia not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "West Virginia",
            slug: "west-virginia",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created West Virginia with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
