import { getAllTickets } from "@/lib/actions/ticket.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";

export default async function AdminTicketsPage() {
    const tickets = await getAllTickets();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Manage Tickets</h1>
            </div>

            <div className="rounded-md border bg-white">
                <div className="grid grid-cols-5 bg-slate-100 p-4 font-medium text-sm text-slate-500 border-b">
                    <div>Date</div>
                    <div>User</div>
                    <div>Product</div>
                    <div>Status</div>
                    <div className="text-right">Action</div>
                </div>
                {tickets.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">
                        No tickets found.
                    </div>
                ) : (
                    tickets.map((ticket: any) => (
                        <div key={ticket._id} className="grid grid-cols-5 p-4 items-center text-sm border-b last:border-0 hover:bg-slate-50/50 transition">
                            <div>
                                {format(new Date(ticket.createdAt), 'MMM d, yyyy')}
                            </div>
                            <div className="flex flex-col">
                                <span className="font-medium">{ticket.userInfo?.name}</span>
                                <span className="text-xs text-muted-foreground">{ticket.userInfo?.email}</span>
                            </div>
                            <div>
                                {ticket.product}
                            </div>
                            <div>
                                <Badge variant={
                                    ticket.status === 'new' ? 'secondary' :
                                        ticket.status === 'open' ? 'default' : 'outline'
                                } className={
                                    ticket.status === 'new' ? 'bg-green-500 hover:bg-green-600 text-white' : ''
                                }>
                                    {ticket.status}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <Link href={`/admin/tickets/${ticket._id}`}>
                                    <Button variant="ghost" size="sm">
                                        Manage
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
