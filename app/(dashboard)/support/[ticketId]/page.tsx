import { getTicket } from "@/lib/actions/ticket.actions";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ReplyForm } from "./_components/reply-form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function TicketIdPage({
    params
}: {
    params: Promise<{ ticketId: string }>
}) {
    const { ticketId } = await params;
    const ticket = await getTicket(ticketId);

    if (!ticket) {
        return redirect("/support");
    }

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold mb-2">{ticket.title}</h1>
                    <div className="flex items-center gap-x-2 text-sm text-muted-foreground">
                        <span>Ticket ID: {ticket._id}</span>
                        <span>•</span>
                        <span>Created {format(new Date(ticket.createdAt), "MMM d, yyyy")}</span>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    <Badge variant={
                        ticket.status === 'Open' ? 'default' :
                            ticket.status === 'In Progress' ? 'secondary' : 'outline'
                    }>
                        {ticket.status}
                    </Badge>
                    <Badge variant="outline" className={
                        ticket.priority === 'High' ? 'text-red-500 border-red-200 bg-red-50' :
                            ticket.priority === 'Medium' ? 'text-yellow-600 border-yellow-200 bg-yellow-50' : 'text-slate-500'
                    }>
                        {ticket.priority} Priority
                    </Badge>
                </div>
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
                <h3 className="text-sm font-medium mb-2">Reply to ticket</h3>
                <ReplyForm ticketId={ticket._id} />
            </div>
        </div>
    );
}
