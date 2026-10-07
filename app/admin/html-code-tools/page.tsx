import { getHtmlCodeTools } from "@/lib/actions/html-code-tool.actions";
import HtmlCodeToolManager from "../../../components/admin/HtmlCodeToolManager";
import { Code, Sparkles, Wrench } from "lucide-react";

export const metadata = {
    title: "HTML CODE Tools | K Business Academy Admin",
    description: "Create and manage custom HTML/JS code tools for glossary pages.",
};

export default async function HtmlCodeToolsAdminPage() {
    const res = await getHtmlCodeTools();
    const tools = res.success && Array.isArray(res.data) ? res.data : [];

    return (
        <div className="p-6 md:p-10 space-y-8 max-w-7xl mx-auto font-sans text-slate-100">
            {/* Header Banner */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
                <div className="absolute -right-16 -top-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2.5 rounded-2xl bg-cyan-950 border border-cyan-800 text-cyan-400">
                                <Code size={24} />
                            </div>
                            <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">
                                Custom Embed Engine
                            </span>
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tight text-white uppercase">
                            HTML CODE Tools
                        </h1>
                        <p className="text-sm text-slate-300 font-medium max-w-2xl leading-relaxed">
                            Save, preview, and deploy custom HTML, JavaScript scripts, calculators, and interactive widgets to embedding slots on glossary pages.
                        </p>
                    </div>
                </div>
            </div>

            {/* Manager Component */}
            <HtmlCodeToolManager initialTools={tools} />
        </div>
    );
}
