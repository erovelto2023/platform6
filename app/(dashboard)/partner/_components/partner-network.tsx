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
        <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                    <CardTitle className="text-xl">My Network</CardTitle>
                    <p className="text-xs text-muted-foreground mt-1">
                        People who joined through your referral links.
                    </p>
                </div>
                <UserCheck className="h-5 w-5 text-indigo-600" />
            </CardHeader>
            <CardContent>
                {referrals.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground bg-slate-50 border rounded-lg">
                        <p>No referrals found yet.</p>
                        <p className="text-xs mt-1">Start sharing your links to build your network!</p>
                    </div>
                ) : (
                    <div className="rounded-md border overflow-hidden">
                        <Table>
                            <TableHeader className="bg-slate-50">
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead className="text-right">Joined Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {referrals.map((user) => (
                                    <TableRow key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <TableCell className="font-medium">
                                            {user.firstName} {user.lastName}
                                        </TableCell>
                                        <TableCell className="text-xs text-muted-foreground font-mono">
                                            {user.email.replace(/(.{3}).*(@.*)/, '$1***$2')}
                                        </TableCell>
                                        <TableCell className="text-right text-xs opacity-70">
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
