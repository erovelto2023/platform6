import * as dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });
import connectToDatabase from "../lib/db/connect";
import Location from "../lib/db/models/Location";

async function check() {
    await connectToDatabase();
    const ny = await Location.findOne({ slug: "new-york", type: "state" });
    if (ny) {
        console.log("NY NEWS:", ny.newspapers?.map(n => n.name));
    }
    process.exit(0);
}

check();
