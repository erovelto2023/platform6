"use server";

import connectToDatabase from "@/lib/db/connect";
import ContentTemplate from "@/lib/db/models/ContentTemplate";
import { revalidatePath } from "next/cache";

export async function createContentTemplate(data: any) {
    await connectToDatabase();

    // Generate slug from name if not provided
    if (!data.slug) {
        data.slug = data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const template = await ContentTemplate.create(data);
    revalidatePath('/admin/content-templates');
    return JSON.parse(JSON.stringify(template));
}

export async function updateContentTemplate(id: string, data: any) {
    await connectToDatabase();
    const template = await ContentTemplate.findByIdAndUpdate(id, data, { new: true });
    revalidatePath('/admin/content-templates');
    revalidatePath(`/admin/content-templates/${id}`);
    return JSON.parse(JSON.stringify(template));
}

export async function deleteContentTemplate(id: string) {
    await connectToDatabase();
    await ContentTemplate.findByIdAndDelete(id);
    revalidatePath('/admin/content-templates');
    return { success: true };
}

export async function getContentTemplates(query: any = {}) {
    await connectToDatabase();
    const templates = await ContentTemplate.find(query).sort({ category: 1, name: 1 }).lean();
    return JSON.parse(JSON.stringify(templates));
}

export async function getContentTemplate(id: string) {
    await connectToDatabase();
    const template = await ContentTemplate.findById(id).lean();
    return JSON.parse(JSON.stringify(template));
}

export async function getContentTemplateBySlug(slug: string) {
    await connectToDatabase();
    const template = await ContentTemplate.findOne({ slug, isActive: true }).lean();
    return JSON.parse(JSON.stringify(template));
}

export async function seedContentTemplates() {
    await connectToDatabase();
    const { DEFAULT_CONTENT_TEMPLATES, DEFAULT_SYSTEM_PROMPT, DEFAULT_INPUTS } = await import("@/lib/data/content-templates");

    let count = 0;
    for (const group of DEFAULT_CONTENT_TEMPLATES) {
        for (const t of group.templates) {
            const slug = t.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

            const exists = await ContentTemplate.findOne({ slug });
            if (!exists) {
                await ContentTemplate.create({
                    name: t.name,
                    slug,
                    category: group.category,
                    subcategory: group.subcategory,
                    description: t.description,
                    systemPrompt: DEFAULT_SYSTEM_PROMPT.replace('{{template_name}}', t.name),
                    inputs: DEFAULT_INPUTS,
                    isActive: true
                });
                count++;
            }
        }
    }
    revalidatePath('/admin/content-templates');
    return { success: true, count };
}
