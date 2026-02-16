
"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Clock, User, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getBookings } from "@/lib/actions/booking.actions";
import { toast } from "sonner";
import { Calendar } from "@/components/ui/calendar"; // Assuming shadcn Calendar exists
// If Calendar doesn't exist, we might need to use a simpler date picker or list view for now.
// For this step, I'll stick to a list view first to be safe, or check if Calendar exists.

export function BookingsList() {
    const [bookings, setBookings] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadBookings();
    }, []);

    async function loadBookings() {
        try {
            const res = await getBookings();
            if (res.success) {
                setBookings(res.data);
            } else {
                toast.error("Failed to load bookings");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    }

    if (isLoading) return <div>Loading bookings...</div>;

    const upcomingBookings = bookings.filter(b => new Date(b.startTime) >= new Date());
    const pastBookings = bookings.filter(b => new Date(b.startTime) < new Date());

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {upcomingBookings.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No upcoming bookings.</p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingBookings.map((booking) => (
                                <div key={booking._id} className="flex items-center justify-between border p-4 rounded-lg">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-100 p-3 rounded-full">
                                            <CalendarIcon className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-semibold">{booking.serviceId?.name || "Unknown Service"}</h4>
                                            <div className="flex items-center gap-2 text-sm text-slate-500">
                                                <Clock className="h-3 w-3" />
                                                {format(new Date(booking.startTime), "PP p")} - {format(new Date(booking.endTime), "p")}
                                            </div>
                                            <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                                                <User className="h-3 w-3" /> {booking.customerName}
                                                <Mail className="h-3 w-3 ml-2" /> {booking.customerEmail}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Badge>{booking.status}</Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Past Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                    {pastBookings.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No past bookings.</p>
                    ) : (
                        <div className="space-y-4 opacity-75">
                            {pastBookings.map((booking) => (
                                <div key={booking._id} className="flex items-center justify-between border p-4 rounded-lg bg-slate-50">
                                    <div>
                                        <h4 className="font-semibold">{booking.serviceId?.name}</h4>
                                        <div className="text-sm text-slate-500">
                                            {format(new Date(booking.startTime), "PP p")}
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            {booking.customerName}
                                        </div>
                                    </div>
                                    <Badge variant="outline">Completed</Badge>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
