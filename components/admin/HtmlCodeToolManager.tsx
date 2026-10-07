"use client";

import { useState, useTransition } from "react";
import { 
    Code, 
    Plus, 
    Search, 
    Edit, 
    Trash2, 
    Check, 
    Copy, 
    Eye, 
    EyeOff, 
    Sparkles, 
    Wrench,
    FileCode,
    Layers,
    Loader2,
    ExternalLink
} from "lucide-react";
import { createHtmlCodeTool, updateHtmlCodeTool, deleteHtmlCodeTool } from "@/lib/actions/html-code-tool.actions";
import { toast } from "sonner";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import HtmlToolRenderer from "../glossary/HtmlToolRenderer";

interface HtmlCodeToolManagerProps {
    initialTools: any[];
}

export default function HtmlCodeToolManager({ initialTools }: HtmlCodeToolManagerProps) {
    const router = useRouter();
    const [tools, setTools] = useState(initialTools);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();

    // Dialog state
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTool, setEditingTool] = useState<any>(null);
    const [previewingToolId, setPreviewingToolId] = useState<string | null>(null);

    // Form state
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        category: "Calculators & Interactive",
        description: "",
        htmlCode: ""
    });

    const [activeFormTab, setActiveFormTab] = useState<'editor' | 'preview'>('editor');
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const filteredTools = tools.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleOpenCreate = () => {
        setEditingTool(null);
        setFormData({
            name: "",
            slug: "",
            category: "Calculators & Interactive",
            description: "",
            htmlCode: `<div className="p-6 bg-slate-950 rounded-2xl border border-cyan-800 text-center font-sans">
  <h3 className="text-lg font-bold text-cyan-400">Custom Tool Header</h3>
  <p className="text-xs text-slate-300 mt-2">Replace this text with your custom HTML or JavaScript calculator code.</p>
</div>`
        });
        setActiveFormTab('editor');
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (tool: any) => {
        setEditingTool(tool);
        setFormData({
            name: tool.name || "",
            slug: tool.slug || "",
            category: tool.category || "General",
            description: tool.description || "",
            htmlCode: tool.htmlCode || ""
        });
        setActiveFormTab('editor');
        setIsDialogOpen(true);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.htmlCode) {
            toast.error("Tool Name and HTML Code are required.");
            return;
        }

        startTransition(async () => {
            let res;
            if (editingTool && editingTool._id) {
                res = await updateHtmlCodeTool(editingTool._id, formData);
            } else {
                res = await createHtmlCodeTool(formData);
            }

            if (res.success) {
                toast.success(editingTool ? "HTML Code Tool updated!" : "HTML Code Tool created!");
                setIsDialogOpen(false);
                router.refresh();
                if (res.data) {
                    if (editingTool) {
                        setTools(prev => prev.map(t => t._id === res.data._id ? res.data : t));
                    } else {
                        setTools(prev => [res.data, ...prev]);
                    }
                }
            } else {
                toast.error(res.error || "Failed to save tool");
            }
        });
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        startTransition(async () => {
            const res = await deleteHtmlCodeTool(id);
            if (res.success) {
                setTools(prev => prev.filter(t => t._id !== id));
                toast.success("Tool deleted");
                router.refresh();
            } else {
                toast.error(res.error || "Failed to delete tool");
            }
        });
    };

    const handleCopyShortcode = (slug: string, id: string) => {
        const tag = `[html-tool:${slug}]`;
        navigator.clipboard.writeText(tag);
        setCopiedId(id);
        toast.success(`Copied tag: ${tag}`);
        setTimeout(() => setCopiedId(null), 2000);
    };

    return (
        <div className="space-y-6 font-sans">
            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900 p-6 rounded-3xl border border-slate-800 shadow-xl">
                <div className="relative w-full sm:w-80">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search HTML tools by name or category..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 outline-none"
                    />
                </div>

                <button
                    onClick={handleOpenCreate}
                    className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Create HTML Code Tool</span>
                </button>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredTools.length === 0 ? (
                    <div className="col-span-full p-12 bg-slate-900 border border-slate-800 rounded-3xl text-center space-y-3">
                        <FileCode className="w-12 h-12 text-slate-600 mx-auto" />
                        <h3 className="text-slate-300 font-bold text-base">No HTML Code Tools Found</h3>
                        <p className="text-xs text-slate-500 font-mono">Create your first HTML Code Tool to start embedding tools into glossary pages.</p>
                        <button
                            onClick={handleOpenCreate}
                            className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-cyan-950 border border-cyan-800 text-cyan-400 rounded-xl text-xs font-mono font-bold hover:bg-cyan-900 transition-colors"
                        >
                            <Plus size={14} /> Create Tool
                        </button>
                    </div>
                ) : (
                    filteredTools.map((tool) => {
                        const isPreviewing = previewingToolId === tool._id;

                        return (
                            <div 
                                key={tool._id}
                                className="bg-slate-900 border border-slate-800 hover:border-cyan-500/50 rounded-3xl p-6 shadow-xl space-y-4 transition-all group flex flex-col justify-between"
                            >
                                <div className="space-y-3">
                                    <div className="flex items-start justify-between gap-3">
                                        <div>
                                            <span className="text-[9px] font-mono font-bold uppercase text-cyan-400 bg-cyan-950 border border-cyan-800/80 px-2.5 py-0.5 rounded-lg inline-block mb-1.5">
                                                {tool.category || "Interactive Tool"}
                                            </span>
                                            <h3 className="font-extrabold text-lg text-slate-100 group-hover:text-cyan-300 transition-colors">
                                                {tool.name}
                                            </h3>
                                            <p className="text-xs text-slate-400 font-mono">
                                                Slug: <code className="text-cyan-400">{tool.slug}</code>
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <button
                                                onClick={() => setPreviewingToolId(isPreviewing ? null : tool._id)}
                                                className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                                                    isPreviewing 
                                                        ? 'bg-cyan-950 border-cyan-800 text-cyan-400' 
                                                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                                                }`}
                                                title={isPreviewing ? "Close Preview" : "Live Preview Tool"}
                                            >
                                                {isPreviewing ? <EyeOff size={15} /> : <Eye size={15} />}
                                            </button>
                                            <button
                                                onClick={() => handleOpenEdit(tool)}
                                                className="p-2 bg-slate-950 border border-slate-800 hover:border-indigo-500 text-slate-400 hover:text-indigo-300 rounded-xl transition-colors cursor-pointer"
                                                title="Edit Tool"
                                            >
                                                <Edit size={15} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(tool._id, tool.name)}
                                                className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-xl transition-colors cursor-pointer"
                                                title="Delete Tool"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>

                                    {tool.description && (
                                        <p className="text-xs text-slate-300 font-sans leading-relaxed line-clamp-2">
                                            {tool.description}
                                        </p>
                                    )}

                                    {/* Preview Box */}
                                    {isPreviewing && (
                                        <div className="p-4 bg-slate-950 border border-cyan-900/80 rounded-2xl space-y-2 animate-in fade-in duration-300">
                                            <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center justify-between border-b border-slate-800 pb-2">
                                                <span>Live Tool Preview Execution</span>
                                                <span className="text-slate-500">{(tool.htmlCode || '').length} bytes</span>
                                            </div>
                                            <HtmlToolRenderer htmlCode={tool.htmlCode} name={tool.name} />
                                        </div>
                                    )}

                                    {/* Embed Tag Copy Bar */}
                                    <div className="p-3 bg-slate-950 border border-slate-800/80 rounded-2xl flex items-center justify-between gap-2">
                                        <div className="flex items-center gap-2 min-w-0 font-mono text-xs">
                                            <Code size={14} className="text-cyan-400 shrink-0" />
                                            <span className="text-slate-400 text-[10px]">Shortcode:</span>
                                            <code className="text-cyan-300 truncate font-bold">
                                                [html-tool:{tool.slug}]
                                            </code>
                                        </div>

                                        <button
                                            onClick={() => handleCopyShortcode(tool.slug, tool._id)}
                                            className="px-3 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 hover:text-white rounded-xl text-[10px] font-mono font-bold transition-all flex items-center gap-1 cursor-pointer shrink-0"
                                        >
                                            {copiedId === tool._id ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
                                            <span>{copiedId === tool._id ? "Copied" : "Copy Tag"}</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>

            {/* Modal Dialog for Create & Edit */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="max-w-3xl bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl p-6 rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black text-white flex items-center gap-2 uppercase">
                            <Code className="text-cyan-400" size={22} />
                            {editingTool ? "Edit HTML CODE Tool" : "Create New HTML CODE Tool"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-6 mt-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Tool Name *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => {
                                        const name = e.target.value;
                                        setFormData(prev => ({
                                            ...prev,
                                            name,
                                            slug: !editingTool ? name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") : prev.slug
                                        }));
                                    }}
                                    placeholder="e.g. ROI Calculator Widget"
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Slug / Identifier *
                                </label>
                                <input
                                    required
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                    placeholder="e.g. roi-calculator-widget"
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-cyan-400 placeholder:text-slate-500 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Category
                                </label>
                                <input
                                    type="text"
                                    value={formData.category}
                                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                    placeholder="e.g. Calculators & Interactive"
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                                    Short Description
                                </label>
                                <input
                                    type="text"
                                    value={formData.description}
                                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                    placeholder="Calculates estimated monthly profit..."
                                    className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 outline-none"
                                />
                            </div>
                        </div>

                        {/* Editor / Preview Tabs */}
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                <label className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                                    <FileCode size={14} /> HTML & JS Code Snippet *
                                </label>

                                <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                                    <button
                                        type="button"
                                        onClick={() => setActiveFormTab('editor')}
                                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                            activeFormTab === 'editor' 
                                                ? 'bg-cyan-600 text-white shadow-md' 
                                                : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                    >
                                        HTML Code
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setActiveFormTab('preview')}
                                        className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                                            activeFormTab === 'preview' 
                                                ? 'bg-cyan-600 text-white shadow-md' 
                                                : 'text-slate-400 hover:text-slate-200'
                                        }`}
                                    >
                                        Live Preview
                                    </button>
                                </div>
                            </div>

                            {activeFormTab === 'editor' ? (
                                <div>
                                    <textarea
                                        required
                                        rows={12}
                                        value={formData.htmlCode}
                                        onChange={(e) => setFormData(prev => ({ ...prev, htmlCode: e.target.value }))}
                                        placeholder="<div className='tool-container'>...</div>&#10;<script>...</script>"
                                        className="w-full p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs font-mono text-slate-200 placeholder:text-slate-600 focus:border-cyan-500 outline-none leading-relaxed selection:bg-cyan-900 shadow-inner"
                                    />
                                    <p className="text-[10px] text-slate-500 font-mono mt-1">
                                        Supports full HTML, CSS inline styles, and embedded JavaScript execution logic.
                                    </p>
                                </div>
                            ) : (
                                <div className="p-6 bg-slate-950 border border-slate-800 rounded-2xl space-y-2 min-h-[300px]">
                                    <div className="text-[10px] font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">
                                        Interactive Preview Rendering
                                    </div>
                                    <HtmlToolRenderer htmlCode={formData.htmlCode} name={formData.name || "Tool Preview"} />
                                </div>
                            )}
                        </div>

                        {/* Form Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-800">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 py-3.5 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                            >
                                {isPending ? <Loader2 className="animate-spin" size={16} /> : <Check size={16} />}
                                <span>{editingTool ? "Save Changes" : "Create HTML Tool"}</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => setIsDialogOpen(false)}
                                className="px-6 py-3.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
