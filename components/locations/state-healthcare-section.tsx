"use client";

import { useState } from "react";
import { Activity, Search, Building2, Bed, TrendingUp, DollarSign, ExternalLink, MapPin, Phone, Shield } from "lucide-react";

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

export function StateHealthcareSection({ hospitals, stats, stateName }: StateHealthcareSectionProps) {
    const [query, setQuery] = useState("");
    
    const filtered = hospitals
        .filter(h =>
            h.name.toLowerCase().includes(query.toLowerCase()) ||
            (h.city && h.city.toLowerCase().includes(query.toLowerCase()))
        )
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <div className="space-y-10">
            {/* Stats Overview */}
            <div className="flex flex-wrap gap-4">
                <StatCard 
                    label="Hospitals" 
                    value={hospitals.length?.toLocaleString() || '0'} 
                    icon={<Building2 size={20} />} 
                    color="blue"
                />
                
                {(() => {
                    const gradeACount = hospitals.filter(h => h.safetyGrade === 'A').length;
                    if (gradeACount > 0) {
                        return (
                            <StatCard 
                                label="Safety Leaders" 
                                value={gradeACount.toLocaleString()} 
                                icon={<Shield size={20} />} 
                                color="emerald"
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
                                label="Healthcare Hub" 
                                value={topCity[0]} 
                                icon={<MapPin size={20} />} 
                                color="purple"
                                sub={`${topCity[1]} Facilities`}
                            />
                        );
                    }
                    return null;
                })()}

                {(() => {
                    const specialized = hospitals.filter(h => {
                        if (!h.type) return false;
                        const t = h.type.toLowerCase();
                        return !t.includes('general') && 
                               !t.includes('acute care') && 
                               !t.includes('critical access');
                    }).length;
                    
                    if (specialized > 0) {
                        return (
                            <StatCard 
                                label="Specialized Care" 
                                value={specialized.toLocaleString()} 
                                icon={<Activity size={20} />} 
                                color="amber"
                                sub="Specialty Centers"
                            />
                        );
                    }
                    return null;
                })()}

                {stats && stats.staffedBeds > 0 && (
                    <StatCard 
                        label="Total Beds" 
                        value={stats.staffedBeds.toLocaleString()} 
                        icon={<Bed size={20} />} 
                        color="emerald"
                    />
                )}
                {stats && stats.patientDays > 0 && (
                    <StatCard 
                        label="Patient Days" 
                        value={stats.patientDays.toLocaleString()} 
                        icon={<TrendingUp size={20} />} 
                        color="purple"
                    />
                )}
                {stats && stats.grossRevenue && stats.grossRevenue !== "$0" && stats.grossRevenue !== "0" && (
                    <StatCard 
                        label="Revenue" 
                        value={stats.grossRevenue} 
                        icon={<DollarSign size={20} />} 
                        color="amber"
                    />
                )}
            </div>

            <div className="space-y-6">
                {/* Header */}
                <div className="border-l-4 border-emerald-600 pl-4">
                    <h2 className="text-2xl font-black text-emerald-950 uppercase italic tracking-tight">
                        Medical Facilities
                    </h2>
                    <p className="text-emerald-900/40 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {hospitals.length} Registered Hospitals in {stateName}
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-900/40" size={16} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search hospitals or cities..."
                        className="w-full bg-white border border-emerald-100 rounded-xl pl-10 pr-4 py-2.5 text-sm text-emerald-950 placeholder:text-emerald-900/20 focus:outline-none focus:border-emerald-600 transition-colors shadow-sm"
                    />
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filtered.map((hosp, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-col justify-between bg-white border border-emerald-100 hover:border-emerald-600 rounded-xl p-4 transition-all duration-200 hover:bg-slate-50 shadow-sm"
                            >
                                <div className="space-y-3">
                                    <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all shadow-sm">
                                        <Activity size={15} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-emerald-950 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2 uppercase italic">
                                            {hosp.name}
                                        </p>
                                        <p className="text-[10px] text-emerald-900/40 font-bold uppercase tracking-wide mt-1 italic">
                                            {hosp.city}, {stateName}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-3 space-y-1.5">
                                    {hosp.address && (
                                        <div className="flex items-start gap-1.5">
                                            <MapPin className="h-3 w-3 text-emerald-900/40 mt-0.5 flex-shrink-0" />
                                            <span className="text-[10px] text-emerald-900/60 leading-tight uppercase font-medium">{hosp.address}</span>
                                        </div>
                                    )}
                                    {hosp.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-3 w-3 text-emerald-900/40 flex-shrink-0" />
                                            <span className="text-[10px] text-emerald-900/60 font-medium">{hosp.phone}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-emerald-50 flex items-center justify-between text-[10px] text-emerald-900/40 font-bold uppercase">
                                    <span className="truncate max-w-[120px] italic">{hosp.type || 'General'}</span>
                                    <div className="flex items-center gap-2">
                                        {hosp.beds && hosp.beds > 0 && (
                                            <span className="bg-slate-50 border border-emerald-50 px-1.5 py-0.5 rounded text-emerald-900/60">
                                                {hosp.beds} Beds
                                            </span>
                                        )}
                                        {hosp.safetyGrade && (
                                            <span className={`px-1.5 py-0.5 rounded font-black ${
                                                hosp.safetyGrade === 'A' ? 'bg-emerald-100 text-emerald-700' :
                                                hosp.safetyGrade === 'B' ? 'bg-emerald-50 text-emerald-600' :
                                                hosp.safetyGrade === 'C' ? 'bg-slate-100 text-slate-700' :
                                                hosp.safetyGrade === 'D' ? 'bg-slate-50 text-slate-600' :
                                                'bg-slate-50 text-slate-500'
                                            }`}>
                                                {hosp.safetyGrade}
                                            </span>
                                        )}
                                        {hosp.website && (
                                            <a 
                                                href={hosp.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-emerald-900/40 hover:text-emerald-600 transition-colors"
                                                title="Visit hospital website"
                                            >
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 border border-dashed border-emerald-100 bg-white rounded-2xl text-center shadow-sm">
                        <Activity className="h-10 w-10 text-emerald-900/20 mb-3" />
                        <p className="text-emerald-900/40 font-bold uppercase italic text-[10px]">
                            No facilities match your search
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ label, value, icon, color, sub }: { label: string, value: string, icon: React.ReactNode, color: 'blue' | 'emerald' | 'purple' | 'amber', sub?: string }) {
    const colorClasses = {
        blue: 'text-emerald-600 bg-emerald-50',
        emerald: 'text-emerald-700 bg-emerald-100',
        purple: 'text-emerald-500 bg-emerald-50',
        amber: 'text-emerald-800 bg-emerald-100',
    };

    return (
        <div className="bg-white border border-emerald-100 p-5 rounded-2xl relative overflow-hidden group min-w-[180px] flex-1 shadow-sm">
            <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 transition-transform group-hover:scale-110 shadow-sm`}>
                {icon}
            </div>
            <div>
                <p className="text-emerald-900/40 text-[10px] font-black uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-xl font-black text-emerald-950 italic">{value}</h3>
                    {sub && <span className="text-[8px] text-emerald-900/40 font-black uppercase italic">{sub}</span>}
                </div>
            </div>
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity text-emerald-950">
                <TrendingUp size={80} />
            </div>
        </div>
    );
}
