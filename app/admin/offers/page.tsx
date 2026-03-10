import { getOffers } from "@/lib/actions/offer.actions";
import OfferListClient from "@/components/admin/OfferListClient";
import { Plus, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function AdminOffersPage() {
    const result = await getOffers();
    const offers = result.success ? result.data : [];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/20">
                            <Tag size={24} />
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Offer Builder</h1>
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-12">
                        Build and manage high-converting sales & marketing offers
                    </p>
                </div>
            </div>

            <OfferListClient initialOffers={offers} />
        </div>
    );
}
