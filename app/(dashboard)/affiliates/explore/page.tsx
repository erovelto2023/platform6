"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Check, ArrowLeft, Building2, Tag } from "lucide-react";
import { useState, useEffect } from "react";
import { searchAffiliateCompanies, saveAffiliateCompanyForUser } from "@/lib/actions/affiliate-user.actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ExploreAffiliatesPage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
    const { user } = useUser();
    const router = useRouter();

    // Initial load
    useEffect(() => {
        handleSearch("");
    }, []);

    const handleSearch = async (q: string) => {
        setIsLoading(true);
        try {
            const data = await searchAffiliateCompanies(q);
            setResults(data);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (companyId: string) => {
        if (!user) return toast.error("Please sign in");

        // Optimistic update
        setSavedIds(prev => {
            const next = new Set(prev);
            next.add(companyId);
            return next;
        });

        try {
            await saveAffiliateCompanyForUser(user.id, companyId);
            toast.success("Added partner to your vault!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add partner");
            // Revert
            setSavedIds(prev => {
                const next = new Set(prev);
                next.delete(companyId);
                return next;
            });
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-blue-500 selection:text-slate-950">
            <div className="max-w-7xl mx-auto space-y-8">
                
                {/* HERO */}
                <div className="space-y-4">
                    <Link href="/affiliates" className="inline-flex items-center text-xs font-mono font-bold text-blue-400 hover:text-blue-300 transition">
                        <ArrowLeft className="h-4 w-4 mr-1.5" />
                        Back to Affiliate Partner Hub
                    </Link>

                    <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                        <div className="space-y-3 max-w-3xl font-mono">
                            <span className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                                <Building2 className="h-4 w-4" /> HIGH-CONVERTING PARTNER DIRECTORY
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase">
                                Explore <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">Affiliate Programs</span>
                            </h1>
                            <p className="text-slate-300 text-sm leading-relaxed font-sans">
                                Browse curated, high-commission recurring affiliate programs across software, hosting, marketing tools, and digital platforms.
                            </p>
                        </div>
                    </div>
                </div>

                {/* SEARCH BAR */}
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono">
                    <div className="relative">
                        <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                        <Input
                            placeholder="Search by company name, niche (e.g. email, hosting), or product..."
                            className="bg-slate-950 border-slate-800 text-slate-100 pl-10 h-11 rounded-xl text-xs font-mono"
                            value={query}
                            onChange={(e) => {
                                setQuery(e.target.value);
                                handleSearch(e.target.value);
                            }}
                        />
                    </div>
                </div>

                {/* RESULTS GRID */}
                <div className="space-y-4 font-mono">
                    <h2 className="text-base font-bold uppercase text-slate-100 tracking-tight">
                        Available Programs ({results.length})
                    </h2>

                    {results.length === 0 && !isLoading ? (
                        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl space-y-3">
                            <Building2 className="h-12 w-12 text-slate-600 mx-auto" />
                            <h3 className="text-base font-bold text-slate-200 uppercase">No Companies Found</h3>
                            <p className="text-xs text-slate-400">Try searching for generic terms like "software", "hosting", or "email".</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {results.map((company) => (
                                <div key={company._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-blue-500/50 transition group space-y-4">
                                    <div className="space-y-3">
                                        <div className="flex items-start justify-between">
                                            <div className="h-14 w-14 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center text-2xl font-black text-blue-400 overflow-hidden">
                                                {company.logo ? (
                                                    <img src={company.logo} alt={company.name} className="h-full w-full object-contain p-2" />
                                                ) : (
                                                    company.name[0]?.toUpperCase()
                                                )}
                                            </div>

                                            <span className="text-[10px] font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-1 rounded-full uppercase">
                                                {company.commissionRate || "Custom Rates"}
                                            </span>
                                        </div>

                                        <h3 className="text-base font-bold text-slate-100 group-hover:text-blue-400 transition-colors">
                                            {company.name}
                                        </h3>
                                        
                                        <p className="text-xs text-slate-400 font-sans line-clamp-2 leading-relaxed">
                                            {company.summary || "No summary available."}
                                        </p>

                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                            {company.niches?.slice(0, 2).map((niche: string) => (
                                                <span key={niche} className="text-[10px] text-slate-300 bg-slate-950 border border-slate-800 px-2 py-0.5 rounded-lg uppercase">
                                                    {niche}
                                                </span>
                                            ))}
                                            {company.affiliateNetwork && (
                                                <span className="text-[10px] text-cyan-400 bg-cyan-950 border border-cyan-800 px-2 py-0.5 rounded-lg uppercase">
                                                    {company.affiliateNetwork}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 pt-4 border-t border-slate-800">
                                        <Link href={`/affiliates/${company._id}`} className="flex-1">
                                            <Button variant="outline" className="w-full bg-slate-950 border-slate-800 text-slate-200 hover:bg-slate-800 text-xs font-bold uppercase">
                                                View Details
                                            </Button>
                                        </Link>

                                        <Button
                                            onClick={() => !savedIds.has(company._id) && handleSave(company._id)}
                                            disabled={savedIds.has(company._id)}
                                            className={`h-10 w-10 p-0 rounded-xl ${savedIds.has(company._id) ? "bg-emerald-600 text-white" : "bg-blue-600 hover:bg-blue-500 text-white"}`}
                                        >
                                            {savedIds.has(company._id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}
