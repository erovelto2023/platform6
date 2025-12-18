"use client";

import { useState } from "react";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { createHeadline } from "@/lib/actions/headline.actions";
import { useRouter } from "next/navigation";

interface AddHeadlineModalProps {
    userId: string;
}

export default function AddHeadlineModal({ userId }: AddHeadlineModalProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        text: "",
        subheadline: "",
        platform: "",
        emotion: "",
        notes: ""
    });

    const handleSubmit = async () => {
        if (!formData.text) {
            toast.error("Headline text is required");
            return;
        }

        setIsLoading(true);
        try {
            await createHeadline(userId, {
                ...formData,
                aiGenerated: false
            });
            toast.success("Headline added successfully");
            setIsOpen(false);
            setFormData({
                text: "",
                subheadline: "",
                platform: "",
                emotion: "",
                notes: ""
            });
            router.refresh();
        } catch (error) {
            toast.error("Failed to add headline");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="secondary">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Manually
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
                <DialogHeader>
                    <DialogTitle>Add Headline Manually</DialogTitle>
                    <DialogDescription>
                        Save a headline you've written or found to your vault.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="text">Headline Text</Label>
                        <Textarea
                            id="text"
                            placeholder="Enter your headline here..."
                            value={formData.text}
                            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="subheadline">Subheadline (Optional)</Label>
                        <Input
                            id="subheadline"
                            placeholder="Enter subheadline..."
                            value={formData.subheadline}
                            onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Platform</Label>
                            <Select
                                value={formData.platform}
                                onValueChange={(val) => setFormData({ ...formData, platform: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Facebook">Facebook</SelectItem>
                                    <SelectItem value="Email">Email</SelectItem>
                                    <SelectItem value="Blog">Blog</SelectItem>
                                    <SelectItem value="YouTube">YouTube</SelectItem>
                                    <SelectItem value="TikTok">TikTok</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Emotion</Label>
                            <Select
                                value={formData.emotion}
                                onValueChange={(val) => setFormData({ ...formData, emotion: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Curiosity">Curiosity</SelectItem>
                                    <SelectItem value="Fear">Fear</SelectItem>
                                    <SelectItem value="Desire">Desire</SelectItem>
                                    <SelectItem value="Urgency">Urgency</SelectItem>
                                    <SelectItem value="Authority">Authority</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Any notes about this headline..."
                            className="h-20"
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                        Save Headline
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
