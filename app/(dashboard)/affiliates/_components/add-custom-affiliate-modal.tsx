"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { createCustomAffiliateCompany } from "@/lib/actions/affiliate-user.actions";

interface AddCustomAffiliateModalProps {
    userId: string;
}

export default function AddCustomAffiliateModal({ userId }: AddCustomAffiliateModalProps) {
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: "",
        website: "",
        commissionRate: "",
        affiliateNetwork: "",
        affiliateId: "",
        keywords: "",
        notes: ""
    });

    const handleSubmit = async () => {
        if (!formData.name) return toast.error("Company name is required");

        setIsLoading(true);
        try {
            const result = await createCustomAffiliateCompany(userId, {
                ...formData,
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
            });
            toast.success("Custom affiliate added!");
            setOpen(false);
            setFormData({
                name: "",
                website: "",
                commissionRate: "",
                affiliateNetwork: "",
                affiliateId: "",
                keywords: "",
                notes: ""
            });
            router.push(`/affiliates/${result.companyId}`);
        } catch (error) {
            toast.error("Failed to add custom affiliate");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" suppressHydrationWarning>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Custom
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Add Custom Affiliate</DialogTitle>
                    <DialogDescription>
                        Add a program that isn't in our database. It will be private to you.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="name">Company Name *</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Acme Corp"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                                id="website"
                                placeholder="https://..."
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="commission">Commission Rate</Label>
                            <Input
                                id="commission"
                                placeholder="e.g. 20%"
                                value={formData.commissionRate}
                                onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="network">Network (Optional)</Label>
                        <Input
                            id="network"
                            placeholder="e.g. ShareASale, Impact"
                            value={formData.affiliateNetwork}
                            onChange={(e) => setFormData({ ...formData, affiliateNetwork: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="affiliateId">My Affiliate ID / Link</Label>
                        <Input
                            id="affiliateId"
                            placeholder="Your unique tracking ID or link"
                            value={formData.affiliateId}
                            onChange={(e) => setFormData({ ...formData, affiliateId: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="keywords">Keywords</Label>
                        <Input
                            id="keywords"
                            placeholder="e.g. tech, software, marketing (comma separated)"
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="notes">Initial Notes</Label>
                        <Textarea
                            id="notes"
                            placeholder="Any strategy notes..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Partner"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
