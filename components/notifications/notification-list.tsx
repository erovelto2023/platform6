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
        <div className="flex flex-col h-[500px] bg-[#0f131a] text-slate-200">
            {/* Header */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
                <h3 className="font-extrabold text-sm text-white uppercase tracking-wider">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleMarkAllAsRead}
                        className="text-xs text-indigo-400 hover:text-indigo-300 hover:bg-slate-800/40"
                    >
                        <CheckCheck className="h-3.5 w-3.5 mr-1" />
                        Mark all read
                    </Button>
                )}
            </div>

            {/* Notifications List */}
            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-8 text-center text-slate-500 text-xs">
                        Loading notifications...
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">
                        <Bell className="h-10 w-10 mx-auto mb-3 text-slate-700" />
                        <p className="font-bold text-slate-300 text-xs">No notifications yet</p>
                        <p className="text-[11px] text-slate-500 mt-1">
                            We'll notify you when something happens
                        </p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-800/40">
                        {notifications.map((notification) => {
                            const Icon = notificationIcons[notification.type] || MessageCircle;
                            const sender = notification.sender;

                            return (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-slate-900/60 transition cursor-pointer group ${!notification.isRead ? 'bg-indigo-950/15' : ''
                                        }`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex gap-3">
                                        <Avatar className="h-9 w-9 flex-shrink-0 border border-slate-850">
                                            <AvatarImage src={sender?.profileImage} />
                                            <AvatarFallback className="bg-indigo-950/80 text-indigo-400 text-xs font-bold">
                                                {sender?.firstName?.[0]}{sender?.lastName?.[0]}
                                            </AvatarFallback>
                                        </Avatar>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-xs text-slate-300 leading-relaxed">
                                                    <span className="font-extrabold text-white">
                                                        {sender?.firstName} {sender?.lastName}
                                                    </span>
                                                    {' '}
                                                    <span>
                                                        {notification.content}
                                                    </span>
                                                </p>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    className="h-5 w-5 opacity-0 group-hover:opacity-100 hover:bg-slate-800 hover:text-rose-400 transition flex-shrink-0"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleDelete(notification._id);
                                                    }}
                                                >
                                                    <X className="h-3.5 w-3.5" />
                                                </Button>
                                            </div>

                                            <div className="flex items-center gap-2 mt-1.5">
                                                <Icon className="h-3 w-3 text-indigo-400" />
                                                <span className="text-[10px] text-slate-500">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </span>
                                                {!notification.isRead && (
                                                    <span className="h-1.5 w-1.5 rounded-full bg-indigo-500"></span>
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
                <div className="p-3 border-t border-slate-800/80 text-center">
                    <Link
                        href="/notifications"
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold"
                        onClick={onClose}
                    >
                        View all notifications
                    </Link>
                </div>
            )}
        </div>
    );
}
