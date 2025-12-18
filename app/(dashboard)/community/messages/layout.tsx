import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { getConversations } from "@/lib/actions/messaging.actions";
import { ConversationList } from "./_components/conversation-list";

export default async function MessagesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    const conversations = await getConversations(dbUser._id.toString());

    return (
        <div className="h-[calc(100vh-4rem)] flex bg-white rounded-xl border border-slate-200 overflow-hidden m-4 md:m-6 shadow-sm">
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0 border-r border-slate-200 h-full">
                <ConversationList conversations={conversations} currentUserId={dbUser._id.toString()} />
            </div>
            <div className="hidden md:flex flex-1 flex-col h-full bg-slate-50">
                {children}
            </div>
        </div>
    );
}
