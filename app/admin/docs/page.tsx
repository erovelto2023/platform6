import Link from "next/link";
import { getShelves } from "@/lib/actions/docs.actions";
import { ShelfForm } from "./_components/shelf-form";
import { DeleteShelfButton } from "./_components/delete-buttons";

export default async function AdminDocsPage() {
    const shelves = await getShelves();

    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold">Documentation Admin</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h2 className="text-xl font-bold mb-4">Create New Shelf</h2>
                    <ShelfForm />
                </div>

                <div>
                    <h2 className="text-xl font-bold mb-4">Existing Shelves</h2>
                    <ul className="space-y-2">
                        {shelves.map((shelf: any) => (
                            <li key={shelf._id} className="p-4 bg-white border rounded shadow-sm flex justify-between items-center">
                                <span className="font-medium text-slate-800">{shelf.title}</span>
                                <div className="flex items-center gap-3">
                                    <Link href={`/admin/docs/shelf/${shelf._id}`} className="text-sm bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 px-3 py-1 rounded transition-colors">
                                        Manage Books
                                    </Link>
                                    <DeleteShelfButton shelfId={shelf._id} />
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
