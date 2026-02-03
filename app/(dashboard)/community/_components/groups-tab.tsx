"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Users, Lock, Globe, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getGroupsWithMembership, joinGroup } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import Link from "next/link";

interface GroupsTabProps {
    currentUser: any;
}

export function GroupsTab({ currentUser }: GroupsTabProps) {
    const [groups, setGroups] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState<string | null>(null);

    useEffect(() => {
        const fetchGroups = async () => {
            if (!currentUser) return;
            try {
                const res = await getGroupsWithMembership(currentUser._id);
                setGroups(res);
            } catch (error) {
                console.error("Failed to fetch groups", error);
            } finally {
                setLoading(false);
            }
        };
        fetchGroups();
    }, [currentUser]);

    const handleJoin = async (groupId: string) => {
        setJoining(groupId);
        try {
            const res = await joinGroup(groupId, currentUser._id);
            if (res.success) {
                toast.success("Joined group!");
                setGroups(prev => prev.map(g =>
                    g._id === groupId ? { ...g, joined: true, memberCount: (g.memberCount || 0) + 1 } : g
                ));
            } else {
                toast.error(res.message || "Failed to join");
            }
        } catch (error) {
            toast.error("Error joining group");
        } finally {
            setJoining(null);
        }
    };

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

            {loading ? (
                <div className="flex justify-center py-10">
                    <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
                </div>
            ) : groups.length > 0 ? (
                <div className="grid gap-4">
                    {groups.map((group) => (
                        <Card key={group._id} className="hover:shadow-md transition">
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
                                                {group.type === "Private" ? (
                                                    <Lock className="h-4 w-4 text-slate-400" />
                                                ) : (
                                                    <Globe className="h-4 w-4 text-slate-400" />
                                                )}
                                            </div>
                                            <p className="text-sm text-slate-600 mb-3 line-clamp-2">{group.description}</p>

                                            <div className="flex items-center gap-4 text-sm text-slate-500">
                                                <div className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {group.memberCount || 1} members
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <TrendingUp className="h-4 w-4" />
                                                    {group.threadCount || 0} posts
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {group.joined ? (
                                    <div className="flex gap-2">
                                        <Link href={`/community/groups/${group.slug}`} className="flex-1">
                                            <Button variant="outline" className="w-full">View Group</Button>
                                        </Link>
                                        {/* <Button variant="ghost">Leave</Button> */}
                                    </div>
                                ) : (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleJoin(group._id)}
                                        disabled={joining === group._id}
                                    >
                                        {joining === group._id && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                                        {group.type === "Private" ? "Request to Join" : "Join Group"}
                                    </Button>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-slate-500">
                    No active groups found.
                </div>
            )}
        </div>
    );
}
