import { getUserTickets } from "@/lib/actions/ticket.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default async function SupportPage() {
    const tickets = await getUserTickets();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage your support requests</p>
                </div>
                <Link href="/support/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Ticket
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Subject</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Priority</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tickets.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket: any) => (
                                <TableRow key={ticket._id}>
                                    <TableCell className="font-medium">{ticket.title}</TableCell>
                                    <TableCell>
                                        <Badge variant={
                                            ticket.status === 'Open' ? 'default' :
                                                ticket.status === 'In Progress' ? 'secondary' : 'outline'
                                        }>
                                            {ticket.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className={
                                            ticket.priority === 'High' ? 'text-red-500 font-medium' :
                                                ticket.priority === 'Medium' ? 'text-yellow-600' : 'text-slate-500'
                                        }>
                                            {ticket.priority}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(ticket.updatedAt), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/support/${ticket._id}`}>
                                            <Button variant="ghost" size="sm">
                                                View
                                            </Button>
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
