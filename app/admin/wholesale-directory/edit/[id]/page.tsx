import { getSupplierById } from "@/lib/actions/supplier.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { SupplierForm } from "../../_components/supplier-form";
import { notFound } from "next/navigation";

interface EditSupplierPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditSupplierPage({ params }: EditSupplierPageProps) {
    const { id } = await params;
    const supplier = await getSupplierById(id);

    if (!supplier) {
        notFound();
    }

    return (
        <div className="max-w-3xl mx-auto p-6 space-y-6">
            <div className="flex items-center gap-4">
                <Link href="/admin/wholesale-directory">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-4 w-4" />
                    </Button>
                </Link>
                <h1 className="text-2xl font-bold">Edit Supplier</h1>
            </div>

            <SupplierForm initialData={supplier} />
        </div>
    );
}
