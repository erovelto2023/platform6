"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { UserCheck } from "lucide-react";

interface Referral {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    createdAt: string;
}

interface PartnerNetworkProps {
    referrals: Referral[];
}

export const PartnerNetwork = ({ referrals }: PartnerNetworkProps) => {
    return (
        <Card className="bg-slate-900 border border-slate-800 shadow-xl text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-800/80">
                <div>
                    <CardTitle className="text-sm font-mono font-bold text-slate-100 uppercase tracking-wider">My Network</CardTitle>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                        People who joined through your referral links.
                    </p>
                </div>
                <UserCheck className="h-4 w-4 text-orange-400" />
            </CardHeader>
            <CardContent className="pt-4">
                {referrals.length === 0 ? (
                    <div className="text-center py-10 text-slate-400 bg-slate-950 border border-slate-800 rounded-2xl">
                        <p className="text-xs font-mono font-bold text-slate-200">No referrals found yet.</p>
                        <p className="text-xs font-mono text-slate-400 mt-1">Start sharing your referral links to build your network!</p>
                    </div>
                ) : (
                    <div className="rounded-xl border border-slate-800 overflow-hidden bg-slate-950">
                        <Table>
                            <TableHeader className="bg-slate-900">
                                <TableRow className="border-slate-800 hover:bg-slate-900">
                                    <TableHead className="text-xs font-mono font-bold text-amber-400 uppercase">User</TableHead>
                                    <TableHead className="text-xs font-mono font-bold text-amber-400 uppercase">Email</TableHead>
                                    <TableHead className="text-right text-xs font-mono font-bold text-amber-400 uppercase">Joined Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referrals.map((user) => (
                                    <TableRow key={user._id} className="border-slate-800 hover:bg-slate-900/60 transition-colors">
                                        <TableCell className="font-bold text-slate-100 text-xs font-mono">
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell className="text-xs text-slate-300 font-mono">
                                            {user.email.replace(/(.{3}).*(@.*)/, '$1***$2')}
                                        </TableCell>
                                        <TableCell className="text-right text-xs font-mono text-slate-400">
                                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};
