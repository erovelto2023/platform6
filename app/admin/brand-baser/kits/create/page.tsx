"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { createBrandBase } from "@/lib/actions/brand-baser.actions";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Palette } from "lucide-react";
import Link from "next/link";

export default function CreateBrandKitPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim()) {
            toast.error("Please enter a brand name");
            return;
        }

        setIsSubmitting(true);
        try {
            const result = await createBrandBase({
                name: name.trim(),
                description: description.trim() || undefined,
            });

            if (result.success) {
                toast.success("Brand kit created!");
                router.push(`/admin/brand-baser/kits/${result.brandBase._id}`);
            } else {
                toast.error(result.error || "Failed to create brand kit");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="max-w-2xl mx-auto">
                <Link
                    href="/admin/brand-baser/kits"
                    className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Brand Kits
                </Link>

                <div className="mb-8">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Palette className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Create Brand Kit</h1>
                            <p className="text-slate-600">
                                Set up your brand's visual identity
                            </p>
                        </div>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Brand Kit Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Brand Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., KBusiness Academy, Nike, Apple"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <p className="text-xs text-slate-500">
                                    The name of your brand or business
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="e.g., Online business education platform"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={3}
                                />
                                <p className="text-xs text-slate-500">
                                    A brief description of your brand
                                </p>
                            </div>

                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h3 className="font-semibold text-sm mb-2">What's included in a Brand Kit?</h3>
                                <ul className="text-sm space-y-1 text-slate-700">
                                    <li>✓ Color palette management</li>
                                    <li>✓ Typography and font selection</li>
                                    <li>✓ Logo and asset uploads</li>
                                    <li>✓ Brand guidelines export</li>
                                    <li>✓ Visual identity preview</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Create Brand Kit
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => router.back()}
                                    disabled={isSubmitting}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
