"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { SupplierForm } from "../_components/supplier-form";

export default function AddSupplierPage() {
    return (
        <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-6 font-sans">
            <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <Link href="/admin/wholesale-directory">
                    <Button variant="ghost" size="icon" className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-2xl">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-black text-slate-100 uppercase tracking-tight">Add New Wholesale Supplier</h1>
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-0.5">Directory & Dropshipping Supplier Entry</p>
                </div>
            </div>

            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl">
                <SupplierForm />
            </div>
        </div>
    );
}
