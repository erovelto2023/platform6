"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Save, Trash2, Calendar as CalendarIcon, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { updateContentPost, deleteContentPost } from "@/lib/actions/content.actions";
import { toast } from "sonner";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

interface EditPostFormProps {
    post: any;
}

export default function EditPostForm({ post }: EditPostFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: post.title,
        content: post.content,
        status: post.status,
        contentType: post.contentType,
        scheduledFor: post.scheduledFor ? new Date(post.scheduledFor) : undefined,
        contentPillar: post.contentPillar || "education"
    });

    const handleChange = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateContentPost(post._id, formData);
            toast.success("Post updated successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update post");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Are you sure you want to delete this post?")) return;

        setIsLoading(true);
        try {
            await deleteContentPost(post._id);
            toast.success("Post deleted");
            router.push("/tools/content-planner");
        } catch (error) {
            toast.error("Failed to delete post");
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link href="/tools/content-planner">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Edit Content</h1>
                        <p className="text-slate-500 text-sm">Manage details and scheduling</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="destructive" size="icon" onClick={handleDelete} disabled={isLoading}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button onClick={handleSave} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                        Save Changes
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Content Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => handleChange('title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Content</Label>
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => handleChange('content', e.target.value)}
                                    className="min-h-[400px] font-serif text-lg leading-relaxed"
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(val) => handleChange('status', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="idea">Idea</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="review">Review</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Type</Label>
                                <Select value={formData.contentType} onValueChange={(val) => handleChange('contentType', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="blog">Blog Post</SelectItem>
                                        <SelectItem value="social">Social Media</SelectItem>
                                        <SelectItem value="email">Email Newsletter</SelectItem>
                                        <SelectItem value="video">Video Script</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Pillar</Label>
                                <Select value={formData.contentPillar} onValueChange={(val) => handleChange('contentPillar', val)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="education">Education</SelectItem>
                                        <SelectItem value="promotion">Promotion</SelectItem>
                                        <SelectItem value="engagement">Engagement</SelectItem>
                                        <SelectItem value="authority">Authority</SelectItem>
                                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Schedule Date</Label>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant={"outline"}
                                            className={`w-full justify-start text-left font-normal ${!formData.scheduledFor && "text-muted-foreground"}`}
                                        >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {formData.scheduledFor ? format(formData.scheduledFor, "PPP") : <span>Pick a date</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0">
                                        <Calendar
                                            mode="single"
                                            selected={formData.scheduledFor}
                                            onSelect={(date) => handleChange('scheduledFor', date)}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
