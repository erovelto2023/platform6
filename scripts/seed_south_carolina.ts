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

const rawData = `State Flag (1861)
State Seal (1776)
State Motto 1: Animis opibusque parati ("Prepared in mind and resources")
State Motto 2: Dum spiro spero ("While I breathe, I hope")
State Nickname: "The Palmetto State"
State Capital: Columbia
State Quarter Design: Palmetto tree, Carolina wren, and yellow jessamine (2000)
State Tartan: South Carolina Tartan (1999)
State Bird: Carolina Wren (1948)
State Animal: White-tailed Deer (1972)
State Dog: Boykin Spaniel (1985)
State Fish: Striped Bass (1972)
State Reptile: Loggerhead Sea Turtle (1988)
State Amphibian: Spotted Salamander (1999)
State Insect: Carolina Mantid (1988)
State Butterfly: Eastern Tiger Swallowtail (1994)
State Shell: Lettuce Olive / Lettuce Conch (1984)
State Spider: Carolina Wolf Spider (2000)
State Flower: Yellow Jessamine (1924)
State Tree: Sabal Palmetto (1939)
State Fruit: Peach (1984)
State Spice: Pepper (2002)
State Herb: Saw Palmetto (2021)
State Grass: Indian Grass (2007)
State Wildflower: Goldenrod (2022)
State Hospitality Plant: Tea (1995)
State Stone: Blue Granite (1969)
State Gem: Amethyst (1969)
State Fossil: Columbian Mammoth (1984)
State Soil: Lynchburg Soil Series (1997)
State Song 1: "Carolina" (1911)
State Song 2: "South Carolina on My Mind" (1984)
State Dance: The Shag (1984)
State Hospitality Beverage: Tea (1995)
State Snack: Boiled Peanuts (2006)
State Picnic Cuisine: Barbecue (2014)
State Theater: Carolina Playhouse (1993)
State Popular Music: "Carolina in My Mind" (2023)`;

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
    
    const state = await Location.findOne({ name: 'South Carolina', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated South Carolina with " + facts.length + " extended facts!");
    } else {
        console.log("South Carolina not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "South Carolina",
            slug: "south-carolina",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created South Carolina with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
