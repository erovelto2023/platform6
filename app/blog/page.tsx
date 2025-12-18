import Link from "next/link";
import { getPosts } from "@/lib/actions/post.actions";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils";

export default async function BlogPage() {
    const posts = await getPosts({ isPublished: true });

    // Sort: Featured first, then by date
    const sortedPosts = [...posts].sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    });

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            {/* Header */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b bg-white sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-indigo-900">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white">K</div>
                        K Business Academy
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6">
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/courses">Courses</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4" href="/niche-boxes">Niche Boxes</Link>
                    <Link className="text-sm font-medium hover:underline underline-offset-4 text-indigo-600" href="/blog">Blog</Link>
                    <Link href="/sign-in"><Button variant="ghost" size="sm">Log In</Button></Link>
                    <Link href="/sign-up"><Button size="sm" className="bg-indigo-600 hover:bg-indigo-700">Get Started</Button></Link>
                </nav>
            </header>

            <main className="flex-1 container px-4 md:px-6 mx-auto py-12">
                <div className="text-center mb-12 max-w-2xl mx-auto">
                    <h1 className="text-4xl font-bold tracking-tight mb-4 text-slate-900">The Blog</h1>
                    <p className="text-lg text-slate-600">
                        Insights, strategies, and guides to help you build and grow your online business.
                    </p>
                </div>

                {sortedPosts.length === 0 ? (
                    <div className="text-center py-12 text-slate-500">
                        No posts published yet.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sortedPosts.map((post: any) => (
                            <Link href={`/blog/${post.slug}`} key={post._id} className="group flex flex-col h-full bg-white border rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                                <div className="relative aspect-video w-full bg-slate-200">
                                    {post.imageUrl ? (
                                        <Image
                                            src={post.imageUrl}
                                            alt={post.title}
                                            fill
                                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-slate-400">No Image</div>
                                    )}
                                    {post.accessLevel !== "public" && (
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-indigo-900 px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-sm border border-indigo-100">
                                            <Lock className="h-3 w-3" />
                                            MEMBER
                                        </div>
                                    )}
                                    {post.featured && (
                                        <div className="absolute top-3 left-3 bg-indigo-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-sm">
                                            FEATURED
                                        </div>
                                    )}
                                </div>
                                <div className="p-6 flex flex-col flex-1">
                                    <div className="flex items-center gap-2 mb-3">
                                        {post.categories?.[0] && (
                                            <Badge variant="secondary" className="text-xs font-normal text-indigo-700 bg-indigo-50 hover:bg-indigo-100 border-none">
                                                {post.categories[0]}
                                            </Badge>
                                        )}
                                        <div className="ml-auto flex items-center text-xs text-slate-400">
                                            <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
                                            <span className="mx-1">•</span>
                                            <span>{calculateReadingTime(post.content)} min read</span>
                                        </div>
                                    </div>
                                    <h2 className="text-xl font-bold mb-3 text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    <p className="text-slate-600 line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                                        {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                                    </p>
                                    {post.tags && post.tags.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-slate-50">
                                            {post.tags.slice(0, 3).map((tag: string) => (
                                                <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                                                    #{tag}
                                                </span>
                                            ))}
                                            {post.tags.length > 3 && (
                                                <span className="text-[10px] text-slate-400 px-1">+{post.tags.length - 3}</span>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t bg-white">
                <p className="text-xs text-gray-500">© 2025 K Business Academy. All rights reserved.</p>
            </footer>
        </div>
    );
}
