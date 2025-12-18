"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, Save, Trash2, Copy, Star } from "lucide-react";
import { toast } from "sonner";
import { updateHeadline, deleteHeadline, toggleHeadlineFavorite } from "@/lib/actions/headline.actions";

interface HeadlineDetailClientProps {
    headline: any;
}

export default function HeadlineDetailClient({ headline }: HeadlineDetailClientProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        text: headline.text,
        subheadline: headline.subheadline || "",
        platform: headline.platform || "",
        emotion: headline.emotion || "",
        notes: headline.stats?.notes || ""
    });
    const [isFavorite, setIsFavorite] = useState(headline.isFavorite);

    const handleSave = async () => {
        setIsLoading(true);
        try {
            await updateHeadline(headline._id, {
                ...formData,
                stats: { ...headline.stats, notes: formData.notes }
            });
            toast.success("Headline updated");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update");
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm("Delete this headline permanently?")) return;
        try {
            await deleteHeadline(headline._id);
            toast.success("Headline deleted");
            router.push("/headlines");
        } catch (error) {
            toast.error("Failed to delete");
        }
    };

    const handleToggleFavorite = async () => {
        try {
            await toggleHeadlineFavorite(headline._id);
            setIsFavorite(!isFavorite);
            toast.success(isFavorite ? "Removed from favorites" : "Added to favorites");
            router.refresh();
        } catch (error) {
            toast.error("Failed to update favorite");
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Button variant="ghost" className="pl-0 hover:pl-2 transition-all" onClick={() => router.back()}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Vault
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handleToggleFavorite}
                        className={isFavorite ? "text-amber-500 border-amber-200 bg-amber-50" : ""}
                    >
                        <Star className={`h-4 w-4 ${isFavorite ? "fill-current" : ""}`} />
                    </Button>
                    <Button variant="destructive" size="icon" onClick={handleDelete}>
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit Headline</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Headline Text</Label>
                                <Textarea
                                    className="text-lg font-medium min-h-[100px]"
                                    value={formData.text}
                                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Subheadline (Optional)</Label>
                                <Input
                                    value={formData.subheadline}
                                    onChange={(e) => setFormData({ ...formData, subheadline: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Notes & Performance</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                <Label>Internal Notes</Label>
                                <Textarea
                                    placeholder="Track performance results, A/B test ideas, etc."
                                    className="min-h-[150px]"
                                    value={formData.notes}
                                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Classification</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Platform</Label>
                                <Select value={formData.platform} onValueChange={(val) => setFormData({ ...formData, platform: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select platform" />
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
                                <Select value={formData.emotion} onValueChange={(val) => setFormData({ ...formData, emotion: val })}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select emotion" />
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

                            <div className="pt-4 border-t">
                                <Button className="w-full" onClick={handleSave} disabled={isLoading}>
                                    <Save className="h-4 w-4 mr-2" />
                                    Save Changes
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-slate-50 border-dashed">
                        <CardContent className="p-4">
                            <div className="text-xs text-slate-500 space-y-2">
                                <div className="flex justify-between">
                                    <span>Created:</span>
                                    <span className="font-medium">{new Date(headline.createdAt).toLocaleDateString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Source:</span>
                                    <span className="font-medium">{headline.aiGenerated ? "AI Generated" : "Manual"}</span>
                                </div>
                                {headline.sourcePrompt && (
                                    <div className="pt-2 border-t mt-2">
                                        <span className="block mb-1">Prompt Used:</span>
                                        <p className="italic">{headline.sourcePrompt}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
