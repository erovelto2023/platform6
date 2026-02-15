"use client";

import { Button } from "@/components/ui/button";
import { closeTicket } from "@/lib/actions/ticket.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const CloseTicketButton = ({ ticketId }: { ticketId: string }) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onClose = async () => {
        setIsLoading(true);
        try {
            const result = await closeTicket(ticketId);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("Ticket closed");
                router.refresh();
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Button
            onClick={onClose}
            disabled={isLoading}
            variant="destructive"
        >
            Close Ticket
        </Button>
    );
};
