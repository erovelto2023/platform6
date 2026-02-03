import { getBookStructure, getPage, getPageBySlug } from "@/lib/actions/docs.actions";
import Link from "next/link";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { MarkdownRenderer } from "./_components/markdown-renderer";

export async function generateMetadata(props: { params: Promise<{ bookId: string, pageId: string }> }): Promise<Metadata> {
    const params = await props.params;

    // Try to get page by slug first, then by ID
    let page = await getPageBySlug(params.bookId, params.pageId);
    if (!page) {
        page = await getPage(params.pageId);
    }

    const book = await getBookStructure(params.bookId);

    return {
        title: `${page?.title || 'Page'} | ${book?.title || 'Documentation'}`,
        description: page?.content?.substring(0, 160) || `Read ${page?.title} in our knowledge base`,
        openGraph: {
            title: page?.title,
            description: page?.content?.substring(0, 160),
            type: 'article',
        },
    };
}

export default async function DocPageViewer(props: { params: Promise<{ bookId: string, pageId: string }> }) {
    const params = await props.params;
    const book = await getBookStructure(params.bookId);

    // Try to get page by slug first, then by ID
    let currentPage = await getPageBySlug(params.bookId, params.pageId);
    if (!currentPage) {
        currentPage = await getPage(params.pageId);
    }

    if (!book || !currentPage) return <div className="p-8">Page not found</div>;

    return (
        <div className="min-h-screen bg-white">
            {/* Header with breadcrumbs */}
            <header className="border-b bg-white sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <Link href={`/docs/book/${book._id}`} className="inline-flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 mb-3">
                        <ArrowLeft size={16} />
                        Back to {book.title}
                    </Link>

                    <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                        <Link href="/docs" className="hover:text-blue-600">Library</Link>
                        <ChevronRight size={14} />
                        <Link href={`/docs/shelf/${book.shelfId}`} className="hover:text-blue-600">
                            Shelf
                        </Link>
                        <ChevronRight size={14} />
                        <Link href={`/docs/book/${book._id}`} className="hover:text-blue-600">
                            {book.title}
                        </Link>
                        <ChevronRight size={14} />
                        <span className="text-slate-900 font-medium">{currentPage.title}</span>
                    </div>

                    <h1 className="text-3xl font-bold text-slate-900">{currentPage.title}</h1>
                </div>
            </header>

            {/* Full-width content */}
            <main className="w-full">
                <MarkdownRenderer content={currentPage.content || "*No content yet.*"} />
            </main>
        </div>
    );
}
