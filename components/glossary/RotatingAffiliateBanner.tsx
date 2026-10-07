"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight } from 'lucide-react';

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
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
            
            <div className="relative flex flex-col h-full z-10 space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                    <div className="px-3.5 py-1.5 rounded-xl bg-cyan-950/90 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-cyan-800/80 shadow-sm">
                        <Sparkles size={12} className="text-cyan-400 group-hover:animate-pulse" />
                        RECOMMENDED PRODUCT / RESOURCE
                    </div>
                </div>

                {/* Image or Clean Fallback Gradient Banner */}
                {displayImage ? (
                    <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                        <img 
                            src={displayImage} 
                            alt={activeOffer.name} 
                            className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                ) : (
                    <div className="w-full p-6 rounded-2xl bg-gradient-to-br from-slate-950 via-cyan-950/30 to-slate-950 border border-slate-800 flex flex-col items-center justify-center text-center space-y-2 shadow-inner">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-600 to-indigo-600 flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-cyan-950">
                            {activeOffer.name ? activeOffer.name.charAt(0).toUpperCase() : "R"}
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase text-cyan-400 tracking-widest">
                            RECOMMENDED RESOURCE
                        </span>
                    </div>
                )}

                {/* Title */}
                <div>
                    <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors leading-tight">
                        {activeOffer.name}
                    </h3>
                    {activeOffer.category && (
                        <p className="text-[10px] font-mono text-slate-400 uppercase font-bold tracking-wider mt-1">
                            {activeOffer.category}
                        </p>
                    )}
                </div>

                {/* Description if available */}
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
                        className="w-full py-3.5 px-5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-2xl font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all uppercase tracking-wider group/btn cursor-pointer"
                    >
                        <span>Access Product / Resource</span>
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
