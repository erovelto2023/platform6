import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getExpense } from "@/lib/actions/expense.actions";
import { ExpenseForm } from "@/components/accounting/ExpenseForm";
import { getAccounts } from "@/lib/actions/account.actions";
import { notFound } from "next/navigation";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

interface EditExpensePageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditExpensePage({ params }: EditExpensePageProps) {
    const { id } = await params;
    const { data: expense } = await getExpense(id);
    const { data: accounts } = await getAccounts();
    const { data: business } = await getOrCreateBusiness();

    if (!expense) {
        notFound();
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div>
                
                <div className="mt-4">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Edit Expense</h1>
                        {business && (
                            <span className="text-lg text-slate-400 font-medium">for {business.name}</span>
                        )}
                    </div>
                    <p className="text-slate-400">Update expense details</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm p-6">
                    <ExpenseForm accounts={accounts || []} initialData={expense} />
                </div>
            </div>
        </div>
    );
}
