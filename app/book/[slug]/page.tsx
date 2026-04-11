
import { getPublicBusinessBySlug, getAvailableSlots } from "@/lib/actions/booking.actions";
import { format, startOfToday } from "date-fns";
import { BookingClient } from "@/components/calendar/BookingClient";
import { ShieldCheck, Calendar as CalendarIcon, Clock, ArrowLeft, Gem } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface BookingPageProps {
    params: {
        slug: string; // Business Slug
    };
    searchParams: {
        date?: string;
        serviceId?: string;
    };
}

export default async function PublicBookingPage(props: BookingPageProps) {
    const params = await props.params;
    const searchParams = await props.searchParams;
    const businessSlug = params.slug;
    const dateParam = searchParams.date || format(startOfToday(), 'yyyy-MM-dd');
    const serviceId = searchParams.serviceId;

    const { data, error } = await getPublicBusinessBySlug(businessSlug);

    if (error || !data) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-8 text-center">
                <div className="h-20 w-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center text-rose-500 mb-6">
                    <ShieldCheck size={40} />
                </div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">Access Denied</h1>
                <p className="text-zinc-500 mt-2 font-medium">Business node not found or inactive.</p>
                <Link href="/" className="mt-8 text-cyan-400 font-black uppercase tracking-[3px] text-[10px] hover:text-white transition-colors">
                    Return to Safe Zone
                </Link>
            </div>
        );
    }

    const { business, services } = data;
    const selectedService = services.find((s: any) => s._id === serviceId) || services[0];
    
    // Fetch slots for initial render if service exists
    let initialSlots: string[] = [];
    if (selectedService) {
        const slotsRes = await getAvailableSlots(new Date(dateParam), selectedService._id);
        initialSlots = slotsRes.data || [];
    }

    return (
        <div className="min-h-screen bg-[#0F1218] text-white selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Background Accents */}
            <div className="fixed top-0 left-0 w-full h-[600px] bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
            <div className="fixed -top-24 -right-24 w-96 h-96 bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
            
            <div className="relative max-w-7xl mx-auto px-6 py-12 lg:py-24">
                <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
                    {/* Left Side: Business & Service Details */}
                    <div className="w-full lg:w-96 flex-shrink-0 animate-in fade-in slide-in-from-left duration-1000">
                        <div className="sticky top-12 lg:top-24">
                            <div className="mb-12">
                                <div className="flex items-center gap-4 mb-8 group cursor-pointer">
                                    <div className="h-16 w-16 bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-indigo-500/20 rotate-3 transition-transform group-hover:rotate-0">
                                        {business.logo ? (
                                            <Image src={business.logo} alt={business.name} width={40} height={40} className="rounded-xl" />
                                        ) : (
                                            <Gem className="text-white" size={32} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <h2 className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500">Authorized Agent</h2>
                                        <div className="text-2xl font-black tracking-tighter text-white uppercase italic">{business.name}</div>
                                    </div>
                                </div>

                                <div className="h-px w-full bg-gradient-to-r from-zinc-800/50 to-transparent mb-12" />

                                {selectedService ? (
                                    <div className="animate-in fade-in slide-in-from-bottom duration-700">
                                        <div className="flex items-baseline gap-3 mb-4">
                                            <span className="text-[10px] font-black uppercase tracking-[4px] text-cyan-400">Selected Module</span>
                                            <div className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
                                        </div>
                                        <h1 className="text-4xl font-black tracking-tight text-white uppercase italic mb-8 leading-none">
                                            {selectedService.name}
                                        </h1>

                                        <div className="grid grid-cols-2 gap-4 mb-8">
                                            <div className="p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl backdrop-blur-xl">
                                                <Clock size={16} className="text-zinc-600 mb-2" />
                                                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Duration</div>
                                                <div className="text-lg font-black text-white tabular-nums">{selectedService.duration}<span className="text-[10px] ml-1">MIN</span></div>
                                            </div>
                                            <div className="p-5 bg-zinc-900/40 border border-zinc-800/50 rounded-3xl backdrop-blur-xl">
                                                <ShieldCheck size={16} className="text-zinc-600 mb-2" />
                                                <div className="text-xs font-black text-zinc-500 uppercase tracking-widest leading-none mb-1">Fee</div>
                                                <div className="text-lg font-black text-white tabular-nums">${selectedService.price}<span className="text-[10px] ml-1">USD</span></div>
                                            </div>
                                        </div>

                                        <p className="text-zinc-400 text-sm leading-relaxed font-medium">
                                            {selectedService.description || "Establish a strategic baseline for your growth Roadmap."}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="animate-in fade-in duration-500">
                                        <p className="text-zinc-500 italic font-medium">Select a service module to initiate schedule terminal.</p>
                                    </div>
                                )}
                            </div>

                            {/* Service Selection List (If multiple) */}
                            {services.length > 1 && (
                                <div className="space-y-3">
                                    <div className="text-[9px] font-black uppercase tracking-[3px] text-zinc-600 ml-4 mb-4">Available Protocols</div>
                                    {services.map((s: any) => (
                                        <Link 
                                            key={s._id} 
                                            href={`/book/${businessSlug}?serviceId=${s._id}`}
                                            className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all group ${
                                                selectedService?._id === s._id 
                                                ? 'bg-indigo-500/10 border-indigo-500/50 text-white' 
                                                : 'bg-transparent border-zinc-800/30 text-zinc-500 hover:border-zinc-800 hover:text-zinc-300'
                                            }`}
                                        >
                                            <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all ${
                                                selectedService?._id === s._id ? 'bg-indigo-500 text-white shadow-xl shadow-indigo-500/20' : 'bg-zinc-900 group-hover:bg-zinc-800'
                                            }`}>
                                                <Gem size={14} />
                                            </div>
                                            <span className="text-[10px] font-black uppercase tracking-widest flex-1">{s.name}</span>
                                            {selectedService?._id === s._id && <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />}
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Booking Terminal */}
                    <div className="flex-1 animate-in fade-in slide-in-from-right duration-1000">
                        <div className="bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-16 min-h-[600px] shadow-2xl relative overflow-hidden">
                            {/* Inner Glow */}
                            <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none" />
                            
                            {selectedService ? (
                                <BookingClient
                                    serviceId={selectedService._id}
                                    initialDate={dateParam}
                                    slots={initialSlots}
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-center">
                                    <div className="h-20 w-20 bg-zinc-800/30 rounded-3xl flex items-center justify-center text-zinc-600 mb-6">
                                        <ArrowLeft size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Terminal Awaiting Protocol</h3>
                                    <p className="text-zinc-500 max-w-[240px] mx-auto text-sm mt-2">Select a service module from the left panel to begin operational mapping.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
