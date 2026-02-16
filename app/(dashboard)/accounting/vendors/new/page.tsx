
import { BackButton } from "@/components/accounting/BackButton";
import { VendorForm } from "@/components/accounting/VendorForm";

export default function NewVendorPage() {
    return (
        <div className="p-6 bg-slate-50 min-h-screen">
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                    <BackButton href="/accounting/vendors" />
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Vendor</h1>
                    <p className="text-muted-foreground">
                        Enter the details of the vendor or supplier.
                    </p>
                </div>

                <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8">
                    <VendorForm />
                </div>
            </div>
        </div>
    );
}
