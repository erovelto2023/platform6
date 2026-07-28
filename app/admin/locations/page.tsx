import { Metadata } from "next";
import { getStates } from "@/lib/actions/location.actions";
import { LocationEditorClient } from "./_components/location-editor-client";
import { MapPin, Sparkles } from "lucide-react";

export const metadata: Metadata = {
  title: "State & Location Facts Admin Editor | K Business Academy",
  description: "Manage official state symbols, topography, elevations, government URLs, and custom facts.",
};

export default async function AdminLocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string }>;
}) {
  const { state: stateParam } = await searchParams;
  const { states } = await getStates();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono font-bold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" /> Platform6 Admin Suite
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-100 uppercase tracking-tight">
            State & Location Facts Manager
          </h1>
          <p className="text-sm text-slate-400 font-medium mt-1">
            Override or add state facts, symbols, elevations, and official government portal URLs stored in MongoDB.
          </p>
        </div>
      </div>

      {/* Editor Component */}
      <LocationEditorClient 
        initialStates={states || []} 
        defaultStateSlug={stateParam} 
      />
    </div>
  );
}
