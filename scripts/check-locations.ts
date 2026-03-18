import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/db/connect";
import mongoose from "mongoose";
import Location from "../lib/db/models/Location";

async function check() {
    try {
        await connectToDatabase();
        const stateCount = await Location.countDocuments({ type: 'state' });
        const cityCount = await Location.countDocuments({ type: 'city' });
        const { host, port, name } = mongoose.connection;
        console.log(`Connected to: ${host}:${port}/${name}`);
        console.log(`Verifying: Found ${stateCount} states and ${cityCount} cities.`);
        
        const firstState = await Location.findOne({ type: 'state' });
        if (firstState) {
            console.log("First State Sample:");
            console.log(" - Name:", firstState.name);
            console.log(" - Slug:", firstState.slug);
            console.log(" - Type (RAW):", JSON.stringify(firstState.type));
        } else {
            console.log("WARNING: No document with type 'state' found using .findOne({ type: 'state' })");
            const anyDoc = await Location.findOne();
            if (anyDoc) {
                console.log("Any Doc Sample Type:", JSON.stringify(anyDoc.type));
            }
        }
        process.exit(0);
    } catch (e) {
        console.error("Check failed:", e);
        process.exit(1);
    }
}
check();
