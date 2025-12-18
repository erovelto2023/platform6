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
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function CreateBrandBasePage() {
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
                toast.success("Brand base created!");
                router.push(`/admin/brand-baser/${result.brandBase._id}`);
            } else {
                toast.error(result.error || "Failed to create brand base");
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
                    href="/admin/brand-baser"
                    className="flex items-center text-sm text-slate-600 hover:text-slate-900 mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to BrandBaser
                </Link>

                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2">Create Your Brand Base</h1>
                    <p className="text-slate-600">
                        Start by giving your brand base a name. You'll answer 20 strategic questions
                        to build a comprehensive brand foundation.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Brand Base Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="name">Brand Name *</Label>
                                <Input
                                    id="name"
                                    placeholder="e.g., KBusiness Academy"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    disabled={isSubmitting}
                                    required
                                />
                                <p className="text-xs text-slate-500">
                                    This is the name of your brand or business
                                </p>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    placeholder="e.g., Online business education platform for entrepreneurs"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    disabled={isSubmitting}
                                    rows={3}
                                />
                                <p className="text-xs text-slate-500">
                                    A brief description of what your brand does
                                </p>
                            </div>

                            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                                <h3 className="font-semibold text-sm mb-2">What happens next?</h3>
                                <ul className="text-sm space-y-1 text-slate-700">
                                    <li>• Answer 20 strategic questions about your business</li>
                                    <li>• Questions are organized into 6 easy-to-follow sections</li>
                                    <li>• Your progress is auto-saved every 30 seconds</li>
                                    <li>• Export your completed brand base for use with ChatGPT</li>
                                </ul>
                            </div>

                            <div className="flex gap-4">
                                <Button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1"
                                >
                                    {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Start Building
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
