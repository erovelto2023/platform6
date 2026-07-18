import Link from "next/link";
import { getEstimates } from "@/lib/actions/estimate.actions";
import { formatCurrency } from "@/lib/utils";
import { Plus, FileText, Clock, CheckCircle2, XCircle, ChevronRight, AlertTriangle, ChevronLeft } from "lucide-react";

const statusMap: Record<string, { label: string; cls: string; icon: any }> = {
    pending:  { label: "Pending",  cls: "bg-amber-500/15 text-amber-400 border border-amber-500/20",   icon: Clock },
    accepted: { label: "Accepted", cls: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20", icon: CheckCircle2 },
    declined: { label: "Declined", cls: "bg-rose-500/15 text-rose-400 border border-rose-500/20",     icon: XCircle },
    expired:  { label: "Expired",  cls: "bg-slate-700 text-slate-400",                                icon: AlertTriangle },
    invoiced: { label: "Invoiced", cls: "bg-blue-500/15 text-blue-400 border border-blue-500/20",     icon: FileText },
};

export default async function EstimatesPage() {
    const result = await getEstimates();
    const estimates: any[] = result.data || [];

    const total = estimates.reduce((s, e) => s + e.total, 0);
    const pending = estimates.filter(e => e.status === "pending");
    const accepted = estimates.filter(e => e.status === "accepted");

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Estimates</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Create and manage quotes & proposals for clients</p>
                </div>
                <Link href="/accounting/estimates/new"
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    <Plus className="w-4 h-4" /> New Estimate
                </Link>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Total Value", value: formatCurrency(total), color: "text-white" },
                    { label: "Pending", value: `${pending.length} (${formatCurrency(pending.reduce((s,e)=>s+e.total,0))})`, color: "text-amber-400" },
                    { label: "Accepted", value: `${accepted.length} (${formatCurrency(accepted.reduce((s,e)=>s+e.total,0))})`, color: "text-emerald-400" },
                ].map(k => (
                    <div key={k.label} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{k.label}</p>
                        <p className={`text-xl font-black ${k.color}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                {estimates.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <FileText className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-bold">No estimates yet</p>
                        <p className="text-xs mt-1">Create your first estimate to send to a client</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800/80">
                                {["Estimate #", "Client", "Date", "Expiration", "Total", "Status", ""].map(h => (
                                    <th key={h} className="text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-5 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {estimates.map((est: any) => {
                                const s = statusMap[est.status] || statusMap.pending;
                                const Icon = s.icon;
                                return (
                                    <tr key={est._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all">
                                        <td className="px-5 py-4 text-sm font-bold text-indigo-400">{est.estimateNumber}</td>
                                        <td className="px-5 py-4">
                                            <p className="text-sm font-bold text-white">{est.clientId?.name || "—"}</p>
                                            <p className="text-[10px] text-slate-500">{est.clientId?.email}</p>
                                        </td>
                                        <td className="px-5 py-4 text-sm text-slate-400">{new Date(est.date).toLocaleDateString()}</td>
                                        <td className="px-5 py-4 text-sm text-slate-400">{est.expirationDate ? new Date(est.expirationDate).toLocaleDateString() : "—"}</td>
                                        <td className="px-5 py-4 text-sm font-extrabold text-white">{formatCurrency(est.total)}</td>
                                        <td className="px-5 py-4">
                                            <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-1 rounded-lg font-extrabold uppercase ${s.cls}`}>
                                                <Icon className="w-3 h-3" />{s.label}
                                            </span>
                                        </td>
                                        <td className="px-5 py-4">
                                            <Link href={`/accounting/estimates/${est._id}`} className="text-slate-500 hover:text-white transition-colors">
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
