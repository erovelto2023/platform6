"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Lock, Globe, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface GroupsTabProps {
    currentUser: any;
}

export function GroupsTab({ currentUser }: GroupsTabProps) {
    const groups = [
        {
            id: 1,
            name: "Marketing Mastery",
            description: "Share and learn marketing strategies that work",
            members: 234,
            posts: 156,
            privacy: "public",
            joined: true
        },
        {
            id: 2,
            name: "Content Creators Hub",
            description: "A community for content creators to collaborate and grow",
            members: 189,
            posts: 203,
            privacy: "public",
            joined: true
        },
        {
            id: 3,
            name: "Business Growth Strategies",
            description: "Discuss tactics and strategies for scaling your business",
            members: 312,
            posts: 278,
            privacy: "private",
            joined: false
        },
        {
            id: 4,
            name: "Social Media Success",
            description: "Tips, tricks, and best practices for social media marketing",
            members: 167,
            posts: 134,
            privacy: "public",
            joined: false
        },
    ];

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Users className="h-5 w-5 text-indigo-600" />
                        <h2 className="text-xl font-semibold">Groups</h2>
                    </div>
                    <p className="text-sm text-slate-500 mt-1">
                        Join groups to connect with like-minded members
                    </p>
                </CardHeader>
            </Card>

            <div className="grid gap-4">
                {groups.map((group) => (
                    <Card key={group.id} className="hover:shadow-md transition">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex gap-4 flex-1">
                                    <div className="flex-shrink-0">
                                        <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                                            <Users className="h-8 w-8 text-white" />
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-lg">{group.name}</h3>
                                            {group.privacy === "private" ? (
                                                <Lock className="h-4 w-4 text-slate-400" />
                                            ) : (
                                                <Globe className="h-4 w-4 text-slate-400" />
                                            )}
                                        </div>
                                        <p className="text-sm text-slate-600 mb-3">{group.description}</p>

                                        <div className="flex items-center gap-4 text-sm text-slate-500">
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                {group.members} members
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <TrendingUp className="h-4 w-4" />
                                                {group.posts} posts
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {group.joined ? (
                                <div className="flex gap-2">
                                    <Button variant="outline" className="flex-1">View Group</Button>
                                    <Button variant="ghost">Leave</Button>
                                </div>
                            ) : (
                                <Button className="w-full">
                                    {group.privacy === "private" ? "Request to Join" : "Join Group"}
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
