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

// beUI Components
import { ScrollReveal } from "@/components/motion/scroll-reveal";
import { TiltCard } from "@/components/motion/tilt-card";
import { Marquee } from "@/components/motion/marquee";
import { MagneticButton } from "@/components/motion/button/magnetic";
import { SmoothScroll } from "@/components/motion/smooth-scroll";

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
            homework: "List three \"pain points\" you found in online communities today.",
            icon: <Target className="text-emerald-500" size={24} />,
            color: "bg-emerald-500/10"
        },
        {
            id: "02",
            title: "Product Architecture & MVP",
            description: "Defining the \"Minimum Viable Product\" (MVP).",
            homework: "Create a \"Product Skeleton.\" Keep it lean.",
            icon: <BarChart3 className="text-blue-500" size={24} />,
            color: "bg-blue-500/10"
        },
        {
            id: "03",
            title: "Rapid Product Development",
            description: "Building the actual product.",
            homework: "Finish your \"Version 1.0.\" Have a shareable file ready.",
            icon: <Layout className="text-purple-500" size={24} />,
            color: "bg-purple-500/10"
        },
        {
            id: "04",
            title: "Branding & Sales Assets",
            description: "Creating the pitch and the look.",
            homework: "Write your \"Elevator Sales Page.\"",
            icon: <Zap className="text-amber-500" size={24} />,
            color: "bg-amber-500/10"
        },
        {
            id: "05",
            title: "The Digital Storefront",
            description: "Setting up the \"Buy\" button and automation.",
            homework: "Perform a \"Test Purchase.\"",
            icon: <Rocket className="text-rose-500" size={24} />,
            color: "bg-rose-500/10"
        },
        {
            id: "06",
            title: "The Marketing Plan",
            description: "Launch strategy and content scheduling.",
            homework: "Pre-write your \"Launch Day\" posts.",
            icon: <ShieldCheck className="text-emerald-500" size={24} />,
            color: "bg-emerald-500/10"
        },
    ];

    const bonuses = [
        {
            title: "K Business Academy Access",
            desc: "Instant access to our vault of additional tools and templates.",
            badge: "Bonus #1",
            status: "Included"
        },
        {
            title: "Private Affiliate Network",
            desc: "Sell products we've already built for 50% commission.",
            badge: "Bonus #2",
            status: "Instant Revenue"
        },
        {
            title: "Monthly Goodies",
            desc: "We provide additional bonuses and tool updates.",
            badge: "Bonus #3",
            status: "Lifetime"
        }
    ];

    return (
        <SmoothScroll>
            <div className="min-h-screen bg-[#050505] text-slate-100 font-sans selection:bg-emerald-500/30 selection:text-emerald-200 overflow-x-hidden">
                {/* Navigation */}
                <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-black/50 backdrop-blur-xl border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
                    <div className="max-w-7xl mx-auto px-6 sm:px-10">
                        <div className="flex justify-between items-center">
                            <Link href="/" className="flex items-center gap-3 group">
                                <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-emerald-500/20">K</div>
                                <span className="text-2xl font-black tracking-tight text-white">K Business <span className="text-emerald-500">Academy</span></span>
                            </Link>
                            
                            <div className="hidden md:flex items-center gap-8 font-bold text-slate-400">
                                <a href="#curriculum" className="hover:text-emerald-400 transition-colors text-sm">Roadmap</a>
                                <a href="#bonuses" className="hover:text-emerald-400 transition-colors text-sm">Bonuses</a>
                                <MagneticButton
                                    variant="primary"
                                    className="rounded-full font-bold px-6 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Join for $297
                                </MagneticButton>
                            </div>

                            <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <header className="relative pt-44 pb-32 overflow-hidden flex flex-col items-center justify-center min-h-[90vh]">
                    {/* Visual Elements */}
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-900/20 via-[#050505] to-[#050505] -z-10" />
                    <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] -z-10" />
                    
                    <div className="max-w-7xl mx-auto px-6 text-center z-10">
                        <ScrollReveal y={20} blur={10}>
                            <div className="inline-flex items-center gap-2.5 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full text-emerald-400 text-[11px] font-black uppercase tracking-[0.2em] mb-10 backdrop-blur-md">
                                <Calendar size={14} />
                                Live 7-Day Intensive Training
                            </div>
                        </ScrollReveal>
                        
                        <ScrollReveal y={30} blur={15} delay={0.1}>
                            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-8 leading-[1.05] tracking-tighter">
                                Stop Chasing Hype. <br/>
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-400 to-emerald-200">Build Real Profits.</span>
                            </h1>
                        </ScrollReveal>

                        <ScrollReveal y={20} blur={10} delay={0.2}>
                            <p className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-14 leading-relaxed font-medium">
                                Forget empty promises. Foundations to Profits is a deep-dive live training designed to teach you the <span className="text-emerald-400 font-bold">actual mechanics</span> of digital product creation and marketing.
                            </p>
                        </ScrollReveal>

                        <ScrollReveal y={20} blur={10} delay={0.3}>
                            <div className="flex flex-col sm:flex-row justify-center gap-6 items-center">
                                <MagneticButton
                                    variant="primary"
                                    size="lg"
                                    className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-lg px-10 py-7 shadow-[0_0_40px_-10px_rgba(16,185,129,0.5)] font-black"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    Enroll Now for $297
                                    <ArrowRight className="ml-2" size={20} />
                                </MagneticButton>
                                
                                <MagneticButton
                                    variant="outline"
                                    color="neutral"
                                    size="lg"
                                    className="rounded-full text-lg px-10 py-7 bg-white/5 border-white/10 text-white font-bold hover:bg-white/10"
                                >
                                    View Roadmap
                                </MagneticButton>
                            </div>
                        </ScrollReveal>
                    </div>

                    <ScrollReveal delay={0.5} y={0} blur={10} className="w-full mt-24 overflow-hidden border-y border-white/5 bg-white/5 py-4 backdrop-blur-sm">
                        <Marquee speed={30} className="flex items-center gap-16 text-slate-400 font-black text-xs tracking-[0.2em] uppercase">
                            <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-emerald-500" /> SECURE PAYMENT</span>
                            <span>•</span>
                            <span className="flex items-center gap-2"><Star size={16} className="text-amber-500" /> 7-DAY GUARANTEE</span>
                            <span>•</span>
                            <span className="flex items-center gap-2"><Clock size={16} className="text-red-500" /> STARTS MAY 4TH</span>
                            <span>•</span>
                            <span className="flex items-center gap-2"><Users size={16} className="text-blue-500" /> COMMUNITY DRIVEN</span>
                            <span>•</span>
                        </Marquee>
                    </ScrollReveal>
                </header>

                {/* Roadmap Section */}
                <section id="curriculum" className="py-40 relative">
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal className="text-center mb-24">
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter">
                                7-Day Implementation
                            </h2>
                            <p className="text-slate-400 max-w-2xl mx-auto text-xl font-medium">
                                We don't just talk; we build. Every day is a massive leap toward your first digital profit.
                            </p>
                        </ScrollReveal>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {days.map((day, i) => (
                                <ScrollReveal key={day.id} delay={i * 0.1} y={30}>
                                    <TiltCard 
                                        className="h-full bg-[#0a0a0a] border border-white/10 p-8 rounded-[2rem] flex flex-col relative overflow-hidden group"
                                        glare={true}
                                        max={5}
                                    >
                                        <div className="absolute -top-10 -right-10 text-[120px] font-black text-white/[0.02] group-hover:text-emerald-500/[0.05] transition-colors pointer-events-none">
                                            {day.id}
                                        </div>
                                        <div className={`w-14 h-14 ${day.color} rounded-2xl flex items-center justify-center mb-8 border border-white/5`}>
                                            {day.icon}
                                        </div>
                                        <h3 className="text-2xl font-bold text-white mb-4 tracking-tight">{day.title}</h3>
                                        <p className="text-slate-400 mb-8 flex-1">{day.description}</p>
                                        
                                        <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                                            <div className="text-[10px] font-black uppercase tracking-widest text-emerald-500 mb-2">Homework</div>
                                            <p className="text-sm text-slate-300 italic">"{day.homework}"</p>
                                        </div>
                                    </TiltCard>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Bonuses Section */}
                <section id="bonuses" className="py-40 relative border-t border-white/5 bg-[#080808]">
                    <div className="max-w-7xl mx-auto px-6">
                        <ScrollReveal className="text-center mb-24">
                            <div className="inline-block px-5 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black uppercase tracking-[0.3em] mb-8">
                                EXCLUSIVE BONUSES
                            </div>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-8 tracking-tighter">
                                Accelerate Your Growth
                            </h2>
                        </ScrollReveal>

                        <div className="grid lg:grid-cols-3 gap-8">
                            {bonuses.map((bonus, i) => (
                                <ScrollReveal key={i} delay={i * 0.1}>
                                    <TiltCard 
                                        className="h-full bg-black border border-white/10 p-10 rounded-[2.5rem] relative"
                                        glare={true}
                                        max={8}
                                    >
                                        <div className="text-[10px] uppercase font-black tracking-widest text-emerald-500 mb-4">{bonus.badge}</div>
                                        <h3 className="text-2xl font-bold text-white mb-4">{bonus.title}</h3>
                                        <p className="text-slate-400 mb-8">{bonus.desc}</p>
                                        <div className="bg-white/5 text-slate-300 text-xs font-bold py-2 px-4 rounded-full inline-flex border border-white/5">
                                            {bonus.status}
                                        </div>
                                    </TiltCard>
                                </ScrollReveal>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-40 relative">
                    <div className="max-w-5xl mx-auto px-6 text-center">
                        <ScrollReveal>
                            <h2 className="text-5xl md:text-7xl font-black text-white mb-8 tracking-tighter">
                                Ready to Build Your <br/>
                                <span className="text-emerald-400">Foundations?</span>
                            </h2>
                            <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto">
                                Secure your spot today. Lock in the founding member price and all premium bonuses before the price increases to $497.
                            </p>
                            
                            <MagneticButton
                                variant="primary"
                                size="lg"
                                className="rounded-full bg-emerald-500 hover:bg-emerald-600 text-white text-xl px-12 py-8 shadow-[0_0_50px_-10px_rgba(16,185,129,0.4)] font-black mx-auto"
                                onClick={() => setIsModalOpen(true)}
                            >
                                Secure My Spot for $297
                            </MagneticButton>
                        </ScrollReveal>
                    </div>
                </section>
                
                <footer className="py-12 border-t border-white/5 text-center text-slate-500 text-sm">
                    &copy; 2024-2026 K Business Academy. Strategic Growth Initiative.
                </footer>
            </div>
        </SmoothScroll>
    );
}
