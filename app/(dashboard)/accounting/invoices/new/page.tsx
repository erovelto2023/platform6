import { InvoiceForm } from "@/components/accounting/InvoiceForm";
import { getClients } from "@/lib/actions/client.actions";

export default async function NewInvoicePage() {
    const { data: clients } = await getClients();

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Create Invoice</h1>
                    <p className="text-muted-foreground">Create a new invoice for a client.</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                    <InvoiceForm clients={clients || []} />
                </div>
            </div>
        </div>
    );
}
