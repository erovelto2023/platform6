"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Edit, Camera } from "lucide-react";
import { useState } from "react";
import { UploadButton } from "@/lib/uploadthing";
import { toast } from "sonner";
import { updateUserProfile } from "@/lib/actions/community.actions";
import { startConversation } from "@/lib/actions/messaging.actions";
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
            const conversationId = await startConversation(currentUserId, user._id);
            router.push(`/community/messages/${conversationId}`);
        } catch (error) {
            toast.error("Failed to start conversation");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="overflow-hidden border-none shadow-sm mb-6">
            {/* Cover Image */}
            <div className="h-48 md:h-64 bg-gradient-to-r from-violet-600 to-pink-500 relative group">
                {coverImage && (
                    <img src={coverImage} alt="Cover" className="w-full h-full object-cover absolute inset-0" />
                )}

                {isOwnProfile && (
                    <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <UploadButton
                            endpoint="communityCoverImage"
                            onClientUploadComplete={async (res) => {
                                if (res?.[0]) {
                                    setCoverImage(res[0].url);
                                    await updateUserProfile(user._id, { coverImage: res[0].url });
                                    toast.success("Cover updated!");
                                }
                            }}
                            onUploadError={(error: Error) => {
                                toast.error(`Upload failed: ${error.message}`);
                            }}
                            appearance={{
                                button: "bg-white/20 hover:bg-white/30 text-white shadow-sm h-8 px-3 text-xs font-medium backdrop-blur-sm border border-white/20",
                                allowedContent: "hidden"
                            }}
                            content={{
                                button: (
                                    <div className="flex items-center">
                                        <Camera className="h-4 w-4 mr-2" />
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
                        <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-white shadow-md">
                            <AvatarImage src={avatar} alt={user.firstName} />
                            <AvatarFallback className="text-2xl">{user.firstName?.[0]}</AvatarFallback>
                        </Avatar>
                        {isOwnProfile && (
                            <div className="absolute bottom-0 right-0">
                                <UploadButton
                                    endpoint="communityAvatar"
                                    onClientUploadComplete={async (res) => {
                                        if (res?.[0]) {
                                            setAvatar(res[0].url);
                                            await updateUserProfile(user._id, { avatar: res[0].url });
                                            toast.success("Avatar updated!");
                                        }
                                    }}
                                    onUploadError={(error: Error) => {
                                        toast.error(`Upload failed: ${error.message}`);
                                    }}
                                    appearance={{
                                        button: "bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-full h-8 w-8 p-0 shadow-sm border border-slate-200",
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
                        <h1 className="text-2xl font-bold text-slate-900">
                            {user.firstName} {user.lastName}
                        </h1>
                        <p className="text-slate-500 text-sm">
                            {user.bio || "No bio yet."}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 mt-4 md:mt-0 md:mb-4">
                        {isOwnProfile ? (
                            <EditProfileDialog user={user} />
                        ) : (
                            <>
                                <Button className="bg-indigo-600 hover:bg-indigo-700">
                                    Add Friend
                                </Button>
                                <Button
                                    variant="secondary"
                                    onClick={handleMessage}
                                    disabled={isLoading}
                                >
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
