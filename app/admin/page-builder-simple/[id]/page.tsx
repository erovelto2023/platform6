import { getPage } from "@/lib/actions/page-builder.actions";
import SimplePageForm from "@/components/admin/SimplePageForm";
import { notFound } from "next/navigation";

interface EditSimplePageProps {
    params: Promise<{
        id: string;
    }>
}

export default async function EditSimplePage({ params }: EditSimplePageProps) {
    const { id } = await params;
    const page = await getPage(id);
    
    if (!page) {
        notFound();
    }

    return (
        <div className="p-8">
            <SimplePageForm initialData={page} />
        </div>
    );
}
