"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateTicketStatus, updateTicketPriority } from "@/lib/actions/ticket.actions";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface TicketActionsProps {
    ticketId: string;
    status: string;
    priority: string;
}

export const TicketActions = ({ ticketId, status, priority }: TicketActionsProps) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const onStatusChange = async (newStatus: string) => {
        try {
            setIsLoading(true);
            const response = await updateTicketStatus(ticketId, newStatus);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success("Status updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    const onPriorityChange = async (newPriority: string) => {
        try {
            setIsLoading(true);
            const response = await updateTicketPriority(ticketId, newPriority);
            if (response.error) {
                toast.error(response.error);
                return;
            }
            toast.success("Priority updated");
            router.refresh();
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex gap-x-4">
            <div className="w-[150px]">
                <Label className="text-xs mb-1 block">Status</Label>
                <Select
                    disabled={isLoading}
                    onValueChange={onStatusChange}
                    defaultValue={status}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Open">Open</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="w-[150px]">
                <Label className="text-xs mb-1 block">Priority</Label>
                <Select
                    disabled={isLoading}
                    onValueChange={onPriorityChange}
                    defaultValue={priority}
                >
                    <SelectTrigger>
                        <SelectValue placeholder="Priority" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Low">Low</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="High">High</SelectItem>
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};
