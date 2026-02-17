import { Metadata } from "next";
import ClientWhiteboard from "./_components/client-whiteboard";

export const metadata: Metadata = {
    title: "Whiteboard | K Business Academy",
    description: "A virtual whiteboard for brainstorming and planning.",
};

import { getLibraryItems } from "@/lib/actions/whiteboard.actions";

export default async function WhiteboardPage() {
    const libraryItems = await getLibraryItems();
    return <ClientWhiteboard libraryItems={libraryItems} />;
}
