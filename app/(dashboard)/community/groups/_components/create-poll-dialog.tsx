"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from 'uuid';
import { syncCurrentUser } from "@/lib/actions/user.actions";

interface CreatePollDialogProps {
    groupId: string;
    userId: string;
}

export function CreatePollDialog({ groupId, userId }: CreatePollDialogProps) {
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [question, setQuestion] = useState("");
    const [options, setOptions] = useState(["", ""]);

    const handleAddOption = () => {
        setOptions([...options, ""]);
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const handleRemoveOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    const handleSubmit = async () => {
        let currentUserId = userId;

        if (!currentUserId) {
            try {
                const result = await syncCurrentUser();
                if (result.success && result.user) {
                    currentUserId = result.user._id.toString();
                } else {
                    toast.error("Could not verify user identity.");
                    return;
                }
            } catch (error) {
                toast.error("Failed to sync user data.");
                return;
            }
        }

        if (!question.trim()) {
            toast.error("Please enter a question");
            return;
        }

        const validOptions = options.filter(o => o.trim() !== "");
        if (validOptions.length < 2) {
            toast.error("Please provide at least 2 options");
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/surveys', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: question, // Poll question is the survey title
                    description: "Poll",
                    owner: currentUserId,
                    status: "Active", // Polls are active immediately
                    subtype: "Poll",
                    context: {
                        type: "Group",
                        entityId: groupId
                    },
                    questions: [{
                        id: uuidv4(),
                        type: "multiple_choice",
                        text: question,
                        required: true,
                        options: validOptions
                    }],
                    settings: {
                        allowAnonymous: false,
                        showResultsAfterSubmit: true
                    }
                }),
            });

            if (!res.ok) throw new Error("Failed to create poll");

            toast.success("Poll created!");
            setOpen(false);
            setQuestion("");
            setOptions(["", ""]);
            router.refresh();
        } catch (error) {
            toast.error("Failed to create poll");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    New Poll
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Poll</DialogTitle>
                    <DialogDescription>
                        Ask a question and let the group vote.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="question">Question</Label>
                        <Input
                            id="question"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="e.g. What should we read next?"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Options</Label>
                        {options.map((option, index) => (
                            <div key={index} className="flex gap-2">
                                <Input
                                    value={option}
                                    onChange={(e) => handleOptionChange(index, e.target.value)}
                                    placeholder={`Option ${index + 1}`}
                                />
                                {options.length > 2 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleRemoveOption(index)}
                                    >
                                        <Trash2 className="h-4 w-4 text-slate-400" />
                                    </Button>
                                )}
                            </div>
                        ))}
                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            className="w-full"
                            onClick={handleAddOption}
                        >
                            Add Option
                        </Button>
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit} disabled={isLoading}>
                        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Create Poll
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
