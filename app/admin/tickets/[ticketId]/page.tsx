import { getTicket } from "@/lib/actions/ticket.actions";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReplyForm } from "@/app/(dashboard)/support/[ticketId]/_components/reply-form";
import { TicketActions } from "./_components/ticket-actions";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminTicketIdPage({
    params
}: {
    params: Promise<{ ticketId: string }>
}) {
    const { ticketId } = await params;
    const ticket = await getTicket(ticketId);

    if (!ticket) {
        return redirect("/admin/tickets");
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
                    <div className="flex items-center gap-x-2 text-sm text-muted-foreground mb-2">
                        <span>From: </span>
                        <div className="flex items-center gap-x-1">
                            <span className="font-semibold text-slate-900">
                                {ticket.userInfo?.firstName} {ticket.userInfo?.lastName}
                            </span>
                            <span>({ticket.userInfo?.email})</span>
                        </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                        Ticket ID: {ticket._id} • Created {format(new Date(ticket.createdAt), "MMM d, yyyy")}
                    </div>
                </div>

                <TicketActions
                    ticketId={ticket._id}
                    status={ticket.status}
                    priority={ticket.priority}
                />
            </div>

            <Separator />

            <div className="flex-1 overflow-y-auto py-6 space-y-6">
                {ticket.messages.map((message: any) => (
                    <div
                        key={message._id}
                        className={`flex gap-x-4 ${message.isAdmin ? "flex-row-reverse" : "flex-row"}`}
                    >
                        <Avatar>
                            <AvatarImage src={message.senderAvatar} />
                            <AvatarFallback>
                                {message.senderName?.[0]}
                            </AvatarFallback>
                        </Avatar>
                        <div className={`flex flex-col max-w-[80%] ${message.isAdmin ? "items-end" : "items-start"}`}>
                            <div className="flex items-center gap-x-2 mb-1">
                                <span className="text-sm font-semibold">
                                    {message.senderName}
                                </span>
                                {message.isAdmin && (
                                    <Badge variant="secondary" className="text-[10px] px-1 py-0 h-4">Admin</Badge>
                                )}
                                <span className="text-xs text-muted-foreground">
                                    {format(new Date(message.createdAt), "AMM p")}
                                </span>
                            </div>
                            <div className={`p-4 rounded-lg text-sm ${message.isAdmin
                                ? "bg-slate-100 text-slate-900"
                                : "bg-blue-600 text-white"
                                }`}>
                                {message.content}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="pt-6 border-t bg-white">
                <h3 className="text-sm font-medium mb-2">Reply to user</h3>
                <ReplyForm ticketId={ticket._id} />
            </div>
        </div>
    );
}
