
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Globe, User, Key } from "lucide-react";
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
import { getCredentials } from "@/lib/actions/credential.actions";
import { CredentialActions } from "@/components/accounting/CredentialActions";

interface CredentialsPageProps {
    searchParams: {
        page?: string;
        query?: string;
    };
}

export default async function CredentialsPage(props: CredentialsPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";

    const { data: credentials, pagination } = await getCredentials(page, 50, query);

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    <BackButton href="/accounting" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Logins & Passwords</h1>
                    <p className="text-muted-foreground">Manage your website logins and secure notes.</p>
                </div>
                <Link href="/accounting/credentials/new">
                    <Button className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Login
                    </Button>
                </Link>
            </div>

            <div className="flex items-center gap-4 mb-4">
                <Search placeholder="Search logins..." />
            </div>

            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-slate-50 border-slate-200 hover:bg-slate-50">
                            <TableHead className="font-medium text-slate-600">Service</TableHead>
                            <TableHead className="font-medium text-slate-600">Username/Email</TableHead>
                            <TableHead className="font-medium text-slate-600">URL</TableHead>
                            <TableHead className="font-medium text-slate-600 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {credentials && credentials.length > 0 ? (
                            credentials.map((cred: any) => (
                                <TableRow key={cred._id} className="hover:bg-slate-50/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-slate-100 flex items-center justify-center text-slate-500">
                                                <Key className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold text-slate-900">{cred.serviceName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-600">
                                            <User className="h-3 w-3" />
                                            {cred.username || '-'}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        {cred.url ? (
                                            <a
                                                href={cred.url.startsWith('http') ? cred.url : `https://${cred.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-2 text-blue-600 hover:underline"
                                            >
                                                <Globe className="h-3 w-3" />
                                                {cred.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}
                                            </a>
                                        ) : (
                                            <span className="text-slate-400">-</span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <CredentialActions credential={cred} />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={4} className="h-24 text-center text-muted-foreground">
                                    No logins found. Add your first credential to keep it safe.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
