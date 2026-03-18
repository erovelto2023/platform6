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

const rawData = `State Flag (1905)
State Seal (1801)
State Motto: Agriculture and Commerce (1987)
State Nicknames: "The Volunteer State", "The Big Bend State"
State Capital: Nashville
State Song 1: "Tennessee Waltz" (1965)
State Quarter Design: Three stars, fiddle, trumpet, and dogwood (2002)
State Bird: Northern Mockingbird (1933)
State Wild Animal: Raccoon (1971)
State Domesticated Animal: Tennessee Walking Horse (2000)
State Game Bird: Bobwhite Quail (1988)
State Reptile: Eastern Box Turtle (1995)
State Amphibian: Tennessee Cave Salamander (2024)
State Fish: Smallmouth Bass (1988)
State Commercial Fish: Channel Catfish (1988)
State Insect: Firefly / Lightning Bug (1975)
State Butterfly: Zebra Swallowtail (1995)
State Wild Flower Pollinator: Seven-Spotted Ladybug (2024)
State Horse: Tennessee Walking Horse (2000)
State Flower: Iris (1933)
State Wildflower: Passion Flower (1919/1973)
State Tree: Tulip Poplar / Yellow Poplar (1947)
State Fruit: Tomato (2003)
State Herb: Parsley (2024)
State Gemstone: Tennessee River Pearl (1979)
State Rock: Limestone (1979)
State Fossil: Pterotrigonia (1998)
State Agricultural Fossil: Woolly Mammoth (2024)
State Sword: Tennessee Cavalry Saber (2024)
State Song 2: "My Homeland, Tennessee" (1925)
State Song 3: "When It's Iris Time in Tennessee" (1935)
State Song 4: "Tennessee" (1955)
State Song 5: "Rocky Top" (1982)
State Song 6: "Tennessee" (1992)
State Song 7: "My Tennessee" (2012)
State Musical Instrument 1: Guitar (1978)
State Musical Instrument 2: Fiddle (1987)
State Musical Instrument 3: Dulcimer (2024)
State Dance: Square Dance (1988)
State Folk Dance: Clogging (2024)
State Beverage: Milk (2009)
State Tartan: Tennessee Tartan (1999)
State Music Style 1: Country Music (1982)
State Music Style 2: Blues Music (2003)
State Music Style 3: Bluegrass Music (2007)
State Music Style 4: Rockabilly Music (2007)
State Music Style 5: Gospel Music (2011)
State Railroad: Nashville, Chattanooga & St. Louis Railway (2024)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9#&]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Tennessee', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Tennessee with " + facts.length + " extended facts!");
    } else {
        console.log("Tennessee not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Tennessee",
            slug: "tennessee",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Tennessee with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
