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
            // Pick a random one
            const randomIndex = Math.floor(Math.random() * affiliateProducts.length);
            setRandomProduct(affiliateProducts[randomIndex]);
        }
    }, [products]);

    if (!randomProduct) return null;

    return (
        <div className={`relative group overflow-hidden rounded-[2rem] p-6 border border-slate-200 dark:border-slate-700 bg-white/80 backdrop-blur-md dark:bg-slate-800/40 shadow-xl shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-500 ${className}`}>
            {/* Background Decorative Element */}
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-700"></div>
            
            <div className="relative flex flex-col h-full z-10">
                <div className="flex items-center justify-between mb-5">
                    <div className="px-3 py-1 rounded-full bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-indigo-200/50 dark:border-indigo-800/30">
                        <Sparkles size={12} className="fill-indigo-600 dark:fill-indigo-400 group-hover:animate-pulse" />
                        Recommended Tool
                    </div>
                    {randomProduct.deal && (
                        <div className="flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-md animate-pulse">
                            <Zap size={10} className="fill-amber-600" />
                            DEAL
                        </div>
                    )}
                </div>

                <div className="flex items-center gap-4 mb-5">
                    {randomProduct.logoUrl ? (
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/20 blur opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                            <img 
                                src={randomProduct.logoUrl} 
                                alt={randomProduct.name} 
                                className="relative w-14 h-14 rounded-xl object-contain bg-white p-2 border border-slate-100 dark:bg-slate-800 dark:border-slate-700 shadow-sm" 
                            />
                        </div>
                    ) : (
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-2xl shadow-lg ${randomProduct.logoColor || 'bg-indigo-600'}`}>
                            {randomProduct.name.charAt(0)}
                        </div>
                    )}
                    <div className="flex-1">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{randomProduct.name}</h3>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{randomProduct.category}</p>
                    </div>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 leading-relaxed">
                    {randomProduct.shortDescription || randomProduct.description?.substring(0, 100) + "..."}
                </p>

                <div className="mt-auto space-y-3">
                    <Link 
                        href={randomProduct.affiliateLink} 
                        target="_blank" 
                        className="w-full py-3.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all active:scale-[0.98] group/btn"
                    >
                        {randomProduct.ctaButtonText || 'Get Started Now'}
                        <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                    
                    {randomProduct.deal && (
                        <div className="text-[10px] font-bold text-center text-slate-400 dark:text-slate-500 italic">
                            {randomProduct.deal}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
