import { getDirectoryProductBySlug } from "@/lib/actions/directory-product.actions";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MainNav } from "@/components/shared/MainNav";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
    ExternalLink, CheckCircle2, XCircle, 
    Star, ShieldCheck, Clock, Layers, 
    ArrowLeft, Globe, Zap, Heart, MessageSquare
} from "lucide-react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import ReviewForm from "@/components/directory/ReviewForm";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const { product } = await getDirectoryProductBySlug(slug);

    if (!product) return { title: "Product Not Found" };

    return {
        title: product.metaTitle || `${product.name} | K Business Academy`,
        description: product.metaDescription || product.shortDescription || `Detailed review and insights for ${product.name}.`,
    };
}

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const { product } = await getDirectoryProductBySlug(slug);

    if (!product) {
        notFound();
    }

    const typeLabels: Record<string, string> = {
        tool: "Tool / Software",
        resource: "Resource / Template",
        course: "Course / Education",
        service: "Service / Agency",
        platform: "Platform / Network",
        community: "Community",
        deal: "Deal / Offer",
        program: "Affiliate Program",
        media: "Media / Content",
        event: "Event / Conference",
        other: "Other"
    };

    const approvedReviews = product.userReviews?.filter((r: any) => r.isApproved !== false) || [];

    return (
        <div className="flex flex-col min-h-screen bg-[#f8fafc] text-zinc-900">
            <MainNav />
            
            <div className="pt-32 pb-20 px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
                {/* Header / Breadcrumbs */}
                <header className="mb-12">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge variant="outline" className="bg-sky-500/10 text-sky-600 border-sky-500/20 text-[10px] uppercase font-black tracking-widest px-3 py-1">
                                    {typeLabels[product.type || "tool"]}
                                </Badge>
                                <span className="text-zinc-700">•</span>
                                <span className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{product.niche}</span>
                            </div>
                            
                            <div className="flex items-center gap-6">
                                {product.logoUrl ? (
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-white p-2 flex items-center justify-center shrink-0">
                                        <img src={product.logoUrl} alt={product.name} className="w-full h-full object-contain mix-blend-multiply" />
                                    </div>
                                ) : (
                                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-sky-500/20 to-indigo-500/20 border border-sky-500/20 flex items-center justify-center">
                                        <Layers className="w-10 h-10 text-sky-600" />
                                    </div>
                                )}
                                <div>
                                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic leading-none mb-2 text-zinc-900">
                                        {product.name}
                                    </h1>
                                    {product.alternativeTo && (
                                        <p className="text-zinc-400 text-sm font-medium uppercase tracking-tight italic">
                                            A Powerhouse Alternative to <span className="text-sky-600">{product.alternativeTo}</span>
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <div className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-2xl shadow-sm">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Starting At</span>
                                    <span className="text-2xl font-black text-emerald-600 italic">
                                        {product.startingPrice ? `$${product.startingPrice}` : product.priceModel === 'Free' ? 'FREE' : 'CONTACT'}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Model</span>
                                    <p className="text-xs font-bold text-zinc-900 uppercase">{product.priceModel}</p>
                                </div>
                            </div>
                            <Button asChild size="lg" className="w-full bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black uppercase tracking-widest rounded-xl h-14 shadow-lg shadow-sky-500/20">
                                <a href={product.affiliateLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2">
                                    {product.ctaButtonText || "Visit Website"}
                                    <ExternalLink size={18} />
                                </a>
                            </Button>
                        </div>
                    </div>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* Summary Card */}
                        <div className="p-8 rounded-[2.5rem] bg-white border border-zinc-200 relative overflow-hidden shadow-sm">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <Zap size={80} className="text-sky-500" />
                            </div>
                            <h2 className="text-xs font-black text-sky-600 uppercase tracking-[0.3em] mb-4">Strategic Overview</h2>
                            <p className="text-xl md:text-2xl font-bold text-zinc-800 leading-relaxed italic tracking-tight">
                                {product.shortDescription}
                            </p>
                        </div>

                        {/* Detailed Description */}
                        <section className="prose prose-zinc max-w-none">
                            <h3 className="text-2xl font-black uppercase italic tracking-tight text-zinc-900 border-l-4 border-sky-500 pl-4 mb-8">
                                Market Intelligence & Deep Review
                            </h3>
                            <div className="text-zinc-600 leading-loose text-lg font-medium space-y-6">
                                <ReactMarkdown>
                                    {product.description}
                                </ReactMarkdown>
                            </div>
                        </section>

                        {/* Features / Pros & Cons */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-8 rounded-3xl bg-emerald-500/5 border border-emerald-500/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-emerald-500/20 rounded-xl">
                                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-emerald-600">Competitive Edge</h3>
                                </div >
                                <ul className="space-y-4">
                                    {product.pros.map((pro: string, i: number) => (
                                        <li key={i} className="flex font-bold items-start gap-3 text-sm text-zinc-600">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                                            {pro}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-8 rounded-3xl bg-indigo-500/5 border border-indigo-500/10">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="p-2 bg-indigo-500/20 rounded-xl">
                                        <XCircle className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <h3 className="text-sm font-black uppercase tracking-widest text-indigo-600">Critical Gaps</h3>
                                </div>
                                <ul className="space-y-4">
                                    {product.cons.map((con: string, i: number) => (
                                        <li key={i} className="flex font-bold items-start gap-3 text-sm text-zinc-600">
                                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                            {con}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Key Features List */}
                        {product.features && product.features.length > 0 && (
                            <section>
                                <h3 className="text-2xl font-black uppercase italic tracking-tight text-zinc-900 mb-8">Core Weaponry</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.features.map((feature: string, i: number) => (
                                        <div key={i} className="p-4 bg-white border border-zinc-200 rounded-2xl flex items-center gap-4 group hover:border-sky-500/30 transition-all shadow-sm">
                                            <div className="w-2 h-2 rounded-full bg-sky-500 opacity-20 group-hover:opacity-100 transition-opacity" />
                                            <span className="text-sm font-bold text-zinc-700 uppercase tracking-tight">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar */}
                    <aside className="space-y-8">
                        {/* Status Card */}
                        <div className="p-8 bg-white border border-zinc-200 rounded-[2rem] space-y-6 shadow-sm">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <ShieldCheck className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Skill Level</span>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-900 uppercase">{product.skillLevel}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Clock className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Last Updated</span>
                                    </div>
                                    <span className="text-xs font-bold text-zinc-900 uppercase">{product.lastUpdated ? new Date(product.lastUpdated).toLocaleDateString() : "2025"}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-zinc-500">
                                        <Globe className="w-4 h-4" />
                                        <span className="text-[10px] font-black uppercase tracking-widest">Free Trial</span>
                                    </div>
                                    <span className="text-xs font-bold text-emerald-600 uppercase">{product.freeTrialDuration || "Unavailable"}</span>
                                </div>
                            </div>
                        </div>

                        {/* Supported Platforms */}
                        {product.supportedPlatforms && product.supportedPlatforms.length > 0 && (
                            <div className="p-8 bg-white border border-zinc-200 rounded-[2rem] shadow-sm">
                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Platforms</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.supportedPlatforms.map((plat: string, i: number) => (
                                        <Badge key={i} variant="secondary" className="bg-zinc-100 text-zinc-700 border-zinc-200 font-bold uppercase text-[9px]">
                                            {plat}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {product.tags && product.tags.length > 0 && (
                            <div className="p-8 bg-white border border-zinc-200 rounded-[2rem] shadow-sm">
                                <h3 className="text-xs font-black text-zinc-500 uppercase tracking-[0.2em] mb-6">Taxonomy</h3>
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((tag: string, i: number) => (
                                        <span key={i} className="text-[10px] font-bold text-zinc-400 hover:text-sky-600 cursor-default transition-colors uppercase">
                                            #{tag.replace(/\s+/g, '')}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Deal Alert */}
                        {product.deal && (
                            <div className="p-8 bg-sky-500/10 border border-sky-500/20 rounded-[2rem] relative overflow-hidden group">
                                <div className="relative z-10">
                                    <h3 className="text-xs font-black text-sky-600 uppercase tracking-[0.2em] mb-2 flex items-center gap-2">
                                        <Heart className="w-3 h-3 fill-sky-500" /> Special Offer
                                    </h3>
                                    <p className="text-lg font-black text-zinc-900 italic leading-tight uppercase tracking-tighter">
                                        {product.deal}
                                    </p>
                                    <p className="text-[10px] font-bold text-zinc-400 uppercase mt-2">Active via link above</p>
                                </div>
                                <div className="absolute -bottom-4 -right-4 bg-sky-500/10 w-20 h-20 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
                            </div>
                        )}
                    </aside>
                </div>

                {/* Reviews Summary */}
                <section className="mt-20 pt-20 border-t border-zinc-200">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-12">
                        <div>
                            <h2 className="text-3xl md:text-5xl font-black uppercase italic tracking-tighter text-zinc-900 mb-2">User Intelligence</h2>
                            <p className="text-zinc-500 font-bold uppercase text-xs tracking-widest">What the market is saying about {product.name}</p>
                        </div>
                        <ReviewForm productId={product.id} />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {approvedReviews.length > 0 ? approvedReviews.map((review: any, i: number) => (
                            <div key={i} className="p-8 bg-white border border-zinc-200 rounded-3xl space-y-4 shadow-sm">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-1">
                                        {[...Array(5)].map((_, star: number) => (
                                            <Star key={star} size={10} className={`${star < review.rating ? "text-amber-400 fill-amber-400" : "text-zinc-200"}`} />
                                        ))}
                                    </div>
                                    <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{review.date}</span>
                                </div>
                                <p className="text-sm font-medium text-zinc-600 leading-relaxed italic">&quot;{review.comment}&quot;</p>
                                <div className="pt-4 border-t border-zinc-100 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-sky-500/10 flex items-center justify-center text-[10px] font-black text-sky-600 uppercase">
                                        {review.user?.[0] || "A"}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-zinc-900">{review.user || "Anonymous"}</span>
                                        {review.isVerified && <span className="text-[8px] font-black text-emerald-600 uppercase tracking-widest">Verified User</span>}
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="col-span-full py-20 text-center border border-dashed border-zinc-200 rounded-3xl bg-white">
                                <p className="text-zinc-400 font-bold uppercase text-xs tracking-[0.2em] italic">No detailed user reviews available for this tool yet.</p>
                            </div>
                        )}
                    </div>
                </section>
            </div>

            <footer className="mt-auto py-12 border-t border-zinc-200 px-6 md:px-12 lg:px-20 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                    <p className="text-[10px] text-zinc-600 font-black uppercase tracking-[0.3em]">
                        © 2025 K Business Academy. High Performance Business Infrastructure.
                    </p>
                    <div className="flex gap-8">
                        <Link href="/terms" className="text-[9px] text-zinc-600 hover:text-zinc-900 uppercase font-black tracking-widest transition-colors">Terms</Link>
                        <Link href="/privacy" className="text-[9px] text-zinc-600 hover:text-zinc-900 uppercase font-black tracking-widest transition-colors">Privacy</Link>
                        <Link href="/disclaimer" className="text-[9px] text-zinc-600 hover:text-zinc-900 uppercase font-black tracking-widest transition-colors">Affiliate Disclaimer</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
