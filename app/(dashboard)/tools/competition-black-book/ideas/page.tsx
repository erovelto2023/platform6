import { getIdeas } from "@/lib/actions/idea-pipeline.actions";
import { getCompetitors } from "@/lib/actions/competitor.actions";
import { IdeaPipelineClient } from "./_components/idea-pipeline-client";

export default async function IdeaPipelinePage() {
    const ideas = await getIdeas();
    const competitors = await getCompetitors();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-amber-500 selection:text-slate-950">
            <IdeaPipelineClient initialIdeas={ideas} competitors={competitors} />
        </div>
    );
}
