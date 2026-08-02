"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Camera, UserPlus, MessageCircle } from "lucide-react";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { updateUserProfile, sendFriendRequest } from "@/lib/actions/community.actions";
import { getOrCreateConversation } from "@/lib/actions/message.actions";
import { EditProfileDialog } from "./edit-profile-dialog";
import { useRouter } from "next/navigation";

interface ProfileHeaderProps {
    user: any;
    isOwnProfile: boolean;
    currentUserId?: string;
}

export function ProfileHeader({ user, isOwnProfile, currentUserId }: ProfileHeaderProps) {
    const [coverImage, setCoverImage] = useState(user.coverImage);
    const [avatar, setAvatar] = useState(user.avatar || user.imageUrl);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleMessage = async () => {
        if (!currentUserId) return;
        setIsLoading(true);
        try {
            const result = await getOrCreateConversation(currentUserId, user._id);
            if (result.success && result.data) {
                router.push(`/messages?conversationId=${result.data._id}`);
            } else {
                toast.error("Failed to start conversation");
            }
        } catch (error) {
            toast.error("Failed to start conversation");
        } finally {
            setIsLoading(false);
        }
    };

    const handleFriendRequest = async () => {
        if (!currentUserId) return;
        try {
            await sendFriendRequest(currentUserId, user._id);
            toast.success("Friend request sent!");
        } catch (error) {
            toast.error("Failed to send friend request");
        }
    };

    return (
        <Card className="overflow-hidden border border-slate-800 bg-slate-900 shadow-xl mb-6 text-slate-100">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 relative group">
                {coverImage && (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
                )}

                {isOwnProfile && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadButton
                            endpoint="communityCoverImage"
                            onClientUploadComplete={async (res) => {
                                if (res?.[0]) {
                                    setCoverImage(res[0].url || res[0].url);
                                    await updateUserProfile(user._id, { coverImage: res[0].url || res[0].url });
                                    toast.success("Cover image updated");
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`);
                            }}
                            appearance={{
                                button: "bg-slate-950/80 hover:bg-slate-950 text-white shadow-sm h-8 px-3 text-xs font-mono font-bold backdrop-blur-sm border border-slate-700 cursor-pointer",
                                allowedContent: "hidden"
                            }}
                            content={{
                                button: (
                                    <div className="flex items-center">
                                        <Camera className="h-4 w-4 mr-2 text-orange-400" />
                                        Edit Cover
                                    </div>
                                )
                            }}
                        />
                    </div>
                )}
            </div>

            {/* Profile Info */}
            <div className="px-6 pb-6 relative">
                <div className="flex flex-col md:flex-row items-start md:items-end -mt-12 md:-mt-16 mb-4 gap-4">
                    {/* Avatar */}
                    <div className="relative">
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-slate-900 shadow-2xl bg-slate-950">
                            <AvatarImage src={avatar} alt={user.firstName} />
                            <AvatarFallback className="text-2xl font-bold bg-slate-950 text-orange-400">{user.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        {isOwnProfile && (
                            <div className="absolute bottom-0 right-0">
                                <UploadButton
                                    endpoint="communityAvatar"
                                    onClientUploadComplete={async (res) => {
                                        if (res?.[0]) {
                                            setAvatar(res[0].url || res[0].url);
                                            await updateUserProfile(user._id, { avatar: res[0].url || res[0].url });
                                            toast.success("Avatar updated");
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Upload failed: ${error.message}`);
                                    }}
                                    appearance={{
                                        button: "bg-slate-800 hover:bg-slate-700 text-orange-400 rounded-full h-8 w-8 p-0 shadow-md border border-slate-700 cursor-pointer",
                                        allowedContent: "hidden"
                                    }}
                                    content={{
                                        button: <Camera className="h-4 w-4" />
                                    }}
                                />
                            </div>
                        )}
                    </div>

                    {/* Name & Bio */}
                    <div className="flex-1 mt-2 md:mt-0 md:mb-2">
                        <h1 className="text-2xl md:text-3xl font-black text-slate-100 tracking-tight">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-slate-400 text-xs md:text-sm font-mono mt-1">
                            {user.bio || "No bio yet."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 md:mt-0 md:mb-4">
                        {isOwnProfile ? (
                            <EditProfileDialog user={user} />
                        ) : (
                            <>
                                <Button
                                    className="bg-orange-500 hover:bg-orange-600 text-slate-950 font-bold gap-2 cursor-pointer"
                                    onClick={handleFriendRequest}
                                >
                                    <UserPlus className="h-4 w-4" />
                                    Add Friend
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleMessage}
                                    disabled={isLoading}
                                    className="bg-slate-800 hover:bg-slate-700 text-slate-100 gap-2 cursor-pointer"
                                >
                                    <MessageCircle className="h-4 w-4" />
                                    Message
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </Card>
    );
}
