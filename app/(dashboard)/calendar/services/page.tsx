
import { ServiceList } from "@/components/calendar/ServiceList";
import { getCalendarServices } from "@/lib/actions/calendar-service.actions";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";

export default async function ServicesPage() {
    const res = await getCalendarServices();
    const services = res.success ? res.data : [];

    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="flex justify-between items-end">
                <div className="space-y-1">
                    <h3 className="text-2xl font-black text-white uppercase tracking-tighter italic">Bookable <span className="text-indigo-400">Event</span></h3>
                    <p className="text-[10px] font-black uppercase tracking-[3px] text-zinc-500">
                        Tell people what they can book from you.
                    </p>
                </div>
                <Link href="/calendar/services/new">
                    <Button className="h-12 px-6 bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-widest text-[10px] rounded-xl shadow-xl shadow-indigo-600/20 active:scale-95 transition-all">
                        <Plus className="mr-2 h-4 w-4 stroke-[3]" /> Create Bookable Event
                    </Button>
                </Link>
            </div>
            
            <ServiceList services={services} />
        </div>
    );
}
