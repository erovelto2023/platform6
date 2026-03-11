"use client";

import { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import { Bookmark, BookmarkX, Search, BookOpen } from "lucide-react";

interface SavedTerm {
    term: string;
    slug: string;
    savedAt: string;
}

export default function MyGlossaryPage() {
    const { isSignedIn, isLoaded, user } = useUser();
    const [bookmarks, setBookmarks] = useState<SavedTerm[]>([]);
    const [search, setSearch] = useState("");

    useEffect(() => {
        if (!isSignedIn) return;
        const meta = JSON.parse(localStorage.getItem("glossary-bookmarks-meta") || "{}");
        const items: SavedTerm[] = Object.values(meta);
        setBookmarks(items.sort((a: any, b: any) => new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime()));
    }, [isSignedIn]);

    const removeBookmark = (slug: string) => {
        const saved: string[] = JSON.parse(localStorage.getItem("glossary-bookmarks") || "[]");
        const updated = saved.filter(s => s !== slug);
        localStorage.setItem("glossary-bookmarks", JSON.stringify(updated));
        const meta = JSON.parse(localStorage.getItem("glossary-bookmarks-meta") || "{}");
        delete meta[slug];
        localStorage.setItem("glossary-bookmarks-meta", JSON.stringify(meta));
        setBookmarks(prev => prev.filter(b => b.slug !== slug));
    };

    const filtered = bookmarks.filter(b => b.term.toLowerCase().includes(search.toLowerCase()));

    if (!isLoaded) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-emerald-500 border-t-transparent rounded-full" />
        </div>
    );

    if (!isSignedIn) return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 text-center">
            <Bookmark size={48} className="text-slate-300" />
            <h1 className="text-3xl font-black text-slate-800 dark:text-white">My Saved Glossary</h1>
            <p className="text-slate-500 max-w-md">Sign in to access your personal collection of bookmarked glossary terms.</p>
            <Link href="/sign-in" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                Sign In to View Bookmarks
            </Link>
            <Link href="/glossary" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
                Browse the Glossary →
            </Link>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
            {/* Header */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-700 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 bg-white/10 rounded-full px-4 py-1.5 text-sm font-semibold mb-4">
                        <Bookmark size={16} />
                        Your Personal Library
                    </div>
                    <h1 className="text-4xl font-black mb-2">My Saved Glossary</h1>
                    <p className="text-emerald-100 text-lg">
                        {user?.firstName ? `Welcome back, ${user.firstName}!` : "Welcome back!"} You have <strong>{bookmarks.length}</strong> saved {bookmarks.length === 1 ? "term" : "terms"}.
                    </p>
                </div>
            </div>

            <div className="max-w-4xl mx-auto px-6 py-10">
                {/* Search */}
                {bookmarks.length > 0 && (
                    <div className="relative mb-8">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                        <input
                            type="text"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search your saved terms..."
                            className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none shadow-sm text-base"
                        />
                    </div>
                )}

                {/* Empty state */}
                {bookmarks.length === 0 && (
                    <div className="text-center py-20">
                        <BookOpen size={56} className="mx-auto text-slate-300 mb-6" />
                        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300 mb-2">No bookmarks yet</h2>
                        <p className="text-slate-500 mb-6">When you bookmark glossary terms, they'll appear here for quick access.</p>
                        <Link href="/glossary" className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-8 rounded-xl transition-colors">
                            Browse the Glossary
                        </Link>
                    </div>
                )}

                {/* Bookmarks grid */}
                {filtered.length > 0 && (
                    <div className="grid gap-4 sm:grid-cols-2">
                        {filtered.map(b => (
                            <div key={b.slug} className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-5 flex items-start justify-between group shadow-sm hover:shadow-md transition-shadow">
                                <div>
                                    <Link href={`/glossary/${b.slug}`} className="font-bold text-slate-800 dark:text-white text-lg hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors">
                                        {b.term}
                                    </Link>
                                    <p className="text-xs text-slate-400 mt-1">
                                        Saved {new Date(b.savedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                    </p>
                                </div>
                                <button
                                    onClick={() => removeBookmark(b.slug)}
                                    title="Remove bookmark"
                                    className="ml-4 text-slate-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 flex-shrink-0 mt-1"
                                >
                                    <BookmarkX size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* No search results */}
                {bookmarks.length > 0 && filtered.length === 0 && (
                    <div className="text-center py-12 text-slate-500">
                        No saved terms match &ldquo;{search}&rdquo;.
                    </div>
                )}

                <div className="mt-10 text-center">
                    <Link href="/glossary" className="text-sm text-emerald-600 dark:text-emerald-400 font-semibold hover:underline">
                        ← Back to Full Glossary
                    </Link>
                </div>
            </div>
        </div>
    );
}
