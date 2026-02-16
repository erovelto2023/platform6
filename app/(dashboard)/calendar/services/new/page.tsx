
import { ServiceForm } from "@/components/calendar/ServiceForm";
import { BackButton } from "@/components/accounting/BackButton";

export default function NewServicePage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <BackButton href="/calendar/services" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">New Service</h1>
                    <p className="text-muted-foreground">Create a new bookable event type.</p>
                </div>
            </div>

            <ServiceForm />
        </div>
    );
}
