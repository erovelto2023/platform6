import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import { VendorForm } from "@/components/accounting/VendorForm";
import { getVendor } from "@/lib/actions/vendor.actions";
import { redirect } from "next/navigation";

interface EditVendorPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditVendorPage(props: EditVendorPageProps) {
    const params = await props.params; // Await params as it's a promise in newer Next.js versions
    const { data: vendor, error } = await getVendor(params.id);

    if (error || !vendor) {
        redirect("/accounting/vendors");
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="space-y-1">
                    
                    <h1 className="text-3xl font-bold tracking-tight text-white">Edit Vendor</h1>
                    <p className="text-slate-400">
                        Update vendor details.
                    </p>
                </div>

                <div className="bg-[#0d1117] rounded-lg border border-slate-800/80 shadow-sm p-8">
                    <VendorForm initialData={vendor} />
                </div>
            </div>
        </div>
    );
}
