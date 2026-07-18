import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getStatementRecipients } from "@/lib/actions/statement.actions";
import CreateStatementsForm from "@/components/accounting/CreateStatementsForm";

export default async function CreateStatementsPage() {
    const res = await getStatementRecipients("open");
    const initialRecipients = res.data || [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-white">Create Statements</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Generate balance summaries or transactions history reports for your customers</p>
                </div>
                
            </div>

            <CreateStatementsForm initialRecipients={initialRecipients} />
        </div>
    );
}
