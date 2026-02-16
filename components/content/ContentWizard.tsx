
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { createContentPost } from "@/lib/actions/content.actions";

// Mocks for now, should be replaced with actual data or passed in props
const PILLARS = ['education', 'promotion', 'engagement', 'authority', 'lifestyle', 'entertainment'];
const STAGES = ['awareness', 'consideration', 'conversion', 'retention'];
const EFFORT = ['low', 'medium', 'high'];

interface ContentWizardProps {
    campaigns: any[];
    offers: any[];
    trigger?: React.ReactNode;
    defaultStatus?: string;
    onSuccess?: () => void;
}

export function ContentWizard({ campaigns, offers, trigger, defaultStatus = 'idea', onSuccess }: ContentWizardProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState<'basics' | 'strategy'>('basics');

    const [formData, setFormData] = useState({
        title: "",
        contentType: "social",
        status: defaultStatus,
        scheduledFor: "",
        contentPillar: "",
        funnelStage: "awareness",
        campaignId: "none",
        offerId: "none",
        estimatedEffort: "medium",
        content: ""
    });

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            // Mapping to ContentPost structure
            // We need a createContentPost action that handles the new schema
            // For now, assume createContentItem is updated or we create a new one.
            // Let's assume we need to import `createContentPost` (I need to create this action if it doesn't exist).

            // Temporary Action Call (I will implement this next)
            const payload = {
                ...formData,
                campaignId: formData.campaignId === 'none' ? null : formData.campaignId,
                offerId: formData.offerId === 'none' ? null : formData.offerId,
                platforms: [{ name: 'instagram', status: 'pending' }] // Default platform logic
            };

            // await createContentPost(payload); 
            // Mock success
            toast.success("Content created!");
            setOpen(false);
            onSuccess?.();
        } catch (error) {
            toast.error("Failed to create content");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="mr-2 h-4 w-4" /> Create Content
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                    <DialogTitle>New Content Piece</DialogTitle>
                    <DialogDescription>
                        Draft a new post, idea, or campaign asset.
                    </DialogDescription>
                </DialogHeader>

                <Tabs value={step} onValueChange={(val) => setStep(val as any)} className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="basics">1. Basics</TabsTrigger>
                        <TabsTrigger value="strategy">2. Strategy</TabsTrigger>
                    </TabsList>

                    <TabsContent value="basics" className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label>Title / Headline *</Label>
                            <Input
                                value={formData.title}
                                onChange={(e) => handleChange('title', e.target.value)}
                                placeholder="e.g., 5 Ways to Scale your Business"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Type</Label>
                                <Select value={formData.contentType} onValueChange={(v) => handleChange('contentType', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="social">Social Post</SelectItem>
                                        <SelectItem value="blog">Blog Article</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                        <SelectItem value="email">Email</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Status</Label>
                                <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="idea">Idea</SelectItem>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Scheduled For</Label>
                            <Input
                                type="datetime-local"
                                value={formData.scheduledFor}
                                onChange={(e) => handleChange('scheduledFor', e.target.value)}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Quick Notes</Label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => handleChange('content', e.target.value)}
                                placeholder="Jot down your main points..."
                                className="h-24"
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="strategy" className="space-y-4 py-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Campaign</Label>
                                <Select value={formData.campaignId} onValueChange={(v) => handleChange('campaignId', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {campaigns.map(c => <SelectItem key={c._id} value={c._id}>{c.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Related Offer</Label>
                                <Select value={formData.offerId} onValueChange={(v) => handleChange('offerId', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {offers.map(o => <SelectItem key={o._id} value={o._id}>{o.name}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Content Pillar</Label>
                                <Select value={formData.contentPillar} onValueChange={(v) => handleChange('contentPillar', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        {PILLARS.map(p => <SelectItem key={p} value={p} className="capitalize">{p}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="grid gap-2">
                                <Label>Funnel Stage</Label>
                                <Select value={formData.funnelStage} onValueChange={(v) => handleChange('funnelStage', v)}>
                                    <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
                                    <SelectContent>
                                        {STAGES.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Estimated Effort</Label>
                            <Select value={formData.estimatedEffort} onValueChange={(v) => handleChange('estimatedEffort', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    {EFFORT.map(e => <SelectItem key={e} value={e} className="capitalize">{e}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-md border border-slate-100 mt-4">
                            <h5 className="text-xs font-semibold text-slate-500 mb-2 flex items-center gap-1">
                                <Sparkles className="h-3 w-3 text-amber-500" />
                                AI Tip
                            </h5>
                            <p className="text-xs text-slate-600">
                                Linking content to an Offer and Funnel Stage helps track ROI. High effort content should ideally be "Pillar Content" that can be repurposed.
                            </p>
                        </div>
                    </TabsContent>
                </Tabs>

                <DialogFooter className="flex justify-between sm:justify-between">
                    {step === 'strategy' ? (
                        <Button variant="ghost" onClick={() => setStep('basics')}>Back</Button>
                    ) : (
                        <div />
                    )}

                    {step === 'basics' ? (
                        <Button onClick={() => setStep('strategy')}>Next: Strategy</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isLoading || !formData.title} className="bg-indigo-600 hover:bg-indigo-700">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create Content
                        </Button>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
