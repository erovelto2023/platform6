
import { getBookings } from "@/lib/actions/booking.actions";
import { CalendarClient } from "./CalendarClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CalendarOverviewPage() {
    const { data: bookings } = await getBookings();

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-xl font-semibold text-slate-900">Weekly Schedule</h2>
                    <p className="text-sm text-slate-500">Overview of your upcoming appointments.</p>
                </div>
                <Link href="/calendar/services">
                    <Button variant="outline">
                        Manage Services
                    </Button>
                </Link>
            </div>

            <CalendarClient bookings={bookings || []} />
        </div>
    );
}
