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

const rawData = `State Flag (1902)
State Seal (1803)
State Motto: With God, all things are possible (1959)
State Nickname: "The Buckeye State"
State Capital: Columbus
State Quarter Design: Wright Flyer, astronaut, and state outline (2002)
State Roadway Marker: Ohio Bicentennial Logo (1996)
State Bird: Northern Cardinal (1933)
State Mammal: White-tailed Deer (1988)
State Reptile: Black Racer Snake (1995)
State Insect: Ladybug / Lady Beetle (1975)
State Butterfly: Black Swallowtail (1998)
State Wildflower: Large White Trillium (1986)
State Flower: Scarlet Carnation (1904)
State Tree: Ohio Buckeye (1953)
State Fruit: Pawpaw (2009)
State Herb: Parsley (2009)
State Fossil: Trilobite (1985)
State Gemstone: Ohio Flint (1965)
State Soil: Miamian Soil Series (1997)
State Song: "Beautiful Ohio" (1969)
State Rock Song: "Hang On Sloopy" (1985)
State Folk Dance: Square Dance (1995)
State Beverage: Tomato Juice (1965)`;

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
    
    const state = await Location.findOne({ name: 'Ohio', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Ohio with " + facts.length + " extended facts!");
    } else {
        console.log("Ohio not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Ohio",
            slug: "ohio",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Ohio with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
