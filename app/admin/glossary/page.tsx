import { getGlossaryTerms } from "@/lib/actions/glossary.actions";
import { getDirectoryProducts } from "@/lib/actions/directory-product.actions";
import GlossaryForm from "@/components/admin/GlossaryForm";
import GlossaryManager from "../../../components/admin/GlossaryManager";

export default async function GlossaryAdminPage() {
    const { terms } = await getGlossaryTerms({ limit: 1000 });
    const { products } = await getDirectoryProducts();

    return (
        <div className="p-8">
            <GlossaryManager initialTerms={terms} products={products} />
        </div>
    );
}
