import { Metadata } from "next";
import ClientWhiteboard from "./_components/client-whiteboard";

export const metadata: Metadata = {
    title: "Whiteboard | K Business Academy",
    description: "A virtual whiteboard for brainstorming and planning.",
};

export default function WhiteboardPage() {
    return <ClientWhiteboard />;
}
