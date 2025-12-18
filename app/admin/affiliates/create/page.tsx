"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createAffiliateCompany } from "@/lib/actions/affiliate-admin.actions";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function CreateAffiliateCompanyPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);
        const formData = new FormData(e.currentTarget);

        const data = {
            name: formData.get("name"),
            website: formData.get("website"),
            summary: formData.get("summary"),
            description: formData.get("description"),
            industry: formData.get("industry"),
            affiliateNetwork: formData.get("affiliateNetwork"),
            signupUrl: formData.get("signupUrl"),
            commissionType: formData.get("commissionType"),
            commissionRate: formData.get("commissionRate"),
            cookieDuration: Number(formData.get("cookieDuration")),

            // New Fields
            niches: (formData.get("niches") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
            keywords: (formData.get("keywords") as string)?.split(",").map(s => s.trim()).filter(Boolean) || [],
            targetAudience: formData.get("targetAudience"),
            payoutThreshold: Number(formData.get("payoutThreshold")),
            payoutFrequency: formData.get("payoutFrequency"),
            trustScore: Number(formData.get("trustScore")),
            isVerified: formData.get("isVerified") === "on",
            isPublic: formData.get("isPublic") === "on",
        };

        try {
            await createAffiliateCompany(data);
            toast.success("Company created successfully");
            router.push("/admin/affiliates");
        } catch (error) {
            toast.error("Failed to create company");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6">Add Affiliate Company</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>Core Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Company Name</Label>
                                <Input id="name" name="name" required placeholder="e.g. HubSpot" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website URL</Label>
                                <Input id="website" name="website" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="industry">Industry</Label>
                            <Input id="industry" name="industry" placeholder="e.g. Marketing SaaS" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="niches">Niches (comma separated)</Label>
                                <Input id="niches" name="niches" placeholder="e.g. Marketing, Sales, CRM" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="keywords">Keywords (comma separated)</Label>
                                <Input id="keywords" name="keywords" placeholder="e.g. inbound marketing, automation" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="targetAudience">Target Audience</Label>
                            <Input id="targetAudience" name="targetAudience" placeholder="e.g. Small business owners, marketing agencies" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="summary">Short Summary</Label>
                            <Textarea id="summary" name="summary" placeholder="Brief description..." />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Full Description</Label>
                            <Textarea id="description" name="description" className="min-h-[100px]" placeholder="Detailed description..." />
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Affiliate Program Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="affiliateNetwork">Network</Label>
                                <Input id="affiliateNetwork" name="affiliateNetwork" placeholder="e.g. Impact, In-house" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="signupUrl">Signup URL</Label>
                                <Input id="signupUrl" name="signupUrl" placeholder="https://..." />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="commissionType">Commission Type</Label>
                                <Select name="commissionType" defaultValue="percentage">
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="percentage">Percentage</SelectItem>
                                        <SelectItem value="flat">Flat Fee</SelectItem>
                                        <SelectItem value="recurring">Recurring</SelectItem>
                                        <SelectItem value="mixed">Mixed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="commissionRate">Rate</Label>
                                <Input id="commissionRate" name="commissionRate" placeholder="e.g. 30%" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="cookieDuration">Cookie (Days)</Label>
                                <Input id="cookieDuration" name="cookieDuration" type="number" placeholder="30" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="payoutThreshold">Payout Threshold ($)</Label>
                                <Input id="payoutThreshold" name="payoutThreshold" type="number" placeholder="50" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="payoutFrequency">Payout Frequency</Label>
                                <Input id="payoutFrequency" name="payoutFrequency" placeholder="e.g. Net 30" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Admin Settings</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="trustScore">Trust Score (0-100)</Label>
                                <Input id="trustScore" name="trustScore" type="number" min="0" max="100" defaultValue="50" />
                            </div>
                            <div className="flex items-center gap-4 pt-8">
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isVerified" name="isVerified" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <Label htmlFor="isVerified">Verified</Label>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input type="checkbox" id="isPublic" name="isPublic" defaultChecked className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                                    <Label htmlFor="isPublic">Publicly Visible</Label>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Company"}
                    </Button>
                </div>
            </form>
        </div>
    );
}
