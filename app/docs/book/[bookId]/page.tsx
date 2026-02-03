import { getBookStructure } from "@/lib/actions/docs.actions";
import Link from "next/link";
import { List, FileText, ChevronRight, BookOpen } from "lucide-react";
import ReactMarkdown from "react-markdown";

export default async function BookPage(props: { params: Promise<{ bookId: string }> }) {
    const params = await props.params;
    const book = await getBookStructure(params.bookId);

    if (!book) return <div>Book not found</div>;

    // Use first page as default view if no page selected in URL? 
    // Actually, BookStack shows a "Book Overview" or Table of Contents initially.
    // Let's show the Book Overview.

    return (
        <div className="flex min-h-screen bg-slate-50">
            {/* Sidebar Navigation */}
            <aside className="w-80 bg-white border-r border-slate-200 h-screen sticky top-0 overflow-y-auto p-6 hidden lg:block">
                <Link href={`/docs/shelf/${book.shelfId}`} className="text-xs text-slate-500 hover:text-blue-600 mb-4 block font-bold uppercase tracking-wider">
                    ← Back to Shelf
                </Link>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-600 rounded flex items-center justify-center text-white shrink-0">
                        <BookOpen size={20} />
                    </div>
                    <h1 className="font-bold text-slate-800 leading-tight">{book.title}</h1>
                </div>

                <nav className="space-y-1">
                    {/* Render Chapters and Pages */}
                    {book.chapters.map((chapter: any) => (
                        <div key={chapter._id} className="mb-4">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2 mb-2 px-2">
                                <List size={14} className="text-slate-400" /> {chapter.title}
                            </h3>
                            <ul className="pl-6 border-l border-slate-100 ml-2 space-y-1">
                                {chapter.pages.map((page: any) => (
                                    <li key={page._id}>
                                        <Link href={`/docs/book/${book._id}/page/${page.slug}`} className="block text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-2 py-1 rounded transition-colors">
                                            {page.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Direct Pages */}
                    {book.directPages.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 px-2 mt-6">Other Pages</h3>
                            <ul className="pl-2 space-y-1">
                                {book.directPages.map((page: any) => (
                                    <li key={page._id}>
                                        <Link href={`/docs/book/${book._id}/page/${page.slug}`} className="flex items-center gap-2 text-sm text-slate-600 hover:text-blue-600 hover:bg-slate-50 px-2 py-1 rounded transition-colors">
                                            <FileText size={14} /> {page.title}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </nav>
            </aside>

            {/* Main Content Area - Book Overview generic */}
            <main className="flex-1 p-12 max-w-5xl mx-auto">
                <div className="bg-white p-12 rounded-xl border border-slate-200 shadow-sm min-h-[500px]">
                    <h1 className="text-4xl font-bold text-slate-900 mb-6">{book.title}</h1>
                    <p className="text-xl text-slate-600 mb-8 leading-relaxed">{book.description}</p>
                    <hr className="my-8 border-slate-100" />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {book.chapters.map((chapter: any) => (
                            <div key={chapter._id} className="p-4 rounded border border-slate-100 bg-slate-50">
                                <h3 className="font-bold text-slate-900 mb-2">{chapter.title}</h3>
                                <ul className="space-y-1">
                                    {chapter.pages.map((page: any) => (
                                        <li key={page._id}>
                                            <Link href={`/docs/book/${book._id}/page/${page.slug}`} className="text-sm text-blue-600 hover:underline">
                                                {page.title}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
