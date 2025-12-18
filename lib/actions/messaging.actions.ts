"use server";

import connectToDatabase from "@/lib/db/connect";
import Conversation from "@/lib/db/models/Conversation";
import Message from "@/lib/db/models/Message";
import User from "@/lib/db/models/User";
import Friendship from "@/lib/db/models/Friendship";
import { revalidatePath } from "next/cache";

// --- Conversation Actions ---

export async function getConversations(userId: string) {
    await connectToDatabase();

    const conversations = await Conversation.find({
        participants: userId,
        archivedBy: { $ne: userId }
    })
        .sort({ lastMessageAt: -1 })
        .populate('participants', 'firstName lastName avatar clerkId username')
        .populate('lastMessage')
        .lean();

    // Filter out self from participants for display logic
    const formatted = conversations.map((conv: any) => {
        const otherParticipants = conv.participants.filter((p: any) => p._id.toString() !== userId);
        const name = conv.isGroup ? conv.groupName : `${otherParticipants[0]?.firstName} ${otherParticipants[0]?.lastName}`;
        const image = conv.isGroup ? conv.groupImage : (otherParticipants[0]?.avatar || otherParticipants[0]?.imageUrl);

        return {
            ...conv,
            displayName: name,
            displayImage: image,
            otherParticipants,
            unreadCount: conv.unreadCounts?.[userId] || 0
        };
    });

    return JSON.parse(JSON.stringify(formatted));
}

export async function getConversation(conversationId: string, userId: string) {
    await connectToDatabase();

    const conversation = await Conversation.findById(conversationId)
        .populate('participants', 'firstName lastName avatar clerkId username')
        .lean();

    if (!conversation) return null;

    // Security check
    const isParticipant = conversation.participants.some((p: any) => p._id.toString() === userId);
    if (!isParticipant) throw new Error("Unauthorized");

    return JSON.parse(JSON.stringify(conversation));
}

export async function createConversation(userId: string, participantIds: string[]) {
    await connectToDatabase();

    // For 1-on-1, check if exists
    if (participantIds.length === 1) {
        const existing = await Conversation.findOne({
            participants: { $all: [userId, ...participantIds], $size: 2 },
            isGroup: false
        });

        if (existing) return JSON.parse(JSON.stringify(existing));
    }

    // Create new
    const conversation = await Conversation.create({
        participants: [userId, ...participantIds],
        isGroup: participantIds.length > 1,
        admins: [userId],
        unreadCounts: {}
    });

    revalidatePath('/community/messages');
    return JSON.parse(JSON.stringify(conversation));
}

// --- Message Actions ---

export async function getMessages(conversationId: string, limit = 50, skip = 0) {
    await connectToDatabase();

    const messages = await Message.find({ conversationId })
        .sort({ createdAt: -1 }) // Newest first for pagination, then reverse in UI
        .skip(skip)
        .limit(limit)
        .populate('sender', 'firstName lastName avatar clerkId username')
        .populate('replyTo')
        .lean();

    return JSON.parse(JSON.stringify(messages.reverse()));
}

export async function sendMessage(data: {
    conversationId: string;
    senderId: string;
    content: string;
    type?: string;
    attachments?: string[];
    replyTo?: string;
}) {
    await connectToDatabase();

    const { conversationId, senderId, content, type = 'text', attachments = [], replyTo } = data;

    // Verify membership
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) throw new Error("Conversation not found");
    if (!conversation.participants.includes(senderId)) throw new Error("Unauthorized");

    // Create message
    const message = await Message.create({
        conversationId,
        sender: senderId,
        content,
        type,
        attachments,
        replyTo,
        readBy: [senderId]
    });

    // Update conversation
    const unreadUpdates: any = {};
    conversation.participants.forEach((p: any) => {
        if (p.toString() !== senderId) {
            unreadUpdates[`unreadCounts.${p}`] = (conversation.unreadCounts?.get(p.toString()) || 0) + 1;
        }
    });

    await Conversation.findByIdAndUpdate(conversationId, {
        lastMessage: message._id,
        lastMessageAt: new Date(),
        $inc: unreadUpdates
    });

    revalidatePath(`/community/messages/${conversationId}`);
    revalidatePath('/community/messages');

    return JSON.parse(JSON.stringify(message));
}

export async function markAsRead(conversationId: string, userId: string) {
    await connectToDatabase();

    await Conversation.findByIdAndUpdate(conversationId, {
        [`unreadCounts.${userId}`]: 0
    });

    // Also update messages? Ideally yes, but expensive. 
    // Usually we just track "last read timestamp" per user in conversation, 
    // but for now unreadCounts on conversation is sufficient for the badge.

    revalidatePath('/community/messages');
    return { success: true };
}

export async function startConversation(userId: string, participantId: string) {
    const conversation = await createConversation(userId, [participantId]);
    return conversation._id;
}
