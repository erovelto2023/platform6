"use client";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import { updateBooking } from "@/lib/actions/booking.actions";
import { toast } from "sonner";
import { Loader2, Calendar, Clock, User, Mail, FileText, Trash2, CalendarClock, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface BookingDetailsSheetProps {
    booking: any | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: () => void;
}

export function BookingDetailsSheet({ booking, open, onOpenChange, onUpdate }: BookingDetailsSheetProps) {
    const [notes, setNotes] = useState("");
    const [status, setStatus] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isRescheduling, setIsRescheduling] = useState(false);
    const [newDate, setNewDate] = useState("");
    const [newTime, setNewTime] = useState("");

    useEffect(() => {
        if (booking) {
            setNotes(booking.notes || "");
            setStatus(booking.status);
            setNewDate(format(new Date(booking.startTime), 'yyyy-MM-dd'));
            setNewTime(format(new Date(booking.startTime), 'HH:mm'));
            setIsRescheduling(false);
        }
    }, [booking]);

    const handleSave = async () => {
        if (!booking) return;
        setIsLoading(true);
        try {
            const data: any = { notes, status };

            if (isRescheduling) {
                const startDateTime = new Date(`${newDate}T${newTime}`);
                const duration = (new Date(booking.endTime).getTime() - new Date(booking.startTime).getTime());
                const endDateTime = new Date(startDateTime.getTime() + duration);

                data.startTime = startDateTime;
                data.endTime = endDateTime;
            }

            const res = await updateBooking(booking._id, data);
            if (res.success) {
                toast.success("Operational Intel Updated");
                onOpenChange(false);
                if (onUpdate) onUpdate();
            } else {
                toast.error(res.error || "Broadcast Error");
            }
        } catch (error) {
            toast.error("Process Interrupted");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to terminate this session?")) return;
        setIsLoading(true);
        try {
            const res = await updateBooking(booking._id, { status: 'cancelled' });
            if (res.success) {
                toast.success("Session Terminated");
                onOpenChange(false);
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error("Termination Failed");
        } finally {
            setIsLoading(false);
        }
    };

    if (!booking) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[450px] sm:w-[540px] bg-[#0B0E23] border-l border-zinc-800/50 shadow-2xl p-0 overflow-hidden flex flex-col font-sans">
                {/* Header Section */}
                <div className="p-8 bg-zinc-900/40 border-b border-zinc-800/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[80px] -mr-16 -mt-16" />
                    
                    <div className="flex items-center justify-between mb-6">
                        <Badge className={cn(
                            "px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[3px] border-none shadow-lg",
                            status === "confirmed" ? "bg-emerald-500/10 text-emerald-400 shadow-emerald-500/10" : 
                            status === "cancelled" ? "bg-rose-500/10 text-rose-400 shadow-rose-500/10" : 
                            "bg-indigo-500/10 text-indigo-400 shadow-indigo-500/10"
                        )}>
                            {status.toUpperCase()}
                        </Badge>
                        <div className="flex items-center gap-2 text-[10px] font-black text-zinc-600 uppercase tracking-widest bg-black/40 px-3 py-1.5 rounded-xl border border-zinc-800/50">
                            <ShieldCheck size={12} />
                            BOS-ID: {booking._id.slice(-6)}
                        </div>
                    </div>

                    <SheetTitle className="text-3xl font-black tracking-tighter text-white mb-2 leading-none uppercase">
                        {booking.serviceId?.name || "Target Session"}
                    </SheetTitle>
                    <SheetDescription className="text-zinc-500 font-bold uppercase text-[10px] tracking-[4px]">
                        Session Management Hub
                    </SheetDescription>
                </div>

                {/* Content Section */}
                <div className="flex-1 overflow-y-auto px-8 py-10 space-y-12 text-white">
                    {/* Time Matrix */}
                    <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-3 p-5 bg-black/40 rounded-3xl border border-zinc-800/50 shadow-inner group transition-all hover:border-cyan-500/30">
                            <div className="flex items-center text-[9px] font-black text-zinc-600 uppercase tracking-[3px] gap-2">
                                <Calendar className="w-3 h-3 text-cyan-500" /> Date
                            </div>
                            <div className="font-black text-white text-lg tracking-tight">
                                {format(new Date(booking.startTime), "MMMM d, yyyy")}
                            </div>
                        </div>
                        <div className="space-y-3 p-5 bg-black/40 rounded-3xl border border-zinc-800/50 shadow-inner group transition-all hover:border-indigo-500/30">
                            <div className="flex items-center text-[9px] font-black text-zinc-600 uppercase tracking-[3px] gap-2">
                                <Clock className="w-3 h-3 text-indigo-500" /> Interval
                            </div>
                            <div className="font-black text-white text-lg tracking-tight">
                                {format(new Date(booking.startTime), "HH:mm")} <span className="text-zinc-600 text-xs">-</span> {format(new Date(booking.endTime), "HH:mm")}
                            </div>
                        </div>
                    </div>

                    {/* Principal Entity */}
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black uppercase tracking-[5px] text-zinc-700 flex items-center gap-3">
                            <User className="w-3.5 h-3.5" /> Client Entity
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-1">Legal Name</Label>
                                <div className="text-base font-bold text-white pl-1">{booking.customerName}</div>
                            </div>
                            <div className="space-y-1.5">
                                <Label className="text-[9px] font-black text-zinc-600 uppercase tracking-widest pl-1">Digital Point</Label>
                                <div className="text-base font-bold text-zinc-400 pl-1 break-all flex items-center gap-2">
                                    <Mail size={12} className="text-zinc-700" />
                                    {booking.customerEmail}
                                </div>
                            </div>
                        </div>
                    </div>

                    <Separator className="bg-zinc-800/50" />

                    {/* Tactical Notes */}
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[5px] text-zinc-700 flex items-center gap-3">
                            <FileText className="w-3.5 h-3.5" /> Session Metadata
                        </h3>
                        <div className="relative group">
                            <Textarea
                                id="notes"
                                placeholder="Ingest operational notes..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[140px] bg-black/20 border-zinc-800/50 rounded-[2rem] p-6 text-sm font-medium focus:ring-2 focus:ring-cyan-500/20 transition-all placeholder:text-zinc-800 text-white"
                            />
                        </div>
                    </div>

                    {/* Reschedule Logic */}
                    <div className="space-y-6 pt-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-[10px] font-black uppercase tracking-[5px] text-rose-500/60 flex items-center gap-3">
                                <CalendarClock className="w-3.5 h-3.5" /> Delta Modification
                            </h3>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                className="text-[9px] font-black uppercase tracking-widest text-zinc-600 hover:text-white"
                                onClick={() => setIsRescheduling(!isRescheduling)}
                            >
                                {isRescheduling ? "Abort" : "Engage"}
                            </Button>
                        </div>

                        {isRescheduling && (
                            <div className="grid grid-cols-2 gap-4 p-6 bg-black/40 border border-zinc-800/50 rounded-3xl animate-in fade-in zoom-in-95 duration-300">
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">New Epoch</Label>
                                    <Input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        className="bg-zinc-900/60 border-zinc-800 rounded-xl text-xs font-bold text-white"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-[9px] font-black uppercase tracking-widest text-zinc-600">Shift Time</Label>
                                    <Input
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                        className="bg-zinc-900/60 border-zinc-800 rounded-xl text-xs font-bold text-white"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Section */}
                <div className="p-8 bg-zinc-900/40 border-t border-zinc-800/50 flex flex-col md:flex-row gap-4 mt-auto">
                    {status !== 'cancelled' && (
                        <Button 
                            variant="ghost" 
                            onClick={handleCancel} 
                            disabled={isLoading} 
                            className="bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white rounded-2xl md:w-12 h-14"
                        >
                            <Trash2 size={20} />
                        </Button>
                    )}
                    <Button 
                        variant="outline" 
                        onClick={() => onOpenChange(false)} 
                        disabled={isLoading}
                        className="bg-black/40 border-zinc-800/50 text-zinc-400 hover:text-white rounded-2xl h-14 flex-1 text-[11px] font-black uppercase tracking-widest"
                    >
                        Close Portal
                    </Button>
                    <Button 
                        onClick={handleSave} 
                        disabled={isLoading}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl h-14 flex-1 text-[11px] font-black uppercase tracking-widest shadow-xl shadow-cyan-900/20"
                    >
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Commit Changes"}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
