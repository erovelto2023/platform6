import { getAccounts } from "@/lib/actions/account.actions";
import JournalEntryForm from "@/components/accounting/JournalEntryForm";
import { getJournalEntry } from "@/lib/actions/journal.actions";
import { notFound } from "next/navigation";

export default async function EditJournalEntryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { data: journalEntry, error } = await getJournalEntry(id);

    if (error || !journalEntry) {
        notFound();
    }

    const accountsData = await getAccounts();
    const accounts = accountsData.data || [];

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <JournalEntryForm initialData={journalEntry} accounts={accounts} />
        </div>
    );
}
