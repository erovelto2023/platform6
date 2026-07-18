import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Search, Users, MoreHorizontal, Mail, Phone, MapPin, ChevronLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getClients } from "@/lib/actions/client.actions";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ClientForm } from "@/components/accounting/ClientForm";

export default async function ClientsPage() {
    const { data: clients } = await getClients();

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    
                    <div className="mt-4">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Clients</h1>
                        <p className="text-slate-400">Manage your customer database.</p>
                    </div>
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-sky-600 hover:bg-sky-700">
                            <Plus className="mr-2 h-4 w-4" /> Add Client
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px] bg-[#0d1117] border-slate-800 text-white dark">
                        <DialogHeader>
                            <DialogTitle>Add New Client</DialogTitle>
                            <DialogDescription>
                                Add a new client to your accounting system.
                            </DialogDescription>
                        </DialogHeader>
                        <ClientForm />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-800/80 flex gap-4">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                        <Input
                            type="search"
                            placeholder="Search clients..."
                            className="pl-9 bg-[#07090e] border-slate-800/80"
                        />
                    </div>
                </div>

                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#07090e] border-slate-800/80 hover:bg-[#07090e]">
                            <TableHead className="font-medium text-slate-400">Name</TableHead>
                            <TableHead className="font-medium text-slate-400">Contact Info</TableHead>
                            <TableHead className="font-medium text-slate-400">Address</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {clients && clients.length > 0 ? (
                            clients.map((client: any) => (
                                <TableRow key={client._id} className="hover:bg-[#07090e]/50">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="text-white">{client.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1 text-sm text-slate-400">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-3 w-3" />
                                                {client.email}
                                            </div>
                                            {client.phone && (
                                                <div className="flex items-center gap-2">
                                                    <Phone className="h-3 w-3" />
                                                    {client.phone}
                                                </div>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {client.address?.city ? (
                                            <div className="flex items-center gap-2 text-sm text-slate-400">
                                                <MapPin className="h-3 w-3" />
                                                {client.address.city}, {client.address.state}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">No address</span>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                <DropdownMenuItem>View details</DropdownMenuItem>
                                                <DropdownMenuItem>Edit client</DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                <DropdownMenuItem>Create invoice</DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-slate-400">
                                    No clients found. Add your first client to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
