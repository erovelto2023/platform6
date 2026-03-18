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

const rawData = `State Flag (1913)
State Seal (1864)
State Motto: Regnat Populus ("The People Rule") (1907)
State Nickname: "The Natural State" (1953)
State Capital: Little Rock
State Language: English (1987)
State Creed: The Arkansas Creed
State Quarter Design: Arkansas State Quarter
State Anthem: "Arkansas" by Eva Ware Barnett (1987)
State Historical Song: "The Arkansas Traveler" by Sandford C. Faulkner (1987)
State Song 1: "Arkansas (You Run Deep in Me)" by Wayland Holyfield (1987)
State Song 2: "Oh, Arkansas" by Terry Rose and Gary Klass (1987)
State Musical Instrument: Fiddle (1985)
State Bird: Mockingbird (Mimus polyglottos) (1929)
State Mammal: White-tailed Deer (Odocoileus virginianus) (1993)
State Insect: Honey Bee (Apis mellifera) (1973)
State Butterfly: Diana Fritillary (Speyeria diana) (2007)
State Dinosaur: Arkansaurus fridayi (2019)
State Primitive Fish: Alligator Gar (Atractosteus spatula) (2019)
State Flower: Apple Blossom (Pyrus malus) (1901)
State Tree: Pine (Pinus taeda or Pinus echinata) (1939)
State Fruit & Vegetable: South Arkansas Vine Ripe Pink Tomato (1987)
State Grain: Rice (Oryza sp.) (2007)
State Grape: Cynthiana/Norton Grape (Vitis aestivalis) (2009)
State Nut: Pecan (Carya illinoinensis) (2009)
State Soil: Stuttgart Soil Series (1997)
State Gem: Diamond (1967)
State Mineral: Quartz Crystal (1967)
State Rock: Bauxite (1967)
State Folk Dance: Square Dance (1991)
State Beverage: Milk (1985)
State Firearm: Shotgun (2019)
State Knife: Bowie Knife (2019)
State Historic Cooking Vessel: Dutch Oven (2001)
State Steam Locomotive: Cotton Belt 819 (2021)
State Poet Laureate: Official Position
Northwest Purple Martin Capital: Fort Smith (1993)
Southeast Purple Martin Capital: Lake Village (1993)
Trout Capital: Cotter (1993)
Poultry Capital of the World: Springdale (2013)`;

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
    
    const state = await Location.findOne({ name: 'Arkansas', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Arkansas with " + facts.length + " extended facts!");
    } else {
        console.log("Arkansas not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Arkansas",
            slug: "arkansas",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Arkansas with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
