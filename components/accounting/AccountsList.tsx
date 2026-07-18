"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { 
    Wallet, CreditCard, DollarSign, MoreHorizontal, Pencil, Trash2, 
    ArrowUpRight, ArrowDownRight, Scale, Briefcase, Plus, Search, Building2
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { deleteAccount } from "@/lib/actions/account.actions";
import { AccountForm } from "./AccountForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";

interface AccountsListProps {
    accounts: any[];
}

export default function AccountsList({ accounts }: AccountsListProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();

    const [activeTab, setActiveTab] = useState<"all" | "bank" | "credit" | "processor">("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingAccount, setEditingAccount] = useState<any | null>(null);

    // Dynamic Calculations
    const bankTypes = ["Bank", "Cash"];
    const cardTypes = ["Credit Card"];
    const processorTypes = ["PayPal", "Stripe", "Venmo", "Cash App"];

    const totalAssets = accounts
        .filter(acc => [...bankTypes, ...processorTypes].includes(acc.type))
        .reduce((s, acc) => s + (acc.balance || 0), 0);

    const totalLiabilities = accounts
        .filter(acc => cardTypes.includes(acc.type))
        .reduce((s, acc) => s + (acc.balance || 0), 0);

    const netLiquidFunds = totalAssets - totalLiabilities;

    // Filter accounts
    const filteredAccounts = accounts.filter(acc => {
        const matchesSearch = acc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                             acc.type.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;

        if (activeTab === "all") return true;
        if (activeTab === "bank") return bankTypes.includes(acc.type);
        if (activeTab === "credit") return cardTypes.includes(acc.type);
        if (activeTab === "processor") return processorTypes.includes(acc.type) || acc.type === "Other";
        
        return true;
    });

    const handleDelete = (accountId: string) => {
        if (!confirm("Are you sure you want to delete this account? Any associated ledger entries may lose their account association.")) return;

        startTransition(async () => {
            try {
                const res = await deleteAccount(accountId);
                if (res.success) {
                    toast.success("Account deleted successfully");
                    router.refresh();
                } else {
                    toast.error(res.error || "Failed to delete account");
                }
            } catch (err) {
                toast.error("An error occurred while deleting the account");
            }
        });
    };

    const getAccountIcon = (type: string) => {
        switch (type) {
            case "Credit Card":
                return <CreditCard className="w-5 h-5 text-rose-400" />;
            case "Bank":
                return <Wallet className="w-5 h-5 text-blue-400" />;
            case "Cash":
                return <DollarSign className="w-5 h-5 text-emerald-400" />;
            case "PayPal":
            case "Stripe":
            case "Venmo":
            case "Cash App":
                return <ArrowUpRight className="w-5 h-5 text-indigo-400" />;
            default:
                return <Briefcase className="w-5 h-5 text-slate-400" />;
        }
    };

    return (
        <div className="space-y-6">
            {/* ── Header Row ── */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-black text-white tracking-tight flex items-center gap-2.5">
                        <Building2 className="w-8 h-8 text-indigo-500" /> Chart of Accounts
                    </h2>
                    <p className="text-sm text-slate-400 mt-1">
                        Manage and track balances across bank accounts, credit cards, and payment gateway assets.
                    </p>
                </div>
                
                <Button 
                    onClick={() => setIsAddOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2 rounded-xl transition-all shadow-lg shadow-indigo-600/20 w-fit"
                >
                    <Plus className="mr-2 h-4 w-4" /> Add Account
                </Button>
            </div>

            {/* ── KPI Grid ────────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <Card className="bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/10 hover:border-emerald-500/20 transition-all rounded-2xl">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Total Assets & Cash</p>
                            <p className="text-2xl font-black text-emerald-400">{formatCurrency(totalAssets)}</p>
                            <p className="text-[10px] text-slate-500">Checking, savings & processors</p>
                        </div>
                        <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-400">
                            <ArrowUpRight className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-rose-950/40 to-slate-900 border border-rose-500/10 hover:border-rose-500/20 transition-all rounded-2xl">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Credit Liabilities</p>
                            <p className="text-2xl font-black text-rose-400">({formatCurrency(totalLiabilities)})</p>
                            <p className="text-[10px] text-slate-500">Total outstanding balance</p>
                        </div>
                        <div className="p-3 bg-rose-500/10 rounded-2xl text-rose-400">
                            <ArrowDownRight className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/10 hover:border-indigo-500/20 transition-all rounded-2xl">
                    <CardContent className="p-5 flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Net Liquid Funds</p>
                            <p className={`text-2xl font-black ${netLiquidFunds >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                                {formatCurrency(netLiquidFunds)}
                            </p>
                            <p className="text-[10px] text-slate-500">Available cash minus card debt</p>
                        </div>
                        <div className="p-3 bg-indigo-500/10 rounded-2xl text-indigo-400">
                            <Scale className="w-6 h-6" />
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* ── Filters & Search ──────────────────────────────────── */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/60 p-4 border border-slate-800/80 rounded-2xl">
                {/* Tabs */}
                <div className="flex gap-1.5 p-1 bg-slate-950/50 rounded-xl border border-slate-800/40 w-full md:w-auto">
                    {[
                        { id: "all", label: "All Accounts" },
                        { id: "bank", label: "Bank & Cash" },
                        { id: "credit", label: "Credit Cards" },
                        { id: "processor", label: "Processors" },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex-1 md:flex-none text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                                activeTab === tab.id
                                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                                    : "text-slate-400 hover:text-slate-200"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Search */}
                <div className="relative w-full md:w-72">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                        type="text"
                        placeholder="Search accounts..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none transition-colors"
                    />
                </div>
            </div>

            {/* ── Accounts List Grid ────────────────────────────────── */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredAccounts.map(account => {
                    const isCredit = account.type === "Credit Card";
                    return (
                        <Card 
                            key={account._id}
                            className="bg-slate-900/50 border border-slate-850 hover:border-slate-700/80 transition-all rounded-2xl group relative overflow-hidden"
                        >
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2.5 bg-slate-950/80 rounded-xl border border-slate-800">
                                            {getAccountIcon(account.type)}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-100 group-hover:text-white transition-colors">
                                                {account.name}
                                            </h3>
                                            <p className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest mt-0.5">
                                                {account.type}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Action Dropdown */}
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-white rounded-lg">
                                                <MoreHorizontal className="h-4 w-4" />
                                            </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="bg-[#0d1117] border-slate-800 text-white">
                                            <DropdownMenuItem 
                                                onClick={() => setEditingAccount(account)}
                                                className="hover:bg-slate-800 cursor-pointer flex items-center gap-2"
                                            >
                                                <Pencil className="w-3.5 h-3.5" /> Edit details
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator className="bg-slate-800" />
                                            <DropdownMenuItem 
                                                onClick={() => handleDelete(account._id)}
                                                className="text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 cursor-pointer flex items-center gap-2"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete account
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                </div>

                                <div className="pt-2 border-t border-slate-800/40 flex justify-between items-end">
                                    <span className="text-xs text-slate-500 font-bold">Balance</span>
                                    <span className={`text-xl font-black tracking-tight ${
                                        isCredit 
                                            ? (account.balance > 0 ? "text-rose-400" : "text-slate-400")
                                            : (account.balance > 0 ? "text-emerald-400" : (account.balance < 0 ? "text-rose-400" : "text-slate-400"))
                                    }`}>
                                        {isCredit && account.balance > 0 ? "(" : ""}
                                        {formatCurrency(account.balance || 0)}
                                        {isCredit && account.balance > 0 ? ")" : ""}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}

                {filteredAccounts.length === 0 && (
                    <div className="col-span-full py-16 text-center border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
                        <Briefcase className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                        <p className="text-sm font-bold text-slate-400">No accounts match the current filter.</p>
                        <p className="text-xs text-slate-500 mt-1">Create a new account or change your search filter.</p>
                    </div>
                )}
            </div>

            {/* ── Add Dialog ── */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="bg-[#0d1117] border-slate-800 text-white dark">
                    <DialogHeader>
                        <DialogTitle>Add New Account</DialogTitle>
                        <DialogDescription>
                            Create a new ledger account to track funds, cash flow, and vendor expenses.
                        </DialogDescription>
                    </DialogHeader>
                    <AccountForm onSuccess={() => setIsAddOpen(false)} />
                </DialogContent>
            </Dialog>

            {/* ── Edit Dialog ──────────────────────────────────────── */}
            <Dialog open={editingAccount !== null} onOpenChange={(open) => !open && setEditingAccount(null)}>
                <DialogContent className="bg-[#0d1117] border-slate-800 text-white dark">
                    <DialogHeader>
                        <DialogTitle>Edit Account Details</DialogTitle>
                        <DialogDescription>
                            Update the information and balance details for this account.
                        </DialogDescription>
                    </DialogHeader>
                    {editingAccount && (
                        <AccountForm 
                            initialData={editingAccount} 
                            onSuccess={() => setEditingAccount(null)} 
                        />
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
