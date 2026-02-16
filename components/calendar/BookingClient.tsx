
"use client";

import { useState } from "react";
import { format, parse, addMonths, subMonths } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { createBooking } from "@/lib/actions/booking.actions";
import { toast } from "sonner";
import { Loader2, ChevronLeft, ChevronRight } from "lucide-react";
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
    const [notes, setNotes] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleDateSelect = (selected: Date | undefined) => {
        if (selected) {
            setDate(selected);
            setSelectedSlot(null);
            // Update URL to fetch new slots (server component re-render)
            router.push(`/book/${serviceId}?date=${format(selected, 'yyyy-MM-dd')}`);
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

            // Constuct full start time date object
            const [hours, minutes] = selectedSlot.split(':').map(Number);
            const startTime = new Date(date);
            startTime.setHours(hours, minutes, 0, 0);

            const res = await createBooking({
                serviceId: serviceId,
                customerName: name,
                customerEmail: email,
                startTime: startTime,
                notes: notes,
            });

            if (res.success) {
                setStep("confirmation");
                toast.success("Booking confirmed!");
            } else {
                toast.error(res.error || "Failed to book");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (step === "confirmation") {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                <div className="h-16 w-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-2">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h2>
                <p className="text-slate-500 max-w-sm">
                    You meet with KBAcademy on <br />
                    <span className="font-semibold text-slate-900">{date ? format(date, 'PPPP') : ''} at {selectedSlot}</span>.
                </p>
                <p className="text-sm text-slate-400 mb-6">An invitation has been sent to {email}.</p>
                <div className="flex gap-4">
                    <Button variant="outline" onClick={() => window.location.reload()}>
                        Book Another
                    </Button>
                    <Button onClick={() => router.push('/')}>
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    if (step === "form") {
        return (
            <div className="max-w-md mx-auto h-full flex flex-col">
                <Button variant="ghost" onClick={() => setStep("time")} className="self-start mb-4 -ml-4 text-slate-500">
                    <ChevronLeft className="mr-1 h-4 w-4" /> Back to times
                </Button>

                <h2 className="text-xl font-bold text-slate-900 mb-1">Enter Details</h2>
                <p className="text-slate-500 mb-6 text-sm">Please provide your information to confirm the appointment.</p>

                <form onSubmit={handleSubmit} className="space-y-4 flex-1">
                    <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" required value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes (Optional)</Label>
                        <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
                    </div>

                    <div className="pt-4">
                        <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Schedule Event
                        </Button>
                    </div>
                </form>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Select a Date & Time</h2>
            <div className="flex flex-col md:flex-row gap-12 flex-1 pt-8">
                {/* Calendar */}
                <div className="flex justify-center md:justify-start">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={handleDateSelect}
                        className="rounded-md border shadow-sm p-4 w-full h-fit bg-white"
                        classNames={{
                            head_cell: "text-slate-500 rounded-md w-12 font-normal text-[0.8rem]",
                            cell: "h-12 w-12 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-slate-100/50 [&:has([aria-selected])]:bg-slate-100 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                            day: "h-12 w-12 p-0 font-normal aria-selected:opacity-100 ring-offset-white hover:bg-slate-100 focus:bg-slate-100 focus:text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2 aria-selected:bg-blue-600 aria-selected:text-slate-50 aria-selected:hover:bg-blue-600/90 aria-selected:focus:bg-blue-600 aria-selected:focus:text-slate-50",
                        }}
                        disabled={(date: Date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    />
                </div>

                {/* Slots */}
                <div className="flex-1 overflow-y-auto max-h-[400px] pr-2">
                    <h3 className="text-sm font-medium text-slate-500 mb-3 uppercase tracking-wide">
                        {date ? format(date, 'EEEE, MMMM do') : 'Select a date'}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {slots.length > 0 ? (
                            slots.map((slot: string) => (
                                <Button
                                    key={slot}
                                    variant="outline"
                                    className="w-full justify-center py-6 text-base font-medium hover:border-blue-600 hover:text-blue-600 transition-all"
                                    onClick={() => handleSlotSelect(slot)}
                                >
                                    {slot}
                                </Button>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                                <p className="text-slate-400">No slots available for this date.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
