"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { createGroup } from "@/lib/actions/group.actions";
import { toast } from "sonner";
import { Loader2, Users, Lock, Globe, DollarSign, GraduationCap, Calendar } from "lucide-react";

interface CreateGroupFormProps {
    userId: string;
}

const GROUP_TYPES = [
    {
        id: "Public",
        label: "Public Group",
        description: "Anyone can view and join.",
        icon: Globe,
    },
    {
        id: "Closed",
        label: "Closed Group",
        description: "Visible, but approval required.",
        icon: Lock,
    },
    {
        id: "Private",
        label: "Private Group",
        description: "Hidden, invite only.",
        icon: Lock,
    },
    {
        id: "Paid",
        label: "Paid Membership",
        description: "Requires payment to access.",
        icon: DollarSign,
    },
    {
        id: "Course",
        label: "Course Cohort",
        description: "Tied to a specific course.",
        icon: GraduationCap,
    },
    {
        id: "Event",
        label: "Event Group",
        description: "Temporary group for an event.",
        icon: Calendar,
    },
];

export function CreateGroupForm({ userId }: CreateGroupFormProps) {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        type: "Public",
        category: "General",
        settings: {
            requiresApproval: false,
            isPaid: false,
            price: 0,
            allowAnonymous: false,
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const result = await createGroup({
                ...formData,
                createdBy: userId,
            });

            toast.success("Group created successfully!");
            router.push("/admin/groups");
        } catch (error) {
            toast.error("Failed to create group");
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Group Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g. Marketing Mastermind"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="What is this group about?"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            required
                            rows={4}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            placeholder="e.g. Business, Health, Tech"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        />
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label>Group Type</Label>
                        <div className="grid grid-cols-1 gap-3">
                            {GROUP_TYPES.map((type) => {
                                const Icon = type.icon;
                                const isSelected = formData.type === type.id;
                                return (
                                    <div
                                        key={type.id}
                                        className={`flex items-center p-3 rounded-lg border cursor-pointer transition-all ${isSelected
                                                ? "border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600"
                                                : "hover:border-slate-300 bg-white"
                                            }`}
                                        onClick={() => setFormData({ ...formData, type: type.id })}
                                    >
                                        <div className={`p-2 rounded-md mr-3 ${isSelected ? "bg-indigo-100 text-indigo-600" : "bg-slate-100 text-slate-500"
                                            }`}>
                                            <Icon className="h-5 w-5" />
                                        </div>
                                        <div>
                                            <div className={`font-medium ${isSelected ? "text-indigo-900" : "text-slate-900"}`}>
                                                {type.label}
                                            </div>
                                            <div className="text-xs text-slate-500">
                                                {type.description}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>

            <Card>
                <CardContent className="pt-6">
                    <h3 className="text-lg font-medium mb-4">Settings</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Require Approval</Label>
                                <p className="text-sm text-slate-500">
                                    Admins must approve new members
                                </p>
                            </div>
                            <Switch
                                checked={formData.settings.requiresApproval}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        settings: { ...formData.settings, requiresApproval: checked },
                                    })
                                }
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label className="text-base">Allow Anonymous Posts</Label>
                                <p className="text-sm text-slate-500">
                                    Members can post without revealing their identity
                                </p>
                            </div>
                            <Switch
                                checked={formData.settings.allowAnonymous}
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        settings: { ...formData.settings, allowAnonymous: checked },
                                    })
                                }
                            />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                    Cancel
                </Button>
                <Button type="submit" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    Create Group
                </Button>
            </div>
        </form>
    );
}
