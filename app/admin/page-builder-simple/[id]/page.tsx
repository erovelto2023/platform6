import { getPage } from "@/lib/actions/page-builder.actions";
import SimplePageForm from "@/components/admin/SimplePageForm";
import { notFound } from "next/navigation";

interface EditSimplePageProps {
    params: {
        id: string;
    }
}

export default async function EditSimplePage({ params }: EditSimplePageProps) {
    const page = await getPage(params.id);
    
    if (!page) {
        notFound();
    }

    return (
        <div className="p-8">
            <SimplePageForm initialData={page} />
        </div>
    );
}
