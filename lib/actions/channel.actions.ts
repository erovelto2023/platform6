"use server";

import connectToDatabase from "@/lib/db/connect";
import Channel from "@/lib/db/models/Channel";
import Message from "@/lib/db/models/Message";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

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

        const messages = await Message.find({ channelId })
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
}) {
    try {
        await connectToDatabase();

        const message = await Message.create({
            channelId: params.channelId,
            sender: params.senderId,
            content: params.content,
            attachments: params.attachments || [],
            readBy: [params.senderId]
        });

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
