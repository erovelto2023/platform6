"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ExternalLink, Sparkles, Zap } from 'lucide-react';

interface RotatingAffiliateBannerProps {
    products: any[];
}

export default function RotatingAffiliateBanner({ products }: RotatingAffiliateBannerProps) {
    const [randomProduct, setRandomProduct] = useState<any>(null);

    useEffect(() => {
        // Filter for products that have an affiliate link
        const affiliateProducts = products.filter(p => p.affiliateLink && p.affiliateLink.trim() !== "");
        
        if (affiliateProducts.length > 0) {
            // Pick a random one
            const randomIndex = Math.floor(Math.random() * affiliateProducts.length);
            setRandomProduct(affiliateProducts[randomIndex]);
        }
    }, [products]);

    if (!randomProduct) return null;

    return (
        <div className="relative group overflow-hidden rounded-3xl p-8 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800/50 shadow-sm hover:shadow-md transition-all">
            {/* Background Decorative Element */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover:bg-emerald-500/10 transition-colors"></div>
            
            <div className="relative flex flex-col h-full">
                <div className="flex items-center justify-between mb-4">
                    <div className="px-3 py-1 rounded-full bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Sparkles size={12} />
                        Recommended Tool
                    </div>
                </div>

                <div className="flex items-start gap-4 mb-4">
                    {randomProduct.logoUrl ? (
                        <img 
                            src={randomProduct.logoUrl} 
                            alt={randomProduct.name} 
                            className="w-12 h-12 rounded-xl object-contain bg-slate-50 p-2 border border-slate-100 dark:bg-slate-800 dark:border-slate-700" 
                        />
                    ) : (
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-xl ${randomProduct.logoColor || 'bg-emerald-600'}`}>
                            {randomProduct.name.charAt(0)}
                        </div>
                    )}
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white line-clamp-1">{randomProduct.name}</h3>
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">{randomProduct.category}</p>
                    </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 mb-6 flex-1">
                    {randomProduct.shortDescription || randomProduct.description?.substring(0, 100) + "..."}
                </p>

                <div className="mt-auto">
                    <Link 
                        href={randomProduct.affiliateLink} 
                        target="_blank" 
                        className="w-full py-3 px-6 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all group/btn"
                    >
                        {randomProduct.ctaButtonText || 'Get Started Now'}
                        <ExternalLink size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    
                    {randomProduct.deal && (
                        <div className="mt-3 flex items-center justify-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 py-1.5 rounded-lg">
                            <Zap size={10} />
                            {randomProduct.deal}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
