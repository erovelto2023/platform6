import { BackButton } from "@/components/accounting/BackButton";
import { ExpenseForm } from "@/components/accounting/ExpenseForm";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getAccounts } from "@/lib/actions/account.actions";

export default async function NewExpensePage() {
    const { data: accounts } = await getAccounts();

    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center gap-4">
                <BackButton href="/accounting/expenses" />
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">New Expense</h2>
                    <p className="text-muted-foreground">
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
