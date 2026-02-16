
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { createOffer, updateOffer } from "@/lib/actions/offer.actions";

interface OfferWizardProps {
    trigger?: React.ReactNode;
    initialData?: any; // If present, edit mode
    onSuccess?: () => void;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
}

export function OfferWizard(props: OfferWizardProps) {
    const { trigger, initialData, onSuccess } = props;

    // Controlled vs Uncontrolled state logic
    const [internalOpen, setInternalOpen] = useState(false);
    const isControlled = typeof props.open !== 'undefined';
    const open = isControlled ? props.open : internalOpen;
    const setOpen = isControlled ? props.onOpenChange! : setInternalOpen;

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
        price: "",
        funnelUrl: "",
        recurring: false,
        status: "draft"
    });

    useEffect(() => {
        if (open) {
            setFormData({
                name: initialData?.name || "",
                type: initialData?.type || "other",
                price: initialData?.price || "",
                funnelUrl: initialData?.funnelUrl || "",
                recurring: initialData?.recurring || false,
                status: initialData?.status || "draft"
            });
        }
    }, [open, initialData]);

    const handleChange = (key: string, value: any) => {
        setFormData(prev => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const payload = { ...formData };
            let res;

            if (isEditing && initialData._id) {
                res = await updateOffer(initialData._id, payload);
            } else {
                res = await createOffer(payload);
            }

            if (res.success) {
                toast.success(isEditing ? "Offer updated!" : "Offer created!");
                handleOpenChange(false);
                onSuccess?.();
            } else {
                toast.error("Failed to save: " + (res.error || "Unknown error"));
            }
        } catch (error) {
            toast.error("Failed to save offer");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                {trigger || (
                    <Button variant="outline">
                        <Plus className="mr-2 h-4 w-4" /> New Offer
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Offer' : 'New Offer'}</DialogTitle>
                    <DialogDescription>
                        Create an offer to link your content to.
                    </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label>Offer Name *</Label>
                        <Input
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="e.g., Masterclass Access"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Type</Label>
                            <Select value={formData.type} onValueChange={(v) => handleChange('type', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="course">Course</SelectItem>
                                    <SelectItem value="membership">Membership</SelectItem>
                                    <SelectItem value="coaching">Coaching</SelectItem>
                                    <SelectItem value="digital_product">Digital Product</SelectItem>
                                    <SelectItem value="affiliate">Affiliate</SelectItem>
                                    <SelectItem value="service">Service</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid gap-2">
                            <Label>Status</Label>
                            <Select value={formData.status} onValueChange={(v) => handleChange('status', v)}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="draft">Draft</SelectItem>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="archived">Archived</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label>Price ($)</Label>
                            <Input
                                type="number"
                                value={formData.price}
                                onChange={(e) => handleChange('price', e.target.value)}
                                placeholder="97"
                            />
                        </div>
                        <div className="flex items-end pb-3">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    id="recurring"
                                    checked={formData.recurring}
                                    onCheckedChange={(checked) => handleChange('recurring', checked)}
                                />
                                <Label htmlFor="recurring">Recurring?</Label>
                            </div>
                        </div>
                    </div>

                    <div className="grid gap-2">
                        <Label>Funnel / Sales Page URL</Label>
                        <Input
                            value={formData.funnelUrl}
                            onChange={(e) => handleChange('funnelUrl', e.target.value)}
                            placeholder="https://mysite.com/offer"
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading || !formData.name} className="bg-indigo-600 hover:bg-indigo-700">
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        {isEditing ? 'Save Changes' : 'Create Offer'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
