"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Printer, Send, Save, RefreshCw } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { getStatementRecipients, createStatement } from "@/lib/actions/statement.actions";

interface Recipient {
    id: string;
    name: string;
    email: string;
    openBalance: number;
    overdueBalance: number;
    hasActivity: boolean;
}

export default function CreateStatementsForm({ initialRecipients }: { initialRecipients: Recipient[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [statementType, setStatementType] = useState("balance_forward");
    const [statementDate, setStatementDate] = useState(new Date().toISOString().split("T")[0]);
    const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]);
    const [endDate, setEndDate] = useState(new Date().toISOString().split("T")[0]);
    const [balanceStatus, setBalanceStatus] = useState<"open" | "overdue" | "all">("open");

    const [recipients, setRecipients] = useState<Recipient[]>(initialRecipients);
    const [selectedIds, setSelectedIds] = useState<string[]>(initialRecipients.map(r => r.id));
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleFilterChange = (status: "open" | "overdue" | "all") => {
        setBalanceStatus(status);
        startTransition(async () => {
            const res = await getStatementRecipients(status);
            if (res.data) {
                setRecipients(res.data);
                setSelectedIds(res.data.map((r: any) => r.id));
            }
        });
    };

    const toggleAll = () => {
        if (selectedIds.length === recipients.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(recipients.map(r => r.id));
        }
    };

    const toggleOne = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    const handleAction = (actionName: string) => {
        if (selectedIds.length === 0) {
            showToast("No customers selected.", "error");
            return;
        }

        startTransition(async () => {
            for (const id of selectedIds) {
                await createStatement({
                    clientId: id,
                    statementType,
                    statementDate,
                    startDate,
                    endDate
                });
            }
            showToast(`Successfully processed statements for ${selectedIds.length} customer(s)!`, "success");
            setTimeout(() => router.push("/accounting"), 1500);
        });
    };

    const inputCls = "w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
    const labelCls = "text-xs font-bold text-slate-400 block mb-1.5";

    return (
        <div className="space-y-6">
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold border ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : "bg-rose-950 border-rose-500/30 text-rose-300"}`}>
                    {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Filter controls */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6">
                <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Statement Criteria</h2>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                        <label className={labelCls}>Statement Type</label>
                        <select value={statementType} onChange={e => setStatementType(e.target.value)} className={inputCls}>
                            <option value="balance_forward">Balance Forward</option>
                            <option value="open_item">Open Item</option>
                            <option value="transaction_statement">Transaction Statement</option>
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Statement Date</label>
                        <input type="date" value={statementDate} onChange={e => setStatementDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Start Date</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>End Date</label>
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Balance Status</label>
                        <select
                            value={balanceStatus}
                            onChange={e => handleFilterChange(e.target.value as any)}
                            className={inputCls}
                        >
                            <option value="open">Open (has balance)</option>
                            <option value="overdue">Overdue (past due date)</option>
                            <option value="all">All with activity</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Recipients list */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-800/80 flex items-center justify-between">
                    <h2 className="text-sm font-black text-white uppercase tracking-wider">
                        Recipients ({recipients.length})
                    </h2>
                    <span className="text-xs text-slate-500 font-bold">
                        {selectedIds.length} selected
                    </span>
                </div>
                {recipients.length === 0 ? (
                    <div className="text-center py-20 text-slate-600">
                        <AlertCircle className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-bold">No customers match this criteria</p>
                        <p className="text-xs mt-1">Try changing the balance status or statement dates.</p>
                    </div>
                ) : (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-800/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                <th className="px-5 py-3 w-[5%]">
                                    <input
                                        type="checkbox"
                                        checked={recipients.length > 0 && selectedIds.length === recipients.length}
                                        onChange={toggleAll}
                                        className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                                    />
                                </th>
                                <th className="px-5 py-3 w-[45%]">Customer</th>
                                <th className="px-3 py-3 w-[30%]">Email Address</th>
                                <th className="px-5 py-3 w-[20%] text-right">Balance</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recipients.map(r => (
                                <tr key={r.id} className="border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors">
                                    <td className="px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(r.id)}
                                            onChange={() => toggleOne(r.id)}
                                            className="rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500/30"
                                        />
                                    </td>
                                    <td className="px-5 py-4 font-bold text-white text-sm">{r.name}</td>
                                    <td className="px-3 py-4 text-slate-400 text-sm">{r.email || "—"}</td>
                                    <td className="px-5 py-4 text-right font-black text-white text-sm">
                                        {formatCurrency(balanceStatus === "overdue" ? r.overdueBalance : r.openBalance)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Actions Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all border border-slate-700"
                >
                    Cancel
                </button>
                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={() => handleAction("preview")}
                        disabled={isPending || selectedIds.length === 0}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all"
                    >
                        <Printer className="w-4 h-4" /> Print or Preview
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAction("save")}
                        disabled={isPending || selectedIds.length === 0}
                        className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all"
                    >
                        <Save className="w-4 h-4" /> Save
                    </button>
                    <button
                        type="button"
                        onClick={() => handleAction("send")}
                        disabled={isPending || selectedIds.length === 0}
                        className="flex items-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                    >
                        <Send className="w-4 h-4" /> Save and send
                    </button>
                </div>
            </div>
        </div>
    );
}
