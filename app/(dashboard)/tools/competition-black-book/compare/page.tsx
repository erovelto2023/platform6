import { getCompetitors } from "@/lib/actions/competitor.actions";
import { getIdeas } from "@/lib/actions/idea-pipeline.actions";
import { CompetitorCompareClient } from "./_components/competitor-compare-client";

export default async function CompetitorComparePage() {
    const competitors = await getCompetitors();
    const ideas = await getIdeas();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-rose-500 selection:text-slate-950">
            <CompetitorCompareClient competitors={competitors} ideas={ideas} />
        </div>
    );
}
