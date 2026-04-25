"use client";

import React from "react";
import Link from "next/link";
import { 
    CircleCheck, 
    ArrowRight, 
    Mail, 
    Layout, 
    Users, 
    Rocket,
    Star,
    ShieldCheck
} from "lucide-react";
import { motion } from "framer-motion";

export default function ThankYouPage() {
    return (
        <div className="min-h-screen bg-[#FDFDFE] text-slate-900 font-sans selection:bg-emerald-100 selection:text-emerald-900 overflow-x-hidden">
            {/* Header / Logo */}
            <nav className="py-8 px-6 sm:px-10 absolute top-0 left-0 right-0 z-50">
                <div className="max-w-7xl mx-auto flex justify-center">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-emerald-500/20 group-hover:scale-110 transition-transform">K</div>
                        <span className="text-2xl font-black tracking-tight text-slate-900">K Business <span className="text-emerald-600">Academy</span></span>
                    </Link>
                </div>
            </nav>

            <main className="relative pt-44 pb-32 overflow-hidden flex flex-col items-center">
                {/* Visual Elements */}
                <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-emerald-100/30 rounded-full blur-[150px] -z-10 -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-100/20 rounded-full blur-[120px] -z-10 translate-y-1/2 -translate-x-1/2" />
                
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-xl shadow-emerald-500/10 border border-emerald-100"
                    >
                        <CircleCheck size={48} className="animate-pulse" />
                    </motion.div>
                    
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black text-slate-950 mb-8 leading-[0.95] tracking-tighter"
                    >
                        Thank you <br/>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600">for registering.</span>
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-16 leading-relaxed font-medium tracking-tight"
                    >
                        Check your email shortly we will be sending you information about the class. <br className="hidden md:block" />
                        Make sure to look for <span className="text-emerald-600 font-bold underline decoration-emerald-200">erovelto@outlook.com</span> for details.
                    </motion.p>



                        <div className="bg-slate-50 border border-slate-100 rounded-[3rem] p-8 md:p-12 max-w-2xl mx-auto">
                            <p className="text-slate-500 font-bold mb-8 uppercase tracking-[0.2em] text-xs">Reach out if you have any issues</p>
                            <div className="flex flex-col sm:flex-row justify-center gap-6">
                                <a 
                                    href="https://www.facebook.com/erovelto" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                                >
                                    <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                                    </div>
                                    <span className="font-black tracking-tight">Facebook</span>
                                </a>
                                <a 
                                    href="https://www.tiktok.com/@kbusinessacademy" 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-8 py-4 bg-white border border-slate-200 rounded-2xl hover:bg-emerald-50 hover:border-emerald-200 transition-all group"
                                >
                                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center group-hover:bg-emerald-600 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"/></svg>
                                    </div>
                                    <span className="font-black tracking-tight">TikTok</span>
                                </a>
                            </div>
                        </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="mt-32 pt-16 border-t border-slate-100 flex flex-wrap items-center justify-center gap-10 text-slate-400"
                    >
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <ShieldCheck size={18} className="text-emerald-500" />
                            Official Enrollment
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Star size={18} className="text-amber-500 fill-amber-500" />
                            Elite Community Access
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                            <Users size={18} className="text-indigo-500" />
                            24/7 Priority Support
                        </div>
                    </motion.div>
                </div>
            </main>

            <footer className="py-20 bg-white border-t border-slate-100">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-400 text-sm font-medium">&copy; 2024-2026 K Business Academy. Strategic Growth Initiative.</p>
                </div>
            </footer>

            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap');
                
                body {
                    font-family: 'Plus Jakarta Sans', sans-serif;
                    -webkit-font-smoothing: antialiased;
                }
            `}</style>
        </div>
    );
}
