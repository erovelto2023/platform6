import { getContentTemplate } from "@/lib/actions/content-template.actions";
import { notFound } from "next/navigation";
import TemplateForm from "../_components/template-form";

export default async function EditTemplatePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const template = await getContentTemplate(id);

    if (!template) return notFound();

    return <TemplateForm initialData={template} isEditing={true} />;
}
