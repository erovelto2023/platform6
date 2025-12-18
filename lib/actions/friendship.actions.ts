"use server";

import connectToDatabase from "@/lib/db/connect";
import Friendship from "@/lib/db/models/Friendship";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

// --- Actions ---

export async function sendFriendRequest(requesterId: string, recipientId: string) {
    await connectToDatabase();

    if (requesterId === recipientId) throw new Error("Cannot add yourself");

    // Check for existing friendship or request (in either direction)
    const existing = await Friendship.findOne({
        $or: [
            { requester: requesterId, recipient: recipientId },
            { requester: recipientId, recipient: requesterId }
        ]
    });

    if (existing) {
        if (existing.status === 'blocked') return { success: false, message: "Cannot send request" };
        if (existing.status === 'pending') return { success: false, message: "Request already pending" };
        if (existing.status === 'accepted') return { success: false, message: "Already friends" };
        // If rejected, we might allow re-sending, but for now let's say "Request was rejected"
        if (existing.status === 'rejected') {
            // Optional: Allow retry? For now, reset to pending.
            existing.status = 'pending';
            existing.requester = requesterId;
            existing.recipient = recipientId;
            await existing.save();
            revalidatePath('/community/members');
            return { success: true, message: "Friend request sent" };
        }
    }

    await Friendship.create({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    revalidatePath('/community/members');
    return { success: true, message: "Friend request sent" };
}

export async function acceptFriendRequest(requesterId: string, recipientId: string) {
    await connectToDatabase();

    const friendship = await Friendship.findOne({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    if (!friendship) throw new Error("Friend request not found");

    friendship.status = 'accepted';
    await friendship.save();

    revalidatePath('/community/members');
    revalidatePath('/community/friends');
    return { success: true };
}

export async function declineFriendRequest(requesterId: string, recipientId: string) {
    await connectToDatabase();

    const friendship = await Friendship.findOne({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    if (!friendship) throw new Error("Friend request not found");

    friendship.status = 'rejected';
    await friendship.save();

    revalidatePath('/community/members');
    revalidatePath('/community/friends');
    return { success: true };
}

export async function cancelFriendRequest(requesterId: string, recipientId: string) {
    await connectToDatabase();

    await Friendship.findOneAndDelete({
        requester: requesterId,
        recipient: recipientId,
        status: 'pending'
    });

    revalidatePath('/community/members');
    return { success: true };
}

export async function removeFriend(userId: string, friendId: string) {
    await connectToDatabase();

    await Friendship.findOneAndDelete({
        $or: [
            { requester: userId, recipient: friendId, status: 'accepted' },
            { requester: friendId, recipient: userId, status: 'accepted' }
        ]
    });

    revalidatePath('/community/members');
    revalidatePath('/community/friends');
    return { success: true };
}

export async function blockUser(blockerId: string, targetId: string) {
    await connectToDatabase();

    // Find existing relationship or create new one
    let friendship = await Friendship.findOne({
        $or: [
            { requester: blockerId, recipient: targetId },
            { requester: targetId, recipient: blockerId }
        ]
    });

    if (friendship) {
        friendship.status = 'blocked';
        friendship.blockedBy = blockerId;
        await friendship.save();
    } else {
        await Friendship.create({
            requester: blockerId,
            recipient: targetId,
            status: 'blocked',
            blockedBy: blockerId
        });
    }

    revalidatePath('/community/members');
    return { success: true };
}

export async function unblockUser(blockerId: string, targetId: string) {
    await connectToDatabase();

    await Friendship.findOneAndDelete({
        $or: [
            { requester: blockerId, recipient: targetId, status: 'blocked', blockedBy: blockerId },
            { requester: targetId, recipient: blockerId, status: 'blocked', blockedBy: blockerId }
        ]
    });

    revalidatePath('/community/members');
    return { success: true };
}

// --- Queries ---

export async function getFriendshipStatus(userId: string, targetId: string) {
    await connectToDatabase();

    const friendship = await Friendship.findOne({
        $or: [
            { requester: userId, recipient: targetId },
            { requester: targetId, recipient: userId }
        ]
    });

    if (!friendship) return 'none';

    if (friendship.status === 'blocked') {
        if (friendship.blockedBy.toString() === userId) return 'blocking';
        return 'blocked'; // Blocked by other
    }

    if (friendship.status === 'accepted') return 'friends';

    if (friendship.status === 'pending') {
        return friendship.requester.toString() === userId ? 'sent' : 'received';
    }

    return 'none';
}

export async function getFriends(userId: string) {
    await connectToDatabase();

    const friendships = await Friendship.find({
        $or: [{ requester: userId }, { recipient: userId }],
        status: 'accepted'
    }).populate('requester recipient', 'firstName lastName avatar clerkId bio username');

    return friendships.map((f: any) => {
        return f.requester._id.toString() === userId ? f.recipient : f.requester;
    });
}

export async function getMutualFriends(user1Id: string, user2Id: string) {
    await connectToDatabase();

    const [user1Friends, user2Friends] = await Promise.all([
        getFriends(user1Id),
        getFriends(user2Id)
    ]);

    const user1FriendIds = new Set(user1Friends.map((f: any) => f._id.toString()));
    const mutual = user2Friends.filter((f: any) => user1FriendIds.has(f._id.toString()));

    return mutual;
}
