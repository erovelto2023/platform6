import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/db/connect";
import Location from "../lib/db/models/Location";

async function check() {
    await connectToDatabase();
    
    console.log("Checking Alabama State...");
    const al = await Location.findOne({ slug: "alabama", type: "state" });
    if (al) {
        console.log(`Newspapers count: ${al.newspapers?.length || 0}`);
        al.newspapers?.forEach((n: any) => console.log(`- ${n.name} (${n.type})`));
    }

    process.exit(0);
}

check();
