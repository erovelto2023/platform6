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

const rawData = `State Flag (1925)
State Seal (1912)
State Motto: Crescit eundo ("It grows as it goes") (1882/1920)
State Nickname: "Land of Enchantment" (1999)
State Capital: Santa Fe
State Colors: Red and Yellow (1995)
State Quarter Design: New Mexico State Quarter (2008)
State Tartan: New Mexico State Tartan (1997)
State Bird: Greater Roadrunner (1949)
State Animal: American Black Bear (1963)
State Fish: Rio Grande Cutthroat Trout (1955)
State Insect: Tarantula Hawk Wasp (1989)
State Reptile: New Mexico Whiptail Lizard (2003)
State Amphibian: New Mexico Spadefoot Toad (2003)
State Butterfly: Sandia Hairstreak (2003)
State Fossil/Dinosaur: Coelophysis (1981)
State Flower: Yucca Flower (1927)
State Tree: Piñon Pine (1949)
State Grass: Blue Grama (1973)
State Nut: Piñon Nut (2017)
State Gem: Turquoise (1967)
State Soil: Penistaja Soil Series (1999)
State Song 1: "O Fair New Mexico" (1917)
State Song 2: "New Mexico – Mi Lindo Nuevo México" (1995)
State Ballad: "New Mexico, Mi Lindo Nuevo México" (1995)
State Poem: "A Nuevo Mexico" (1991)
State Folk Dance: Square Dance (1995)
State Cookie: Biscochito (1989)
State Vegetable: Chile and Frijoles (beans) (2013)
State Question: "Red or Green?" (2013)
State Neckwear: Bolo Tie (2007)
State Locket: Turquoise and Silver Locket (2021)
State Railroad: New Mexico Rail Runner Express (2021)
State Air Show: Albuquerque International Balloon Fiesta (2021)`;

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
    
    const state = await Location.findOne({ name: 'New Mexico', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated New Mexico with " + facts.length + " extended facts!");
    } else {
        console.log("New Mexico not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "New Mexico",
            slug: "new-mexico",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created New Mexico with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
