import { config } from "dotenv";
import { resolve } from "path";
config({ path: resolve(process.cwd(), ".env.local") });

import mongoose from "mongoose";

async function inspectPages() {
    try {
        const MONGODB_URI = process.env.MONGODB_URI;
        await mongoose.connect(MONGODB_URI!);
        
        const db = mongoose.connection.db;
        const page = await db.collection("webpages").findOne({});
        console.log("SAMPLE PAGE:", JSON.stringify(page, null, 2));
        
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}

inspectPages();
