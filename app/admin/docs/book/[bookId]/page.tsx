import { getBookStructure } from "@/lib/actions/docs.actions";
import { ContentForm } from "../../_components/content-form";
import Link from "next/link";
import { ArrowLeft, FileText, Folder } from "lucide-react";
import { DeleteBookButton, DeleteChapterButton, DeletePageButton } from "../../_components/delete-buttons";

export default async function AdminBookPage(props: { params: Promise<{ bookId: string }> }) {
    const params = await props.params;
    const book = await getBookStructure(params.bookId);

    if (!book) return <div>Book not found</div>;

    return (
        <div className="p-8 space-y-8">
            <Link href={`/admin/docs/shelf/${book.shelfId}`} className="flex items-center gap-1 text-slate-500 hover:text-blue-600 mb-4">
                <ArrowLeft size={16} /> Back to Book List
            </Link>

            <header className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Manage Book: {book.title}</h1>
                <DeleteBookButton bookId={params.bookId} redirectTo={`/admin/docs/shelf/${book.shelfId}`} />
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Add Content</h2>
                    <ContentForm bookId={params.bookId} />
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Book Structure</h2>
                    <div className="bg-white p-6 rounded shadow border">
                        {/* Chapters */}
                        {book.chapters.map((chapter: any) => (
                            <div key={chapter._id} className="mb-4">
                                <div className="font-bold flex items-center gap-2 text-slate-800 bg-slate-50 p-2 rounded">
                                    <Folder size={16} className="text-blue-500" />
                                    <span className="flex-1">{chapter.title}</span>
                                    <DeleteChapterButton chapterId={chapter._id} />
                                </div>
                                <ul className="pl-6 mt-2 space-y-1 border-l-2 border-slate-100 ml-3">
                                    {chapter.pages.map((page: any) => (
                                        <li key={page._id} className="flex items-center gap-2 text-sm p-1 rounded hover:bg-slate-50">
                                            <FileText size={14} className="text-slate-400" />
                                            <span className="flex-1">{page.title}</span>
                                            <Link href={`/docs/book/${book._id}/page/${page.slug}`} className="text-xs text-green-600 hover:underline" target="_blank">View</Link>
                                            <Link href={`/docs-editor/${page._id}`} className="text-xs text-blue-600 hover:underline">Edit</Link>
                                            <DeletePageButton pageId={page._id} />
                                        </li>
                                    ))}
                                    {chapter.pages.length === 0 && <li className="text-xs text-slate-400 italic pl-1">Empty chapter</li>}
                                </ul>
                            </div>
                        ))}

                        {/* Direct Pages */}
                        {book.directPages.length > 0 && (
                            <div className="mt-6">
                                <h3 className="font-bold text-sm uppercase text-slate-400 mb-2">Loose Pages</h3>
                                <ul className="space-y-1">
                                    {book.directPages.map((page: any) => (
                                        <li key={page._id} className="flex items-center gap-2 text-sm p-1 rounded hover:bg-slate-50">
                                            <FileText size={14} className="text-slate-400" />
                                            <span className="flex-1">{page.title}</span>
                                            <Link href={`/docs/book/${book._id}/page/${page.slug}`} className="text-xs text-green-600 hover:underline" target="_blank">View</Link>
                                            <Link href={`/docs-editor/${page._id}`} className="text-xs text-blue-600 hover:underline">Edit</Link>
                                            <DeletePageButton pageId={page._id} />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {book.chapters.length === 0 && book.directPages.length === 0 && (
                            <p className="text-slate-500 italic">No content yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
