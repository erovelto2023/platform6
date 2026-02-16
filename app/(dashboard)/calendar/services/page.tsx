
import { ServiceList } from "@/components/calendar/ServiceList";
import { getCalendarServices } from "@/lib/actions/calendar-service.actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

export default async function ServicesPage() {
    const res = await getCalendarServices();
    const services = res.success ? res.data : [];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium">Services & Event Types</h3>
                    <p className="text-sm text-muted-foreground">
                        Manage the services that clients can book with you.
                    </p>
                </div>
                <Link href="/calendar/services/new">
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="mr-2 h-4 w-4" /> New Service
                    </Button>
                </Link>
            </div>
            <Separator />
            <ServiceList services={services} />
        </div>
    );
}
