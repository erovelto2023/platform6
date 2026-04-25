"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Script from "next/script";
import { 
    CircleCheck, 
    CirclePlay, 
    TriangleAlert, 
    CircleHelp, 
    SquareCheck, 
    Users, 
    Video, 
    Camera, 
    ArrowRight, 
    Target, 
    Zap, 
    BarChart3, 
    Rocket, 
    ShieldCheck, 
    X,
    Clock,
    Calendar,
    ChevronRight,
    Star,
    Layout,
    ArrowUpRight,
    Check,
    Menu
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FoundationsLandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const days = [
        {
            id: "01",
            title: "Ideation & Market Validation",
            description: "Finding a high-demand problem and a solution.",
            homework: "List three \"pain points\" you found in online communities today. Pick the strongest one and write a one-sentence \"Value Statement\" (e.g., \"I am helping [Target Audience] solve [Problem] with [Solution].\")",
            icon: <Target className="text-emerald-500" size={24} />,
            color: "bg-emerald-500/10"
        },
        {
            id: "02",
            title: "Product Architecture & MVP Definition",
            description: "Defining the \"Minimum Viable Product\" (MVP).",
            homework: "Create a \"Product Skeleton.\" This is a bulleted list of every chapter, module, or deliverable that will be in your final product. Keep it lean—only include what is necessary to solve the problem.",
            icon: <BarChart3 className="text-blue-500" size={24} />,
            color: "bg-blue-500/10"
        },
        {
            id: "03",
            title: "Rapid Product Development",
            description: "Building the actual product.",
            homework: "Finish your \"Version 1.0.\" Whether it’s an e-book, a template, or a recorded video, you must have a shareable file (PDF, Link, etc.) ready by tomorrow morning.",
            icon: <Layout className="text-purple-500" size={24} />,
            color: "bg-purple-500/10"
        },
        {
            id: "04",
            title: "Branding & Sales Assets",
            description: "Creating the pitch and the look.",
            homework: "Write your \"Elevator Sales Page.\" This includes a headline that grabs attention, three bullet points on how the product helps, and a clear price point. Design one \"Hero Image\" or mockup of your product.",
            icon: <Zap className="text-amber-500" size={24} />,
            color: "bg-amber-500/10"
        },
        {
            id: "05",
            title: "The Digital Storefront & Systems",
            description: "Setting up the \"Buy\" button and automation.",
            homework: "Perform a \"Test Purchase.\" Send your live store link to a friend or use a secondary email to ensure the payment goes through and the product is delivered automatically.",
            icon: <Rocket className="text-rose-500" size={24} />,
            color: "bg-rose-500/10"
        },
        {
            id: "06",
            title: "The Multi-Channel Marketing Plan",
            description: "Launch strategy and content scheduling.",
            homework: "Pre-write your \"Launch Day\" posts. You should have one email draft, one long-form post (like Facebook or LinkedIn), and one short-form script (for TikTok or Reels) ready to be posted the moment you wake up tomorrow.",
            icon: <ShieldCheck className="text-emerald-500" size={24} />,
            color: "bg-emerald-500/10"
        },
        {
            id: "07",
            title: "Launch, Traffic & Monetization",
            description: "Going live and driving sales.",
            homework: "The \"24-Hour Hustle.\" For the next 24 hours, your only job is to drive traffic. Post your content, answer every comment, and reach out to five potential customers directly via DM to offer them a \"Founding Member\" discount.",
            icon: <Users className="text-indigo-500" size={24} />,
            color: "bg-indigo-500/10",
            full: true
        }
    ];

    const bonuses = [
        {
            title: "K Business Academy Access",
            desc: "Instant access to our vault of additional tools, templates, and resources designed to accelerate your growth.",
            badge: "Bonus #1",
            status: "Included with Enrollment"
        },
        {
            title: "Private Affiliate Network",
            desc: "Gain entry into our private affiliate network. Sell products we've already built for a massive 50% commission.",
            badge: "High Value Bonus #2",
            status: "Instant Revenue Stream",
            featured: true
        },
        {
            title: "Monthly Goodies & Updates",
            desc: "You're not alone after the class. We provide additional bonuses and tool updates on a monthly basis.",
            badge: "Bonus #3",
            status: "Lifetime Support"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring" as const,
                stiffness: 100
            }
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFE] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            {/* Urgency Ribbon */}
            <div className="bg-emerald-950 text-white py-3 px-4 text-center text-sm font-bold sticky top-0 z-[60] border-b border-white/10">
                <div className="max-w-7xl mx-auto flex items-center justify-center gap-3">
                    <span className="bg-red-500 text-[10px] uppercase tracking-tighter px-2 py-0.5 rounded-full animate-pulse shadow-lg shadow-red-500/20">Flash Sale</span>
                    <span className="tracking-tight">Save $200 when you enroll before <span className="text-emerald-400">Monday, May 4th!</span></span>
                    <Clock size={14} className="hidden sm:inline text-emerald-500" />
                </div>
            </div>

            {/* Navigation */}
            <nav className={`fixed top-11 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-white/80 backdrop-blur-xl shadow-sm py-3" : "bg-transparent py-6"}`}>
                <div className="max-w-7xl mx-auto px-6 sm:px-10">
                    <div className="flex justify-between items-center">
                        <Link href="/" className="flex items-center gap-3 group">
                            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">K</div>
                            <span className="text-2xl font-black tracking-tight text-slate-900">K Business <span className="text-emerald-600">Academy</span></span>
                        </Link>
                        
                        <div className="hidden md:flex items-center gap-10 font-bold text-slate-500">
                            <a href="#curriculum" className="hover:text-emerald-600 transition-colors text-sm tracking-tight">Implementation Roadmap</a>
                            <a href="#bonuses" className="hover:text-emerald-600 transition-colors text-sm tracking-tight">Bonuses</a>
                            <a href="#cta" className="bg-slate-950 text-white px-8 py-3 rounded-2xl hover:bg-emerald-600 transition-all text-sm shadow-2xl shadow-slate-200 hover:-translate-y-0.5">
                                Join for $297
                            </a>
                        </div>

                        <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-slate-50" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="fixed inset-0 z-[49] bg-white pt-32 px-6"
                    >
                        <div className="flex flex-col gap-6 text-center">
                            <a href="#curriculum" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-900">Roadmap</a>
                            <a href="#bonuses" onClick={() => setIsMenuOpen(false)} className="text-2xl font-black text-slate-900">Bonuses</a>
                            <a href="#cta" onClick={() => setIsMenuOpen(false)} className="bg-emerald-600 text-white py-5 rounded-[2rem] text-xl font-black shadow-2xl shadow-emerald-200">Enroll for $297</a>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Hero Section */}
            <header className="relative pt-44 pb-32 overflow-hidden">
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[150px] -z-10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -z-10 translate-y-1/2 -translate-x-1/2" />
                
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2.5 bg-emerald-50 border border-emerald-100 px-5 py-2.5 rounded-full text-emerald-700 text-[11px] font-black uppercase tracking-[0.2em] mb-10 shadow-sm"
                    >
                        <Calendar size={14} />
                        Live 7-Day Intensive Training
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-950 mb-10 leading-[0.95] tracking-tighter"
                    >
                        Stop Chasing Hype. <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">Build Real Profits.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-4xl mx-auto mb-16 leading-relaxed font-medium tracking-tight"
                    >
                        Forget empty promises. Foundations to Profits is a deep-dive live training designed to teach you the <span className="text-slate-900 font-extrabold italic">actual mechanics</span> of digital product creation and marketing.
                    </motion.p>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="flex flex-col sm:flex-row justify-center gap-6 items-center mb-16"
                    >
                        <a href="#cta" className="w-full sm:w-auto px-12 py-6 bg-emerald-600 text-white font-black rounded-[2rem] shadow-[0_25px_60px_rgba(16,185,129,0.35)] hover:bg-emerald-700 hover:-translate-y-1.5 transition-all text-xl group active:scale-95">
                            Enroll Now for $297
                            <ArrowRight className="inline-block ml-3 group-hover:translate-x-2 transition-transform" size={24} />
                        </a>
                        <a href="#curriculum" className="w-full sm:w-auto px-12 py-6 bg-white text-slate-900 font-black rounded-[2rem] border border-slate-200 hover:bg-slate-50 transition-all text-xl shadow-sm hover:-translate-y-1">
                            View Roadmap
                        </a>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-wrap items-center justify-center gap-10 text-slate-400"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            SECURE PAYMENT
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Star size={18} className="text-amber-500 fill-amber-500" />
                            7-DAY GUARANTEE
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-red-600/80">
                            <Clock size={18} />
                            STARTS MAY 4th @ 10 AM EST
                        </div>
                    </motion.div>
                </div>
            </header>

            {/* Philosophy Section */}
            <section className="py-40 bg-white relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid lg:grid-cols-2 gap-24 items-center">
                        <motion.div 
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="relative"
                        >
                            <div className="inline-block text-emerald-600 font-black tracking-widest text-[11px] uppercase mb-6 bg-emerald-50 px-4 py-1.5 rounded-full">
                                The Harsh Reality
                            </div>
                            <h2 className="text-5xl md:text-7xl font-black text-slate-950 mb-10 leading-[1.05] tracking-tighter">
                                Why Most Online <br/>
                                <span className="text-slate-300 italic">"Gurus"</span> Fail You.
                            </h2>
                            <p className="text-slate-500 mb-8 text-xl leading-relaxed font-medium">
                                The internet is flooded with courses that sell you a dream but leave out the blueprint. They give you the <span className="text-slate-900 font-bold">"what"</span> but never the <span className="text-slate-900 font-bold italic">"how."</span>
                            </p>
                            <p className="text-slate-500 mb-12 text-xl leading-relaxed font-medium">
                                In Foundations to Profits, we focus on the <span className="text-emerald-600 font-bold italic">vital skills</span> needed to take a raw idea, break it down into consumable parts, and build assets that actually convert.
                            </p>
                            
                            <div className="space-y-6">
                                {[
                                    "No Empty Hype, Just Implementation.",
                                    "Proven Strategic Foundations for Long-Term Growth.",
                                    "Hands-on Live Building with Expert Support."
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 text-slate-900 font-black text-lg group">
                                        <div className="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all transform group-hover:rotate-12">
                                            <Check size={18} strokeWidth={4} />
                                        </div>
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="bg-slate-950 p-14 md:p-20 rounded-[4rem] relative overflow-hidden group shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)]"
                        >
                            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px]" />
                            <div className="relative z-10">
                                <div className="text-emerald-500 font-black tracking-[0.3em] text-[10px] uppercase mb-10 flex items-center gap-3">
                                    <div className="w-12 h-[1.5px] bg-emerald-500" />
                                    FOUNDATIONS CORE PHILOSOPHY
                                </div>
                                <p className="text-3xl md:text-5xl text-white font-light leading-[1.1] italic mb-12 tracking-tight">
                                    "Skills are the only currency that <span className="text-emerald-400 font-bold not-italic">doesn't devalue</span>. Once you build a marketing machine from scratch, you have an income for life."
                                </p>
                                <div className="flex items-center gap-5">
                                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center font-black text-white text-2xl shadow-xl shadow-emerald-500/20">K</div>
                                    <div>
                                        <div className="text-white font-black text-xl tracking-tight">K Business Academy</div>
                                        <div className="text-slate-500 font-bold text-sm tracking-widest uppercase">Strategic Development</div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Roadmap Section */}
            <section id="curriculum" className="py-40 bg-slate-50 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-24">
                        <motion.h2 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-5xl md:text-8xl font-black text-slate-950 mb-8 tracking-tighter"
                        >
                            7-Day Implementation
                        </motion.h2>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                            className="text-slate-500 max-w-3xl mx-auto text-2xl font-medium tracking-tight"
                        >
                            We don't just talk; we build. Every day is a massive leap toward your first (or next) digital profit.
                        </motion.p>
                    </div>

                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
                    >
                        {days.map((day) => (
                            <motion.div 
                                key={day.id} 
                                variants={itemVariants}
                                className={`group bg-white p-12 rounded-[3rem] border border-slate-200 transition-all duration-700 hover:shadow-[0_40px_80px_-15px_rgba(16,185,129,0.1)] hover:-translate-y-3 relative overflow-hidden ${day.full ? "lg:col-span-3 bg-gradient-to-br from-white to-emerald-50/50" : ""}`}
                            >
                                <div className={`absolute top-0 right-0 p-8 text-8xl font-black opacity-[0.02] group-hover:opacity-[0.06] transition-opacity tabular-nums`}>
                                    {day.id}
                                </div>
                                
                                <div className={`w-16 h-16 ${day.color} rounded-[1.5rem] flex items-center justify-center mb-10 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                                    {day.icon}
                                </div>

                                <div className={day.full ? "lg:flex lg:items-center lg:gap-20" : ""}>
                                    <div className="flex-1">
                                        <h3 className="text-3xl font-black mb-5 text-slate-950 flex items-center gap-4 tracking-tight">
                                            <span className="text-emerald-600 text-sm font-black tabular-nums bg-emerald-50 w-8 h-8 rounded-full flex items-center justify-center">{day.id}</span>
                                            {day.title}
                                        </h3>
                                        <p className="text-slate-500 leading-relaxed text-xl font-medium tracking-tight mb-8">
                                            {day.description}
                                        </p>

                                        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 group-hover:bg-emerald-50/50 group-hover:border-emerald-100 transition-all duration-500">
                                            <div className="flex items-center gap-2 mb-3">
                                                <div className="w-6 h-6 bg-emerald-600 text-white rounded-lg flex items-center justify-center shadow-lg shadow-emerald-500/20">
                                                    <Check size={12} strokeWidth={4} />
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-emerald-600 transition-colors">Daily Homework</span>
                                            </div>
                                            <p className="text-slate-600 text-sm font-bold leading-relaxed tracking-tight group-hover:text-slate-900 transition-colors italic">
                                                "{day.homework}"
                                            </p>
                                        </div>
                                    </div>
                                    
                                    {day.full && (
                                        <div className="mt-12 lg:mt-0 lg:w-80 shrink-0">
                                            <div className="bg-emerald-600 text-white p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-200 transform hover:scale-105 transition-transform duration-500">
                                                <div className="text-[11px] uppercase tracking-[0.3em] font-black mb-3 opacity-80">FINAL OBJECTIVE</div>
                                                <div className="text-3xl font-black tracking-tight leading-none mb-6">Profit & Scalability</div>
                                                <div className="flex items-center gap-3 text-sm font-bold bg-white/15 p-3 rounded-2xl backdrop-blur-sm">
                                                    <Rocket size={20} className="animate-bounce" />
                                                    Global Release Ready
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Bonuses Section */}
            <section id="bonuses" className="py-40 bg-slate-950 relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                    <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-emerald-600 rounded-full blur-[150px]" />
                    <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600 rounded-full blur-[150px]" />
                </div>

                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <div className="text-center mb-24">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8"
                        >
                            ACCELERATE YOUR GROWTH
                        </motion.div>
                        <h2 className="text-5xl md:text-8xl font-black text-white mb-8 leading-none tracking-tighter">
                            Exclusive <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400 underline decoration-white/10 underline-offset-[16px]">Bonuses</span>
                        </h2>
                        <p className="text-slate-400 max-w-2xl mx-auto text-2xl font-medium tracking-tight">
                            We ensure you have every tool needed to succeed far beyond the initial 7 days.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-10">
                        {bonuses.map((bonus, i) => (
                            <motion.div 
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className={`relative p-12 rounded-[3.5rem] border transition-all duration-700 group ${bonus.featured ? "bg-emerald-600 border-emerald-400 scale-105 shadow-[0_60px_100px_-20px_rgba(16,185,129,0.3)]" : "bg-white/[0.03] border-white/10 hover:bg-white/[0.06] hover:border-white/20"}`}
                            >
                                <div className={`text-[11px] uppercase font-black tracking-[0.3em] mb-6 ${bonus.featured ? "text-emerald-100" : "text-emerald-500"}`}>
                                    {bonus.badge}
                                </div>
                                <h3 className={`text-3xl font-black mb-6 leading-tight tracking-tight ${bonus.featured ? "text-white" : "text-white"}`}>
                                    {bonus.title}
                                </h3>
                                <p className={`mb-12 text-lg leading-relaxed font-medium tracking-tight ${bonus.featured ? "text-emerald-50" : "text-slate-400"}`}>
                                    {bonus.desc}
                                </p>
                                <div className={`flex items-center gap-3 text-[11px] font-black tracking-widest uppercase ${bonus.featured ? "bg-white/15 text-white" : "bg-white/5 text-emerald-400"} py-4 px-6 rounded-2xl inline-flex group-hover:scale-105 transition-transform`}>
                                    {bonus.status}
                                    <ArrowUpRight size={16} />
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section id="cta" className="py-40 bg-white relative">
                <div className="max-w-6xl mx-auto px-6">
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-slate-50 border border-slate-200 rounded-[4rem] p-16 md:p-24 relative overflow-hidden shadow-[0_60px_120px_-30px_rgba(0,0,0,0.1)]"
                    >
                        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
                        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px]" />

                        <div className="relative z-10 text-center">
                            <h2 className="text-5xl md:text-8xl font-black text-slate-950 mb-10 leading-[1.1] tracking-tighter">
                                Ready to Build Your <br/>
                                <span className="text-emerald-600 underline decoration-slate-200 underline-offset-[20px]">Foundations?</span>
                            </h2>
                            
                            <div className="bg-white border border-slate-200 rounded-[3rem] p-10 md:p-14 mb-16 shadow-[0_20px_50px_rgba(0,0,0,0.03)] inline-block w-full max-w-3xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                                    <div className="text-left">
                                        <div className="text-[10px] font-black uppercase text-emerald-600 tracking-[0.3em] mb-4">LIVE COHORT ACCESS</div>
                                        <div className="text-4xl font-black text-slate-950 tracking-tighter">Monday, May 4th</div>
                                        <div className="text-slate-400 font-bold text-lg tracking-tight">10 AM EST SHARP</div>
                                    </div>
                                    <div className="h-20 w-[1px] bg-slate-100 hidden md:block" />
                                    <div className="text-right flex items-baseline gap-6">
                                        <div className="text-left">
                                            <div className="text-[10px] font-black uppercase text-red-600 tracking-[0.3em] mb-4">FLASH SALE PRICE</div>
                                            <div className="text-7xl font-black text-slate-950 tracking-tighter">$297</div>
                                        </div>
                                        <div className="text-3xl text-slate-200 line-through font-black">$497</div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-slate-500 text-2xl mb-16 max-w-2xl mx-auto font-medium tracking-tight">
                                Enroll today to secure the <span className="text-slate-900 font-black">founding member price</span> and lock in all premium bonuses.
                            </p>

                            <button 
                                onClick={() => setIsModalOpen(true)}
                                className="w-full md:w-auto px-20 py-8 bg-slate-950 text-white font-black text-2xl rounded-[2.5rem] shadow-[0_30px_70px_rgba(0,0,0,0.2)] hover:bg-emerald-600 hover:-translate-y-2 transition-all group active:scale-95"
                            >
                                SECURE MY SPOT NOW
                                <ArrowRight className="inline-block ml-4 group-hover:translate-x-3 transition-transform" size={32} />
                            </button>

                            <div className="mt-20 pt-14 border-t border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-12">
                                {[
                                    { icon: <ShieldCheck size={24} />, label: "SECURE CHECKOUT" },
                                    { icon: <CircleCheck size={24} />, label: "LIFETIME ACCESS" },
                                    { icon: <SquareCheck size={24} />, label: "VERIFIED SECURE" },
                                    { icon: <CircleHelp size={24} />, label: "PRIORITY SUPPORT" }
                                ].map((item, i) => (
                                    <div key={i} className="flex flex-col items-center gap-4 opacity-30 hover:opacity-100 transition-all duration-500 cursor-default">
                                        <div className="text-slate-950 transform group-hover:scale-110">{item.icon}</div>
                                        <div className="text-[10px] font-black tracking-[0.2em]">{item.label}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-32 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-10 group cursor-pointer">
                        <div className="w-8 h-8 bg-slate-950 rounded-xl flex items-center justify-center text-white text-[12px] font-black group-hover:rotate-12 transition-transform">K</div>
                        <span className="text-lg font-black tracking-tighter text-slate-950">K Business Academy</span>
                    </div>
                    <p className="text-slate-400 text-sm mb-8 font-medium">&copy; 2024-2026 K Business Academy. Strategic Growth Initiative.</p>
                    <p className="max-w-4xl mx-auto text-slate-300 text-[11px] font-medium italic leading-relaxed tracking-tight">
                        Disclaimer: Making money online requires work, persistence, and specialized technical/strategic skills. We do not promise overnight riches or guaranteed income levels. Our training is designed to provide you with the professional foundations to build a real business. Price increases to $497 on Monday, May 4th at 10 AM EST. Early-bird bonuses are limited to founding members only.
                    </p>
                </div>
            </footer>

            {/* Premium Checkout Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-slate-950/60 backdrop-blur-xl overflow-y-auto"
                    >
                        <div className="min-h-full flex items-start justify-center p-4 py-12 md:py-24">
                            <motion.div 
                                initial={{ scale: 0.9, opacity: 0, y: 30 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.9, opacity: 0, y: 30 }}
                                className="bg-white rounded-[3rem] p-8 md:p-14 max-w-3xl w-full shadow-[0_60px_120px_rgba(0,0,0,0.25)] relative border border-slate-100"
                            >
                            <div className="absolute top-0 left-0 right-0 h-2.5 bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500" />
                            
                            <button 
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-8 right-8 text-slate-300 hover:text-slate-950 transition-colors p-3 bg-slate-50 rounded-2xl"
                            >
                                <X size={24} />
                            </button>

                            <div className="text-center mb-12">
                                <div className="w-20 h-20 bg-emerald-50 text-emerald-600 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-inner">
                                    <Zap size={40} className="fill-emerald-600" />
                                </div>
                                <h3 className="text-4xl font-black text-slate-950 mb-4 tracking-tighter leading-none">Lock In Early Access</h3>
                                <p className="text-slate-500 text-lg font-medium tracking-tight">
                                    You're securing the <span className="text-emerald-600 font-bold">$297 early-bird rate</span>. Enter your email to proceed to our secure payment gateway.
                                </p>
                            </div>

                            <div className="mt-8">
                                <div className="rounded-[2rem] border border-slate-100 shadow-inner bg-slate-50 flex items-center justify-center p-4">
                                    <div style={{ minHeight: '400px', width: '100%', maxWidth: '500px' }}>
                                        <link href="https://kbusiness.groovesell.com/embed/css/app.css?n=1" rel="stylesheet" />
                                        {/* @ts-ignore */}
                                        <groovesell-embed subdomain="kbusiness" checkout="7ec6b976e017d55fc0d54f653f98bc64"></groovesell-embed>
                                        <Script src="https://kbusiness.groovesell.com/embed/js/app.js?n=1" strategy="lazyOnload" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center justify-center gap-4 text-slate-300">
                                <ShieldCheck size={20} />
                                <div className="text-[10px] font-black tracking-[0.3em] uppercase">AES-256 SECURED & ENCRYPTED</div>
                            </div>
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
                
                html {
                    scroll-behavior: smooth;
                }
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
                
                ::-webkit-scrollbar {
                    width: 10px;
                }
                
                ::-webkit-scrollbar-track {
                    background: #f8fafc;
                }
                
                ::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                
                ::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
            {/* GrooveSell Tracking */}
            <img 
                src="https://tracking.groovesell.com/salespage/tracking/92110" 
                style={{ border: '0px', width: '0px', height: '0px', position: 'absolute', opacity: 0, pointerEvents: 'none' }} 
                alt=""
            />
        </div>
    );
}
