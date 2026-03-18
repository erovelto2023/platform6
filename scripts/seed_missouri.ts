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
State Seal (1822)
State Motto: Salus Populi Suprema Lex Esto ("Let the welfare of the people be the supreme law") (1822)
State Nickname: "The Show-Me State"
State Capital: Jefferson City
State Quarter Design: Missouri State Quarter (2003)
State Bird: Eastern Bluebird (1927)
State Animal: Missouri Mule (1995)
State Amphibian: American Bullfrog (2005)
State Reptile: Three-Toed Box Turtle (2007)
State Fish: Channel Catfish (1997)
State Aquatic Animal: Paddlefish (2018)
State Game Bird: Bobwhite Quail (1991)
State Insect: Honey Bee (1985)
State Invertebrate: Crayfish (2007)
State Dinosaur: Hypsibema missouriense (2004)
State Endangered Species: Indiana Bat (2007)
State Historical Dog: Cur (2015)
State Wonder Dog: American Pit Bull Terrier (2020)
State Flower: White Hawthorn Blossom (1923)
State Tree: Flowering Dogwood (1955)
State Fruit Tree: Norton/Cynthiana Grape Vine (2003)
State Grape: Norton/Cynthiana (2003)
State Grass: Big Bluestem (2007)
State Tree Nut: Black Walnut (1990)
State Fossil: Crinoid (1989)
State Mineral: Galena (Lead sulfide) (1967)
State Rock: Mozarkite (1967)
State Song: "The Missouri Waltz" (1949)
State Folk Dance: Square Dance (1995)
State Musical Instrument: Fiddle (1987)
State Dessert: Ice Cream Cone (2008)
State Tartan: Missouri Tartan (1997)
State Sport: Basketball (2001)
State Exercise: Walking (2004)
State Rifle: Missouri-Kentucky Rifle (2009)
State Hockey Team: St. Louis Blues (2023)
State Rock Radio Station: KYMO-FM (2021)
State Apple Capital: Washington, MO (2005)
State Purple Martin Capital: Troy, MO (2001)
State Live Entertainment Capital: Branson, MO (1999)
State UFO Capitals: Lebanon & Richland, MO (2009)
State Patriotic Mural City: Jefferson City, MO (2019)
State Monument: Gateway Arch (1968/2018)`;

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
    
    const state = await Location.findOne({ name: 'Missouri', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Missouri with " + facts.length + " extended facts!");
    } else {
        console.log("Missouri not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Missouri",
            slug: "missouri",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Missouri with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
