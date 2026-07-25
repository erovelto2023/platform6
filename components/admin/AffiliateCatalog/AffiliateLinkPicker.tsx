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
    useTrackingLink?: boolean;
}

export default function AffiliateLinkPicker({ 
    onSelect, 
    trigger,
    useTrackingLink = true
}: AffiliateLinkPickerProps) {
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
        if (useTrackingLink) {
            const trackingUrl = `${window.location.origin}/api/click/${offer._id}`;
            onSelect(trackingUrl);
        } else {
            onSelect(offer.affiliateLink);
        }
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
                        className="flex items-center gap-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-slate-900 border-slate-700 text-cyan-300 hover:bg-slate-800"
                    >
                        <Database size={14} />
                        From Catalog
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl">
                <DialogHeader className="border-b border-slate-800 pb-3">
                    <DialogTitle className="flex items-center gap-2 text-slate-100 font-extrabold text-base">
                        <LinkIcon className="h-5 w-5 text-cyan-400" />
                        Select Affiliate Offer
                    </DialogTitle>
                </DialogHeader>

                <div className="relative mt-4">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search catalog by offer name or network..." 
                        className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-xl text-xs font-mono"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex-1 overflow-y-auto mt-4 space-y-2 pr-2 custom-scrollbar">
                    {loading ? (
                        <div className="text-center py-10 text-xs text-slate-400 font-mono">Loading offer catalog...</div>
                    ) : filteredOffers.length === 0 ? (
                        <div className="text-center py-10 text-xs text-slate-400 font-mono">No matching offers found in catalog.</div>
                    ) : (
                        filteredOffers.map((offer) => (
                            <button
                                key={offer._id}
                                onClick={() => handleSelect(offer)}
                                className="w-full text-left p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/80 hover:bg-slate-900 transition-all group cursor-pointer"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="font-extrabold text-sm text-slate-100 group-hover:text-cyan-300 transition-colors">
                                            {offer.name}
                                        </h4>
                                        <p className="text-xs text-cyan-400 font-mono mt-1 truncate max-w-[400px]">
                                            {offer.affiliateLink}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] font-mono font-bold uppercase bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-lg text-cyan-300">
                                            {offer.network || "Direct"}
                                        </span>
                                        <p className="text-xs font-extrabold text-emerald-400 mt-1">{offer.payoutAmount}</p>
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
