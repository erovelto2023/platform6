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

const rawData = `State Flag (1897)
State Seal (1784)
State Coat of Arms (1931)
State Motto: Qui Transtulit Sustinet ("He Who Transplanted Still Sustains") (1897)
State Nickname: "The Constitution State"
State Capital: Hartford
State Animal: Sperm Whale (Physeter macrocephalus) (1975)
State Bird: American Robin (Turdus migratorius) (1943)
State Dog: Siberian Husky (2024)
State Fish: American Shad (Alosa sapidissima) (2003)
State Insect: European Mantis / Praying Mantis (Mantis religiosa) (1977)
State Shellfish: Eastern Oyster (Crassostrea virginica) (1989)
State Dinosaur: Dilophosaurus (2017)
State Flower: Mountain Laurel (Kalmia latifolia) (1907)
State Tree: Charter Oak / White Oak (Quercus alba) (1947)
State Children's Flower: Michaela Petit's Four-O'Clocks (Mirabilis jalapa) (2015)
State Fossil: Eubrontes giganteus (dinosaur track) (1991)
State Mineral: Almandine Garnet (1977)
State Soil: Windsor Series (unofficial)
State Song 1: "Yankee Doodle" (1978)
State Song 2: "Beautiful Connecticut Waltz" (2013)
State Cantata: "The Nutmeg" (2003)
State Polka: Ballroom Polka (2013)
State Folk Dance: Square Dance (1995)
State Tartan: Connecticut State Tartan (1995)
State Candy: Lollipop (2024)
State Food: Pizza (2021)
State Hero: Nathan Hale (1985)
State Heroine: Prudence Crandall (1995)
State Composer: Charles Ives (1991)
State Poet Laureate: Official Position (1985)
State Troubadour: Official Position (1991)
State Aircraft: F4U Corsair (2005)
State Pioneering Aircraft: Gustave Whitehead's No. 21 (2017)
State Ship: USS Nautilus (SSN-571) (1983)
State Flagship & Tall Ship Ambassador: Freedom Schooner Amistad (2003)`;

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
    
    const state = await Location.findOne({ name: 'Connecticut', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Connecticut with " + facts.length + " extended facts!");
    } else {
        console.log("Connecticut not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Connecticut",
            slug: "connecticut",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Connecticut with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
