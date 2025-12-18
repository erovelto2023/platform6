import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/actions/post.actions";
import { Plus, Edit, Trash, Eye } from "lucide-react";
import { format } from "date-fns";
import { DeletePostButton } from "./_components/delete-post-button";

export default async function BlogAdminPage() {
    const posts = await getPosts();

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Blog Posts</h1>
                <Link href="/admin/blog/create">
                    <Button>
                        <Plus className="h-4 w-4 mr-2" />
                        New Post
                    </Button>
                </Link>
            </div>

            <div className="bg-white rounded-md border">
                <table className="w-full text-sm text-left">
                    <thead className="bg-slate-50 border-b">
                        <tr>
                            <th className="px-4 py-3 font-medium">Title</th>
                            <th className="px-4 py-3 font-medium">Status</th>
                            <th className="px-4 py-3 font-medium">Date</th>
                            <th className="px-4 py-3 font-medium text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-4 py-8 text-center text-slate-500">
                                    No posts found.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post: any) => (
                                <tr key={post._id} className="border-b last:border-0 hover:bg-slate-50">
                                    <td className="px-4 py-3 font-medium">
                                        {post.title}
                                        <div className="text-xs text-slate-500 font-normal">/{post.slug}</div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded-full text-xs ${post.isPublished ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3 text-slate-500">
                                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '-'}
                                    </td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/blog/${post._id}`}>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeletePostButton postId={post._id} postTitle={post.title} />
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
