import { getCompetitors } from "@/lib/actions/competitor.actions";
import { PositioningMapClient } from "./_components/positioning-map-client";

export default async function PositioningMapPage() {
    const competitors = await getCompetitors();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-amber-500 selection:text-slate-950">
            <PositioningMapClient competitors={competitors} />
        </div>
    );
}
