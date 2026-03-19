import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/db/connect";
import Location from "../lib/db/models/Location";

async function check() {
    await connectToDatabase();
    
    console.log("Checking Allegany, NY...");
    const allegany = await Location.findOne({ name: "Allegany", stateSlug: "new-york" });
    if (allegany) {
        console.log(`Newspapers count: ${allegany.newspapers?.length || 0}`);
        allegany.newspapers?.forEach((n: any) => console.log(`- ${n.name} (${n.type})`));
    }
    
    console.log("\nChecking New York State...");
    const ny = await Location.findOne({ slug: "new-york", type: "state" });
    if (ny) {
        console.log(`Newspapers count: ${ny.newspapers?.length || 0}`);
        ny.newspapers?.slice(0, 3).forEach((n: any) => console.log(`- ${n.name} (${n.type})`));
    }

    process.exit(0);
}

check();
