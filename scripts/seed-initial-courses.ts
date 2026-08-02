import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import connectDB from '../lib/db/connect';
import Course from '../lib/db/models/Course';
import WebPage from '../lib/db/models/WebPage';

async function seedCourses() {
    await connectDB();

    console.log("Seeding initial courses...");

    let course1 = await Course.findOne({ title: "Foundations to Online Business" });
    if (!course1) {
        course1 = await Course.create({
            title: "Foundations to Online Business",
            slug: "foundations-to-online-business",
            description: "Master the core business models, profit calculations, and mindset required to scale an online company.",
            price: 0,
            isPremium: false,
            isPublished: true,
            modules: [
                {
                    title: "Module 1: Business Fundamentals & Models",
                    lessons: [
                        {
                            title: "Welcome & Course Overview",
                            type: "video",
                            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                            isFreePreview: true
                        },
                        {
                            title: "Calculating Profit Margins & Unit Economics",
                            type: "text",
                            content: "To build a scalable business, you must understand your unit economics. Gross Margin = (Revenue - COGS) / Revenue. Aim for at least a 65% gross margin on digital products and 35%+ on physical products.",
                            isFreePreview: true
                        }
                    ]
                }
            ]
        });
        console.log("Created Free Course 1:", course1._id);
    }

    let course2 = await Course.findOne({ title: "Product Sourcing & High-Ticket Niches" });
    if (!course2) {
        course2 = await Course.create({
            title: "Product Sourcing & High-Ticket Niches",
            slug: "product-sourcing-high-ticket-niches",
            description: "Learn how to select profitable product niches and locate reliable wholesale supplier partners.",
            price: 0,
            isPremium: false,
            isPublished: true,
            modules: [
                {
                    title: "Module 1: Niche Discovery & Supplier Contact",
                    lessons: [
                        {
                            title: "How to Spot High-Ticket Niche Opportunities",
                            type: "video",
                            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                            isFreePreview: true
                        },
                        {
                            title: "Supplier Outreach Email Script",
                            type: "text",
                            content: "Use this template when contacting domestic suppliers: 'Dear [Supplier Name], I am the purchasing manager at [Your Business Name]. We are expanding our catalog in [Niche] and would like to request wholesale terms...'",
                            isFreePreview: true
                        }
                    ]
                }
            ]
        });
        console.log("Created Free Course 2:", course2._id);
    }

    let course3 = await Course.findOne({ title: "High-Converting Funnels 101" });
    if (!course3) {
        course3 = await Course.create({
            title: "High-Converting Funnels 101",
            slug: "high-converting-funnels-101",
            description: "Discover the elements of high-converting sales funnels, offer structures, and landing page designs.",
            price: 0,
            isPremium: false,
            isPublished: true,
            modules: [
                {
                    title: "Module 1: Funnel Blueprints",
                    lessons: [
                        {
                            title: "The 3-Step High-Ticket Sales Funnel Architecture",
                            type: "video",
                            videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                            isFreePreview: true
                        }
                    ]
                }
            ]
        });
        console.log("Created Free Course 3:", course3._id);
    }

    // Now update the free-dashboard page HTML with these exact course URLs!
    const freeDashboardHTML = `
<div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-orange-500 selection:text-slate-950">
    <div className="max-w-6xl mx-auto space-y-10">

        {/* HERO WELCOME HEADER */}
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl text-slate-100">
            <div className="max-w-3xl space-y-4 relative z-10">
                <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-orange-500/20 text-orange-400 border border-orange-500/30">
                    🚀 FREE MEMBER WORKSPACE
                </span>
                <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase">
                    Welcome to <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">K Business Academy</span>
                </h1>
                <p className="text-slate-300 text-sm md:text-base font-mono leading-relaxed">
                    Here is your exclusive free dashboard! Watch the welcome video below to learn how to navigate your workspace, unlock free training courses, and utilize business tools to launch your enterprise.
                </p>
            </div>
        </div>

        {/* WELCOME VIDEO SECTION */}
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                    <h2 className="text-lg md:text-xl font-bold font-mono text-slate-100 flex items-center gap-2">
                        🎬 Welcome & Quick Start Guide
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                        Watch this 3-minute video to get the most out of your free membership.
                    </p>
                </div>
            </div>

            <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-2xl">
                <iframe 
                    className="w-full h-full"
                    src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                    title="K Business Academy Welcome Video"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                ></iframe>
            </div>
        </div>

        {/* FREE STARTER COURSES GRID */}
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                        📚 Your Included Free Courses
                    </h2>
                    <p className="text-xs font-mono text-slate-400 mt-1">Start learning right now with your free tier access.</p>
                </div>
                <a href="/catalog" className="text-xs font-mono font-bold text-orange-400 hover:text-amber-300 transition flex items-center gap-1">
                    Explore All Courses →
                </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Free Course 1 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition">
                    <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                            FREE COURSE
                        </span>
                        <h3 className="text-base font-bold text-slate-100">${course1.title}</h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                            ${course1.description}
                        </p>
                    </div>
                    <a href="/catalog/${course1._id}" className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-orange-400 transition">
                        Take Free Course →
                    </a>
                </div>

                {/* Free Course 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition">
                    <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                            FREE COURSE
                        </span>
                        <h3 className="text-base font-bold text-slate-100">${course2.title}</h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                            ${course2.description}
                        </p>
                    </div>
                    <a href="/catalog/${course2._id}" className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-orange-400 transition">
                        Take Free Course →
                    </a>
                </div>

                {/* Free Course 3 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition">
                    <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                            FREE COURSE
                        </span>
                        <h3 className="text-base font-bold text-slate-100">${course3.title}</h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                            ${course3.description}
                        </p>
                    </div>
                    <a href="/catalog/${course3._id}" className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-orange-400 transition">
                        Take Free Course →
                    </a>
                </div>
            </div>
        </div>

        {/* FREE BUSINESS TOOLS SHOWCASE */}
        <div className="space-y-6">
            <div>
                <h2 className="text-xl font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                    🛠️ Business Tools Included in Free Tier
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">Utilize these powerful web tools directly inside your workspace.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-orange-400 font-bold font-mono">
                        PLR
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">PLR Dissector Tool</h4>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                        Extract, rewrite, and repurpose digital products and PLR content into new offers.
                    </p>
                    <a href="/tools/plr-dissector" className="inline-block text-xs font-mono font-bold text-orange-400 hover:text-amber-300">Open Tool →</a>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold font-mono">
                        DIR
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">Wholesale Directory</h4>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                        Access verified US suppliers, distributors, and drop shippers for your online store.
                    </p>
                    <a href="/tools/wholesale-directory" className="inline-block text-xs font-mono font-bold text-emerald-400 hover:text-emerald-300">Browse Directory →</a>
                </div>

                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
                    <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 font-bold font-mono">
                        AI
                    </div>
                    <h4 className="text-sm font-bold text-slate-100">AI Design Editor</h4>
                    <p className="text-xs font-mono text-slate-400 leading-relaxed">
                        Create high-converting graphics, banners, and social assets for your brand.
                    </p>
                    <a href="/tools/design-editor" className="inline-block text-xs font-mono font-bold text-cyan-400 hover:text-cyan-300">Launch Editor →</a>
                </div>
            </div>
        </div>

        {/* UPGRADE TO STUDENT ALL-ACCESS PASS CTA */}
        <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 text-slate-950 shadow-2xl">
            <div className="max-w-2xl space-y-3">
                <span className="text-[11px] font-mono font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-slate-950/80 text-amber-400">
                    VIP ALL-ACCESS PASS
                </span>
                <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-slate-950">
                    Ready to Unlock All Masterclasses & Automation Suite?
                </h2>
                <p className="text-xs md:text-sm font-mono text-slate-900 font-semibold leading-relaxed">
                    Upgrade to full Student Membership to unlock 50+ masterclasses, Story Hacker AI, Swipe File Vault, Niche Boxes, and 1-on-1 support.
                </p>
                <div className="pt-4">
                    <a href="/my-products" className="inline-flex items-center gap-2 bg-slate-950 hover:bg-slate-900 text-amber-400 font-mono font-black text-xs uppercase tracking-wider px-8 py-3.5 rounded-xl shadow-xl transition">
                        ⚡ Upgrade to Full Student Membership Now
                    </a>
                </div>
            </div>
        </div>

    </div>
</div>
    `;

    await WebPage.findOneAndUpdate(
        { slug: 'free-dashboard' },
        {
            name: 'Free User Dashboard',
            slug: 'free-dashboard',
            isPublished: true,
            accessControl: 'free',
            sections: [{
                templateId: 'custom-html',
                order: 0,
                content: {},
                style: {},
                customHTML: freeDashboardHTML
            }]
        },
        { upsert: true }
    );

    console.log("✅ Successfully seeded initial free courses and linked them to the Free User Dashboard!");
    process.exit(0);
}

seedCourses();
