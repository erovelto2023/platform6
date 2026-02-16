
"use client";

import { useEffect, useState } from "react";
import { getBookings } from "@/lib/actions/booking.actions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format, isFuture, isPast } from "date-fns";
import { Loader2 } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";

import { BookingDetailsSheet } from "@/components/calendar/BookingDetailsSheet";

interface BookingsListProps {
    searchTerm?: string;
}

export function BookingsList({ searchTerm = "" }: BookingsListProps) {
    const [bookings, setBookings] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedBooking, setSelectedBooking] = useState<any | null>(null);
    const [isSheetOpen, setIsSheetOpen] = useState(false);

    const fetchBookings = async () => {
        setLoading(true);
        const res = await getBookings();
        if (res.success) {
            setBookings(res.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleBookingClick = (booking: any) => {
        setSelectedBooking(booking);
        setIsSheetOpen(true);
    };

    if (loading) {
        return <div className="flex justify-center p-8"><Loader2 className="h-6 w-6 animate-spin text-slate-400" /></div>;
    }

    const filteredBookings = bookings.filter(booking => {
        const matchesSearch =
            booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            booking.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (booking.serviceId?.name || "").toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const upcomingBookings = filteredBookings.filter(b => isFuture(new Date(b.startTime)));
    const pastBookings = filteredBookings.filter(b => isPast(new Date(b.startTime)));

    // Helper table component
    const BookingTable = ({ data }: { data: any[] }) => (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Service</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                No bookings found.
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((booking) => (
                            <TableRow
                                key={booking._id}
                                className="cursor-pointer hover:bg-slate-50 transition-colors"
                                onClick={() => handleBookingClick(booking)}
                            >
                                <TableCell className="font-medium">{format(new Date(booking.startTime), "MMM d, yyyy")}</TableCell>
                                <TableCell>
                                    {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-medium">{booking.customerName}</span>
                                        <span className="text-xs text-muted-foreground">{booking.customerEmail}</span>
                                    </div>
                                </TableCell>
                                <TableCell>{booking.serviceId?.name || "Unknown"}</TableCell>
                                <TableCell>
                                    <Badge variant={booking.status === "confirmed" ? "default" : booking.status === "cancelled" ? "destructive" : "secondary"}>
                                        {booking.status}
                                    </Badge>
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    );

    return (
        <>
            <TabsContent value="upcoming" className="mt-0">
                <BookingTable data={upcomingBookings} />
            </TabsContent>
            <TabsContent value="past" className="mt-0">
                <BookingTable data={pastBookings} />
            </TabsContent>
            <TabsContent value="all" className="mt-0">
                <BookingTable data={filteredBookings} />
            </TabsContent>

            <BookingDetailsSheet
                booking={selectedBooking}
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                onUpdate={fetchBookings}
            />
        </>
    );
}
