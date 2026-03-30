import Link from "next/link";
import { getPosts } from "@/lib/actions/post.actions";
import { format } from "date-fns";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { Lock, Calendar, Clock, Tag, ArrowRight, Newspaper } from "lucide-react";
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
            title: 'The Business Journal',
            subtitle: 'Deep-dive insights into operational systems, tactical speed, and the methodology of the top 1%.',
            backgroundImage: '/heroimages/blog_premium.png',
            ctaText: 'Read Latest',
            ctaLink: '#posts',
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-[#fefae0]">
            {/* Navbar - Professional Educational Theme */}
            <header className="px-6 lg:px-10 h-20 flex items-center border-b border-[#bc6c25]/20 bg-[#fefae0]/80 backdrop-blur-md sticky top-0 z-50">
                <div className="flex items-center gap-2 font-bold text-xl text-[#283618]">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-[#606c38] rounded-xl flex items-center justify-center text-[#fefae0] shadow-lg shadow-[#606c38]/20 transition-transform hover:scale-105">
                            K
                        </div>
                        <div className="flex flex-col leading-none">
                            <span className="text-lg font-black tracking-tight">K BUSINESS</span>
                            <span className="text-[10px] uppercase tracking-[0.2em] font-medium opacity-70">Academy</span>
                        </div>
                    </Link>
                </div>
                <nav className="ml-auto flex items-center gap-8 hidden md:flex">
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/courses">
                        Courses
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/library">
                        Library
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/business-resources">
                        Resources
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/affiliate-crm">
                        Affiliate CRM
                    </Link>
                    <Link className="text-sm font-bold text-[#606c38] border-b-2 border-[#606c38]" href="/blog">
                        Blog
                    </Link>
                    <Link className="text-sm font-semibold text-[#283618]/70 hover:text-[#606c38] transition-colors" href="/locations">
                        Intelligence
                    </Link>
                    <div className="h-6 w-px bg-[#283618]/10 mx-2" />
                    <Link href="/sign-in">
                        <Button variant="ghost" className="text-[#283618] font-bold hover:bg-[#606c38]/5">
                            Log In
                        </Button>
                    </Link>
                    <Link href="/sign-up">
                        <Button className="bg-[#606c38] hover:bg-[#283618] text-[#fefae0] px-6 h-11 rounded-xl shadow-xl shadow-[#606c38]/20 transition-all font-bold">
                            Subscribe
                        </Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                <SimpleHeroSlideshow slides={heroSlides} autoplay={false} />

                {/* Blog Posts Section */}
                <section id="posts" className="w-full py-24 bg-[#fefae0]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                            <div className="max-w-2xl">
                                <span className="flex items-center gap-2 text-[#bc6c25] font-black tracking-[0.3em] text-xs mb-4 uppercase">
                                    <Newspaper size={16} /> Editorial Feed
                                </span>
                                <h2 className="text-4xl md:text-5xl font-black text-[#283618] leading-tight">
                                    The Methodology in Motion.
                                </h2>
                            </div>
                            <div className="flex gap-4">
                                <Button variant="outline" className="border-[#283618]/10 text-[#283618] hover:bg-[#606c38]/5 rounded-xl font-bold">
                                    All Categories
                                </Button>
                                <Button variant="outline" className="border-[#283618]/10 text-[#283618] hover:bg-[#606c38]/5 rounded-xl font-bold">
                                    Latest First
                                </Button>
                            </div>
                        </div>

                        {sortedPosts.length === 0 ? (
                            <div className="text-center py-32 bg-white rounded-[3rem] border border-[#283618]/5">
                                <p className="text-[#283618]/40 font-medium">New insights are being drafted. Check back soon.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                                {sortedPosts.map((post: any) => (
                                    <Link
                                        key={post._id}
                                        href={`/blog/${post.slug}`}
                                        className="group flex flex-col h-full bg-white rounded-[2.5rem] overflow-hidden border border-[#283618]/5 hover:shadow-2xl hover:shadow-[#606c38]/10 transition-all duration-500 hover:-translate-y-2"
                                    >
                                        <div className="relative aspect-[16/10] w-full bg-[#e2e7d1] overflow-hidden">
                                            {post.imageUrl ? (
                                                <Image
                                                    src={post.imageUrl}
                                                    alt={post.title}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="flex items-center justify-center h-full text-[#606c38]/30">
                                                    <Newspaper size={40} />
                                                </div>
                                            )}
                                            
                                            <div className="absolute top-6 right-6 flex flex-col gap-2">
                                                {post.accessLevel !== "public" && (
                                                    <div className="bg-[#bc6c25] text-[#fefae0] px-3 py-1.5 rounded-xl text-[10px] font-black flex items-center gap-1.5 shadow-lg shadow-[#bc6c25]/20 uppercase tracking-widest">
                                                        <Lock size={12} /> Member
                                                    </div>
                                                )}
                                                {post.featured && (
                                                    <div className="bg-[#606c38] text-[#fefae0] px-3 py-1.5 rounded-xl text-[10px] font-black shadow-lg shadow-[#606c38]/20 uppercase tracking-widest">
                                                        Featured
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        
                                        <div className="p-8 flex flex-col flex-1">
                                            <div className="flex items-center gap-4 mb-6">
                                                {post.categories?.[0] && (
                                                    <Badge className="bg-[#dda15e]/10 text-[#bc6c25] hover:bg-[#dda15e]/20 border-none px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest">
                                                        {post.categories[0]}
                                                    </Badge>
                                                )}
                                                <div className="flex items-center text-[10px] font-bold text-[#283618]/40 uppercase tracking-widest">
                                                    <Calendar size={12} className="mr-1.5" />
                                                    <span>{post.publishedAt ? format(new Date(post.publishedAt), 'MMM d, yyyy') : 'Draft'}</span>
                                                </div>
                                            </div>

                                            <h2 className="text-2xl font-black mb-4 text-[#283618] leading-tight group-hover:text-[#606c38] transition-colors line-clamp-2">
                                                {post.title}
                                            </h2>
                                            
                                            <p className="text-[#283618]/60 line-clamp-3 mb-8 flex-1 text-sm leading-relaxed font-medium">
                                                {post.excerpt || post.content.replace(/<[^>]*>?/gm, '').substring(0, 150) + '...'}
                                            </p>
                                            
                                            <div className="pt-6 border-t border-[#283618]/5 flex items-center justify-between">
                                                <div className="flex items-center gap-2 text-[10px] font-black text-[#606c38] tracking-widest uppercase">
                                                    Read Analysis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                                </div>
                                                <div className="flex items-center text-[10px] font-bold text-[#283618]/30 uppercase tracking-widest gap-1.5">
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
                <section className="w-full py-24 bg-[#283618]">
                    <div className="container px-4 md:px-6 mx-auto">
                        <div className="bg-[#606c38] rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-[#dda15e]/10 rounded-full blur-[80px]" />
                            <div className="relative z-10 max-w-2xl mx-auto">
                                <h2 className="text-3xl md:text-5xl font-black text-[#fefae0] mb-6 leading-tight">Join the Inner Circle.</h2>
                                <p className="text-[#fefae0]/70 mb-10 text-lg font-medium">
                                    Direct-to-inbox tactical updates. No fluff. No spam. Just operational leverage.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                                    <input 
                                        type="email" 
                                        placeholder="Enter your email" 
                                        className="flex-1 h-14 rounded-2xl px-6 bg-[#fefae0]/10 border border-[#fefae0]/20 text-[#fefae0] placeholder-[#fefae0]/40 focus:outline-none focus:ring-2 focus:ring-[#bc6c25]"
                                    />
                                    <Button className="h-14 px-8 rounded-2xl bg-[#bc6c25] hover:bg-[#dda15e] text-[#fefae0] font-black shadow-xl shadow-[#bc6c25]/20 transition-all">
                                        Subscribe
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer - Professional Theme */}
            <footer className="py-12 bg-[#283618] text-[#fefae0]/50 border-t border-[#fefae0]/5">
                <div className="container px-4 md:px-6 mx-auto">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2 grayscale brightness-200 opacity-50">
                            <div className="w-8 h-8 bg-[#606c38] rounded flex items-center justify-center font-black text-[#fefae0]">K</div>
                            <span className="font-bold tracking-tighter">K BUSINESS ACADEMY JOURNAL</span>
                        </div>
                        <nav className="flex gap-10">
                            <Link href="/courses" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Courses</Link>
                            <Link href="/library" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Archives</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Feed (RSS)</Link>
                            <Link href="#" className="font-bold hover:text-[#dda15e] transition-colors text-sm">Support</Link>
                        </nav>
                        <p className="text-xs font-medium uppercase tracking-widest">© 2026 Editorial Infrastructure</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
