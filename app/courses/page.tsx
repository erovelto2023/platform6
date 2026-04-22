'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { SiteHeader } from "@/components/shared/SiteHeader";
import {
    CheckCircle2,
    Video,
    FileText,
    FolderOpen,
    RefreshCw,
    ShieldCheck,
    Clock,
    Zap,
    Plus,
    BarChart3,
    ArrowRight,
    Play
} from "lucide-react";

export default function CoursesPage() {
    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 }
    };

    return (
        <div className="flex flex-col min-h-screen bg-white font-sans">
            <SiteHeader />

            <main className="flex-1 overflow-x-hidden">
                {/* Hero Section */}
                <header className="relative pt-20 pb-32 bg-gradient-to-b from-emerald-50/50 to-white overflow-hidden">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.6 }}
                            className="inline-block py-1.5 px-4 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-widest mb-6"
                        >
                            Expert-Led Education
                        </motion.div>
                        
                        <motion.h1 
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tighter"
                        >
                            The Blueprints to Build & <br/> 
                            <span className="text-emerald-600 italic">Scale Your Digital Empire.</span>
                        </motion.h1>
                        
                        <motion.p 
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
                        >
                            Stop jumping between YouTube tutorials. Join a structured, self-paced learning ecosystem designed to turn your ideas into profitable digital products and high-impact marketing campaigns.
                        </motion.p>
                        
                        <motion.div 
                            initial="hidden"
                            animate="visible"
                            variants={fadeInUp}
                            transition={{ duration: 0.6, delay: 0.3 }}
                            className="flex flex-col sm:flex-row items-center justify-center gap-6"
                        >
                            <Link href="/sign-up" className="w-full sm:w-auto">
                                <Button className="w-full sm:w-auto px-10 py-8 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-700 transition shadow-2xl shadow-emerald-200 text-xl uppercase tracking-tighter border-none">
                                    Start Your Path Now
                                    <ArrowRight className="ml-2 h-6 w-6" />
                                </Button>
                            </Link>
                        </motion.div>
                        
                        {/* Hero Video Placeholder */}
                        <motion.div 
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="mt-24 max-w-5xl mx-auto relative group"
                        >
                            <div className="absolute -inset-4 bg-emerald-500/10 blur-3xl rounded-[3rem]"></div>
                            <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white aspect-video bg-slate-900 flex items-center justify-center group-hover:scale-[1.01] transition-transform duration-500">
                                <img 
                                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=2070&auto=format&fit=crop" 
                                    className="w-full h-full object-cover opacity-50" 
                                    alt="Academy Dashboard" 
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <button className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-emerald-600 shadow-2xl hover:scale-110 transition duration-300">
                                        <Play className="w-10 h-10 ml-1 fill-current" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </header>

                {/* Personas Section */}
                <section id="stages" className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <motion.h2 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight"
                        >
                            Designed for Every Stage of the Journey
                        </motion.h2>
                        <motion.p 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.1 }}
                            className="text-lg text-slate-500 max-w-2xl mx-auto mb-20 font-medium"
                        >
                            We help you bridge the gap between "having an idea" and "having a business."
                        </motion.p>
                        
                        <div className="grid md:grid-cols-3 gap-12">
                            {[
                                {
                                    title: "The Aspiring Creator",
                                    desc: "You have the skills but don't know how to package them into a product that sells itself.",
                                    img: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=2070&auto=format&fit=crop",
                                    color: "emerald"
                                },
                                {
                                    title: "The Side-Hustler",
                                    desc: "You're working 9-5 and need a structured, self-paced system to build your freedom machine.",
                                    img: "https://images.unsplash.com/photo-1484417894907-623942c8ee29?q=80&w=2064&auto=format&fit=crop",
                                    color: "teal"
                                },
                                {
                                    title: "The Marketing Pro",
                                    desc: "You're already in the game but need to stay ahead of AI, algorithms, and modern funnel strategies.",
                                    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
                                    color: "cyan"
                                }
                            ].map((stage, i) => (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                    transition={{ delay: i * 0.1 }}
                                    className="text-center group"
                                >
                                    <div className="mb-8 relative inline-block">
                                        <div className="w-56 h-56 rounded-[2.5rem] overflow-hidden shadow-2xl group-hover:rotate-2 transition-transform duration-500">
                                            <img src={stage.img} className="w-full h-full object-cover" alt={stage.title} />
                                        </div>
                                        <div className="absolute -bottom-4 -right-4 w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center text-white shadow-xl transform group-hover:scale-110 transition-transform">
                                            <Plus className="w-8 h-8" />
                                        </div>
                                    </div>
                                    <h3 className="text-2xl font-black mb-4 text-slate-900 tracking-tight">{stage.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium px-4">{stage.desc}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section - Dark Green */}
                <section className="py-32 bg-[#064e3b] text-white relative overflow-hidden rounded-t-[4rem]">
                    <div className="absolute top-0 right-0 w-1/3 h-full bg-emerald-400/10 blur-[120px]"></div>
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="flex flex-col lg:flex-row gap-20 items-center">
                            <div className="lg:w-1/2">
                                <motion.h2 
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                    className="text-4xl md:text-5xl font-black mb-12 leading-tight tracking-tight"
                                >
                                    A Learning Library That <br/>
                                    <span className="text-emerald-400 italic">Never Sleeps.</span>
                                </motion.h2>
                                
                                <div className="space-y-12">
                                    {[
                                        { 
                                            icon: Clock, 
                                            title: "100% Self-Paced", 
                                            desc: "Life happens. Our platform lets you pause, rewind, and fast-forward your education on your terms. No deadlines, no pressure.",
                                            color: "text-emerald-400"
                                        },
                                        { 
                                            icon: RefreshCw, 
                                            title: "Continuous Updates", 
                                            desc: "Marketing changes weekly. We ship new course modules every single month to ensure you're never learning outdated strategies.",
                                            color: "text-teal-400"
                                        },
                                        { 
                                            icon: ShieldCheck, 
                                            title: "Lifetime Access", 
                                            desc: "Join once, keep it forever. As we add more courses to the library, your investment grows in value without paying more.",
                                            color: "text-cyan-400"
                                        }
                                    ].map((feature, i) => (
                                        <motion.div 
                                            key={i}
                                            initial="hidden"
                                            whileInView="visible"
                                            viewport={{ once: true }}
                                            variants={fadeInUp}
                                            transition={{ delay: i * 0.1 }}
                                            className="flex gap-8 group"
                                        >
                                            <div className="shrink-0 w-16 h-16 rounded-[1.5rem] bg-white/5 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                                <feature.icon className="w-8 h-8" />
                                            </div>
                                            <div>
                                                <h4 className="text-2xl font-bold mb-3 tracking-tight">{feature.title}</h4>
                                                <p className="text-emerald-100/60 leading-relaxed font-medium">{feature.desc}</p>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                            
                            <div className="lg:w-1/2">
                                <motion.div 
                                    initial={{ opacity: 0, x: 50 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    className="p-10 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-sm shadow-3xl"
                                >
                                    <div className="flex items-center justify-between mb-10">
                                        <span className="text-xs font-black text-emerald-400 uppercase tracking-widest">Library Growth Analysis</span>
                                        <span className="bg-emerald-500/20 text-emerald-400 px-3 py-1 rounded-full text-[10px] font-black">+12 MODULES/MO</span>
                                    </div>
                                    <div className="flex items-end gap-3 h-72">
                                        {[40, 55, 50, 70, 95, 100].map((h, i) => (
                                            <div 
                                                key={i} 
                                                className={`flex-1 rounded-t-2xl transition-all duration-1000 ${i === 5 ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.4)]' : 'bg-white/10'}`}
                                                style={{ height: `${h}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                    <p className="mt-10 text-center text-emerald-100/40 text-xs font-bold uppercase tracking-widest">Real-time content volume & impact tracking</p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Curriculum Grid */}
                <section id="curriculum" className="py-32 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-24">
                            <motion.h2 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-4xl md:text-6xl font-black text-slate-900 mb-8 uppercase tracking-tighter"
                            >
                                What You'll Learn <span className="text-emerald-600">Inside</span>
                            </motion.h2>
                            <div className="w-24 h-2 bg-emerald-600 mx-auto rounded-full"></div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {[
                                {
                                    phase: "Phase 01",
                                    title: "Digital Product Ideation",
                                    desc: "Learn how to find high-demand niches and validate your product ideas before spending a dime on development.",
                                    items: ["Market Research Blueprints", "Competitor Analysis", "The MVP Framework"]
                                },
                                {
                                    phase: "Phase 02",
                                    title: "High-Conversion Funnels",
                                    desc: "Master the art of psychological triggers and landing page design that turns visitors into recurring customers.",
                                    items: ["Copywriting for Sales", "Technical Funnel Setup", "Upsell & Retention Logic"]
                                },
                                {
                                    phase: "Phase 03",
                                    title: "Traffic & Acquisition",
                                    desc: "Whether it's organic social or paid ads, learn the repeatable systems for getting eyes on your offer.",
                                    items: ["SEO Mastery 2026", "Paid Media Frameworks", "Viral Content Engines"]
                                }
                            ].map((module, i) => (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl shadow-slate-200/50 hover:border-emerald-500/50 transition-all duration-300 relative overflow-hidden"
                                >
                                    <div className="text-xs font-black text-emerald-600 uppercase tracking-widest mb-6">{module.phase}</div>
                                    <h3 className="text-2xl font-black mb-6 text-slate-900 leading-tight">{module.title}</h3>
                                    <p className="text-slate-500 mb-8 font-medium leading-relaxed">{module.desc}</p>
                                    <ul className="space-y-4">
                                        {module.items.map((item, j) => (
                                            <li key={j} className="flex items-center gap-3 text-sm font-bold text-slate-700">
                                                <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                </div>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </motion.div>
                            ))}
                        </div>

                        <motion.div 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="mt-20 p-10 rounded-[3rem] border-4 border-dashed border-emerald-100 bg-emerald-50/30 text-center"
                        >
                            <p className="text-slate-900 font-bold text-xl">
                                Plus: New courses added <span className="bg-emerald-600 text-white px-4 py-1.5 rounded-2xl italic mx-1">monthly</span> on AI Automation, Email Marketing, and SaaS Building.
                            </p>
                        </motion.div>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-32 bg-slate-50">
                    <div className="max-w-4xl mx-auto px-6">
                        <motion.h2 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-4xl font-black text-center mb-20 uppercase tracking-tighter"
                        >
                            Questions? <span className="text-emerald-600">We have answers.</span>
                        </motion.h2>
                        <div className="space-y-6">
                            {[
                                {
                                    q: "How long do I have access to the courses?",
                                    a: "Forever. Once you join Digital Academy, you have lifetime access to all current and future curriculum additions at no extra cost."
                                },
                                {
                                    q: "Is this for beginners or experts?",
                                    a: "Both. We structure our learning paths from 'Foundations' (getting your first $1k) to 'Scale' (hitting your first $100k month)."
                                },
                                {
                                    q: "Are there live sessions?",
                                    a: "While the core curriculum is self-paced, we host monthly 'Office Hours' where our expert instructors answer your specific business questions live."
                                }
                            ].map((faq, i) => (
                                <motion.div 
                                    key={i}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={{ once: true }}
                                    variants={fadeInUp}
                                    transition={{ delay: i * 0.1 }}
                                    className="p-8 rounded-[2rem] bg-white border border-slate-100 shadow-sm"
                                >
                                    <h4 className="font-black text-xl mb-4 text-slate-900">{faq.q}</h4>
                                    <p className="text-slate-600 font-medium leading-relaxed">{faq.a}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-40 bg-slate-900 text-white text-center relative overflow-hidden rounded-t-[5rem]">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full opacity-10 pointer-events-none">
                        <div className="w-full h-full bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-emerald-500/20 via-transparent to-transparent"></div>
                    </div>
                    <div className="max-w-5xl mx-auto px-4 relative z-10">
                        <motion.h2 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none uppercase"
                        >
                            Ready to start <br/> building <span className="text-emerald-500">for real?</span>
                        </motion.h2>
                        <motion.p 
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={fadeInUp}
                            transition={{ delay: 0.1 }}
                            className="text-xl text-slate-400 mb-16 max-w-2xl mx-auto font-medium"
                        >
                            Join 10,000+ creators who stopped making excuses and started making assets. Risk-free enrollment starts here.
                        </motion.p>
                        <div className="flex flex-col items-center gap-10">
                            <Link href="/sign-up">
                                <Button className="px-20 py-10 bg-emerald-600 text-white font-black text-3xl rounded-[2.5rem] hover:bg-emerald-700 transition-all transform hover:scale-105 shadow-3xl shadow-emerald-600/40 uppercase tracking-tighter border-none h-auto">
                                    I'm Ready to Enroll
                                </Button>
                            </Link>
                            <div className="flex items-center gap-4 text-emerald-400/60 text-sm font-black uppercase tracking-[0.2em]">
                                <span className="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></span> 
                                418 people joined in the last 24 hours
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-16 bg-slate-900 border-t border-white/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-10">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-600 rounded-2xl flex items-center justify-center font-black text-white text-xl">K</div>
                            <span className="font-black tracking-tighter text-white text-xl">K BUSINESS ACADEMY</span>
                        </div>
                        <nav className="flex flex-wrap justify-center gap-10">
                            <Link href="/blog" className="text-xs font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">Blog</Link>
                            <Link href="/locations" className="text-xs font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">Research Database</Link>
                            <Link href="/questions" className="text-xs font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">People Asked Questions</Link>
                            <Link href="/glossary" className="text-xs font-black text-slate-500 hover:text-emerald-400 transition-colors uppercase tracking-[0.2em]">Glossary</Link>
                        </nav>
                        <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">© 2026 K Business Academy</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
