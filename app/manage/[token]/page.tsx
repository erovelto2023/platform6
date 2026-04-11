
import { getBookingByToken, updateBooking } from "@/lib/actions/booking.actions";
import { format, isAfter, subHours } from "date-fns";
import { 
    Calendar as CalendarIcon, 
    Clock, 
    ShieldCheck, 
    XCircle, 
    Video, 
    MapPin, 
    HelpCircle,
    RotateCcw,
    AlertTriangle,
    CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

interface ManageBookingProps {
    params: {
        token: string;
    };
}

export default async function ManageBookingPage(props: ManageBookingProps) {
    const params = await props.params;
    const token = params.token;

    const { data: booking, error } = await getBookingByToken(token);

    if (error || !booking) {
        return (
            <div className="min-h-screen bg-[#0B0E14] flex flex-col items-center justify-center p-8 text-center uppercase tracking-tighter">
                <div className="h-20 w-20 bg-rose-500/10 border border-rose-500/20 rounded-3xl flex items-center justify-center text-rose-500 mb-6 font-black italic">!</div>
                <h1 className="text-3xl font-black text-white italic">Link Expired</h1>
                <p className="text-zinc-500 mt-2 font-medium tracking-widest text-[10px]">Your session access token is no longer valid.</p>
            </div>
        );
    }

    const service = booking.serviceId;
    const isCancelled = booking.status === 'cancelled';
    const isPast = isAfter(new Date(), new Date(booking.startTime));
    
    // Cancellation Policy Check (e.g. 24h)
    const canCancel = !isCancelled && !isPast && isAfter(new Date(booking.startTime), subHours(new Date(), 24));

    async function handleCancel() {
        'use server';
        await updateBooking(booking._id, { status: 'cancelled' });
        redirect(`/manage/${token}`);
    }

    return (
        <div className="min-h-screen bg-[#0F1218] text-white selection:bg-cyan-500/30 overflow-x-hidden">
            {/* Background Glow */}
            <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
            
            <div className="relative max-w-4xl mx-auto px-6 py-12 lg:py-32 animate-in fade-in slide-in-from-bottom duration-1000">
                {/* Header Profile */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-[4px] mb-6 py-1.5 px-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                         Self-Service Portal
                    </div>
                    <div className="h-24 w-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-[2.5rem] flex items-center justify-center shadow-2xl border border-zinc-800 mb-8 overflow-hidden group">
                         <div className="text-3xl font-black text-zinc-400 group-hover:scale-110 group-hover:text-cyan-400 transition-all uppercase italic tracking-tighter">BOS</div>
                    </div>
                    <h1 className="text-4xl lg:text-6xl font-black tracking-tight text-white uppercase italic leading-none">
                        Manage Session
                    </h1>
                    <p className="text-zinc-500 mt-4 font-black uppercase tracking-[3px] text-xs">Identity Confirmed: {booking.customerName}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Details Card */}
                    <div className="md:col-span-2 space-y-8">
                        <div className="bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-2xl rounded-[3rem] p-8 lg:p-12 shadow-2xl relative overflow-hidden">
                            <div className="flex items-center justify-between mb-10">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-[3px] mb-1">Operational Protocol</span>
                                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">{service?.name}</h2>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                    isCancelled ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
                                }`}>
                                    {booking.status}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-12">
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                       <div className="h-10 w-10 bg-zinc-800/50 rounded-xl flex items-center justify-center text-zinc-400"><CalendarIcon size={18} /></div>
                                       <div>
                                           <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Protocol Date</div>
                                           <div className="text-sm font-black text-white uppercase tracking-tight">{format(new Date(booking.startTime), 'EEEE, MMMM do, yyyy')}</div>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                       <div className="h-10 w-10 bg-zinc-800/50 rounded-xl flex items-center justify-center text-zinc-400"><Clock size={18} /></div>
                                       <div>
                                           <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Synchronized Time</div>
                                           <div className="text-sm font-black text-white uppercase tracking-tight tabular-nums">{format(new Date(booking.startTime), 'h:mm a')} <span className="text-[10px] text-zinc-500">EST</span></div>
                                       </div>
                                   </div>
                                </div>
                                <div className="space-y-4">
                                   <div className="flex items-center gap-3">
                                       <div className="h-10 w-10 bg-zinc-800/50 rounded-xl flex items-center justify-center text-indigo-400"><Video size={18} /></div>
                                       <div>
                                           <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Session Medium</div>
                                           <div className="text-sm font-black text-white uppercase tracking-tight truncate max-w-[150px]">{booking.location || 'Terminal Sync (Online)'}</div>
                                       </div>
                                   </div>
                                   <div className="flex items-center gap-3">
                                       <div className="h-10 w-10 bg-zinc-800/50 rounded-xl flex items-center justify-center text-emerald-400"><CheckCircle2 size={18} /></div>
                                       <div>
                                           <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest leading-none mb-1">Billing Status</div>
                                           <div className="text-sm font-black text-white uppercase tracking-tight">{booking.paymentStatus}</div>
                                       </div>
                                   </div>
                                </div>
                            </div>
                            
                            {booking.notes && (
                                <div className="p-6 bg-black/20 rounded-2xl border border-zinc-800/50 mb-10">
                                    <div className="text-[9px] font-black text-zinc-700 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <XCircle size={10} className="rotate-45" /> Attachment: Input Notes
                                    </div>
                                    <p className="text-sm font-medium text-zinc-400 italic">"{booking.notes}"</p>
                                </div>
                            )}

                            {!isCancelled && (
                                <div className="flex gap-4">
                                     <Button className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border border-zinc-700">
                                         <RotateCcw size={16} className="mr-2" />
                                         Request Re-Sync
                                     </Button>
                                     <form action={handleCancel} className="flex-1">
                                        <Button 
                                            type="submit"
                                            className="w-full bg-rose-900/10 hover:bg-rose-900/20 text-rose-500 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] border border-rose-500/20"
                                            disabled={!canCancel}
                                        >
                                            <XCircle size={16} className="mr-2" />
                                            Abort Session
                                        </Button>
                                     </form>
                                </div>
                            )}
                            
                            {isCancelled && (
                                <div className="p-8 bg-rose-500/5 border border-rose-500/20 rounded-[2rem] text-center">
                                     <XCircle size={32} className="mx-auto text-rose-500 mb-4" />
                                     <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Session Aborted</h3>
                                     <p className="text-zinc-500 text-xs font-medium uppercase tracking-widest mt-2">Operational window has been released.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar / Info */}
                    <div className="space-y-6">
                        <div className="bg-zinc-900/30 border border-zinc-800/50 backdrop-blur-2xl rounded-[2.5rem] p-8">
                             <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-6 border-b border-zinc-800 pb-4">Security Protocol</h4>
                             <div className="space-y-6">
                                <div className="flex gap-3">
                                    <ShieldCheck className="text-cyan-400 shrink-0" size={16} />
                                    <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-tight">Access is encrypted via unique temporal token.</p>
                                </div>
                                <div className="flex gap-3">
                                    <AlertTriangle className="text-amber-500 shrink-0" size={16} />
                                    <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-tight">Changes must be authorized at least 24h prior.</p>
                                </div>
                                <div className="flex gap-3">
                                    <HelpCircle className="text-zinc-600 shrink-0" size={16} />
                                    <p className="text-[11px] font-medium text-zinc-400 leading-relaxed uppercase tracking-tight">Contact host for emergency overrides.</p>
                                </div>
                             </div>
                        </div>

                        <Link 
                            href={`/book/${service?.businessId}`}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-[2rem] h-20 w-full flex items-center justify-center font-black uppercase tracking-widest text-[11px] transition-all shadow-xl shadow-cyan-900/20 group"
                        >
                            Schedule New Protocol
                            <CalendarIcon size={18} className="ml-3 group-hover:translate-x-1 transition-transform" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
