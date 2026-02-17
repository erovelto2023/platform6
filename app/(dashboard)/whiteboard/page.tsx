import { Metadata } from "next";
import ClientWhiteboard from "./_components/client-whiteboard";

export const metadata: Metadata = {
    title: "Whiteboard | K Business Academy",
    description: "A virtual whiteboard for brainstorming and planning.",
};

import { getLibraryItems } from "@/lib/actions/whiteboard.actions";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

export default async function WhiteboardPage() {
    const libraryItems = await getLibraryItems();
    const businessResult = await getOrCreateBusiness();
    const businessId = businessResult.data?._id || "default";

    return <ClientWhiteboard libraryItems={libraryItems} businessId={businessId} />;
}
