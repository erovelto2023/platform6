"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { motion } from "framer-motion";
import {
    BookOpen, Library, GraduationCap, ArrowRight, CheckCircle2,
    Facebook, Youtube, FileText
} from "lucide-react";

export default function LibraryPage() {
    const heroSlides = [
        {
            title: 'Knowledge is Leverage.',
            subtitle: 'Books, guides, and resources to expand your education.',
            backgroundImage: '/heroimages/eab09a8e-8f04-4422-9e63-e49b80dce334.png',
            ctaText: 'Start Learning',
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
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Navbar - copied from landing page for consistency */}
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
                    <Link className="text-sm font-medium text-purple-400 hover:text-white transition-colors" href="/library">
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
                <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

                <section className="w-full py-20 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[100px]" />
                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="max-w-4xl mx-auto text-center">
                            <motion.h2
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-3xl md:text-5xl font-bold mb-6 text-white"
                            >
                                Expand Your Education
                            </motion.h2>
                            <motion.p
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                variants={fadeInUp}
                                className="text-xl text-slate-400 mb-12"
                            >
                                Access a vast library of books, guides, and strategic resources designed to help you master the game of business.
                            </motion.p>

                            <motion.div
                                variants={staggerContainer}
                                initial="hidden"
                                whileInView="visible"
                                viewport={{ once: true }}
                                className="grid md:grid-cols-3 gap-8 text-left"
                            >
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-purple-500/50 transition-all">
                                    <BookOpen className="h-10 w-10 text-purple-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Recommended Books</h3>
                                    <p className="text-slate-400 text-sm">Curated reading lists that have shaped successful entrepreneurs.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all">
                                    <FileText className="h-10 w-10 text-blue-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">In-Depth Guides</h3>
                                    <p className="text-slate-400 text-sm">Step-by-step manuals on specific business models and strategies.</p>
                                </div>
                                <div className="bg-slate-800/50 p-6 rounded-xl border border-slate-700 hover:border-pink-500/50 transition-all">
                                    <GraduationCap className="h-10 w-10 text-pink-400 mb-4" />
                                    <h3 className="text-xl font-bold text-white mb-2">Educational Resources</h3>
                                    <p className="text-slate-400 text-sm">Worksheets, checklists, and references to aid your learning.</p>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </section>

                <section className="w-full py-24 bg-slate-950 border-t border-slate-800">
                    <div className="container px-4 md:px-6 mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-8">Start Your Learning Journey</h2>
                        <Link href="/sign-up">
                            <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100 rounded-full px-8 text-lg font-semibold">
                                Unlock the Library <ArrowRight className="ml-2 h-5 w-5" />
                            </Button>
                        </Link>
                    </div>
                </section>
            </main>

            <footer className="flex flex-col gap-4 sm:flex-row py-10 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800 bg-slate-950">
                <p className="text-sm text-slate-500">© 2025 K Business Academy. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-6 items-center">
                    <Link
                        href="https://www.facebook.com/erovelto"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-blue-500 transition-colors flex items-center gap-2"
                    >
                        <Facebook className="h-5 w-5" />
                        <span className="hidden sm:inline text-xs font-medium">Facebook</span>
                    </Link>
                    <Link
                        href="https://www.youtube.com/@KBusinessAcademy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-slate-500 hover:text-red-500 transition-colors flex items-center gap-2"
                    >
                        <Youtube className="h-5 w-5" />
                        <span className="hidden sm:inline text-xs font-medium">YouTube</span>
                    </Link>
                    <Link className="text-sm text-slate-500 hover:text-white transition-colors" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-sm text-slate-500 hover:text-white transition-colors" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
