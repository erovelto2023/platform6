import { getCompetitor } from "@/lib/actions/competitor.actions";
import { getIdeas } from "@/lib/actions/idea-pipeline.actions";
import { notFound } from "next/navigation";
import { CompetitorDashboardClient } from "./_components/competitor-dashboard-client";

interface CompetitorPageProps {
    params: Promise<{ id: string }>;
}

export default async function CompetitorPage({ params }: CompetitorPageProps) {
    const { id } = await params;
    const competitor = await getCompetitor(id);

    if (!competitor) {
        return notFound();
    }

    const competitorIdeas = await getIdeas(id);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-rose-500 selection:text-slate-950">
            <CompetitorDashboardClient competitor={competitor} initialIdeas={competitorIdeas} />
        </div>
    );
}
