import { getPersonalOffers } from "@/lib/actions/personal-affiliate.actions";
import AffiliateOfferList from "@/components/admin/AffiliateCatalog/AffiliateOfferList";
import { LayoutGrid } from "lucide-react";
import AffiliateCatalogHeader from "@/components/admin/AffiliateCatalog/AffiliateCatalogHeader";

export default async function AffiliateCatalogPage() {
    const result = await getPersonalOffers();
    const offers = result.success ? result.data : [];

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            {/* Header */}
            <AffiliateCatalogHeader offers={offers} />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-cyan-950 border border-cyan-800 flex items-center justify-center">
                        <LayoutGrid className="text-cyan-400" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-mono font-bold uppercase text-slate-400 tracking-wider">Total Offers</p>
                        <p className="text-2xl font-black text-slate-100 font-mono">{offers.length}</p>
                    </div>
                </div>
            </div>

            {/* Catalog List */}
            <AffiliateOfferList offers={offers} />
        </div>
    );
}
