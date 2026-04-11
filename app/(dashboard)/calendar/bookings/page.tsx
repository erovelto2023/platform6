
import { BookingDashboard } from "@/components/calendar/BookingDashboard";
import { List } from "lucide-react";

export default function BookingsPage() {
  return (
    <div className="space-y-10 animate-in fade-in duration-1000">
      <div className="space-y-1">
          <div className="flex items-center gap-2 mb-2">
               <List size={16} className="text-cyan-500" />
               <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600 italic leading-none">Operational Queue</span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
              Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Engagements</span>
          </h1>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px] mt-2 italic">
              Orchestrate session protocols, status tracking, and temporal fulfillment.
          </p>
      </div>

      <BookingDashboard />
    </div>
  );
}
