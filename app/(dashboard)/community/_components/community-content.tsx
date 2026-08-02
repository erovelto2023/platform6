"use client";

import { useState } from "react";
import { CreatePost } from "./create-post";
import { PostCard } from "./post-card";
import { FriendsActivity } from "./friends-activity";
import { PopularPosts } from "./popular-posts";
import { SavedContent } from "./saved-content";
import { FindMembers } from "./find-members";
import { GroupsTab } from "./groups-tab";
import { LeaderboardTab } from "./leaderboard-tab";
import { OnboardingChecklist } from "./onboarding-checklist";

interface CommunityContentProps {
    posts: any[];
    currentUser: any;
    activeTab: string;
    leaderboard?: any[];
}

export function CommunityContent({ posts, currentUser, activeTab, leaderboard = [] }: CommunityContentProps) {
    return (
        <div className="space-y-6 text-slate-100">
            {activeTab === "feed" && (
                <>
                    <CreatePost user={currentUser} />
                    
                    {/* Onboarding Milestone Checkpoint */}
                    <OnboardingChecklist currentUser={currentUser} />
                    
                    <div className="space-y-4">
                        {posts.map((post: any) => (
                            <PostCard key={post._id} post={post} currentUser={currentUser} />
                        ))}
                        {posts.length === 0 && (
                            <div className="text-center py-12 text-slate-300 bg-slate-900 rounded-2xl border border-slate-800 shadow-xl px-4 space-y-2">
                                <span className="text-base font-bold text-slate-100 block">Your community feed is ready!</span>
                                <p className="text-xs font-mono text-slate-300 max-w-sm mx-auto leading-relaxed">
                                    Use the post templates or the onboarding checklist above to share your first update and earn your first XP points.
                                </p>
                            </div>
                        )}
                    </div>
                </>
            )}

            {activeTab === "leaderboard" && (
                <LeaderboardTab leaderboard={leaderboard} />
            )}

            {activeTab === "friends" && (
                <FriendsActivity currentUser={currentUser} />
            )}

            {activeTab === "popular" && (
                <PopularPosts currentUser={currentUser} posts={posts} />
            )}

            {activeTab === "saved" && (
                <SavedContent currentUser={currentUser} posts={posts} />
            )}

            {activeTab === "members" && (
                <FindMembers currentUser={currentUser} />
            )}

            {activeTab === "groups" && (
                <GroupsTab currentUser={currentUser} />
            )}
        </div>
    );
}
