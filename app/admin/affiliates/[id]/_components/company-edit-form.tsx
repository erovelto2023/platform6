"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue
} from "@/components/ui/select";
import { Edit } from "lucide-react";
import { updateAffiliateCompany } from "@/lib/actions/affiliate-admin.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CompanyEditFormProps {
    company: any;
}

export default function CompanyEditForm({ company }: CompanyEditFormProps) {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        name: company.name,
        website: company.website || "",
        logo: company.logo || "",
        industry: company.industry || "",
        description: company.description || "",
        summary: company.summary || "",
        affiliateNetwork: company.affiliateNetwork || "",
        signupUrl: company.signupUrl || "",
        commissionType: company.commissionType || "percentage",
        commissionRate: company.commissionRate || "",
        cookieDuration: company.cookieDuration || 30,
        niches: company.niches?.join(", ") || "",
        keywords: company.keywords?.join(", ") || "",
        targetAudience: company.targetAudience || "",
        payoutThreshold: company.payoutThreshold || 0,
        payoutFrequency: company.payoutFrequency || "",
        trustScore: company.trustScore || 50,
        isVerified: company.isVerified || false,
        isPublic: company.isPublic || false,
    });

    const handleSubmit = async () => {
        setIsLoading(true);
        try {
            const dataToSave = {
                ...formData,
                niches: formData.niches.split(",").map((s: string) => s.trim()).filter(Boolean),
                keywords: formData.keywords.split(",").map((s: string) => s.trim()).filter(Boolean),
                cookieDuration: Number(formData.cookieDuration),
                payoutThreshold: Number(formData.payoutThreshold),
                trustScore: Number(formData.trustScore),
            };

            await updateAffiliateCompany(company._id, dataToSave);
            toast.success("Company updated successfully");
            setIsOpen(false);
            router.refresh();
        } catch (error) {
            toast.error("Failed to update company");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Company
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Company Details</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                    {/* Basic Info */}
                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-2">Basic Info</h3>
                        <div className="space-y-2">
                            <Label>Company Name</Label>
                            <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Website URL</Label>
                            <Input value={formData.website} onChange={(e) => setFormData({ ...formData, website: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Logo URL</Label>
                            <Input value={formData.logo} onChange={(e) => setFormData({ ...formData, logo: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Industry</Label>
                            <Select value={formData.industry} onValueChange={(val) => setFormData({ ...formData, industry: val })}>
                                <SelectTrigger><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="SaaS">SaaS</SelectItem>
                                    <SelectItem value="E-commerce">E-commerce</SelectItem>
                                    <SelectItem value="Finance">Finance</SelectItem>
                                    <SelectItem value="Health">Health</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Program Details */}
                    <div className="space-y-4">
                        <h3 className="font-semibold border-b pb-2">Program Details</h3>
                        <div className="space-y-2">
                            <Label>Affiliate Network</Label>
                            <Input value={formData.affiliateNetwork} onChange={(e) => setFormData({ ...formData, affiliateNetwork: e.target.value })} placeholder="e.g. ShareASale, Impact" />
                        </div>
                        <div className="space-y-2">
                            <Label>Signup URL</Label>
                            <Input value={formData.signupUrl} onChange={(e) => setFormData({ ...formData, signupUrl: e.target.value })} />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Commission Type</Label>
                                <Select value={formData.commissionType} onValueChange={(val) => setFormData({ ...formData, commissionType: val })}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                                        <SelectItem value="recurring">Recurring</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Rate</Label>
                                <Input value={formData.commissionRate} onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })} placeholder="e.g. 20%" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Cookie Duration (Days)</Label>
                            <Input type="number" value={formData.cookieDuration} onChange={(e) => setFormData({ ...formData, cookieDuration: Number(e.target.value) })} />
                        </div>
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold border-b pb-2">Content</h3>
                        <div className="space-y-2">
                            <Label>Summary (Short)</Label>
                            <Input value={formData.summary} onChange={(e) => setFormData({ ...formData, summary: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Full Description</Label>
                            <Textarea className="min-h-[100px]" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
                        </div>
                    </div>

                    {/* Market Data */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold border-b pb-2">Market Data</h3>
                        <div className="space-y-2">
                            <Label>Niches (comma separated)</Label>
                            <Input value={formData.niches} onChange={(e) => setFormData({ ...formData, niches: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Keywords (comma separated)</Label>
                            <Input value={formData.keywords} onChange={(e) => setFormData({ ...formData, keywords: e.target.value })} />
                        </div>
                        <div className="space-y-2">
                            <Label>Target Audience</Label>
                            <Input value={formData.targetAudience} onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })} />
                        </div>
                    </div>

                    {/* Admin Settings */}
                    <div className="md:col-span-2 space-y-4">
                        <h3 className="font-semibold border-b pb-2">Admin Settings</h3>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label>Trust Score (0-100)</Label>
                                <Input type="number" value={formData.trustScore} onChange={(e) => setFormData({ ...formData, trustScore: Number(e.target.value) })} />
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Checkbox id="isVerified" checked={formData.isVerified} onCheckedChange={(c) => setFormData({ ...formData, isVerified: c === true })} />
                                <Label htmlFor="isVerified">Verified Partner</Label>
                            </div>
                            <div className="flex items-center space-x-2 pt-8">
                                <Checkbox id="isPublic" checked={formData.isPublic} onCheckedChange={(c) => setFormData({ ...formData, isPublic: c === true })} />
                                <Label htmlFor="isPublic">Publicly Visible</Label>
                            </div>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
