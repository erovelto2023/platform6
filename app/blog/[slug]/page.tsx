import Link from "next/link";
import { getPostBySlug, incrementBlogPostView } from "@/lib/actions/post.actions";
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
import { CustomHTMLRenderer } from "@/components/CustomHTMLRenderer";
import { SiteHeader } from "@/components/shared/SiteHeader";
import "../blog-content.css";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

    // Increment blog post view count
    incrementBlogPostView(slug);

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

            <SiteHeader />

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
                            <div className="bg-slate-900 text-white p-8 rounded-2xl max-w-md text-center shadow-2xl space-y-4">
                                <div className="p-3 bg-amber-500/20 text-amber-400 rounded-full w-fit mx-auto">
                                    <Lock className="h-8 w-8" />
                                </div>
                                <h2 className="text-2xl font-bold">Exclusive Content</h2>
                                <p className="text-sm text-slate-300">
                                    This article is reserved for Academy members. Sign in or upgrade your membership to unlock full access.
                                </p>
                                <div className="pt-2 flex flex-col gap-2">
                                    <Link href="/sign-in">
                                        <Button className="w-full bg-cyan-600 hover:bg-cyan-500 font-bold">Sign In to Read</Button>
                                    </Link>
                                    <Link href="/pricing">
                                        <Button variant="outline" className="w-full border-slate-700 text-slate-200 hover:bg-slate-800">View Membership Plans</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="prose prose-lg prose-indigo max-w-none font-sans text-slate-800 leading-relaxed">
                        <CustomHTMLRenderer html={post.content} />
                    </div>
                )}
            </main>
        </div>
    );
}
