import connectToDatabase from "../lib/db/connect";
import Location from "../lib/db/models/Location";

async function test() {
    await connectToDatabase();
    const city = await Location.findOne({ slug: "cornettsville", type: "city" });
    console.log("Cornettsville Document:", JSON.stringify(city, null, 2));
    process.exit(0);
}
test();
