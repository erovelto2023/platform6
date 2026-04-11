
"use client";

import { useState } from "react";
import { format, addMonths, subMonths, isSameDay, parse } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/actions/booking.actions";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, CheckCircle2, ArrowRight, ShieldCheck, Mail, User, Phone, FileText, Plus, ShieldAlert } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface BookingClientProps {
    serviceId: string;
    initialDate: string;
    slots: string[];
}

export function BookingClient({ serviceId, initialDate, slots }: BookingClientProps) {
    const router = useRouter();
    const [date, setDate] = useState<Date | undefined>(new Date(initialDate));
    const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
    const [step, setStep] = useState<"time" | "form" | "confirmation">("time");

    // Form State
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDateSelect = (selected: Date | undefined) => {
        if (selected) {
            setDate(selected);
            setSelectedSlot(null);
            router.push(`/book/${serviceId}?date=${format(selected, 'yyyy-MM-dd')}`, { scroll: false });
        }
    };

    const handleSlotSelect = (slot: string) => {
        setSelectedSlot(slot);
        setStep("form");
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            if (!date || !selectedSlot) return;

            const [hours, minutes] = selectedSlot.split(':').map(Number);
            const startTime = new Date(date);
            startTime.setHours(hours, minutes, 0, 0);

            const res = await createBooking({
                serviceId: serviceId,
                customerName: name,
                customerEmail: email,
                customerPhone: phone,
                startTime: startTime,
                notes: notes,
            });

            if (res.success) {
                setStep("confirmation");
                toast.success("Consultation Scheduled Successfully");
            } else {
                toast.error(res.error || "Execution failed");
            }
        } catch (error) {
            toast.error("Critical System Error");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === "confirmation") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[500px] text-center space-y-8 animate-in fade-in zoom-in duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-emerald-500/20 blur-3xl rounded-full" />
                    <div className="relative h-24 w-24 bg-emerald-500/10 border border-emerald-500/20 rounded-3xl flex items-center justify-center text-emerald-500 mb-2">
                        <CheckCircle2 size={48} strokeWidth={1.5} />
                    </div>
                </div>
                
                <div className="space-y-4">
                    <h2 className="text-4xl font-black tracking-tight text-white uppercase italic">Protocol Initiated</h2>
                    <p className="text-zinc-400 max-w-sm mx-auto leading-relaxed text-sm font-medium">
                        Your strategic session has been successfully synchronized for <br />
                        <span className="text-cyan-400 font-black uppercase tracking-widest">{date ? format(date, 'MMMM do') : ''} @ {selectedSlot}</span>
                    </p>
                    <div className="flex items-center justify-center gap-2 text-[10px] text-zinc-500 uppercase tracking-[3px] font-black">
                        <ShieldCheck size={12} className="text-emerald-500" />
                        Confirmation sequence sent
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm pt-8">
                    <Button 
                        className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 rounded-2xl h-14 font-black uppercase tracking-widest text-[10px]"
                        onClick={() => window.location.reload()}
                    >
                        Schedule Another
                    </Button>
                    <Button 
                        className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl h-14 font-black uppercase tracking-widest text-[10px] shadow-xl shadow-cyan-900/20"
                        onClick={() => router.push('/')}
                    >
                        Return to Hub
                    </Button>
                </div>
            </div>
        );
    }

    if (step === "form") {
        return (
            <div className="max-w-xl mx-auto h-full flex flex-col pt-4 animate-in slide-in-from-right duration-500">
                <header className="mb-10">
                    <div className="flex items-center justify-between mb-6">
                        <button 
                            onClick={() => setStep("time")} 
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[2px] text-zinc-500 hover:text-cyan-400 transition-colors"
                        >
                            <ChevronLeft size={16} /> Re-sync Time
                        </button>
                        <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[3px] py-1 px-3 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                            Step 02/02
                        </div>
                    </div>
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Identity Verification</h2>
                    <p className="text-zinc-500 text-sm font-medium mt-1 uppercase tracking-widest">Provide your credentials to confirm access.</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-6 flex-1 pr-4 custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500 ml-1">Full Name</Label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                <Input 
                                    id="name" 
                                    required 
                                    placeholder="Enter your name"
                                    className="bg-black/40 border-2 border-zinc-800/50 rounded-2xl py-6 pl-12 focus:border-cyan-500/50 transition-all font-bold text-sm"
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500 ml-1">Contact Email</Label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                                <Input 
                                    id="email" 
                                    type="email" 
                                    required 
                                    placeholder="your@email.com"
                                    className="bg-black/40 border-2 border-zinc-800/50 rounded-2xl py-6 pl-12 focus:border-cyan-500/50 transition-all font-bold text-sm"
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500 ml-1">Phone (Optional)</Label>
                        <div className="relative group">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                            <Input 
                                id="phone" 
                                type="tel"
                                placeholder="+1 (555) 000-0000"
                                className="bg-black/40 border-2 border-zinc-800/50 rounded-2xl py-6 pl-12 focus:border-cyan-500/50 transition-all font-bold text-sm"
                                value={phone} 
                                onChange={(e) => setPhone(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="notes" className="text-[10px] font-black uppercase tracking-[2px] text-zinc-500 ml-1">Strategic Notes</Label>
                        <div className="relative group">
                            <FileText className="absolute left-4 top-14 text-zinc-600 group-focus-within:text-cyan-400 transition-colors" size={16} />
                            <Textarea 
                                id="notes" 
                                placeholder="Anything we should know before the session?"
                                className="bg-black/40 border-2 border-zinc-800/50 rounded-3xl py-12 pl-12 min-h-[120px] focus:border-cyan-500/50 transition-all font-bold text-sm resize-none"
                                value={notes} 
                                onChange={(e) => setNotes(e.target.value)} 
                            />
                        </div>
                    </div>

                    <div className="pt-6">
                        <Button 
                            type="submit" 
                            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white rounded-3xl h-16 font-black uppercase tracking-[3px] text-xs transition-all shadow-2xl shadow-cyan-950/20 border-b-4 border-cyan-800 active:border-b-0 active:translate-y-1" 
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="mr-3 h-5 w-5 animate-spin" />
                                    Synchronizing Engine...
                                </>
                            ) : (
                                <>
                                    Confirm Session Protocol
                                    <ArrowRight size={18} className="ml-3" />
                                </>
                            )}
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col animate-in fade-in duration-700">
            <header className="mb-8 flex items-center justify-between">
                <div>
                   <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">Temporal Selection</h2>
                   <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[3px] mt-1">Select your preferred operational window.</p>
                </div>
                <div className="text-[10px] font-black text-cyan-400 uppercase tracking-[3px] py-1.5 px-4 bg-cyan-500/10 border border-cyan-500/20 rounded-full">
                    Step 01/02
                </div>
            </header>

            <div className="flex flex-col lg:flex-row gap-8 xl:gap-16 flex-1 overflow-hidden">
                {/* Calendar Side */}
                <div className="flex-shrink-0 animate-in slide-in-from-left duration-700">
                    <div className="p-4 bg-zinc-900/40 backdrop-blur-xl border border-zinc-800/50 rounded-[2.5rem] shadow-2xl">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={handleDateSelect}
                            className="p-4"
                            classNames={{
                                day: "h-14 w-14 p-0 font-black text-xs uppercase hover:bg-cyan-500/10 hover:text-cyan-400 rounded-2xl transition-all aria-selected:bg-cyan-500 aria-selected:text-black aria-selected:shadow-xl aria-selected:shadow-cyan-500/20",
                                head_cell: "text-zinc-600 font-black text-[9px] uppercase tracking-widest w-14 pb-4",
                                cell: "h-14 w-14 p-0.5",
                                nav_button_previous: "h-9 w-9 bg-zinc-800/50 text-white rounded-xl border-zinc-700 hover:bg-cyan-500 hover:text-black transition-colors",
                                nav_button_next: "h-9 w-9 bg-zinc-800/50 text-white rounded-xl border-zinc-700 hover:bg-cyan-500 hover:text-black transition-colors",
                                caption_label: "text-xs font-black uppercase tracking-[3px] text-zinc-400 mb-6 flex items-center gap-2",
                                day_today: "text-cyan-500",
                                day_outside: "opacity-10",
                            }}
                            disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                        />
                    </div>
                </div>

                {/* Slots Side */}
                <div className="flex-1 flex flex-col pr-2 animate-in slide-in-from-bottom duration-700">
                    <div className="flex items-center gap-3 mb-6">
                        <Clock size={16} className="text-zinc-600" />
                        <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[4px]">
                            {date ? format(date, 'EEEE | MMMM do') : 'Pending Date Selection'}
                        </h3>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 overflow-y-auto pr-4 custom-scrollbar max-h-[450px]">
                        {slots.length > 0 ? (
                            slots.map((slot: string) => (
                                <button
                                    key={slot}
                                    className="group relative h-16 bg-zinc-900/40 border-2 border-zinc-800/50 rounded-2xl hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all outline-none"
                                    onClick={() => handleSlotSelect(slot)}
                                >
                                    <div className="flex flex-col items-center justify-center h-full">
                                        <span className="text-sm font-black text-zinc-300 group-hover:text-white tabular-nums tracking-tighter">
                                            {format(parse(slot, 'HH:mm', new Date()), 'h:mm')}
                                        </span>
                                        <span className="text-[9px] font-black text-zinc-600 group-hover:text-cyan-400 uppercase tracking-widest mt-0.5">
                                            {format(parse(slot, 'HH:mm', new Date()), 'a')}
                                        </span>
                                    </div>
                                    <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Plus size={10} className="text-cyan-500" />
                                    </div>
                                </button>
                            ))
                        ) : (
                            <div className="col-span-full h-80 flex flex-col items-center justify-center border-2 border-dashed border-zinc-800/50 rounded-[2.5rem] bg-black/20 text-center p-8">
                                <div className="h-16 w-16 bg-zinc-800/30 rounded-3xl flex items-center justify-center text-zinc-700 mb-4 opacity-50">
                                    <ShieldAlert size={32} />
                                </div>
                                <h4 className="text-sm font-black uppercase text-zinc-600 tracking-widest mb-2">Protocol Conflict</h4>
                                <p className="text-xs text-zinc-700 font-medium max-w-[200px]">No operational windows detected for the selected period.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #27272a;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #3f3f46;
                }
            `}</style>
        </div>
    );
}
