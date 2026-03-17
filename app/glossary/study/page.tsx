"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, RotateCcw, ChevronLeft, ChevronRight, CheckCircle2, Bookmark, Flame, Zap, Trophy, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Flashcard {
    term: string;
    slug: string;
    description: string;
    category: string;
}

export default function StudyModePage() {
    const [allTerms, setAllTerms] = useState<Flashcard[]>([]);
    const [bookmarkedKeys, setBookmarkedKeys] = useState<string[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);
    const [masteredSlugs, setMasteredSlugs] = useState<string[]>([]);

    useEffect(() => {
        const load = async () => {
            try {
                // Fetch all glossary terms for flashcard content
                const res = await fetch("/api/glossary-all");
                const data = await res.json();
                
                // Get bookmarks/mastered from localStorage
                const bookmarks = JSON.parse(localStorage.getItem("glossary-bookmarks") || "[]");
                const mastered = JSON.parse(localStorage.getItem("glossary-mastered") || "[]");
                
                setBookmarkedKeys(bookmarks);
                setMasteredSlugs(mastered);
                
                // Only show terms that are bookmarked or mastered for study
                const studyList = data.filter((t: any) => bookmarks.includes(t.slug) || mastered.includes(t.slug));
                setAllTerms(studyList);
                setLoading(false);
            } catch (err) {
                console.error("Study Mode failed to load:", err);
                setLoading(false);
            }
        };
        load();
    }, []);

    const toggleMastered = (slug: string) => {
        const updated = masteredSlugs.includes(slug)
            ? masteredSlugs.filter(s => s !== slug)
            : [...masteredSlugs, slug];
        
        localStorage.setItem("glossary-mastered", JSON.stringify(updated));
        setMasteredSlugs(updated);
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center text-slate-500 font-bold">Loading Flashcards...</div>;

    if (allTerms.length === 0) {
        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-3xl flex items-center justify-center mb-6">
                    <Bookmark size={40} />
                </div>
                <h1 className="text-3xl font-black mb-4 dark:text-white">Your Study Library is Empty</h1>
                <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
                    Bookmark or mark glossary terms as "Mastered" to see them here for study and review.
                </p>
                <Link 
                    href="/glossary"
                    className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-lg shadow-emerald-600/20 transition-all"
                >
                    Browse Glossary
                </Link>
            </div>
        );
    }

    const current = allTerms[currentIndex];
    const isMastered = masteredSlugs.includes(current.slug);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 p-6 pt-12 flex flex-col items-center">
            <div className="w-full max-w-4xl flex items-center justify-between mb-12">
                <Link 
                    href="/glossary"
                    className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 transition-colors font-bold group"
                >
                    <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    Exit Study Mode
                </Link>
                <div className="flex items-center gap-4">
                    <div className="text-xs font-black bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 px-3 py-1.5 rounded-full uppercase tracking-widest">
                        {currentIndex + 1} / {allTerms.length} Terms
                    </div>
                </div>
            </div>

            <div className="w-full max-w-2xl relative perspective-1000 h-[450px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentIndex}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="w-full h-full"
                    >
                        <div 
                            onClick={() => setIsFlipped(!isFlipped)}
                            className={`relative w-full h-full transition-transform duration-700 transform-style-3d cursor-pointer ${isFlipped ? 'rotate-y-180' : ''}`}
                        >
                            {/* Front of Card */}
                            <div className="absolute inset-0 backface-hidden bg-white dark:bg-slate-800 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-700 shadow-2xl flex flex-col items-center justify-center p-12 overflow-hidden group">
                                <div className="absolute top-0 right-0 p-8">
                                    <HelpCircle className="text-slate-200 dark:text-slate-700" size={100} />
                                </div>
                                <div className="text-xs font-black text-emerald-500 uppercase tracking-[0.3em] mb-4">Glossary Term</div>
                                <h2 className="text-5xl font-black text-slate-900 dark:text-white text-center leading-tight">
                                    {current.term}
                                </h2>
                                <div className="mt-12 text-sm font-bold text-slate-400 flex items-center gap-2">
                                    <Zap size={16} className="text-amber-500" />
                                    Click to Reveal Definition
                                </div>
                            </div>

                            {/* Back of Card */}
                            <div className="absolute inset-0 backface-hidden bg-emerald-600 rounded-[2.5rem] p-12 border-4 border-emerald-500 shadow-2xl rotate-y-180 flex flex-col items-center justify-center">
                                <div className="text-xs font-black text-emerald-200 uppercase tracking-[0.3em] mb-6">Definition</div>
                                <div className="text-xl md:text-2xl font-bold text-white text-center leading-relaxed">
                                    {current.description}
                                </div>
                                <div className="mt-12 text-sm font-bold text-emerald-200">
                                    Click to flip back
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="w-full max-w-2xl mt-12 grid grid-cols-3 gap-4">
                <button
                    onClick={() => {
                        setCurrentIndex((prev) => (prev > 0 ? prev - 1 : allTerms.length - 1));
                        setIsFlipped(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors group shadow-sm"
                >
                    <ChevronLeft className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Previous</span>
                </button>

                <button
                    onClick={() => toggleMastered(current.slug)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-3xl border transition-all shadow-lg ${
                        isMastered
                            ? "bg-emerald-600 border-emerald-500 text-white shadow-emerald-500/20"
                            : "bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400 hover:border-emerald-500 hover:text-emerald-500"
                    }`}
                >
                    <CheckCircle2 size={24} />
                    <span className="text-xs font-black uppercase tracking-widest">{isMastered ? "Mastered" : "In Progress"}</span>
                </button>

                <button
                    onClick={() => {
                        setCurrentIndex((prev) => (prev < allTerms.length - 1 ? prev + 1 : 0));
                        setIsFlipped(false);
                    }}
                    className="flex flex-col items-center gap-2 p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors group shadow-sm"
                >
                    <ChevronRight className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400">Next Term</span>
                </button>
            </div>

            {/* Progress Stats */}
            <div className="w-full max-w-2xl mt-8 grid grid-cols-2 gap-4">
                <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 text-blue-600 rounded-xl flex items-center justify-center">
                            <RotateCcw size={20} />
                        </div>
                        <div className="text-sm font-bold text-slate-600 dark:text-slate-300">Terms to Review</div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">{allTerms.length - masteredSlugs.filter(s => allTerms.some(t => t.slug === s)).length}</div>
                </div>
                <div className="p-6 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 rounded-xl flex items-center justify-center">
                            <Trophy size={20} />
                        </div>
                        <div className="text-sm font-bold text-slate-600 dark:text-slate-300">Mastery Achievement</div>
                    </div>
                    <div className="text-2xl font-black text-slate-900 dark:text-white">
                        {Math.round((masteredSlugs.filter(s => allTerms.some(t => t.slug === s)).length / allTerms.length) * 100)}%
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
