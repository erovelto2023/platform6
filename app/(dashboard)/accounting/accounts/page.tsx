import Link from "next/link";
import AccountsList from "@/components/accounting/AccountsList";
import { getAccounts } from "@/lib/actions/account.actions";
import { ChevronLeft } from "lucide-react";

export default async function AccountsPage() {
    const { data: accounts } = await getAccounts();

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 text-white dark">
            {/* Navigation */}
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>

            {/* Interactive Accounts List & Header */}
            <AccountsList accounts={accounts || []} />
        </div>
    );
}
