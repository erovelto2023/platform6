"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { createPersonalOffer, updatePersonalOffer } from "@/lib/actions/personal-affiliate.actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";

interface AffiliateOfferFormProps {
    initialData?: any;
    onComplete: () => void;
}

export default function AffiliateOfferForm({ initialData, onComplete }: AffiliateOfferFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: initialData?.name || "",
        affiliateLink: initialData?.affiliateLink || "",
        price: initialData?.price || "",
        commissionLevel: initialData?.commissionLevel || "",
        payoutAmount: initialData?.payoutAmount || "",
        network: initialData?.network || "",
        notes: initialData?.notes || ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = initialData?._id 
                ? await updatePersonalOffer(initialData._id, formData)
                : await createPersonalOffer(formData);

            if (result.success) {
                toast.success(initialData ? "Offer updated" : "Offer created");
                router.refresh();
                onComplete();
            } else {
                toast.error(result.error || "Failed to save offer");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>Product Name</Label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="e.g. SEMrush Pro" />
                </div>
                <div className="space-y-2">
                    <Label>Network</Label>
                    <Input name="network" value={formData.network} onChange={handleChange} placeholder="e.g. ShareASale, Impact" />
                </div>
                <div className="md:col-span-2 space-y-2">
                    <Label>Affiliate Link</Label>
                    <Input name="affiliateLink" value={formData.affiliateLink} onChange={handleChange} required placeholder="https://..." />
                </div>
                <div className="space-y-2">
                    <Label>Product Price</Label>
                    <Input name="price" value={formData.price} onChange={handleChange} placeholder="e.g. $99/mo" />
                </div>
                <div className="space-y-2">
                    <Label>Commission Level</Label>
                    <Input name="commissionLevel" value={formData.commissionLevel} onChange={handleChange} placeholder="e.g. 40% Recurring" />
                </div>
                <div className="space-y-2">
                    <Label>Payout Amount</Label>
                    <Input name="payoutAmount" value={formData.payoutAmount} onChange={handleChange} placeholder="e.g. $40" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>Personal Notes</Label>
                <Textarea name="notes" value={formData.notes} onChange={handleChange} placeholder="Any specific details for your use..." />
            </div>
            <Button type="submit" disabled={loading} className="w-full gap-2">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {initialData ? "Update Offer" : "Save to Catalog"}
            </Button>
        </form>
    );
}
