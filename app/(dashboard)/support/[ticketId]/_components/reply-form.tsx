"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { addMessage } from "@/lib/actions/ticket.actions";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ReplyFormProps {
    ticketId: string;
}

export const ReplyForm = ({ ticketId }: ReplyFormProps) => {
    const router = useRouter();
    const [content, setContent] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!content.trim()) return;

        try {
            setIsLoading(true);
            const response = await addMessage(ticketId, content);

            if (response.error) {
                toast.error(response.error);
                return;
            }

            setContent("");
            toast.success("Message sent");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={onSubmit} className="mt-4 space-y-4">
            <Textarea
                disabled={isLoading}
                placeholder="Type your reply here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[100px]"
            />
            <div className="flex justify-end">
                <Button type="submit" disabled={isLoading || !content.trim()}>
                    Send Reply
                </Button>
            </div>
        </form>
    );
};
