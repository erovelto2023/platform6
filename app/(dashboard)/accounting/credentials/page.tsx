
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal, Globe, User, Key, ChevronLeft } from "lucide-react";
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
import { getCredentials } from "@/lib/actions/credential.actions";
import { CredentialActions } from "@/components/accounting/CredentialActions";

interface CredentialsPageProps {
    searchParams: Promise<{
        page?: string;
        query?: string;
    }>;
}

export default async function CredentialsPage(props: CredentialsPageProps) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams?.page) || 1;
    const query = searchParams?.query || "";

    const { data: credentials, pagination } = await getCredentials(page, 50, query);

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex justify-between items-center">
                <div className="space-y-1">
                    
                    <h1 className="text-3xl font-bold tracking-tight text-white">Logins & Passwords</h1>
                    <p className="text-slate-400">Manage your website logins and secure notes.</p>
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

            <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-[#07090e] border-slate-800/80 hover:bg-[#07090e]">
                            <TableHead className="font-medium text-slate-400">Service</TableHead>
                            <TableHead className="font-medium text-slate-400">Username/Email</TableHead>
                            <TableHead className="font-medium text-slate-400">URL</TableHead>
                            <TableHead className="font-medium text-slate-400 text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {credentials && credentials.length > 0 ? (
                            credentials.map((cred: any) => (
                                <TableRow key={cred._id} className="hover:bg-[#07090e]/50">
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <div className="h-8 w-8 rounded bg-slate-800 flex items-center justify-center text-slate-500">
                                                <Key className="h-4 w-4" />
                                            </div>
                                            <span className="font-semibold text-white">{cred.serviceName}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2 text-slate-400">
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
                                <TableCell colSpan={4} className="h-24 text-center text-slate-400">
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
