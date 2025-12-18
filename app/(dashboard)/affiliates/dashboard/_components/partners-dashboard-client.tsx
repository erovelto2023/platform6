"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, ExternalLink, MoreHorizontal } from "lucide-react";
import Link from "next/link";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

interface PartnersDashboardClientProps {
    initialPartners: any[];
}

export default function PartnersDashboardClient({ initialPartners }: PartnersDashboardClientProps) {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const filteredPartners = initialPartners.filter(partner => {
        const queryLower = query.toLowerCase();
        const matchesName = partner.companyId.name.toLowerCase().includes(queryLower);
        const matchesNetwork = partner.companyId.affiliateNetwork?.toLowerCase().includes(queryLower);
        const matchesKeywords = partner.companyId.keywords?.some((k: string) => k.toLowerCase().includes(queryLower));

        const matchesQuery = matchesName || matchesNetwork || matchesKeywords;
        const matchesStatus = statusFilter ? partner.status === statusFilter : true;
        return matchesQuery && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
                <div className="relative flex-1 w-full md:max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                        placeholder="Search partners..."
                        className="pl-10"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="w-full md:w-auto">
                                <Filter className="h-4 w-4 mr-2" />
                                Filter Status
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                                All Statuses
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("active")}>
                                Active
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("interested")}>
                                Interested
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("applied")}>
                                Applied
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setStatusFilter("approved")}>
                                Approved
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Partner</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Network</TableHead>
                                <TableHead>Commission</TableHead>
                                <TableHead>Earnings</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredPartners.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-slate-500">
                                        No partners found matching your search.
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredPartners.map((partner) => (
                                    <TableRow key={partner._id}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-8 w-8 rounded-md bg-slate-100 flex items-center justify-center font-bold text-slate-500 text-xs">
                                                    {partner.companyId.logo ? (
                                                        <img src={partner.companyId.logo} alt={partner.companyId.name} className="h-full w-full object-contain" />
                                                    ) : (
                                                        partner.companyId.name[0]
                                                    )}
                                                </div>
                                                <span className="font-medium">{partner.companyId.name}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge variant={partner.status === 'active' ? 'default' : 'secondary'} className="capitalize">
                                                {partner.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>{partner.companyId.affiliateNetwork || "Direct"}</TableCell>
                                        <TableCell>{partner.companyId.commissionRate || "N/A"}</TableCell>
                                        <TableCell>${partner.totalEarnings?.toFixed(2) || "0.00"}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/affiliates/${partner.companyId._id}`}>
                                                    <Button variant="ghost" size="sm">
                                                        Manage
                                                    </Button>
                                                </Link>
                                                {partner.companyId.website && (
                                                    <a href={partner.companyId.website} target="_blank" rel="noopener noreferrer">
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Button>
                                                    </a>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
