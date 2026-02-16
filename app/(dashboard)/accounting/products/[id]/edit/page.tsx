
import ProductForm from "@/components/accounting/ProductForm";
import { BackButton } from "@/components/accounting/BackButton";
import { getProduct } from "@/lib/actions/product.actions";
import { getAllVendors } from "@/lib/actions/vendor.actions";
import { redirect } from "next/navigation";

interface EditProductPageProps {
    params: {
        id: string;
    };
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
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4">
                <BackButton href="/accounting/products" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Edit Item</h1>
                    <p className="text-muted-foreground">Update product or service details.</p>
                </div>
            </div>

            <ProductForm initialData={product} vendors={vendors} />
        </div>
    );
}
