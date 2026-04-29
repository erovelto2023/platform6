import { getPersonalOffers } from "@/lib/actions/personal-affiliate.actions";
import AffiliateOfferList from "@/components/admin/AffiliateCatalog/AffiliateOfferList";
import AffiliateOfferForm from "@/components/admin/AffiliateCatalog/AffiliateOfferForm";
import { 
    LayoutGrid,
} from "lucide-react";

import AffiliateCatalogHeader from "@/components/admin/AffiliateCatalog/AffiliateCatalogHeader";

export default async function AffiliateCatalogPage() {
    const result = await getPersonalOffers();
    const offers = result.success ? result.data : [];

    return (
        <div className="p-8 space-y-8 bg-slate-50/50 min-h-screen">
            {/* Header */}
            <AffiliateCatalogHeader />

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-blue-50 flex items-center justify-center">
                        <LayoutGrid className="text-blue-600" size={24} />
                    </div>
                    <div>
                        <p className="text-xs font-black uppercase text-slate-400 tracking-widest">Total Offers</p>
                        <p className="text-2xl font-bold text-slate-900">{offers.length}</p>
                    </div>
                </div>
            </div>

            {/* Catalog List */}
            <AffiliateOfferList offers={offers} />
        </div>
    );
}
