"use client";

import { useState } from "react";
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
    Copy, 
    Edit, 
    Search,
    Check,
    MousePointerClick,
    ExternalLink,
    Trash2
} from "lucide-react";
import { deletePersonalOffer } from "@/lib/actions/personal-affiliate.actions";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import AffiliateOfferForm from "./AffiliateOfferForm";

interface AffiliateOfferListProps {
    offers: any[];
}

export default function AffiliateOfferList({ offers: initialOffers }: AffiliateOfferListProps) {
    const router = useRouter();
    const [offers, setOffers] = useState(initialOffers);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;
    const [editingOffer, setEditingOffer] = useState<any>(null);
    const [copiedId, setCopiedId] = useState<string | null>(null);
    const [copiedType, setCopiedType] = useState<'direct' | 'tracking' | null>(null);

    const filteredOffers = offers.filter(o => {
        const matchesSearch = o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            o.network.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLetter = selectedLetter 
            ? o.name.trim().toUpperCase().startsWith(selectedLetter)
            : true;
            
        return matchesSearch && matchesLetter;
    });

    const totalPages = Math.ceil(filteredOffers.length / itemsPerPage);
    const paginatedOffers = filteredOffers.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

    const handleCopy = (url: string, id: string, type: 'direct' | 'tracking') => {
        const finalUrl = type === 'tracking' ? `${window.location.origin}/api/click/${id}` : url;
        navigator.clipboard.writeText(finalUrl);
        setCopiedId(id);
        setCopiedType(type);
        toast.success(`${type === 'tracking' ? 'Tracking' : 'Direct'} link copied`);
        setTimeout(() => {
            setCopiedId(null);
            setCopiedType(null);
        }, 2000);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this offer from your catalog?")) return;
        
        try {
            const result = await deletePersonalOffer(id);
            if (result.success) {
                setOffers(prev => prev.filter(o => o._id !== id));
                toast.success("Offer deleted");
            } else {
                toast.error("Failed to delete");
            }
        } catch (error) {
            toast.error("An error occurred");
        }
    };

    return (
        <div className="space-y-6">
            {/* A-Z Filter */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-1 min-w-max">
                    <button
                        onClick={() => { setSelectedLetter(null); setCurrentPage(1); }}
                        className={`h-8 px-3 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${!selectedLetter ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                    >
                        All
                    </button>
                    {alphabet.map(letter => (
                        <button
                            key={letter}
                            onClick={() => { setSelectedLetter(letter); setCurrentPage(1); }}
                            className={`h-8 w-8 flex items-center justify-center rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${selectedLetter === letter ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'bg-slate-50 text-slate-400 hover:bg-slate-100'}`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search your catalog..." 
                    className="pl-10 h-12 rounded-xl"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Product</TableHead>
                            <TableHead>Network</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Payout</TableHead>
                            <TableHead className="text-center">Clicks</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {paginatedOffers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-10 text-slate-500 font-bold uppercase text-xs tracking-widest">
                                    No offers found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOffers.map((offer) => (
                                <TableRow key={offer._id} className="hover:bg-slate-50/50 transition-colors">
                                    <TableCell className="font-bold text-slate-900">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{offer.name}</span>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[8px] font-black uppercase text-blue-500 w-8">Aff:</span>
                                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{offer.affiliateLink}</span>
                                                </div>
                                                {offer.destinationLink && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[8px] font-black uppercase text-emerald-500 w-8">Dest:</span>
                                                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[120px]">{offer.destinationLink}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2 py-1 bg-slate-100 rounded text-[9px] font-black uppercase text-slate-600">
                                            {offer.network || "Direct"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs font-bold text-slate-600">{offer.productPrice || "—"}</TableCell>
                                    <TableCell className="text-xs font-black text-emerald-600">{offer.commissionLevel || "—"}</TableCell>
                                    <TableCell className="text-xs font-black text-blue-600">{offer.payoutAmount || "—"}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-slate-900">{offer.clicks || 0}</span>
                                            <span className="text-[8px] text-slate-400 uppercase font-black tracking-tighter">Total Clicks</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 gap-1.5 rounded-lg px-2 text-[9px] font-black uppercase tracking-tight border-blue-100 text-blue-600 hover:bg-blue-50"
                                                onClick={() => handleCopy(offer.affiliateLink, offer._id, 'tracking')}
                                            >
                                                {copiedId === offer._id && copiedType === 'tracking' ? <Check className="h-3 w-3" /> : <MousePointerClick className="h-3 w-3" />}
                                                Tracking
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-lg shrink-0"
                                                title="Copy Direct Link"
                                                onClick={() => handleCopy(offer.affiliateLink, offer._id, 'direct')}
                                            >
                                                {copiedId === offer._id && copiedType === 'direct' ? <Check className="h-3 w-3 text-green-600" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 shrink-0"
                                                onClick={() => setEditingOffer(offer)}
                                            >
                                                <Edit className="h-3.5 w-3.5 text-slate-400" />
                                            </Button>
                                            <Button 
                                                variant="ghost" 
                                                size="icon" 
                                                className="h-8 w-8 shrink-0"
                                                onClick={() => handleDelete(offer._id)}
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-rose-400" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Page {currentPage} of {totalPages} ({filteredOffers.length} total offers)
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg"
                        >
                            Prev
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            className="h-8 text-[10px] font-black uppercase tracking-widest rounded-lg"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            )}

            <Dialog open={!!editingOffer} onOpenChange={() => setEditingOffer(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Offer Details</DialogTitle>
                    </DialogHeader>
                    {editingOffer && (
                        <AffiliateOfferForm 
                            initialData={editingOffer} 
                            onComplete={() => {
                                setEditingOffer(null);
                                router.refresh();
                            }} 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
