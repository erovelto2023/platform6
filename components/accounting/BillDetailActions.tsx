"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, Trash2, Check } from "lucide-react";
import { updateBillStatus, deleteBill } from "@/lib/actions/bill.actions";

export default function BillDetailActions({ bill }: { bill: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleStatus = (status: string) => {
        startTransition(async () => {
            const res = await updateBillStatus(bill._id, status);
            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast(`Bill marked as ${status}!`, "success");
                router.refresh();
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this bill?")) return;
        startTransition(async () => {
            const res = await deleteBill(bill._id);
            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast("Bill deleted.", "success");
                setTimeout(() => router.push("/accounting/bills"), 1000);
            }
        });
    };

    const btnCls = "flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-xl border border-slate-700 transition-all";

    return (
        <div className="flex items-center gap-2">
            {toast && (
                <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl shadow-2xl text-sm font-bold border ${toast.type === "success" ? "bg-emerald-950 border-emerald-500/30 text-emerald-300" : "bg-rose-950 border-rose-500/30 text-rose-300"}`}>
                    {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    {toast.msg}
                </div>
            )}

            {bill.status !== "paid" && (
                <button onClick={() => handleStatus("paid")} disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                    <Check className="w-3.5 h-3.5" /> Mark Paid
                </button>
            )}

            <button onClick={handleDelete} disabled={isPending} className={`${btnCls} text-rose-400 hover:bg-rose-905/30 border-rose-500/10`}>
                <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
        </div>
    );
}
