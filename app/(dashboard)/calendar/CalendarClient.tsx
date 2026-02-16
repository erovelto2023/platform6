
"use client";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { cn } from "@/lib/utils";

interface CalendarClientProps {
    bookings: any[];
}

export function CalendarClient({ bookings }: CalendarClientProps) {
    const [date, setDate] = useState<Date | undefined>(new Date());

    // Identify days with bookings for highlighting
    const bookedDays = bookings.map(b => new Date(b.startTime));

    // Filter bookings for selected date
    const selectedDateBookings = bookings.filter(booking =>
        date && isSameDay(new Date(booking.startTime), date)
    );

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>Calendar</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        className="rounded-md border p-4"
                        modifiers={{
                            booked: bookedDays
                        }}
                        modifiersStyles={{
                            booked: { fontWeight: 'bold', textDecoration: 'underline', color: '#2563eb' }
                        }}
                    />
                </CardContent>
            </Card>

            <Card className="border-slate-200 shadow-sm">
                <CardHeader>
                    <CardTitle>
                        {date ? format(date, 'MMM do, yyyy') : 'Selected Date'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {selectedDateBookings.length > 0 ? (
                            selectedDateBookings.map((booking: any) => (
                                <div key={booking._id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <span className="font-medium text-slate-900 line-clamp-1">{booking.serviceId?.name || 'Unknown Service'}</span>
                                        <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                                                booking.status === 'cancelled' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-700'
                                            }`}>
                                            {booking.status}
                                        </span>
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 gap-2">
                                        <Clock className="h-3 w-3" />
                                        {format(new Date(booking.startTime), 'h:mm a')} - {format(new Date(booking.endTime), 'h:mm a')}
                                    </div>
                                    <div className="flex items-center text-xs text-slate-500 gap-2">
                                        <User className="h-3 w-3" />
                                        {booking.customerName}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-8 text-slate-500">
                                No appointments scheduled.
                            </div>
                        )}
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100">
                        <Link href="/calendar/services">
                            <Button className="w-full" variant="outline">
                                <Plus className="mr-2 h-4 w-4" /> Schedule (Manual)
                            </Button>
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
