import Link from 'next/link';
import dbConnect from '@/lib/dbConnect';
import { PillarPage } from '@/models';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata = {
  title: 'Content Hub Directory | OmniPublish',
  description: 'Browse all published content pillar hubs — science-backed guides built with semantic SEO and expert authorship.',
};

export const dynamic = 'force-dynamic';

export default async function HubsDirectoryPage() {
  await dbConnect();

  const rawHubs = await PillarPage.find({ isPublished: true })
    .populate('author')
    .populate('primaryProduct')
    .sort({ updatedAt: -1 });

  const hubs = rawHubs.map((doc) => {
    const plain = doc.toObject ? doc.toObject() : doc;
    return JSON.parse(JSON.stringify(plain));
  });

  // Extract unique categories for filters
  const categories = ['All', ...Array.from(new Set(hubs.map((h: any) => h.category || 'General')))];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text)' }}>
      {/* Header */}
      <header className="max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-black tracking-tight" style={{ color: 'var(--nav-brand)' }}>
            Omni<span style={{ color: 'var(--color-text)' }}>Publish</span>
          </span>
        </Link>
        <Link
          href="/admin"
          className="text-xs font-bold flex items-center gap-1 px-4 py-2 rounded-xl border transition"
          style={{ color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
        >
          Admin
        </Link>
      </header>

      {/* Hero Section */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16 text-center space-y-4">
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto border"
          style={{ backgroundColor: 'color-mix(in srgb, var(--color-primary) 10%, transparent)', borderColor: 'color-mix(in srgb, var(--color-primary) 20%, transparent)', color: 'var(--color-primary)' }}
        >
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight" style={{ color: 'var(--color-text)' }}>
          Content Hub Directory
        </h1>
        <p className="text-base max-w-xl mx-auto" style={{ color: 'var(--color-text-muted)' }}>
          Browse our published expert-authored content hubs. Each hub is a comprehensive pillar guide built with semantic SEO and E-E-A-T compliance.
        </p>
      </section>

      {/* Category Chips */}
      <div className="max-w-5xl mx-auto w-full px-6 pb-8 flex flex-wrap gap-2 justify-center">
        {categories.map((cat) => (
          <span
            key={cat as string}
            className="text-xs font-bold px-4 py-1.5 rounded-full border cursor-pointer transition hover:opacity-80"
            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)', backgroundColor: 'var(--color-surface)' }}
          >
            {cat as string}
          </span>
        ))}
      </div>

      {/* Hub Grid */}
      <section className="max-w-5xl mx-auto w-full px-6 pb-20">
        {hubs.length === 0 ? (
          <div className="text-center py-16 space-y-4">
            <p className="text-lg font-bold" style={{ color: 'var(--color-text-muted)' }}>No hubs published yet.</p>
            <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
              Visit the <Link href="/admin" className="underline font-bold" style={{ color: 'var(--color-primary)' }}>Admin Console</Link> and seed the database to get started.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {hubs.map((hub: any) => (
              <Link
                key={hub._id}
                href={`/hub/${hub.slug}`}
                className="group rounded-3xl shadow-xl overflow-hidden flex flex-col transition duration-200 hover:-translate-y-1 hover:shadow-2xl border"
                style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
              >
                {/* Accent Top Border */}
                <div
                  className="h-1.5 w-full"
                  style={{ backgroundColor: hub.accentColor || 'var(--color-primary)' }}
                />

                <div className="p-6 flex flex-col flex-1 space-y-4">
                  {/* Header Row */}
                  <div className="flex items-start justify-between">
                    <span className="text-3xl">{hub.icon || '📄'}</span>
                    <span
                      className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wider"
                      style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                    >
                      {hub.category || 'General'}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="flex-1 space-y-2">
                    <h3 className="text-lg font-black leading-tight" style={{ color: 'var(--color-text)' }}>
                      {hub.heroTitle || hub.keyword}
                    </h3>
                    <p className="text-xs leading-relaxed line-clamp-3" style={{ color: 'var(--color-text-muted)' }}>
                      {hub.metaDescription}
                    </p>
                  </div>

                  {/* Author & Trust */}
                  <div className="pt-3 space-y-2" style={{ borderTop: '1px solid var(--color-border)' }}>
                    {hub.author && (
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center text-[8px] font-black"
                          style={{ backgroundColor: hub.accentColor || 'var(--color-primary)', color: '#fff' }}
                        >
                          {hub.author.avatarUrl || hub.author.name?.charAt(0)}
                        </div>
                        <span className="text-[10px] font-bold" style={{ color: 'var(--color-text-muted)' }}>
                          {hub.author.name}
                        </span>
                        {hub.author.verificationBadge && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded font-bold" style={{ backgroundColor: 'color-mix(in srgb, var(--color-success) 10%, transparent)', color: 'var(--color-success)' }}>✓ Verified</span>
                        )}
                      </div>
                    )}
                    {hub.trustBadges && hub.trustBadges.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {hub.trustBadges.slice(0, 2).map((badge: string, i: number) => (
                          <span
                            key={i}
                            className="text-[8px] px-2 py-0.5 rounded-full border font-bold"
                            style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-muted)' }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-1 text-xs font-bold group-hover:translate-x-1 transition-transform" style={{ color: hub.accentColor || 'var(--color-primary)' }}>
                    Explore Hub <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer
        className="max-w-7xl mx-auto w-full px-6 py-6 text-center text-xs font-medium"
        style={{ borderTop: '1px solid var(--color-border)', color: 'var(--color-text-muted)' }}
      >
        &copy; {new Date().getFullYear()} OmniPublish Engine. All rights reserved.
      </footer>

      {/* JSON-LD ItemList Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "OmniPublish Content Hub Directory",
            "itemListElement": hubs.map((hub: any, i: number) => ({
              "@type": "ListItem",
              "position": i + 1,
              "url": `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/hub/${hub.slug}`,
              "name": hub.heroTitle || hub.keyword,
            })),
          }),
        }}
      />
    </div>
  );
}
