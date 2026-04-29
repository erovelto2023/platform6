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

export default function AffiliateCatalogHeader() {
    const [open, setOpen] = useState(false);

    return (
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                    <Link href="/admin" className="hover:text-slate-900 transition-colors flex items-center gap-1">
                        <ArrowLeft size={14} /> Admin
                    </Link>
                    <span>/</span>
                    <span className="text-slate-900 font-medium">Affiliate Catalog</span>
                </div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">
                    Personal <span className="text-blue-600">Affiliate</span> Catalog
                </h1>
                <p className="text-slate-500">Manage your personal affiliate links and payout details for easy reuse.</p>
            </div>

            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="rounded-xl gap-2 h-12 px-6 bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-200">
                        <Plus size={20} /> Add New Offer
                    </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>Add New Affiliate Offer</DialogTitle>
                    </DialogHeader>
                    <AffiliateOfferForm onComplete={() => setOpen(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}
