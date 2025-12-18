import { getSurveys } from "@/lib/services/survey.service";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, FileText, BarChart2, MoreVertical } from "lucide-react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default async function SurveysPage() {
    const surveys = await getSurveys();

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Surveys</h1>
                    <p className="text-slate-500 mt-2">Manage your surveys, polls, and feedback forms.</p>
                </div>
                <Link href="/admin/surveys/create">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Survey
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-lg border shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Responses</TableHead>
                            <TableHead>Created</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {surveys.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-12 text-slate-500">
                                    No surveys found. Create one to get started.
                                </TableCell>
                            </TableRow>
                        ) : (
                            surveys.map((survey: any) => (
                                <TableRow key={survey._id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-slate-400" />
                                            <Link href={`/admin/surveys/${survey._id}`} className="hover:underline">
                                                {survey.title}
                                            </Link>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={survey.status === "Active" ? "default" : "secondary"}>
                                            {survey.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>{survey.stats?.responseCount || 0}</TableCell>
                                    <TableCell>{format(new Date(survey.createdAt), "MMM d, yyyy")}</TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon">
                                                    <MoreVertical className="h-4 w-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/surveys/${survey._id}`}>Edit</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem asChild>
                                                    <Link href={`/admin/surveys/${survey._id}/results`}>View Results</Link>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-red-600">
                                                    Delete
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
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
