import { BackButton } from "@/components/accounting/BackButton";
import { AccountForm } from "@/components/accounting/AccountForm"; // Need to export this
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAccounts } from "@/lib/actions/account.actions"; // Need to export this
import { formatCurrency } from "@/lib/utils";
import { Plus, Wallet, CreditCard, DollarSign } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default async function AccountsPage() {
    const { data: accounts } = await getAccounts();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Financial Accounts</h2>
                    <p className="text-muted-foreground">
                        Manage your bank accounts, credit cards, and payment processors.
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <BackButton href="/accounting" />
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" />
                                Add Account
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add New Account</DialogTitle>
                                <DialogDescription>
                                    Create a new account to track your funds and expenses.
                                </DialogDescription>
                            </DialogHeader>
                            <AccountForm />
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {accounts?.map((account: any) => (
                    <Card key={account._id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {account.name}
                            </CardTitle>
                            {account.type === 'Bank' && <Wallet className="h-4 w-4 text-muted-foreground" />}
                            {account.type === 'Credit Card' && <CreditCard className="h-4 w-4 text-muted-foreground" />}
                            {['Cash', 'PayPal', 'Stripe'].includes(account.type) && <DollarSign className="h-4 w-4 text-muted-foreground" />}
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{formatCurrency(account.balance || 0)}</div>
                            <p className="text-xs text-muted-foreground">
                                {account.type}
                            </p>
                        </CardContent>
                    </Card>
                ))}
                {(!accounts || accounts.length === 0) && (
                    <div className="col-span-full text-center p-8 border border-dashed rounded-lg text-muted-foreground">
                        No accounts found. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    );
}
