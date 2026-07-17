"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, FileText, Settings, ArrowLeft, PlusCircle, Layout } from "lucide-react";
import { IPageType, ICustomField } from "@/lib/db/models/PageType";
import { createPageType, deletePageType, updatePageType } from "@/lib/actions/custom-pages.actions";

interface Props {
    initialTypes: IPageType[];
}

export default function CustomPagesClient({ initialTypes }: Props) {
    const [pageTypes, setPageTypes] = useState<IPageType[]>(initialTypes);
    const [view, setView] = useState<"list" | "create" | "edit">("list");
    const [editingType, setEditingType] = useState<IPageType | null>(null);
    const [isPending, startTransition] = useTransition();

    // Form states
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [fields, setFields] = useState<ICustomField[]>([]);

    const [error, setError] = useState("");

    const handleAddTypeClick = () => {
        setName("");
        setSlug("");
        setFields([{ name: "description", label: "Description", type: "textarea" }]);
        setError("");
        setView("create");
    };

    const handleEditTypeClick = (type: IPageType) => {
        setEditingType(type);
        setName(type.name);
        setSlug(type.slug);
        setFields(type.fields || []);
        setError("");
        setView("edit");
    };

    const handleAddField = () => {
        setFields(prev => [...prev, { name: "", label: "", type: "text" }]);
    };

    const handleRemoveField = (index: number) => {
        setFields(prev => prev.filter((_, i) => i !== index));
    };

    const handleFieldChange = (index: number, key: keyof ICustomField, value: string) => {
        setFields(prev => prev.map((f, i) => {
            if (i === index) {
                let cleanedValue = value;
                if (key === "name") {
                    // Force lowercase, replace spaces/special chars with underscores
                    cleanedValue = value.toLowerCase().replace(/[^a-z0-9_]/g, "");
                }
                const updated = { ...f, [key]: cleanedValue };
                if (key === "type" && cleanedValue === "relationship" && !updated.refCollection) {
                    updated.refCollection = "GlossaryTerm";
                }
                return updated;
            }
            return f;
        }));
    };

    const handleDelete = async (slug: string) => {
        if (!confirm("Are you sure you want to delete this custom page type? All content entries associated with it will be deleted permanently. This action cannot be undone.")) {
            return;
        }

        startTransition(async () => {
            const res = await deletePageType(slug);
            if (res.success) {
                setPageTypes(prev => prev.filter(t => t.slug !== slug));
                alert("Page type deleted successfully.");
            } else {
                alert("Error: " + res.error);
            }
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (!name.trim() || !slug.trim()) {
            setError("Name and slug are required.");
            return;
        }

        // Validate fields
        for (const field of fields) {
            if (!field.name.trim() || !field.label.trim()) {
                setError("All fields must have a valid Name and Label.");
                return;
            }
        }

        startTransition(async () => {
            if (view === "create") {
                const res = await createPageType({ name, slug, fields });
                if (res.success) {
                    setPageTypes(prev => [...prev, res.pageType as IPageType]);
                    setView("list");
                } else {
                    setError(res.error || "An error occurred.");
                }
            } else if (view === "edit" && editingType) {
                const res = await updatePageType(editingType.slug, { name, fields });
                if (res.success) {
                    setPageTypes(prev => prev.map(t => t.slug === editingType.slug ? (res.pageType as IPageType) : t));
                    setView("list");
                } else {
                    setError(res.error || "An error occurred.");
                }
            }
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Custom Page Types</h1>
                    <p className="text-sm text-slate-500 font-medium">Create page types, define schemas, design layout templates, and generate bulk keyword pages.</p>
                </div>
                {view === "list" && (
                    <button
                        onClick={handleAddTypeClick}
                        className="bg-black text-white px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-md shadow-slate-900/10"
                    >
                        <Plus size={18} /> New Page Type
                    </button>
                )}
            </div>

            {error && (
                <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold text-sm">
                    {error}
                </div>
            )}

            {view === "list" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pageTypes.map((type) => (
                        <div key={type.slug} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between group">
                            <div>
                                <div className="flex justify-between items-start mb-4">
                                    <div className="p-3 bg-rose-50 text-rose-600 rounded-xl">
                                        <Layout size={24} />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditTypeClick(type)}
                                            className="p-2 text-slate-400 hover:text-blue-600 transition-colors"
                                            title="Edit Page Type Properties"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(type.slug)}
                                            className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                                            title="Delete Page Type"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <h3 className="text-xl font-black text-slate-900 mb-1">{type.name}</h3>
                                <p className="text-xs font-mono text-slate-400 bg-slate-50 p-1.5 rounded border border-slate-100 italic inline-block mb-3">
                                    /c/{type.slug}/[slug]
                                </p>
                                <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-6">
                                    Fields: {type.fields?.length || 0} defined
                                </div>
                            </div>
                            
                            <div className="space-y-2 mt-4 pt-4 border-t border-slate-100">
                                <Link
                                    href={`/admin/custom-pages/types/${type.slug}`}
                                    className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-sm"
                                >
                                    <FileText size={14} /> Manage Entries
                                </Link>
                                <Link
                                    href={`/admin/custom-pages/types/${type.slug}/edit-template`}
                                    className="w-full py-2.5 bg-white text-slate-700 border border-slate-200 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                                >
                                    <Settings size={14} /> Design Template
                                </Link>
                            </div>
                        </div>
                    ))}

                    {pageTypes.length === 0 && (
                        <div className="col-span-full bg-slate-50 border border-slate-200 rounded-2xl p-12 text-center">
                            <Layout className="mx-auto text-slate-300 mb-4" size={48} />
                            <h3 className="text-lg font-black text-slate-800 mb-1">No custom page types yet</h3>
                            <p className="text-sm text-slate-500 mb-6">Get started by creating a Directory, Affiliate Review, or custom Landing Page type.</p>
                            <button
                                onClick={handleAddTypeClick}
                                className="bg-black text-white px-6 py-2.5 rounded-xl font-bold hover:bg-slate-800 transition-all"
                            >
                                Create First Page Type
                            </button>
                        </div>
                    )}
                </div>
            )}

            {(view === "create" || view === "edit") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-4xl">
                    <button
                        onClick={() => setView("list")}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest transition-all"
                    >
                        <ArrowLeft size={16} /> Back to Page Types
                    </button>

                    <h2 className="text-2xl font-black text-slate-900 mb-6">
                        {view === "create" ? "Create Custom Page Type" : `Edit Custom Page Type: ${editingType?.name}`}
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Page Type Name</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Directory Product"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">URL Route Slug</label>
                                <input
                                    type="text"
                                    placeholder="e.g. directory"
                                    value={slug}
                                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50"
                                    disabled={view === "edit"}
                                    required
                                />
                                {view === "create" && (
                                    <p className="text-[10px] text-slate-400 mt-1">This will determine the path structure: /c/{slug || "slug"}/[entry-slug]</p>
                                )}
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-xs font-black text-slate-700 uppercase tracking-widest">Fields Definition Schema</h3>
                                <button
                                    type="button"
                                    onClick={handleAddField}
                                    className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                                >
                                    <PlusCircle size={14} /> Add Schema Field
                                </button>
                            </div>

                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={index} className="flex gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                                        <div className={`flex-1 grid grid-cols-1 ${field.type === "relationship" ? "md:grid-cols-4" : "md:grid-cols-3"} gap-4`}>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Field Key (Dynamic Placeholder)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. price"
                                                    value={field.name}
                                                    onChange={(e) => handleFieldChange(index, "name", e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:outline-none focus:ring-1 focus:ring-black bg-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Label (Editor Form)</label>
                                                <input
                                                    type="text"
                                                    placeholder="e.g. Product Price ($)"
                                                    value={field.label}
                                                    onChange={(e) => handleFieldChange(index, "label", e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Data Type</label>
                                                <select
                                                    value={field.type}
                                                    onChange={(e) => handleFieldChange(index, "type", e.target.value)}
                                                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                                                >
                                                    <option value="text">Text Input</option>
                                                    <option value="textarea">Rich Text/Text Area</option>
                                                    <option value="number">Number</option>
                                                    <option value="url">URL/Link</option>
                                                    <option value="image">Image URL</option>
                                                    <option value="relationship">Relationship Link</option>
                                                </select>
                                            </div>
                                            {field.type === "relationship" && (
                                                <div>
                                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-wider mb-1">Target Model</label>
                                                    <select
                                                        value={field.refCollection || "GlossaryTerm"}
                                                        onChange={(e) => handleFieldChange(index, "refCollection", e.target.value)}
                                                        className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-black bg-white"
                                                    >
                                                        <option value="GlossaryTerm">Glossary Term</option>
                                                        <option value="Offer">Affiliate Offer</option>
                                                        <option value="WebPage">Standard Page</option>
                                                        <option value="NicheBox">Niche Box</option>
                                                        <option value="CPAListing">CPA Listing</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveField(index)}
                                            className="text-slate-400 hover:text-red-500 mt-5 transition-colors"
                                            title="Delete Field"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}

                                {fields.length === 0 && (
                                    <p className="text-xs text-slate-400 italic text-center py-4">No custom fields defined. Add some fields to create custom content properties!</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-black px-8 py-3 rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs"
                            >
                                {isPending ? "Saving..." : "Save Page Type"}
                            </button>
                            <button
                                type="button"
                                onClick={() => setView("list")}
                                className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all uppercase tracking-widest text-xs"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
}
