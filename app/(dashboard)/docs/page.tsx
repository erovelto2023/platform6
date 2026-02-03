import { getShelves } from "@/lib/actions/docs.actions";
import Link from "next/link";
import { Book } from "lucide-react";

export default async function DocsPage() {
    const shelves = await getShelves();

    return (
        <div className="p-8 space-y-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Library</h1>
                <p className="text-slate-500">Browse documentation and knowledge base.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {shelves.length === 0 && (
                    <div className="col-span-full text-center py-12 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                        <p className="text-slate-500">No shelves found. Please contact admin to create content.</p>
                    </div>
                )}

                {shelves.map((shelf: any) => (
                    <Link key={shelf._id} href={`/docs/shelf/${shelf.slug}`} className="group block bg-white border border-slate-200 rounded-xl overflow-hidden hover:shadow-lg transition-all">
                        <div className="h-32 bg-blue-600 relative overflow-hidden">
                            {shelf.image && <img src={shelf.image} alt={shelf.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" />}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Book className="text-white w-12 h-12 opacity-80" />
                            </div>
                        </div>
                        <div className="p-6">
                            <h2 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">{shelf.title}</h2>
                            <p className="text-slate-500 line-clamp-2 text-sm">{shelf.description || "No description provided."}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
