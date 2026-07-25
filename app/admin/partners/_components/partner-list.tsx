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
import { processPartnerPayout, updatePartnerCommissionSettings, finalizePartnerCommissions, deletePartnerAccount } from "@/lib/actions/admin.partner.actions";
import { 
    Dialog, 
    DialogContent, 
    DialogHeader, 
    DialogTitle, 
    DialogTrigger,
    DialogFooter
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RefreshCcw, DollarSign, Settings, Search, Trash, ShieldCheck } from "lucide-react";

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
    payoutEmail?: string;
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
        <div className="space-y-6 font-sans">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search partners by name, email or code..." 
                        className="pl-10 bg-slate-950 border-slate-800 text-slate-100 placeholder:text-slate-500 rounded-2xl text-xs font-mono"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button 
                    onClick={onFinalize} 
                    disabled={loading}
                    className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs font-extrabold flex items-center gap-2 transition shadow-lg shadow-indigo-600/30 cursor-pointer disabled:opacity-50"
                >
                    <RefreshCcw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Finalize Eligible Commissions
                </button>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900 overflow-hidden shadow-2xl">
                <Table>
                    <TableHeader className="bg-slate-950">
                        <TableRow className="border-b border-slate-800/80">
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Partner</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Recruited By</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Code</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Commission</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Pending</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Balance</TableHead>
                            <TableHead className="text-slate-300 font-extrabold text-xs uppercase tracking-wider">Referrals</TableHead>
                            <TableHead className="text-right text-slate-300 font-extrabold text-xs uppercase tracking-wider">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="divide-y divide-slate-800/80">
                        {filteredPartners.map((partner) => (
                            <TableRow key={partner._id} className="hover:bg-slate-950/60 transition">
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-slate-100 text-sm">{partner.userId.firstName} {partner.userId.lastName}</span>
                                        <span className="text-xs text-slate-400 font-mono mt-0.5">{partner.userId.email}</span>
                                        {partner.payoutEmail && (
                                            <div className="mt-1.5 flex items-center gap-1.5 text-[10px] font-mono font-extrabold text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded-lg border border-indigo-800 w-fit">
                                                PayPal: {partner.payoutEmail}
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {partner.userId.referredBy ? (
                                        <div className="flex flex-col">
                                            <span className="text-xs font-extrabold text-slate-200">
                                                {partner.userId.referredBy.firstName} {partner.userId.referredBy.lastName}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-xs text-slate-500 font-mono italic">Organic</span>
                                    )}
                                </TableCell>
                                <TableCell>
                                    <code className="bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-xl text-xs font-mono font-bold text-cyan-400">
                                        {partner.affiliateCode}
                                    </code>
                                </TableCell>
                                <TableCell>
                                    <span className="text-xs font-extrabold text-slate-200">
                                        {partner.commissionValue}{partner.commissionType === 'percentage' ? '%' : '$'}
                                    </span>
                                </TableCell>
                                <TableCell className="text-amber-400 font-extrabold text-xs font-mono">
                                    {formatPrice(partner.pendingAmount)}
                                </TableCell>
                                <TableCell className="font-black text-emerald-400 text-sm font-mono">
                                    {formatPrice(partner.balance)}
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center">
                                        <span className="bg-slate-950 border border-slate-800 px-3 py-1 rounded-full text-xs font-extrabold text-purple-300 font-mono">
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
                                        <DeleteDialog partner={partner} />
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
                <button className="px-3 py-1.5 bg-indigo-950 border border-indigo-800 text-indigo-300 hover:bg-indigo-900 rounded-xl text-xs font-bold flex items-center gap-1 transition">
                    <DollarSign className="h-3.5 w-3.5" /> Payout
                </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 font-black">Process Partner Payout</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="p-4 bg-slate-950 border border-indigo-900/60 rounded-2xl">
                        <p className="text-xs text-indigo-300 font-mono">Available Balance: <span className="font-black text-emerald-400 text-base">{formatPrice(partner.balance)}</span></p>
                    </div>
                    {partner.payoutEmail ? (
                        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-1">
                            <p className="text-[10px] uppercase font-bold text-slate-400 font-mono">PayPal Recipient Email</p>
                            <p className="text-sm font-extrabold text-slate-100 font-mono">{partner.payoutEmail}</p>
                        </div>
                    ) : (
                        <div className="p-4 bg-rose-950/60 border border-rose-800 rounded-2xl">
                            <p className="text-xs text-rose-300 font-bold italic">No payout email provided by user.</p>
                        </div>
                    )}
                    <div className="space-y-2">
                        <Label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Amount to pay out ($)</Label>
                        <Input 
                            type="number" 
                            value={amount} 
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <button
                        onClick={() => onPayout(partner._id, amount)}
                        disabled={partner.balance < amount || amount <= 0}
                        className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-emerald-600/30 disabled:opacity-50 cursor-pointer"
                    >
                        Confirm Payout
                    </button>
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
                <button className="p-1.5 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-400 hover:text-white rounded-xl transition">
                    <Settings className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-slate-100 font-black">Partner Commission Settings Override</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-4">
                    <div className="space-y-2">
                        <Label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Commission Type</Label>
                        <select 
                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-2xl text-xs font-bold"
                            value={type}
                            onChange={(e: any) => setType(e.target.value)}
                        >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Rate ($)</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-extrabold text-slate-200 uppercase tracking-wider">Commission Value</Label>
                        <Input 
                            type="number" 
                            value={value} 
                            onChange={(e) => setValue(Number(e.target.value))}
                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <button
                        onClick={onUpdate}
                        disabled={loading}
                        className="px-5 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-cyan-600/30 disabled:opacity-50 cursor-pointer"
                    >
                        Save Changes
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const DeleteDialog = ({ partner }: { partner: Partner }) => {
    const [loading, setLoading] = useState(false);

    const onDelete = async () => {
        setLoading(true);
        try {
            const result = await deletePartnerAccount(partner._id);
            if (result.success) {
                toast.success("Partner removed successfully");
                window.location.reload();
            } else {
                toast.error(result.error || "Deletion failed");
            }
        } catch (error) {
            toast.error("An error occurred during deletion");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="p-1.5 bg-slate-950 border border-slate-800 hover:border-rose-500 text-rose-400 hover:bg-rose-950 rounded-xl transition">
                    <Trash className="h-4 w-4" />
                </button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border border-slate-800 text-slate-100 font-sans shadow-2xl">
                <DialogHeader>
                    <DialogTitle className="text-rose-400 font-black">Remove Partner Status</DialogTitle>
                </DialogHeader>
                <div className="py-4 space-y-3">
                    <p className="text-xs text-slate-300">
                        Are you sure you want to remove <span className="font-extrabold text-white">{partner.userId.firstName} {partner.userId.lastName}</span> as a partner?
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-400 list-disc pl-4 font-mono">
                        <li>Their affiliate link and code will be deactivated.</li>
                        <li>Their partner dashboard will be hidden.</li>
                        <li>Their existing balance and commissions will be preserved but inaccessible.</li>
                        <li>The base user account will <span className="font-bold text-white">not</span> be deleted.</li>
                    </ul>
                </div>
                <DialogFooter className="flex gap-2">
                    <DialogTrigger asChild>
                        <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-2xl text-xs font-bold">
                            Cancel
                        </button>
                    </DialogTrigger>
                    <button
                        onClick={onDelete}
                        disabled={loading}
                        className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-extrabold transition shadow-lg shadow-rose-600/30 disabled:opacity-50 cursor-pointer"
                    >
                        {loading ? "Removing..." : "Remove Partner Account"}
                    </button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};
