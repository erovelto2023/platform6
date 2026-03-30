"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
    BookOpen, Library, GraduationCap, ArrowRight, CheckCircle2,
    Facebook, Youtube, FileText, Search, Database, Archive, Sparkles
} from "lucide-react";

export default function LibraryPage() {
    const heroSlides = [
        {
            title: 'Foundational Business Intelligence',
            subtitle: 'Access the curated research, foundational texts, and strategic archives that power high-level business decisions.',
            backgroundImage: '/heroimages/library_premium.png',
            ctaText: 'Access Archive',
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
            {/* Navbar - Professional Educational Theme */}
            <header className="px-6 lg:px-10 h-20 flex items-center border-b border-[#bc6c25]/20 bg-[#fefae0]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-[#283618]">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#606c38] rounded-xl flex items-center justify-center text-[#fefae0] shadow-lg shadow-[#606c38]/20 transition-transform hover:scale-105">
                            K
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-black tracking-tight">K BUSINESS</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Academy</span>
                        </div>
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-8 hidden md:flex">
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-bold text-[#606c38] border-b-2 border-[#606c38]" href="/library">
                        Library
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/business-resources">
                        Resources
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/affiliate-crm">
                        Affiliate CRM
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/blog">
                        Blog
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/locations">
                        Intelligence
                    </Link>
                    <div className="h-6 w-px bg-[#283618]/10 mx-2" />
                    <Link href="/sign-in">
                        <Button variant="ghost" className="text-[#283618] font-bold hover:bg-[#606c38]/5">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="bg-[#606c38] hover:bg-[#283618] text-[#fefae0] px-6 h-11 rounded-xl shadow-xl shadow-[#606c38]/20 transition-all font-bold">
                            Get Access
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Library Introduction */}
                <section className="w-full py-24 bg-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="max-w-4xl mx-auto text-center mb-20">
                            <motion.div
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                            >
                                <span className="text-[#bc6c25] font-black uppercase tracking-widest text-xs mb-4 block">Central Knowledge Base</span>
                                <h2 className="text-4xl md:text-5xl font-black text-[#283618] mb-8 leading-tight">
                                    A Repository of High-Leverage Information.
                                </h2>
                                <p className="text-xl text-[#283618]/60 leading-relaxed">
                                    The Academy Library is more than a collection of PDFs. It is a curated, systematic archive of the research and foundational models required to build a resilient business in any climate.
                                </p>
                            </motion.div>
                        </div>

                        <motion.div
                            variants={staggerContainer}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            className="grid md:grid-cols-3 gap-12"
                        >
                            <div className="group">
                                <div className="w-16 h-16 bg-[#606c38] rounded-2xl flex items-center justify-center text-[#fefae0] mb-8 shadow-xl transition-transform group-hover:rotate-6">
                                    <Archive size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-[#283618] mb-4">Strategic Archives</h3>
                                <p className="text-[#283618]/70 leading-relaxed mb-6">
                                    Comprehensive case studies and longitudinal research on successful business models, market cycles, and historical winners.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-bold text-[#606c38]"><CheckCircle2 size={16} /> Historical Market Analysis</li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-[#606c38]"><CheckCircle2 size={16} /> Performance Benchmarks</li>
                                </ul>
                            </div>

                            <div className="group">
                                <div className="w-16 h-16 bg-[#bc6c25] rounded-2xl flex items-center justify-center text-[#fefae0] mb-8 shadow-xl transition-transform group-hover:-rotate-6">
                                    <Database size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-[#283618] mb-4">Technical Blueprints</h3>
                                <p className="text-[#283618]/70 leading-relaxed mb-6">
                                    The "How-To" documents of the heavyweights. Exact specifications for building teams, systems, and content engines.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-bold text-[#bc6c25]"><CheckCircle2 size={16} /> SOP Frameworks</li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-[#bc6c25]"><CheckCircle2 size={16} /> Hiring Blueprints</li>
                                </ul>
                            </div>

                            <div className="group">
                                <div className="w-16 h-16 bg-[#283618] rounded-2xl flex items-center justify-center text-[#fefae0] mb-8 shadow-xl transition-transform group-hover:rotate-12">
                                    <GraduationCap size={32} />
                                </div>
                                <h3 className="text-2xl font-black text-[#283618] mb-4">Mastery Reading</h3>
                                <p className="text-[#283618]/70 leading-relaxed mb-6">
                                    A curated selection of the most impactful business and strategy books, summarized and annotated for immediate application.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-center gap-2 text-sm font-bold text-[#283618]"><CheckCircle2 size={16} /> Annotated Summaries</li>
                                    <li className="flex items-center gap-2 text-sm font-bold text-[#283618]"><CheckCircle2 size={16} /> Direct Insights</li>
                                </ul>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Secondary CTA Section */}
                <section className="w-full py-24 bg-[#606c38] text-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row items-center gap-16">
                            <div className="md:w-1/2">
                                <h2 className="text-4xl font-black mb-8 leading-tight">Information Without Execution is Noise.</h2>
                                <p className="text-xl opacity-80 mb-10 leading-relaxed">
                                    The Academy Library is designed for the operator. We filter through 99% of the noise to give you the 1% of information that actually shifts the needle.
                                </p>
                                <Link href="/sign-up">
                                    <Button className="bg-[#fefae0] text-[#606c38] hover:bg-[#dda15e] hover:text-[#283618] px-10 h-16 rounded-2xl font-black text-lg transition-all shadow-2xl">
                                        Unlock the Vault
                                    </Button>
                                </Link>
                            </div>
                            <div className="md:w-1/2 grid grid-cols-2 gap-4">
                                <div className="bg-[#fefae0]/10 p-8 rounded-3xl border border-[#fefae0]/10 backdrop-blur-sm">
                                    <Search className="text-[#dda15e] mb-4" size={32} />
                                    <h4 className="font-black text-lg mb-2">Searchable</h4>
                                    <p className="text-sm opacity-60">Instantly find the data you need across our entire archive.</p>
                                </div>
                                <div className="bg-[#fefae0]/10 p-8 rounded-3xl border border-[#fefae0]/10 backdrop-blur-sm mt-8">
                                    <Sparkles className="text-[#dda15e] mb-4" size={32} />
                                    <h4 className="font-black text-lg mb-2">Exclusive</h4>
                                    <p className="text-sm opacity-60">Proprietary research available only to Academy members.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Professional Theme */}
            <footer className="py-12 bg-[#283618] text-[#fefae0]/50 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8 text-center md:text-left">
                        <div>
                            <div className="flex items-center gap-2 mb-4 justify-center md:justify-start">
                                <div className="w-8 h-8 bg-[#606c38] rounded flex items-center justify-center font-black text-[#fefae0]">K</div>
                                <span className="font-bold tracking-tighter text-[#fefae0]">K BUSINESS ACADEMY</span>
                            </div>
                            <p className="max-w-xs text-xs opacity-60">Providing the foundational mechanics and strategic intelligence for the next generation of business leaders.</p>
                        </div>
                        <nav className="flex gap-8">
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Resources</Link>
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Methodology</Link>
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Privacy</Link>
                            <Link href="#" className="text-sm font-bold hover:text-[#dda15e] transition-colors">Terms</Link>
                        </nav>
                        <div className="flex gap-4">
                            <Link href="https://facebook.com/erovelto" target="_blank" className="bg-[#fefae0]/5 p-3 rounded-full hover:bg-[#606c38] transition-colors"><Facebook size={20} className="text-[#fefae0]" /></Link>
                            <Link href="https://youtube.com/@KBusinessAcademy" target="_blank" className="bg-[#fefae0]/5 p-3 rounded-full hover:bg-[#606c38] transition-colors"><Youtube size={20} className="text-[#fefae0]" /></Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}
