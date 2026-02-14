import { checkSubscription } from "@/lib/check-subscription";
import { redirect } from "next/navigation";
import { NicheBoxesClient } from "./_components/niche-boxes-client";

export default async function NicheBoxesPage() {
    const isPro = await checkSubscription();

    if (!isPro) {
        return redirect("/upgrade");
    }

    return <NicheBoxesClient />;
}
