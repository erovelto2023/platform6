import { checkSubscription } from "@/lib/check-subscription";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function ToolsLayout({
    children,
}: {
    children: ReactNode;
}) {
    const isPro = await checkSubscription();

    if (!isPro) {
        // Redirect to the pricing section (or a specific upgrade page)
        redirect("/upgrade");
    }

    return <>{children}</>;
}
