"use server";

import connectToDatabase from "@/lib/db/connect";
import Notification from "@/lib/db/models/Notification";
import User from "@/lib/db/models/User";
import { revalidatePath } from "next/cache";

export async function getNotifications(userId: string, limit = 20) {
    try {
        await connectToDatabase();

        const notifications = await Notification.find({ recipient: userId })
            .populate('sender', 'firstName lastName email profileImage')
            .sort({ createdAt: -1 })
            .limit(limit)
            .lean();

        return {
            success: true,
            data: JSON.parse(JSON.stringify(notifications))
        };
    } catch (error) {
        console.error("[GET_NOTIFICATIONS]", error);
        return {
            success: false,
            error: "Failed to fetch notifications"
        };
    }
}

export async function getUnreadCount(userId: string) {
    try {
        await connectToDatabase();

        const count = await Notification.countDocuments({
            recipient: userId,
            isRead: false
        });

        return {
            success: true,
            count
        };
    } catch (error) {
        console.error("[GET_UNREAD_COUNT]", error);
        return {
            success: false,
            count: 0
        };
    }
}

export async function markAsRead(notificationId: string) {
    try {
        await connectToDatabase();

        await Notification.findByIdAndUpdate(notificationId, {
            isRead: true,
            readAt: new Date()
        });

        revalidatePath("/community");

        return {
            success: true
        };
    } catch (error) {
        console.error("[MARK_AS_READ]", error);
        return {
            success: false,
            error: "Failed to mark notification as read"
        };
    }
}

export async function markAllAsRead(userId: string) {
    try {
        await connectToDatabase();

        await Notification.updateMany(
            { recipient: userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        revalidatePath("/community");

        return {
            success: true
        };
    } catch (error) {
        console.error("[MARK_ALL_AS_READ]", error);
        return {
            success: false,
            error: "Failed to mark all notifications as read"
        };
    }
}

export async function createNotification(data: {
    recipientId: string;
    senderId: string;
    type: string;
    content: string;
    link?: string;
    relatedId?: string;
}) {
    try {
        await connectToDatabase();

        const notification = await Notification.create({
            recipient: data.recipientId,
            sender: data.senderId,
            type: data.type,
            content: data.content,
            link: data.link,
            relatedId: data.relatedId
        });

        revalidatePath("/community");

        return {
            success: true,
            data: JSON.parse(JSON.stringify(notification))
        };
    } catch (error) {
        console.error("[CREATE_NOTIFICATION]", error);
        return {
            success: false,
            error: "Failed to create notification"
        };
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        await connectToDatabase();

        await Notification.findByIdAndDelete(notificationId);

        revalidatePath("/community");

        return {
            success: true
        };
    } catch (error) {
        console.error("[DELETE_NOTIFICATION]", error);
        return {
            success: false,
            error: "Failed to delete notification"
        };
    }
}
