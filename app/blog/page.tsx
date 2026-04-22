import Link from "next/link";
import { getPosts } from "@/lib/actions/post.actions";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { Lock, Calendar, Clock, Tag, ArrowRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { calculateReadingTime } from "@/lib/utils";
import { SiteHeader } from "@/components/shared/SiteHeader";

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
            title: 'The Business Journal',
            subtitle: 'Deep-dive insights into operational systems, tactical speed, and the methodology of the top 1%.',
            backgroundImage: '/heroimages/blog_premium.png',
            ctaText: 'Read Latest',
            ctaLink: '#posts',
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-50">
            <SiteHeader />

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Blog Posts Section */}
                <section id="posts" className="w-full py-24 bg-slate-50">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <span className="flex items-center gap-2 text-emerald-600 font-black tracking-[0.3em] text-xs mb-4 uppercase">
                                    <Newspaper size={16} /> Editorial Feed
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                                    The Methodology in Motion.
                                </h2>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-bold">
                                    All Categories
                                </Button>
                                <Button variant="outline" className="border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-bold">
                                    Latest First
                                </Button>
                            </div>
                        </div>

                        {sortedPosts.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                                <p className="text-slate-400 font-medium italic">New insights are being drafted. Check back soon.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {sortedPosts.map((post: any) => (
                                    <Link
                                        key={post._id}
                                        href={`/blog/${post.slug}`}
                                        className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-100 transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <div className="relative aspect-[16/10] w-full bg-slate-100 overflow-hidden">
                                            {post.imageUrl ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-slate-300">
                                                    <Newspaper size={40} />
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-6 right-6 flex flex-col gap-2">
                                                {post.accessLevel !== "public" && (
                                                    <div className="bg-emerald-600 text-white px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-lg shadow-emerald-200 uppercase tracking-widest">
                                                        <Lock size={12} /> Member
                                                    </div>
                                                )}
                                                {post.featured && (
                                                    <div className="bg-slate-900 text-white px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-slate-900/20 uppercase tracking-widest border border-white/10">
                                                        Featured
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 mb-6">
                                                {post.categories?.[0] && (
                                                    <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                        {post.categories[0]}
                                                    </Badge>
                                                )}
                                                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                                                    <Calendar size={12} className="mr-1.5" />
                                                    <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-black mb-4 text-slate-900 leading-tight group-hover:text-emerald-600 transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            
                                            <p className="text-slate-500 line-clamp-3 mb-8 flex-1 text-sm leading-relaxed font-medium">
                                                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                                            </p>
                                            
                                            <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-emerald-600 tracking-widest uppercase">
                                                    Read Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-1.5">
                                                    <Clock size={12} />
                                                    {calculateReadingTime(post.content)} Min
                                                </div>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </section>

                {/* Newsletter Section */}
                <section className="w-full py-24 bg-slate-900">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-emerald-600 rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px]" />
                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">Join the Inner Circle.</h2>
                                <p className="text-emerald-50 mb-10 text-lg font-medium opacity-80">
                                    Direct-to-inbox tactical updates. No fluff. No spam. Just operational leverage.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        className="flex-1 h-14 rounded-2xl px-6 bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-slate-900"
                                    />
                                    <Button className="h-14 px-8 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black shadow-xl shadow-slate-900/20 transition-all">
                                        Subscribe
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Professional Theme */}
            <footer className="py-12 bg-slate-900 text-slate-400 border-t border-white/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
                            <div className="w-8 h-8 bg-emerald-600 rounded flex items-center justify-center font-black text-white">K</div>
                            <span className="font-bold tracking-tighter">K BUSINESS ACADEMY JOURNAL</span>
                        </div>
                        <nav className="flex gap-10">
                            <Link href="/courses" className="font-bold hover:text-emerald-500 transition-colors text-xs uppercase tracking-widest">Courses</Link>
                            <Link href="/locations" className="font-bold hover:text-emerald-500 transition-colors text-xs uppercase tracking-widest">Research Database</Link>
                            <Link href="/questions" className="font-bold hover:text-emerald-500 transition-colors text-xs uppercase tracking-widest">People Asked Questions</Link>
                        </nav>
                        <p className="text-[10px] font-black uppercase tracking-widest italic">© 2026 Editorial Infrastructure</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
