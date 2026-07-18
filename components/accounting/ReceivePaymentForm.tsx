"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { formatCurrency } from "@/lib/utils";
import { updateInvoice } from "@/lib/actions/invoice.actions";
import { CheckCircle2, DollarSign, CreditCard, AlertCircle } from "lucide-react";

const paymentMethods = ["Check", "Cash", "Credit Card", "Bank Transfer", "Other"];

export default function ReceivePaymentForm({
    openInvoices, clients
}: {
    openInvoices: any[];
    clients: any[];
}) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [selectedClient, setSelectedClient] = useState("");
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split("T")[0]);
    const [paymentMethod, setPaymentMethod] = useState("Check");
    const [referenceNo, setReferenceNo] = useState("");
    const [depositTo, setDepositTo] = useState("Checking");
    const [amountReceived, setAmountReceived] = useState("");
    const [selectedInvoices, setSelectedInvoices] = useState<Set<string>>(new Set());
    const [memo, setMemo] = useState("");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const clientInvoices = openInvoices.filter(inv =>
        !selectedClient || inv.clientId?._id === selectedClient || inv.clientId === selectedClient
    );

    const totalSelected = openInvoices
        .filter(inv => selectedInvoices.has(inv._id))
        .reduce((s, inv) => s + inv.total, 0);

    const toggleInvoice = (id: string) => {
        setSelectedInvoices(prev => {
            const next = new Set(prev);
            if (next.has(id)) next.delete(id);
            else next.add(id);
            return next;
        });
    };

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedInvoices.size === 0) { showToast("Select at least one invoice.", "error"); return; }

        startTransition(async () => {
            const ids = Array.from(selectedInvoices);
            const results = await Promise.all(
                ids.map(id => updateInvoice(id, { status: "paid" }))
            );
            const failed = results.filter(r => r.error);
            if (failed.length === 0) {
                showToast(`${ids.length} invoice(s) marked as paid successfully!`, "success");
                setTimeout(() => router.push("/accounting/invoices"), 1500);
            } else {
                showToast(`${failed.length} invoice(s) failed to update.`, "error");
            }
        });
    };

    const inputCls = "w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
    const labelCls = "text-xs font-bold text-slate-400 block mb-1.5";

    return (
        <div className="space-y-6">
            {/* Toast */}
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold border ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : "bg-rose-950 border-rose-500/30 text-rose-300"}`}>
                    {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Payment Details */}
                <div className="lg:col-span-2 space-y-5">
                    {/* Record or Charge */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6 space-y-4">
                        <h2 className="text-sm font-black text-white flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-indigo-400" /> Record or Charge
                        </h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelCls}>Customer</label>
                                <select value={selectedClient} onChange={e => setSelectedClient(e.target.value)} className={inputCls}>
                                    <option value="">All customers</option>
                                    {clients.map((c: any) => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Payment Date</label>
                                <input type="date" value={paymentDate} onChange={e => setPaymentDate(e.target.value)} className={inputCls} />
                            </div>
                            <div>
                                <label className={labelCls}>Payment Method</label>
                                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={inputCls}>
                                    {paymentMethods.map(m => <option key={m}>{m}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className={labelCls}>Deposit To</label>
                                <input value={depositTo} onChange={e => setDepositTo(e.target.value)} className={inputCls} placeholder="e.g. Checking" />
                            </div>
                            <div>
                                <label className={labelCls}>Reference No.</label>
                                <input value={referenceNo} onChange={e => setReferenceNo(e.target.value)} className={inputCls} placeholder="Check # or transaction ID" />
                            </div>
                        </div>
                    </div>

                    {/* Outstanding Invoices */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800/80">
                            <h2 className="text-sm font-black text-white">Outstanding Invoices</h2>
                            <p className="text-xs text-slate-500 mt-0.5">Select invoices to apply this payment to</p>
                        </div>
                        {clientInvoices.length === 0 ? (
                            <div className="text-center py-10 text-slate-600 text-xs">No open invoices found.</div>
                        ) : (
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-slate-800/40">
                                        <th className="w-10 px-5 py-3" />
                                        {["Invoice #", "Date", "Due Date", "Original Amount", "Open Balance"].map(h => (
                                            <th key={h} className="text-left text-[9px] font-extrabold text-slate-500 uppercase tracking-wider px-3 py-3">{h}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {clientInvoices.map((inv: any) => {
                                        const checked = selectedInvoices.has(inv._id);
                                        const isOverdue = inv.status === "overdue";
                                        return (
                                            <tr key={inv._id}
                                                onClick={() => toggleInvoice(inv._id)}
                                                className={`border-b border-slate-800/40 cursor-pointer transition-all ${checked ? "bg-indigo-500/5" : "hover:bg-slate-800/20"}`}>
                                                <td className="px-5 py-3">
                                                    <input type="checkbox" checked={checked} onChange={() => { }} className="w-4 h-4 accent-indigo-500" />
                                                </td>
                                                <td className="px-3 py-3 text-sm font-bold text-indigo-400">{inv.invoiceNumber}</td>
                                                <td className="px-3 py-3 text-sm text-slate-400">{new Date(inv.date).toLocaleDateString()}</td>
                                                <td className={`px-3 py-3 text-sm ${isOverdue ? "text-rose-400 font-bold" : "text-slate-400"}`}>
                                                    {new Date(inv.dueDate).toLocaleDateString()}
                                                    {isOverdue && <span className="ml-1 text-[9px] bg-rose-500/15 text-rose-400 px-1 py-0.5 rounded font-extrabold">OVERDUE</span>}
                                                </td>
                                                <td className="px-3 py-3 text-sm text-white font-bold">{formatCurrency(inv.total)}</td>
                                                <td className="px-3 py-3 text-sm font-extrabold text-rose-400">{formatCurrency(inv.total)}</td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    {/* Memo */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <label className={labelCls}>Memo</label>
                        <textarea value={memo} onChange={e => setMemo(e.target.value)} rows={3}
                            placeholder="Internal note..." className={inputCls} />
                    </div>
                </div>

                {/* Right: Amount Summary */}
                <div className="space-y-4">
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4 sticky top-6">
                        <h2 className="text-sm font-black text-white flex items-center gap-2">
                            <DollarSign className="w-4 h-4 text-emerald-400" /> Amount
                        </h2>
                        <div>
                            <label className={labelCls}>Amount Received</label>
                            <input
                                type="number" step="0.01" min="0"
                                value={amountReceived}
                                onChange={e => setAmountReceived(e.target.value)}
                                placeholder="0.00"
                                className={`${inputCls} text-2xl font-black text-emerald-400`}
                            />
                        </div>
                        <div className="border-t border-slate-800 pt-3 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Selected invoices</span>
                                <span className="text-white font-bold">{selectedInvoices.size}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-slate-500">Total outstanding</span>
                                <span className="text-rose-400 font-bold">{formatCurrency(totalSelected)}</span>
                            </div>
                            {amountReceived && (
                                <div className="flex justify-between text-xs">
                                    <span className="text-slate-500">Amount left</span>
                                    <span className={`font-bold ${parseFloat(amountReceived) >= totalSelected ? "text-emerald-400" : "text-amber-400"}`}>
                                        {formatCurrency(Math.max(0, parseFloat(amountReceived) - totalSelected))}
                                    </span>
                                </div>
                            )}
                        </div>

                        <button type="submit" disabled={isPending || selectedInvoices.size === 0}
                            className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-black text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                            {isPending ? "Recording..." : "Record Payment"}
                        </button>
                        <button type="button" onClick={() => router.back()}
                            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all border border-slate-700">
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
