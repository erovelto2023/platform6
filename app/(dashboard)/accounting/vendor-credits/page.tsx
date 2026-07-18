import Link from "next/link";
import { getVendorCredits } from "@/lib/actions/vendor-credit.actions";
import { formatCurrency } from "@/lib/utils";
import { Plus, RotateCcw, ChevronRight, ChevronLeft } from "lucide-react";

export default async function VendorCreditsPage() {
    const result = await getVendorCredits();
    const credits: any[] = result.data || [];
    const total = credits.reduce((s, c) => s + c.total, 0);

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Vendor Credits</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Track credits received from vendors (refunds, returns)</p>
                </div>
                <div className="flex gap-2">
                    <Link href="/accounting/bills"
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-all">
                        Bills
                    </Link>
                    <Link href="/accounting/vendor-credits/new"
                        className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                        <Plus className="w-4 h-4" /> New Vendor Credit
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {[
                    { label: "Total Credits", value: formatCurrency(total), color: "text-emerald-400" },
                    { label: "Number of Credits", value: credits.length.toString(), color: "text-white" },
                ].map(k => (
                    <div key={k.label} className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">{k.label}</p>
                        <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                {credits.length === 0 ? (
                    <div className="text-center py-20 text-slate-400">
                        <RotateCcw className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-bold">No vendor credits yet</p>
                        <p className="text-xs mt-1">Record a vendor credit when a vendor issues you a refund or return</p>
                    </div>
                ) : (
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-slate-800/80">
                                {["Vendor", "Date", "Ref No.", "Total", ""].map(h => (
                                    <th key={h} className="text-left text-[10px] font-extrabold text-slate-500 uppercase tracking-wider px-5 py-4">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {credits.map((c: any) => (
                                <tr key={c._id} className="border-b border-slate-800/40 hover:bg-slate-800/20 transition-all">
                                    <td className="px-5 py-4">
                                        <p className="text-sm font-bold text-white">{c.vendorId?.name || "—"}</p>
                                        <p className="text-[10px] text-slate-500">{c.vendorId?.email}</p>
                                    </td>
                                    <td className="px-5 py-4 text-sm text-slate-400">{new Date(c.paymentDate).toLocaleDateString()}</td>
                                    <td className="px-5 py-4 text-sm text-slate-400">{c.refNo || "—"}</td>
                                    <td className="px-5 py-4 text-sm font-extrabold text-emerald-400">{formatCurrency(c.total)}</td>
                                    <td className="px-5 py-4">
                                        <ChevronRight className="w-4 h-4 text-slate-500" />
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
