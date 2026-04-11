
import { getOrCreateBusiness } from "@/lib/actions/business.actions";
import { SettingsForm } from "@/components/calendar/SettingsForm";
import { Settings2 } from "lucide-react";

export default async function SettingsPage() {
    const { data: business } = await getOrCreateBusiness();

    return (
        <div className="space-y-12 animate-in fade-in duration-1000">
            <div className="space-y-1 border-b border-zinc-800/40 pb-8">
                <div className="flex items-center gap-2 mb-2">
                     <Settings2 size={16} className="text-indigo-500" />
                     <span className="text-[10px] font-black uppercase tracking-[4px] text-zinc-600 italic leading-none">Global Configurations</span>
                </div>
                <h1 className="text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
                    Operational <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500">Settings</span>
                </h1>
                <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[3px] mt-2 italic">
                    Customize your organizational booking architecture and email protocols.
                </p>
            </div>

            <SettingsForm business={business} />
        </div>
    );
}
