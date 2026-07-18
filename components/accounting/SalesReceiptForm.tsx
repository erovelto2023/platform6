"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, CheckCircle2, AlertCircle } from "lucide-react";
import { createSalesReceipt } from "@/lib/actions/sales-receipt.actions";
import { formatCurrency } from "@/lib/utils";

interface SalesReceiptFormProps {
    clients: any[];
    products: any[];
    nextReceiptNo: string;
}

const paymentMethods = ["cash", "check", "credit_card", "bank_transfer", "other"];
const methodLabels: Record<string, string> = {
    cash: "Cash", check: "Check", credit_card: "Credit Card", bank_transfer: "Bank Transfer", other: "Other"
};

export default function SalesReceiptForm({ clients, products, nextReceiptNo }: SalesReceiptFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [clientId, setClientId] = useState("");
    const [receiptNumber, setReceiptNumber] = useState(nextReceiptNo);
    const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
    const [paymentMethod, setPaymentMethod] = useState("cash");
    const [depositTo, setDepositTo] = useState("Cash on hand");
    const [referenceNo, setReferenceNo] = useState("");
    const [email, setEmail] = useState("");
    const [billingAddress, setBillingAddress] = useState("");
    const [message, setMessage] = useState("");
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const [items, setItems] = useState<Array<{ productService: string; description: string; quantity: number; rate: number; amount: number }>>([
        { productService: "", description: "", quantity: 1, rate: 0, amount: 0 }
    ]);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleClientChange = (val: string) => {
        setClientId(val);
        const selectedClient = clients.find(c => c._id === val);
        if (selectedClient) {
            setEmail(selectedClient.email || "");
            const addr = selectedClient.address;
            if (addr) {
                setBillingAddress(`${addr.street || ""}\n${addr.city || ""}, ${addr.state || ""} ${addr.zip || ""}\n${addr.country || ""}`);
            }
        } else {
            setEmail("");
            setBillingAddress("");
        }
    };

    const handleItemChange = (index: number, field: string, value: any) => {
        setItems(prev => {
            const next = [...prev];
            const item = { ...next[index], [field]: value };

            if (field === "productService" && products.length > 0) {
                const selectedProd = products.find(p => p._id === value);
                if (selectedProd) {
                    item.description = selectedProd.name + (selectedProd.description ? ` - ${selectedProd.description}` : "");
                    item.rate = selectedProd.price;
                }
            }

            item.amount = (item.quantity || 0) * (item.rate || 0);
            next[index] = item;
            return next;
        });
    };

    const addItem = () => {
        setItems(prev => [...prev, { productService: "", description: "", quantity: 1, rate: 0, amount: 0 }]);
    };

    const removeItem = (index: number) => {
        if (items.length === 1) return;
        setItems(prev => prev.filter((_, i) => i !== index));
    };

    const subtotal = items.reduce((s, item) => s + item.amount, 0);
    const tax = 0;
    const total = subtotal + tax;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (items.some(item => !item.description)) { showToast("All items must have a description.", "error"); return; }

        startTransition(async () => {
            const res = await createSalesReceipt({
                clientId: clientId || undefined,
                receiptNumber,
                date,
                paymentMethod,
                depositTo: depositTo || undefined,
                referenceNo: referenceNo || undefined,
                email: email || undefined,
                billingAddress: billingAddress || undefined,
                items,
                subtotal,
                tax,
                total,
                message
            });

            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast("Sales Receipt created & payment recorded!", "success");
                setTimeout(() => router.push("/accounting/sales-receipts"), 1500);
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

            {/* Header Details */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6">
                <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Receipt Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className={labelCls}>Customer (Optional)</label>
                        <select value={clientId} onChange={e => handleClientChange(e.target.value)} className={inputCls}>
                            <option value="">Walk-in Customer</option>
                            {clients.map((c: any) => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Email</label>
                        <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="customer@example.com" className={inputCls} />
                    </div>
                    <div>
                        <label className={labelCls}>Receipt Number</label>
                        <input value={receiptNumber} onChange={e => setReceiptNumber(e.target.value)} className={inputCls} required />
                    </div>
                    <div>
                        <label className={labelCls}>Payment Date</label>
                        <input type="date" value={date} onChange={e => setDate(e.target.value)} className={inputCls} required />
                    </div>
                </div>
            </div>

            {/* Payment Details */}
            <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-6">
                <h2 className="text-sm font-black text-white mb-4 uppercase tracking-wider">Payment Details</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className={labelCls}>Payment Method</label>
                        <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className={inputCls}>
                            {paymentMethods.map(m => (
                                <option key={m} value={m}>{methodLabels[m]}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className={labelCls}>Deposit To</label>
                        <input value={depositTo} onChange={e => setDepositTo(e.target.value)} className={inputCls} placeholder="e.g. Cash on hand" />
                    </div>
                    <div>
                        <label className={labelCls}>Reference No.</label>
                        <input value={referenceNo} onChange={e => setReferenceNo(e.target.value)} className={inputCls} placeholder="Check # or txn reference" />
                    </div>
                </div>
            </div>

            {/* Billing Address & Items */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    {/* Billing address input */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5">
                        <label className={labelCls}>Billing Address</label>
                        <textarea
                            value={billingAddress}
                            onChange={e => setBillingAddress(e.target.value)}
                            rows={3}
                            placeholder="Street, City, State, ZIP..."
                            className={inputCls}
                        />
                    </div>

                    {/* Table */}
                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl overflow-hidden">
                        <div className="px-5 py-4 border-b border-slate-800/80">
                            <h2 className="text-sm font-black text-white uppercase tracking-wider">Product or Service Items</h2>
                        </div>
                        <table className="w-full text-left">
                            <thead>
                                <tr className="border-b border-slate-800/80 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider">
                                    <th className="px-5 py-3 w-[25%]">Product/Service</th>
                                    <th className="px-3 py-3 w-[40%]">Description</th>
                                    <th className="px-3 py-3 w-[12%] text-right">Qty</th>
                                    <th className="px-3 py-3 w-[12%] text-right">Rate</th>
                                    <th className="px-3 py-3 w-[10%] text-right">Amount</th>
                                    <th className="px-5 py-3 w-[5%]"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={index} className="border-b border-slate-800/40 hover:bg-slate-800/10 transition-colors">
                                        <td className="px-5 py-3">
                                            <select
                                                value={item.productService}
                                                onChange={e => handleItemChange(index, "productService", e.target.value)}
                                                className={`${inputCls} py-1.5`}
                                            >
                                                <option value="">Select product...</option>
                                                {products.map(p => (
                                                    <option key={p._id} value={p._id}>{p.name}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td className="px-3 py-3">
                                            <input
                                                value={item.description}
                                                onChange={e => handleItemChange(index, "description", e.target.value)}
                                                placeholder="Item details..."
                                                className={`${inputCls} py-1.5`}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            <input
                                                type="number"
                                                min="0"
                                                value={item.quantity}
                                                onChange={e => handleItemChange(index, "quantity", parseInt(e.target.value, 10))}
                                                className={`${inputCls} py-1.5 text-right`}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-3">
                                            <input
                                                type="number"
                                                step="0.01"
                                                min="0"
                                                value={item.rate}
                                                onChange={e => handleItemChange(index, "rate", parseFloat(e.target.value))}
                                                className={`${inputCls} py-1.5 text-right`}
                                                required
                                            />
                                        </td>
                                        <td className="px-3 py-3 text-right text-sm font-bold text-white">
                                            {formatCurrency(item.amount)}
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
                        <h2 className="text-sm font-black text-white uppercase tracking-wider">Receipt Message</h2>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={3}
                            placeholder="Message displayed on receipt..."
                            className={inputCls}
                        />
                    </div>

                    <div className="bg-[#0d1117] border border-slate-800/80 rounded-2xl p-5 space-y-3 h-fit">
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Subtotal</span>
                            <span className="font-bold text-white">{formatCurrency(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-500">
                            <span>Tax (0%)</span>
                            <span className="font-bold text-white">{formatCurrency(tax)}</span>
                        </div>
                        <div className="border-t border-slate-800 pt-3 flex justify-between items-end">
                            <span className="text-sm font-bold text-slate-400">Total Collected</span>
                            <span className="text-xl font-black text-emerald-400">{formatCurrency(total)}</span>
                        </div>

                        <div className="pt-3 space-y-2">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
                            >
                                {isPending ? "Recording..." : "Record Sales Receipt"}
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
