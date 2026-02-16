import { getAccounts } from "@/lib/actions/account.actions";
import JournalEntryForm from "@/components/accounting/JournalEntryForm";
import { getOrCreateBusiness } from "@/lib/actions/business.actions";

export default async function NewJournalEntryPage() {
    const businessData = await getOrCreateBusiness();
    const accountsData = await getAccounts();
    const accounts = accountsData.data || [];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
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
