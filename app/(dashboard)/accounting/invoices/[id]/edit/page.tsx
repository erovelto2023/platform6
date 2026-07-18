import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getInvoice } from "@/lib/actions/invoice.actions";
import { InvoiceForm } from "@/components/accounting/InvoiceForm";
import { getClients } from "@/lib/actions/client.actions";
import { getProducts } from "@/lib/actions/product.actions";
import { notFound } from "next/navigation";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

interface EditInvoicePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditInvoicePage({ params }: EditInvoicePageProps) {
    const { id } = await params;
    const { data: invoice } = await getInvoice(id);
    const { data: clients } = await getClients();
    const { data: business } = await getOrCreateBusiness();
    const { data: products } = await getProducts(1, 100);

    if (!invoice) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div>
                
                <div className="mt-4">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Edit Invoice</h1>
                        {business && (
                            <span className="text-lg text-slate-400 font-medium">for {business.name}</span>
                        )}
                    </div>
                    <p className="text-slate-400">Update invoice details and status</p>
                </div>
            </div>

            <div className="max-w-5xl">
                <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm p-6">
                    <InvoiceForm clients={clients || []} products={products || []} initialData={invoice} />
                </div>
            </div>
        </div>
    );
}
