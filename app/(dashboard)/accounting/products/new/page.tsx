import ProductForm from "@/components/accounting/ProductForm";
import { BackButton } from "@/components/accounting/BackButton";
import { getAllVendors } from "@/lib/actions/vendor.actions";

export default async function NewProductPage() {
    const vendorsData = await getAllVendors();
    const vendors = vendorsData.success ? vendorsData.data : [];

    return (
        <div className="p-6 space-y-6 bg-slate-50 min-h-screen">
            <div className="flex items-center gap-4">
                <BackButton href="/accounting/products" />
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add New Item</h1>
                    <p className="text-muted-foreground">Create a new product or service to sell to customers.</p>
                </div>
            </div>

            <ProductForm vendors={vendors} />
        </div>
    );
}
