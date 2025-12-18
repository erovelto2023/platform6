import Link from "next/link";
import { getPostBySlug } from "@/lib/actions/post.actions";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { auth } from "@clerk/nextjs/server";
import { Lock } from "lucide-react";
import { calculateReadingTime } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { BlogTracker } from "@/components/analytics/blog-tracker";
import "../blog-content.css";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return { title: "Post Not Found" };
    return {
        title: post.seoTitle || `${post.title} | K Business Academy`,
        description: post.seoDescription || post.excerpt || post.content.substring(0, 160),
        openGraph: {
            images: post.ogImage || post.imageUrl ? [post.ogImage || post.imageUrl] : [],
        }
    };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    const { userId } = await auth();

    if (!post || !post.isPublished) {
        return notFound();
    }

    const isLocked = (post.accessLevel === "members" || post.accessLevel === "paid") && !userId;
    const readingTime = calculateReadingTime(post.content);

    return (
        <div className="flex flex-col min-h-screen bg-white">
            {/* Automatic Analytics Tracking */}
            <BlogTracker
                articleId={post._id}
                articleTitle={post.title}
                articleSlug={post.slug}
            />

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

            <main className="flex-1 container px-4 md:px-6 mx-auto py-12 max-w-4xl">
                <div className="mb-8 text-center">
                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 mb-4">
                        <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMMM d, yyyy') : ''}</span>
                        <span className="text-slate-300">•</span>
                        <span>{readingTime} min read</span>
                        {post.accessLevel !== "public" && (
                            <span className="flex items-center gap-1 bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium ml-2">
                                <Lock className="h-3 w-3" />
                                Members Only
                            </span>
                        )}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-slate-900 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                        {post.categories?.map((category: string) => (
                            <Badge key={category} variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                                {category}
                            </Badge>
                        ))}
                        {post.tags?.map((tag: string) => (
                            <Badge key={tag} variant="secondary" className="text-slate-600 bg-slate-100">
                                #{tag}
                            </Badge>
                        ))}
                    </div>

                    {post.imageUrl && (
                        <div className="relative aspect-video w-full rounded-xl overflow-hidden shadow-lg mb-8">
                            <Image
                                src={post.imageUrl}
                                alt={post.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    )}
                </div>

                {isLocked ? (
                    <div className="relative">
                        <div className="prose prose-lg prose-indigo max-w-none blur-sm select-none pointer-events-none h-[400px] overflow-hidden opacity-50">
                            <div dangerouslySetInnerHTML={{ __html: post.content.substring(0, 1000) }} />
                        </div>
                        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                            <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-md border border-slate-100">
                                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Lock className="h-6 w-6 text-indigo-600" />
                                </div>
                                <h3 className="text-2xl font-bold mb-2 text-slate-900">This post is for members only</h3>
                                <p className="text-slate-600 mb-6">
                                    Join K Business Academy to get access to this article and our full library of resources.
                                </p>
                                <Link href="/sign-up">
                                    <Button size="lg" className="w-full bg-indigo-600 hover:bg-indigo-700 text-lg h-12">
                                        Become a Member
                                    </Button>
                                </Link>
                                <p className="mt-4 text-sm text-slate-500">
                                    Already a member? <Link href="/sign-in" className="text-indigo-600 hover:underline font-medium">Sign in</Link>
                                </p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <article className="blog-content prose prose-lg prose-indigo max-w-none">
                        <div dangerouslySetInnerHTML={{ __html: post.content }} />
                    </article>
                )}
            </main>

            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
                <p className="text-xs text-gray-500">© 2025 K Business Academy. All rights reserved.</p>
            </footer>
        </div>
    );
}
