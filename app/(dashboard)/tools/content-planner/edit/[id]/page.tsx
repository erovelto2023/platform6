import { getContentPostById } from "@/lib/actions/content.actions";
import EditPostForm from "../_components/edit-post-form";
import { notFound } from "next/navigation";

export default async function EditContentPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const post = await getContentPostById(resolvedParams.id);

    if (!post) {
        notFound();
    }

    return <EditPostForm post={post} />;
}
