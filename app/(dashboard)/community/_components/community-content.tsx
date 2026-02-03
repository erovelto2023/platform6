"use client";

import { useState } from "react";
import { CreatePost } from "./create-post";
import { PostCard } from "./post-card";
import { FriendsActivity } from "./friends-activity";
import { PopularPosts } from "./popular-posts";
import { SavedContent } from "./saved-content";
import { FindMembers } from "./find-members";
import { EventsTab } from "./events-tab";
import { GroupsTab } from "./groups-tab";

interface CommunityContentProps {
    posts: any[];
    currentUser: any;
    activeTab: string;
}

export function CommunityContent({ posts, currentUser, activeTab }: CommunityContentProps) {
    return (
        <div className="space-y-6">
            {activeTab === "feed" && (
                <>
                    <CreatePost user={currentUser} />
                    <div className="space-y-4">
                        {posts.map((post: any) => (
                            <PostCard key={post._id} post={post} currentUser={currentUser} />
                        ))}
                        {posts.length === 0 && (
                            <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                                No posts yet. Be the first to share something!
                            </div>
                        )}
                    </div>
                </>
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

            {activeTab === "events" && (
                <EventsTab currentUser={currentUser} />
            )}

            {activeTab === "groups" && (
                <GroupsTab currentUser={currentUser} />
            )}
        </div>
    );
}
