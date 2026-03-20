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
    
    // Debug: Log the first hospital data
    console.log(`[DEBUG] StateHealthcareSection received:`, {
        hospitalsCount: hospitals.length,
        stateName,
        firstHospital: hospitals[0] ? {
            name: hospitals[0].name,
            address: hospitals[0].address,
            website: hospitals[0].website,
            phone: hospitals[0].phone,
            safetyGrade: hospitals[0].safetyGrade,
            beds: hospitals[0].beds
        } : null
    });
    
    // Log the first hospital data in detail
    if (hospitals.length > 0) {
        console.log(`[DEBUG] First hospital details:`, hospitals[0]);
        console.log(`[DEBUG] Address:`, hospitals[0].address);
        console.log(`[DEBUG] Website:`, hospitals[0].website);
        console.log(`[DEBUG] Phone:`, hospitals[0].phone);
    }
    
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
                
                {/* Dynamic Stats Derived from Hospitals Array */}
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
                        // Filter out common general types
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

                {/* DB Stats (Fallback) */}
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
                <div className="border-l-4 border-rose-500 pl-4">
                    <h2 className="text-2xl font-black text-[#0e0021] uppercase italic tracking-tight">
                        Medical Facilities
                    </h2>
                    <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                        {hospitals.length} Registered Hospitals in {stateName}
                    </p>
                </div>

                {/* Search */}
                <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                    <input
                        type="text"
                        value={query}
                        onChange={e => setQuery(e.target.value)}
                        placeholder="Search hospitals or cities..."
                        className="w-full bg-[#f8f9fa]/60 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-600 focus:outline-none focus:border-rose-500 transition-colors"
                    />
                </div>

                {/* Grid */}
                {filtered.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                        {filtered.map((hosp, idx) => (
                            <div
                                key={idx}
                                className="group flex flex-col justify-between bg-[#f8f9fa]/60 border border-slate-200/60 hover:border-rose-500/40 rounded-xl p-4 transition-all duration-200 hover:bg-white"
                            >
                                <div className="space-y-3">
                                    <div className="w-8 h-8 rounded-lg bg-rose-500/10 flex items-center justify-center text-rose-400 group-hover:bg-rose-500 group-hover:text-[#8422dc] transition-all">
                                        <Activity size={15} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-slate-800 group-hover:text-[#8422dc] transition-colors leading-tight line-clamp-2">
                                            {hosp.name}
                                        </p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wide mt-1">
                                            {hosp.city}, {stateName}
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mt-3 space-y-1.5">
                                    {hosp.address && (
                                        <div className="flex items-start gap-1.5">
                                            <MapPin className="h-3 w-3 text-slate-500 mt-0.5 flex-shrink-0" />
                                            <span className="text-[10px] text-slate-600 leading-tight">{hosp.address}</span>
                                        </div>
                                    )}
                                    {hosp.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className="h-3 w-3 text-slate-500 flex-shrink-0" />
                                            <span className="text-[10px] text-slate-600">{hosp.phone}</span>
                                        </div>
                                    )}
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                                    <span className="truncate max-w-[120px]">{hosp.type || 'General'}</span>
                                    <div className="flex items-center gap-2">
                                        {hosp.beds && hosp.beds > 0 && (
                                            <span className="bg-slate-100 px-1.5 py-0.5 rounded text-slate-700">
                                                {hosp.beds} Beds
                                            </span>
                                        )}
                                        {hosp.safetyGrade && (
                                            <span className={`px-1.5 py-0.5 rounded font-bold ${
                                                hosp.safetyGrade === 'A' ? 'bg-emerald-500/20 text-emerald-700' :
                                                hosp.safetyGrade === 'B' ? 'bg-blue-500/20 text-blue-400' :
                                                hosp.safetyGrade === 'C' ? 'bg-yellow-500/20 text-yellow-400' :
                                                hosp.safetyGrade === 'D' ? 'bg-orange-500/20 text-orange-400' :
                                                'bg-red-500/20 text-red-400'
                                            }`}>
                                                {hosp.safetyGrade}
                                            </span>
                                        )}
                                        {hosp.website && (
                                            <a 
                                                href={hosp.website} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-slate-600 hover:text-[#8422dc] transition-colors"
                                                title="Visit hospital website"
                                            >
                                                <ExternalLink size={12} />
                                            </a>
                                        )}
                                        {hosp.safetyGradeUrl && (
                                            <a 
                                                href={`https://www.hospitalsafetygrade.org${hosp.safetyGradeUrl}`} 
                                                target="_blank" 
                                                rel="noopener noreferrer" 
                                                className="text-rose-400 hover:text-rose-300 transition-colors"
                                                title="View safety grade"
                                            >
                                                <Activity size={12} />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center p-16 border border-dashed border-slate-300 bg-slate-50 rounded-2xl text-center">
                        <Activity className="h-10 w-10 text-slate-700 mb-3" />
                        <p className="text-slate-500 font-bold uppercase italic text-sm">
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
        blue: 'text-blue-400 bg-blue-500/10',
        emerald: 'text-emerald-700 bg-emerald-50',
        purple: 'text-purple-400 bg-purple-500/10',
        amber: 'text-amber-400 bg-amber-500/10',
    };

    return (
        <div className="bg-[#f8f9fa]/60 border border-slate-200 p-5 rounded-2xl relative overflow-hidden group">
            <div className={`w-10 h-10 rounded-xl ${colorClasses[color]} flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                {icon}
            </div>
            <div>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{label}</p>
                <div className="flex items-baseline gap-2 mt-1">
                    <h3 className="text-xl font-black text-[#0e0021] italic">{value}</h3>
                    {sub && <span className="text-[9px] text-slate-600 font-bold uppercase">{sub}</span>}
                </div>
            </div>
            {/* Background pattern */}
            <div className="absolute -right-2 -bottom-2 opacity-[0.03] group-hover:opacity-[0.06] transition-opacity">
                <TrendingUp size={80} />
            </div>
        </div>
    );
}
