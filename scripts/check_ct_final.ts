import mongoose from "mongoose";
import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const LocationSchema = new mongoose.Schema({
    name: String,
    slug: String,
    type: String,
    newspapers: [{
        name: String,
        url: String,
        description: String
    }]
});

const Location = mongoose.models.Location || mongoose.model('Location', LocationSchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    console.log("Checking Connecticut news data...");
    const ct = await Location.findOne({ slug: "connecticut", type: "state" });
    if (ct) {
        console.log(`Newspapers count: ${ct.newspapers.length}`);
        ct.newspapers.forEach((n: any, i: number) => {
            console.log(`${i+1}. ${n.name} -> ${n.url}`);
        });
    } else {
        console.error("Connecticut state record not found.");
    }
    process.exit(0);
}

check();
