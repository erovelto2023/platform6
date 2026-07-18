import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getAllVendors } from "@/lib/actions/vendor.actions";
import BillForm from "@/components/accounting/BillForm";

export default async function NewBillPage() {
    const vendorsRes = await getAllVendors();
    const vendors = vendorsRes.data || [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Record Bill</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Enter details of invoices received from your vendors</p>
                </div>
                
            </div>

            <BillForm vendors={vendors} />
        </div>
    );
}
