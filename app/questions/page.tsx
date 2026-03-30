import Link from "next/link";
import { getPaginatedFAQs, getFAQCategories } from "@/lib/actions/faq.actions";
import { Button } from "@/components/ui/button";
import { SimpleHeroSlideshow } from "@/components/animations";
import { Search, HelpCircle, ChevronRight, MessageSquare, BookOpen } from "lucide-react";

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const resolvedSearchParams = await searchParams;
    const search = typeof resolvedSearchParams.search === 'string' ? resolvedSearchParams.search : "";
    
    // Fetch categories for the sidebar or grouping
    const categories = await getFAQCategories();
    
    // Fetch initial FAQs (limit to a reasonable number for the main list if not searching)
    const { faqs } = await getPaginatedFAQs({ 
        limit: 100, 
        search,
        page: 1 
    });

    // Hero slides for questions page
    const heroSlides = [
        {
            title: 'Knowledge Base. Answers. Growth.',
            subtitle: 'Explore our comprehensive database of business and strategy FAQs.',
            backgroundImage: '/heroimages/7f5992c2-df29-4544-bee3-8dd1993ec09d.png',
            ctaText: 'Browse All Questions',
            ctaLink: '#categories',
        },
        {
            title: 'Your Strategy, Systematized.',
            subtitle: 'Find exact answers to common business hurdles and execution roadblocks.',
            backgroundImage: '/heroimages/8a24f949-58d0-4d2e-a22f-d28a58e111f0.png',
            ctaText: 'Search Knowledge Base',
            ctaLink: '#search',
        }
    ];

    return (
        <div className="flex flex-col min-h-screen bg-slate-950">
            {/* Header - Matching Blog/Landing */}
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
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/courses">Courses</Link>
                    <Link className="text-sm font-medium text-slate-300 hover:text-white transition-colors" href="/blog">Blog</Link>
                    <Link className="text-sm font-medium text-purple-400 hover:text-white transition-colors" href="/questions">FAQs</Link>
                    <Link href="/sign-in">
                        <Button variant="ghost" size="sm" className="text-slate-300 hover:text-white hover:bg-slate-800">Log In</Button>
                    </Link>
                </nav>
            </header>

            <main className="flex-1">
                {/* Hero Slideshow */}
                <SimpleHeroSlideshow slides={heroSlides} autoplay={true} interval={6000} />

                {/* Search Bar Section */}
                <section id="search" className="py-12 bg-slate-900 border-b border-slate-800">
                    <div className="container px-4 mx-auto max-w-4xl">
                        <form className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-400 transition-colors" size={24} />
                            <input 
                                type="text"
                                name="search"
                                defaultValue={search}
                                placeholder="Search for questions (e.g. 'Baby shower games', 'Strategy')..."
                                className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl py-6 pl-16 pr-6 text-xl text-white focus:outline-none focus:border-purple-500 transition-all shadow-2xl"
                            />
                        </form>
                    </div>
                </section>

                {/* Categories & Questions */}
                <section id="categories" className="py-20 container px-4 mx-auto max-w-7xl">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
                        {/* Sidebar: Categories */}
                        <div className="lg:col-span-1 border-r border-slate-800/50 pr-8 hidden lg:block">
                            <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest mb-6">Browse by Category</h3>
                            <nav className="flex flex-col gap-2">
                                {categories.map(cat => (
                                    <Link 
                                        key={cat} 
                                        href={`#cat-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                                        className="text-slate-400 hover:text-purple-400 transition-colors text-sm py-2 border-b border-slate-800/30 flex items-center justify-between group"
                                    >
                                        {cat}
                                        <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </Link>
                                ))}
                            </nav>
                        </div>

                        {/* Main Questions Feed */}
                        <div className="lg:col-span-3 space-y-24">
                            {search && (
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-8">Search Results for "{search}"</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {faqs.map((faq: any) => (
                                            <FAQCard key={faq._id} faq={faq} />
                                        ))}
                                    </div>
                                </div>
                            )}

                            {!search && categories.map(cat => {
                                const catFaqs = faqs.filter((f: any) => f.parentQuestion === cat);
                                if (catFaqs.length === 0) return null;

                                return (
                                    <div key={cat} id={`cat-${cat.toLowerCase().replace(/\s+/g, '-')}`} className="scroll-mt-24">
                                        <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
                                            <div className="bg-purple-900/50 p-2 rounded-lg text-purple-400">
                                                <HelpCircle size={24} />
                                            </div>
                                            <h2 className="text-3xl font-black text-white">{cat}</h2>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {catFaqs.slice(0, 6).map((faq: any) => (
                                                <FAQCard key={faq._id} faq={faq} />
                                            ))}
                                            {catFaqs.length > 6 && (
                                                <div className="col-span-full text-center mt-4">
                                                    <Button variant="ghost" className="text-purple-400 hover:text-white">View all {cat} questions</Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-slate-800 bg-slate-900 mt-20">
                <div className="container px-4 mx-auto text-center">
                    <p className="text-slate-500 text-sm italic">© 2025 K Business Academy. Elevating professional growth through structured execution.</p>
                </div>
            </footer>
        </div>
    );
}

function FAQCard({ faq }: { faq: any }) {
    return (
        <Link 
            href={`/questions/${faq.slug}`}
            className="block p-6 bg-slate-900 border border-slate-800 rounded-2xl hover:border-purple-500/50 transition-all hover:bg-slate-800/50 group"
        >
            <div className="flex items-start gap-4">
                <div className="mt-1 bg-slate-800 p-2 rounded-lg text-slate-500 group-hover:text-purple-400 transition-colors">
                    <BookOpen size={18} />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-400 transition-colors mb-2">{faq.question}</h3>
                    <p className="text-slate-400 text-sm line-clamp-2">{faq.answerSnippet}</p>
                </div>
            </div>
        </Link>
    );
}
