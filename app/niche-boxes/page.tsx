import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Box, Target, Map, Video, BookOpen, Users, Search, Download,
    CheckCircle2, TrendingUp, Zap
} from "lucide-react";

export default function NicheBoxesPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Navbar */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white">K</div>
                        K Business Academy
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4 text-indigo-600" href="/niche-boxes">
                        Niche Boxes
                    </Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/blog">
                        Blog
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm">Log In</Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="w-full py-16 md:py-24 bg-gradient-to-b from-indigo-50 to-white">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 mb-6">
                            Skip the Guesswork. <br className="hidden md:inline" />
                            Start with a <span className="text-indigo-600">Proven Foundation</span>.
                        </h1>
                        <p className="mx-auto max-w-3xl text-lg text-slate-600 mb-8 leading-relaxed">
                            Niche Business in a Box: Turnkey Online Business Blueprints You Can Actually Use. <br />
                            Instead of starting from a blank page, start with a fully researched, structured business foundation.
                        </p>
                    </div>
                </section>

                {/* What Is It */}
                <section className="w-full py-16 bg-white">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <div>
                                <h2 className="text-3xl font-bold mb-6">What Is a Niche Business in a Box?</h2>
                                <p className="text-slate-600 mb-6">
                                    A Niche Business in a Box is a complete, done-for-you business blueprint built around a specific niche market.
                                    Most people fail because they don’t know what niche to choose or how everything fits together. We eliminate that problem.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        "Understand the niche deeply",
                                        "See multiple business angles you can pursue",
                                        "Know exactly who you’re targeting",
                                        "Follow a clear strategy instead of guessing"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <Box className="h-5 w-5 text-indigo-600" />
                                            <span className="text-slate-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-6 font-semibold text-indigo-900">This is not theory. This is execution-ready structure.</p>
                            </div>
                            <div className="bg-indigo-50 p-8 rounded-2xl border border-indigo-100">
                                <h3 className="text-xl font-bold mb-4">Explore Profitable Niche Markets with Clarity</h3>
                                <p className="text-slate-600 mb-6">
                                    Every Niche Business in a Box walks you through:
                                </p>
                                <div className="space-y-4">
                                    <div className="flex gap-3">
                                        <Target className="h-6 w-6 text-indigo-600 shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">The Niche & Why It Works</h4>
                                            <p className="text-sm text-slate-500">Problems, desires, and motivations of the audience.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Map className="h-6 w-6 text-indigo-600 shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Business Models & Angles</h4>
                                            <p className="text-sm text-slate-500">How to position yourself without reinventing the wheel.</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-3">
                                        <Zap className="h-6 w-6 text-indigo-600 shrink-0" />
                                        <div>
                                            <h4 className="font-semibold">Multiple Paths</h4>
                                            <p className="text-sm text-slate-500">You’re not locked into one idea—choose what fits you best.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="w-full py-16 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <h2 className="text-3xl font-bold text-center mb-12">Everything You Need to Launch</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Video Walkthroughs */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <Video className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">In-Depth Video Walkthroughs</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Detailed breakdowns that explain the niche, show how pieces connect, and walk you through opportunities step by step.
                                </p>
                                <p className="text-xs font-medium text-blue-600">Remove confusion and overwhelm.</p>
                            </div>

                            {/* Strategies */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4">
                                    <Map className="h-6 w-6 text-emerald-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Proven Strategies & Roadmaps</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Step-by-step playbooks, roadmaps showing what to focus on first, and action plans you can follow immediately.
                                </p>
                                <p className="text-xs font-medium text-emerald-600">You’ll always know what to do next.</p>
                            </div>

                            {/* Customer Avatar */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Users className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Customer Avatar Research</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Defined avatars, pain points, desires, and buying motivations. Create offers and content that actually resonate.
                                </p>
                                <p className="text-xs font-medium text-purple-600">Understanding your audience is everything.</p>
                            </div>

                            {/* Keyword Research */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                    <Search className="h-6 w-6 text-orange-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Keyword Research Included</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Curated keywords, marketing angles, and topics for content and products. No guessing or random ideas.
                                </p>
                                <p className="text-xs font-medium text-orange-600">Get a head start in visibility.</p>
                            </div>

                            {/* Downloadable Assets */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                                    <Download className="h-6 w-6 text-pink-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Downloadable Assets</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    Ready-to-use guides, templates, worksheets, and reference materials to save you time and effort.
                                </p>
                                <p className="text-xs font-medium text-pink-600">Move faster and build with confidence.</p>
                            </div>

                            {/* Growth */}
                            <div className="bg-white p-6 rounded-xl shadow-sm border hover:shadow-md transition">
                                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                                    <TrendingUp className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Built for Growth</h3>
                                <p className="text-sm text-slate-500 mb-4">
                                    A repeatable framework you can use again and again. Whether launching your first business or adding a new stream.
                                </p>
                                <p className="text-xs font-medium text-indigo-600">Just focused, structured execution.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Why It Works */}
                <section className="w-full py-16 bg-indigo-900 text-white">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-12">Why Niche Business in a Box Works</h2>
                        <div className="flex flex-wrap justify-center gap-8">
                            {[
                                "Research is already done",
                                "Multiple angles instead of one rigid idea",
                                "Clear steps instead of confusion",
                                "Assets instead of empty outlines",
                                "Built to scale, not stall"
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/10 px-6 py-3 rounded-full">
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    <span className="font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                        <p className="mt-12 text-xl font-light opacity-90">
                            This is how smart entrepreneurs move faster.
                        </p>
                    </div>
                </section>

                {/* CTA */}
                <section className="w-full py-20 bg-slate-50 border-t">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <h2 className="text-3xl font-bold mb-6">Start with Structure. Build with Confidence.</h2>
                        <p className="max-w-2xl mx-auto text-lg text-slate-600 mb-8">
                            If you want to stop guessing and start building—<br />
                            If you want a business foundation that actually makes sense—<br />
                            Niche Business in a Box is your shortcut to momentum.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Link href="/sign-up">
                                <Button size="lg" className="bg-indigo-600 hover:bg-indigo-700 text-xl px-10 h-14 shadow-lg shadow-indigo-200">
                                    Get Access Now
                                </Button>
                            </Link>
                            <p className="text-sm font-medium text-slate-500">Build smarter. Launch faster. Grow with purpose.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500 dark:text-gray-400">© 2025 K Business Academy. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs hover:underline underline-offset-4" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
