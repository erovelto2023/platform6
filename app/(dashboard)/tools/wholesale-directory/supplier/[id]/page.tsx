import { getSupplierById } from "@/lib/actions/supplier.actions";
import { notFound } from "next/navigation";
import { SupplierDetailView } from "./_components/supplier-detail-view";

interface SupplierPageProps {
    params: Promise<{ id: string }>;
}

export default async function SupplierPage({ params }: SupplierPageProps) {
    const { id } = await params;
    const supplier = await getSupplierById(id);

    if (!supplier) {
        notFound();
    }

    return <SupplierDetailView supplier={supplier} />;
}
