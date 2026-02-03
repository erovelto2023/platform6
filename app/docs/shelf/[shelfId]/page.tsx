import { getBooks, getShelves } from "@/lib/actions/docs.actions";
import Link from "next/link";
import { Book, ArrowLeft } from "lucide-react";

export default async function ShelfPage(props: { params: Promise<{ shelfId: string }> }) {
    const params = await props.params;

    // Get all shelves to find the one matching slug or ID
    const shelves = await getShelves();
    const shelf = shelves.find((s: any) =>
        s.slug === params.shelfId || s._id === params.shelfId
    );

    if (!shelf) {
        return (
            <div className="p-8">
                <Link href="/docs" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4">
                    <ArrowLeft size={16} /> Back to Library
                </Link>
                <p className="text-slate-500">Shelf not found.</p>
            </div>
        );
    }

    // Get books using the actual shelf ID
    const books = await getBooks(shelf._id);

    return (
        <div className="p-8 space-y-8">
            <header className="mb-8">
                <Link href="/docs" className="text-sm text-slate-500 hover:text-blue-600 flex items-center gap-1 mb-4">
                    <ArrowLeft size={16} /> Back to Library
                </Link>
                <h1 className="text-3xl font-bold mb-2">{shelf.title}</h1>
                {shelf.description && <p className="text-slate-500">{shelf.description}</p>}
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {books.length === 0 && (
                    <div className="col-span-full text-center py-12 text-slate-500">
                        No books found in this shelf.
                    </div>
                )}

                {books.map((book: any) => (
                    <Link key={book._id} href={`/docs/book/${book._id}`} className="block group">
                        <div className="bg-white border border-slate-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all h-full flex flex-col">
                            <div className="mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <Book size={24} />
                                </div>
                                <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{book.title}</h3>
                            </div>
                            <p className="text-slate-500 text-sm line-clamp-3 mb-4 flex-1">{book.description}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
