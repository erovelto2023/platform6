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
        <div className="font-sans">
            <Table>
                <TableHeader className="bg-slate-950">
                    <TableRow className="border-b border-slate-800/80">
                        <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Name</TableHead>
                        <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Location</TableHead>
                        <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Type</TableHead>
                        <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Categories</TableHead>
                        <TableHead className="text-right text-slate-300 font-extrabold text-xs uppercase tracking-wider">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody className="divide-y divide-slate-800/80 bg-slate-950">
                    {suppliers.map((supplier) => (
                        <TableRow key={supplier._id} className="hover:bg-slate-900/60 transition">
                            <TableCell className="font-extrabold text-slate-100">{supplier.name}</TableCell>
                            <TableCell className="text-xs text-slate-300 font-mono">
                                {supplier.location?.city}, {supplier.location?.state}
                            </TableCell>
                            <TableCell>
                                <span className="bg-slate-900 border border-slate-800 text-cyan-300 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase">
                                    {supplier.wholesaleType}
                                </span>
                            </TableCell>
                            <TableCell className="max-w-[200px] truncate text-xs text-slate-400 font-mono">
                                {supplier.categories?.join(", ")}
                            </TableCell>
                            <TableCell className="text-right space-x-2">
                                <Link href={`/admin/wholesale-directory/edit/${supplier._id}`}>
                                    <Button variant="ghost" size="icon" className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white rounded-xl transition">
                                        <Edit className="h-4 w-4" />
                                    </Button>
                                </Link>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="p-2 bg-slate-900 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-xl transition"
                                    onClick={() => setDeletingId(supplier._id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {suppliers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-slate-400 font-mono font-bold uppercase text-xs tracking-widest">
                                No suppliers found. Add one to get started.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <AlertDialog open={!!deletingId} onOpenChange={(open) => !open && setDeletingId(null)}>
                <AlertDialogContent className="bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="text-slate-100 font-black">Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription className="text-slate-400 text-xs font-mono">
                            This action cannot be undone. This will permanently delete the supplier.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex gap-2">
                        <AlertDialogCancel className="bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold border-0">Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-extrabold border-0">Delete Supplier</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
