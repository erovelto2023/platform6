import Link from "next/link";
import { getShelves } from "@/lib/actions/docs.actions";
import { ShelfForm } from "./_components/shelf-form";
import { DeleteShelfButton } from "./_components/delete-buttons";
import { FileText } from "lucide-react";

export default async function AdminDocsPage() {
    const shelves = await getShelves();

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="flex items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
                    <FileText size={24} className="text-cyan-400" />
                </div>
                <div>
                    <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 uppercase">
                        Documentation Admin
                    </h1>
                    <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Internal Shelves, Guides & Reference Manuals</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
                    <h2 className="text-base font-black text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">Create New Shelf</h2>
                    <ShelfForm />
                </div>

                <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-2xl space-y-4">
                    <h2 className="text-base font-black text-slate-100 uppercase tracking-wider border-b border-slate-800 pb-3">Existing Shelves</h2>
                    <ul className="space-y-3">
                        {shelves.map((shelf: any) => (
                            <li key={shelf._id} className="p-4 bg-slate-950 border border-slate-800 rounded-2xl shadow-sm flex justify-between items-center hover:border-cyan-500/80 transition-all">
                                <span className="font-extrabold text-slate-100 text-sm">{shelf.title}</span>
                                <div className="flex items-center gap-3">
                                    <Link href={`/admin/docs/shelf/${shelf._id}`} className="text-xs font-mono font-bold bg-slate-900 border border-slate-800 hover:border-cyan-500 text-cyan-300 px-3.5 py-1.5 rounded-xl transition-colors">
                                        Manage Books
                                    </Link>
                                    <DeleteShelfButton shelfId={shelf._id} />
                                </div>
                            </li>
                        ))}
                        {shelves.length === 0 && (
                            <div className="text-center py-10 text-slate-400 font-mono text-xs uppercase font-bold">
                                No shelves created yet.
                            </div>
                        )}
                    </ul>
                </div>
            </div>
        </div>
    );
}
