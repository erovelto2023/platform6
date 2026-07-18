import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { InvoiceForm } from "@/components/accounting/InvoiceForm";
import { getClients } from "@/lib/actions/client.actions";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { getProducts } from "@/lib/actions/product.actions";

export default async function NewInvoicePage() {
    const { data: clients } = await getClients();
    const { data: business } = await getOrCreateBusiness();
    const { data: products } = await getProducts(1, 100); // Fetch first 100 products

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    
                    <div className="mt-4">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-white">Create Invoice</h1>
                            {business && (
                                <span className="text-lg text-slate-400 font-medium">for {business.name}</span>
                            )}
                        </div>
                        <p className="text-slate-400">Create a new invoice for a client.</p>
                    </div>
                </div>

                <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm p-8">
                    <InvoiceForm clients={clients || []} products={products || []} />
                </div>
            </div>
        </div>
    );
}
