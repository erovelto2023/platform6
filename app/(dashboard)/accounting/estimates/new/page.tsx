import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getClients } from "@/lib/actions/client.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getNextEstimateNumber } from "@/lib/actions/estimate.actions";
import EstimateForm from "@/components/accounting/EstimateForm";

export default async function NewEstimatePage() {
    const clientsRes = await getClients();
    const productsRes = await getProducts(1, 100);
    const nextNo = await getNextEstimateNumber();

    const clients = clientsRes.data || [];
    const products = productsRes.data || [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Create Estimate</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Send a quote or invoice proposal to a client</p>
                </div>
                
            </div>

            <EstimateForm clients={clients} products={products} nextEstimateNo={nextNo} />
        </div>
    );
}
