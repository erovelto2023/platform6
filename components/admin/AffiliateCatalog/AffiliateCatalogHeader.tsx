"use client";

import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import AffiliateOfferForm from "./AffiliateOfferForm";
import AffiliateCatalogImportExportModal from "./AffiliateCatalogImportExportModal";

interface AffiliateCatalogHeaderProps {
    offers?: any[];
}

export default function AffiliateCatalogHeader({ offers = [] }: AffiliateCatalogHeaderProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl font-sans">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-2">
                    <Link href="/admin" className="hover:text-slate-100 transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Admin
                    </Link>
                    <span>/</span>
                    <span className="text-cyan-400 font-bold">Affiliate Catalog</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 uppercase">
                    Personal <span className="text-cyan-400">Affiliate</span> Catalog
                </h1>
                <p className="text-slate-400 text-xs font-mono">Manage your personal affiliate links, networks, and payout details for instant campaign embedding.</p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
                <AffiliateCatalogImportExportModal offers={offers} />

                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="rounded-2xl gap-2 h-10 px-5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold shadow-lg shadow-indigo-600/30 border-0 cursor-pointer text-xs">
                            <Plus size={18} /> Add New Offer
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-slate-100 font-black">Add New Affiliate Offer</DialogTitle>
                        </DialogHeader>
                        <AffiliateOfferForm onComplete={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>
        </div>
    );
}
