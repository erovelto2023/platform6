"use client";

import { useState, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, MessageCircle, UserPlus, Share2, AtSign, Calendar, Users, CheckCheck, X, Bell } from "lucide-react";
import { getNotifications, markAsRead, markAllAsRead, deleteNotification } from "@/lib/actions/notification.actions";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";

interface NotificationListProps {
    userId: string;
    onMarkAllRead: () => void;
    onClose: () => void;
}

const notificationIcons: { [key: string]: any } = {
    like: Heart,
    comment: MessageCircle,
    reply: MessageCircle,
    mention: AtSign,
    follow: UserPlus,
    friend_request: UserPlus,
    friend_accepted: UserPlus,
    post_share: Share2,
    event_invite: Calendar,
    group_invite: Users,
    message: MessageCircle,
};

export function NotificationList({ userId, onMarkAllRead, onClose }: NotificationListProps) {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadNotifications();
    }, [userId]);

    const loadNotifications = async () => {
        setLoading(true);
        const result = await getNotifications(userId, 20);
        if (result.success && result.data) {
            setNotifications(result.data);
        }
        setLoading(false);
    };

    const handleMarkAsRead = async (notificationId: string) => {
        await markAsRead(notificationId);
        setNotifications(notifications.map(n =>
            n._id === notificationId ? { ...n, isRead: true } : n
        ));
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead(userId);
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
        onMarkAllRead();
    };

    const handleDelete = async (notificationId: string) => {
        await deleteNotification(notificationId);
        setNotifications(notifications.filter(n => n._id !== notificationId));
    };

    const handleNotificationClick = async (notification: any) => {
        if (!notification.isRead) {
            await handleMarkAsRead(notification._id);
        }
        if (notification.link) {
            onClose();
        }
    };

    return (
        <div className="flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-4 border-b flex items-center justify-between">
                <h3 className="font-semibold text-lg">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-xs"
                    >
                        <CheckCheck className="h-4 w-4 mr-1" />
                        Mark all read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-8 text-center text-slate-500">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Bell className="h-12 w-12 mx-auto mb-3 text-slate-300" />
                        <p className="font-medium">No notifications yet</p>
                        <p className="text-sm mt-1">
                            We'll notify you when something happens
                        </p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {notifications.map((notification) => {
                            const Icon = notificationIcons[notification.type] || MessageCircle;
                            const sender = notification.sender;

                            return (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-slate-50 transition cursor-pointer group ${!notification.isRead ? 'bg-indigo-50/50' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex gap-3">
                                        <Avatar className="h-10 w-10 flex-shrink-0">
                                            <AvatarImage src={sender?.profileImage} />
                                            <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                                {sender?.firstName?.[0]}{sender?.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm">
                                                    <span className="font-semibold">
                                                        {sender?.firstName} {sender?.lastName}
                                                    </span>
                                                    {' '}
                                                    <span className="text-slate-600">
                                                        {notification.content}
                                                    </span>
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-6 w-6 opacity-0 group-hover:opacity-100 transition flex-shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(notification._id);
                                                    }}
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1">
                                                <Icon className="h-3 w-3 text-slate-400" />
                                                <span className="text-xs text-slate-500">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="h-2 w-2 rounded-full bg-indigo-600"></span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </ScrollArea>

            {/* Footer */}
            {notifications.length > 0 && (
                <div className="p-3 border-t text-center">
                    <Link
                        href="/notifications"
                        className="text-sm text-indigo-600 hover:text-indigo-700 font-medium"
                        onClick={onClose}
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
}
