import { getCompetitors } from "@/lib/actions/competitor.actions";
import { getIdeas } from "@/lib/actions/idea-pipeline.actions";
import { CompetitorHubClient } from "./_components/competitor-hub-client";

export default async function CompetitionBlackBookPage() {
    const competitors = await getCompetitors();
    const ideas = await getIdeas();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-rose-500 selection:text-slate-950">
            <CompetitorHubClient initialCompetitors={competitors} initialIdeas={ideas} />
        </div>
    );
}
