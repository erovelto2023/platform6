import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getPosts } from "@/lib/actions/post.actions";
import { Plus, Edit, Trash, Eye, FileText } from "lucide-react";
import { format } from "date-fns";
import { DeletePostButton } from "./_components/delete-post-button";

export default async function BlogAdminPage() {
    const posts = await getPosts();

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
                        <FileText size={24} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 uppercase">
                            Blog & Content Manager
                        </h1>
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Articles, Press Releases & Editorial Feed</p>
                    </div>
                </div>
                <Link href="/admin/blog/create">
                    <Button className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/30 border-0 cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        New Article
                    </Button>
                </Link>
            </div>

            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden">
                <table className="w-full text-xs text-left">
                    <thead className="bg-slate-950">
                        <tr className="border-b border-slate-800/80">
                            <th className="px-6 py-4 font-extrabold text-slate-300 uppercase tracking-wider">Title</th>
                            <th className="px-6 py-4 font-extrabold text-slate-300 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 font-extrabold text-slate-300 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-4 font-extrabold text-slate-300 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-slate-950 divide-y divide-slate-800/80">
                        {posts.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-mono font-bold uppercase text-xs tracking-widest">
                                    No posts found. Create your first article above.
                                </td>
                            </tr>
                        ) : (
                            posts.map((post: any) => (
                                <tr key={post._id} className="hover:bg-slate-900/60 transition">
                                    <td className="px-6 py-4 font-extrabold text-slate-100">
                                        {post.title}
                                        <div className="text-[10px] text-cyan-400 font-mono font-bold mt-0.5">/{post.slug}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase border ${
                                            post.isPublished 
                                                ? 'bg-slate-900 text-emerald-400 border-emerald-800' 
                                                : 'bg-slate-900 text-amber-400 border-amber-800'
                                        }`}>
                                            {post.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-slate-400 font-mono">
                                        {post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <Link href={`/blog/${post.slug}`} target="_blank">
                                            <Button variant="ghost" size="icon" className="p-2 bg-slate-900 border border-slate-800 hover:border-emerald-500 text-slate-300 hover:text-emerald-400 rounded-xl transition">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <Link href={`/admin/blog/${post._id}`}>
                                            <Button variant="ghost" size="icon" className="p-2 bg-slate-900 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white rounded-xl transition">
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
