
import { Plus, Pencil, Trash2, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search } from "@/components/ui/Search";
import { BackButton } from "@/components/accounting/BackButton";
import { getVendors, deleteVendor } from "@/lib/actions/vendor.actions";
import { Badge } from "@/components/ui/badge";

interface VendorsPageProps {
    searchParams: {
        page?: string;
        query?: string;
    };
}

export default async function VendorsPage(props: VendorsPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";

    const { data: vendors, pagination } = await getVendors(page, 50, query);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <BackButton href="/accounting" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Vendors</h1>
                    <p className="text-muted-foreground">Manage your suppliers and vendors.</p>
                </div>
                <Link href="/accounting/vendors/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Vendor
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <Search placeholder="Search vendors..." />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                            <TableHead className="font-medium text-slate-600">Vendor Name</TableHead>
                            <TableHead className="font-medium text-slate-600">Contact Person</TableHead>
                            <TableHead className="font-medium text-slate-600">Email</TableHead>
                            <TableHead className="font-medium text-slate-600">Phone</TableHead>
                            <TableHead className="w-[80px]"></TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {vendors && vendors.length > 0 ? (
                            vendors.map((vendor: any) => (
                                <TableRow key={vendor._id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex flex-col">
                                            <span className="font-semibold text-slate-900">{vendor.name}</span>
                                            {vendor.taxId && <span className="text-xs text-slate-500">Tax ID: {vendor.taxId}</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell>{vendor.contactPerson || '-'}</TableCell>
                                    <TableCell>{vendor.email || '-'}</TableCell>
                                    <TableCell>{vendor.phone || '-'}</TableCell>
                                    <TableCell>
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" className="h-8 w-8 p-0">
                                                    <span className="sr-only">Open menu</span>
                                                    <MoreHorizontal className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <Link href={`/accounting/vendors/${vendor._id}/edit`}>
                                                    <DropdownMenuItem>
                                                        <Pencil className="mr-2 h-4 w-4" />
                                                        Edit
                                                    </DropdownMenuItem>
                                                </Link>
                                                <DropdownMenuItem
                                                    className="text-red-600"
                                                // Note: Optimally this should be a client component for delete action
                                                // For now, we'll need to implement a client component wrapper or just link to a delete confirm
                                                >
                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                                    No vendors found. Add your first vendor to get started.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination controls could go here */}
        </div>
    );
}
