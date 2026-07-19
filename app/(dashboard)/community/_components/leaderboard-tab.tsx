"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Star, Crown, ArrowUpRight, Flame, Sparkles } from "lucide-react";
import Link from "next/link";

interface LeaderboardTabProps {
    leaderboard: any[];
}

export function LeaderboardTab({ leaderboard }: LeaderboardTabProps) {
    const [timeframe, setTimeframe] = useState<"week" | "month" | "all">("all");

    // Levels naming for badge display
    const LEVEL_NAMES = [
        "Novice", "Rising Star", "Innovator", "Creator", "Expert", "Leader", "Master", "Legend", "Antigravity Master"
    ];

    const getLevelName = (lvl: number) => {
        return LEVEL_NAMES[Math.min(lvl, LEVEL_NAMES.length) - 1] || "Novice";
    };

    return (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            {/* Header / Intro Card */}
            <Card className="border border-indigo-100 bg-gradient-to-r from-indigo-50 via-white to-purple-50">
                <CardContent className="p-6 flex flex-col md:flex-row items-center gap-6">
                    <div className="h-16 w-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                        <Trophy className="h-8 w-8" />
                    </div>
                    <div className="space-y-1 text-center md:text-left">
                        <h2 className="text-xl font-bold text-slate-800 flex items-center justify-center md:justify-start gap-2">
                            Community Leaderboard
                            <Sparkles className="h-5 w-5 text-amber-500 animate-bounce" />
                        </h2>
                        <p className="text-sm text-slate-500 max-w-xl">
                            Earning likes on your posts and comments earns you experience points (XP). Level up to show off your expertise and unlock special achievements!
                        </p>
                    </div>
                </CardContent>
            </Card>

            {/* Timeframe Filter Options */}
            <div className="flex justify-between items-center bg-white p-2.5 rounded-xl border border-slate-100 shadow-sm">
                <span className="text-sm font-semibold text-slate-700 ml-2">Top Members Ranking</span>
                <div className="flex gap-1.5">
                    {(["week", "month", "all"] as const).map((t) => (
                        <button
                            key={t}
                            onClick={() => setTimeframe(t)}
                            className={`px-4 py-1.5 text-xs font-semibold rounded-lg cursor-pointer transition ${
                                timeframe === t
                                    ? "bg-indigo-600 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-50"
                            }`}
                        >
                            {t === "week" ? "Active (7d)" : t === "month" ? "Active (30d)" : "All Time"}
                        </button>
                    ))}
                </div>
            </div>

            {/* Leaderboard Table List */}
            <Card className="border border-slate-100 shadow-sm overflow-hidden">
                <div className="divide-y divide-slate-100">
                    {leaderboard.length > 0 ? (
                        leaderboard.map((member, index) => {
                            const isTop3 = index < 3;
                            const rankIcons = [
                                <Crown className="h-5 w-5 text-amber-500" />,
                                <Crown className="h-5 w-5 text-slate-400" />,
                                <Crown className="h-5 w-5 text-amber-700" />
                            ];
                            const rankBg = [
                                "bg-amber-50 border-amber-200 text-amber-800",
                                "bg-slate-50 border-slate-200 text-slate-800",
                                "bg-orange-50/50 border-orange-100 text-orange-800"
                            ];

                            return (
                                <div 
                                    key={member.clerkId || index}
                                    className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-slate-50/60 ${
                                        index === 0 ? "bg-indigo-50/10" : ""
                                    }`}
                                >
                                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                                        {/* Rank Badge */}
                                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-sm border shadow-sm ${
                                            isTop3 ? rankBg[index] : "bg-white border-slate-100 text-slate-500"
                                        }`}>
                                            {isTop3 ? rankIcons[index] : index + 1}
                                        </div>

                                        {/* Avatar */}
                                        <div className="relative flex-shrink-0">
                                            {member.avatar ? (
                                                <img 
                                                    src={member.avatar} 
                                                    alt={`${member.firstName} avatar`} 
                                                    className="h-12 w-12 rounded-full object-cover border border-slate-200/80 shadow-sm"
                                                />
                                            ) : (
                                                <div className="h-12 w-12 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center font-bold">
                                                    {member.firstName?.[0] || "?"}
                                                </div>
                                            )}
                                        </div>

                                        {/* User Details */}
                                        <div className="min-w-0 flex-1">
                                            <div className="flex items-center gap-2">
                                                <Link 
                                                    href={`/community/profile/${member._id}`}
                                                    className="font-bold text-slate-800 hover:text-indigo-600 transition flex items-center gap-1 group text-sm sm:text-base"
                                                >
                                                    {member.firstName} {member.lastName}
                                                    <ArrowUpRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition text-indigo-500" />
                                                </Link>
                                                <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-50 text-indigo-600 rounded-full border border-indigo-100/50">
                                                    Level {member.level || 1}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-400 truncate mt-0.5">
                                                {member.bio || `Level ${member.level || 1} ${getLevelName(member.level || 1)}`}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stats (XP & Flame Points) */}
                                    <div className="flex items-center justify-between sm:justify-end gap-6 sm:text-right border-t sm:border-t-0 border-slate-100/50 pt-2 sm:pt-0">
                                        <div className="sm:text-right">
                                            <span className="text-xs text-slate-400 block uppercase tracking-wider text-[10px] font-medium">Community Level</span>
                                            <span className="text-xs font-bold text-indigo-600/90">{getLevelName(member.level || 1)}</span>
                                        </div>
                                        <div className="text-right bg-slate-50 border border-slate-100 px-3 py-1 rounded-lg">
                                            <span className="text-sm font-black text-slate-700">{member.points || member.xp || 0}</span>
                                            <span className="text-[10px] font-semibold text-slate-400 ml-1">XP</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="p-8 text-center text-slate-400">
                            No users have earned points yet. Be the first to post!
                        </div>
                    )}
                </div>
            </Card>
        </div>
    );
}
