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

const rawData = `State Flag (1845)
State Seal (1959)
State Motto: Ua Mau ke Ea o ka ʻĀina i ka Pono ("The life of the land is perpetuated in righteousness") (1959)
State Nickname: "The Aloha State" (1959)
State Capital: Honolulu
State Song: "Hawaiʻi Ponoʻī" (1967)
State Bird: Nēnē / Hawaiian Goose (Branta sandvicensis) (1957)
State Fish: Humuhumunukunukuāpuaʻa / Reef Triggerfish (Rhinecanthus rectangulus) (1985)
State Marine Mammal: Hawaiian Monk Seal (Neomonachus schauinslandi) (2008)
State Land Mammal: Hawaiian Hoary Bat (Lasiurus cinereus semotus) (2024)
State Insect: Pulelehua / Kamehameha Butterfly (Vanessa tameamea) (2009)
State Gem: Black Coral (Antipathes sp.) (1987)
State Flower: Pua ʻŌhiʻa Lehua (Metrosideros polymorpha) (1959)
State Tree: Kukui / Candlenut (Aleurites moluccanus) (1959)
State Dance: Hula (1999)
State Individual Sport: Surfing (1998)
State Team Sport: Outrigger Canoe Paddling (1986)`;

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
    
    const state = await Location.findOne({ name: 'Hawaii', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Hawaii with " + facts.length + " extended facts!");
    } else {
        console.log("Hawaii not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Hawaii",
            slug: "hawaii",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Hawaii with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
