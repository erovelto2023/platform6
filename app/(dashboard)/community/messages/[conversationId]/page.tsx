import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getConversation, getMessages, markAsRead } from "@/lib/actions/messaging.actions";
import { ChatWindow } from "../_components/chat-window";

export default async function ConversationPage({ params }: { params: Promise<{ conversationId: string }> }) {
    const { conversationId } = await params;
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const conversation = await getConversation(conversationId, dbUser._id.toString());
    if (!conversation) return redirect("/community/messages");

    // Mark as read
    await markAsRead(conversationId, dbUser._id.toString());

    const messages = await getMessages(conversationId);

    return (
        <ChatWindow
            conversation={conversation}
            currentUserId={dbUser._id.toString()}
            initialMessages={messages}
        />
    );
}
