import Link from "next/link";
import { getBills } from "@/lib/actions/bill.actions";
import { formatCurrency } from "@/lib/utils";
import { Plus, FileText, Clock, CheckCircle2, AlertTriangle, ChevronRight, Building, ChevronLeft } from "lucide-react";

const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
    open:     { label: "Open",     cls: "bg-blue-500/15 text-blue-400 border border-blue-500/20",     icon: Clock },
    paid:     { label: "Paid",     cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", icon: CheckCircle2 },
    overdue:  { label: "Overdue",  cls: "bg-rose-500/15 text-rose-400 border border-rose-500/20",     icon: AlertTriangle },
    partial:  { label: "Partial",  cls: "bg-amber-500/15 text-amber-400 border border-amber-500/20",  icon: FileText },
};

export default async function BillsPage() {
    const result = await getBills();
    const bills: any[] = result.data || [];

    const totalDue = bills.filter(b => b.status === "open" || b.status === "overdue" || b.status === "partial").reduce((s, b) => s + b.total, 0);
    const overdue = bills.filter(b => b.status === "overdue");
    const totalPaid = bills.filter(b => b.status === "paid").reduce((s, b) => s + b.total, 0);

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Bills</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Manage vendor bills and accounts payable</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/accounting/vendor-credits"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all">
                        Vendor Credits
                    </Link>
                    <Link href="/accounting/bills/new"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                        <Plus className="w-4 h-4" /> New Bill
                    </Link>
                </div>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Amount Due", value: formatCurrency(totalDue), color: "text-rose-400" },
                    { label: "Overdue Bills", value: `${overdue.length}`, color: "text-amber-400" },
                    { label: "Paid (All Time)", value: formatCurrency(totalPaid), color: "text-emerald-400" },
                ].map(k => (
                    <div key={k.label} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{k.label}</p>
                        <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                {bills.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <Building className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-bold">No bills yet</p>
                        <p className="text-xs mt-1">Enter a bill when you receive an invoice from a vendor</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800/80">
                                {["Vendor", "Bill Date", "Due Date", "Bill #", "Terms", "Total", "Status", ""].map(h => (
                                    <th key={h} className="text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-5 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {bills.map((bill: any) => {
                                const s = statusMap[bill.status] || statusMap.open;
                                const Icon = s.icon;
                                const isOverdue = new Date(bill.dueDate) < new Date() && bill.status === "open";
                                return (
                                    <tr key={bill._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all">
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-bold text-white">{bill.vendorId?.name || "—"}</p>
                                            <p className="text-[10px] text-slate-500">{bill.vendorId?.email}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-400">{new Date(bill.billDate).toLocaleDateString()}</td>
                                        <td className={`px-5 py-4 text-sm ${isOverdue ? "text-rose-400 font-bold" : "text-slate-400"}`}>
                                            {new Date(bill.dueDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-5 py-4 text-sm text-indigo-400 font-bold">{bill.billNumber || "—"}</td>
                                        <td className="px-5 py-4 text-sm text-slate-500">{bill.terms || "—"}</td>
                                        <td className="px-5 py-4 text-sm font-extrabold text-white">{formatCurrency(bill.total)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-1 rounded-lg font-extrabold uppercase ${s.cls}`}>
                                                <Icon className="w-3 h-3" />{s.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link href={`/accounting/bills/${bill._id}`} className="text-slate-500 hover:text-white transition-colors">
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            
        </div>
    );
}
