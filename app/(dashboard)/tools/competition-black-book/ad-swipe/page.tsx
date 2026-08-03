import { getSwipes } from "@/lib/actions/competitor-swipe.actions";
import { getCompetitors } from "@/lib/actions/competitor.actions";
import { AdSwipeClient } from "./_components/ad-swipe-client";

export default async function AdSwipeVaultPage() {
    const swipes = await getSwipes();
    const competitors = await getCompetitors();

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans selection:bg-rose-500 selection:text-slate-950">
            <AdSwipeClient initialSwipes={swipes} competitors={competitors} />
        </div>
    );
}
