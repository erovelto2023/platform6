"use client";

import { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { CheckSquare, Square, Lock } from "lucide-react";
import { SignInButton } from "@clerk/nextjs";

interface Props {
    slug: string;
    term: string;
}

const KEY = "glossary-mastered";

export default function GlossaryProgressTracker({ slug, term }: Props) {
    const { isSignedIn, isLoaded } = useUser();
    const [mastered, setMastered] = useState(false);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        if (!isSignedIn) return;
        const saved: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
        setMastered(saved.includes(slug));
    }, [slug, isSignedIn]);

    const toggle = () => {
        if (!isSignedIn) { setShowPrompt(true); return; }
        const saved: string[] = JSON.parse(localStorage.getItem(KEY) || "[]");
        const updated = saved.includes(slug)
            ? saved.filter(s => s !== slug)
            : [...saved, slug];
        localStorage.setItem(KEY, JSON.stringify(updated));
        setMastered(!mastered);
    };

    if (!isLoaded) return null;

    return (
        <div className="mt-4">
            <button
                onClick={toggle}
                className={`flex items-center gap-2 text-sm font-bold px-4 py-2.5 rounded-xl border transition-all w-full justify-center ${
                    mastered
                        ? "bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-900/30 dark:border-emerald-700 dark:text-emerald-300"
                        : "border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-emerald-400 hover:text-emerald-600"
                }`}
            >
                {mastered ? <CheckSquare size={16} /> : <Square size={16} />}
                {mastered ? "Mastered! ✓" : "Mark as Mastered"}
            </button>

            {showPrompt && (
                <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-center">
                    <Lock size={18} className="mx-auto text-amber-500 mb-2" />
                    <p className="text-xs font-semibold text-amber-800 dark:text-amber-300 mb-2">Sign in to track your progress.</p>
                    <SignInButton mode="modal">
                        <button className="w-full py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-xs">
                            Sign In Free
                        </button>
                    </SignInButton>
                    <button onClick={() => setShowPrompt(false)} className="mt-1 text-[10px] text-amber-500 hover:underline">Dismiss</button>
                </div>
            )}
        </div>
    );
}
