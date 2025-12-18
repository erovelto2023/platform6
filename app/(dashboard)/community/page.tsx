import { getPosts, getUserProfile } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";
import { CreatePost } from "./_components/create-post";
import { PostCard } from "./_components/post-card";
import { ProfileHeader } from "./_components/profile-header";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";
import { redirect } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CommunitySidebar } from "./_components/community-sidebar";

export default async function CommunityPage() {
    const user = await currentUser();
    if (!user) return redirect("/sign-in");

    await connectToDatabase();
    const dbCurrentUserDoc = await User.findOne({ clerkId: user.id });
    const dbCurrentUser = JSON.parse(JSON.stringify(dbCurrentUserDoc));

    if (!dbCurrentUser) {
        return <div>User not found in database. Please contact support.</div>;
    }

    // Fetch global feed (public posts)
    const posts = await getPosts({ visibility: 'public' });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            {/* Header Banner */}
            <ProfileHeader user={dbCurrentUser} isOwnProfile={true} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar */}
                <div className="hidden lg:block space-y-6">
                    <CommunitySidebar user={dbCurrentUser} />
                </div>

                {/* Main Feed */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="feed" className="w-full">
                        <TabsList className="w-full justify-start bg-white border mb-6 p-1 h-auto">
                            <TabsTrigger value="feed" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">News Feed</TabsTrigger>
                            <TabsTrigger value="friends" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">Friends Activity</TabsTrigger>
                            <TabsTrigger value="popular" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">Popular</TabsTrigger>
                        </TabsList>

                        <TabsContent value="feed" className="space-y-6">
                            <CreatePost user={dbCurrentUser} />

                            <div className="space-y-4">
                                {posts.map((post: any) => (
                                    <PostCard key={post._id} post={post} currentUser={dbCurrentUser} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                                        No posts yet. Be the first to share something!
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="friends">
                            <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                                Filter by friends coming soon...
                            </div>
                        </TabsContent>
                        <TabsContent value="popular">
                            <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                                Popular posts coming soon...
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
