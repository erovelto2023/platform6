import Link from "next/link";
import { notFound } from "next/navigation";
import { getBill } from "@/lib/actions/bill.actions";
import { formatCurrency } from "@/lib/utils";
import { Truck, Calendar, CreditCard, ChevronRight, ChevronLeft } from "lucide-react";
import BillDetailActions from "@/components/accounting/BillDetailActions";

export default async function BillDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const res = await getBill(id);
    if (res.error || !res.data) {
        notFound();
    }

    const bill = res.data;

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between border-b border-slate-800 pb-5">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-black text-white">Bill #{bill.billNumber || bill._id.slice(-6)}</h1>
                        <span className={`text-[10px] px-2 py-0.5 font-bold uppercase rounded-lg border ${
                            bill.status === "paid" ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" :
                            bill.status === "overdue" ? "bg-rose-500/10 border-rose-500/20 text-rose-400" :
                            "bg-amber-500/10 border-amber-500/20 text-amber-400"
                        }`}>
                            {bill.status}
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm mt-1">
                        Received on {new Date(bill.billDate).toLocaleDateString()}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <BillDetailActions bill={bill} />
                    <Link href="/accounting/bills"
                        className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-bold rounded-xl transition-colors border border-slate-700">
                        Back
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Vendor Info */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Truck className="w-4 h-4 text-indigo-400" /> Vendor Details
                        </h2>
                        <div className="grid grid-cols-2 gap-4 text-sm text-slate-300">
                            <div>
                                <span className="text-xs text-slate-500 block">Name</span>
                                <span className="font-bold text-white">{bill.vendorId?.name || "—"}</span>
                            </div>
                            <div>
                                <span className="text-xs text-slate-500 block">Email</span>
                                <span>{bill.vendorId?.email || "—"}</span>
                            </div>
                            {bill.mailingAddress && (
                                <div className="col-span-2">
                                    <span className="text-xs text-slate-500 block">Mailing Address</span>
                                    <pre className="font-sans text-slate-300 mt-1 whitespace-pre-line">{bill.mailingAddress}</pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Category details */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800/80">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Line Items</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3">Category</th>
                                    <th className="px-3 py-3">Description</th>
                                    <th className="px-5 py-3 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bill.items.map((item: any, i: number) => (
                                    <tr key={i} className="border-b border-slate-800/40 text-sm">
                                        <td className="px-5 py-4 font-bold text-slate-300 capitalize">{item.category}</td>
                                        <td className="px-3 py-4 text-slate-400">{item.description || "—"}</td>
                                        <td className="px-5 py-4 text-right font-bold text-rose-400">{formatCurrency(item.amount)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    {/* Bill Info */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-indigo-400" /> Key Dates
                        </h2>
                        <div className="space-y-2 text-xs text-slate-300">
                            <div>
                                <span className="text-slate-500 block mb-0.5">Bill Date</span>
                                <span className="font-bold">{new Date(bill.billDate).toLocaleDateString()}</span>
                            </div>
                            <div>
                                <span className="text-slate-500 block mb-0.5">Due Date</span>
                                <span className="font-bold text-rose-400">{new Date(bill.dueDate).toLocaleDateString()}</span>
                            </div>
                            {bill.terms && (
                                <div>
                                    <span className="text-slate-500 block mb-0.5">Terms</span>
                                    <span className="font-bold">{bill.terms}</span>
                                </div>
                            )}
                            {bill.refNo && (
                                <div>
                                    <span className="text-slate-500 block mb-0.5">Ref No.</span>
                                    <span className="font-bold font-mono">{bill.refNo}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Total Summary</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex justify-between items-end">
                                <span className="font-bold text-slate-400">Total Owed</span>
                                <span className="text-xl font-black text-rose-400">{formatCurrency(bill.total)}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
