"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Shield, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface SlackProfileModalProps {
    user: any;
    currentUser: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdate?: (updatedUser: any) => void;
}

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { toast } from "sonner";

export function SlackProfileModal({ user, currentUser, open, onOpenChange, onUpdate }: SlackProfileModalProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: ""
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.firstName || "",
                lastName: user.lastName || "",
                bio: user.bio || ""
            });
        }
    }, [user]);

    if (!user) return null;

    const isOwnProfile = currentUser && (user._id === currentUser._id || user.id === currentUser.id || user.clerkId === currentUser.clerkId);

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const res = await updateUserProfile(formData);
            if (res.success) {
                toast.success("Profile updated");
                onUpdate?.(res.user);
                setIsEditing(false);
            } else {
                toast.error(res.error || "Update failed");
            }
        } catch (err) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    const isOnline = user.lastActiveAt &&
        (new Date().getTime() - new Date(user.lastActiveAt).getTime()) < 300000;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden bg-white border-none shadow-2xl">
                <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-600" />

                <div className="px-6 pb-6 pt-0 -mt-16">
                    <div className="relative inline-block">
                        <Avatar className="h-32 w-32 border-4 border-white rounded-xl shadow-lg">
                            <AvatarImage src={user.profileImage} className="object-cover" />
                            <AvatarFallback className="text-4xl bg-indigo-600 text-white font-bold">
                                {user.firstName?.[0]}{user.lastName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className={cn(
                            "absolute bottom-2 right-2 w-6 h-6 rounded-full border-4 border-white shadow-sm",
                            isOnline ? "bg-green-500" : "bg-slate-400"
                        )} />
                    </div>

                    <div className="mt-4">
                        {isEditing ? (
                            <div className="space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">First Name</Label>
                                        <Input
                                            value={formData.firstName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
                                            className="h-9"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs text-slate-500">Last Name</Label>
                                        <Input
                                            value={formData.lastName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
                                            className="h-9"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <Label className="text-xs text-slate-500">Bio</Label>
                                    <Textarea
                                        value={formData.bio}
                                        onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                                        className="resize-none h-20 text-sm"
                                        placeholder="Add a bio..."
                                    />
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-slate-900">{user.firstName} {user.lastName}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className={cn(
                                        "text-sm font-medium",
                                        isOnline ? "text-green-600" : "text-slate-500"
                                    )}>
                                        {isOnline ? "Active" : "Away"}
                                    </span>
                                    <span className="text-slate-300">•</span>
                                    <span className="text-sm text-slate-500">
                                        {user.lastActiveAt ? `Last active ${formatDistanceToNow(new Date(user.lastActiveAt))} ago` : "Never active"}
                                    </span>
                                </div>
                            </>
                        )}
                    </div>

                    {!isEditing && (
                        <div className="mt-6 space-y-4">
                            {user.bio && (
                                <div className="text-sm text-slate-600 leading-relaxed italic border-l-2 border-slate-100 pl-4 py-1">
                                    "{user.bio}"
                                </div>
                            )}

                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Mail className="h-4 w-4 text-slate-400" />
                                <span>{user.email}</span>
                            </div>

                            <div className="flex items-center gap-3 text-sm text-slate-600">
                                <Shield className="h-4 w-4 text-slate-400" />
                                <span className="capitalize">{user.role || 'Member'}</span>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 flex gap-2">
                        {isEditing ? (
                            <>
                                <Button
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                    onClick={handleSave}
                                    disabled={isSaving}
                                >
                                    {isSaving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={() => setIsEditing(false)}
                                    disabled={isSaving}
                                >
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <>
                                {isOwnProfile ? (
                                    <Button
                                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white">
                                        Message
                                    </Button>
                                )}
                                <Button variant="outline" className="flex-1">
                                    History
                                </Button>
                            </>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
