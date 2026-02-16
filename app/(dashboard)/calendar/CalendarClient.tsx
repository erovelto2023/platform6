
"use client";

import { useState } from "react";
import { UnifiedCalendar, CalendarViewType, CalendarEvent } from "@/components/calendar/UnifiedCalendar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { addMinutes, parseISO } from "date-fns";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";

interface CalendarClientProps {
    bookings: any[];
}

export function CalendarClient({ bookings }: CalendarClientProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarViewType>('month');
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    // Transform bookings to UnifiedCalendar events
    const events: CalendarEvent[] = bookings.map(booking => ({
        id: booking._id,
        title: `${booking.customerName} (${booking.serviceId?.name || 'Service'})`,
        start: new Date(booking.startTime),
        end: new Date(booking.endTime),
        color: "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100",
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

            {/* Event Details Modal */}
            <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Booking Details</DialogTitle>
                        <DialogDescription>
                            {selectedEvent?.start.toDateString()}
                        </DialogDescription>
                    </DialogHeader>
                    {selectedEvent && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div className="font-semibold">Customer:</div>
                                <div>{selectedEvent.data.customerName}</div>

                                <div className="font-semibold">Email:</div>
                                <div>{selectedEvent.data.customerEmail}</div>

                                <div className="font-semibold">Service:</div>
                                <div>{selectedEvent.data.serviceId?.name}</div>

                                <div className="font-semibold">Time:</div>
                                <div>
                                    {selectedEvent.start.toLocaleTimeString()} - {selectedEvent.end.toLocaleTimeString()}
                                </div>

                                <div className="font-semibold">Status:</div>
                                <div className="capitalize">{selectedEvent.data.status}</div>
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
