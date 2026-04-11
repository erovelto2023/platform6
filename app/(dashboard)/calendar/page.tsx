
import Link from "next/link";
import { Sparkles, Calendar as CalendarIcon, ArrowRight, ShieldCheck, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function CalendarHubPage() {
    return (
        <div className="flex flex-col relative animate-in fade-in duration-1000">
            <div className="max-w-6xl w-full mx-auto">
                {/* Visual Hub Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Booking BOS Card */}
                    <Link href="/calendar/bookings" className="group">
                        <div className="relative h-full bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-12 overflow-hidden transition-all hover:border-cyan-500/40 hover:bg-zinc-900/60 hover:-translate-y-2 shadow-2xl backdrop-blur-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-cyan-500/5 blur-[80px] -mr-24 -mt-24 group-hover:bg-cyan-500/10 transition-colors pointer-events-none" />
                            
                            <div className="w-20 h-20 bg-cyan-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-cyan-900/20 rotate-3 group-hover:rotate-6 transition-transform">
                                <CalendarIcon className="text-white w-10 h-10" />
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-black text-cyan-500 uppercase tracking-[4px] bg-cyan-500/10 px-3 py-1.5 rounded-full border border-cyan-500/20">Module 01</div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Client Booking <span className="text-cyan-400">Calendar</span></h2>
                                </div>
                                <p className="text-zinc-500 text-base font-medium leading-relaxed max-w-sm">
                                    Book your customers and clients.
                                </p>
                            </div>

                            <div className="mt-16 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <div className="flex items-center gap-2 text-zinc-700">
                                        <ShieldCheck size={16} className="group-hover:text-cyan-500/40 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-[3px] italic">Encrypted</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-700">
                                        <Zap size={16} className="group-hover:text-cyan-500/40 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-[3px] italic">High Priority</span>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-[1.5rem] bg-black/40 border border-zinc-800/50 flex items-center justify-center group-hover:bg-cyan-600 group-hover:border-cyan-500 text-zinc-500 group-hover:text-white transition-all shadow-2xl">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Content Strategy Card */}
                    <Link href="/calendar/content" className="group">
                        <div className="relative h-full bg-zinc-900/40 border border-zinc-800/50 rounded-[3rem] p-12 overflow-hidden transition-all hover:border-indigo-500/40 hover:bg-zinc-900/60 hover:-translate-y-2 shadow-2xl backdrop-blur-2xl">
                            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 blur-[80px] -mr-24 -mt-24 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />
                            
                            <div className="w-20 h-20 bg-indigo-600 rounded-[2rem] flex items-center justify-center mb-10 shadow-xl shadow-indigo-900/20 -rotate-3 group-hover:-rotate-6 transition-transform">
                                <Sparkles className="text-white w-10 h-10" />
                            </div>

                            <div className="space-y-5">
                                <div className="flex items-center gap-3">
                                    <div className="text-[10px] font-black text-indigo-500 uppercase tracking-[4px] bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">Module 02</div>
                                    <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic">Content <span className="text-indigo-400">Calendar</span></h2>
                                </div>
                                <p className="text-zinc-500 text-base font-medium leading-relaxed max-w-sm">
                                    Manage your content ideas and posting schedule.
                                </p>
                            </div>

                            <div className="mt-16 flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                   <div className="flex items-center gap-2 text-zinc-700">
                                        <ShieldCheck size={16} className="group-hover:text-indigo-500/40 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-[3px] italic">Authorized</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-zinc-700">
                                        <Zap size={16} className="group-hover:text-indigo-500/40 transition-colors" />
                                        <span className="text-[10px] font-black uppercase tracking-[3px] italic">Strategic</span>
                                    </div>
                                </div>
                                <div className="w-14 h-14 rounded-[1.5rem] bg-black/40 border border-zinc-800/50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:border-indigo-500 text-zinc-500 group-hover:text-white transition-all shadow-2xl">
                                    <ArrowRight size={24} />
                                </div>
                            </div>
                        </div>
                    </Link>

                </div>
            </div>
        </div>
    );
}
