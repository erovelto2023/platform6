import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const MONGO_URI = process.env.MONGODB_URI;

async function check() {
    await mongoose.connect(MONGO_URI!);
    const Location = mongoose.model("Location", new mongoose.Schema({ 
        name: String, 
        slug: String, 
        type: String, 
        stateSlug: String,
        areaCodes: [String],
        zipCodes: [String]
    }));
    
    const count = await Location.countDocuments({ type: 'city' });
    console.log(`Total cities in DB: ${count}`);
    
    const stateSample = await Location.findOne({ slug: 'kentucky', type: 'state' });
    console.log("Kentucky State Data:", JSON.stringify({ 
        name: stateSample?.name, 
        areaCodes: stateSample?.areaCodes 
    }, null, 2));
    
    process.exit(0);
}

check();
