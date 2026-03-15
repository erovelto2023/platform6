"use client";

import { useState, useEffect } from "react";
import { useUser, SignInButton } from "@clerk/nextjs";
import { Bookmark, Share2, Check, BookmarkCheck, Lock, FileDown } from "lucide-react";

interface Props {
    slug: string;
    term: string;
}

export default function GlossaryActions({ slug, term }: Props) {
    const { isSignedIn, isLoaded } = useUser();
    const [bookmarked, setBookmarked] = useState(false);
    const [shared, setShared] = useState(false);
    const [showSignInPrompt, setShowSignInPrompt] = useState(false);

    const pageUrl = typeof window !== "undefined" ? window.location.href : `https://kbusinessacademy.com/glossary/${slug}`;

    useEffect(() => {
        if (!isSignedIn) return;
        const saved = JSON.parse(localStorage.getItem("glossary-bookmarks") || "[]");
        setBookmarked(saved.includes(slug));
    }, [slug, isSignedIn]);

    const handleBookmark = () => {
        if (!isSignedIn) { setShowSignInPrompt(true); return; }
        const saved: string[] = JSON.parse(localStorage.getItem("glossary-bookmarks") || "[]");
        let updated: string[];
        if (saved.includes(slug)) {
            updated = saved.filter((s) => s !== slug);
            setBookmarked(false);
        } else {
            updated = [...saved, slug];
            setBookmarked(true);
            // Also save metadata for the bookmarks page
            const meta = JSON.parse(localStorage.getItem("glossary-bookmarks-meta") || "{}");
            meta[slug] = { term, slug, savedAt: new Date().toISOString() };
            localStorage.setItem("glossary-bookmarks-meta", JSON.stringify(meta));
        }
        // Remove from meta if unbookmarking
        if (saved.includes(slug)) {
            const meta = JSON.parse(localStorage.getItem("glossary-bookmarks-meta") || "{}");
            delete meta[slug];
            localStorage.setItem("glossary-bookmarks-meta", JSON.stringify(meta));
        }
        localStorage.setItem("glossary-bookmarks", JSON.stringify(updated));
    };

    const handleShare = async () => {
        if (!isSignedIn) { setShowSignInPrompt(true); return; }
        const shareData = {
            title: `${term} – K Business Academy Glossary`,
            text: `Learn everything about ${term} on K Business Academy.`,
            url: pageUrl,
        };
        if (navigator.share) {
            try { await navigator.share(shareData); } catch (_) {}
        } else {
            await navigator.clipboard.writeText(pageUrl);
            setShared(true);
            setTimeout(() => setShared(false), 2500);
        }
    };

    if (!isLoaded) return null;

    return (
        <div className="space-y-3 mt-8">
            <button
                onClick={handleBookmark}
                className={`w-full py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 text-sm transition-all ${
                    bookmarked
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700"
                        : "bg-emerald-600 text-white hover:bg-emerald-700"
                }`}
            >
                {bookmarked ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
                {bookmarked ? "Bookmarked!" : "Bookmark Guide"}
            </button>
            <button
                onClick={handleShare}
                className="w-full py-3 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-colors border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
            >
                {shared ? <Check size={18} className="text-emerald-500" /> : <Share2 size={18} />}
                {shared ? "Link Copied!" : "Share Guide"}
            </button>
            <button
                onClick={() => window.print()}
                className="w-full py-3 px-4 rounded-xl border font-bold flex items-center justify-center gap-2 transition-colors border-slate-200 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm"
            >
                <FileDown size={18} />
                Save as PDF
            </button>

            {/* Sign-in prompt shown when guest tries to bookmark/share */}
            {showSignInPrompt && (
                <div className="mt-3 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-center">
                    <Lock size={20} className="mx-auto text-amber-500 mb-2" />
                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-3">
                        Create a free account to bookmark & share terms.
                    </p>
                    <SignInButton mode="modal">
                        <button className="w-full py-2 px-4 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg text-sm transition-colors">
                            Sign In / Sign Up Free
                        </button>
                    </SignInButton>
                    <button
                        onClick={() => setShowSignInPrompt(false)}
                        className="mt-2 text-xs text-amber-600 dark:text-amber-400 hover:underline"
                    >
                        Maybe later
                    </button>
                </div>
            )}
        </div>
    );
}
