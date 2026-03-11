import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import GlossaryClient from "./glossary-client";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Make Money Online Glossary - 100+ Terms & Paths",
    description: "Explore 100+ business and marketing terms, strategies, and methodologies for building your income online.",
};

export default async function GlossaryPage() {
    console.log("=== SERVER-SIDE GLOSSARY PAGE LOADING ===");
    
    try {
        const result = await getGlossaryTerms() as any;
        const terms = result?.terms || [];
        
        console.log("Server-side - Raw result from database:", result);
        console.log("Server-side - Number of terms:", terms.length);
        
        if (terms.length === 0) {
            console.log("Server-side - No terms found, returning empty state");
            return (
                <div className="min-h-screen transition-colors duration-300 bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-white">
                    <header className="max-w-6xl mx-auto px-6 py-16 text-center">
                        <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Internet Marketing</span> & Online Business Terms
                        </h1>
                        <p className="text-xl mb-10 max-w-2xl mx-auto text-slate-600 dark:text-slate-400">
                            Your definitive reference for digital marketing, affiliate marketing, and online business — simplified and searchable.
                        </p>
                    </header>
                    
                    <main className="max-w-6xl mx-auto px-6">
                        <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl dark:bg-slate-800/50 dark:border-slate-700">
                            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">No Glossary Terms Available</h3>
                            <p className="text-slate-500 dark:text-slate-400">
                                The glossary is currently empty. Please check back later for new terms.
                            </p>
                        </div>
                    </main>
                </div>
            );
        }

        // Explicitly derive categories
        const categorySet = new Set<string>();
        terms.forEach((t: any) => {
            categorySet.add(String(t.category || "General"));
        });
        const categories: string[] = Array.from(categorySet).sort();

        console.log("Server-side - Categories derived:", categories);
        console.log("Server-side - Passing to client component");

        return <GlossaryClient initialTerms={terms} categories={categories} />;
        
    } catch (error) {
        console.error("Server-side error loading glossary:", error);
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Glossary</h1>
                    <p className="text-red-500">{(error as Error).message}</p>
                </div>
            </div>
        );
    }
}
