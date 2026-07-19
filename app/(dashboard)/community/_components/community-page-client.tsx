"use client";

import { useState } from "react";
import { CommunitySidebar } from "./community-sidebar";
import { CommunityContent } from "./community-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommunityPageClientProps {
    posts: any[];
    currentUser: any;
    trendingTopics?: any[];
    leaderboard?: any[];
}

export function CommunityPageClient({ posts, currentUser, trendingTopics = [], leaderboard = [] }: CommunityPageClientProps) {
    const [activeTab, setActiveTab] = useState("feed");
    const [filterTag, setFilterTag] = useState<string | null>(null);

    // If tag filtering is active, filter the posts
    const displayedPosts = filterTag 
        ? posts.filter(post => post.content.toLowerCase().includes(`#${filterTag.toLowerCase()}`))
        : posts;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block space-y-6">
                <CommunitySidebar
                    user={currentUser}
                    onTabChange={(tab) => {
                        setActiveTab(tab);
                        setFilterTag(null); // Reset tag filter on menu click
                    }}
                    activeTab={activeTab}
                    trendingTopics={trendingTopics}
                    leaderboard={leaderboard}
                    onTagSelect={setFilterTag}
                    activeTag={filterTag}
                />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
                {filterTag && (
                    <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4 flex items-center justify-between">
                        <span className="text-sm text-indigo-700 font-medium">
                            Showing posts tagged with <strong className="text-indigo-900">#{filterTag}</strong>
                        </span>
                        <button 
                            onClick={() => setFilterTag(null)}
                            className="text-xs text-indigo-500 hover:text-indigo-700 font-semibold underline"
                        >
                            Clear Filter
                        </button>
                    </div>
                )}

                {/* Mobile Tabs */}
                <div className="lg:hidden mb-6">
                    <Tabs value={activeTab} onValueChange={(val) => {
                        setActiveTab(val);
                        setFilterTag(null);
                    }} className="w-full">
                        <TabsList className="w-full justify-start bg-white border mb-6 p-1 h-auto flex-wrap">
                            <TabsTrigger value="feed" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Feed
                            </TabsTrigger>
                            <TabsTrigger value="leaderboard" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Leaderboard
                            </TabsTrigger>
                            <TabsTrigger value="friends" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Friends
                            </TabsTrigger>
                            <TabsTrigger value="popular" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Popular
                            </TabsTrigger>
                            <TabsTrigger value="members" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Members
                            </TabsTrigger>
                            <TabsTrigger value="groups" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Groups
                            </TabsTrigger>
                            <TabsTrigger value="saved" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Saved
                            </TabsTrigger>
                        </TabsList>
                    </Tabs>
                </div>

                {/* Content Area */}
                <CommunityContent
                    posts={displayedPosts}
                    currentUser={currentUser}
                    activeTab={activeTab}
                    leaderboard={leaderboard}
                />
            </div>
        </div>
    );
}
