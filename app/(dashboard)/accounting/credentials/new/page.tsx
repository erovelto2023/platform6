
import { BackButton } from "@/components/accounting/BackButton";
import { CredentialForm } from "@/components/accounting/CredentialForm";

export default function NewCredentialPage() {
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                    <BackButton href="/accounting/credentials" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add Login</h1>
                    <p className="text-muted-foreground">
                        Securely store website login details.
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                    <CredentialForm />
                </div>
            </div>
        </div>
    );
}
