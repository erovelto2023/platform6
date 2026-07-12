import dbConnect from '@/lib/dbConnect';
import { PillarPage, BlogPost, Glossary, Directory, Product, Author } from '@/models';
import { interlinkContent } from '@/lib/interlink';
import BlogRollup from '@/components/BlogRollup';
import GlossaryList from '@/components/GlossaryList';
import SidebarCourseCard from '@/components/SidebarCourseCard';
import FreeCompanionGuide from '@/components/FreeCompanionGuide';
import { notFound } from 'next/navigation';
import { Star, ShieldAlert, Check } from 'lucide-react';
import Link from 'next/link';

// Dynamic SEO metadata generation
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;
  const pillar = await PillarPage.findOne({ slug });
  
  if (!pillar) {
    return {
      title: 'Pillar Page Not Found | OmniPublish',
      description: 'The requested resource hub could not be found.',
    };
  }

  return {
    title: pillar.title,
    description: pillar.metaDescription,
  };
}

export default async function HubPage({ params }: { params: Promise<{ slug: string }> }) {
  await dbConnect();
  const { slug } = await params;

  // Retrieve the pillar page and populate author and primaryProduct references
  const pillar = await PillarPage.findOne({ slug })
    .populate('author')
    .populate('primaryProduct');

  if (!pillar) {
    notFound();
  }

  const author = pillar.author;
  const product = pillar.primaryProduct;

  // Fetch all secondary databases linked to this pillar page
  const rawPosts = await BlogPost.find({ pillarId: pillar._id });
  const rawGlossary = await Glossary.find({ pillarId: pillar._id }).sort({ term: 1 });
  const rawDirectory = await Directory.find({ pillarId: pillar._id }).sort({ rating: -1 });

  // Map glossary items to clean serialized objects
  const glossary = rawGlossary.map((item) => {
    const obj = item.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
      pillarId: obj.pillarId.toString(),
    };
  });

  // Process and interlink blog post contents dynamically on the server
  const posts = rawPosts.map((post) => {
    const obj = post.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
      pillarId: obj.pillarId.toString(),
      content: interlinkContent(obj.content, glossary),
    };
  });

  // Map directory items to clean serialized objects
  const directory = rawDirectory.map((item) => {
    const obj = item.toObject();
    return {
      ...obj,
      _id: obj._id.toString(),
      pillarId: obj.pillarId.toString(),
    };
  });

  // Serialize product for Client component
  const serializedProduct = product ? {
    _id: product._id.toString(),
    title: product.title,
    price: product.price,
    description: product.description,
  } : null;

  // Compile JSON-LD data for the document head
  const authorSchema = author ? {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    'mainEntity': {
      '@type': 'Person',
      'name': author.name,
      'description': author.bio,
      'jobTitle': author.credentials,
      'worksFor': {
        '@type': 'Organization',
        'name': 'OmniPublish'
      }
    }
  } : null;

  const productSchema = product ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.title,
    'description': product.description,
    'offers': {
      '@type': 'Offer',
      'price': product.price.toFixed(2),
      'priceCurrency': 'USD',
      'availability': 'https://schema.org/InStock',
      'url': `${process.env.NEXTAUTH_URL}/checkout?productId=${product._id}`
    }
  } : null;

  const faqSchema = glossary.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': glossary.map((item) => ({
      '@type': 'Question',
      'name': `What is ${item.term}?`,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': item.definition
      }
    }))
  } : null;

  const articleSchemas = posts.map((post) => ({
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': post.title,
    'description': post.excerpt,
    'author': author ? {
      '@type': 'Person',
      'name': author.name
    } : undefined,
    'publisher': {
      '@type': 'Organization',
      'name': 'OmniPublish',
      'logo': {
        '@type': 'ImageObject',
        'url': `${process.env.NEXTAUTH_URL}/favicon.ico`
      }
    }
  }));

  return (
    <>
      {/* Schema Injection in Head */}
      {authorSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(authorSchema) }}
        />
      )}
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {articleSchemas.map((schema, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* Dynamic CSS Overrides */}
      {pillar.accentColor && (
        <style dangerouslySetInnerHTML={{ __html: `
          .hub-accent-color { color: ${pillar.accentColor} !important; }
          .hub-accent-bg { background-color: ${pillar.accentColor} !important; }
          .hub-accent-border { border-color: ${pillar.accentColor} !important; }
          .hub-accent-hover-bg:hover { background-color: ${pillar.accentColor}ee !important; }
          .hub-accent-hover-color:hover { color: ${pillar.accentColor} !important; }
        `}} />
      )}

      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/" className="text-2xl font-black tracking-tight text-slate-900">
              Omni<span className="hub-accent-color">Publish</span>
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            <a href="#guide" className="hub-accent-hover-color transition">Expert Guide</a>
            <a href="#blog" className="hub-accent-hover-color transition">Articles</a>
            <a href="#glossary" className="hub-accent-hover-color transition">Glossary</a>
            <a href="#directory" className="hub-accent-hover-color transition">Resources</a>
          </div>
          <div>
            {serializedProduct ? (
              <Link
                href={`/checkout?productId=${serializedProduct._id}`}
                className="hub-accent-bg hub-accent-hover-bg text-white px-5 py-2.5 rounded-xl text-xs font-bold transition shadow-sm hover:scale-[1.01] block"
              >
                Enroll in Course
              </Link>
            ) : (
              <span className="text-slate-300 text-xs">No active courses</span>
            )}
          </div>
        </div>
      </nav>

      {/* Header / Hero */}
      <header 
        className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white py-20 px-4 relative overflow-hidden"
        style={pillar.accentColor ? { backgroundImage: `linear-gradient(135deg, #090d16 0%, ${pillar.accentColor}25 50%, #090d16 100%)` } : undefined}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-30"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-6">
          <span 
            className="text-[10px] uppercase tracking-widest font-extrabold px-3 py-1 rounded-full border"
            style={{
              color: pillar.accentColor || '#6366f1',
              backgroundColor: `${pillar.accentColor || '#6366f1'}15`,
              borderColor: `${pillar.accentColor || '#6366f1'}30`
            }}
          >
            {pillar.category} Pillar Hub
          </span>
          <h1 className="text-4xl md:text-6xl font-black tracking-tight leading-tight">
            {pillar.heroTitle || `The Ultimate Guide to ${pillar.keyword}`}
          </h1>
          <p className="text-base md:text-lg text-slate-350 max-w-2xl mx-auto font-normal leading-relaxed">
            {pillar.heroSubtitle}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 text-[10px] text-slate-400 border-t border-b border-slate-800/80 py-4 max-w-xl mx-auto uppercase font-bold tracking-wider">
            {pillar.trustBadges && pillar.trustBadges.length > 0 ? (
              pillar.trustBadges.map((badge: string, idx: number) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: pillar.accentColor || '#6366f1' }}></span> {badge}
                </div>
              ))
            ) : (
              <>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Evidence-Based Content
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Reviewed by Experts
                </div>
              </>
            )}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-slate-500"></span> Updated: July 2026
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Content Column (Left) */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* Author Block */}
            {author && (
              <section id="guide" className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
                  <div 
                    className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-lg shadow-md"
                    style={{
                      background: `linear-gradient(to top right, ${pillar.accentColor || '#6366f1'}, ${pillar.accentColor || '#6366f1'}aa)`
                    }}
                  >
                    {author.avatarUrl || 'JD'}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase font-extrabold text-slate-400 tracking-wider">
                      Written & Verified By
                    </p>
                    <h3 className="text-lg font-black text-slate-900 flex items-center gap-1.5">
                      {author.name}
                      {author.verificationBadge && (
                        <span className="bg-emerald-100 text-emerald-800 text-[9px] font-bold px-2 py-0.5 rounded-full border border-emerald-250 flex items-center gap-0.5">
                          <Check className="w-3 h-3 text-emerald-600 stroke-[3px]" /> Verified Specialist
                        </span>
                      )}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium">
                      {author.credentials}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h2 className="text-xl font-bold text-slate-900">
                    Introduction to {pillar.keyword}
                  </h2>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {pillar.introductionText}
                  </p>
                </div>
              </section>
            )}

            {/* Blog Guides */}
            <BlogRollup posts={posts} keyword={pillar.keyword} accentColor={pillar.accentColor} />

            {/* Glossary Dictionary */}
            <GlossaryList glossary={glossary} keyword={pillar.keyword} accentColor={pillar.accentColor} />

            {/* Resources Directory */}
            <section id="directory" className="space-y-6">
              <div className="space-y-2 border-b border-slate-200 pb-3">
                <h2 className="text-2xl font-black tracking-tight text-slate-900">
                  3. Vetted {pillar.keyword} Directory
                </h2>
                <div className="p-3 bg-amber-50 border border-amber-200/50 rounded-xl flex gap-2 items-start text-[11px] text-amber-855 text-amber-800">
                  <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Affiliate Disclosure:</strong> {pillar.affiliateDisclosure || 'Purchasing items through links below generates commissions for our research budget. All products are reviewed by experts.'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {directory.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-sm hover:shadow-md transition duration-200 relative overflow-hidden"
                  >
                    {item.isSponsored && (
                      <div 
                        className="absolute top-0 left-0 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-br-lg tracking-wider border-r border-b"
                        style={{ backgroundColor: pillar.accentColor || '#6366f1', borderColor: `${pillar.accentColor || '#6366f1'}ee` }}
                      >
                        Top Pick
                      </div>
                    )}
                    <div className="space-y-2 pt-2 sm:pt-0">
                      <div className="flex items-center gap-2">
                        <span className="bg-slate-100 text-slate-600 text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider">
                          {item.category}
                        </span>
                        <div className="flex items-center text-amber-400">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star
                              key={idx}
                              className={`w-3.5 h-3.5 ${
                                idx < Math.floor(item.rating)
                                  ? 'fill-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                          <span className="text-[11px] text-slate-500 font-bold ml-1">
                            {item.rating.toFixed(1)}
                          </span>
                        </div>
                      </div>
                      <h4 className="text-lg font-black text-slate-900">
                        {item.resourceName}
                      </h4>
                      <p className="text-xs text-slate-500 leading-relaxed max-w-xl">
                        {item.description}
                      </p>
                    </div>
                    <div className="w-full sm:w-auto text-right">
                      <a
                        href={item.affiliateUrl}
                        target="_blank"
                        rel="nofollow"
                        className="block w-full sm:w-auto bg-slate-900 text-white text-center text-xs font-bold px-5 py-3 rounded-xl hover:bg-slate-800 transition duration-150 shadow-sm"
                      >
                        View Resource &rarr;
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Sticky Sidebar Column (Right) */}
          <aside className="lg:sticky lg:top-24 space-y-6">
            {serializedProduct && (
              <SidebarCourseCard product={serializedProduct} accentColor={pillar.accentColor} />
            )}
            <FreeCompanionGuide keyword={pillar.keyword} accentColor={pillar.accentColor} />
          </aside>

        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-12 mt-24">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-400 space-y-3 font-medium">
          <p>&copy; {new Date().getFullYear()} OmniPublish Inc. All rights reserved.</p>
          <p className="max-w-xl mx-auto leading-relaxed">
            {pillar.category === 'Pets' 
              ? 'Disclaimer: The educational insights supplied on this hub do not replace tailored veterinary medical diagnosis, professional behavior treatment, or behavioral counseling.'
              : `Disclaimer: The educational insights supplied on this hub are for informational and educational purposes only and do not replace professional advice regarding ${pillar.keyword.toLowerCase()}.`}
          </p>
        </div>
      </footer>
    </>
  );
}
