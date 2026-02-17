import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateUser } from "@/lib/actions/user.actions";
import { SlackLayout } from "./_components/slack-layout";
import { getConversations } from "@/lib/actions/message.actions";
import { getChannels } from "@/lib/actions/channel.actions";

interface MessagesPageProps {
    searchParams: Promise<{ conversationId?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    const dbCurrentUser = await getOrCreateUser();

    if (!dbCurrentUser) {
        return <div>User not found in database. Please contact support.</div>;
    }

    // Fetch conversations and channels
    const { data: conversations } = await getConversations(dbCurrentUser._id);
    const { data: channels } = await getChannels(dbCurrentUser._id);
    const params = await searchParams;

    return (
        <SlackLayout
            currentUser={dbCurrentUser}
            initialChannels={channels || []}
            initialConversations={conversations || []}
            initialConversationId={params.conversationId}
        />
    );
}
