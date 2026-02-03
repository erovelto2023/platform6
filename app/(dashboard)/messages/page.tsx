import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { MessagesPageClient } from "./_components/messages-page-client";
import { getConversations } from "@/lib/actions/message.actions";

interface MessagesPageProps {
    searchParams: Promise<{ conversationId?: string }>;
}

export default async function MessagesPage({ searchParams }: MessagesPageProps) {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbCurrentUserDoc = await User.findOne({ clerkId: user.id });
    const dbCurrentUser = JSON.parse(JSON.stringify(dbCurrentUserDoc));

    if (!dbCurrentUser) {
        return <div>User not found in database. Please contact support.</div>;
    }

    // Fetch conversations
    const { data: conversations } = await getConversations(dbCurrentUser._id);
    const params = await searchParams;

    return (
        <div className="h-[calc(100vh-4rem)]">
            <MessagesPageClient
                currentUser={dbCurrentUser}
                initialConversations={conversations || []}
                initialSelectedId={params.conversationId}
            />
        </div>
    );
}
