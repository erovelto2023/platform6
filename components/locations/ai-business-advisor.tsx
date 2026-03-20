"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy, Sparkles, BrainCircuit, Target, ShoppingBag, BarChart4, ShieldCheck, Laptop, Globe, Package, Zap } from "lucide-react";
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
    const pricingCeiling = medIncome < 30000 ? "LOW (Mass Market / Budget-First)" : 
                           medIncome < 60000 ? "MODERATE (Value / Middle-Market)" : "HIGH (Premium / High-Ticket)";

    const promptText = `I am planning to launch a business in ${cityName}. 
Based on the following hyper-localized market data, please act as a world-class business strategist and product developer.

### LOCAL MARKET DATA PROFILE:
- **Location**: ${cityName}.
- **Local Identity**: ZIPs: ${zipCodes.join(", ") || "N/A"}, Area Codes: ${areaCodes.join(", ") || "N/A"}, Timezone: ${timezone || "N/A"}.
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
        <Card className="bg-white border-slate-200 rounded-2xl overflow-hidden border-t-4 border-t-purple-500 shadow-2xl">
            <CardHeader className="pb-2 bg-purple-500/5">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-black uppercase flex items-center gap-2 text-[#0e0021]">
                        <BrainCircuit className="h-4 w-4 text-purple-400" />
                        AI Business Advisor
                    </CardTitle>
                    <Badge className="bg-purple-500 text-white text-[8px] font-black uppercase">Alpha Feature</Badge>
                </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-[#f8f9fa]/60 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <Target className="h-3 w-3 text-emerald-700" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Pricing Ceiling</p>
                        </div>
                        <p className="text-sm font-black text-[#0e0021] italic uppercase tracking-tight">{pricingCeiling}</p>
                        <p className="mt-2 text-[9px] font-bold text-slate-500 leading-relaxed uppercase italic">
                            {povertyRate > 20 ? "High price sensitivity detected. Focus on accessibility, payment plans, and high-perceived-value bundles." : "Strong middle-class base. Standard value-based pricing is recommended."}
                        </p>
                    </div>

                    <div className="p-4 bg-[#f8f9fa]/60 rounded-xl border border-slate-200">
                        <div className="flex items-center gap-2 mb-2">
                            <ShoppingBag className="h-3 w-3 text-blue-400" />
                            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Shopping Habits</p>
                        </div>
                        <p className="text-sm font-black text-[#0e0021] italic uppercase tracking-tight">
                            {zeroVehiclePct > 5 ? "Transit/Delivery Dependent" : "Local Transit/Curbside Focus"}
                        </p>
                        <p className="mt-2 text-[9px] font-bold text-slate-500 leading-relaxed uppercase italic">
                            {zeroVehiclePct > 5 ? "High demand for mobile providers or local delivery hubs." : "Preference for central one-stop shopping and local pickup locations."}
                        </p>
                    </div>
                </div>
                
                {/* Product Opportunities Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2">
                        <ShoppingBag className="h-4 w-4 text-emerald-700" />
                        <h4 className="text-[10px] font-black uppercase text-[#0e0021] tracking-widest">Productization Opportunities</h4>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                        {recommendations.map((rec) => (
                            <div key={rec.type} className="p-3 bg-[#f8f9fa]/40 border border-slate-200/80 rounded-2xl group hover:border-purple-500/50 transition-all">
                                <div className="flex items-center gap-2 mb-2">
                                    {rec.type === 'digital' && <Laptop className="h-3 w-3 text-blue-400" />}
                                    {rec.type === 'virtual' && <Globe className="h-3 w-3 text-emerald-700" />}
                                    {rec.type === 'physical' && <Package className="h-3 w-3 text-amber-400" />}
                                    {rec.type === 'saas' && <Zap className="h-3 w-3 text-purple-400" />}
                                    <span className="text-[8px] font-black uppercase text-slate-500 tracking-wider font-mono">{rec.type}</span>
                                </div>
                                <h5 className="text-[10px] font-black text-[#0e0021] uppercase italic leading-tight mb-1">{rec.title}</h5>
                                <p className="text-[9px] text-slate-600 leading-tight mb-2 h-8 overflow-hidden line-clamp-2">{rec.description}</p>
                                <div className="pt-2 border-t border-slate-200">
                                    <p className="text-[7.5px] font-bold text-slate-600 uppercase italic leading-tight group-hover:text-purple-400 transition-colors">
                                        Why: {rec.reason}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Sparkles className="h-4 w-4 text-amber-400" />
                            <h4 className="text-[10px] font-black uppercase text-[#0e0021] tracking-widest">Generate Master Prompt</h4>
                        </div>
                        <Button 
                            variant="outline" 
                            size="sm" 
                            className={`h-7 text-[9px] font-black uppercase tracking-tighter transition-all ${copied ? "bg-emerald-50 text-emerald-700 border-emerald-500/20" : "bg-white border-slate-200 text-slate-600 hover:text-purple-400"}`}
                            onClick={copyToClipboard}
                        >
                            {copied ? <><ShieldCheck className="h-3 w-3 mr-1" /> Copied!</> : <><Copy className="h-3 w-3 mr-1" /> Copy Prompt</>}
                        </Button>
                    </div>
                    
                    <div className="relative group">
                        <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                        <div className="relative p-4 bg-[#f8f9fa] border border-slate-200 rounded-xl font-mono text-[9px] text-slate-600 whitespace-pre-wrap leading-relaxed select-all max-h-[250px] overflow-y-auto">
                            {promptText}
                        </div>
                    </div>

                    <div className="flex items-start gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-xl">
                        <BarChart4 className="h-4 w-4 text-purple-400 mt-1" />
                        <div>
                            <p className="text-[10px] font-black text-purple-400 uppercase tracking-widest mb-1">How to use this</p>
                            <p className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed italic">
                                Paste this prompt into ChatGPT or Claude. It automatically adjusts for ${cityName}'s specific poverty level, housing market, and employment data to give you a custom-built business blueprint.
                            </p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
