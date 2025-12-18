import { getSavedSuppliers } from "@/lib/actions/supplier.actions";
import { SupplierCard } from "../_components/supplier-card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Star } from "lucide-react";
import Link from "next/link";

export default async function SavedSuppliersPage() {
    const savedSuppliers = await getSavedSuppliers();

    return (
        <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-slate-50 p-6">
            <div className="max-w-5xl mx-auto w-full h-full flex flex-col">
                <div className="flex items-center gap-4 mb-6 flex-shrink-0">
                    <Link href="/tools/wholesale-directory">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                            <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
                            My Saved Suppliers
                        </h1>
                        <p className="text-slate-500">Manage your shortlist and notes</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 pb-8">
                    {savedSuppliers.length > 0 ? (
                        savedSuppliers.map((supplier: any) => (
                            <SupplierCard key={supplier._id} supplier={supplier} />
                        ))
                    ) : (
                        <div className="text-center py-12 text-slate-500 bg-white rounded-xl border border-slate-200">
                            <Star className="h-12 w-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-lg font-medium">No saved suppliers yet</p>
                            <p className="mb-4">Browse the directory to find and save suppliers.</p>
                            <Link href="/tools/wholesale-directory">
                                <Button>Browse Directory</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
