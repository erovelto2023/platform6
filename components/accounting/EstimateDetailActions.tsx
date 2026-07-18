"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, AlertCircle, RefreshCw, Trash2, Check, X } from "lucide-react";
import { updateEstimateStatus, deleteEstimate, convertEstimateToInvoice } from "@/lib/actions/estimate.actions";

export default function EstimateDetailActions({ estimate }: { estimate: any }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

    const showToast = (msg: string, type: "success" | "error") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const handleStatus = (status: string) => {
        startTransition(async () => {
            const res = await updateEstimateStatus(estimate._id, status);
            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast(`Estimate marked as ${status}!`, "success");
                router.refresh();
            }
        });
    };

    const handleConvert = () => {
        startTransition(async () => {
            const res = await convertEstimateToInvoice(estimate._id);
            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast("Converted to Invoice successfully!", "success");
                setTimeout(() => router.push(`/accounting/invoices`), 1500);
            }
        });
    };

    const handleDelete = () => {
        if (!confirm("Are you sure you want to delete this estimate?")) return;
        startTransition(async () => {
            const res = await deleteEstimate(estimate._id);
            if (res.error) {
                showToast(res.error, "error");
            } else {
                showToast("Estimate deleted.", "success");
                setTimeout(() => router.push("/accounting/estimates"), 1000);
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

            {estimate.status === "pending" && (
                <>
                    <button onClick={() => handleStatus("accepted")} disabled={isPending}
                        className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-emerald-500/20">
                        <Check className="w-3.5 h-3.5" /> Accept
                    </button>
                    <button onClick={() => handleStatus("declined")} disabled={isPending}
                        className="flex items-center gap-1.5 px-3 py-2 bg-rose-600/20 hover:bg-rose-600/30 border border-rose-500/30 text-rose-400 text-xs font-bold rounded-xl transition-all">
                        <X className="w-3.5 h-3.5" /> Decline
                    </button>
                </>
            )}

            {estimate.status === "accepted" && (
                <button onClick={handleConvert} disabled={isPending}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20">
                    <RefreshCw className="w-3.5 h-3.5" /> Convert to Invoice
                </button>
            )}

            <button onClick={handleDelete} disabled={isPending} className={`${btnCls} text-rose-400 hover:bg-rose-905/30 border-rose-500/10`}>
                <Trash2 className="w-3.5 h-3.5" /> Delete
            </button>
        </div>
    );
}
