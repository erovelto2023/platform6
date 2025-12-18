"use client";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { deleteSupplier } from "@/lib/actions/supplier.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SupplierAdminTableProps {
    suppliers: any[];
}

export function SupplierAdminTable({ suppliers }: SupplierAdminTableProps) {
    const router = useRouter();
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const handleDelete = async () => {
        if (!deletingId) return;
        try {
            await deleteSupplier(deletingId);
            toast.success("Supplier deleted successfully");
            router.refresh();
        } catch (error) {
            toast.error("Failed to delete supplier");
        } finally {
            setDeletingId(null);
        }
    };

    return (
        <>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Categories</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {suppliers.map((supplier) => (
                        <TableRow key={supplier._id}>
                            <TableCell className="font-medium">{supplier.name}</TableCell>
                            <TableCell>
                                {supplier.location?.city}, {supplier.location?.state}
                            </TableCell>
                            <TableCell>{supplier.wholesaleType}</TableCell>
                            <TableCell className="max-w-[200px] truncate">
                                {supplier.categories?.join(", ")}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Link href={`/admin/wholesale-directory/edit/${supplier._id}`}>
                                    <Button variant="ghost" size="icon">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                                    onClick={() => setDeletingId(supplier._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {suppliers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                No suppliers found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the supplier.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
