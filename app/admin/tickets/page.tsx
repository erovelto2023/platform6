import { getAllTickets } from "@/lib/actions/ticket.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DeleteTicketButton } from "./_components/delete-button";
import { FileQuestion } from "lucide-react";

export default async function AdminTicketsPage() {
    const tickets = await getAllTickets();

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="flex items-center justify-between bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
                        <FileQuestion size={24} className="text-rose-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 uppercase">
                            Support Tickets Manager
                        </h1>
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Customer Service & Help Desk Queue</p>
                    </div>
                </div>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
                <div className="grid grid-cols-[120px_2fr_1.5fr_1.5fr_100px_120px] gap-4 bg-slate-950 p-4 font-mono font-extrabold text-xs uppercase text-slate-300 border-b border-slate-800">
                    <div>Date</div>
                    <div>User</div>
                    <div>Subject</div>
                    <div>Last Updated</div>
                    <div>Status</div>
                    <div className="text-right">Action</div>
                </div>
                {tickets.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 font-mono font-bold uppercase text-xs tracking-widest">
                        No support tickets found.
                    </div>
                ) : (
                    tickets.map((ticket: any) => (
                        <div key={ticket._id} className="grid grid-cols-[120px_2fr_1.5fr_1.5fr_100px_120px] gap-4 p-4 items-center text-xs border-b border-slate-800/80 last:border-0 hover:bg-slate-950/60 transition text-slate-200">
                            <div className="font-mono text-slate-400">
                                {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                            </div>
                            <div className="flex flex-col overflow-hidden">
                                <span className="font-extrabold text-slate-100 truncate">{ticket.userInfo?.name}</span>
                                <span className="text-[10px] text-cyan-400 font-mono truncate">{ticket.userInfo?.email}</span>
                            </div>
                            <div className="truncate font-bold text-slate-300">
                                {ticket.subject || ticket.product}
                            </div>
                            <div className="font-mono text-slate-400">
                                {format(new Date(ticket.lastMessageAt || ticket.createdAt), 'MMM d, h:mm a')}
                            </div>
                            <div>
                                <Badge className={`text-[9px] font-mono font-bold uppercase py-0.5 px-2 rounded-xl border ${
                                    ticket.status === 'new' 
                                        ? 'bg-slate-950 text-emerald-400 border-emerald-800' 
                                        : ticket.status === 'open' 
                                            ? 'bg-slate-950 text-cyan-400 border-cyan-800' 
                                            : 'bg-slate-950 text-slate-400 border-slate-800'
                                }`}>
                                    {ticket.status}
                                </Badge>
                            </div>
                            <div className="text-right flex items-center justify-end gap-2">
                                <Link href={`/admin/tickets/${ticket._id}`}>
                                    <Button variant="ghost" size="sm" className="h-8 px-3 text-xs font-bold bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl">
                                        Manage
                                    </Button>
                                </Link>
                                <DeleteTicketButton ticketId={ticket._id} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
