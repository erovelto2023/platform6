
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Clock, DollarSign, ExternalLink, Gem, ShieldCheck, Copy, Trash2, ArrowRight } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { deleteCalendarService } from "@/lib/actions/calendar-service.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface ServiceListProps {
    services: any[];
}

export function ServiceList({ services }: ServiceListProps) {
    const router = useRouter();

    const handleDelete = async (id: string) => {
        if (confirm("Terminate this service protocol? All associated temporal windows will be revoked.")) {
            const res = await deleteCalendarService(id);
            if (res.success) {
                toast.success("Service Terminated");
                router.refresh();
            } else {
                toast.error("Termination Failed");
            }
        }
    };

    return (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 animate-in fade-in slide-in-from-bottom duration-1000">
            {services.map((service) => (
                <div 
                    key={service._id} 
                    className="group relative bg-zinc-900/40 border border-zinc-800/50 rounded-[2.5rem] p-8 overflow-hidden transition-all hover:border-indigo-500/40 hover:bg-zinc-900/60 shadow-2xl backdrop-blur-3xl"
                >
                    {/* Ambient Hover Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[60px] -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors pointer-events-none" />

                    <div className="space-y-6">
                        <div className="flex justify-between items-start relative z-10">
                            <div className="flex items-center gap-4">
                                <div className="h-14 w-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center text-indigo-400 shadow-inner group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
                                    <Gem size={24} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="font-black text-xl text-white uppercase italic tracking-tighter">{service.name}</h3>
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                        <span className="text-[9px] font-black uppercase tracking-[3px] text-zinc-500">Operation Active</span>
                                    </div>
                                </div>
                            </div>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="h-10 w-10 p-0 bg-black/20 border border-zinc-800/50 rounded-xl hover:bg-zinc-800 hover:text-white transition-all">
                                        <MoreHorizontal className="h-5 w-5" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="bg-zinc-900/95 border-zinc-800 text-zinc-400 backdrop-blur-xl p-2 rounded-2xl min-w-[200px]">
                                    <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-zinc-600 px-4 py-2">Service Controller</DropdownMenuLabel>
                                    <DropdownMenuItem onClick={() => router.push(`/calendar/services/${service._id}`)} className="rounded-xl py-3 px-4 focus:bg-indigo-500 focus:text-white cursor-pointer transition-colors">
                                        <ExternalLink className="mr-3 h-4 w-4" />
                                        <span>Edit Protocol</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => {
                                        const slug = service.slug || service._id;
                                        navigator.clipboard.writeText(`${window.location.origin}/book/${slug}`)
                                        toast.success("Protocol URL Synchronized");
                                    }} className="rounded-xl py-3 px-4 focus:bg-indigo-500 focus:text-white cursor-pointer transition-colors">
                                        <Copy className="mr-3 h-4 w-4" />
                                        <span>Copy Link</span>
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator className="bg-zinc-800 mx-2" />
                                    <DropdownMenuItem className="text-rose-500 rounded-xl py-3 px-4 focus:bg-rose-500 focus:text-white cursor-pointer transition-colors" onClick={() => handleDelete(service._id)}>
                                        <Trash2 className="mr-3 h-4 w-4" />
                                        <span>Terminate Service</span>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>

                        <p className="text-sm text-zinc-500 font-medium leading-relaxed line-clamp-2 min-h-[40px] px-1 italic">
                            {service.description || "Establish a strategic baseline for growth architecture."}
                        </p>

                        <div className="grid grid-cols-2 gap-4 py-6 border-y border-zinc-800/30">
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-black/20 flex items-center justify-center text-zinc-600">
                                    <Clock size={14} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-700 leading-none mb-1">Duration</div>
                                    <div className="text-xs font-black text-zinc-300 uppercase tracking-tight">{service.duration} MIN</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="h-8 w-8 rounded-lg bg-black/20 flex items-center justify-center text-zinc-600">
                                    <DollarSign size={14} />
                                </div>
                                <div>
                                    <div className="text-[8px] font-black uppercase tracking-widest text-zinc-700 leading-none mb-1">Allocation</div>
                                    <div className="text-xs font-black text-zinc-300 uppercase tracking-tight">{service.price > 0 ? `$${service.price} USD` : 'FREE ACCESS'}</div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <Link href={`/book/${service.slug || service._id}`} target="_blank">
                                <Button className="w-full bg-zinc-800/50 hover:bg-indigo-600 border border-zinc-700/50 hover:border-indigo-500 rounded-2xl h-14 font-black uppercase tracking-[3px] text-[10px] transition-all group/btn shadow-xl shadow-black/20">
                                    Launch Module Terminal
                                    <ArrowRight className="ml-3 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            ))}

            {/* Premium Add New Protocol Card */}
            <Link href="/calendar/services/new" className="group">
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-zinc-800/50 rounded-[3rem] bg-indigo-500/[0.02] hover:bg-indigo-500/[0.05] hover:border-indigo-500/30 transition-all cursor-pointer h-full min-h-[300px] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-indigo-500/[0.01] animate-pulse pointer-events-none" />
                    <div className="h-20 w-20 rounded-[2rem] bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6 group-hover:bg-indigo-500 text-indigo-400 group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all shadow-xl shadow-indigo-900/10 group-hover:shadow-indigo-500/20 relative z-10">
                        <Plus className="h-8 w-8 stroke-[3]" />
                    </div>
                    <h3 className="font-black text-xl text-white uppercase italic tracking-tighter mb-2 relative z-10">Create Bookable Event</h3>
                    <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest max-w-[200px] leading-relaxed relative z-10">Tell people what they can book from you.</p>
                </div>
            </Link>
        </div>
    );
}
