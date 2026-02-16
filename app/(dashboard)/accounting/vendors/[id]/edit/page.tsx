
import { BackButton } from "@/components/accounting/BackButton";
import { VendorForm } from "@/components/accounting/VendorForm";
import { getVendor } from "@/lib/actions/vendor.actions";
import { redirect } from "next/navigation";

interface EditVendorPageProps {
    params: {
        id: string;
    };
}

export default async function EditVendorPage(props: EditVendorPageProps) {
    const params = await props.params; // Await params as it's a promise in newer Next.js versions
    const { data: vendor, error } = await getVendor(params.id);

    if (error || !vendor) {
        redirect("/accounting/vendors");
    }

    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                    <BackButton href="/accounting/vendors" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Vendor</h1>
                    <p className="text-muted-foreground">
                        Update vendor details.
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                    <VendorForm initialData={vendor} />
                </div>
            </div>
        </div>
    );
}
