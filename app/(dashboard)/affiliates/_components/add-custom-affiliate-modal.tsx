"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return toast.error("Company name is required");

        setIsLoading(true);
        try {
            const result = await createCustomAffiliateCompany(userId, {
                ...formData,
                keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k)
            });
            toast.success("Custom affiliate partner added!");
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
                <Button variant="outline" className="bg-slate-900 border-slate-800 text-slate-200 hover:bg-slate-800 font-mono text-xs font-bold uppercase tracking-wider h-11 px-4 rounded-xl flex items-center gap-2 cursor-pointer">
                    <Plus className="h-4 w-4 text-blue-400" />
                    + Add Custom Partner
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-lg font-sans">
                <DialogHeader>
                    <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100">
                        + Add Custom Partner
                    </DialogTitle>
                    <DialogDescription className="text-xs font-mono text-slate-400">
                        Add an unlisted affiliate program to track in your personal vault.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-mono text-xs">
                    <div>
                        <label className="block font-bold text-slate-300 mb-1">Company Name *</label>
                        <Input
                            required
                            placeholder="e.g. ConvertKit, ClickFunnels, Hostinger"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Website URL</label>
                            <Input
                                placeholder="https://company.com"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Commission Rate</label>
                            <Input
                                placeholder="e.g. 30% Recurring"
                                value={formData.commissionRate}
                                onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Network (Optional)</label>
                            <Input
                                placeholder="Impact, ShareASale, CJ"
                                value={formData.affiliateNetwork}
                                onChange={(e) => setFormData({ ...formData, affiliateNetwork: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                        <div>
                            <label className="block font-bold text-slate-300 mb-1">My Affiliate Link / ID</label>
                            <Input
                                placeholder="Your tracking URL"
                                value={formData.affiliateId}
                                onChange={(e) => setFormData({ ...formData, affiliateId: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-bold text-slate-300 mb-1">Keywords</label>
                        <Input
                            placeholder="software, email marketing, hosting"
                            value={formData.keywords}
                            onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                            className="bg-slate-950 border-slate-800"
                        />
                    </div>

                    <div>
                        <label className="block font-bold text-slate-300 mb-1">Strategy Notes</label>
                        <Textarea
                            rows={3}
                            placeholder="Add notes, promotional hooks, or terms..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-xl focus:outline-none resize-none"
                        />
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
                        <Button type="submit" disabled={isLoading} className="bg-blue-600 hover:bg-blue-500 text-white font-bold uppercase">
                            {isLoading ? "Saving..." : "+ Add to Vault"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
