"use client";

import { useState } from "react";
import { Activity, Search, Building2, Bed, TrendingUp, DollarSign, ExternalLink, MapPin, Phone, Shield, Stethoscope, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Hospital {
    name: string;
    city?: string;
    type?: string;
    beds?: number;
    url?: string;
    website?: string;
    safetyGradeUrl?: string;
    address?: string;
    phone?: string;
    safetyGrade?: string;
}

interface HospitalStats {
    count: number;
    staffedBeds: number;
    totalDischarges: number;
    patientDays: number;
    grossRevenue: string;
}

interface StateHealthcareSectionProps {
    hospitals: Hospital[];
    stats?: HospitalStats;
    stateName: string;
}

export function StateHealthcareSection({ hospitals = [], stats, stateName }: StateHealthcareSectionProps) {
    const [query, setQuery] = useState("");
    const [displayLimit, setDisplayLimit] = useState(24);
    
    const filtered = hospitals
        .filter(h =>
            h.name.toLowerCase().includes(query.toLowerCase()) ||
            (h.city && h.city.toLowerCase().includes(query.toLowerCase())) ||
            (h.address && h.address.toLowerCase().includes(query.toLowerCase()))
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    const visibleHospitals = filtered.slice(0, displayLimit);
    const hasMore = displayLimit < filtered.length;

    const handleLoadMore = () => {
        setDisplayLimit(prev => prev + 24);
    };

    const handleShowAll = () => {
        setDisplayLimit(filtered.length);
    };

    return (
        <div className="space-y-10">
            {/* Header & Stats Overview */}
            <div className="flex flex-col md:flex-row md:items-center justify-between border-l-4 border-cyan-500 pl-6 gap-4">
                <div>
                    <h2 className="text-3xl font-black text-slate-100 uppercase tracking-tight flex items-center gap-3">
                        <Stethoscope className="text-cyan-400" /> {stateName} Healthcare & Doctors Network
                    </h2>
                    <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider mt-1">
                        Registered CMS Hospitals, Medical Centers & Specialty Clinics ({hospitals.length})
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap gap-4">
                <StatCard 
                    label="Registered Hospitals" 
                    value={hospitals.length?.toLocaleString() || '0'} 
                    icon={<Building2 size={20} />} 
                />
                
                {(() => {
                    const gradeACount = hospitals.filter(h => h.safetyGrade === 'A').length;
                    if (gradeACount > 0) {
                        return (
                            <StatCard 
                                label="Safety Leaders" 
                                value={gradeACount.toLocaleString()} 
                                icon={<Shield size={20} />} 
                                sub="Grade A Rated"
                            />
                        );
                    }
                    return null;
                })()}

                {(() => {
                    const cityCounts: Record<string, number> = {};
                    hospitals.forEach(h => {
                        if (h.city) cityCounts[h.city] = (cityCounts[h.city] || 0) + 1;
                    });
                    const topCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0];
                    if (topCity && topCity[1] > 1) {
                        return (
                            <StatCard 
                                label="Primary Medical Hub" 
                                value={topCity[0]} 
                                icon={<MapPin size={20} />} 
                                sub={`${topCity[1]} Facilities`}
                            />
                        );
                    }
                    return null;
                })()}

                {stats && stats.staffedBeds > 0 && (
                    <StatCard 
                        label="Total Staffed Beds" 
                        value={stats.staffedBeds.toLocaleString()} 
                        icon={<Bed size={20} />} 
                    />
                )}
            </div>

            <div className="space-y-6">
                {/* Search & Counter Bar */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                        <input
                            type="text"
                            value={query}
                            onChange={e => {
                                setQuery(e.target.value);
                                setDisplayLimit(24);
                            }}
                            placeholder={`Search ${hospitals.length} ${stateName} hospitals, cities, or addresses...`}
                            className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 transition-colors shadow-lg"
                        />
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
                        Showing <span className="text-cyan-400">{visibleHospitals.length}</span> of <span className="text-slate-200">{filtered.length}</span> Facilities
                    </div>
                </div>

                {/* Hospital Facilities Grid */}
                {filtered.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {visibleHospitals.map((hosp, idx) => (
                                <div
                                    key={idx}
                                    className="group flex flex-col justify-between bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-2xl p-5 transition-all duration-200 shadow-xl"
                                >
                                    <div className="space-y-3">
                                        <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-cyan-400 group-hover:bg-cyan-600 group-hover:text-white transition-all shadow-sm">
                                            <Activity size={18} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-bold text-slate-100 group-hover:text-cyan-400 transition-colors leading-tight">
                                                {hosp.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-mono mt-1">
                                                📍 {hosp.city}, {stateName}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-4 space-y-2">
                                        {hosp.address && (
                                            <div className="flex items-start gap-1.5">
                                                <MapPin className="h-3.5 w-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                                                <span className="text-xs text-slate-400 leading-tight">{hosp.address}</span>
                                            </div>
                                        )}
                                        {hosp.phone && (
                                            <div className="flex items-center gap-1.5">
                                                <Phone className="h-3.5 w-3.5 text-slate-500 flex-shrink-0" />
                                                <span className="text-xs text-slate-300 font-mono">{hosp.phone}</span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="mt-5 pt-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
                                        <span className="truncate max-w-[120px]">{hosp.type || 'Acute Care Hospital'}</span>
                                        <div className="flex items-center gap-2">
                                            {hosp.beds && hosp.beds > 0 && (
                                                <span className="bg-slate-950 border border-slate-800 px-2 py-0.5 rounded text-cyan-400 text-[10px] font-bold">
                                                    {hosp.beds} Beds
                                                </span>
                                            )}
                                            {hosp.safetyGrade && (
                                                <span className="bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded text-emerald-400 text-[10px] font-bold">
                                                    Grade {hosp.safetyGrade}
                                                </span>
                                            )}
                                            {hosp.website && (
                                                <a 
                                                    href={hosp.website} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer" 
                                                    className="text-cyan-400 hover:text-cyan-300 transition-colors"
                                                    title="Visit facility website"
                                                >
                                                    <ExternalLink size={14} />
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More & Show All Actions */}
                        {hasMore && (
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
                                <Button
                                    onClick={handleLoadMore}
                                    className="bg-slate-900 border border-slate-700 hover:border-cyan-500 text-slate-200 hover:text-white font-mono font-bold uppercase text-xs px-6 py-2.5 rounded-xl transition-all shadow-lg flex items-center gap-2"
                                >
                                    <ChevronDown className="w-4 h-4" /> Load Next 24 Facilities
                                </Button>
                                <Button
                                    onClick={handleShowAll}
                                    variant="outline"
                                    className="bg-slate-950 border-slate-800 hover:border-cyan-500 text-cyan-400 font-mono font-bold uppercase text-xs px-6 py-2.5 rounded-xl transition-all"
                                >
                                    Show All {filtered.length} Hospitals
                                </Button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-800 bg-slate-900 rounded-3xl text-center shadow-xl">
                        <Activity className="h-10 w-10 text-slate-600 mb-3" />
                        <p className="text-slate-400 font-mono text-xs uppercase tracking-wider">
                            No medical facilities match your search query
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, sub }: { label: string, value: string, icon: React.ReactNode, sub?: string }) {
    return (
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl relative overflow-hidden group min-w-[180px] flex-1 shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 text-cyan-400 flex items-center justify-center mb-3 transition-transform group-hover:scale-110">
                {icon}
            </div>
            <div>
                <p className="text-slate-400 text-xs font-mono font-bold uppercase tracking-wider">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-2xl font-bold text-slate-100">{value}</h3>
                    {sub && <span className="text-[10px] text-cyan-400 font-mono font-bold uppercase">{sub}</span>}
                </div>
            </div>
        </div>
    );
}
