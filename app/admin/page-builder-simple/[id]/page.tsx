import { getPage } from "@/lib/actions/page-builder.actions";
import { PuckEditor } from "@/components/admin/PuckEditor";
import { notFound } from "next/navigation";

export default async function EditSimplePage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    
    // In server actions, the page returned is a plain object 
    // so we can pass it directly to the client component.
    const page = await getPage(id);

    if (!page) {
        notFound();
    }

    return <PuckEditor initialData={page} />;
}
