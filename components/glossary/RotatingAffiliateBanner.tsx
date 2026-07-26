"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles, Zap, ArrowRight } from 'lucide-react';

interface RotatingAffiliateBannerProps {
    products: any[];
    className?: string;
    isPremium?: boolean;
}

export default function RotatingAffiliateBanner({ products, className = "", isPremium = false }: RotatingAffiliateBannerProps) {
    const [randomProduct, setRandomProduct] = useState<any>(null);

    useEffect(() => {
        // Filter for products that have an affiliate link
        const affiliateProducts = products.filter(p => p.affiliateLink && p.affiliateLink.trim() !== "");
        
        if (affiliateProducts.length > 0) {
            // Pick a random product on load
            const randomIndex = Math.floor(Math.random() * affiliateProducts.length);
            setRandomProduct(affiliateProducts[randomIndex]);
        }
    }, [products]);

    if (!randomProduct) return null;

    const displayImage = randomProduct.imageUrl || randomProduct.logoUrl;

    return (
        <div className={`relative group overflow-hidden rounded-3xl p-6 border border-slate-800 bg-slate-900 shadow-2xl transition-all duration-500 ${className}`}>
            {/* Ambient Background Glow */}
            <div className="absolute -right-10 -top-10 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/20 transition-all duration-700 pointer-events-none" />
            
            <div className="relative flex flex-col h-full z-10 space-y-4">
                {/* Header Badge */}
                <div className="flex items-center justify-between">
                    <div className="px-3 py-1 rounded-xl bg-cyan-950/80 text-cyan-400 text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1.5 border border-cyan-800/60">
                        <Sparkles size={12} className="text-cyan-400 group-hover:animate-pulse" />
                        RECOMMENDED TOOL
                    </div>
                    {randomProduct.deal && (
                        <div className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-xl border border-amber-800/80 animate-pulse">
                            <Zap size={10} className="fill-amber-400 text-amber-400" />
                            DEAL
                        </div>
                    )}
                </div>

                {/* Prominent Large Tool Image Container */}
                {displayImage ? (
                    <div className="relative w-full h-44 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800/80 flex items-center justify-center p-3 group-hover:border-cyan-500/50 transition-colors shadow-inner">
                        <img 
                            src={displayImage} 
                            alt={randomProduct.name} 
                            className="max-h-full max-w-full object-contain rounded-xl drop-shadow-md group-hover:scale-105 transition-transform duration-500" 
                        />
                    </div>
                ) : (
                    <div className={`w-full h-32 rounded-2xl flex items-center justify-center text-white font-black text-4xl shadow-xl ${randomProduct.logoColor || 'bg-cyan-600'}`}>
                        {randomProduct.name.charAt(0)}
                    </div>
                )}

                {/* Tool Title & Category */}
                <div>
                    <h3 className="text-xl font-black text-slate-100 group-hover:text-cyan-300 transition-colors leading-tight">{randomProduct.name}</h3>
                    <p className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider mt-1">{randomProduct.category || 'Digital Tool'}</p>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-300 font-sans line-clamp-3 leading-relaxed">
                    {randomProduct.shortDescription || randomProduct.description?.substring(0, 120) + "..."}
                </p>

                {/* Call to Action Button */}
                <div className="pt-2 mt-auto space-y-2">
                    <Link 
                        href={randomProduct.affiliateLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full py-3 px-5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-2xl font-mono font-bold text-xs flex items-center justify-center gap-2 shadow-lg hover:shadow-cyan-500/20 transition-all uppercase tracking-wider group/btn cursor-pointer"
                    >
                        {randomProduct.ctaButtonText || 'Visit Website'}
                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    
                    {randomProduct.deal && (
                        <div className="text-[10px] font-mono text-center text-amber-400 italic">
                            {randomProduct.deal}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
