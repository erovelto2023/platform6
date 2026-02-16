
"use client";

import { useEffect, useState } from "react";
import { getContacts, deleteContact } from "@/lib/actions/contact.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MoreHorizontal, Loader2, Trash, Edit } from "lucide-react";
import { ContactForm } from "./ContactForm";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

export function ContactList() {
    const [contacts, setContacts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedContact, setSelectedContact] = useState<any>(null);

    useEffect(() => {
        loadContacts();
    }, []);

    async function loadContacts() {
        setLoading(true);
        const res = await getContacts(searchTerm);
        if (res.success) {
            setContacts(res.data);
        }
        setLoading(false);
    }

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            loadContacts();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    const handleEdit = (contact: any) => {
        setSelectedContact(contact);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedContact(null);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this contact?")) return;
        const res = await deleteContact(id);
        if (res.success) {
            toast.success("Contact deleted");
            loadContacts();
        } else {
            toast.error("Failed to delete contact");
        }
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        loadContacts(); // Refresh list on close
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative flex-1 w-full sm:max-w-sm">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-slate-500" />
                    <Input
                        placeholder="Search contacts..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Export</Button>
                    <Button onClick={handleCreate} className="bg-indigo-600 hover:bg-indigo-700">
                        <Plus className="mr-2 h-4 w-4" /> Add Contact
                    </Button>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="pl-6">Contact</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Tags</TableHead>
                                <TableHead>Total Bookings</TableHead>
                                <TableHead className="text-right pr-6">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-24 text-center">
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin inline" /> Loading...
                                    </TableCell>
                                </TableRow>
                            ) : contacts.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="bg-slate-100 p-3 rounded-full">
                                                <Search className="h-6 w-6 text-slate-400" />
                                            </div>
                                            <p>No contacts found</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                contacts.map((contact) => (
                                    <TableRow key={contact._id}>
                                        <TableCell className="pl-6 font-medium">{contact.name}</TableCell>
                                        <TableCell>{contact.email}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-1 flex-wrap">
                                                {contact.tags?.map((tag: string) => (
                                                    <Badge key={tag} variant="secondary" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </TableCell>
                                        <TableCell>{contact.totalBookings || 0}</TableCell>
                                        <TableCell className="text-right pr-6">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuItem onClick={() => handleEdit(contact)}>
                                                        <Edit className="mr-2 h-4 w-4" /> Edit
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(contact._id)}>
                                                        <Trash className="mr-2 h-4 w-4" /> Delete
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isModalOpen && (
                <ContactForm
                    contact={selectedContact}
                    open={isModalOpen}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}
