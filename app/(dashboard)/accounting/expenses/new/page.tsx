import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ExpenseForm } from "@/components/accounting/ExpenseForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAccounts } from "@/lib/actions/account.actions";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

export default async function NewExpensePage() {
    const { data: accounts } = await getAccounts();
    const { data: business } = await getOrCreateBusiness();

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center gap-4">
                
                <div>
                    <div className="flex items-baseline gap-4">
                        <h2 className="text-3xl font-bold tracking-tight">New Expense</h2>
                        {business && (
                            <span className="text-lg text-slate-400 font-medium">for {business.name}</span>
                        )}
                    </div>
                    <p className="text-slate-400">
                        Record a new business expense.
                    </p>
                </div>
            </div>

            <div className="grid gap-4 grid-cols-1">
                <Card>
                    <CardHeader>
                        <CardTitle>Expense Details</CardTitle>
                        <CardDescription>
                            Enter the details of the expense.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ExpenseForm accounts={accounts || []} />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
