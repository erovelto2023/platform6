"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserPlus, Bookmark, Home, TrendingUp, Trophy, Sparkles, BookOpen, Crown, Flame, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCommunityPhotos } from "@/lib/actions/community.actions";

interface CommunitySidebarProps {
    user: any;
    onTabChange?: (tab: string) => void;
    activeTab?: string;
    trendingTopics?: any[];
    leaderboard?: any[];
    onTagSelect?: (tag: string | null) => void;
    activeTag?: string | null;
}

const LEVEL_NAMES = [
    "Novice",             // Level 1
    "Rising Star",        // Level 2
    "Innovator",          // Level 3
    "Creator",            // Level 4
    "Expert",             // Level 5
    "Leader",             // Level 6
    "Master",             // Level 7
    "Legend",             // Level 8
    "Antigravity Master"  // Level 9
];

const LEVEL_THRESHOLDS = [0, 100, 250, 500, 1000, 2000, 5000, 10000, 25000];

export function CommunitySidebar({ 
    user, 
    onTabChange, 
    activeTab, 
    trendingTopics = [], 
    leaderboard = [],
    onTagSelect,
    activeTag
}: CommunitySidebarProps) {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!user) return;
            try {
                const userId = user._id || user.id;
                if (userId) {
                    const res = await getCommunityPhotos(userId);
                    setPhotos(res);
                }
            } catch (error) {
                console.error("Error fetching photos:", error);
            } finally {
                setLoadingPhotos(false);
            }
        };

        fetchPhotos();
    }, [user]);

    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;
    const nextLevelXp = LEVEL_THRESHOLDS[Math.min(currentLevel, LEVEL_THRESHOLDS.length - 1)] || 50000;
    const prevLevelXp = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
    
    const xpInThisLevel = currentXp - prevLevelXp;
    const xpRequiredForNextLevel = nextLevelXp - prevLevelXp;
    const progressPercentage = Math.min(100, Math.max(0, (xpInThisLevel / xpRequiredForNextLevel) * 100));
    
    const levelName = LEVEL_NAMES[Math.min(currentLevel, LEVEL_NAMES.length) - 1] || "Novice";

    const menuItems: { id: string; label: string; icon: any; redirect?: string }[] = [
        { id: "feed", label: "News Feed", icon: Home },
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "friends", label: "Friends", icon: Users },
        { id: "members", label: "Find Members", icon: UserPlus },
        { id: "groups", label: "Groups", icon: Users },
        { id: "saved", label: "Saved", icon: Bookmark },
    ];

    const handleNavigation = (item: typeof menuItems[0]) => {
        if (item.redirect) {
            router.push(item.redirect);
            return;
        }

        if (onTabChange) {
            onTabChange(item.id);
        } else {
            switch (item.id) {
                case 'members':
                    router.push('/community/members');
                    break;
                case 'groups':
                    router.push('/community/groups');
                    break;
                default:
                    router.push('/community');
            }
        }
    };

    return (
        <div className="space-y-6 text-slate-100">
            {/* Gamification Level Card */}
            <Card className="overflow-hidden border border-slate-800 bg-slate-900 text-slate-100 shadow-xl relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 text-orange-400">
                    <Crown size={120} />
                </div>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-orange-500/20 border border-orange-500/30 flex items-center justify-center text-amber-400 font-bold font-mono text-xs">
                            Lvl {currentLevel}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-bold tracking-wide text-slate-100 text-sm">Level {currentLevel}: {levelName}</span>
                                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                            </div>
                            <p className="text-xs font-mono text-slate-400">Gamified Community Rank</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-mono text-slate-300">
                            <span>{currentXp} / {nextLevelXp} XP</span>
                            <span className="text-amber-400 font-bold">{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 border border-slate-800 overflow-hidden p-[1px]">
                            <div 
                                className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Streak / Stats */}
                    <div className="pt-3 border-t border-slate-800 grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-0.5">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block">Total Points</span>
                            <span className="text-base font-bold font-mono text-amber-400">{user.points || 0}</span>
                        </div>
                        <div className="space-y-0.5 border-l border-slate-800">
                            <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold flex items-center justify-center gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                Active Streak
                            </span>
                            <span className="text-base font-bold font-mono text-slate-100">3 Days</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="border border-slate-800 bg-slate-900 shadow-xl">
                <CardContent className="p-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 text-xs font-mono font-bold rounded-xl cursor-pointer transition ${isActive
                                    ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon className={`h-4 w-4 ${isActive ? 'text-orange-400' : 'text-slate-400'}`} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <div className="h-2 w-2 rounded-full bg-orange-400" />}
                            </button>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Skool Leaderboard Preview Widget */}
            <Card className="border border-slate-800 bg-slate-900 shadow-xl">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-400" />
                        Weekly Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                    {leaderboard.slice(0, 3).map((lead, idx) => {
                        const rankColors = ["text-amber-400", "text-slate-300", "text-amber-600"];
                        return (
                            <div key={lead.clerkId || idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <span className={`font-mono font-bold text-xs ${rankColors[idx] || "text-slate-400"}`}>
                                        #{idx + 1}
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <div className="h-7 w-7 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs text-orange-400 font-bold">
                                            {lead.firstName?.[0] || "U"}
                                        </div>
                                        <div>
                                            <span className="text-xs font-bold text-slate-200 group-hover:text-amber-300 transition-colors block leading-tight">
                                                {lead.firstName} {lead.lastName}
                                            </span>
                                            <span className="text-[10px] font-mono text-slate-400 block">
                                                Lvl {lead.level || 1} • {lead.xp || 0} XP
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    <button
                        onClick={() => onTabChange && onTabChange("leaderboard")}
                        className="w-full text-center py-2 text-xs font-mono font-bold text-orange-400 hover:text-amber-300 transition cursor-pointer flex items-center justify-center gap-1 border-t border-slate-800/80 pt-3"
                    >
                        <span>View Full Leaderboard</span>
                        <ChevronRight size={14} />
                    </button>
                </CardContent>
            </Card>
        </div>
    );
}
