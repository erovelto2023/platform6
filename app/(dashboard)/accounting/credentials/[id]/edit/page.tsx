
import { BackButton } from "@/components/accounting/BackButton";
import { CredentialForm } from "@/components/accounting/CredentialForm";
import { getCredential } from "@/lib/actions/credential.actions";
import { redirect } from "next/navigation";

import { getAllVendors } from "@/lib/actions/vendor.actions";

interface EditCredentialPageProps {
    params: {
        id: string;
    };
}

export default async function EditCredentialPage(props: EditCredentialPageProps) {
    const params = await props.params;
    const { data: credential, error } = await getCredential(params.id);
    const vendorsData = await getAllVendors();
    const vendors = vendorsData.success ? vendorsData.data : [];

    if (error || !credential) {
        redirect("/accounting/credentials");
    }

    if (credential.vendorId && typeof credential.vendorId === 'object') {
        credential.vendorId = credential.vendorId._id;
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                    <BackButton href="/accounting/credentials" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Login</h1>
                    <p className="text-muted-foreground">
                        Update login details.
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                    <CredentialForm initialData={credential} vendors={vendors} />
                </div>
            </div>
        </div>
    );
}
