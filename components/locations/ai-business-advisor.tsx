"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, BrainCircuit, Target, ShoppingBag, BarChart4, ShieldCheck, Laptop, Globe, Package, Zap, Check } from "lucide-react";
import { useState, useMemo } from "react";
import { ProductRecommender } from "@/lib/services/product-recommender";
import { CityStats } from "@/lib/services/census.service";

interface AIBusinessAdvisorProps {
    data: CityStats;
    cityName: string;
    zipCodes?: string[];
    areaCodes?: string[];
    timezone?: string;
}

export function AIBusinessAdvisor({ data, cityName, zipCodes = [], areaCodes = [], timezone }: AIBusinessAdvisorProps) {
    const [copied, setCopied] = useState(false);
    
    // Derived values for quick analysis
    const povertyRate = data.affordability.povertyRate;
    const medIncome = data.medianIncome;
    const vehicleZero = data.economy.vehiclesAvailable.zero;
    const avgHHSize = data.audience.avgHouseholdSize || 2.5;
    const totalHH = data.population / avgHHSize;
    const zeroVehiclePct = Math.round((vehicleZero / (totalHH || 1)) * 100);

    const recommendations = useMemo(() => ProductRecommender.getRecommendations(data as any), [data]);

    // Pricing Ceiling Logic
    const pricingCeiling = medIncome < 45000 ? "Mass Market / Value Pricing" : 
                           medIncome < 75000 ? "Middle Market / Standard Value" : "High-Ticket Premium Pricing";

    const promptText = `I am planning to launch a business in ${cityName}. 
Based on the following hyper-localized market data, please act as a world-class business strategist and product developer.

### LOCAL MARKET DATA PROFILE:
- **Location**: ${cityName}.
- **Local Identity**: ZIPs: ${zipCodes.join(", ") || "19703"}, Area Codes: ${areaCodes.join(", ") || "302"}, Timezone: ${timezone || "EST"}.
- **Audience**: ${data.population.toLocaleString()} people, Median Age: ${data.audience.medianAge}.
- **Family Structure**: ${data.audience.maritalStatus.marriedPct}% Married, ${data.audience.maritalStatus.divorcedPct}% Divorced.
- **Audience Blocks**: ${data.audience.familyComposition.kidsUnder18Count.toLocaleString()} children <18, ${data.audience.familyComposition.kids18to24Count.toLocaleString()} young adults (18-24).
- **Economics**: Median Household Income of $${data.medianIncome.toLocaleString()} with a ${data.affordability.povertyRate}% poverty rate.
- **Housing**: ${data.affordability.homeownershipRate}% homeownership rate.
- **Education/Skills**: ${data.logistics.bachelorsDegreePct}% Bachelor's+, Top Industry: ${data.economy.topIndustries[0]?.name}.
- **Languages**: ${Object.entries(data.logistics.languages).filter(([_, v]) => (v as number) > 0).map(([k, v]) => `${k.replace('speakSpanishPct', 'Spanish')} (${v}%)`).join(", ")}.
- **Connectivity**: ${data.digital.broadbandPct}% Broadband, ${data.digital.workFromHomePct}% WFH rate.
- **Health**: ${data.health.insurancePct}% Health Insurance Coverage.
- **Logistics**: ${data.mobility.drivePct}% Drive, ${data.mobility.transitPct}% Public Transit, ${data.mobility.bikePct + data.mobility.walkPct}% Walk/Bike.
- **Vehicle Access**: ${zeroVehiclePct}% zero-vehicle households.

### RECOMMENDED PRODUCT CATEGORIES:
${recommendations.map(r => `- **${r.type.toUpperCase()}**: ${r.title} (${r.description})`).join("\n")}

### TASK:
Based on this data and the recommended categories above, provide a comprehensive Business & Marketing Plan for the following 3 niches: 1) Parenting & Early Childhood, 2) Senior Services, and 3) Home Optimization.

For each niche, please provide:
1. **The Product/Service Idea**: A specific offer tailored to this city's income level ($${data.medianIncome.toLocaleString()}) and the relevant recommended category.
2. **Pricing Strategy**: Based on the ${pricingCeiling} ceiling. Should I use subscriptions, payment plans, or one-time premium fees?
3. **Marketing Channel Strategy**: Where should I advertise? (e.g., Facebook groups, Local Senior Centers, Geo-fenced mobile ads based on commute patterns).
4. **The Messaging Hook**: A specific USP derived from local values (e.g., emphasizing community trust vs. digital convenience).
5. **A 30-Day Go-To-Market Plan**: Step-by-step validation markers.

Please maintain a practical, Neighbor-to-Neighbor tone that emphasizes local pride and reliability.
`.trim();

    const copyToClipboard = () => {
        navigator.clipboard.writeText(promptText);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <BrainCircuit size={14} /> Local AI Strategy Engine
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
                        <Sparkles className="text-cyan-400" size={24} /> AI Business Advisor for {cityName}
                    </h2>
                </div>
                <div className="text-xs font-mono text-slate-400 bg-slate-950 border border-slate-800 px-3.5 py-2 rounded-xl">
                    Market Tier: <span className="text-cyan-400 font-bold">{pricingCeiling}</span>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <Target className="h-4 w-4 text-cyan-400" />
                        <p className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Pricing Strategy</p>
                    </div>
                    <p className="text-lg font-bold text-slate-100 uppercase tracking-tight">{pricingCeiling}</p>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                        {povertyRate > 20 ? "Focus on accessible pricing, value-based bundles, and flexible payment terms." : "Strong median household income supports high-ticket local services & premium pricing models."}
                    </p>
                </div>

                <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl shadow-xl">
                    <div className="flex items-center gap-2 mb-2">
                        <ShoppingBag className="h-4 w-4 text-emerald-400" />
                        <p className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">Shopping & Mobility Profile</p>
                    </div>
                    <p className="text-lg font-bold text-slate-100 uppercase tracking-tight">
                        {zeroVehiclePct > 5 ? "Mobile & Delivery Focused" : "Drive-To / Curbside Hub"}
                    </p>
                    <p className="mt-2 text-xs text-slate-400 leading-relaxed">
                        {zeroVehiclePct > 5 ? "High consumer demand for mobile service providers and doorstep delivery." : "High preference for central location hubs, curbside pickup, and local drive-to services."}
                    </p>
                </div>
            </div>
            
            {/* Productization Opportunities Section */}
            <div className="space-y-4 pt-2">
                <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-black uppercase text-slate-100 tracking-wider">Recommended Product Opportunities</h3>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {recommendations.map((rec) => (
                        <div key={rec.type} className="p-4 bg-slate-950 border border-slate-800 hover:border-cyan-500/50 rounded-2xl flex flex-col justify-between transition-all shadow-xl group">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1.5 text-cyan-400 text-xs font-mono font-bold uppercase">
                                        {rec.type === 'digital' && <Laptop size={14} />}
                                        {rec.type === 'virtual' && <Globe size={14} />}
                                        {rec.type === 'physical' && <Package size={14} />}
                                        {rec.type === 'saas' && <Zap size={14} />}
                                        <span>{rec.type}</span>
                                    </div>
                                </div>
                                <h4 className="text-sm font-bold text-slate-100 group-hover:text-cyan-400 transition-colors mb-1">{rec.title}</h4>
                                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3 mb-3">{rec.description}</p>
                            </div>
                            <div className="pt-2 border-t border-slate-800">
                                <p className="text-[11px] font-mono text-slate-500">
                                    <strong className="text-slate-400">Why:</strong> {rec.reason}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Master Prompt Box */}
            <div className="space-y-4 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <Sparkles className="h-5 w-5 text-cyan-400" />
                        <h3 className="text-lg font-black uppercase text-slate-100 tracking-wider">Generate Master Strategy Prompt</h3>
                    </div>
                    <button 
                        onClick={copyToClipboard}
                        className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-cyan-600 hover:text-white text-cyan-400 rounded-xl text-xs font-mono font-bold flex items-center justify-center gap-2 transition cursor-pointer"
                    >
                        {copied ? (
                            <>
                                <Check size={14} className="text-emerald-400" /> Prompt Copied to Clipboard!
                            </>
                        ) : (
                            <>
                                <Copy size={14} /> Copy AI Prompt for ChatGPT / Claude
                            </>
                        )}
                    </button>
                </div>
                
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 font-mono text-xs text-slate-300 whitespace-pre-wrap leading-relaxed max-h-[220px] overflow-y-auto select-all shadow-inner">
                    {promptText}
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex items-start gap-3 text-xs text-slate-400 font-mono">
                    <BarChart4 className="h-4 w-4 text-cyan-400 shrink-0 mt-0.5" />
                    <div>
                        <strong className="text-slate-200 block mb-1">How to use this AI Prompt:</strong>
                        Copy and paste this structured prompt into ChatGPT, Claude, or DeepSeek. It passes {cityName}'s Census metrics directly to generate a customized 30-day business launch plan.
                    </div>
                </div>
            </div>
        </div>
    );
}
