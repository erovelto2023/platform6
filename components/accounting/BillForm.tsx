"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { createBill } from "@/lib/actions/bill.actions";
import { formatCurrency } from "@/lib/utils";

interface BillFormProps {
    vendors: any[];
}

const termsOptions = ["Due on receipt", "Net 15", "Net 30", "Net 60"];
const categoryOptions = [
    "Advertising & Marketing",
    "Automobile / Car Expenses",
    "Bank Fees & Charges",
    "Contractors",
    "Equipment Rent & Lease",
    "Insurance",
    "Interest Expense",
    "Legal & Professional Services",
    "Meals & Entertainment",
    "Office Supplies",
    "Rent & Lease",
    "Repairs & Maintenance",
    "Salaries & Wages",
    "Software & Subscriptions",
    "Travel Expenses",
    "Utilities",
    "Other Expenses"
];

export default function BillForm({ vendors }: BillFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [vendorId, setVendorId] = useState("");
    const [billNumber, setBillNumber] = useState("");
    const [billDate, setBillDate] = useState(new Date().toISOString().split("T")[0]);
    const [dueDate, setDueDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]);
    const [terms, setTerms] = useState("Net 30");
    const [refNo, setRefNo] = useState("");
    const [mailingAddress, setMailingAddress] = useState("");
    const [memo, setMemo] = useState("");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const [items, setItems] = useState<Array<{ category: string; description: string; amount: number }>>([
        { category: "Software & Subscriptions", description: "", amount: 0 }
    ]);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleVendorChange = (val: string) => {
        setVendorId(val);
        const v = vendors.find(x => x._id === val);
        if (v && v.address) {
            setMailingAddress(`${v.address.street || ""}\n${v.address.city || ""}, ${v.address.state || ""} ${v.address.zip || ""}`);
        } else {
            setMailingAddress("");
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        setItems(prev => {
            const next = [...prev];
            next[index] = { ...next[index], [field]: value };
            return next;
        });
    };

    const addItem = () => {
        setItems(prev => [...prev, { category: "Other Expenses", description: "", amount: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const total = items.reduce((s, item) => s + (item.amount || 0), 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!vendorId) { showToast("Vendor is required.", "error"); return; }
        if (items.some(item => !item.category)) { showToast("All lines must have a category.", "error"); return; }

        startTransition(async () => {
            const res = await createBill({
                vendorId,
                billNumber,
                billDate,
                dueDate,
                terms,
                refNo: refNo || undefined,
                mailingAddress: mailingAddress || undefined,
                items,
                total,
                memo
            });

            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast("Bill created and logged in AP!", "success");
                setTimeout(() => router.push("/accounting/bills"), 1500);
            }
        });
    };

    const inputCls = "w-full bg-[#0d1117] border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors";
    const labelCls = "text-xs font-bold text-slate-400 block mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold border ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : "bg-rose-950 border-rose-500/30 text-rose-300"}`}>
                    {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {/* Vendor & Dates */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6">
                <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Bill Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className={labelCls}>Vendor *</label>
                        <select value={vendorId} onChange={e => handleVendorChange(e.target.value)} className={inputCls} required>
                            <option value="">Choose a vendor</option>
                            {vendors.map((v: any) => (
                                <option key={v._id} value={v._id}>{v.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Terms</label>
                        <select value={terms} onChange={e => setTerms(e.target.value)} className={inputCls}>
                            {termsOptions.map(t => (
                                <option key={t} value={t}>{t}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Bill Date</label>
                        <input type="date" value={billDate} onChange={e => setBillDate(e.target.value)} className={inputCls} required />
                    </div>
                    <div>
                        <label className={labelCls}>Due Date</label>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={inputCls} required />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div>
                        <label className={labelCls}>Bill Number</label>
                        <input value={billNumber} onChange={e => setBillNumber(e.target.value)} placeholder="e.g. BILL-9923" className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Ref No. / Permit</label>
                        <input value={refNo} onChange={e => setRefNo(e.target.value)} placeholder="e.g. PO-8832" className={inputCls} />
                    </div>
                </div>
            </div>

            {/* Address & Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Mailing address */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <label className={labelCls}>Mailing Address</label>
                        <textarea
                            value={mailingAddress}
                            onChange={e => setMailingAddress(e.target.value)}
                            rows={3}
                            placeholder="Mailing address details..."
                            className={inputCls}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800/80">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Category Details</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3 w-[40%]">Category</th>
                                    <th className="px-3 py-3 w-[45%]">Description</th>
                                    <th className="px-3 py-3 w-[10%] text-right">Amount</th>
                                    <th className="px-5 py-3 w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors">
                                        <td className="px-5 py-3">
                                            <select
                                                value={item.category}
                                                onChange={e => handleItemChange(index, "category", e.target.value)}
                                                className={`${inputCls} py-1.5`}
                                            >
                                                {categoryOptions.map(cat => (
                                                    <option key={cat} value={cat}>{cat}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-3">
                                            <input
                                                value={item.description}
                                                onChange={e => handleItemChange(index, "description", e.target.value)}
                                                placeholder="Expense details..."
                                                className={`${inputCls} py-1.5`}
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.amount || ""}
                                                onChange={e => handleItemChange(index, "amount", parseFloat(e.target.value))}
                                                className={`${inputCls} py-1.5 text-right`}
                                                required
                                            />
                                        </td>
                                        <td className="px-5 py-3 text-center">
                                            <button
                                                type="button"
                                                onClick={() => removeItem(index)}
                                                disabled={items.length === 1}
                                                className="text-slate-500 hover:text-rose-400 disabled:opacity-30 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="p-4 border-t border-slate-800/40">
                            <button
                                type="button"
                                onClick={addItem}
                                className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                            >
                                <Plus className="w-3.5 h-3.5" /> Add line
                            </button>
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-4">
                        <label className={labelCls}>Memo (internal)</label>
                        <textarea
                            value={memo}
                            onChange={e => setMemo(e.target.value)}
                            rows={3}
                            placeholder="Memo notes..."
                            className={inputCls}
                        />
                    </div>

                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-3 h-fit">
                        <div className="border-b border-slate-800 pb-3 flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-400">Total Owed</span>
                            <span className="text-xl font-black text-rose-400">{formatCurrency(total)}</span>
                        </div>

                        <div className="pt-3 space-y-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-indigo-500/20"
                            >
                                {isPending ? "Saving..." : "Save Bill"}
                            </button>
                            <button
                                type="button"
                                onClick={() => router.back()}
                                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-sm rounded-xl transition-all border border-slate-700"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
