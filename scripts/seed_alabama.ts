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
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };

        cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
            return mongoose;
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

const alabamaData = `State Bible (1853)
State Great Seal (1876)
State Flag (1895)
State Coat of Arms (1939)
State Military Crest
State Motto: Audemus jura nostra defendere ("We dare defend our rights") (1939)
State Creed (1939)
State Mascot: Eastern Tiger Swallowtail (1989)
State Bird: Yellowhammer / Northern Flicker (1927)
State Mammal: American Black Bear (2006)
State Marine Mammal: West Indian Manatee (2009)
State Game Bird: Wild Turkey (1980)
State Horse: Racking Horse (1975)
State Amphibian: Red Hills Salamander (2000)
State Reptile: Alabama Red-Bellied Turtle (1990)
State Insect: Monarch Butterfly (1989)
State Butterfly & Mascot: Eastern Tiger Swallowtail (1989)
State Agricultural Insect: Queen Honey Bee (2015)
State Crustacean: Brown Shrimp (2015)
State Freshwater Fish: Largemouth Bass (1975)
State Saltwater Fish: Atlantic Tarpon (1955)
State Flower: Camellia (1959)
State Tree: Southern Longleaf Pine (1949)
State Wildflower: Oak-Leaf Hydrangea (1999)
State Fruit: Blackberry (2004)
State Tree Fruit: Peach (2006)
State Nut: Pecan (1982)
State Vegetable: Sweet Potato (2021)
State Legume: Peanut (2022)
State Native Grass: Little Bluestem (2024)
State Fossil: Basilosaurus cetoides (1984)
State Gemstone: Star Blue Quartz (1990)
State Mineral: Hematite / Red Iron Ore (1967)
State Rock: Marble (1969)
State Shell: Johnstone's Junonia (1990)
State Soil: Bama Soil Series (1997)
State Capital: Montgomery
State Song: "Alabama" (1931)
State Dance: Square Dance (1981)
State Dessert: Lane Cake (2016)
State Cookie: Yellowhammer Cookie (2023)
State Spirit: Conecuh Ridge Alabama Fine Whiskey (2004)
State Quilt: Pine Burr Quilt (1997)
State Historic Theatre: Alabama Theatre for the Performing Arts (1993)
State Outdoor Drama: The Miracle Worker (1991)
State Outdoor Musical Drama: The Incident at Looney's Tavern (1993)
State Renaissance Faire: Florence Renaissance Faire (1988)
State Poet Laureate: Andrew Glaze
State Literary Capital: Monroeville and Monroe County (1997)
State Agricultural Museum: Dothan Landmark Park (1992)
State Aquarium: Dauphin Island Sea Lab's Alabama Aquarium (2021)
State Barbecue Championship: Christmas on the River Barbeque Cookoff (1991)
State Horse Show: Alabama Championship Horse Show (1988)
State Horseshoe Tournament: Stockton Fall Horseshoe Tournament (1992)
State Wild & Scenic River: Little River
State Quarter Design: Alabama State Quarter`;

async function seed() {
    console.log("Connecting to live database at:", MONGODB_URI?.substring(0, 20) + "...");
    await connectToDatabase();
    
    // Safety check: ensure schema has extendedFacts even if compiled without it
    const facts = [];
    
    for (let line of alabamaData.split('\\n')) {
        line = line.trim();
        if (!line) continue;
        
        if (line.includes(':')) {
            const parts = line.split(':');
            facts.push({
                label: parts[0].trim(),
                value: parts.slice(1).join(':').trim()
            });
        } else if (line.startsWith('State ')) {
            const match = line.match(/(State [a-zA-Z\\s]+) \\((.*?)\\)/);
            if (match) {
                facts.push({
                    label: match[1].trim(),
                    value: \`Established ${{match[2]}}\`
                });
            } else {
                facts.push({
                    label: line.trim(),
                    value: "Present"
                });
            }
        }
    }
    
    const state = await Location.findOne({ name: 'Alabama', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Alabama with " + facts.length + " extended facts in the live database!");
    } else {
        console.log("Alabama not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Alabama",
            slug: "alabama",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Alabama with exactly " + facts.length + " facts.");
    }
    
    console.log("✅ Done! You can now view the live website.");
    process.exit(0);
}

seed();
