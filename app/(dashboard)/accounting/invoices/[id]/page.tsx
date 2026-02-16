import { BackButton } from "@/components/accounting/BackButton";
import { getInvoice } from "@/lib/actions/invoice.actions";
import { notFound } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { DownloadInvoiceButton } from "@/components/accounting/DownloadInvoiceButton";
import { Badge } from "@/components/ui/badge";

export default async function InvoiceDetailPage({ params }: { params: { id: string } }) {
    const { data: invoice, success } = await getInvoice(params.id);

    if (!success || !invoice) {
        notFound();
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-4xl mx-auto space-y-6">
                <div className="flex items-center justify-between">
                    <BackButton href="/accounting/invoices" />
                    <div className="flex gap-2">
                        {/* Edit button could go here */}
                        <DownloadInvoiceButton invoice={invoice} />
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
                    <div className="p-8 border-b border-slate-200">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-slate-900">Invoice {invoice.invoiceNumber}</h1>
                                <p className="text-slate-500 mt-1">
                                    Issued on {new Date(invoice.date).toLocaleDateString()}
                                </p>
                            </div>
                            <div className="text-right">
                                <Badge className={`text-base px-4 py-1 capitalize ${invoice.status === 'paid' ? 'bg-green-100 text-green-700 hover:bg-green-100' :
                                        invoice.status === 'overdue' ? 'bg-red-100 text-red-700 hover:bg-red-100' :
                                            'bg-slate-100 text-slate-700 hover:bg-slate-100'
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
                            <div className="text-slate-900 font-medium">
                                {invoice.clientId?.name || 'Unknown Client'}
                            </div>
                            <div className="text-slate-600 text-sm mt-1 whitespace-pre-line">
                                {invoice.clientId?.address?.street}
                                {invoice.clientId?.address?.city && <br />}
                                {invoice.clientId?.address?.city}, {invoice.clientId?.address?.state} {invoice.clientId?.address?.zip}
                            </div>
                            <div className="text-slate-600 text-sm mt-2">
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
                                <tr className="border-b border-slate-200">
                                    <th className="text-left py-3 font-medium text-slate-500">Description</th>
                                    <th className="text-right py-3 font-medium text-slate-500">Qty</th>
                                    <th className="text-right py-3 font-medium text-slate-500">Rate</th>
                                    <th className="text-right py-3 font-medium text-slate-500">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {invoice.items.map((item: any, i: number) => (
                                    <tr key={i}>
                                        <td className="py-4 text-slate-900">{item.description}</td>
                                        <td className="py-4 text-right text-slate-600">{item.quantity}</td>
                                        <td className="py-4 text-right text-slate-600">{formatCurrency(item.rate)}</td>
                                        <td className="py-4 text-right font-medium text-slate-900">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="p-8 bg-slate-50 border-t border-slate-200">
                        <div className="flex justify-end">
                            <div className="w-64 space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Subtotal</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(invoice.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-slate-500">Tax</span>
                                    <span className="font-medium text-slate-900">{formatCurrency(invoice.tax)}</span>
                                </div>
                                <div className="flex justify-between text-base border-t border-slate-200 pt-3">
                                    <span className="font-bold text-slate-900">Total</span>
                                    <span className="font-bold text-blue-600">{formatCurrency(invoice.total)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {invoice.notes && (
                        <div className="p-8 border-t border-slate-200">
                            <h3 className="text-sm font-medium text-slate-500 mb-2">Notes</h3>
                            <p className="text-sm text-slate-600">{invoice.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
