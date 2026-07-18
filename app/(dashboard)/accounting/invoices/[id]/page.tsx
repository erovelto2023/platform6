import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getInvoice } from "@/lib/actions/invoice.actions";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { DownloadInvoiceButton } from "@/components/accounting/DownloadInvoiceButton";
import { PrintButton } from "@/components/accounting/PrintButton";
import { Badge } from "@/components/ui/badge";

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: invoice, success } = await getInvoice(id);

    if (!success || !invoice) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4 no-print">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    
                    <div className="flex gap-2">
                        {/* Edit button could go here */}
                        <PrintButton label="Print Invoice" />
                        <DownloadInvoiceButton invoice={invoice} />
                    </div>
                </div>

                <div className="bg-[#0d1117] rounded-lg shadow-sm border border-slate-800/80 overflow-hidden">
                    <div className="p-8 border-b border-slate-800/80">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-white">Invoice {invoice.invoiceNumber}</h1>
                                <p className="text-slate-500 mt-1">
                                    Issued on {new Date(invoice.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge className={`text-base px-4 py-1 capitalize ${invoice.status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                            'bg-slate-800 text-slate-300 hover:bg-slate-800'
                                    }`}>
                                    {invoice.status}
                                </Badge>
                                <p className="text-sm text-slate-500 mt-2">
                                    Due: {new Date(invoice.dueDate).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8 grid grid-cols-2 gap-12">
                        <div>
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Bill To</h3>
                            <div className="text-white font-medium">
                                {invoice.clientId?.name || 'Unknown Client'}
                            </div>
                            <div className="text-slate-400 text-sm mt-1 whitespace-pre-line">
                                {invoice.clientId?.address?.street}
                                {invoice.clientId?.address?.city && <br />}
                                {invoice.clientId?.address?.city}, {invoice.clientId?.address?.state} {invoice.clientId?.address?.zip}
                            </div>
                            <div className="text-slate-400 text-sm mt-2">
                                {invoice.clientId?.email}
                            </div>
                        </div>
                        <div className="text-right">
                            {/* Business info could go here if we fetched it */}
                        </div>
                    </div>

                    <div className="p-8">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b border-slate-800/80">
                                    <th className="text-left py-3 font-medium text-slate-500">Description</th>
                                    <th className="text-right py-3 font-medium text-slate-500">Qty</th>
                                    <th className="text-right py-3 font-medium text-slate-500">Rate</th>
                                    <th className="text-right py-3 font-medium text-slate-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoice.items.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="py-4 text-white">{item.description}</td>
                                        <td className="py-4 text-right text-slate-400">{item.quantity}</td>
                                        <td className="py-4 text-right text-slate-400">{formatCurrency(item.rate)}</td>
                                        <td className="py-4 text-right font-medium text-white">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-[#07090e] border-t border-slate-800/80">
                        <div className="flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium text-white">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="font-medium text-white">{formatCurrency(invoice.tax)}</span>
                                </div>
                                <div className="flex justify-between text-base border-t border-slate-800/80 pt-3">
                                    <span className="font-bold text-white">Total</span>
                                    <span className="font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="p-8 border-t border-slate-800/80">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
                            <p className="text-sm text-slate-400">{invoice.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
