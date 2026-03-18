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
State Seal (1907)
State Motto: Labor Omnia Vincit ("Labor conquers all things") (1907)
State Nickname: "The Sooner State"
State Capital: Oklahoma City
State Colors: Green and White (1915)
State Tartan: Oklahoma Tartan (1999)
State Pin: "OK" Pin (1982)
State Bird: Scissor-tailed Flycatcher (1951)
State Animal/Mammal: American Bison (1972)
State Game Animal: White-tailed Deer (1990)
State Game Bird: Wild Turkey (1990)
State Furbearer: Raccoon (1989)
State Reptile: Collared Lizard / Mountain Boomer (1969)
State Amphibian: Bullfrog (1997)
State Fish: White Bass / Sand Bass (1974)
State Insect: European Honey Bee (1992)
State Butterfly: Black Swallowtail (1996)
State Flying Mammal: Mexican Free-tailed Bat (2006)
State Raptor: Red-tailed Hawk (2018)
State Horse: American Quarter Horse (2022)
State Heritage Horse: Oklahoma Colonial Spanish Horse (2014)
State Pet: Rescue Animals (2021)
State Floral Emblem: Mistletoe (1893)
State Flower: Oklahoma Rose (2004)
State Wildflower: Indian Blanket (1986)
State Tree: Eastern Redbud (1937)
State Grass: Indian Grass (1972)
State Fruit: Strawberry (2005)
State Vegetable: Watermelon (2007)
State Legume: Soybean (2024)
State Fiber: Cotton (2021)
State Fossil: Saurophaganax maximus (2000)
State Dinosaur: Acrocanthosaurus atokensis (2006)
State Rock: Rose Rock / Barite Rose (1968)
State Crystal: Hourglass Selenite (2005)
State Soil: Port Silt Loam (1987)
State Astronomical Object: Rosette Nebula (2019)
State Song / Anthem: "Oklahoma!" (1953)
State Folk Song: "Oklahoma Hills" (2001)
State Country & Western Song: "Faded Love" (1988)
State Waltz: "Oklahoma Wind" (1982)
State Gospel Song: "Swing Low, Sweet Chariot"
State Children's Song: "Oklahoma, My Native Land" (1996)
State Inspirational Song: "I Can Only Imagine" (2018)
State Land Run Song: "The Oklahoma Run" (2009)
State Musical Instrument: Fiddle (1984)
State Percussive Musical Instrument: Drum (1993)
State Folk Dance: Square Dance (1988)
State Western Band: The Sounds of the Southwest (1997)
State Poem: "Howdy Folks" (1941)
State Cartoon Character: GUSTY (2005)
State Language: English
State Beverage: Milk (1985)
State Steak: Ribeye (2019)
State Meal: Chicken-fried steak, barbecued pork, fried okra, squash, cornbread, grits, corn, sausage with biscuits and gravy, black-eyed peas, strawberries, and pecan pie (1988)
State Monument: Golden Driller, Tulsa (1979)`;

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
            const match = line.match(/(State [a-zA-Z\s/0-9&]+) \((.*?)\)/);
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
    
    const state = await Location.findOne({ name: 'Oklahoma', type: 'state' });
    if (state) {
        state.extendedFacts = facts;
        await state.save();
        console.log("Successfully updated Oklahoma with " + facts.length + " extended facts!");
    } else {
        console.log("Oklahoma not found in db. Attempting to create...");
        const newLocation = new Location({
            name: "Oklahoma",
            slug: "oklahoma",
            type: "state",
            extendedFacts: facts
        });
        await newLocation.save();
        console.log("Created Oklahoma with exactly " + facts.length + " facts.");
    }
    
    process.exit(0);
}

seed();
