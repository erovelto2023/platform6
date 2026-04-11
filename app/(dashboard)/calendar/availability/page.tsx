
import { AvailabilityEditor } from "@/components/calendar/AvailabilityEditor";
import { Clock } from "lucide-react";

export default function AvailabilityPage() {
    return (
        <div className="space-y-10 animate-in fade-in duration-1000">
            <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                     <Clock size={16} className="text-cyan-500" />
                     <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600 italic leading-none">Temporal Baseline</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Session <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Availability</span>
                </h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px] mt-2 italic">
                    Configure high-priority engagement windows and recurring capacity rules.
                </p>
            </div>

            <AvailabilityEditor />
        </div>
    );
}
