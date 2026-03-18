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

const rawData = `State Flag (2003)
State Seal (1798/1914)
State Coat of Arms
State Motto: Wisdom, Justice, and Moderation (1799)
State Nickname: "The Peach State"
State Capital: Atlanta
State Creed: The Georgian's Creed (1939)
State Language: English
State Quarter Design: Georgia State Quarter
State Name Origin: Named for King George II
State Bird: Brown Thrasher (1935/1970)
State Mammal: White-tailed Deer (2015)
State Marine Mammal: North Atlantic Right Whale (1985)
State Reptile: Gopher Tortoise (1989)
State Amphibian: American Green Tree Frog (2005)
State Fish: Largemouth Bass (1970)
State Saltwater Fish: Red Drum (2006)
State Cold Water Game Fish: Southern Appalachian Brook Trout (2006)
State Riverine Sport Fish: Shoal Bass (2020)
State Game Bird: Bobwhite Quail (1970)
State Insect: Honey Bee (1975)
State Butterfly: Eastern Tiger Swallowtail (1988)
State Dog: Adoptable Dog (2016)
State Crustacean: White Shrimp (2024)
State 'Possum: Pogo 'Possum (1992)
State Flower: Cherokee Rose (1916)
State Tree: Southern Live Oak (1937)
State Wildflower: Native Azalea (1979)
State Fruit: Peach (1995)
State Vegetable: Vidalia Sweet Onion (1990)
State Crop: Peanut (1995)
State Nut: Pecan (2021)
State Grape: Muscadine Grape (2021)
State Fossil: Shark Tooth (1976)
State Gem: Quartz (1976)
State Mineral: Staurolite (1976)
State Seashell: Knobbed Whelk (1987)
State Song: "Georgia on My Mind" (1979)
State Waltz: "Our Georgia" (1951)
State Folk Dance: Square Dance (1996)
State Prepared Food: Grits (2002)
State Tartan: Georgia District Tartan (1997)
State Art Museum: Georgia Museum of Art (1982)
State Botanical Garden: State Botanical Garden of Georgia (1984)
State Theater: Springer Opera House, Columbus (1971/1992)
State Ballet Company: Atlanta Ballet (1973)
State Folk Festival: North Georgia Folk Festival (1992)
State Folk Life Play: Swamp Gravy (1994)
State Musical Theatre: Jekyll Island Musical Theatre Festival (1993)
State Historic Drama: The Reach of Song (1990)
State Railroad Museum: Central of Georgia Railroad Shops Complex, Savannah (1996)
State Transportation History Museum: Southeastern Railway Museum (2000)
State Frontier & Indian Center: Funk Heritage Center (2003)
State Civil Rights Museum: Ralph Mark Gilbert Civil Rights Museum (2008)
State Character Education Center: National Museum of the Mighty Eighth Air Force (2005)
State School: Plains High School (1997)
State Poet Laureate: Official Position (1925)
State First Mural City: Colquitt (2006)
State Peanut Monument: Turner County, Ashburn (1998)
State Atlas: The Atlas of Georgia (1985)
State BBQ Cookoff - Beef: Shoot the Bull Barbecue Championship (1997)
State BBQ Cookoff - Pork: Slosheye Trail Big Pig Jig (1997)
State Soap Box Derby: Southeast Georgia Soap Box Derby (2024)`;

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
    
    const state = await Location.findOne({ name: 'Georgia', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Georgia with " + facts.length + " extended facts!");
    } else {
        console.log("Georgia not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Georgia",
            slug: "georgia",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Georgia with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
