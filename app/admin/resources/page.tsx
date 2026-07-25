import { Button } from "@/components/ui/button";
import { PlusCircle, Library } from "lucide-react";
import Link from "next/link";
import { getResources } from "@/lib/actions/resource.actions";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";

export default async function ResourcesPage() {
    const resources = await getResources();

    return (
        <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto font-sans">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="flex items-center gap-4">
                    <div className="bg-slate-950 border border-slate-800 p-3.5 rounded-2xl shadow-xl">
                        <Library size={24} className="text-cyan-400" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-slate-100 uppercase">
                            Resources Manager
                        </h1>
                        <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Downloads, Templates & Student Materials</p>
                    </div>
                </div>
                <Link href="/admin/resources/create">
                    <Button className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold px-6 py-3 rounded-2xl text-xs tracking-wider uppercase shadow-lg shadow-indigo-600/30 border-0 cursor-pointer">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        New Resource
                    </Button>
                </Link>
            </div>
            
            <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden p-2">
                <DataTable columns={columns} data={resources} />
            </div>
        </div>
    );
}
