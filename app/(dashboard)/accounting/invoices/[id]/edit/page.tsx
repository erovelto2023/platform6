import { getInvoice } from "@/lib/actions/invoice.actions";
import { InvoiceForm } from "@/components/accounting/InvoiceForm";
import { BackButton } from "@/components/accounting/BackButton";
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
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div>
                <BackButton href="/accounting/invoices" />
                <div className="mt-4">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Invoice</h1>
                        {business && (
                            <span className="text-lg text-muted-foreground font-medium">for {business.name}</span>
                        )}
                    </div>
                    <p className="text-muted-foreground">Update invoice details and status</p>
                </div>
            </div>

            <div className="max-w-5xl">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <InvoiceForm clients={clients || []} products={products || []} initialData={invoice} />
                </div>
            </div>
        </div>
    );
}
