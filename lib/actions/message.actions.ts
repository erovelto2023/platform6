"use server";

import connectToDatabase from "@/lib/db/connect";
import Conversation from "@/lib/db/models/Conversation";
import Message from "@/lib/db/models/Message";
import { revalidatePath } from "next/cache";
import { createNotification } from "./notification.actions";

export async function getConversations(userId: string) {
    try {
        await connectToDatabase();

        const conversations = await Conversation.find({
            participants: userId
        })
            .populate('participants', 'firstName lastName email profileImage')
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
            .populate('participants', 'firstName lastName email profileImage')
            .lean();

        // Create new conversation if it doesn't exist
        if (!conversation) {
            conversation = await Conversation.create({
                participants: [userId, otherUserId],
                isGroup: false,
                unreadCount: {}
            });

            conversation = await Conversation.findById(conversation._id)
                .populate('participants', 'firstName lastName email profileImage')
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

export async function getMessages(conversationId: string, limit = 50) {
    try {
        await connectToDatabase();

        const messages = await Message.find({ conversationId })
            .populate('senderId', 'firstName lastName email profileImage')
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
    conversationId: string;
    senderId: string;
    content: string;
    type?: string;
}) {
    try {
        await connectToDatabase();

        // Create message
        const message = await Message.create({
            conversationId: data.conversationId,
            senderId: data.senderId,
            content: data.content,
            type: data.type || 'text',
            isRead: false
        });

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
            .populate('senderId', 'firstName lastName email profileImage')
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

        if (!message) {
            return {
                success: false,
                error: "Message not found"
            };
        }

        // Only allow sender to delete
        if (message.senderId.toString() !== userId) {
            return {
                success: false,
                error: "Unauthorized"
            };
        }

        await Message.findByIdAndDelete(messageId);

        revalidatePath("/messages");

        return {
            success: true
        };
    } catch (error) {
        console.error("[DELETE_MESSAGE]", error);
        return {
            success: false,
            error: "Failed to delete message"
        };
    }
}
