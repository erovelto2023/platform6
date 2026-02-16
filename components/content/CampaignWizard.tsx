
"use client";

import { useState, useEffect } from "react";
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
import { Loader2, Plus, Calendar as CalendarIcon } from "lucide-react";
import { toast } from "sonner";
import { createCampaign, updateCampaign } from "@/lib/actions/campaign.actions";

interface CampaignWizardProps {
    trigger?: React.ReactNode;
    initialData?: any; // If present, edit mode
    onSuccess?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function CampaignWizard(props: CampaignWizardProps) {
    const { trigger, initialData, onSuccess } = props;

    // Controlled vs Uncontrolled state logic
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = typeof props.open !== 'undefined';
    const open = isControlled ? props.open : internalOpen;
    const setOpen = isControlled ? props.onOpenChange! : setInternalOpen;

    // Helper to safely set open state
    const handleOpenChange = (newOpen: boolean) => {
        if (isControlled && props.onOpenChange) {
            props.onOpenChange(newOpen);
        } else {
            setInternalOpen(newOpen);
        }
    };

    const [isLoading, setIsLoading] = useState(false);
    const isEditing = !!initialData;

    const [formData, setFormData] = useState({
        name: "",
        type: "other",
        startDate: "",
        endDate: "",
        revenueGoal: "",
        notes: "",
        status: "planning"
    });

    // Reset/Init form data
    useEffect(() => {
        if (open) {
            setFormData({
                name: initialData?.name || "",
                type: initialData?.type || "other",
                startDate: initialData?.startDate ? new Date(initialData.startDate).toISOString().slice(0, 10) : "",
                endDate: initialData?.endDate ? new Date(initialData.endDate).toISOString().slice(0, 10) : "",
                revenueGoal: initialData?.revenueGoal || "",
                notes: initialData?.notes || "",
                status: initialData?.status || "planning"
            });
        }
    }, [open, initialData]);

    const handleChange = (key: string, value: string) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const payload = { ...formData };
            let res;

            if (isEditing && initialData._id) {
                res = await updateCampaign(initialData._id, payload);
            } else {
                res = await createCampaign(payload);
            }

            if (res.success) {
                toast.success(isEditing ? "Campaign updated!" : "Campaign created!");
                handleOpenChange(false);
                onSuccess?.();
            } else {
                toast.error("Failed to save: " + (res.error || "Unknown error"));
            }
        } catch (error) {
            toast.error("Failed to save campaign");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> New Campaign
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Campaign' : 'New Campaign'}</DialogTitle>
                    <DialogDescription>
                        Plan your marketing pushes and launches.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Campaign Name *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g., Summer Sale 2024"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="launch">Launch</SelectItem>
                                    <SelectItem value="evergreen">Evergreen</SelectItem>
                                    <SelectItem value="promo">Promo</SelectItem>
                                    <SelectItem value="newsletter">Newsletter</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="planning">Planning</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="paused">Paused</SelectItem>
                                    <SelectItem value="completed">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Start Date</Label>
                            <Input
                                type="date"
                                value={formData.startDate}
                                onChange={(e) => handleChange('startDate', e.target.value)}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label>End Date</Label>
                            <Input
                                type="date"
                                value={formData.endDate}
                                onChange={(e) => handleChange('endDate', e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Revenue Goal ($)</Label>
                        <Input
                            type="number"
                            value={formData.revenueGoal}
                            onChange={(e) => handleChange('revenueGoal', e.target.value)}
                            placeholder="10000"
                        />
                    </div>

                    <div className="grid gap-2">
                        <Label>Notes</Label>
                        <Textarea
                            value={formData.notes}
                            onChange={(e) => handleChange('notes', e.target.value)}
                            placeholder="Key messaging, goals, etc."
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading || !formData.name} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Save Changes' : 'Create Campaign'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
