'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
    BookOpen, Clock, Layers, Video, FileText, FolderOpen, RefreshCw,
    Zap, TrendingUp, ShieldCheck, CheckCircle2, Target, Rocket, Award
} from "lucide-react";

export default function CoursesPage() {
    // Hero slides for courses page
    const heroSlides = [
        {
            title: 'Blueprint. Build. Bank.',
            subtitle: 'Your first $100 online shouldn\'t take six months. It should take a weekend.',
            backgroundImage: '/heroimages/3eeba56d-f561-4cde-bf77-80373ff8a65d.png',
            ctaText: 'Start Learning',
            ctaLink: '/sign-up',
        },
        {
            title: 'Process. Progress. Profitability.',
            subtitle: 'Entrepreneurship isn\'t magic—it\'s methodical. We teach the method.',
            backgroundImage: '/heroimages/48f75e7d-3cf0-41e1-a88d-9e0d0d0464dc.png',
            ctaText: 'View Courses',
            ctaLink: '/sign-up',
        },
        {
            title: 'Direction. Discipline. Dividends.',
            subtitle: 'Your time is valuable. Stop wasting it piecing together free YouTube tutorials.',
            backgroundImage: '/heroimages/5aadcd74-4927-46f2-b6b7-df3606468ca4.png',
            ctaText: 'Get Started',
            ctaLink: '/sign-up',
        },
        {
            title: 'From "what should I do?" to "what\'s next?"',
            subtitle: 'In 90 days—not 9 months.',
            backgroundImage: '/heroimages/5e214005-ec9c-46ba-aed1-06f6513e19d3.png',
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
                <nav className="ml-auto flex items-center gap-4 sm:gap-6 hidden md:flex">
                    <Link className="text-sm font-medium text-purple-400 hover:text-white transition-colors" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/library">
                        Library
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/business-resources">
                        Resources
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/affiliate-crm">
                        Affiliate CRM
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/niche-boxes">
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
                <div className="ml-auto md:hidden">
                    <Link href="/sign-up">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Animated Hero Section */}
                <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

                {/* Self-Paced Learning - Dark Theme */}
                <section className="w-full py-20 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Self-Paced Learning That Fits Your Life</h2>
                                <p className="text-slate-400 mb-6 text-lg">
                                    Our courses are 100% self-paced, so you stay in control of your learning experience.
                                    Whether you have 20 minutes or two hours, you can make meaningful progress every time you log in.
                                </p>
                                <ul className="space-y-4">
                                    {[
                                        { icon: Clock, text: "Learn when it works for you" },
                                        { icon: RefreshCw, text: "Revisit lessons anytime" },
                                        { icon: Zap, text: "Move fast or slow—your choice" },
                                        { icon: ShieldCheck, text: "No deadlines, no pressure" }
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/20 rounded-lg">
                                                <item.icon className="h-5 w-5 text-purple-400" />
                                            </div>
                                            <span className="text-slate-300">{item.text}</span>
                                        </li>
                                    ))}
                                </ul>
                            </motion.div>
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="bg-gradient-to-br from-slate-800 to-slate-900 p-8 rounded-2xl border border-slate-700"
                            >
                                <h3 className="text-2xl font-bold mb-4 text-white">Built for Beginners — Powerful Enough for Experts</h3>
                                <p className="text-slate-400 mb-6">
                                    Our course structure is designed to meet you where you are and guide you forward step by step.
                                </p>
                                <div className="space-y-4">
                                    {[
                                        { num: 1, title: "Newbies", desc: "Get clear foundations and guidance", icon: Rocket },
                                        { num: 2, title: "Intermediate", desc: "Gain deeper understanding and strategy", icon: Target },
                                        { num: 3, title: "Advanced", desc: "Refine systems, execution, and scalability", icon: Award }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-3 p-4 bg-slate-900/50 rounded-lg border border-slate-700/50">
                                            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center shrink-0 font-bold text-white shadow-lg shadow-purple-500/30">
                                                {item.num}
                                            </div>
                                            <div className="flex-1">
                                                <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                                                <p className="text-sm text-slate-400">{item.desc}</p>
                                            </div>
                                            <item.icon className="h-5 w-5 text-purple-400 shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Multiple Formats - Dark Theme */}
                <section className="w-full py-20 bg-slate-950">
                    <div className="container px-4 md:px-6 mx-auto">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="text-3xl md:text-4xl font-bold text-center mb-12 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent"
                        >
                            Multiple Learning Formats for Real Understanding
                        </motion.h2>
                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
                        >
                            {[
                                { icon: Video, title: "Video Lessons", desc: "Walkthroughs and explanations that break concepts down clearly and visually.", color: "blue" },
                                { icon: FileText, title: "Text-Based Lessons", desc: "Structured written lessons for clarity, reference, and deeper understanding.", color: "purple" },
                                { icon: FolderOpen, title: "Resources & Materials", desc: "Guides, checklists, frameworks, and supporting materials.", color: "pink" },
                                { icon: RefreshCw, title: "Repeatable Learning", desc: "Return to lessons anytime as your business grows and your needs change.", color: "teal" }
                            ].map((item, i) => (
                                <motion.div
                                    key={i}
                                    variants={fadeInUp}
                                    className="bg-gradient-to-br from-slate-800 to-slate-900 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all hover:shadow-2xl hover:shadow-purple-500/20 group"
                                >
                                    <div className={`w-12 h-12 bg-gradient-to-br from-${item.color}-500 to-${item.color}-600 rounded-lg flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                        <item.icon className="h-6 w-6 text-white" />
                                    </div>
                                    <h3 className="font-bold text-lg mb-2 text-white">{item.title}</h3>
                                    <p className="text-sm text-slate-400">{item.desc}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>
                </section>

                {/* Practical Education - Dark Theme */}
                <section className="w-full py-20 bg-slate-900">
                    <div className="container px-4 md:px-6 mx-auto">
                        <motion.div
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="max-w-3xl mx-auto text-center"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">Practical, Action-Driven Education</h2>
                            <p className="text-lg text-slate-400 mb-8">
                                These courses aren't just about learning—they're about doing. <br />
                                You'll learn how concepts fit together, how strategies are applied in real-world scenarios, and how to turn knowledge into actual progress.
                            </p>
                            <div className="grid sm:grid-cols-3 gap-6 text-left">
                                {[
                                    "Understand the 'why' behind what you're doing",
                                    "Build confidence through clarity",
                                    "Take action without guesswork"
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />
                                        <span className="font-medium text-slate-300">{item}</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Learning System - Gradient Section */}
                <section className="w-full py-20 bg-gradient-to-br from-purple-900 via-slate-900 to-pink-900 relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">A Learning System That Grows With You</h2>
                                <p className="text-purple-200 mb-6 text-lg">
                                    As online business evolves, so does K Business Academy. Your membership becomes more valuable over time—not outdated.
                                </p>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        "New lessons added regularly",
                                        "Courses expanded and refined",
                                        "Content updated to stay relevant",
                                        "Learning paths that evolve"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-2 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                                            <TrendingUp className="h-4 w-4 text-purple-400" />
                                            <span className="text-sm text-white">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="bg-white/10 p-8 rounded-2xl backdrop-blur-sm border border-white/20"
                            >
                                <h3 className="text-2xl font-bold mb-4 text-white">Learn Without Overwhelm</h3>
                                <ul className="space-y-4 mb-6">
                                    <li className="flex items-center gap-3 text-purple-100">
                                        <ShieldCheck className="h-5 w-5 text-emerald-400" /> No complicated jargon
                                    </li>
                                    <li className="flex items-center gap-3 text-purple-100">
                                        <ShieldCheck className="h-5 w-5 text-emerald-400" /> No information overload
                                    </li>
                                    <li className="flex items-center gap-3 text-purple-100">
                                        <ShieldCheck className="h-5 w-5 text-emerald-400" /> No unrealistic expectations
                                    </li>
                                </ul>
                                <p className="text-purple-200 italic">
                                    "Just organized, structured learning that makes sense—especially if you've ever felt lost trying to figure things out on your own."
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Foundation - Dark Theme */}
                <section className="w-full py-20 bg-slate-950">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="container px-4 md:px-6 mx-auto text-center max-w-4xl"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">This Is More Than Courses</h2>
                        <h3 className="text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent font-semibold mb-6">
                            It's a Foundation for Long-Term Success
                        </h3>
                        <p className="text-lg text-slate-400 mb-8">
                            When you learn through K Business Academy, you're not just consuming content—you're building a knowledge base you can rely on for years to come.
                        </p>
                    </motion.div>
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
                            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">Ready to Start Learning?</h2>
                            <p className="max-w-2xl mx-auto text-xl text-slate-300 mb-10 leading-relaxed">
                                If you're ready to learn at your own pace, build real skills, and grow with confidence—K Business Academy is ready when you are.
                            </p>
                            <div className="flex flex-col items-center gap-6">
                                <Link href="/sign-up">
                                    <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-xl px-12 h-16 shadow-2xl shadow-purple-500/50">
                                        Join K Business Academy
                                    </Button>
                                </Link>
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
