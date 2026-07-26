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
    Trash2,
    ChevronLeft,
    ChevronRight
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

    const getVisiblePages = (current: number, total: number) => {
        if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
        if (current <= 4) return [1, 2, 3, 4, 5, "...", total];
        if (current >= total - 3) return [1, "...", total - 4, total - 3, total - 2, total - 1, total];
        return [1, "...", current - 1, current, current + 1, "...", total];
    };

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
        <div className="space-y-6 font-sans">
            {/* A-Z Filter */}
            <div className="bg-slate-900 p-4 rounded-3xl border border-slate-800 shadow-xl overflow-x-auto [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center gap-1 min-w-max">
                    <button
                        onClick={() => { setSelectedLetter(null); setCurrentPage(1); }}
                        className={`h-8 px-3.5 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider transition-all cursor-pointer ${!selectedLetter ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'}`}
                    >
                        All
                    </button>
                    {alphabet.map(letter => (
                        <button
                            key={letter}
                            onClick={() => { setSelectedLetter(letter); setCurrentPage(1); }}
                            className={`h-8 w-8 flex items-center justify-center rounded-xl text-[10px] font-mono font-black uppercase transition-all cursor-pointer ${selectedLetter === letter ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30' : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'}`}
                        >
                            {letter}
                        </button>
                    ))}
                </div>
            </div>

            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Search your catalog by offer name or affiliate network..." 
                    className="pl-10 h-12 rounded-2xl bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 text-xs font-mono"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                />
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-slate-950">
                        <TableRow className="border-b border-slate-800/80">
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Product</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Network</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Price</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Commission</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Payout</TableHead>
                            <TableHead className="text-center text-slate-300 font-extrabold text-xs uppercase tracking-wider">Clicks</TableHead>
                            <TableHead className="text-right text-slate-300 font-extrabold text-xs uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-800/80">
                        {paginatedOffers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-12 text-slate-400 font-mono font-bold uppercase text-xs tracking-widest">
                                    No offers found matching your criteria.
                                </TableCell>
                            </TableRow>
                        ) : (
                            paginatedOffers.map((offer) => (
                                <TableRow key={offer._id} className="hover:bg-slate-950/60 transition-colors">
                                    <TableCell className="font-extrabold text-slate-100">
                                        <div className="flex flex-col">
                                            <span className="text-sm">{offer.name}</span>
                                            <div className="flex flex-col gap-0.5 mt-1">
                                                <div className="flex items-center gap-1">
                                                    <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 w-8">Aff:</span>
                                                    <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{offer.affiliateLink}</span>
                                                </div>
                                                {offer.destinationLink && (
                                                    <div className="flex items-center gap-1">
                                                        <span className="text-[9px] font-mono font-bold uppercase text-emerald-400 w-8">Dest:</span>
                                                        <span className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">{offer.destinationLink}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-mono font-bold uppercase text-cyan-300">
                                            {offer.network || "Direct"}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-xs font-mono font-bold text-slate-300">{offer.productPrice || "—"}</TableCell>
                                    <TableCell className="text-xs font-mono font-black text-emerald-400">{offer.commissionLevel || "—"}</TableCell>
                                    <TableCell className="text-xs font-mono font-black text-cyan-400">{offer.payoutAmount || "—"}</TableCell>
                                    <TableCell className="text-center">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-slate-100 font-mono">{offer.clicks || 0}</span>
                                            <span className="text-[8px] text-slate-500 uppercase font-mono font-bold">Total Clicks</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-1.5">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="h-8 gap-1.5 rounded-xl px-2.5 text-[9px] font-mono font-bold uppercase tracking-tight bg-slate-950 border-indigo-900/60 text-indigo-300 hover:bg-indigo-950"
                                                onClick={() => handleCopy(offer.affiliateLink, offer._id, 'tracking')}
                                            >
                                                {copiedId === offer._id && copiedType === 'tracking' ? <Check className="h-3 w-3" /> : <MousePointerClick className="h-3 w-3" />}
                                                Tracking
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-xl shrink-0 bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-100 hover:bg-slate-800"
                                                title="Copy Direct Link"
                                                onClick={() => handleCopy(offer.affiliateLink, offer._id, 'direct')}
                                            >
                                                {copiedId === offer._id && copiedType === 'direct' ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                                            </Button>
                                            {offer.destinationLink && (
                                                <a 
                                                    href={offer.destinationLink} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="h-8 w-8 rounded-xl shrink-0 bg-slate-950 border border-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 flex items-center justify-center transition"
                                                >
                                                    <ExternalLink className="h-3 w-3" />
                                                </a>
                                            )}
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-xl shrink-0 bg-slate-950 border-slate-800 text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                                                onClick={() => setEditingOffer(offer)}
                                            >
                                                <Edit className="h-3 w-3" />
                                            </Button>
                                            <Button 
                                                variant="outline" 
                                                size="icon" 
                                                className="h-8 w-8 rounded-xl shrink-0 bg-slate-950 border-slate-800 text-slate-400 hover:text-rose-400 hover:bg-rose-950"
                                                onClick={() => handleDelete(offer._id)}
                                            >
                                                <Trash2 className="h-3 w-3" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 bg-slate-900 border border-slate-800 rounded-3xl shadow-xl font-mono text-xs text-slate-400">
                    <div className="flex items-center gap-2">
                        <span>Showing</span>
                        <span className="font-bold text-cyan-400">{(currentPage - 1) * itemsPerPage + 1}</span>
                        <span>-</span>
                        <span className="font-bold text-cyan-400">{Math.min(currentPage * itemsPerPage, filteredOffers.length)}</span>
                        <span>of</span>
                        <span className="font-bold text-slate-100">{filteredOffers.length}</span>
                        <span>offers</span>
                    </div>

                    <div className="flex items-center gap-2 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="h-9 px-3 rounded-xl bg-slate-950 border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
                        >
                            <ChevronLeft size={14} className="mr-1" /> Previous
                        </Button>

                        <div className="flex items-center gap-1">
                            {getVisiblePages(currentPage, totalPages).map((page, idx) => {
                                if (page === "...") {
                                    return (
                                        <span key={`ellipsis-${idx}`} className="h-9 px-2 flex items-center justify-center text-slate-500 font-bold font-mono">
                                            ...
                                        </span>
                                    );
                                }
                                const pageNum = page as number;
                                return (
                                    <button
                                        key={pageNum}
                                        onClick={() => setCurrentPage(pageNum)}
                                        className={`h-9 w-9 rounded-xl font-bold font-mono transition-all cursor-pointer ${
                                            currentPage === pageNum
                                                ? 'bg-cyan-600 text-white shadow-lg shadow-cyan-600/30'
                                                : 'bg-slate-950 border border-slate-800 text-slate-400 hover:text-white'
                                        }`}
                                    >
                                        {pageNum}
                                    </button>
                                );
                            })}
                        </div>

                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="h-9 px-3 rounded-xl bg-slate-950 border-slate-800 text-slate-300 hover:text-white disabled:opacity-40 cursor-pointer"
                        >
                            Next <ChevronRight size={14} className="ml-1" />
                        </Button>
                    </div>
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={!!editingOffer} onOpenChange={(open) => !open && setEditingOffer(null)}>
                <DialogContent className="max-w-2xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-slate-100 font-black">Edit Affiliate Offer</DialogTitle>
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
