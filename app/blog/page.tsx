import Link from "next/link";
import { getPosts } from "@/lib/actions/post.actions";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { Lock, Calendar, Clock, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils";

export default async function BlogPage() {
    let posts: any[] = [];

    try {
        posts = await getPosts({ isPublished: true });
    } catch (error) {
        console.error('Error fetching posts:', error);
        posts = [];
    }

    // Sort: Featured first, then by date
    const sortedPosts = [...posts].sort((a: any, b: any) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
    });

    // Hero slides for blog page
    const heroSlides = [
        {
            title: 'Execute. Expand. Exit (if you want).',
            subtitle: 'Build assets with real value—not just another social media hobby.',
            backgroundImage: '/heroimages/7f5992c2-df29-4544-bee3-8dd1993ec09d.png',
            ctaText: 'Read Articles',
            ctaLink: '#posts',
        },
        {
            title: 'Content without conversion is a hobby.',
            subtitle: 'We teach you to build businesses—not audiences.',
            backgroundImage: '/heroimages/8a24f949-58d0-4d2e-a22f-d28a58e111f0.png',
            ctaText: 'Learn More',
            ctaLink: '#posts',
        },
        {
            title: 'Stop waiting for permission.',
            subtitle: 'Start building with purpose. The platform is ready. Are you?',
            backgroundImage: '/heroimages/3eeba56d-f561-4cde-bf77-80373ff8a65d.png',
            ctaText: 'Get Started',
            ctaLink: '/sign-up',
        },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Header - Dark Theme */}
            <header className="px-6 lg:px-10 h-16 flex items-center border-b border-slate-800 bg-slate-900/95 backdrop-blur-sm sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-white">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white shadow-lg shadow-purple-500/50">
                            K
                        </div>
                        <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                            K Business Academy
                        </span>
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-4 sm:gap-6 hidden md:flex">
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/library">
                        Library
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/business-resources">
                        Resources
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/affiliate-crm">
                        Affiliate CRM
                    </Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/niche-boxes">
                        Niche Boxes
                    </Link>
                    <Link className="text-sm font-medium text-purple-400 hover:text-white transition-colors" href="/blog">
                        Blog
                    </Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg shadow-purple-500/30">
                            Get Started
                        </Button>
                    </Link>
                </nav>
                <div className="ml-auto md:hidden">
                    <Link href="/sign-up">
                        <Button size="sm">Get Started</Button>
                    </Link>
                </div>
            </header>

            <main className="flex-1">
                {/* Animated Hero Section */}
                <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

                {/* Blog Posts Section */}
                <section id="posts" className="w-full py-20 bg-slate-900 relative overflow-hidden">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl" />

                    <div className="container px-4 md:px-6 mx-auto relative z-10">
                        <div className="text-center mb-12 max-w-2xl mx-auto">
                            <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                                The Blog
                            </h2>
                            <p className="text-lg text-slate-400">
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
                                    <Link
                                        key={post._id}
                                        href={`/blog/${post.slug}`}
                                        className="group flex flex-col h-full bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1 hover:border-purple-500/50"
                                    >
                                        <div className="relative aspect-video w-full bg-slate-800">
                                            {post.imageUrl ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-600">No Image</div>
                                            )}
                                            {post.accessLevel !== "public" && (
                                                <div className="absolute top-3 right-3 bg-purple-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-md text-xs font-bold flex items-center gap-1.5 shadow-lg">
                                                    <Lock className="h-3 w-3" />
                                                    MEMBER
                                                </div>
                                            )}
                                            {post.featured && (
                                                <div className="absolute top-3 left-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-2.5 py-1 rounded-md text-xs font-bold shadow-lg">
                                                    FEATURED
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center gap-2 mb-3">
                                                {post.categories?.[0] && (
                                                    <Badge variant="secondary" className="text-xs font-normal text-purple-300 bg-purple-900/50 hover:bg-purple-900 border-purple-700">
                                                        {post.categories[0]}
                                                    </Badge>
                                                )}
                                                <div className="ml-auto flex items-center text-xs text-slate-500">
                                                    <Calendar className="h-3 w-3 mr-1" />
                                                    <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
                                                    <span className="mx-1.5">•</span>
                                                    <Clock className="h-3 w-3 mr-1" />
                                                    <span>{calculateReadingTime(post.content)} min</span>
                                                </div>
                                            </div>
                                            <h2 className="text-xl font-bold mb-3 text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-pink-400 group-hover:bg-clip-text transition-all line-clamp-2">
                                                {post.title}
                                            </h2>
                                            <p className="text-slate-400 line-clamp-3 mb-4 flex-1 text-sm leading-relaxed">
                                                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                                            </p>
                                            {post.tags && post.tags.length > 0 && (
                                                <div className="flex flex-wrap gap-1.5 mt-auto pt-4 border-t border-slate-700/50">
                                                    {post.tags.slice(0, 3).map((tag: string) => (
                                                        <span key={tag} className="text-[10px] font-medium text-slate-400 bg-slate-800/50 px-2 py-0.5 rounded-full border border-slate-700/50 flex items-center gap-1">
                                                            <Tag className="h-2.5 w-2.5" />
                                                            {tag}
                                                        </span>
                                                    ))}
                                                    {post.tags.length > 3 && (
                                                        <span className="text-[10px] text-slate-500 px-1">+{post.tags.length - 3}</span>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Footer - Dark Theme */}
            <footer className="flex flex-col gap-2 sm:flex-row py-8 w-full shrink-0 items-center px-4 md:px-6 border-t border-slate-800 bg-slate-950">
                <p className="text-xs text-slate-500">© 2025 K Business Academy. All rights reserved.</p>
                <nav className="sm:ml-auto flex gap-4 sm:gap-6">
                    <Link className="text-xs text-slate-500 hover:text-slate-300 transition-colors" href="#">
                        Terms of Service
                    </Link>
                    <Link className="text-xs text-slate-500 hover:text-slate-300 transition-colors" href="#">
                        Privacy
                    </Link>
                </nav>
            </footer>
        </div>
    );
}
