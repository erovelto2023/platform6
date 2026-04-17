"use client";

import { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatPrice } from "@/lib/format";
import { toast } from "sonner";
import { processPartnerPayout, updatePartnerCommissionSettings, finalizePartnerCommissions } from "@/lib/actions/admin.partner.actions";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCcw, DollarSign, Settings, Search } from "lucide-react";

interface Partner {
    _id: string;
    userId: {
        firstName: string;
        lastName: string;
        email: string;
        referredBy?: {
            firstName: string;
            lastName: string;
        };
    };
    affiliateCode: string;
    balance: number;
    pendingAmount: number;
    commissionType: 'percentage' | 'flat';
    commissionValue: number;
    referralCount: number;
}

interface PartnerListProps {
    partners: Partner[];
}

export const PartnerList = ({ partners: initialPartners }: PartnerListProps) => {
    const [partners, setPartners] = useState(initialPartners);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    const filteredPartners = partners.filter(p => 
        p.userId.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.affiliateCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        `${p.userId.firstName} ${p.userId.lastName}`.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const onFinalize = async () => {
        setLoading(true);
        try {
            const result = await finalizePartnerCommissions();
            if (result.success) {
                toast.success(`Processed ${result.count} eligible commissions`);
                // Ideally refresh data here
                window.location.reload();
            }
        } catch (error) {
            toast.error("Failed to finalize commissions");
        } finally {
            setLoading(false);
        }
    };

    const handlePayout = async (partnerId: string, amount: number) => {
        if (!amount || amount <= 0) return;
        try {
            const result = await processPartnerPayout(partnerId, amount);
            if (result.success) {
                toast.success("Payout processed successfully");
                window.location.reload();
            } else {
                toast.error(result.error || "Payout failed");
            }
        } catch (error) {
            toast.error("Payout failed");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search partners..." 
                        className="pl-10"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <Button 
                    onClick={onFinalize} 
                    disabled={loading}
                    className="bg-indigo-600 hover:bg-indigo-700"
                >
                    <RefreshCcw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                    Finalize Eligible Commissions
                </Button>
            </div>

            <div className="rounded-xl border bg-white overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Partner</TableHead>
                            <TableHead>Recruited By</TableHead>
                            <TableHead>Code</TableHead>
                            <TableHead>Commission</TableHead>
                            <TableHead>Pending</TableHead>
                            <TableHead>Balance</TableHead>
                            <TableHead>Referrals</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPartners.map((partner) => (
                            <TableRow key={partner._id} className="hover:bg-slate-50/50">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-900">{partner.userId.firstName} {partner.userId.lastName}</span>
                                        <span className="text-xs text-slate-500">{partner.userId.email}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {partner.userId.referredBy ? (
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-slate-700">
                                                {partner.userId.referredBy.firstName} {partner.userId.referredBy.lastName}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-400 italic">Organic</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <code className="bg-slate-100 px-2 py-1 rounded text-xs font-mono">
                                        {partner.affiliateCode}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <span className="text-sm">
                                        {partner.commissionValue}{partner.commissionType === 'percentage' ? '%' : '$'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-amber-600 font-medium">
                                    {formatPrice(partner.pendingAmount)}
                                </TableCell>
                                <TableCell className="font-bold text-indigo-600">
                                    {formatPrice(partner.balance)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className="bg-slate-100 px-2.5 py-1 rounded-full text-xs font-bold text-slate-700">
                                            {partner.referralCount || 0}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <PayoutDialog 
                                            partner={partner} 
                                            onPayout={handlePayout} 
                                        />
                                        <SettingsDialog partner={partner} />
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

const PayoutDialog = ({ partner, onPayout }: { partner: Partner, onPayout: any }) => {
    const [amount, setAmount] = useState(partner.balance);
    
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                    <DollarSign className="h-3.5 w-3.5 mr-1" />
                    Payout
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Process Payout</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-4 bg-indigo-50 rounded-lg">
                        <p className="text-sm text-indigo-700">Available Balance: <span className="font-bold">{formatPrice(partner.balance)}</span></p>
                    </div>
                    <div className="space-y-2">
                        <Label>Amount to pay out</Label>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(Number(e.target.value))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={() => onPayout(partner._id, amount)} disabled={partner.balance < amount || amount <= 0}>
                        Confirm Payout
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const SettingsDialog = ({ partner }: { partner: Partner }) => {
    const [type, setType] = useState(partner.commissionType);
    const [value, setValue] = useState(partner.commissionValue);
    const [loading, setLoading] = useState(false);

    const onUpdate = async () => {
        setLoading(true);
        try {
            const result = await updatePartnerCommissionSettings(partner._id, { type, value });
            if (result.success) {
                toast.success("Settings updated");
                window.location.reload();
            }
        } catch (error) {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 text-slate-500">
                    <Settings className="h-3.5 w-3.5" />
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Partner Settings Override</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label>Commission Type</Label>
                        <select 
                            className="w-full p-2 border rounded-md"
                            value={type}
                            onChange={(e: any) => setType(e.target.value)}
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Rate ($)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label>Value</Label>
                        <Input 
                            type="number" 
                            value={value} 
                            onChange={(e) => setValue(Number(e.target.value))}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button onClick={onUpdate} disabled={loading}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
