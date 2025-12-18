"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FriendRequestCard } from "./_components/friend-request-card";
import { FriendCard } from "./_components/friend-card";

interface FriendsPageClientProps {
    friendList: any[];
    serializedRequests: any[];
    serializedSentRequests: any[];
    currentUserId: string;
}

export function FriendsPageClient({
    friendList,
    serializedRequests,
    serializedSentRequests,
    currentUserId
}: FriendsPageClientProps) {
    return (
        <div className="max-w-6xl mx-auto p-6">
            <h1 className="text-3xl font-bold text-slate-900 mb-6">Friends & Connections</h1>

            <Tabs defaultValue="friends" className="w-full">
                <TabsList className="mb-6">
                    <TabsTrigger value="friends">My Friends ({friendList.length})</TabsTrigger>
                    <TabsTrigger value="requests">Requests ({serializedRequests.length})</TabsTrigger>
                    <TabsTrigger value="sent">Sent ({serializedSentRequests.length})</TabsTrigger>
                </TabsList>

                <TabsContent value="friends">
                    {friendList.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {friendList.map((friend: any) => (
                                <FriendCard key={friend._id} friend={friend} currentUserId={currentUserId} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-slate-500">You haven't added any friends yet.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="requests">
                    {serializedRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {serializedRequests.map((req: any) => (
                                <FriendRequestCard
                                    key={req._id}
                                    request={req}
                                    requester={req.requester}
                                    currentUserId={currentUserId}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-slate-500">No pending friend requests.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="sent">
                    {serializedSentRequests.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {serializedSentRequests.map((req: any) => (
                                <FriendCard
                                    key={req._id}
                                    friend={req.recipient}
                                    currentUserId={currentUserId}
                                    isPendingSent={true}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
                            <p className="text-slate-500">No sent requests.</p>
                        </div>
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
