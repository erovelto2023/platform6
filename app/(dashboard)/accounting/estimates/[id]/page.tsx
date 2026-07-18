import Link from "next/link";
import { notFound } from "next/navigation";
import { getEstimate } from "@/lib/actions/estimate.actions";
import { formatCurrency } from "@/lib/utils";
import { FileText, Calendar, User, Mail, ShieldAlert, ArrowRight, ChevronLeft } from "lucide-react";
import EstimateDetailActions from "@/components/accounting/EstimateDetailActions";

export default async function EstimateDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await getEstimate(id);
    if (res.error || !res.data) {
        notFound();
    }

    const est = res.data;

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-white">{est.estimateNumber}</h1>
                        <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-lg border ${
                            est.status === "accepted" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            est.status === "declined" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                            est.status === "invoiced" ? "bg-blue-500/10 border-blue-500/20 text-blue-400" :
                            "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                            {est.status}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Created on {new Date(est.date).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <EstimateDetailActions estimate={est} />
                    <Link href="/accounting/estimates"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700">
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: General info and items */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Details */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <User className="w-4 h-4 text-indigo-400" /> Customer Information
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                            <div>
                                <span className="text-xs text-slate-500 block">Name</span>
                                <span className="font-bold text-white">{est.clientId?.name || "—"}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block">Email</span>
                                <span>{est.clientId?.email || "—"}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block">Phone</span>
                                <span>{est.clientId?.phone || "—"}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block">Address</span>
                                <span>
                                    {est.clientId?.address ? (
                                        `${est.clientId.address.street || ""}, ${est.clientId.address.city || ""}, ${est.clientId.address.state || ""}`
                                    ) : "—"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800/80">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Line Items</h2>
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
                                {est.items.map((item: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-800/40 text-sm">
                                        <td className="px-5 py-4 font-medium text-white">{item.description}</td>
                                        <td className="px-3 py-4 text-right text-slate-300">{item.quantity}</td>
                                        <td className="px-3 py-4 text-right text-slate-300">{formatCurrency(item.rate)}</td>
                                        <td className="px-5 py-4 text-right font-bold text-white">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Right: Summary and Expiry */}
                <div className="space-y-4">
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Estimate Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between">
                                <span className="text-slate-500">Subtotal</span>
                                <span className="text-white font-bold">{formatCurrency(est.subtotal)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-500">Tax</span>
                                <span className="text-white font-bold">{formatCurrency(est.tax)}</span>
                            </div>
                            <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
                                <span className="font-bold text-slate-400">Total</span>
                                <span className="text-xl font-black text-white">{formatCurrency(est.total)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-400" /> Key Dates
                        </h2>
                        <div className="space-y-2 text-xs text-slate-300">
                            <div>
                                <span className="text-slate-500 block mb-0.5">Date Created</span>
                                <span className="font-bold">{new Date(est.date).toLocaleDateString()}</span>
                            </div>
                            {est.expirationDate && (
                                <div>
                                    <span className="text-slate-500 block mb-0.5">Expiration Date</span>
                                    <span className="font-bold text-amber-400">{new Date(est.expirationDate).toLocaleDateString()}</span>
                                </div>
                            )}
                            {est.acceptedDate && (
                                <div>
                                    <span className="text-slate-500 block mb-0.5">Accepted Date</span>
                                    <span className="font-bold text-emerald-400">{new Date(est.acceptedDate).toLocaleDateString()}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
