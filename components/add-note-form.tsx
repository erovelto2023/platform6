"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createNote } from "@/lib/actions/note.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const AddNoteForm = ({ ticketId }: { ticketId: string }) => {
    const router = useRouter();
    const [text, setText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!text.trim()) return;

        setIsLoading(true);
        try {
            const result = await createNote(ticketId, text);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Note added");
                setText("");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Add a Note / Reply</label>
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type your response here..."
                    disabled={isLoading}
                    rows={3}
                />
            </div>
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || !text.trim()}>
                    {isLoading ? "Submiting..." : "Submit Note"}
                </Button>
            </div>
        </form>
    );
};
