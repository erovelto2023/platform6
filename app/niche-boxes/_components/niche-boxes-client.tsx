"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
    Box, Target, Map, Video, BookOpen, Users, Search, Download,
    CheckCircle2, TrendingUp, Zap, Lightbulb, Rocket, Award
} from "lucide-react";

export function NicheBoxesClient() {
    // Hero slides for niche boxes page
    const heroSlides = [
        {
            title: 'Research. Roadmap. Results.',
            subtitle: 'Skip the 200-hour niche deep dive. We hand you validated models ready to execute.',
            backgroundImage: '/heroimages/962464e7-62e7-4974-866e-52b2e00976f7.png',
            ctaText: 'Explore Niches',
            ctaLink: '/sign-up',
        },
        {
            title: 'Validate. Create. Convert.',
            subtitle: 'Stop building in the dark. Start building what people actually buy.',
            backgroundImage: '/heroimages/a400fc81-bf6f-4c22-be56-c83b91b26693.png',
            ctaText: 'Get Started',
            ctaLink: '/sign-up',
        },
        {
            title: 'Your niche isn\'t "make money online."',
            subtitle: 'It\'s what you build inside it. We help you find—and profit from—both.',
            backgroundImage: '/heroimages/b5c8e145-1407-4ae8-b41a-b2d30d4fafc1.png',
            ctaText: 'View Niche Boxes',
            ctaLink: '/sign-up',
        },
        {
            title: 'The best marketing tool?',
            subtitle: 'A product people actually want. We help you build both—simultaneously.',
            backgroundImage: '/heroimages/eab09a8e-8f04-4422-9e63-e49b80dce334.png',
            ctaText: 'Join Now',
            ctaLink: '/sign-up',
        },
    ];

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: { opacity: 1, scale: 1 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Navbar - Dark Theme */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/50">
                            K
                        </div>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            K Business Academy
                        </span>
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-medium text-purple-400 hover:text-white transition-colors" href="/niche-boxes">
                        Niche Boxes
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/blog">
                        Blog
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30">
                            Get Started
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Animated Hero Section */}
                <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

                {/* What Is It - Dark Theme */}
                <section className="w-full py-20 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">What Is a Niche Business in a Box?</h2>
                                <p className="text-slate-400 mb-6 text-lg">
                                    A Niche Business in a Box is a complete, done-for-you business blueprint built around a specific niche market.
                                    Most people fail because they don't know what niche to choose or how everything fits together. We eliminate that problem.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        { icon: Lightbulb, text: "Understand the niche deeply" },
                                        { icon: Target, text: "See multiple business angles you can pursue" },
                                        { icon: Users, text: "Know exactly who you're targeting" },
                                        { icon: Map, text: "Follow a clear strategy instead of guessing" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <item.icon className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <span className="text-slate-300">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                                <p className="mt-6 font-semibold text-white bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    This is not theory. This is execution-ready structure.
                                </p>
                            </motion.div>

                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700"
                            >
                                <h3 className="text-2xl font-bold mb-4 text-white">Explore Profitable Niche Markets with Clarity</h3>
                                <p className="text-slate-400 mb-6">
                                    Every Niche Business in a Box walks you through:
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { icon: Target, title: "The Niche & Why It Works", desc: "Problems, desires, and motivations of the audience." },
                                        { icon: Map, title: "Business Models & Angles", desc: "How to position yourself without reinventing the wheel." },
                                        { icon: Zap, title: "Multiple Paths", desc: "You're not locked into one idea—choose what fits you best." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-purple-500/30">
                                                <item.icon className="h-5 w-5 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-400">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Features Grid - Dark Theme */}
                <section className="w-full py-20 bg-slate-950">
                    <div className="container px-4 md:px-6 mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                        >
                            Everything You Need to Launch
                        </motion.h2>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {[
                                {
                                    icon: Video,
                                    title: "In-Depth Video Walkthroughs",
                                    desc: "Detailed breakdowns that explain the niche, show how pieces connect, and walk you through opportunities step by step.",
                                    highlight: "Remove confusion and overwhelm.",
                                    color: "blue"
                                },
                                {
                                    icon: Map,
                                    title: "Proven Strategies & Roadmaps",
                                    desc: "Step-by-step playbooks, roadmaps showing what to focus on first, and action plans you can follow immediately.",
                                    highlight: "You'll always know what to do next.",
                                    color: "emerald"
                                },
                                {
                                    icon: Users,
                                    title: "Customer Avatar Research",
                                    desc: "Defined avatars, pain points, desires, and buying motivations. Create offers and content that actually resonate.",
                                    highlight: "Understanding your audience is everything.",
                                    color: "purple"
                                },
                                {
                                    icon: Search,
                                    title: "Keyword Research Included",
                                    desc: "Curated keywords, marketing angles, and topics for content and products. No guessing or random ideas.",
                                    highlight: "Get a head start in visibility.",
                                    color: "orange"
                                },
                                {
                                    icon: Download,
                                    title: "Downloadable Assets",
                                    desc: "Ready-to-use guides, templates, worksheets, and reference materials to save you time and effort.",
                                    highlight: "Move faster and build with confidence.",
                                    color: "pink"
                                },
                                {
                                    icon: TrendingUp,
                                    title: "Built for Growth",
                                    desc: "A repeatable framework you can use again and again. Whether launching your first business or adding a new stream.",
                                    highlight: "Just focused, structured execution.",
                                    color: "indigo"
                                }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={scaleIn}
                                    transition={{ duration: 0.5, delay: i * 0.1 }}
                                    className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                                    <p className="text-sm text-slate-400 mb-4">{item.desc}</p>
                                    <p className={`text-xs font-medium text-${item.color}-400`}>{item.highlight}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Why It Works - Gradient Section */}
                <section className="w-full py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold mb-12 text-white"
                        >
                            Why Niche Business in a Box Works
                        </motion.h2>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="flex flex-wrap justify-center gap-6"
                        >
                            {[
                                "Research is already done",
                                "Multiple angles instead of one rigid idea",
                                "Clear steps instead of confusion",
                                "Assets instead of empty outlines",
                                "Built to scale, not stall"
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="flex items-center gap-3 bg-white/10 backdrop-blur-sm px-6 py-4 rounded-full border border-white/20 hover:bg-white/20 transition-all"
                                >
                                    <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                                    <span className="font-medium text-white">{item}</span>
                                </motion.div>
                            ))}
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="mt-12 text-2xl font-light text-white/90"
                        >
                            This is how smart entrepreneurs move faster.
                        </motion.p>
                    </div>
                </section>

                {/* CTA - Gradient */}
                <section className="w-full py-24 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden border-t border-slate-800">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/20 rounded-full blur-3xl" />

                    <div className="container px-4 md:px-6 mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
                                Start with Structure. <br />
                                Build with Confidence.
                            </h2>
                            <div className="max-w-2xl mx-auto text-xl text-slate-300 mb-10 space-y-2">
                                <p>If you want to stop guessing and start building—</p>
                                <p>If you want a business foundation that actually makes sense—</p>
                                <p className="font-semibold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Niche Business in a Box is your shortcut to momentum.
                                </p>
                            </div>
                            <div className="flex flex-col items-center gap-6">
                                <Link href="/sign-up">
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl px-12 h-16 shadow-2xl shadow-purple-500/50">
                                        Get Access Now
                                    </Button>
                                </Link>
                                <p className="text-sm font-medium text-slate-400">
                                    Build smarter. Launch faster. Grow with purpose.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </section>
            </main>

            {/* Footer - Dark Theme */}
            <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800 bg-slate-950">
                <p className="text-xs text-slate-500">© 2025 K Business Academy. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs text-slate-500 hover:text-slate-300 transition-colors" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs text-slate-500 hover:text-slate-300 transition-colors" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
