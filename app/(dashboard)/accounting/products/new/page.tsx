import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import ProductForm from "@/components/accounting/ProductForm";
import { getAllVendors } from "@/lib/actions/vendor.actions";

export default async function NewProductPage() {
    const vendorsData = await getAllVendors();
    const vendors = vendorsData.success ? vendorsData.data : [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center gap-4">
                
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Add New Item</h1>
                    <p className="text-slate-400">Create a new product or service to sell to customers.</p>
                </div>
            </div>

            <ProductForm vendors={vendors} />
        </div>
    );
}
