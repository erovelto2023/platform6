"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { updateUserProfile } from "@/lib/actions/community.actions";
import { toast } from "sonner";
import { Edit, Loader2 } from "lucide-react";

interface EditProfileDialogProps {
    user: any;
}

export function EditProfileDialog({ user }: EditProfileDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        bio: user.bio || "",
        website: user.socialLinks?.website || "",
        twitter: user.socialLinks?.twitter || "",
        instagram: user.socialLinks?.instagram || "",
        linkedin: user.socialLinks?.linkedin || "",
        facebook: user.socialLinks?.facebook || "",
        interests: user.interests?.join(", ") || "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const interestsArray = formData.interests
                .split(",")
                .map((i: string) => i.trim())
                .filter((i: string) => i.length > 0);

            await updateUserProfile(user._id, {
                firstName: formData.firstName,
                lastName: formData.lastName,
                bio: formData.bio,
                socialLinks: {
                    website: formData.website,
                    twitter: formData.twitter,
                    instagram: formData.instagram,
                    linkedin: formData.linkedin,
                    facebook: formData.facebook,
                },
                interests: interestsArray,
            });

            toast.success("Profile updated!");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to update profile");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal information and profile details.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                                id="firstName"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                                id="lastName"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                            id="bio"
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            placeholder="Tell us about yourself..."
                            rows={3}
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="interests">Interests (comma separated)</Label>
                        <Input
                            id="interests"
                            value={formData.interests}
                            onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                            placeholder="e.g. Marketing, Design, Coding"
                        />
                    </div>

                    <div className="space-y-3 pt-2">
                        <h4 className="font-medium text-sm">Social Links</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="website">Website</Label>
                                <Input
                                    id="website"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                    placeholder="https://..."
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="twitter">Twitter / X</Label>
                                <Input
                                    id="twitter"
                                    value={formData.twitter}
                                    onChange={(e) => setFormData({ ...formData, twitter: e.target.value })}
                                    placeholder="@username"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="instagram">Instagram</Label>
                                <Input
                                    id="instagram"
                                    value={formData.instagram}
                                    onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                                    placeholder="@username"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                    id="linkedin"
                                    value={formData.linkedin}
                                    onChange={(e) => setFormData({ ...formData, linkedin: e.target.value })}
                                    placeholder="Profile URL"
                                />
                            </div>
                        </div>
                    </div>

                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
