import { getOffer } from "@/lib/actions/offer.actions";
import OfferBuilderForm from "@/components/admin/OfferBuilderForm";
import { notFound } from "next/navigation";

interface EditOfferPageProps {
    params: {
        id: string;
    }
}

export default async function EditOfferPage({ params }: EditOfferPageProps) {
    const result = await getOffer(params.id);
    
    if (!result.success || !result.data) {
        notFound();
    }

    return (
        <div className="p-8">
            <OfferBuilderForm initialData={result.data} />
        </div>
    );
}
