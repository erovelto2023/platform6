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

const rawData = `State Flag (1885)
State Seal (1871/1983)
State Motto: Esse quam videri ("To be, rather than to seem") (1893)
State Nicknames: "The Old North State," "The Tar Heel State"
State Capital: Raleigh
State Colors: Red and Blue (1945)
State Tartan: Carolina Tartan (1991)
State Quarter Design: Wright Brothers' Flight (1999)
State Bird: Northern Cardinal (1943)
State Mammal: Eastern Gray Squirrel (1969)
State Dog: Plott Hound (1989)
State Horse: Colonial Spanish Mustang (2010)
State Marsupial: Virginia Opossum (2013)
State Reptile: Eastern Box Turtle (1979)
State Amphibian/Frog: Pine Barrens Tree Frog (2013)
State Salamander: Marbled Salamander (2013)
State Insect: Western Honey Bee (1973)
State Butterfly: Eastern Tiger Swallowtail (2012)
State Carnivorous Plant: Venus Flytrap (2005)
State Freshwater Fish: Southern Appalachian Brook Trout (2005)
State Saltwater Fish: Channel Bass / Red Drum (1971)
State Shell: Scotch Bonnet (1965)
State Fossil: Megalodon Shark Teeth (2013)
State Flower: Flowering Dogwood (1941)
State Tree: Pine (Genus Pinus) (1963)
State Wildflower: Carolina Lily (2003)
State Christmas Tree: Fraser Fir (2005)
State Fruit: Scuppernong Grape (2001)
State Red Berry: Strawberry (2001)
State Blue Berry: Blueberry (2001)
State Vegetable: Sweet Potato (1995)
State Mineral: Gold (2011)
State Rock: Granite (1979)
State Precious Stone: Emerald (1973)
State Art Medium: Clay (2013)
State Pottery Birthplace: Seagrove Area (2005)
State Song: "The Old North State" (1927)
State Folk Dance: Clogging (2005)
State Popular Dance: Shag (2005)
State Sport: Stock Car Racing (2011)
State Beverage: Milk (1987)
State Historical Boat: Shad Boat (1987)
State Language: English (1987)
State Folk Art: Whirligigs by Vollis Simpson (2013)
State Theatre: Flat Rock Playhouse (1961)
State Toast: "The Tar Heel Toast" (1957)`;

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
    
    const state = await Location.findOne({ name: 'North Carolina', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated North Carolina with " + facts.length + " extended facts!");
    } else {
        console.log("North Carolina not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "North Carolina",
            slug: "north-carolina",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created North Carolina with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
