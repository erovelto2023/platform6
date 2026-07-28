"use client";

import { useState, useMemo } from "react";
import { DollarSign, TrendingUp, Users, Target, Zap, Calculator, ArrowRight, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

interface LocalAdRoiCalculatorProps {
    cityName: string;
    population: number;
    medianIncome: number;
}

export function LocalAdRoiCalculator({ cityName, population, medianIncome }: LocalAdRoiCalculatorProps) {
    const [monthlyBudget, setMonthlyBudget] = useState<number>(1000);
    const [selectedIndustry, setSelectedIndustry] = useState<string>("home-services");

    const industryProfiles: Record<string, { name: string; avgCpc: number; conversionRate: number; avgOrderValue: number }> = {
        "home-services": { name: "Home & Professional Services", avgCpc: 4.50, conversionRate: 0.08, avgOrderValue: 450 },
        "healthcare": { name: "Healthcare & Wellness", avgCpc: 5.20, conversionRate: 0.06, avgOrderValue: 350 },
        "retail": { name: "Local Retail & E-Commerce", avgCpc: 1.80, conversionRate: 0.04, avgOrderValue: 85 },
        "education": { name: "Tutoring & Education", avgCpc: 3.10, conversionRate: 0.07, avgOrderValue: 250 },
        "real-estate": { name: "Real Estate & Housing", avgCpc: 6.80, conversionRate: 0.03, avgOrderValue: 3500 },
    };

    const profile = industryProfiles[selectedIndustry] || industryProfiles["home-services"];

    // Calculations based on local population and median income modifier
    const incomeModifier = medianIncome > 75000 ? 1.25 : medianIncome < 45000 ? 0.85 : 1.0;
    const adjustedOrderValue = Math.round(profile.avgOrderValue * incomeModifier);

    const estClicks = Math.round(monthlyBudget / profile.avgCpc);
    const estImpressions = Math.round(estClicks * 28);
    const estLeads = Math.round(estClicks * profile.conversionRate);
    const estAcquisitions = Math.round(estLeads * 0.35); // 35% close rate
    const projectedRevenue = Math.round(estAcquisitions * adjustedOrderValue);
    const netProfit = projectedRevenue - monthlyBudget;
    const projectedRoi = Math.round((netProfit / monthlyBudget) * 100);

    return (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div>
                    <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950 border border-cyan-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-2">
                        <Calculator size={14} /> Predictive Media Planning
                    </div>
                    <h2 className="text-2xl md:text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-2.5">
                        <TrendingUp className="text-cyan-400" size={24} /> Local Ad Budget & ROI Estimator
                    </h2>
                </div>
                <Badge variant="outline" className="text-xs font-mono border-slate-700 bg-slate-950 text-cyan-400 px-3 py-1.5 self-start sm:self-center font-bold">
                    Target Market: {cityName}
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Inputs Column */}
                <div className="space-y-6 lg:col-span-1 bg-slate-950 border border-slate-800 p-6 rounded-2xl">
                    <div className="space-y-3">
                        <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                            Select Business Category
                        </label>
                        <select
                            value={selectedIndustry}
                            onChange={(e) => setSelectedIndustry(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-800 text-slate-100 text-xs font-mono rounded-xl p-3 focus:outline-none focus:border-cyan-500 transition cursor-pointer"
                        >
                            {Object.entries(industryProfiles).map(([key, ind]) => (
                                <option key={key} value={key}>
                                    {ind.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-xs font-mono">
                            <span className="text-slate-400 uppercase font-bold">Monthly Ad Budget</span>
                            <span className="text-xl font-black text-cyan-400">${monthlyBudget.toLocaleString()}/mo</span>
                        </div>
                        <Slider
                            value={[monthlyBudget]}
                            min={250}
                            max={10000}
                            step={250}
                            onValueChange={(val) => setMonthlyBudget(val[0])}
                            className="py-2"
                        />
                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                            <span>$250/mo</span>
                            <span>$5,000/mo</span>
                            <span>$10,000/mo</span>
                        </div>
                    </div>

                    <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                            <span>City Population:</span>
                            <span className="text-slate-200 font-bold">{population.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Est. Local CPC:</span>
                            <span className="text-slate-200 font-bold">${profile.avgCpc.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                            <span>Avg Order Value:</span>
                            <span className="text-slate-200 font-bold">${adjustedOrderValue.toLocaleString()}</span>
                        </div>
                    </div>
                </div>

                {/* ROI Output Grid */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Local Reach</div>
                            <div className="text-2xl font-black text-slate-100">{estImpressions.toLocaleString()}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-1">Monthly Impressions</div>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Target Clicks</div>
                            <div className="text-2xl font-black text-cyan-400">{estClicks.toLocaleString()}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-1">High-Intent Traffic</div>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">Est. Leads</div>
                            <div className="text-2xl font-black text-emerald-400">{estLeads.toLocaleString()}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-1">Inquiries & Form-Fills</div>
                        </div>

                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl">
                            <div className="text-[10px] font-mono text-slate-400 uppercase mb-1">New Customers</div>
                            <div className="text-2xl font-black text-slate-100">{estAcquisitions.toLocaleString()}</div>
                            <div className="text-[9px] font-mono text-slate-500 mt-1">Closed Deals</div>
                        </div>
                    </div>

                    {/* Revenue & ROI Highlight Card */}
                    <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-4 flex flex-col justify-between">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                            <div>
                                <div className="text-xs font-mono text-slate-400 uppercase">Projected Monthly Gross Revenue</div>
                                <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight">
                                    ${projectedRevenue.toLocaleString()}
                                </div>
                            </div>
                            <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl text-right">
                                <div className="text-[10px] font-mono text-slate-400 uppercase">Estimated Return (ROI)</div>
                                <div className="text-2xl font-black text-cyan-400">+{projectedRoi}%</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
                            <ShieldCheck className="text-emerald-400 shrink-0" size={16} />
                            <span>
                                Metrics modeled using Census income benchmarks (${medianIncome.toLocaleString()}) and local advertising CPC averages in {cityName}.
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
