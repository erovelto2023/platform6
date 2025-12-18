import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import Friendship from "@/lib/db/models/Friendship";
import { FriendsPageClient } from "./friends-client";

export default async function FriendsPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbUser = await User.findOne({ clerkId: user.id });
    if (!dbUser) return redirect("/");

    // Fetch Friends
    const friends = await Friendship.find({
        $or: [{ requester: dbUser._id }, { recipient: dbUser._id }],
        status: 'accepted'
    }).populate('requester recipient', 'firstName lastName avatar clerkId bio username').lean();

    const friendList = JSON.parse(JSON.stringify(friends.map((f: any) =>
        f.requester._id.toString() === dbUser._id.toString() ? f.recipient : f.requester
    )));

    // Fetch Requests
    const requests = await Friendship.find({
        recipient: dbUser._id,
        status: 'pending'
    }).populate('requester', 'firstName lastName avatar clerkId bio username').lean();

    const serializedRequests = JSON.parse(JSON.stringify(requests));

    // Fetch Sent Requests
    const sentRequests = await Friendship.find({
        requester: dbUser._id,
        status: 'pending'
    }).populate('recipient', 'firstName lastName avatar clerkId bio username').lean();

    const serializedSentRequests = JSON.parse(JSON.stringify(sentRequests));

    return (
        <FriendsPageClient
            friendList={friendList}
            serializedRequests={serializedRequests}
            serializedSentRequests={serializedSentRequests}
            currentUserId={dbUser._id.toString()}
        />
    );
}
