import { getSuppliers, getSavedSuppliers } from "@/lib/actions/supplier.actions";
import { SupplierCard } from "./_components/supplier-card";
import { FilterSidebar } from "./_components/filter-sidebar";
import { UtilityPanel } from "./_components/utility-panel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, ShoppingBag } from "lucide-react";
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
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-50">
            {/* Top Navigation / Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
                        <ShoppingBag className="h-6 w-6 text-indigo-600" />
                        Wholesale Directory
                    </h1>
                    <div className="flex gap-2">
                        <Link href="/tools/wholesale-directory/saved">
                            <Button variant="outline" size="sm">My Saved Suppliers</Button>
                        </Link>
                        <Link href="/admin/wholesale-directory/add">
                            <Button variant="ghost" size="sm">Admin Add</Button>
                        </Link>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto flex gap-2">
                    <form className="flex-1 flex gap-2" action="/tools/wholesale-directory">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input
                                name="search"
                                placeholder="Search products, companies, or brands..."
                                className="pl-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors"
                                defaultValue={filters.search}
                            />
                        </div>
                        <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Search</Button>
                    </form>
                </div>
            </div>

            {/* Main Content Layout */}
            <div className="flex-1 flex overflow-hidden p-6">
                {/* Left Sidebar - Filters */}
                <FilterSidebar />

                {/* Center - Results */}
                <div className="flex-1 overflow-y-auto px-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="font-semibold text-slate-700">
                            {suppliers.length} Suppliers Found
                        </h2>
                        <div className="text-sm text-slate-500">
                            Showing newest first
                        </div>
                    </div>

                    <div className="space-y-4 pb-8">
                        {suppliers.length > 0 ? (
                            suppliers.map((supplier: any) => (
                                <SupplierCard key={supplier._id} supplier={supplier} />
                            ))
                        ) : (
                            <div className="text-center py-12 text-slate-500">
                                <p className="text-lg font-medium">No suppliers found</p>
                                <p>Try adjusting your filters or search terms.</p>
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
