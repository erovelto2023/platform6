import { getExpense } from "@/lib/actions/expense.actions";
import { ExpenseForm } from "@/components/accounting/ExpenseForm";
import { BackButton } from "@/components/accounting/BackButton";
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
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div>
                <BackButton href="/accounting/expenses" />
                <div className="mt-4">
                    <div className="flex items-baseline gap-4">
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Expense</h1>
                        {business && (
                            <span className="text-lg text-muted-foreground font-medium">for {business.name}</span>
                        )}
                    </div>
                    <p className="text-muted-foreground">Update expense details</p>
                </div>
            </div>

            <div className="max-w-3xl">
                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <ExpenseForm accounts={accounts || []} initialData={expense} />
                </div>
            </div>
        </div>
    );
}
