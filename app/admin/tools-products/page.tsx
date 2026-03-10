import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import ProductManager from "@/components/admin/ProductManager";

export default async function ToolsProductsAdminPage() {
    const { products } = await getDirectoryProducts();

    return (
        <div className="p-8">
            <ProductManager products={products} />
        </div>
    );
}
