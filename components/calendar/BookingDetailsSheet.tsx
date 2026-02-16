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
import { Loader2, Calendar, Clock, User, Mail, FileText } from "lucide-react";

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
                toast.success("Booking updated");
                onOpenChange(false);
                if (onUpdate) onUpdate();
            } else {
                toast.error("Failed to update");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = async () => {
        if (!confirm("Are you sure you want to cancel this booking?")) return;
        setIsLoading(true);
        try {
            const res = await updateBooking(booking._id, { status: 'cancelled' });
            if (res.success) {
                toast.success("Booking cancelled");
                onOpenChange(false);
                if (onUpdate) onUpdate();
            }
        } catch (error) {
            toast.error("Failed to cancel");
        } finally {
            setIsLoading(false);
        }
    };

    if (!booking) return null;

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader className="mb-6">
                    <div className="flex items-center justify-between">
                        <Badge variant={status === "confirmed" ? "default" : status === "cancelled" ? "destructive" : "secondary"}>
                            {status.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground">ID: {booking._id.slice(-6)}</span>
                    </div>
                    <SheetTitle className="text-2xl mt-2">{booking.serviceId?.name || "Unknown Service"}</SheetTitle>
                    <SheetDescription>
                        View and manage booking details.
                    </SheetDescription>
                </SheetHeader>

                <div className="space-y-6">
                    {/* Time Details */}
                    <div className="flex gap-4 p-4 bg-slate-50 rounded-lg border">
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <Calendar className="w-4 h-4" /> Date
                            </div>
                            <div className="font-medium text-slate-900">
                                {format(new Date(booking.startTime), "EEEE, MMMM do, yyyy")}
                            </div>
                        </div>
                        <div className="w-px bg-slate-200" />
                        <div className="flex-1 space-y-1">
                            <div className="flex items-center text-sm text-muted-foreground gap-2">
                                <Clock className="w-4 h-4" /> Time
                            </div>
                            <div className="font-medium text-slate-900">
                                {format(new Date(booking.startTime), "h:mm a")} - {format(new Date(booking.endTime), "h:mm a")}
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Customer Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <User className="w-4 h-4" /> Customer Information
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Name</Label>
                                <div className="text-sm">{booking.customerName}</div>
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-muted-foreground">Email</Label>
                                <div className="text-sm break-all">{booking.customerEmail}</div>
                            </div>
                        </div>
                    </div>

                    <Separator />

                    {/* Reschedule Section */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-sm flex items-center gap-2">
                                <Clock className="w-4 h-4" /> Reschedule Booking
                            </h3>
                            <Button variant="ghost" size="sm" onClick={() => setIsRescheduling(!isRescheduling)}>
                                {isRescheduling ? "Cancel" : "Edit"}
                            </Button>
                        </div>

                        {isRescheduling && (
                            <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border rounded-lg">
                                <div className="space-y-2">
                                    <Label>New Date</Label>
                                    <Input
                                        type="date"
                                        value={newDate}
                                        onChange={(e) => setNewDate(e.target.value)}
                                        min={format(new Date(), 'yyyy-MM-dd')}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>New Time</Label>
                                    <Input
                                        type="time"
                                        value={newTime}
                                        onChange={(e) => setNewTime(e.target.value)}
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <Separator />

                    {/* Notes & Actions */}
                    <div className="space-y-4">
                        <h3 className="font-semibold text-sm flex items-center gap-2">
                            <FileText className="w-4 h-4" /> Service Notes
                        </h3>
                        <div className="space-y-2">
                            <Label htmlFor="notes" className="sr-only">Notes</Label>
                            <Textarea
                                id="notes"
                                placeholder="Add private notes about this booking..."
                                value={notes}
                                onChange={(e) => setNotes(e.target.value)}
                                className="min-h-[120px]"
                            />
                        </div>
                    </div>

                </div>

                <SheetFooter className="mt-8 gap-2 sm:gap-0">
                    {status !== 'cancelled' && (
                        <Button variant="destructive" onClick={handleCancel} disabled={isLoading} className="mr-auto">
                            Cancel Booking
                        </Button>
                    )}
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Close
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
