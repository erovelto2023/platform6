"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Filter, Plus, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { searchAffiliateCompanies, saveAffiliateCompanyForUser } from "@/lib/actions/affiliate-user.actions";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

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
            toast.success("Added to your affiliates!");
            router.refresh();
        } catch (error) {
            toast.error("Failed to add company");
            // Revert
            setSavedIds(prev => {
                const next = new Set(prev);
                next.delete(companyId);
                return next;
            });
        }
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-900">Explore Programs</h1>
                <p className="text-slate-500 mt-1">Discover high-paying affiliate opportunities.</p>
            </div>

            {/* Search Bar */}
            <div className="flex gap-4 mb-8">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search by name, niche, or product..."
                        className="pl-10 h-12 text-lg"
                        value={query}
                        onChange={(e) => {
                            setQuery(e.target.value);
                            handleSearch(e.target.value);
                        }}
                    />
                </div>
                <Button variant="outline" className="h-12 px-6">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                </Button>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((company) => (
                    <Card key={company._id} className="hover:shadow-lg transition-all group">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="h-14 w-14 rounded-xl bg-slate-100 flex items-center justify-center text-2xl font-bold text-slate-500">
                                    {company.logo ? (
                                        <img src={company.logo} alt={company.name} className="h-full w-full object-contain" />
                                    ) : (
                                        company.name[0]
                                    )}
                                </div>
                                <Badge variant="secondary" className="bg-green-100 text-green-700 hover:bg-green-100">
                                    {company.commissionRate}
                                </Badge>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">
                                {company.name}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-4 h-10">
                                {company.summary || "No summary available."}
                            </p>

                            <div className="flex flex-wrap gap-2 mb-6">
                                {company.niches?.slice(0, 2).map((niche: string) => (
                                    <Badge key={niche} variant="outline" className="text-xs font-normal">
                                        {niche}
                                    </Badge>
                                ))}
                                {company.affiliateNetwork && (
                                    <Badge variant="outline" className="text-xs font-normal">
                                        {company.affiliateNetwork}
                                    </Badge>
                                )}
                            </div>

                            <div className="flex gap-2">
                                <Button asChild variant="outline" className="flex-1 w-full">
                                    <Link href={`/affiliates/${company._id}`}>View Details</Link>
                                </Button>
                                <Button
                                    onClick={() => !savedIds.has(company._id) && handleSave(company._id)}
                                    size="icon"
                                    variant={savedIds.has(company._id) ? "default" : "secondary"}
                                    disabled={savedIds.has(company._id)}
                                >
                                    {savedIds.has(company._id) ? <Check className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {results.length === 0 && !isLoading && (
                <div className="text-center py-20">
                    <p className="text-slate-500">No companies found matching your search.</p>
                </div>
            )}
        </div>
    );
}
