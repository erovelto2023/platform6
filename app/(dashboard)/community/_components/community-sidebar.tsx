"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardAction } from "@/components/ui/card";
import { Users, Calendar, UserPlus, Bookmark, Home, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";
import { getCommunityPhotos } from "@/lib/actions/community.actions";

interface CommunitySidebarProps {
    user: any;
    onTabChange?: (tab: string) => void;
    activeTab?: string;
}

export function CommunitySidebar({ user, onTabChange, activeTab }: CommunitySidebarProps) {
    const router = useRouter();
    const [photos, setPhotos] = useState<string[]>([]);
    const [loadingPhotos, setLoadingPhotos] = useState(true);

    useEffect(() => {
        const fetchPhotos = async () => {
            if (!user) return;
            try {
                // Try _id first (Mongo), then id (Clerk/other)
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


    const menuItems = [
        { id: "feed", label: "News Feed", icon: Home },
        { id: "popular", label: "Popular", icon: TrendingUp },
        { id: "friends", label: "Friends", icon: Users },
        { id: "members", label: "Find Members", icon: UserPlus },
        { id: "events", label: "Events", icon: Calendar },
        { id: "groups", label: "Groups", icon: Users },
        { id: "saved", label: "Saved", icon: Bookmark },
    ];

    const handleNavigation = (id: string) => {
        if (onTabChange) {
            onTabChange(id);
        } else {
            // Fallback navigation for standalone pages
            switch (id) {
                case 'members':
                    router.push('/community/members');
                    break;
                case 'events':
                    router.push('/community/events');
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
            {/* Navigation Menu */}
            <Card>
                <CardContent className="p-4 space-y-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                onClick={() => handleNavigation(item.id)}
                                className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg cursor-pointer transition ${isActive
                                    ? 'bg-indigo-50 text-indigo-600'
                                    : 'text-slate-600 hover:bg-slate-100'
                                    }`}
                            >
                                <Icon className="h-4 w-4" />
                                {item.label}
                            </button>
                        );
                    })}
                </CardContent>
            </Card>

            {/* About Widget */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                </CardHeader>
                <CardContent className="text-sm space-y-2">
                    <div>
                        <span className="font-semibold text-slate-900">Joined: </span>
                        <span className="text-slate-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                </CardContent>
            </Card>

            {/* Photos Preview */}
            <Card>
                <CardHeader>
                    <CardTitle className="text-lg">Photos</CardTitle>
                </CardHeader>
                <CardContent>
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
                            <div className="col-span-3 text-center text-xs text-slate-500 py-4">
                                No photos yet
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
