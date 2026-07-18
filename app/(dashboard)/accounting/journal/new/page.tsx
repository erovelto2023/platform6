import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { getAccounts } from "@/lib/actions/account.actions";
import JournalEntryForm from "@/components/accounting/JournalEntryForm";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

export default async function NewJournalEntryPage() {
    const businessData = await getOrCreateBusiness();
    const accountsData = await getAccounts();
    const accounts = accountsData.data || [];

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">
                        {businessData.data?.name || 'Business'}
                    </p>
                </div>
            </div>
            <JournalEntryForm accounts={accounts} />
        </div>
    );
}
