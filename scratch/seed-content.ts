import * as dotenv from "dotenv";
import * as path from "path";
dotenv.config({ path: path.resolve(__dirname, "../.env.local") });

import connectDB from "../lib/db/connect";
import Announcement from "../lib/db/models/Announcement";
import Assignment from "../lib/db/models/Assignment";
import CalendarEvent from "../lib/db/models/CalendarEvent";

async function run() {
    await connectDB();

    // Delete test artifact
    await Assignment.deleteOne({ title: "Test Schema Save" });
    console.log("Cleaned up test assignment.");

    // Seed a welcome announcement if none exist
    const annCount = await Announcement.countDocuments();
    if (annCount === 0) {
        await Announcement.create({
            title: "Welcome to K Business Academy!",
            content: "We're excited to have you here. This is your go-to hub for building and growing your online business. Check the Assignments tab for your first task and stay tuned for upcoming events and announcements.",
        });
        await Announcement.create({
            title: "📚 Week 1 Curriculum is Live",
            content: "Your Week 1 coursework is now available. Head to the Courses section to begin Module 1: Business Foundations. Complete your first assignment to earn your first 100 points.",
        });
        console.log("Seeded 2 announcements.");
    }

    const evtCount = await CalendarEvent.countDocuments();
    if (evtCount <= 1) {
        await CalendarEvent.create({
            title: "Live Q&A Session — Business Models",
            description: "Join us live to discuss different business models and how to pick the right one for your niche.",
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
            location: "https://zoom.us/j/example",
            type: "live",
        });
        await CalendarEvent.create({
            title: "Workshop: Building Your First Funnel",
            description: "Step-by-step walkthrough of building a high-converting sales funnel from scratch.",
            date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            location: "https://discord.gg/kbacademy",
            type: "workshop",
        });
        console.log("Seeded 2 events.");
    }

    const [ann, evt, asg] = await Promise.all([
        Announcement.countDocuments(),
        CalendarEvent.countDocuments(),
        Assignment.countDocuments(),
    ]);

    console.log("\n=== FINAL COUNTS ===");
    console.log("Announcements:", ann);
    console.log("Events:", evt);
    console.log("Assignments:", asg);

    process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
