"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Share2, Clock } from "lucide-react";

interface FriendsActivityProps {
    currentUser: any;
}

export function FriendsActivity({ currentUser }: FriendsActivityProps) {
    // Mock data - replace with real data from your API
    const friendsActivities = [
        {
            id: 1,
            user: { name: "Sarah Johnson", avatar: "", initials: "SJ" },
            action: "liked",
            target: "your post about marketing strategies",
            time: "2 hours ago"
        },
        {
            id: 2,
            user: { name: "Mike Chen", avatar: "", initials: "MC" },
            action: "commented on",
            target: "Building a Profitable Business",
            time: "5 hours ago"
        },
        {
            id: 3,
            user: { name: "Emily Davis", avatar: "", initials: "ED" },
            action: "shared",
            target: "your article about content creation",
            time: "1 day ago"
        },
        {
            id: 4,
            user: { name: "James Wilson", avatar: "", initials: "JW" },
            action: "posted",
            target: "a new update in Marketing Mastery group",
            time: "2 days ago"
        },
    ];

    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <h2 className="text-xl font-semibold">Friends Activity</h2>
                    <p className="text-sm text-slate-500">See what your friends are up to</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {friendsActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                            <Avatar className="h-10 w-10">
                                <AvatarImage src={activity.user.avatar} />
                                <AvatarFallback className="bg-indigo-100 text-indigo-600">
                                    {activity.user.initials}
                                </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <p className="text-sm">
                                    <span className="font-semibold">{activity.user.name}</span>
                                    {" "}<span className="text-slate-600">{activity.action}</span>
                                    {" "}<span className="font-medium">{activity.target}</span>
                                </p>
                                <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                    <Clock className="h-3 w-3" />
                                    {activity.time}
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Friend Suggestions */}
            <Card>
                <CardHeader>
                    <h3 className="text-lg font-semibold">People You May Know</h3>
                </CardHeader>
                <CardContent className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback className="bg-purple-100 text-purple-600">
                                        U{i}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <p className="font-medium text-sm">User {i}</p>
                                    <p className="text-xs text-slate-500">3 mutual friends</p>
                                </div>
                            </div>
                            <button className="px-3 py-1 text-xs font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                                Add Friend
                            </button>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    );
}
