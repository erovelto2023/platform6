import { getAllTickets } from "@/lib/actions/ticket.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default async function AdminTicketsPage() {
    const tickets = await getAllTickets();

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Support Tickets</h1>
                    <p className="text-muted-foreground">Manage user support requests</p>
                </div>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User</TableHead>
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
                                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                                    No tickets found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            tickets.map((ticket: any) => (
                                <TableRow key={ticket._id}>
                                    <TableCell>
                                        <div className="flex items-center gap-x-2">
                                            <Avatar className="h-8 w-8">
                                                <AvatarImage src={ticket.userId?.avatar} />
                                                <AvatarFallback>
                                                    {ticket.userId?.firstName?.[0]}
                                                    {ticket.userId?.lastName?.[0]}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col text-sm">
                                                <span className="font-medium">
                                                    {ticket.userId?.firstName} {ticket.userId?.lastName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {ticket.userId?.email}
                                                </span>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-medium max-w-[200px] truncate" title={ticket.title}>
                                        {ticket.title}
                                    </TableCell>
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
                                        <Link href={`/admin/tickets/${ticket._id}`}>
                                            <Button variant="ghost" size="sm">
                                                Manage
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
