import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getClients } from "@/lib/actions/client.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { getNextReceiptNumber } from "@/lib/actions/sales-receipt.actions";
import SalesReceiptForm from "@/components/accounting/SalesReceiptForm";

export default async function NewSalesReceiptPage() {
    const clientsRes = await getClients();
    const productsRes = await getProducts(1, 100);
    const nextNo = await getNextReceiptNumber();

    const clients = clientsRes.data || [];
    const products = productsRes.data || [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">New Sales Receipt</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Record immediate point-of-sale customer payment</p>
                </div>
                
            </div>

            <SalesReceiptForm clients={clients} products={products} nextReceiptNo={nextNo} />
        </div>
    );
}
