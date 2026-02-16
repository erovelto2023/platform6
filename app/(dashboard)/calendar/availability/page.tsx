
import { AvailabilitySettings } from "@/components/accounting/AvailabilitySettings";
import { BackButton } from "@/components/accounting/BackButton";

export default function AvailabilityPage() {
    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4">
                <BackButton href="/calendar" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Availability</h1>
                    <p className="text-muted-foreground">Set your weekly working hours for bookings.</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <AvailabilitySettings />
            </div>
        </div>
    );
}
