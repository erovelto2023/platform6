import { BackButton } from "@/components/accounting/BackButton";
import { InvoiceForm } from "@/components/accounting/InvoiceForm";
import { getClients } from "@/lib/actions/client.actions";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

export default async function NewInvoicePage() {
    const { data: clients } = await getClients();
    const { data: business } = await getOrCreateBusiness();

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <BackButton href="/accounting/invoices" />
                    <div className="mt-4">
                        <div className="flex items-baseline gap-4">
                            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Invoice</h1>
                            {business && (
                                <span className="text-lg text-muted-foreground font-medium">for {business.name}</span>
                            )}
                        </div>
                        <p className="text-muted-foreground">Create a new invoice for a client.</p>
                    </div>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                    <InvoiceForm clients={clients || []} />
                </div>
            </div>
        </div>
    );
}
