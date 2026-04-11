"use client";

import { useState } from "react";
import { UnifiedCalendar, CalendarViewType, CalendarEvent } from "@/components/calendar/UnifiedCalendar";
import { Button } from "@/components/ui/button";
import { Plus, LayoutDashboard, Calendar as CalendarIcon, Sparkles } from "lucide-react";
import Link from "next/link";
import { BookingDetailsSheet } from "@/components/calendar/BookingDetailsSheet";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface CalendarClientProps {
    bookings: any[];
}

export function CalendarClient({ bookings }: CalendarClientProps) {
    const router = useRouter();
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarViewType>('month');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Transform bookings to UnifiedCalendar events with Premium BOS styling
    const events: CalendarEvent[] = bookings.map(booking => ({
        id: booking._id,
        title: booking.customerName || 'Client Session',
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        color: booking.status === 'cancelled'
            ? "border-l-rose-500 bg-rose-500/10 text-rose-400 border-zinc-800/50 opacity-60"
            : "border-l-cyan-500 bg-zinc-900/60 text-white border-zinc-800/50 hover:bg-zinc-800/80 shadow-lg",
        data: booking
    }));

    return (
        <div className="flex flex-col h-full bg-[#0B0E23] rounded-[2.5rem] p-8 border border-zinc-800/50 shadow-2xl relative overflow-hidden font-sans">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent" />
            
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
                <div className="flex flex-col">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/40 rotate-3">
                            <Sparkles size={16} className="text-white" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-500">Operation Orbit</span>
                    </div>
                    <h2 className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
                        Strategic Session Grid
                    </h2>
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/calendar/services">
                        <Button variant="outline" className="border-zinc-800 bg-black/20 text-zinc-400 hover:text-white rounded-2xl h-14 px-8 font-black uppercase tracking-widest text-[11px] transition-all">
                            Configure Services
                        </Button>
                    </Link>
                    <Link href="/calendar/bookings">
                        <Button className="bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl h-14 px-10 font-black uppercase tracking-widest text-[11px] shadow-xl shadow-cyan-900/20 border-b-4 border-cyan-700 active:border-b-0 active:translate-y-1 transition-all">
                            <Plus size={18} className="mr-3" /> 
                            New Engagement
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="flex-1 min-h-0">
                <UnifiedCalendar
                    events={events}
                    view={view}
                    date={date}
                    onViewChange={setView}
                    onDateChange={setDate}
                    onEventClick={setSelectedEvent}
                />
            </div>

            <BookingDetailsSheet
                booking={selectedEvent?.data}
                open={!!selectedEvent}
                onOpenChange={(open) => !open && setSelectedEvent(null)}
                onUpdate={() => {
                    router.refresh();
                    setSelectedEvent(null);
                }}
            />
        </div>
    );
}
