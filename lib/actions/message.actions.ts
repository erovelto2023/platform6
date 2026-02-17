"use server";

import connectToDatabase from "@/lib/db/connect";
import Conversation from "@/lib/db/models/Conversation";
import Message from "@/lib/db/models/Message";
import Channel from "@/lib/db/models/Channel";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification.actions";

export async function getConversations(userId: string) {
    try {
        await connectToDatabase();

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'firstName lastName email profileImage lastActiveAt')
            .populate('lastMessage')
            .sort({ lastMessageAt: -1 })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(conversations))
        };
    } catch (error) {
        console.error("[GET_CONVERSATIONS]", error);
        return {
            success: false,
            error: "Failed to fetch conversations"
        };
    }
}

export async function getOrCreateConversation(userId: string, otherUserId: string) {
    try {
        await connectToDatabase();

        // Find existing conversation
        let conversation = await Conversation.findOne({
            participants: { $all: [userId, otherUserId] },
            isGroup: false
        })
            .populate('participants', 'firstName lastName email profileImage lastActiveAt')
            .lean();

        // Create new conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, otherUserId],
                isGroup: false,
                unreadCount: {}
            });

            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'firstName lastName email profileImage lastActiveAt')
                .lean();
        }

        return {
            success: true,
            data: JSON.parse(JSON.stringify(conversation))
        };
    } catch (error) {
        console.error("[GET_OR_CREATE_CONVERSATION]", error);
        return {
            success: false,
            error: "Failed to get conversation"
        };
    }
}

export async function createGroupConversation(userId: string, participants: string[], name?: string) {
    try {
        await connectToDatabase();

        // Ensure current user is in participants
        const allParticipants = Array.from(new Set([...participants, userId]));

        if (allParticipants.length < 2) {
            return { success: false, error: "At least two participants required" };
        }

        const conversation = await Conversation.create({
            participants: allParticipants,
            isGroup: true,
            groupName: name || "",
            unreadCounts: {}
        });

        const populated = await Conversation.findById(conversation._id)
            .populate('participants', 'firstName lastName email profileImage lastActiveAt')
            .lean();

        revalidatePath("/messages");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(populated))
        };
    } catch (error) {
        console.error("[CREATE_GROUP_CONVERSATION]", error);
        return {
            success: false,
            error: "Failed to create group conversation"
        };
    }
}

export async function getMessages(conversationId: string, limit = 50) {
    try {
        await connectToDatabase();

        const messages = await Message.find({ conversationId, replyTo: { $exists: false } })
            .populate('sender', 'firstName lastName email profileImage')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(messages.reverse()))
        };
    } catch (error) {
        console.error("[GET_MESSAGES]", error);
        return {
            success: false,
            error: "Failed to fetch messages"
        };
    }
}

export async function sendMessage(data: {
    conversationId?: string;
    channelId?: string;
    senderId: string;
    content: string;
    type?: string;
    replyTo?: string;
    attachments?: string[];
}) {
    try {
        await connectToDatabase();

        // Create message
        const message = await Message.create({
            conversationId: data.conversationId,
            channelId: data.channelId,
            sender: data.senderId,
            content: data.content,
            type: data.type || 'text',
            replyTo: data.replyTo,
            attachments: data.attachments || [],
        });

        // If it's a reply, update parent
        if (data.replyTo) {
            await Message.findByIdAndUpdate(data.replyTo, {
                $inc: { replyCount: 1 },
                lastReplyAt: new Date(),
            });
        }

        // Update conversation
        const conversation = await Conversation.findByIdAndUpdate(
            data.conversationId,
            {
                lastMessage: message._id,
                lastMessageAt: new Date()
            },
            { new: true }
        );

        // Update unread count for other participants
        if (conversation) {
            const otherParticipants = conversation.participants.filter(
                (p: any) => p.toString() !== data.senderId
            );

            for (const participantId of otherParticipants) {
                const currentCount = conversation.unreadCount?.get(participantId.toString()) || 0;
                conversation.unreadCount?.set(participantId.toString(), currentCount + 1);

                // Create notification
                await createNotification({
                    recipientId: participantId.toString(),
                    senderId: data.senderId,
                    type: "message",
                    content: "sent you a message",
                    link: `/messages/${data.conversationId}`
                });
            }

            await conversation.save();
        }

        const populatedMessage = await Message.findById(message._id)
            .populate('sender', 'firstName lastName email profileImage')
            .lean();

        revalidatePath("/messages");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(populatedMessage))
        };
    } catch (error) {
        console.error("[SEND_MESSAGE]", error);
        return {
            success: false,
            error: "Failed to send message"
        };
    }
}

export async function markMessagesAsRead(conversationId: string, userId: string) {
    try {
        await connectToDatabase();

        // Mark all messages in conversation as read
        await Message.updateMany(
            {
                conversationId,
                senderId: { $ne: userId },
                isRead: false
            },
            { isRead: true, readAt: new Date() }
        );

        // Reset unread count for this user
        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
            conversation.unreadCount?.set(userId, 0);
            await conversation.save();
        }

        revalidatePath("/messages");

        return {
            success: true
        };
    } catch (error) {
        console.error("[MARK_MESSAGES_AS_READ]", error);
        return {
            success: false,
            error: "Failed to mark messages as read"
        };
    }
}

export async function deleteMessage(messageId: string, userId: string) {
    try {
        await connectToDatabase();

        const message = await Message.findById(messageId);
        if (!message) return { success: false, error: "Message not found" };

        // Only allow sender to delete
        if (message.sender.toString() !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        await Message.findByIdAndDelete(messageId);
        revalidatePath("/messages");

        return { success: true };
    } catch (error) {
        console.error("[DELETE_MESSAGE]", error);
        return { success: false, error: "Failed to delete message" };
    }
}

export async function updateMessage(messageId: string, userId: string, content: string) {
    try {
        await connectToDatabase();
        const message = await Message.findById(messageId);
        if (!message) return { success: false, error: "Message not found" };

        // Only allow sender to edit
        if (message.sender.toString() !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        message.content = content;
        message.isEdited = true;
        await message.save();

        revalidatePath("/messages");
        return { success: true, data: JSON.parse(JSON.stringify(message)) };
    } catch (error) {
        console.error("[UPDATE_MESSAGE]", error);
        return { success: false, error: "Failed to update message" };
    }
}
export async function getThreadReplies(parentMessageId: string) {
    try {
        await connectToDatabase();

        const messages = await Message.find({ replyTo: parentMessageId })
            .populate('sender', 'firstName lastName email profileImage')
            .sort({ createdAt: 1 })
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(messages))
        };
    } catch (error) {
        console.error("[GET_THREAD_REPLIES]", error);
        return {
            success: false,
            error: "Failed to fetch thread replies"
        };
    }
}

export async function toggleReaction(messageId: string, userId: string, emoji: string) {
    try {
        await connectToDatabase();
        const message = await Message.findById(messageId);
        if (!message) return { success: false, error: "Message not found" };

        const currentReaction = message.reactions?.get(userId);

        if (currentReaction === emoji) {
            // Remove if same emoji
            message.reactions.delete(userId);
        } else {
            // Add or update emoji
            message.reactions.set(userId, emoji);
        }

        await message.save();
        revalidatePath("/messages");

        return { success: true, data: JSON.parse(JSON.stringify(message)) };
    } catch (error) {
        console.error("[TOGGLE_REACTION]", error);
        return { success: false, error: "Failed to toggle reaction" };
    }
}

export async function searchMessages(query: string, userId: string) {
    try {
        if (!query.trim()) return { success: true, data: [] };
        await connectToDatabase();

        // 1. Get all channels user is member of OR are public
        const channels = await Channel.find({
            $or: [
                { members: userId },
                { isPubliclyViewable: true }
            ]
        }).select('_id');
        const channelIds = channels.map(c => c._id);

        // 2. Get all conversations user is participant in
        const conversations = await Conversation.find({
            participants: userId
        }).select('_id');
        const conversationIds = conversations.map(c => c._id);

        // 3. Search messages in accessible channels and conversations
        const messages = await Message.find({
            $and: [
                {
                    $or: [
                        { channelId: { $in: channelIds } },
                        { conversationId: { $in: conversationIds } }
                    ]
                },
                { content: { $regex: query, $options: 'i' } },
                { isDeleted: { $ne: true } }
            ]
        })
            .populate('sender', 'firstName lastName email profileImage')
            .populate('channelId', 'name')
            .populate({
                path: 'conversationId',
                populate: { path: 'participants', select: 'firstName lastName' }
            })
            .sort({ createdAt: -1 })
            .limit(20)
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(messages))
        };
    } catch (error) {
        console.error("[SEARCH_MESSAGES]", error);
        return {
            success: false,
            error: "Failed to search messages"
        };
    }
}
