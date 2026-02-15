import { getTicket } from "@/lib/actions/ticket.actions";
import { getNotes } from "@/lib/actions/note.actions";
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import { CloseTicketButton } from "./_components/close-button";
import { NoteItem } from "@/components/note-item";
import { AddNoteForm } from "@/components/add-note-form";

export default async function TicketIdPage({
    params
}: {
    params: Promise<{ ticketId: string }>
}) {
    const { ticketId } = await params;
    const ticket = await getTicket(ticketId);
    const notes = await getNotes(ticketId);

    if (!ticket) {
        return redirect("/tickets");
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <Link href="/tickets">
                    <Button variant="ghost" className="pl-0 hover:bg-transparent">
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border p-6 space-y-6">
                <div className="flex items-start justify-between">
                    <div>
                        <h1 className="text-xl font-bold mb-1">
                            Ticket ID: {ticket._id}
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Date Submitted: {format(new Date(ticket.createdAt), "MM/dd/yyyy 'at' h:mm a")}
                        </p>
                    </div>
                    <div className="text-right">
                        <Badge variant={
                            ticket.status === 'new' ? 'secondary' :
                                ticket.status === 'open' ? 'default' : 'outline'
                        } className={`text-lg px-4 py-1 ${ticket.status === 'new' ? 'bg-green-500 hover:bg-green-600 text-white' : ''
                            }`}>
                            {ticket.status}
                        </Badge>
                    </div>
                </div>

                <div className="bg-slate-50 p-4 rounded-md border text-sm">
                    <h3 className="font-semibold mb-2">Subject: {ticket.subject || ticket.product}</h3>
                    <hr className="my-2" />
                    <div className="whitespace-pre-wrap text-slate-700">
                        {ticket.description}
                    </div>
                </div>

                {ticket.status !== 'closed' && (
                    <div className="flex justify-end">
                        <CloseTicketButton ticketId={ticket._id} />
                    </div>
                )}
            </div>

            {/* Notes Section for Users */}
            <div className="space-y-4">
                <h2 className="text-lg font-semibold">Message History</h2>
                <div className="space-y-4">
                    {notes.map((note: any) => (
                        <NoteItem key={note._id} note={note} />
                    ))}
                    {notes.length === 0 && (
                        <p className="text-muted-foreground text-sm italic">No messages yet.</p>
                    )}
                </div>

                {ticket.status !== 'closed' && (
                    <div className="mt-6">
                        <AddNoteForm ticketId={ticket._id} />
                    </div>
                )}
            </div>
        </div>
    );
}
