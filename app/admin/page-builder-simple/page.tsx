import { getPages } from "@/lib/actions/page-builder.actions";
import SimplePageListClient from "@/components/admin/SimplePageListClient";
import { FileStack } from "lucide-react";

export default async function AdminSimplePagesPage() {
    const pages = await getPages();
    
    // Filter pages that only have one section with customHTML (simple pages)
    // Or just show all for now since we're transitioning
    const simplePages = pages.filter((p: any) => 
        p.sections?.length === 1 && p.sections[0].templateId === 'custom-html'
    );

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            <div className="space-y-2">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-sky-600 rounded-xl text-white shadow-lg shadow-sky-500/20">
                        <FileStack size={24} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Simple Page Builder</h1>
                </div>
                <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] ml-12">
                    Paste your own HTML code to build pages in seconds
                </p>
            </div>

            <SimplePageListClient initialPages={simplePages} />
        </div>
    );
}
