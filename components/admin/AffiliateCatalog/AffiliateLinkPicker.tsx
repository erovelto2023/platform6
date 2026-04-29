"use client";

import { useState, useEffect } from "react";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Link as LinkIcon, Search, Database } from "lucide-react";
import { getPersonalOffers } from "@/lib/actions/personal-affiliate.actions";
import { Input } from "@/components/ui/input";

interface AffiliateLinkPickerProps {
    onSelect: (url: string) => void;
    trigger?: React.ReactNode;
}

export default function AffiliateLinkPicker({ onSelect, trigger }: AffiliateLinkPickerProps) {
    const [open, setOpen] = useState(false);
    const [offers, setOffers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        if (open) {
            fetchOffers();
        }
    }, [open]);

    const fetchOffers = async () => {
        setLoading(true);
        const result = await getPersonalOffers();
        if (result.success) {
            setOffers(result.data);
        }
        setLoading(false);
    };

    const filteredOffers = offers.filter(o => 
        o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.network?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelect = (offer: any) => {
        const trackingUrl = `${window.location.origin}/api/click/${offer._id}`;
        onSelect(trackingUrl);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button 
                        type="button" 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-slate-200"
                    >
                        <Database size={14} />
                        From Catalog
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-blue-600" />
                        Select Affiliate Offer
                    </DialogTitle>
                </DialogHeader>

                <div className="relative mt-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search your catalog..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-slate-500">Loading catalog...</div>
                    ) : filteredOffers.length === 0 ? (
                        <div className="text-center py-10 text-slate-500">No offers found.</div>
                    ) : (
                        filteredOffers.map((offer) => (
                            <button
                                key={offer._id}
                                onClick={() => handleSelect(offer)}
                                className="w-full text-left p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all group"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                                            {offer.name}
                                        </h4>
                                        <p className="text-xs text-slate-500 mt-1 truncate max-w-[400px]">
                                            {offer.affiliateLink}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-black uppercase bg-slate-100 px-2 py-1 rounded text-slate-600">
                                            {offer.network}
                                        </span>
                                        <p className="text-sm font-bold text-blue-600 mt-1">{offer.payoutAmount}</p>
                                    </div>
                                </div>
                            </button>
                        ))
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
