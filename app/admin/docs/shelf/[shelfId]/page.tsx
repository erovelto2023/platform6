import { getShelf, getBooks } from "@/lib/actions/docs.actions";
import { BookForm } from "../../_components/book-form";
import Link from "next/link";
import { ArrowLeft, Book } from "lucide-react";
import { DeleteBookButton } from "../../_components/delete-buttons";

export default async function AdminShelfPage(props: { params: Promise<{ shelfId: string }> }) {
    const params = await props.params;
    const shelf = await getShelf(params.shelfId);
    const books = await getBooks(params.shelfId);

    if (!shelf) return <div>Shelf not found</div>;

    return (
        <div className="p-8 space-y-8">
            <Link href="/admin/docs" className="flex items-center gap-1 text-slate-500 hover:text-blue-600 mb-4">
                <ArrowLeft size={16} /> Back to Shelves
            </Link>

            <header>
                <h1 className="text-3xl font-bold">Manage Shelf: {shelf.title}</h1>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Create New Book</h2>
                    <BookForm shelfId={params.shelfId} />
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Books in Shelf</h2>
                    <div className="space-y-4">
                        {books.length === 0 && <p className="text-slate-500 italic">No books yet.</p>}
                        {books.map((book: any) => (
                            <div key={book._id} className="p-4 bg-white border rounded shadow-sm flex justify-between items-center group hover:border-blue-300 transition-colors">
                                <div className="flex items-center gap-3">
                                    <Book className="text-blue-500" size={20} />
                                    <span className="font-medium text-slate-900">{book.title}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Link href={`/admin/docs/book/${book._id}`} className="text-sm bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 px-3 py-1 rounded transition-colors">
                                        Manage Content
                                    </Link>
                                    <DeleteBookButton bookId={book._id} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
