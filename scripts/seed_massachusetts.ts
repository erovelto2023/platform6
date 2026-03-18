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

const rawData = `State Flag (1908)
State Seal (1780)
State Coat of Arms (1775/1780)
State Motto: Ense petit placidam sub libertate quietem ("By the sword we seek peace, but peace only under liberty")
State Nickname: "The Bay State"
State Capital: Boston
State Colors: Blue, Green, and Cranberry (2005)
State Designation for Residents: Bay Staters (1997)
State Quarter Design: The Minuteman
State Bird: Black-Capped Chickadee (1941)
State Cat: Tabby Cat (1988)
State Dog: Boston Terrier (1979)
State Fish: Atlantic Cod (1974)
State Game Bird: Wild Turkey (1991)
State Horse: Morgan Horse (1970)
State Insect: Ladybug (1974)
State Marine Mammal: North Atlantic Right Whale (1980)
State Reptile: Garter Snake (2007)
State Shell: New England Neptune (1987)
State Flower: Mayflower (1918)
State Tree: American Elm (1941)
State Berry: Cranberry (1994)
State Bean: Baked Navy Bean (1993)
State Fossil: Dinosaur Track (1980)
State Dinosaur: Podokesaurus holyokensis (2022)
State Gem: Rhodonite (1979)
State Mineral: Babingtonite (1971)
State Rock: Roxbury Puddingstone (1983)
State Historical Rock: Plymouth Rock (1983)
State Explorer Rock: Dighton Rock (1983)
State Building Stone: Granite (1985)
State Glacial Rock: Rolling Rock (2002)
State Soil: Paxton Soil Series (1990)
State Song: "All Hail to Massachusetts" (1966)
State Folk Song: "Massachusetts" (1981)
State Patriotic Song: "Massachusetts (Because of You Our Land is Free)" (1989)
State Glee Club Song: "The Great State of Massachusetts" (1991)
State Polka: "Say Hello to Someone from Massachusetts" (1991)
State Ceremonial March: "The Road to Boston" (1985)
State Poem: "The Blue Hills of Massachusetts" (1981)
State Ode: "Ode to Massachusetts" (1991)
State Folk Dance: Square Dance (1991)
State Tartan: Bay State Tartan (1997)
State Folk Hero: Johnny Appleseed (1996)
State Heroine: Deborah Sampson (1983)
State Hero: Samuel Whittemore (2002)
State Artist: Norman Rockwell (2008)
State Blues Artist: Taj Mahal (2002)
State Inventor: Benjamin Franklin (2006)
State Children's Author & Illustrator: Dr. Seuss (2002)
State Children's Book: Make Way for Ducklings (2002)
State Beverage: Cranberry Juice (1970)
State Dessert: Boston Cream Pie (1996)
State Cookie: Chocolate Chip Cookie (1997)
State Donut: Boston Cream Donut (2003)
State Muffin: Corn Muffin (1986)
State Sport: Basketball (2006)
State Recreational & Team Sport: Volleyball (2019)
State Groundhog: Ms. G (2021)`;

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
    
    const state = await Location.findOne({ name: 'Massachusetts', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Massachusetts with " + facts.length + " extended facts!");
    } else {
        console.log("Massachusetts not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Massachusetts",
            slug: "massachusetts",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Massachusetts with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
