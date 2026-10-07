"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles, Zap, ArrowRight, DollarSign, Award, Tag } from 'lucide-react';

interface RotatingAffiliateBannerProps {
    offers?: any[];          // PersonalAffiliateOffer catalog items
    selectedOfferId?: string; // Admin selected offer ID for override
    products?: any[];        // Fallback directory products
    className?: string;
}

export default function RotatingAffiliateBanner({ 
    offers = [], 
    selectedOfferId, 
    products = [], 
    className = "" 
}: RotatingAffiliateBannerProps) {
    const [activeOffer, setActiveOffer] = useState<any>(null);

    useEffect(() => {
        // 1. Check if an explicit offer was selected by admin
        if (selectedOfferId && offers && offers.length > 0) {
            const matched = offers.find(o => String(o._id) === String(selectedOfferId));
            if (matched) {
                setActiveOffer(matched);
                return;
            }
        }

        // 2. Otherwise pick a random product from the Affiliate Catalog
        const validOffers = (offers && offers.length > 0) 
            ? offers.filter(o => o.affiliateLink && o.affiliateLink.trim() !== "")
            : [];

        if (validOffers.length > 0) {
            const randomIndex = Math.floor(Math.random() * validOffers.length);
            setActiveOffer(validOffers[randomIndex]);
            return;
        }

        // 3. Fallback to Directory Products if no Affiliate Catalog offers exist
        const validProducts = (products && products.length > 0)
            ? products.filter(p => p.affiliateLink && p.affiliateLink.trim() !== "")
            : [];

        if (validProducts.length > 0) {
            const randomIndex = Math.floor(Math.random() * validProducts.length);
            setActiveOffer(validProducts[randomIndex]);
        }
    }, [offers, selectedOfferId, products]);

    if (!activeOffer) return null;

    const displayImage = activeOffer.imageUrl || activeOffer.logoUrl;
    const targetLink = activeOffer._id ? `/api/click/${activeOffer._id}` : activeOffer.affiliateLink;

    return (
        <div className={`relative group overflow-hidden rounded-3xl p-6 border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-500 hover:border-cyan-500/50 ${className}`}>
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700 pointer-events-none" />
            
            <div className="relative flex flex-col h-full z-10 space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                    <div className="px-3 py-1 rounded-xl bg-purple-950/80 text-purple-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-purple-800/80">
                        <Sparkles size={12} className="text-purple-400 group-hover:animate-pulse" />
                        {selectedOfferId ? "FEATURED AFFILIATE OFFER" : "RECOMMENDED PRODUCT"}
                    </div>
                    {activeOffer.network && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-400 bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-800/80">
                            <Tag size={10} className="text-cyan-400" />
                            {activeOffer.network}
                        </div>
                    )}
                </div>

                {/* Image or Network Gradient Banner */}
                {displayImage ? (
                    <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                        <img 
                            src={displayImage} 
                            alt={activeOffer.name} 
                            className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                ) : (
                    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950 border border-purple-900/40 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-purple-900/50">
                            {activeOffer.name ? activeOffer.name.charAt(0).toUpperCase() : "A"}
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase text-purple-300 tracking-widest">
                            Affiliate Catalog Product
                        </span>
                    </div>
                )}

                {/* Title & Network */}
                <div>
                    <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors leading-tight">
                        {activeOffer.name}
                    </h3>
                    <p className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider mt-1">
                        {activeOffer.network || activeOffer.category || 'Digital Product'}
                    </p>
                </div>

                {/* Price & Payout Metrics if available */}
                {(activeOffer.productPrice || activeOffer.commissionLevel || activeOffer.payoutAmount) && (
                    <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-xs">
                        {activeOffer.productPrice && (
                            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                                <span className="block text-[8px] uppercase text-slate-500 font-bold">Price</span>
                                <span className="font-bold text-slate-100">{activeOffer.productPrice}</span>
                            </div>
                        )}
                        {(activeOffer.commissionLevel || activeOffer.payoutAmount) && (
                            <div className="p-2 bg-slate-950 rounded-xl border border-slate-800 text-emerald-400">
                                <span className="block text-[8px] uppercase text-slate-500 font-bold">Commission</span>
                                <span className="font-bold">{activeOffer.commissionLevel || activeOffer.payoutAmount}</span>
                            </div>
                        )}
                    </div>
                )}

                {/* Description or Notes */}
                {(activeOffer.notes || activeOffer.shortDescription || activeOffer.description) && (
                    <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                        {activeOffer.notes || activeOffer.shortDescription || activeOffer.description}
                    </p>
                )}

                {/* Call to Action Button */}
                <div className="pt-2 mt-auto space-y-2">
                    <Link 
                        href={targetLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 px-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white rounded-2xl font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all uppercase tracking-wider group/btn cursor-pointer"
                    >
                        <span>Access Product / Offer</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
