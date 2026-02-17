"use server";

import connectToDatabase from "@/lib/db/connect";
import Channel from "@/lib/db/models/Channel";
import Message from "@/lib/db/models/Message";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";
import { v4 as uuidv4 } from "uuid";

// Create a new channel
export async function createChannel(params: {
    name: string;
    description?: string;
    isPrivate?: boolean;
    creatorId: string;
}) {
    try {
        await connectToDatabase();

        const channel = await Channel.create({
            name: params.name,
            description: params.description,
            isPrivate: params.isPrivate || false,
            creator: params.creatorId,
            members: [params.creatorId] // Creator is always a member
        });

        revalidatePath("/messages");
        return { success: true, data: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Error creating channel:", error);
        return { success: false, error: error.message };
    }
}

// Get all public channels + private channels the user is a member of
export async function getChannels(userId: string) {
    try {
        await connectToDatabase();

        const channels = await Channel.find({
            $or: [
                { isPrivate: false },
                { members: userId }
            ]
        }).sort({ name: 1 });

        return { success: true, data: JSON.parse(JSON.stringify(channels)) };
    } catch (error: any) {
        console.error("Error fetching channels:", error);
        return { success: false, error: error.message };
    }
}

// Get messages for a specific channel
export async function getChannelMessages(channelId: string) {
    try {
        await connectToDatabase();

        const messages = await Message.find({ channelId, replyTo: { $exists: false } })
            .populate({
                path: "sender",
                model: User,
                select: "firstName lastName profileImage username"
            })
            .sort({ createdAt: 1 }); // Oldest first for chat history

        return { success: true, data: JSON.parse(JSON.stringify(messages)) };
    } catch (error: any) {
        console.error("Error fetching channel messages:", error);
        return { success: false, error: error.message };
    }
}

// Send a message to a channel
export async function sendChannelMessage(params: {
    channelId: string;
    senderId: string;
    content: string;
    attachments?: string[];
    replyTo?: string;
}) {
    try {
        await connectToDatabase();

        const message = await Message.create({
            channelId: params.channelId,
            sender: params.senderId,
            content: params.content,
            attachments: params.attachments || [],
            replyTo: params.replyTo,
            readBy: [params.senderId]
        });

        // If it's a reply, update parent
        if (params.replyTo) {
            await Message.findByIdAndUpdate(params.replyTo, {
                $inc: { replyCount: 1 },
                lastReplyAt: new Date(),
            });
        }

        // Populate sender for immediate UI update return
        await message.populate({
            path: "sender",
            model: User,
            select: "firstName lastName profileImage username"
        });

        revalidatePath("/messages");
        return { success: true, data: JSON.parse(JSON.stringify(message)) };
    } catch (error: any) {
        console.error("Error sending channel message:", error);
        return { success: false, error: error.message };
    }
}

// Join a channel
export async function joinChannel(channelId: string, userId: string) {
    try {
        await connectToDatabase();

        const channel = await Channel.findByIdAndUpdate(
            channelId,
            { $addToSet: { members: userId } },
            { new: true }
        );

        revalidatePath("/messages");
        return { success: true, data: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Error joining channel:", error);
        return { success: false, error: error.message };
    }
}

// Get channel by invite token (public/private)
export async function getChannelByToken(token: string) {
    try {
        await connectToDatabase();
        const channel = await Channel.findOne({ shareToken: token })
            .populate('creator', 'firstName lastName profileImage')
            .populate('members', 'firstName lastName profileImage')
            .lean();

        if (!channel) return { success: false, error: "Channel not found" };

        return { success: true, data: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Error getting channel by token:", error);
        return { success: false, error: "Failed to get channel" };
    }
}

// Join channel via token
export async function joinChannelByToken(token: string, userId: string) {
    try {
        await connectToDatabase();
        const channel = await Channel.findOne({ shareToken: token });
        if (!channel) return { success: false, error: "Channel not found" };

        if (!channel.members.includes(userId)) {
            channel.members.push(userId);
            await channel.save();
        }

        revalidatePath("/messages");
        return { success: true, data: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Error joining channel:", error);
        return { success: false, error: "Failed to join channel" };
    }
}

// Generate share token
export async function generateChannelInvite(channelId: string, userId: string) {
    try {
        await connectToDatabase();
        const channel = await Channel.findById(channelId);

        if (!channel) return { success: false, error: "Channel not found" };

        // Ensure user is authorized
        if (!channel.members.includes(userId) && channel.creator?.toString() !== userId) {
            return { success: false, error: "Unauthorized" };
        }

        // Generate token if not exists
        if (!channel.shareToken) {
            channel.shareToken = uuidv4();
            await channel.save();
        }

        return { success: true, token: channel.shareToken };
    } catch (error: any) {
        console.error("Error generating invite:", error);
        return { success: false, error: "Failed to generate invite" };
    }
}
export async function toggleChannelPublicView(channelId: string, userId: string, isPublic: boolean) {
    try {
        await connectToDatabase();
        const channel = await Channel.findById(channelId);

        if (!channel) return { success: false, error: "Channel not found" };
        if (channel.creator?.toString() !== userId) return { success: false, error: "Unauthorized" };

        channel.isPubliclyViewable = isPublic;
        await channel.save();

        revalidatePath("/messages");
        return { success: true, data: JSON.parse(JSON.stringify(channel)) };
    } catch (error: any) {
        console.error("Error toggling public view:", error);
        return { success: false, error: error.message };
    }
}
