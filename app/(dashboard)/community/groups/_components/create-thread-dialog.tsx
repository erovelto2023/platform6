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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileUpload } from "@/components/file-upload";
import { createThread } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { Loader2, Plus } from "lucide-react";

interface CreateThreadDialogProps {
    groupId: string;
    groupSlug: string;
    userId: string;
    forcedType?: string;
    excludeTypes?: string[];
}

export function CreateThreadDialog({ groupId, groupSlug, userId, forcedType, excludeTypes = [] }: CreateThreadDialogProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        type: forcedType || "Discussion",
        category: "",
        resourceUrl: "",
        pollOptions: ["", ""],
        // Win Fields
        winType: "Personal milestone",
        winDate: new Date().toISOString().split('T')[0],
        proofType: "None",
        proofUrl: "",
        whatIDid: "",
        whatWorked: "",
        whatIdDoDifferently: "",
        biggestLesson: "",
        inspiredBy: "",
        helpedBy: "",
        resourcesUsed: "",
        metricBefore: "",
        metricAfter: "",
        metricType: "",
        timeToWin: "",
        // Resource Fields
        resourceType: "Link",
        resourceShortDesc: "",
        resourceThumbnail: "",
        resourcePlatform: "",
        resourcePricing: "Free",
        resourceIsAffiliate: false,
        resourceFileType: "",
        resourceFileSize: "",
        resourceVersion: "",
        resourceDuration: "",
        resourceHosting: "",
        resourceTranscript: "",
        resourcePlayback: "Stream",
        resourceCategory: "",
        resourceSubcategory: "",
        resourceTags: "",
        resourceDifficulty: "Beginner",
        resourceOutcome: "",
        resourceHowTo: "",
        resourceBestFor: "",
        resourcePrereq: "",
        resourceTime: "",
        resourceSource: "",
        resourceLicense: "",
        resourceRights: "",
        resourceAttribution: "",
    });

    // Reset form when opening, respecting forcedType
    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (newOpen) {
            setFormData(prev => ({
                ...prev,
                type: forcedType || (excludeTypes.includes("Discussion") ? "Announcement" : "Discussion"),
                title: "",
                content: "",
                category: "",
                resourceUrl: "",
                pollOptions: ["", ""],
                winType: "Personal milestone",
                winDate: new Date().toISOString().split('T')[0],
                proofType: "None",
                proofUrl: "",
                whatIDid: "",
                whatWorked: "",
                whatIdDoDifferently: "",
                biggestLesson: "",
                inspiredBy: "",
                helpedBy: "",
                resourcesUsed: "",
                metricBefore: "",
                metricAfter: "",
                metricType: "",
                timeToWin: "",
                // Reset Resource Fields
                resourceType: "Link",
                resourceShortDesc: "",
                resourceThumbnail: "",
                resourcePlatform: "",
                resourcePricing: "Free",
                resourceIsAffiliate: false,
                resourceFileType: "",
                resourceFileSize: "",
                resourceVersion: "",
                resourceDuration: "",
                resourceHosting: "",
                resourceTranscript: "",
                resourcePlayback: "Stream",
                resourceCategory: "",
                resourceSubcategory: "",
                resourceTags: "",
                resourceDifficulty: "Beginner",
                resourceOutcome: "",
                resourceHowTo: "",
                resourceBestFor: "",
                resourcePrereq: "",
                resourceTime: "",
                resourceSource: "",
                resourceLicense: "",
                resourceRights: "",
                resourceAttribution: "",
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            await createThread({
                ...formData,
                group: groupId,
                groupSlug: groupSlug,
                author: userId,
            });

            toast.success("Thread created!");
            setOpen(false);
        } catch (error) {
            toast.error("Failed to create thread");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    const threadTypes = [
        { value: "Discussion", label: "Discussion" },
        { value: "Question", label: "Question" },
        { value: "Announcement", label: "Announcement" },
        { value: "Resource", label: "Resource" },
    ].filter(t => !excludeTypes.includes(t.value));

    const getButtonText = () => {
        switch (forcedType) {
            case 'Question': return 'Ask Question';
            case 'Announcement': return 'Post Announcement';
            case 'Resource': return 'Share Resource';
            case 'Discussion': return 'New Discussion';
            case 'Win': return 'Share Win';
            default: return 'New Thread';
        }
    };

    const getDialogTitle = () => {
        switch (forcedType) {
            case 'Question': return 'Ask a Question';
            case 'Announcement': return 'Make an Announcement';
            case 'Resource': return 'Share a Resource';
            case 'Discussion': return 'Start a Discussion';
            case 'Win': return 'Celebrate a Win';
            default: return 'Create New Thread';
        }
    };

    const getDialogDescription = () => {
        switch (forcedType) {
            case 'Question': return 'Ask the community for help or advice.';
            case 'Announcement': return 'Share important news or updates with the group.';
            case 'Resource': return 'Share a link, file, or resource with the group.';
            case 'Discussion': return 'Start a conversation with the group.';
            case 'Win': return 'Share your success and what you learned along the way.';
            default: return 'Start a discussion or share something with the group.';
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    {getButtonText()}
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {getDialogTitle()}
                    </DialogTitle>
                    <DialogDescription>
                        {getDialogDescription()}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    {!forcedType && (
                        <div className="space-y-2">
                            <Label htmlFor="type">Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(value) => setFormData({ ...formData, type: value })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {threadTypes.map(t => (
                                        <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            placeholder={
                                formData.type === "Question" ? "What's your question?" :
                                    formData.type === "Win" ? "Short headline (e.g. First $100 online!)" :
                                        "Thread Title"
                            }
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="content">
                            {formData.type === "Question" ? "Details" : "Content"}
                        </Label>
                        <Textarea
                            id="content"
                            placeholder={
                                formData.type === "Question" ? "Describe your problem in detail..." :
                                    formData.type === "Win" ? "Share the story behind your win..." :
                                        "Write your post here..."
                            }
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            required
                            rows={6}
                        />
                    </div>

                    {/* Conditional Fields based on Type */}
                    {formData.type === "Discussion" && (
                        <div className="space-y-2">
                            <Label htmlFor="category">Category (Optional)</Label>
                            <Input
                                id="category"
                                placeholder="e.g. General, Feedback, Off-Topic"
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            />
                        </div>
                    )}

                    {formData.type === "Win" && (
                        <div className="space-y-4 border-t pt-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Win Type</Label>
                                    <Select
                                        value={formData.winType}
                                        onValueChange={(value) => setFormData({ ...formData, winType: value })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Personal milestone">Personal milestone</SelectItem>
                                            <SelectItem value="Business win">Business win</SelectItem>
                                            <SelectItem value="Learning breakthrough">Learning breakthrough</SelectItem>
                                            <SelectItem value="Health / mindset">Health / mindset</SelectItem>
                                            <SelectItem value="Community contribution">Community contribution</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label>Date of Win</Label>
                                    <Input
                                        type="date"
                                        value={formData.winDate}
                                        onChange={(e) => setFormData({ ...formData, winDate: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Reflection (Optional)</Label>
                                <Textarea
                                    placeholder="What did you do? What steps did you take?"
                                    value={formData.whatIDid}
                                    onChange={(e) => setFormData({ ...formData, whatIDid: e.target.value })}
                                    className="h-20"
                                />
                                <Textarea
                                    placeholder="What worked well?"
                                    value={formData.whatWorked}
                                    onChange={(e) => setFormData({ ...formData, whatWorked: e.target.value })}
                                    className="h-20 mt-2"
                                />
                                <Textarea
                                    placeholder="Biggest lesson learned?"
                                    value={formData.biggestLesson}
                                    onChange={(e) => setFormData({ ...formData, biggestLesson: e.target.value })}
                                    className="h-20 mt-2"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Before (Metric)</Label>
                                    <Input
                                        placeholder="e.g. $0, 0 subs"
                                        value={formData.metricBefore}
                                        onChange={(e) => setFormData({ ...formData, metricBefore: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>After (Metric)</Label>
                                    <Input
                                        placeholder="e.g. $100, 100 subs"
                                        value={formData.metricAfter}
                                        onChange={(e) => setFormData({ ...formData, metricAfter: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    )}


                    {
                        formData.type === "Resource" && (
                            <div className="space-y-6 border-t pt-4">
                                {/* Basics */}
                                <div className="space-y-4">
                                    <h4 className="font-medium text-slate-900">Resource Basics</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Resource Type</Label>
                                            <Select
                                                value={formData.resourceType}
                                                onValueChange={(value) => setFormData({ ...formData, resourceType: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {["Link", "File", "Video", "Audio", "Document", "Tool", "Template", "Checklist", "Course", "Lesson"].map(t => (
                                                        <SelectItem key={t} value={t}>{t}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Resource Content</Label>
                                            <Tabs defaultValue="link" className="w-full">
                                                <TabsList className="grid w-full grid-cols-2">
                                                    <TabsTrigger value="link">Link URL</TabsTrigger>
                                                    <TabsTrigger value="upload">Upload File</TabsTrigger>
                                                </TabsList>
                                                <TabsContent value="link">
                                                    <Input
                                                        placeholder="https://..."
                                                        value={formData.resourceUrl}
                                                        onChange={(e) => setFormData({ ...formData, resourceUrl: e.target.value })}
                                                    />
                                                </TabsContent>
                                                <TabsContent value="upload">
                                                    <FileUpload
                                                        endpoint="courseAttachment"
                                                        value={formData.resourceUrl}
                                                        onChange={(url) => setFormData({ ...formData, resourceUrl: url || "" })}
                                                    />
                                                </TabsContent>
                                            </Tabs>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Short Description (1-2 sentences)</Label>
                                        <Input
                                            placeholder="Brief summary..."
                                            value={formData.resourceShortDesc}
                                            onChange={(e) => setFormData({ ...formData, resourceShortDesc: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Thumbnail URL (Optional)</Label>
                                        <Input
                                            placeholder="https://..."
                                            value={formData.resourceThumbnail}
                                            onChange={(e) => setFormData({ ...formData, resourceThumbnail: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Type Specific */}
                                {(formData.resourceType === "Link" || formData.resourceType === "Tool") && (
                                    <div className="space-y-4 border-t pt-4">
                                        <h4 className="font-medium text-slate-900">Link / Tool Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Platform Name</Label>
                                                <Input
                                                    value={formData.resourcePlatform}
                                                    onChange={(e) => setFormData({ ...formData, resourcePlatform: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Pricing</Label>
                                                <Select
                                                    value={formData.resourcePricing}
                                                    onValueChange={(value) => setFormData({ ...formData, resourcePricing: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Free">Free</SelectItem>
                                                        <SelectItem value="Freemium">Freemium</SelectItem>
                                                        <SelectItem value="Paid">Paid</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* File Specific */}
                                {formData.resourceType === "File" && (
                                    <div className="space-y-4 border-t pt-4">
                                        <h4 className="font-medium text-slate-900">File Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>File Type</Label>
                                                <Input
                                                    placeholder="e.g. PDF, DOCX"
                                                    value={formData.resourceFileType}
                                                    onChange={(e) => setFormData({ ...formData, resourceFileType: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>File Size</Label>
                                                <Input
                                                    placeholder="e.g. 10MB"
                                                    value={formData.resourceFileSize}
                                                    onChange={(e) => setFormData({ ...formData, resourceFileSize: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Version</Label>
                                                <Input
                                                    placeholder="e.g. v1.0"
                                                    value={formData.resourceVersion}
                                                    onChange={(e) => setFormData({ ...formData, resourceVersion: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Video/Audio Specific */}
                                {(formData.resourceType === "Video" || formData.resourceType === "Audio") && (
                                    <div className="space-y-4 border-t pt-4">
                                        <h4 className="font-medium text-slate-900">Media Details</h4>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label>Duration</Label>
                                                <Input
                                                    placeholder="e.g. 10:30"
                                                    value={formData.resourceDuration}
                                                    onChange={(e) => setFormData({ ...formData, resourceDuration: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Hosting Platform</Label>
                                                <Input
                                                    placeholder="e.g. YouTube, Vimeo"
                                                    value={formData.resourceHosting}
                                                    onChange={(e) => setFormData({ ...formData, resourceHosting: e.target.value })}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Playback Type</Label>
                                                <Select
                                                    value={formData.resourcePlayback}
                                                    onValueChange={(value) => setFormData({ ...formData, resourcePlayback: value })}
                                                >
                                                    <SelectTrigger>
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Stream">Stream</SelectItem>
                                                        <SelectItem value="Download">Download</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                            <div className="space-y-2 col-span-2">
                                                <Label>Transcript / Captions URL</Label>
                                                <Input
                                                    placeholder="https://..."
                                                    value={formData.resourceTranscript}
                                                    onChange={(e) => setFormData({ ...formData, resourceTranscript: e.target.value })}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Categorization */}
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-medium text-slate-900">Categorization</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Category</Label>
                                            <Input
                                                placeholder="e.g. Marketing"
                                                value={formData.resourceCategory}
                                                onChange={(e) => setFormData({ ...formData, resourceCategory: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Difficulty</Label>
                                            <Select
                                                value={formData.resourceDifficulty}
                                                onValueChange={(value) => setFormData({ ...formData, resourceDifficulty: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Beginner">Beginner</SelectItem>
                                                    <SelectItem value="Intermediate">Intermediate</SelectItem>
                                                    <SelectItem value="Advanced">Advanced</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Tags (comma separated)</Label>
                                        <Input
                                            placeholder="tag1, tag2, tag3"
                                            value={formData.resourceTags}
                                            onChange={(e) => setFormData({ ...formData, resourceTags: e.target.value })}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Intended Outcome</Label>
                                        <Input
                                            placeholder="e.g. Learn to code"
                                            value={formData.resourceOutcome}
                                            onChange={(e) => setFormData({ ...formData, resourceOutcome: e.target.value })}
                                        />
                                    </div>
                                </div>

                                {/* Context */}
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-medium text-slate-900">Context & Guidance</h4>
                                    <div className="space-y-2">
                                        <Label>How to Use</Label>
                                        <Textarea
                                            placeholder="Instructions..."
                                            value={formData.resourceHowTo}
                                            onChange={(e) => setFormData({ ...formData, resourceHowTo: e.target.value })}
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Best For</Label>
                                            <Input
                                                placeholder="Who is this for?"
                                                value={formData.resourceBestFor}
                                                onChange={(e) => setFormData({ ...formData, resourceBestFor: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>Est. Time</Label>
                                            <Input
                                                placeholder="e.g. 2 hours"
                                                value={formData.resourceTime}
                                                onChange={(e) => setFormData({ ...formData, resourceTime: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Attribution & License */}
                                <div className="space-y-4 border-t pt-4">
                                    <h4 className="font-medium text-slate-900">Attribution & License</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label>Source / Author</Label>
                                            <Input
                                                placeholder="Original author or source"
                                                value={formData.resourceSource}
                                                onChange={(e) => setFormData({ ...formData, resourceSource: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label>License Type</Label>
                                            <Input
                                                placeholder="e.g. CC-BY, MIT, Public Domain"
                                                value={formData.resourceLicense}
                                                onChange={(e) => setFormData({ ...formData, resourceLicense: e.target.value })}
                                            />
                                        </div>
                                        <div className="space-y-2 col-span-2">
                                            <Label>Usage Rights</Label>
                                            <Input
                                                placeholder="e.g. Free for commercial use"
                                                value={formData.resourceRights}
                                                onChange={(e) => setFormData({ ...formData, resourceRights: e.target.value })}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Attribution Text</Label>
                                        <Textarea
                                            placeholder="Required attribution text..."
                                            value={formData.resourceAttribution}
                                            onChange={(e) => setFormData({ ...formData, resourceAttribution: e.target.value })}
                                            className="h-20"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Post Thread
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent >
        </Dialog >
    );
}
