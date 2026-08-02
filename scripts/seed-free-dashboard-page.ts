import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import connectDB from '../lib/db/connect';
import WebPage from '../lib/db/models/WebPage';

async function seedFreeDashboard() {
    await connectDB();

    const freeDashboardHTML = `
<div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10 font-sans selection:bg-orange-500 selection:text-slate-950">
    <div className="max-w-6xl mx-auto space-y-10">

        {/* HERO WELCOME HEADER */}
        <div className="relative rounded-3xl p-8 md:p-12 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl text-slate-100">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none text-orange-400">
                <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
            </div>

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
                <span className="hidden sm:inline-flex text-xs font-mono text-amber-400 bg-slate-950 px-3 py-1.5 rounded-xl border border-slate-800 font-bold">
                    Official Orientation Video
                </span>
            </div>

            {/* Video Container (Replace src with your YouTube/Vimeo embed URL) */}
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
                            FREE MODULE
                        </span>
                        <h3 className="text-base font-bold text-slate-100">Foundations to Online Business</h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                            Master the core business models, profit calculations, and mindset required to scale an online company.
                        </p>
                    </div>
                    <a href="/catalog" className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-orange-400 transition">
                        Start Course →
                    </a>
                </div>

                {/* Free Course 2 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition">
                    <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                            FREE MODULE
                        </span>
                        <h3 className="text-base font-bold text-slate-100">Product Sourcing & High-Ticket Niches</h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                            Learn how to select profitable product niches and locate reliable wholesale supplier partners.
                        </p>
                    </div>
                    <a href="/catalog" className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-orange-400 transition">
                        Start Course →
                    </a>
                </div>

                {/* Free Course 3 */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between space-y-4 hover:border-orange-500/50 transition">
                    <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-1 rounded-full uppercase">
                            FREE MODULE
                        </span>
                        <h3 className="text-base font-bold text-slate-100">High-Converting Funnels 101</h3>
                        <p className="text-xs font-mono text-slate-400 leading-relaxed">
                            Discover the elements of high-converting sales funnels, offer structures, and landing page designs.
                        </p>
                    </div>
                    <a href="/catalog" className="w-full text-center py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-xl text-xs font-mono font-bold text-orange-400 transition">
                        Start Course →
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

    const existingPage = await WebPage.findOne({ slug: 'free-dashboard' });

    if (existingPage) {
        existingPage.name = 'Free User Dashboard';
        existingPage.isPublished = true;
        existingPage.accessControl = 'free';
        existingPage.sections = [{
            templateId: 'custom-html',
            order: 0,
            content: {},
            style: {},
            customHTML: freeDashboardHTML
        }];
        await existingPage.save();
        console.log('✅ Updated existing "free-dashboard" page in MongoDB');
    } else {
        await WebPage.create({
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
        });
        console.log('✅ Created and published new "free-dashboard" page in MongoDB');
    }

    process.exit(0);
}

seedFreeDashboard();
