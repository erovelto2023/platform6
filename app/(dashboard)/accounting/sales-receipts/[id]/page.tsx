import Link from "next/link";
import { notFound } from "next/navigation";
import { getSalesReceipt } from "@/lib/actions/sales-receipt.actions";
import { formatCurrency } from "@/lib/utils";
import { User, Receipt, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";

const methodLabels: Record<string, string> = {
    cash: "Cash", check: "Check", credit_card: "Credit Card", bank_transfer: "Bank Transfer", other: "Other"
};

export default async function SalesReceiptDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await getSalesReceipt(id);
    if (res.error || !res.data) {
        notFound();
    }

    const receipt = res.data;

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-white">Receipt #{receipt.receiptNumber}</h1>
                        <span className="text-[10px] px-2 py-0.5 font-bold uppercase rounded-lg border bg-emerald-500/10 border-emerald-500/20 text-emerald-400">
                            Paid
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Recorded on {new Date(receipt.date).toLocaleDateString()}
                    </p>
                </div>
                <Link href="/accounting/sales-receipts"
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700">
                    Back to list
                </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer & Billing */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-400" /> Customer Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                            <div>
                                <span className="text-xs text-slate-500 block">Name</span>
                                <span className="font-bold text-white">{receipt.clientId?.name || "Walk-in Customer"}</span>
                            </div>
                            {receipt.email && (
                                <div>
                                    <span className="text-xs text-slate-500 block">Email</span>
                                    <span>{receipt.email}</span>
                                </div>
                            )}
                            {receipt.billingAddress && (
                                <div className="col-span-2">
                                    <span className="text-xs text-slate-500 block">Billing Address</span>
                                    <pre className="font-sans text-slate-300 mt-1 whitespace-pre-line">{receipt.billingAddress}</pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800/80">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Items</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3">Description</th>
                                    <th className="px-3 py-3 text-right">Qty</th>
                                    <th className="px-3 py-3 text-right">Rate</th>
                                    <th className="px-5 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {receipt.items.map((item: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-800/40 text-sm">
                                        <td className="px-5 py-4 font-medium text-white">{item.description}</td>
                                        <td className="px-3 py-4 text-right text-slate-300">{item.quantity}</td>
                                        <td className="px-3 py-4 text-right text-slate-300">{formatCurrency(item.rate)}</td>
                                        <td className="px-5 py-4 text-right font-bold text-emerald-400">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Payment Info */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-indigo-400" /> Payment Info
                        </h2>
                        <div className="space-y-2 text-xs text-slate-300">
                            <div>
                                <span className="text-slate-500 block mb-0.5">Payment Method</span>
                                <span className="font-bold">{methodLabels[receipt.paymentMethod] || receipt.paymentMethod}</span>
                            </div>
                            {receipt.depositTo && (
                                <div>
                                    <span className="text-slate-500 block mb-0.5">Deposit To</span>
                                    <span className="font-bold">{receipt.depositTo}</span>
                                </div>
                            )}
                            {receipt.referenceNo && (
                                <div>
                                    <span className="text-slate-500 block mb-0.5">Reference No.</span>
                                    <span className="font-bold font-mono text-indigo-400">{receipt.referenceNo}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Receipt Summary */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Receipt Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="text-white font-bold">{formatCurrency(receipt.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tax</span>
                                <span className="text-white font-bold">{formatCurrency(receipt.tax)}</span>
                            </div>
                            <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
                                <span className="font-bold text-slate-400">Total Collected</span>
                                <span className="text-xl font-black text-emerald-400">{formatCurrency(receipt.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
