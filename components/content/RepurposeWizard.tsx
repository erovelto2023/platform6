
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, Wand2 } from "lucide-react";
import { toast } from "sonner";
import { repurposeContent } from "@/lib/actions/content.actions";

interface RepurposeWizardProps {
    post: any;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function RepurposeWizard({ post, open, onOpenChange }: RepurposeWizardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFormats, setSelectedFormats] = useState<string[]>([]);

    const formats = [
        { id: 'twitter_thread', label: 'Twitter Thread (3-5 tweets)' },
        { id: 'linkedin_post', label: 'LinkedIn Post' },
        { id: 'email_newsletter', label: 'Email Newsletter' },
        { id: 'instagram_carousel', label: 'Instagram Carousel Script' },
        { id: 'short_video_script', label: 'Short Video Script (TikTok/Reels)' }
    ];

    const handleToggle = (id: string) => {
        if (selectedFormats.includes(id)) {
            setSelectedFormats(selectedFormats.filter(f => f !== id));
        } else {
            setSelectedFormats([...selectedFormats, id]);
        }
    };

    const handleGenerate = async () => {
        if (selectedFormats.length === 0) return;
        setIsLoading(true);
        try {
            const res = await repurposeContent(post._id, selectedFormats);
            if (res.success) {
                toast.success(`Generated ${res.count} new drafts!`);
                onOpenChange(false);
            } else {
                toast.error("Failed to generate content");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <Wand2 className="h-5 w-5 text-indigo-600" />
                        Repurpose Content
                    </DialogTitle>
                    <DialogDescription>
                        Generate new content pieces from <strong>{post?.title}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <Label>Select formats to generate:</Label>
                    <div className="space-y-3">
                        {formats.map((format) => (
                            <div key={format.id} className="flex items-center space-x-2 p-2 rounded hover:bg-slate-50 border border-transparent hover:border-slate-100">
                                <Checkbox
                                    id={format.id}
                                    checked={selectedFormats.includes(format.id)}
                                    onCheckedChange={() => handleToggle(format.id)}
                                />
                                <Label htmlFor={format.id} className="cursor-pointer flex-1">
                                    {format.label}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleGenerate} disabled={isLoading || selectedFormats.length === 0} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Generate Drafts
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
