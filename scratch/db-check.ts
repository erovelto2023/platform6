import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import connectDB from "../lib/db/connect";
import Announcement from "../lib/db/models/Announcement";
import Assignment from "../lib/db/models/Assignment";
import CalendarEvent from "../lib/db/models/CalendarEvent";

async function run() {
    await connectDB();

    const [ann, evt, asg] = await Promise.all([
        Announcement.countDocuments(),
        CalendarEvent.countDocuments(),
        Assignment.countDocuments(),
    ]);

    console.log("=== DB COUNTS ===");
    console.log("Announcements:", ann);
    console.log("CalendarEvents:", evt);
    console.log("Assignments:", asg);

    if (asg > 0) {
        const assignments = await Assignment.find({}).select("title dueDate points").lean();
        console.log("\nAssignments:");
        assignments.forEach((a: any) => console.log(" -", a.title, "| due:", a.dueDate));
    }
    if (ann > 0) {
        const announcements = await Announcement.find({}).select("title createdAt").lean();
        console.log("\nAnnouncements:");
        announcements.forEach((a: any) => console.log(" -", a.title));
    }
    if (evt > 0) {
        const events = await CalendarEvent.find({}).select("title date type").lean();
        console.log("\nEvents:");
        events.forEach((e: any) => console.log(" -", e.title, "|", e.type));
    }

    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
