"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Globe, Trash2 } from "lucide-react";
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
import { deletePage } from "@/lib/actions/page-builder.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PageListClientProps {
    pages: any[];
}

export function PageListClient({ pages: initialPages }: PageListClientProps) {
    const router = useRouter();
    const [pages, setPages] = useState(initialPages);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!deleteId) return;

        setDeleting(true);
        try {
            const result = await deletePage(deleteId);
            if (result.success) {
                toast.success("Page deleted successfully");
                setPages(pages.filter(p => p._id !== deleteId));
                router.refresh();
            } else {
                toast.error(result.error || "Failed to delete page");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setDeleting(false);
            setDeleteId(null);
        }
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pages.map((page: any) => (
                    <Card key={page._id} className="group hover:shadow-lg transition-all duration-200">
                        <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                                <CardTitle className="text-lg line-clamp-1">{page.name}</CardTitle>
                                <Badge variant={page.isPublished ? "default" : "secondary"}>
                                    {page.isPublished ? "Published" : "Draft"}
                                </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">/{page.slug}</p>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                                <span>{page.sections?.length || 0} sections</span>
                                <span>•</span>
                                <span>Updated {new Date(page.updatedAt).toLocaleDateString()}</span>
                            </div>

                            <div className="flex gap-2">
                                <Link href={`/admin/page-builder/${page._id}`} className="flex-1">
                                    <Button variant="outline" size="sm" className="w-full gap-2">
                                        <Edit className="h-3 w-3" />
                                        Edit
                                    </Button>
                                </Link>
                                {page.isPublished && (
                                    <Link href={`/p/${page.slug}`} target="_blank">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Globe className="h-3 w-3" />
                                            View
                                        </Button>
                                    </Link>
                                )}
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2 text-destructive hover:text-destructive hover:bg-destructive/10"
                                    onClick={() => setDeleteId(page._id)}
                                >
                                    <Trash2 className="h-3 w-3" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}

                {pages.length === 0 && (
                    <div className="col-span-full">
                        <Card className="border-dashed">
                            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                                <div className="rounded-full bg-primary/10 p-4 mb-4">
                                    <Plus className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-lg font-semibold mb-2">No pages yet</h3>
                                <p className="text-muted-foreground mb-6 max-w-sm">
                                    Get started by creating your first page with our visual builder
                                </p>
                                <Link href="/admin/page-builder/create">
                                    <Button>Create Your First Page</Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                )}
            </div>

            <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the page and all its content.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={deleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
