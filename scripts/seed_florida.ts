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

const rawData = `State Flag (1900/1985)
State Seal (1868/1985)
State Motto: In God We Trust (2006)
State Nickname: "The Sunshine State" (1970)
State Capital: Tallahassee
State Day: Pascua Florida Day (April 2) (1953)
State Quarter Design: Florida State Quarter
State Animal: Florida Panther (Puma concolor coryi) (1982)
State Bird: Northern Mockingbird (Mimus polyglottos) (1927)
State Butterfly: Zebra Longwing (Heliconius charithonia) (1996)
State Reptile: American Alligator (Alligator mississippiensis) (1987)
State Saltwater Reptile: Loggerhead Sea Turtle (Caretta caretta) (2008)
State Tortoise: Gopher Tortoise (Gopherus polyphemus) (2008)
State Freshwater Fish: Florida Largemouth Bass (Micropterus salmoides floridanus) (1975)
State Saltwater Fish: Atlantic Sailfish (Istiophorus platypterus) (1975)
State Marine Mammal: Florida Manatee (Trichechus manatus latirostris) (1975)
State Saltwater Mammal: Bottlenose Dolphin/Porpoise (Tursiops truncatus) (1975)
State Shell: Horse Conch (Triplofusus papillosus) (1969)
State Horse: Florida Cracker Horse (2008)
State Heritage Cattle Breed: Florida Cracker Cattle (2018)
State Flower: Orange Blossom (Citrus sinensis) (1909)
State Tree: Sabal Palm (Sabal palmetto) (1953)
State Wildflower: Tickseed / Coreopsis (1991)
State Fruit: Orange (2005)
State Gem: Moonstone (1970)
State Stone: Agatized Coral (1979)
State Soil: Myakka Fine Sand (1989)
State Song: "Old Folks at Home" (Swanee River) (1935/2008)
State Anthem: "Florida (Where the Sawgrass Meets the Sky)" (2008)
State Beverage: Orange Juice (1967)
State Pie: Key Lime Pie (2006)
State Dessert: Strawberry Shortcake (2022)
State Play: Cross and Sword (1973)
State Festival: Calle Ocho-Open House 8 (1980)
State Rodeo: Silver Spurs Rodeo (1994)
State Railroad Museums: Gold Coast Railroad Museum; Florida Gulf Coast Railroad Museum (1984)
State Citrus Archive: Florida Citrus Archives at Florida Southern College (2001)`;

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
    
    const state = await Location.findOne({ name: 'Florida', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Florida with " + facts.length + " extended facts!");
    } else {
        console.log("Florida not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Florida",
            slug: "florida",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Florida with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
