"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
    FileText, Download, Zap, Layout, Settings, Layers,
    CheckCircle2, ArrowRight, ShieldCheck, Cpu, Box, PenTool
} from "lucide-react";
import { SiteHeader } from "@/components/shared/SiteHeader";

export default function BusinessResourcesPage() {
    const heroSlides = [
        {
            title: 'Operational Speed & Systems',
            subtitle: 'The literal templates, spreadsheets, and SOPs used to operate at the 1% level. Built for immediate deployment.',
            backgroundImage: '/heroimages/resources_premium.png',
            ctaText: 'Deploy Systems',
            ctaLink: '/sign-up',
        }
    ];

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
        <div className="flex flex-col min-h-screen bg-[#fefae0]">
            <SiteHeader />

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Tactical Toolkit Section */}
                <section className="w-full py-24 bg-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row gap-16 items-start">
                            <motion.div 
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="md:w-1/2"
                            >
                                <span className="inline-block py-1 px-4 rounded-full bg-[#dda15e]/10 text-[#bc6c25] text-xs font-black tracking-widest mb-6">OPERATIONAL ASSETS</span>
                                <h2 className="text-4xl md:text-5xl font-black text-[#283618] mb-8 leading-[1.1]">
                                    Move Faster with Proven Infrastructure.
                                </h2>
                                <p className="text-xl text-[#283618]/70 leading-relaxed mb-8">
                                    Why build from scratch when you can deploy what already works? Our resource hub provides the tactical infrastructure required to scale without the structural debt.
                                </p>
                                
                                <div className="space-y-6">
                                    {[
                                        { title: "Financial Calculators", desc: "Model your growth, margins, and LTV with absolute precision." },
                                        { title: "Hiring Workflows", desc: "The exact sequence to vet, onboard, and manage top-tier talent." },
                                        { title: "Legal & Ethical Frameworks", desc: "Blueprints for protecting your assets and building with integrity." }
                                    ].map((item, i) => (
                                        <div key={i} className="flex gap-4 p-4 rounded-2xl border border-[#283618]/5 hover:bg-[#e2e7d1] transition-all">
                                            <div className="w-12 h-12 bg-[#606c38] rounded-xl flex items-center justify-center text-[#fefae0] shrink-0">
                                                <CheckCircle2 size={24} />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-[#283618]">{item.title}</h4>
                                                <p className="text-sm text-[#283618]/60">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>

                            <motion.div 
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                className="md:w-1/2 grid grid-cols-1 sm:grid-cols-2 gap-6"
                            >
                                {[
                                    { icon: Cpu, title: "Automation Scripts", color: "#606c38" },
                                    { icon: Layout, title: "Landing Page JSONs", color: "#dda15e" },
                                    { icon: Settings, title: "Backend SOPs", color: "#bc6c25" },
                                    { icon: Box, title: "Supply Chain Models", color: "#283618" },
                                    { icon: PenTool, title: "Content Blueprints", color: "#606c38" },
                                    { icon: Layers, title: "Tech Stack Maps", color: "#dda15e" }
                                ].map((item, i) => (
                                    <div key={i} className="bg-white p-8 rounded-[2rem] border border-[#283618]/5 shadow-sm hover:shadow-xl hover:scale-[1.02] transition-all">
                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 text-white" style={{ backgroundColor: item.color }}>
                                            <item.icon size={24} />
                                        </div>
                                        <h3 className="font-black text-[#283618] text-lg mb-2">{item.title}</h3>
                                        <div className="flex items-center gap-1 text-[#bc6c25] text-xs font-bold uppercase tracking-widest">
                                            <span>Member Exclusive</span>
                                            <ArrowRight size={12} />
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Action-Oriented Bottom Section */}
                <section className="w-full py-24 bg-[#283618] text-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-[#606c38] rounded-[4rem] p-12 md:p-24 relative overflow-hidden">
                            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-[#bc6c25]/30 rounded-full blur-[100px]" />
                            <div className="relative z-10 max-w-2xl">
                                <span className="flex items-center gap-2 text-[#dda15e] font-black tracking-[0.3em] text-xs mb-8 uppercase">
                                    <ShieldCheck size={16} /> Elite Support
                                </span>
                                <h2 className="text-4xl md:text-6xl font-black mb-10 leading-tight">Stop Wasting Time on Repetitive Work.</h2>
                                <p className="text-xl opacity-70 mb-12 leading-relaxed">
                                    We provide the "skeleton" of the business. You provide the vision. Join K Business Academy to gain instant access to our entire internal toolset.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-6">
                                    <Link href="/sign-up">
                                        <Button className="bg-[#bc6c25] hover:bg-[#dda15e] text-[#fefae0] h-16 px-12 rounded-2xl font-black text-xl shadow-2xl transition-all">
                                            Join the Academy
                                        </Button>
                                    </Link>
                                    <Link href="/courses">
                                        <Button variant="outline" className="border-[#fefae0]/20 text-[#fefae0] hover:bg-[#fefae0]/10 h-16 px-12 rounded-2xl font-black text-xl backdrop-blur-md">
                                            View Methodology
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Professional Theme */}
            <footer className="py-12 bg-[#283618] text-[#fefae0]/50 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
                            <div className="w-8 h-8 bg-[#606c38] rounded flex items-center justify-center font-black text-[#fefae0]">K</div>
                            <span className="font-bold tracking-tighter">K BUSINESS ACADEMY</span>
                        </div>
                        <nav className="flex gap-10">
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors">Tactical Tools</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors">Archives</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors">Privacy</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors">Support</Link>
                        </nav>
                        <p className="text-xs font-medium uppercase tracking-widest">© 2026 K Business Academy</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
