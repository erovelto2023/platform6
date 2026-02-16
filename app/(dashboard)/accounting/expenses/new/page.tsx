import { ExpenseForm } from "@/components/accounting/ExpenseForm";

export default function NewExpensePage() {
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-2xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Expense</h1>
                    <p className="text-muted-foreground">Record a new business expense.</p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6">
                    <ExpenseForm />
                </div>
            </div>
        </div>
    );
}
