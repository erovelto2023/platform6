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

    // Calculate level progression
    const currentXp = user.xp || 0;
    const currentLevel = user.level || 1;
    const nextLevelXp = LEVEL_THRESHOLDS[Math.min(currentLevel, LEVEL_THRESHOLDS.length - 1)] || 50000;
    const prevLevelXp = LEVEL_THRESHOLDS[currentLevel - 1] || 0;
    
    const xpInThisLevel = currentXp - prevLevelXp;
    const xpRequiredForNextLevel = nextLevelXp - prevLevelXp;
    const progressPercentage = Math.min(100, Math.max(0, (xpInThisLevel / xpRequiredForNextLevel) * 100));
    
    const levelName = LEVEL_NAMES[Math.min(currentLevel, LEVEL_NAMES.length) - 1] || "Novice";

    const menuItems = [
        { id: "feed", label: "News Feed", icon: Home },
        { id: "leaderboard", label: "Leaderboard", icon: Trophy },
        { id: "classroom", label: "Classroom", icon: BookOpen, redirect: "/courses" },
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
        <div className="space-y-6">
            {/* Gamification Level Card (Skool style) */}
            <Card className="overflow-hidden border border-indigo-100 bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white shadow-md relative group">
                <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 group-hover:rotate-0 transition-transform duration-700 text-indigo-400">
                    <Crown size={120} />
                </div>
                <CardContent className="p-5 space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-bold">
                            Lvl {currentLevel}
                        </div>
                        <div>
                            <div className="flex items-center gap-1.5">
                                <span className="font-semibold tracking-wide text-indigo-100">Level {currentLevel}: {levelName}</span>
                                <Sparkles className="h-4 w-4 text-amber-400 animate-pulse" />
                            </div>
                            <p className="text-xs text-indigo-300/80">Gamified Community Rank</p>
                        </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-indigo-200">
                            <span>{currentXp} / {nextLevelXp} XP</span>
                            <span>{Math.round(progressPercentage)}%</span>
                        </div>
                        <div className="w-full bg-indigo-950/80 rounded-full h-2 border border-indigo-900/50 overflow-hidden p-[1px]">
                            <div 
                                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500"
                                style={{ width: `${progressPercentage}%` }}
                            />
                        </div>
                    </div>

                    {/* Streak / Stats */}
                    <div className="pt-2 border-t border-indigo-900/50 grid grid-cols-2 gap-4 text-center">
                        <div className="space-y-0.5">
                            <span className="text-[10px] uppercase tracking-wider text-indigo-300/60 font-semibold block">Total Points</span>
                            <span className="text-base font-bold text-indigo-200">{user.points || 0}</span>
                        </div>
                        <div className="space-y-0.5 border-l border-indigo-900/50">
                            <span className="text-[10px] uppercase tracking-wider text-indigo-300/60 font-semibold flex items-center justify-center gap-1">
                                <Flame className="h-3 w-3 text-orange-500" />
                                Active Streak
                            </span>
                            <span className="text-base font-bold text-indigo-200">3 Days</span>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Navigation Menu */}
            <Card className="border border-slate-100 shadow-sm">
                <CardContent className="p-3 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item)}
                                className={`w-full flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg cursor-pointer transition ${isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                    }`}
                            >
                                <div className="flex items-center gap-2.5">
                                    <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <div className="h-1.5 w-1.5 rounded-full bg-indigo-600" />}
                            </button>
                        );
                    })}
                </CardContent>
            </Card>

            {/* Fleshed Out Trending Topics (Skool Hashtag Filter) */}
            <Card className="border border-slate-100 shadow-sm">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <TrendingUp className="h-4 w-4 text-indigo-500" />
                        Trending Topics
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-2">
                    {trendingTopics.length > 0 ? (
                        <div className="flex flex-wrap gap-1.5">
                            {trendingTopics.map((topic) => {
                                const isSelected = activeTag?.toLowerCase() === topic.name.toLowerCase();
                                return (
                                    <button
                                        key={topic.name}
                                        onClick={() => onTagSelect?.(isSelected ? null : topic.name)}
                                        className={`px-2.5 py-1 text-xs font-semibold rounded-full border cursor-pointer transition duration-200 ${
                                            isSelected 
                                                ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                                                : "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-800"
                                        }`}
                                    >
                                        #{topic.name}
                                        <span className={`ml-1 text-[10px] ${isSelected ? "text-indigo-200" : "text-slate-400"}`}>
                                            ({topic.count})
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-4 text-xs text-slate-400">No trending topics yet</div>
                    )}
                </CardContent>
            </Card>

            {/* Skool Leaderboard Preview Widget */}
            <Card className="border border-slate-100 shadow-sm">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-amber-500" />
                        Weekly Leaderboard
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2 space-y-3">
                    {leaderboard.slice(0, 3).map((lead, idx) => {
                        const rankColors = ["text-amber-500", "text-slate-400", "text-amber-700"];
                        return (
                            <div key={lead.clerkId || idx} className="flex items-center justify-between group">
                                <div className="flex items-center gap-2.5">
                                    <div className="relative">
                                        {lead.avatar ? (
                                            <img src={lead.avatar} alt="avatar" className="h-8 w-8 rounded-full object-cover border border-slate-100" />
                                        ) : (
                                            <div className="h-8 w-8 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                                                {lead.firstName?.[0] || "?"}
                                            </div>
                                        )}
                                        <div className={`absolute -top-1 -right-1 h-4 w-4 rounded-full bg-white shadow-sm border border-slate-100 flex items-center justify-center text-[9px] font-bold ${rankColors[idx] || "text-slate-400"}`}>
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div className="truncate">
                                        <span className="text-xs font-semibold text-slate-700 block truncate group-hover:text-indigo-600 transition">
                                            {lead.firstName} {lead.lastName}
                                        </span>
                                        <span className="text-[10px] text-slate-400">Lvl {lead.level || 1}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-xs font-bold text-slate-600">{lead.points || lead.xp || 0}</span>
                                    <span className="text-[9px] text-slate-400 block">XP</span>
                                </div>
                            </div>
                        );
                    })}

                    <button 
                        onClick={() => onTabChange?.("leaderboard")}
                        className="w-full mt-2 py-1.5 text-center text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-100/50 hover:border-indigo-100 rounded-lg cursor-pointer transition flex items-center justify-center gap-1"
                    >
                        View Full Leaderboard
                        <ChevronRight className="h-3 w-3" />
                    </button>
                </CardContent>
            </Card>

            {/* Photos Preview Card */}
            <Card className="border border-slate-100 shadow-sm">
                <CardHeader className="p-4 pb-2">
                    <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Photos</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                    <div className="grid grid-cols-3 gap-2">
                        {loadingPhotos ? (
                            [1, 2, 3].map((i) => (
                                <div key={i} className="aspect-square bg-slate-100 animate-pulse rounded-md" />
                            ))
                        ) : photos.length > 0 ? (
                            photos.map((url, i) => (
                                <div key={i} className="aspect-square bg-slate-100 rounded-md overflow-hidden relative group">
                                    <img src={url} alt="Post media" className="w-full h-full object-cover transition duration-300 group-hover:scale-110" />
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 text-center text-xs text-slate-400 py-4">
                                No photos shared yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
