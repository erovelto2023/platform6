"use client";

import { useState } from "react";
import { CommunitySidebar } from "./community-sidebar";
import { CommunityContent } from "./community-content";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CommunityPageClientProps {
    posts: any[];
    currentUser: any;
}

export function CommunityPageClient({ posts, currentUser }: CommunityPageClientProps) {
    const [activeTab, setActiveTab] = useState("feed");

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Sidebar */}
            <div className="hidden lg:block space-y-6">
                <CommunitySidebar
                    user={currentUser}
                    onTabChange={setActiveTab}
                    activeTab={activeTab}
                />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2">
                {/* Mobile Tabs */}
                <div className="lg:hidden mb-6">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <TabsList className="w-full justify-start bg-white border mb-6 p-1 h-auto flex-wrap">
                            <TabsTrigger value="feed" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Feed
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
                            <TabsTrigger value="events" className="px-4 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">
                                Events
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
                    posts={posts}
                    currentUser={currentUser}
                    activeTab={activeTab}
                />
            </div>
        </div>
    );
}
