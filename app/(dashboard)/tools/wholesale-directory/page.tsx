import { getSuppliers, getSavedSuppliers } from "@/lib/actions/supplier.actions";
import { SupplierCard } from "./_components/supplier-card";
import { FilterSidebar } from "./_components/filter-sidebar";
import { UtilityPanel } from "./_components/utility-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag, Plus, Bookmark } from "lucide-react";
import Link from "next/link";

export default async function WholesaleDirectoryPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedParams = await searchParams;
    const filters = {
        search: resolvedParams.search as string,
        type: resolvedParams.type as string,
        category: resolvedParams.category as string,
        location: resolvedParams.location as string,
        channel: resolvedParams.channel as string
    };

    const suppliers = await getSuppliers(filters);
    const savedSuppliers = await getSavedSuppliers();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-950 text-slate-100">
            {/* Top Navigation / Header */}
            <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-5 flex-shrink-0 backdrop-blur-md">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                            <ShoppingBag className="h-7 w-7 text-orange-400" />
                            Wholesale & Dropship <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">Directory</span>
                        </h1>
                        <p className="text-xs font-mono text-slate-400 mt-1">Verified suppliers, dropshippers, light-bulk distributors & approved channels</p>
                    </div>

                    <div className="flex items-center gap-2">
                        <Link href="/tools/wholesale-directory/saved">
                            <Button variant="outline" size="sm" className="bg-slate-950 border-slate-800 hover:border-orange-500 text-slate-200 hover:text-white font-mono text-xs flex items-center gap-1.5 cursor-pointer">
                                <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                                <span>My Saved ({savedSuppliers.length})</span>
                            </Button>
                        </Link>
                        <Link href="/admin/wholesale-directory/add">
                            <Button size="sm" className="bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider flex items-center gap-1 cursor-pointer">
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add Supplier</span>
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto flex gap-2">
                    <form className="flex-1 flex gap-2" action="/tools/wholesale-directory">
                        <div className="relative flex-1">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                name="search"
                                placeholder="Search products, companies, or brands..."
                                className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 focus:border-orange-500 font-mono text-xs h-10 rounded-xl"
                                defaultValue={filters.search}
                            />
                        </div>
                        <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-black font-mono text-xs uppercase tracking-wider px-6 h-10 rounded-xl cursor-pointer">
                            Search
                        </Button>
                    </form>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex-1 flex overflow-hidden p-6 gap-6">
                {/* Left Sidebar - Filters */}
                <FilterSidebar />

                {/* Center - Results */}
                <div className="flex-1 overflow-y-auto px-2">
                    <div className="flex items-center justify-between mb-4 border-b border-slate-800/80 pb-3">
                        <h2 className="font-mono text-xs font-bold text-slate-300 uppercase tracking-wider">
                            {suppliers.length} Verified Suppliers Found
                        </h2>
                        <div className="text-xs font-mono text-slate-400">
                            Showing newest first
                        </div>
                    </div>

                    <div className="space-y-4 pb-8">
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier: any) => (
                                <SupplierCard key={supplier._id} supplier={supplier} />
                            ))
                        ) : (
                            <div className="text-center py-16 bg-slate-900/60 border border-slate-800 rounded-3xl p-8 space-y-3">
                                <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
                                <p className="text-base font-bold text-slate-200">No suppliers found</p>
                                <p className="text-xs font-mono text-slate-400 max-w-sm mx-auto">Try adjusting your category, supplier type, location, or search keywords.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Sidebar - Utility */}
                <UtilityPanel savedCount={savedSuppliers.length} />
            </div>
        </div>
    );
}
