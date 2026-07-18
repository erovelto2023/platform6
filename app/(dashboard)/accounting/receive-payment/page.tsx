import Link from "next/link";
import { getInvoices } from "@/lib/actions/invoice.actions";
import { getClients } from "@/lib/actions/client.actions";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, FileText, ChevronLeft } from "lucide-react";
import ReceivePaymentForm from "@/components/accounting/ReceivePaymentForm";

export default async function ReceivePaymentPage() {
    const invoicesData = await getInvoices();
    const clientsData = await getClients();

    const openInvoices = (invoicesData.data || []).filter((inv: any) =>
        inv.status === "sent" || inv.status === "overdue"
    );
    const clients: any[] = clientsData.data || [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Receive Payment</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Apply a customer payment to open invoices</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500 bg-[#0d1117] border border-slate-800 px-3 py-2 rounded-xl">
                    <FileText className="w-3.5 h-3.5" />
                    {openInvoices.length} open invoice{openInvoices.length !== 1 ? "s" : ""}
                    &nbsp;·&nbsp;
                    <DollarSign className="w-3.5 h-3.5" />
                    {formatCurrency(openInvoices.reduce((s: number, i: any) => s + i.total, 0))} outstanding
                </div>
            </div>

            <ReceivePaymentForm openInvoices={openInvoices} clients={clients} />

            
        </div>
    );
}
