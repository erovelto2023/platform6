import { getUserProfile, getPosts } from "@/lib/actions/community.actions";
import { currentUser } from "@clerk/nextjs/server";
import { ProfileHeader } from "../../_components/profile-header";
import { CreatePost } from "../../_components/create-post";
import { PostCard } from "../../_components/post-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db/connect";
import User from "@/lib/db/models/User";

export default async function ProfilePage({ params }: { params: Promise<{ userId: string }> }) {
    const { userId } = await params;
    const user = await currentUser();
    if (!user) return null;

    // Get the profile user
    // Since we are using MongoDB _id in params, we need to fetch by _id
    // But wait, the params.userId might be the MongoDB ID or Clerk ID?
    // Let's assume it's MongoDB ID for now as that's what we usually link to.

    let profileUser;
    try {
        profileUser = await getUserProfile(userId);
    } catch (e) {
        // If not found by ID, maybe it's a clerk ID? Or just 404.
        notFound();
    }

    // Get current user from DB to have the MongoDB _id
    await connectToDatabase();
    const dbCurrentUserDoc = await User.findOne({ clerkId: user.id });
    const dbCurrentUser = JSON.parse(JSON.stringify(dbCurrentUserDoc));

    const isOwnProfile = dbCurrentUser._id.toString() === userId;

    // Fetch posts for this user
    const posts = await getPosts({ userId: userId });

    return (
        <div className="max-w-6xl mx-auto p-4 md:p-6">
            <ProfileHeader
                user={profileUser}
                isOwnProfile={isOwnProfile}
                currentUserId={dbCurrentUser._id.toString()}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Sidebar (Desktop) */}
                <div className="hidden lg:block space-y-6">
                    {/* About */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">About</CardTitle>
                        </CardHeader>
                        <CardContent className="text-sm space-y-2">
                            <div>
                                <span className="font-semibold text-slate-900">Joined: </span>
                                <span className="text-slate-500">
                                    {new Date(profileUser.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <div>
                                <span className="font-semibold text-slate-900">Email: </span>
                                <span className="text-slate-500">{profileUser.email}</span>
                            </div>
                            {profileUser.socialLinks?.website && (
                                <div>
                                    <span className="font-semibold text-slate-900">Website: </span>
                                    <a href={profileUser.socialLinks.website} className="text-indigo-600 hover:underline">
                                        {profileUser.socialLinks.website}
                                    </a>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Photos Preview */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Photos</CardTitle>
                            <span className="text-xs text-indigo-600 cursor-pointer hover:underline">See All</span>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {/* Placeholder photos */}
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square bg-slate-100 rounded-md overflow-hidden">
                                        {/* <img src={`/placeholder-${i}.jpg`} className="w-full h-full object-cover" /> */}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Friends Preview */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Friends</CardTitle>
                            <span className="text-xs text-indigo-600 cursor-pointer hover:underline">See All</span>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-3 gap-2">
                                {/* Placeholder friends */}
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="aspect-square bg-slate-100 rounded-md overflow-hidden">
                                        {/* <img src={`/avatar-${i}.jpg`} className="w-full h-full object-cover" /> */}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Main Content */}
                <div className="lg:col-span-2">
                    <Tabs defaultValue="activity" className="w-full">
                        <TabsList className="w-full justify-start bg-white border mb-6 p-1 h-auto">
                            <TabsTrigger value="activity" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">Activity</TabsTrigger>
                            <TabsTrigger value="friends" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">Friends</TabsTrigger>
                            <TabsTrigger value="gallery" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">Gallery</TabsTrigger>
                            <TabsTrigger value="about" className="px-6 py-2 data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-600">About</TabsTrigger>
                        </TabsList>

                        <TabsContent value="activity" className="space-y-6">
                            {isOwnProfile && <CreatePost user={dbCurrentUser} />}

                            <div className="space-y-4">
                                {posts.map((post: any) => (
                                    <PostCard key={post._id} post={post} currentUser={dbCurrentUser} />
                                ))}
                                {posts.length === 0 && (
                                    <div className="text-center py-10 text-slate-500 bg-white rounded-lg border">
                                        No posts yet.
                                    </div>
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="friends">
                            <Card>
                                <CardContent className="p-6 text-center text-slate-500">
                                    Friend list coming soon...
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="gallery">
                            <Card>
                                <CardContent className="p-6 text-center text-slate-500">
                                    Photo gallery coming soon...
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="about">
                            <Card>
                                <CardContent className="p-6 text-center text-slate-500">
                                    Detailed about section coming soon...
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}
