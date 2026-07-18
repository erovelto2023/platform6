import Link from "next/link";
import { getSalesReceipts } from "@/lib/actions/sales-receipt.actions";
import { formatCurrency } from "@/lib/utils";
import { Plus, Receipt, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";

const methodLabel: Record<string, string> = {
    cash: "Cash", check: "Check", credit_card: "Credit Card",
    bank_transfer: "Bank Transfer", other: "Other"
};

export default async function SalesReceiptsPage() {
    const result = await getSalesReceipts();
    const receipts: any[] = result.data || [];
    const total = receipts.reduce((s, r) => s + r.total, 0);

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Sales Receipts</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Record immediate point-of-sale payments</p>
                </div>
                <Link href="/accounting/sales-receipts/new"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" /> New Sales Receipt
                </Link>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Total Collected", value: formatCurrency(total), color: "text-emerald-400" },
                    { label: "Total Receipts", value: receipts.length.toString(), color: "text-white" },
                ].map(k => (
                    <div key={k.label} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{k.label}</p>
                        <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                {receipts.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Receipt className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-bold">No sales receipts yet</p>
                        <p className="text-xs mt-1">Record an immediate payment to get started</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800/80">
                                {["Receipt #", "Customer", "Date", "Payment Method", "Total", ""].map(h => (
                                    <th key={h} className="text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-5 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {receipts.map((r: any) => (
                                <tr key={r._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all">
                                    <td className="px-5 py-4 text-sm font-bold text-indigo-400">#{r.receiptNumber}</td>
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-white">{r.clientId?.name || "Walk-in Customer"}</p>
                                        {r.email && <p className="text-[10px] text-slate-500">{r.email}</p>}
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-400">{new Date(r.date).toLocaleDateString()}</td>
                                    <td className="px-5 py-4">
                                        <span className="flex items-center gap-1.5 text-xs text-slate-300">
                                            <CreditCard className="w-3.5 h-3.5 text-slate-500" />
                                            {methodLabel[r.paymentMethod] || r.paymentMethod}
                                        </span>
                                    </td>
                                    <td className="px-5 py-4 text-sm font-extrabold text-emerald-400">{formatCurrency(r.total)}</td>
                                    <td className="px-5 py-4">
                                        <Link href={`/accounting/sales-receipts/${r._id}`} className="text-slate-500 hover:text-white transition-colors">
                                            <ChevronRight className="w-4 h-4" />
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            
        </div>
    );
}
