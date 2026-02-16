
import { BookingsList } from "@/components/accounting/BookingsList";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarCheck } from "lucide-react";

export default function CalendarPage() {
    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Calendar</h1>
                        <p className="text-muted-foreground">Manage your appointments and schedule.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Link href="/calendar/availability">
                        <Button variant="outline">
                            <CalendarCheck className="mr-2 h-4 w-4" />
                            Manage Availability
                        </Button>
                    </Link>
                </div>
            </div>

            <BookingsList />
        </div>
    );
}
