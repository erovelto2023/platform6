import { ChevronLeft } from "lucide-react";
import Link from "next/link";

import ProductForm from "@/components/accounting/ProductForm";
import { getProduct } from "@/lib/actions/product.actions";
import { getAllVendors } from "@/lib/actions/vendor.actions";
import { redirect } from "next/navigation";

interface EditProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function EditProductPage(props: EditProductPageProps) {
    const params = await props.params;
    const { data: product, error } = await getProduct(params.id);
    const vendorsData = await getAllVendors();
    const vendors = vendorsData.success ? vendorsData.data : [];

    if (error || !product) {
        redirect("/accounting/products");
    }

    // Ensure vendorId is a string for the Select component
    if (product.vendorId && typeof product.vendorId === 'object') {
        product.vendorId = product.vendorId._id;
    }

    return (
        <div className="min-h-screen bg-[#07090e] p-6 space-y-6 dark text-white">
            <Link href="/accounting" className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors w-fit mb-4">
                <ChevronLeft className="w-3.5 h-3.5" /> Back to Accounting
            </Link>
            <div className="flex items-center gap-4">
                
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white">Edit Item</h1>
                    <p className="text-slate-400">Update product or service details.</p>
                </div>
            </div>

            <ProductForm initialData={product} vendors={vendors} />
        </div>
    );
}
