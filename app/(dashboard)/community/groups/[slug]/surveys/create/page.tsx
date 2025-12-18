"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import { useUser } from "@clerk/nextjs";
import { getGroup } from "@/lib/actions/group.actions";
import { syncCurrentUser } from "@/lib/actions/user.actions";

interface CreateGroupSurveyPageProps {
    params: Promise<{ slug: string }>;
}

export default function CreateGroupSurveyPage({ params }: CreateGroupSurveyPageProps) {
    const { slug } = use(params);
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;

        let userId = user.publicMetadata.userId as string;

        if (!userId) {
            try {
                const result = await syncCurrentUser();
                if (result.success && result.user) {
                    userId = result.user._id.toString();
                } else {
                    toast.error("Could not verify user identity.");
                    return;
                }
            } catch (error) {
                toast.error("Failed to sync user data.");
                return;
            }
        }

        setIsLoading(true);
        try {
            // We need the group ID. 
            // Since this is a client component, we might need to fetch the group first or pass it down.
            // For simplicity, let's fetch the group by slug via server action wrapper or just assume we have it.
            // Actually, calling server action directly is fine.
            const group = await getGroup(slug);
            if (!group || !group._id) {
                toast.error("Group not found or invalid");
                return;
            }

            console.log("Creating survey with context:", { type: "Group", entityId: group._id });

            const res = await fetch('/api/surveys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    owner: userId,
                    status: "Draft",
                    subtype: "Survey",
                    questions: [],
                    settings: {
                        allowAnonymous: false,
                        showResultsAfterSubmit: false
                    },
                    context: {
                        type: "Group",
                        entityId: group._id
                    }
                }),
            });

            if (!res.ok) throw new Error("Failed to create survey");

            const survey = await res.json();
            toast.success("Survey created!");
            router.push(`/community/groups/${slug}/surveys/${survey._id}/edit`);
        } catch (error) {
            toast.error("Failed to create survey");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <Button variant="ghost" className="mb-6 pl-0 hover:bg-transparent hover:text-indigo-600" onClick={() => router.back()}>
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Group
            </Button>

            <h1 className="text-2xl font-bold mb-6">Create New Group Survey</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg border shadow-sm">
                <div className="space-y-2">
                    <Label htmlFor="title">Survey Title</Label>
                    <Input
                        id="title"
                        required
                        placeholder="e.g. Weekly Check-in"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Textarea
                        id="description"
                        placeholder="What is this survey about?"
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                </div>

                <div className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => router.back()}>
                        Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create & Start Building
                    </Button>
                </div>
            </form>
        </div>
    );
}
