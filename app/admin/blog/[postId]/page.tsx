import { PostForm } from "../_components/post-form";
import { getPost } from "@/lib/actions/post.actions";
import { redirect } from "next/navigation";

export default async function EditPostPage({ params }: { params: Promise<{ postId: string }> }) {
    const { postId } = await params;
    const post = await getPost(postId);

    if (!post) {
        return redirect("/admin/blog");
    }

    return (
        <div className="p-6">
            <PostForm initialData={post} />
        </div>
    );
}
