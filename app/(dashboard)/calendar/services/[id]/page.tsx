
import { ServiceForm } from "@/components/calendar/ServiceForm";
import { BackButton } from "@/components/accounting/BackButton";
import { getCalendarService } from "@/lib/actions/calendar-service.actions";
import { notFound } from "next/navigation";

export default async function EditServicePage({ params }: { params: { id: string } }) {
    const res = await getCalendarService(params.id);

    if (!res.success) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <BackButton href="/calendar/services" />
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Edit Service</h1>
                    <p className="text-muted-foreground">Update your bookable event type.</p>
                </div>
            </div>

            <ServiceForm initialData={res.data} />
        </div>
    );
}
