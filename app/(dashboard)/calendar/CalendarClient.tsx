"use client";

import { useState } from "react";
import { UnifiedCalendar, CalendarViewType, CalendarEvent } from "@/components/calendar/UnifiedCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { addMinutes, parseISO } from "date-fns";
import { BookingDetailsSheet } from "@/components/calendar/BookingDetailsSheet";
import { useRouter } from "next/navigation";

interface CalendarClientProps {
    bookings: any[];
}

export function CalendarClient({ bookings }: CalendarClientProps) {
    const router = useRouter();
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarViewType>('month');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Transform bookings to UnifiedCalendar events
    const events: CalendarEvent[] = bookings.map(booking => ({
        id: booking._id,
        title: `${booking.customerName} (${booking.serviceId?.name || 'Service'})`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        color: booking.status === 'cancelled'
            ? "bg-red-50 text-red-700 border-red-100 opacity-70"
            : "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
        data: booking
    }));

    return (
        <div className="space-y-4">
            <div className="flex justify-end">
                <Link href="/calendar/services">
                    <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                        <Plus className="mr-2 h-4 w-4" /> New Event
                    </Button>
                </Link>
            </div>

            <UnifiedCalendar
                events={events}
                view={view}
                date={date}
                onViewChange={setView}
                onDateChange={setDate}
                onEventClick={setSelectedEvent}
            />

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
