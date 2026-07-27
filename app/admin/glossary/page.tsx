import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import GlossaryManager from "@/components/admin/GlossaryManager";

export default async function GlossaryAdminPage() {
    const { terms } = await getGlossaryTerms({ sortBy: "views", summaryOnly: true });
    const { products } = await getDirectoryProducts();

    return (
        <div className="p-6 md:p-8 max-w-7xl mx-auto font-sans">
            <GlossaryManager initialTerms={terms} products={products} />
        </div>
    );
}
