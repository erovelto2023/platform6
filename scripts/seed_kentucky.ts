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

const rawData = `State Flag (1928)
State Seal (1792)
State Motto: United We Stand, Divided We Fall (1942)
State Latin Motto: Deo gratiam habeamus ("Let us be grateful to God") (2002)
State Nickname: "The Bluegrass State"
State Slogan: Kentucky Unbridled Spirit (2004)
State Capital: Frankfort
State Language: English (1984)
State Bird: Northern Cardinal (1926)
State Butterfly: Viceroy Butterfly (1990)
State Fish: Kentucky Spotted Bass (2005)
State Horse: Thoroughbred (1996)
State Wild Game Animal: Eastern Gray Squirrel (1968)
State Insect: Honey Bee (2010)
State Flower: Goldenrod (2023)
State Tree: Tulip Poplar / Yellow Poplar (1994)
State Fruit: Blackberry (2004)
State Fossil: Brachiopod (1986)
State Gemstone: Freshwater Pearl (1986)
State Mineral: Coal (1998)
State Rock: Kentucky Agate (2000)
State Soil: Crider Soil Series (1990)
State Song: "My Old Kentucky Home" (1928)
State Bluegrass Song: "Blue Moon of Kentucky" (1988)
State Dance: Clogging (2006)
State Music: Bluegrass Music (2007)
State Musical Instrument: Appalachian Dulcimer (2001)
State Beverage: Milk (2005)
State Soft Drink: Ale-8-One (2013)
State Gun: Kentucky Long Rifle (2013)
State Sports Car: Chevrolet Corvette (2010)
State Silverware Pattern: Old Kentucky Blue Grass-The Georgetown Pattern (1996)`;

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
    
    const state = await Location.findOne({ name: 'Kentucky', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Kentucky with " + facts.length + " extended facts!");
    } else {
        console.log("Kentucky not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Kentucky",
            slug: "kentucky",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Kentucky with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
