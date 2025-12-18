import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { getNicheBoxes } from "@/lib/actions/niche.actions";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function NicheBoxesPage() {
    const niches = await getNicheBoxes();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Niche Boxes</h1>
                <Link href="/admin/niche-boxes/create">
                    <Button>
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Niche Box
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Keywords</TableHead>
                            <TableHead>Downloads</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {niches.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No niche boxes found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            niches.map((niche: any) => (
                                <TableRow key={niche._id}>
                                    <TableCell className="font-medium">{niche.title}</TableCell>
                                    <TableCell>{niche.keywords?.length || 0}</TableCell>
                                    <TableCell>{niche.downloads?.length || 0}</TableCell>
                                    <TableCell>
                                        {niche.isPublished ? (
                                            <Badge className="bg-emerald-500">Published</Badge>
                                        ) : (
                                            <Badge variant="secondary">Draft</Badge>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link href={`/admin/niche-boxes/${niche._id}`}>
                                            <Button variant="ghost" size="sm">
                                                Edit
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
