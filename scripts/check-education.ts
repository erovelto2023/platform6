import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const LocationSchema = new mongoose.Schema({ name: String, slug: String, type: String, educationalInstitutions: [{ name: String, url: String }] });
const Location = mongoose.models.Location || mongoose.model("Location", LocationSchema);

async function check() {
    await mongoose.connect(process.env.MONGODB_URI!);
    const states = await Location.find({ type: 'state', 'educationalInstitutions.0': { $exists: true } }).select('name educationalInstitutions').lean();
    console.log(`States with educationalInstitutions: ${states.length}`);
    if (states.length > 0) {
        const sample = states[0] as any;
        console.log(`Sample: ${sample.name} — ${sample.educationalInstitutions.length} institutions`);
        console.log(` - First 3: ${sample.educationalInstitutions.slice(0, 3).map((i: any) => i.name).join(', ')}`);
    }
    process.exit(0);
}

check();
