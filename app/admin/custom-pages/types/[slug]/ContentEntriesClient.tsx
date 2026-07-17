"use client";

import { useState, useTransition, useMemo, useEffect } from "react";
import Link from "next/link";
import { Plus, Trash2, Edit, ArrowLeft, Search, Download, Copy, ExternalLink, ChevronLeft, ChevronRight, CheckSquare, Square, Trash, Sparkles, AlertCircle, FileText, CheckCircle } from "lucide-react";
import { IPageType, ICustomField } from "@/lib/db/models/PageType";
import { IContentEntry } from "@/lib/db/models/ContentEntry";
import { createContentEntry, updateContentEntry, deleteContentEntry, deleteContentEntries, bulkImportEntries, getRelationshipOptions } from "@/lib/actions/custom-pages.actions";

interface Props {
    pageType: IPageType;
    initialEntries: IContentEntry[];
}

export default function ContentEntriesClient({ pageType, initialEntries }: Props) {
    const [entries, setEntries] = useState<IContentEntry[]>(initialEntries);
    const [view, setView] = useState<"list" | "create" | "edit" | "import">("list");
    const [editingEntry, setEditingEntry] = useState<IContentEntry | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isPending, startTransition] = useTransition();

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Bulk selection
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // Single Entry Form States
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [metaDescription, setMetaDescription] = useState("");
    const [isPublished, setIsPublished] = useState(true);
    const [formData, setFormData] = useState<Record<string, any>>({});
    const [formError, setFormError] = useState("");

    // Importer state
    const [importData, setImportData] = useState("");
    const [importMessage, setImportMessage] = useState("");
    const [importStatus, setImportStatus] = useState<"idle" | "success" | "error">("idle");

    // Relationship Options State
    const [relationshipOptions, setRelationshipOptions] = useState<Record<string, { id: string; name: string }[]>>({});

    useEffect(() => {
        const fetchOptions = async () => {
            const relFields = pageType.fields.filter(f => f.type === "relationship");
            if (relFields.length === 0) return;

            const newOptions: Record<string, { id: string; name: string }[]> = {};
            for (const field of relFields) {
                if (field.refCollection) {
                    const res = await getRelationshipOptions(field.refCollection);
                    if (res.success) {
                        newOptions[field.name] = res.options;
                    }
                }
            }
            setRelationshipOptions(newOptions);
        };
        if (view === "create" || view === "edit") {
            fetchOptions();
        }
    }, [pageType.fields, view]);

    // Import mapping states
    const [importStep, setImportStep] = useState<"paste" | "map" | "importing">("paste");
    const [parsedRecords, setParsedRecords] = useState<any[]>([]);
    const [columns, setColumns] = useState<string[]>([]);
    const [mapping, setMapping] = useState<Record<string, string>>({});

    // Search and filter
    const filteredEntries = useMemo(() => {
        return entries.filter(e =>
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            e.slug.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [entries, searchTerm]);

    const totalPages = Math.ceil(filteredEntries.length / itemsPerPage);
    const paginatedEntries = filteredEntries.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    // Form handlers
    const handleCreateClick = () => {
        setTitle("");
        setSlug("");
        setMetaTitle("");
        setMetaDescription("");
        setIsPublished(true);
        
        // Initialize default empty values for custom fields
        const initialFormValues: Record<string, any> = {};
        pageType.fields.forEach((field: ICustomField) => {
            initialFormValues[field.name] = "";
        });
        setFormData(initialFormValues);
        setFormError("");
        setView("create");
    };

    const handleEditClick = (entry: IContentEntry) => {
        setEditingEntry(entry);
        setTitle(entry.title);
        setSlug(entry.slug);
        setMetaTitle(entry.metaTitle || "");
        setMetaDescription(entry.metaDescription || "");
        setIsPublished(entry.isPublished);

        // Prepopulate dynamic field values
        const formValues: Record<string, any> = {};
        pageType.fields.forEach((field: ICustomField) => {
            formValues[field.name] = entry.data?.[field.name] || "";
        });
        setFormData(formValues);
        setFormError("");
        setView("edit");
    };

    const handleFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");

        if (!title.trim() || !slug.trim()) {
            setFormError("Title and Slug are required.");
            return;
        }

        startTransition(async () => {
            if (view === "create") {
                const res = await createContentEntry({
                    pageTypeSlug: pageType.slug,
                    title,
                    slug,
                    data: formData,
                    metaTitle,
                    metaDescription,
                    isPublished
                });

                if (res.success) {
                    setEntries(prev => [res.entry as IContentEntry, ...prev]);
                    setView("list");
                } else {
                    setFormError(res.error || "An error occurred.");
                }
            } else if (view === "edit" && editingEntry) {
                const res = await updateContentEntry(String(editingEntry._id), {
                    title,
                    slug,
                    data: formData,
                    metaTitle,
                    metaDescription,
                    isPublished
                });

                if (res.success) {
                    setEntries(prev => prev.map(e => String(e._id) === String(editingEntry._id) ? (res.entry as IContentEntry) : e));
                    setView("list");
                } else {
                    setFormError(res.error || "An error occurred.");
                }
            }
        });
    };

    const handleSingleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this entry?")) return;

        startTransition(async () => {
            const res = await deleteContentEntry(id);
            if (res.success) {
                setEntries(prev => prev.filter(e => String(e._id) !== id));
                setSelectedIds(prev => {
                    const next = new Set(prev);
                    next.delete(id);
                    return next;
                });
            } else {
                alert("Error deleting: " + res.error);
            }
        });
    };

    const handleBulkDelete = async () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Are you sure you want to delete the ${selectedIds.size} selected entries?`)) return;

        startTransition(async () => {
            const res = await deleteContentEntries(Array.from(selectedIds));
            if (res.success) {
                setEntries(prev => prev.filter(e => !selectedIds.has(String(e._id))));
                setSelectedIds(new Set());
                alert("Selected entries deleted successfully.");
            } else {
                alert("Error: " + res.error);
            }
        });
    };

    // Bulk Importer
    const parseCSV = (text: string) => {
        const lines = text.split("\n").map(l => l.trim()).filter(Boolean);
        if (lines.length === 0) return [];
        
        // simple CSV parsing handling commas and quotes
        const headers = lines[0].split(",").map(h => h.replace(/^["']|["']$/g, "").trim());
        const records: any[] = [];
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(",").map(v => v.replace(/^["']|["']$/g, "").trim());
            const rec: Record<string, string> = {};
            headers.forEach((h, idx) => {
                if (h) {
                    rec[h] = values[idx] || "";
                }
            });
            records.push(rec);
        }
        return records;
    };

    const handleAnalyzePaste = () => {
        setImportMessage("");
        setImportStatus("idle");
        const trimmed = importData.trim();
        if (!trimmed) {
            setImportMessage("Please paste some data first.");
            setImportStatus("error");
            return;
        }

        let records: any[] = [];
        let cols: string[] = [];

        try {
            // Check if JSON
            if (trimmed.startsWith("[") || trimmed.startsWith("{")) {
                const parsed = JSON.parse(trimmed);
                records = Array.isArray(parsed) ? parsed : [parsed];
            } else {
                // Parse CSV
                records = parseCSV(trimmed);
            }
        } catch (e: any) {
            setImportMessage("Failed to parse paste. If pasting JSON, check syntax. Otherwise paste comma-separated CSV values. " + e.message);
            setImportStatus("error");
            return;
        }

        if (records.length === 0) {
            setImportMessage("No records found in paste.");
            setImportStatus("error");
            return;
        }

        // Get union of all keys/columns in records
        const keySet = new Set<string>();
        records.forEach(r => {
            if (r && typeof r === "object") {
                Object.keys(r).forEach(k => keySet.add(k));
            }
        });
        cols = Array.from(keySet);

        setParsedRecords(records);
        setColumns(cols);

        // Prepopulate mapping automatically where keys match
        const initialMapping: Record<string, string> = {};
        const allSystemFields = ["title", "slug", "metaTitle", "metaDescription", ...pageType.fields.map(f => f.name)];
        
        allSystemFields.forEach(field => {
            // Case-insensitive match or contains match
            const match = cols.find(c => c.toLowerCase() === field.toLowerCase());
            if (match) {
                initialMapping[field] = match;
            } else {
                initialMapping[field] = "";
            }
        });

        setMapping(initialMapping);
        setImportStep("map");
    };

    const handleRunImport = async () => {
        setImportMessage("");
        setImportStatus("idle");

        // Validate that title mapping is configured
        if (!mapping["title"]) {
            setImportMessage("Please map a column to the required field: Title.");
            setImportStatus("error");
            return;
        }

        setImportStep("importing");

        // Construct target records based on mapping
        const finalEntries = parsedRecords.map(rec => {
            const mappedEntry: any = {};
            
            // Standard fields
            mappedEntry.title = rec[mapping["title"]] || "";
            if (mapping["slug"] && rec[mapping["slug"]]) mappedEntry.slug = rec[mapping["slug"]];
            if (mapping["metaTitle"] && rec[mapping["metaTitle"]]) mappedEntry.metaTitle = rec[mapping["metaTitle"]];
            if (mapping["metaDescription"] && rec[mapping["metaDescription"]]) mappedEntry.metaDescription = rec[mapping["metaDescription"]];

            // Custom fields map to data object
            const customData: Record<string, any> = {};
            pageType.fields.forEach(f => {
                const sourceCol = mapping[f.name];
                if (sourceCol && rec[sourceCol] !== undefined) {
                    customData[f.name] = rec[sourceCol];
                }
            });
            mappedEntry.data = customData;

            return mappedEntry;
        });

        startTransition(async () => {
            const res = await bulkImportEntries(pageType.slug, finalEntries);
            if (res.success) {
                setImportStatus("success");
                setImportMessage(`Successfully imported ${res.count} entries! Skipped ${res.skipped} duplicates.`);
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            } else {
                setImportStatus("error");
                setImportMessage(res.error || "Import failed.");
                setImportStep("map");
            }
        });
    };

    const toggleSelect = (id: string) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    const allPageSelected = paginatedEntries.length > 0 && paginatedEntries.every(e => selectedIds.has(String(e._id)));

    const toggleSelectAll = () => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (allPageSelected) {
                paginatedEntries.forEach(e => next.delete(String(e._id)));
            } else {
                paginatedEntries.forEach(e => next.add(String(e._id)));
            }
            return next;
        });
    };

    const copyPlaceholderExample = () => {
        const example: Record<string, any> = {
            title: "Example Title",
            slug: "example-slug",
            metaTitle: "SEO Optimized Meta Title",
            metaDescription: "SEO Meta Description details"
        };
        pageType.fields.forEach((field: ICustomField) => {
            example[field.name] = field.type === "number" ? 99 : `Example ${field.label} content`;
        });
        setImportData(JSON.stringify([example], null, 2));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3">
                <Link
                    href="/admin/custom-pages"
                    className="p-2.5 bg-slate-100 border border-slate-200 text-slate-700 hover:bg-slate-200 rounded-xl transition-all"
                >
                    <ArrowLeft size={18} />
                </Link>
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">{pageType.name} Entries</h1>
                    <p className="text-sm text-slate-500 font-medium">Manage individual pages and content fields generated under route slug: /c/{pageType.slug}/[slug]</p>
                </div>
            </div>

            {view === "list" && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search entries by title or slug..."
                                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50 text-sm"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>

                        <div className="flex gap-2">
                            <button
                                onClick={handleCreateClick}
                                className="bg-black text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all text-sm"
                            >
                                <Plus size={16} /> New Entry
                            </button>
                            <button
                                onClick={() => setView("import")}
                                className="bg-slate-100 text-slate-700 border border-slate-200 px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-200 transition-all text-sm"
                            >
                                <Download size={16} /> Bulk Import
                            </button>
                            {selectedIds.size > 0 && (
                                <button
                                    onClick={handleBulkDelete}
                                    className="bg-red-600 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all text-sm"
                                >
                                    <Trash size={16} /> Delete Selected ({selectedIds.size})
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-slate-200">
                                <thead className="bg-slate-50">
                                    <tr>
                                        <th className="pl-4 pr-2 py-4 w-10">
                                            <button onClick={toggleSelectAll} className="text-slate-400 hover:text-black transition-colors">
                                                {allPageSelected ? <CheckSquare size={18} className="text-black" /> : <Square size={18} />}
                                            </button>
                                        </th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Entry Details</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Slug Route</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Status</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Views</th>
                                        <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Last Updated</th>
                                        <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-slate-100">
                                    {paginatedEntries.map(entry => (
                                        <tr key={String(entry._id)} className={selectedIds.has(String(entry._id)) ? "bg-red-50" : "hover:bg-slate-50"}>
                                            <td className="pl-4 pr-2 py-4">
                                                <button onClick={() => toggleSelect(String(entry._id))} className="text-slate-400 hover:text-black transition-colors">
                                                    {selectedIds.has(String(entry._id)) ? <CheckSquare size={16} className="text-red-600" /> : <Square size={16} />}
                                                </button>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-900">{entry.title}</div>
                                                <div className="text-xs text-slate-400 truncate max-w-xs">{entry.metaDescription || "No description set"}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-mono bg-slate-50 p-1.5 rounded border border-slate-100 italic">
                                                        /c/{pageType.slug}/{entry.slug}
                                                    </span>
                                                    <Link href={`/c/${pageType.slug}/${entry.slug}`} target="_blank" className="text-slate-300 hover:text-emerald-600 transition-colors">
                                                        <ExternalLink size={14} />
                                                    </Link>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {entry.isPublished ? (
                                                    <span className="bg-green-50 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-200">Published</span>
                                                ) : (
                                                    <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full text-xs font-bold border border-slate-200">Draft</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-sm font-bold text-slate-700">
                                                {entry.views || 0}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-500">
                                                {new Date(entry.updatedAt).toLocaleDateString()}
                                            </td>
                                            <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                                <button
                                                    onClick={() => handleEditClick(entry)}
                                                    className="text-slate-400 hover:text-blue-600 mr-4 transition-colors"
                                                    title="Edit Content Data"
                                                >
                                                    <Edit size={18} />
                                                </button>
                                                <button
                                                    onClick={() => handleSingleDelete(String(entry._id))}
                                                    className="text-slate-400 hover:text-red-600 transition-colors"
                                                    title="Delete Entry"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}

                                    {paginatedEntries.length === 0 && (
                                        <tr>
                                            <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-bold uppercase text-xs tracking-widest">No entries found. Click New Entry to create one.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
                                <p className="text-xs text-slate-500">
                                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredEntries.length)}</strong> of <strong>{filteredEntries.length}</strong> entries
                                </p>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                        disabled={currentPage === 1}
                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                    <span className="text-xs font-bold text-slate-600">Page {currentPage} of {totalPages}</span>
                                    <button
                                        onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                        disabled={currentPage === totalPages}
                                        className="p-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed bg-white"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {(view === "create" || view === "edit") && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-4xl">
                    <button
                        onClick={() => setView("list")}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest transition-all"
                    >
                        <ArrowLeft size={16} /> Back to Entries List
                    </button>

                    <h2 className="text-2xl font-black text-slate-900 mb-6">
                        {view === "create" ? `Create ${pageType.name} Entry` : `Edit ${pageType.name} Entry: ${editingEntry?.title}`}
                    </h2>

                    {formError && (
                        <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl font-bold text-sm">
                            {formError}
                        </div>
                    )}

                    <form onSubmit={handleFormSubmit} className="space-y-6">
                        <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
                            <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">Core Settings & SEO</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Entry Title</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Best Ergonomic Dog Bed"
                                        value={title}
                                        onChange={(e) => {
                                            setTitle(e.target.value);
                                            if (view === "create") {
                                                setSlug(e.target.value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
                                            }
                                        }}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">SEO Slug</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. best-ergonomic-dog-bed"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white font-mono text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Meta Title</label>
                                    <input
                                        type="text"
                                        placeholder="SEO optimized title..."
                                        value={metaTitle}
                                        onChange={(e) => setMetaTitle(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-2">Meta Description</label>
                                    <input
                                        type="text"
                                        placeholder="SEO meta snippet..."
                                        value={metaDescription}
                                        onChange={(e) => setMetaDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white"
                                    />
                                </div>
                                <div className="md:col-span-2 flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        id="isPublished"
                                        checked={isPublished}
                                        onChange={(e) => setIsPublished(e.target.checked)}
                                        className="w-4.5 h-4.5 border border-slate-300 rounded text-slate-900 focus:ring-black cursor-pointer"
                                    />
                                    <label htmlFor="isPublished" className="text-xs font-black text-slate-700 uppercase tracking-widest cursor-pointer select-none">Publish immediately (visible on site)</label>
                                </div>
                            </div>
                        </div>

                        {/* Custom Fields Section */}
                        {pageType.fields.length > 0 && (
                            <div className="bg-slate-50/50 p-6 rounded-2xl border border-slate-100 space-y-6">
                                <h3 className="text-sm font-black text-slate-700 uppercase tracking-widest border-b border-slate-100 pb-2">Custom Schema Fields</h3>
                                <div className="grid grid-cols-1 gap-6">
                                    {pageType.fields.map((field: ICustomField) => (
                                        <div key={field.name} className="w-full">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-xs font-black text-slate-700 uppercase tracking-widest">
                                                    {field.label}
                                                </label>
                                                <span className="text-[9px] font-mono font-bold text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded uppercase border border-indigo-100">
                                                    Placeholder: {"{{"}{field.name}{"}}"}
                                                </span>
                                            </div>

                                            {field.type === "textarea" ? (
                                                <textarea
                                                    placeholder={`Enter ${field.label} details...`}
                                                    value={formData[field.name] || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    rows={4}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white text-sm"
                                                />
                                            ) : field.type === "relationship" ? (
                                                <select
                                                    value={formData[field.name] || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white text-sm"
                                                >
                                                    <option value="">-- Select {field.label} --</option>
                                                    {(relationshipOptions[field.name] || []).map(opt => (
                                                        <option key={opt.id} value={opt.id}>
                                                            {opt.name}
                                                        </option>
                                                    ))}
                                                </select>
                                            ) : (
                                                <input
                                                    type="text"
                                                    placeholder={`Enter ${field.label}...`}
                                                    value={formData[field.name] || ""}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                                                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black bg-white text-sm"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex gap-4 pt-4 border-t border-slate-100">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-black px-8 py-3 rounded-xl shadow-xl transition-all uppercase tracking-widest text-xs"
                            >
                                {isPending ? "Saving..." : "Save Entry"}
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

            {view === "import" && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm max-w-4xl space-y-6">
                    <button
                        onClick={() => { setView("list"); setImportStep("paste"); }}
                        className="flex items-center gap-2 text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest transition-all"
                    >
                        <ArrowLeft size={16} /> Back to Entries List
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-slate-900 text-white rounded-xl">
                            <FileText size={20} />
                        </div>
                        <div>
                            <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Bulk Import {pageType.name} Entries</h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Visual CSV & JSON Column Mapper</p>
                        </div>
                    </div>

                    {importStep === "paste" && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div>
                                    <div className="flex justify-between items-center mb-2">
                                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
                                            Paste CSV or JSON Data Array
                                        </label>
                                        <button
                                            onClick={copyPlaceholderExample}
                                            className="text-xs text-indigo-600 hover:text-indigo-800 font-bold flex items-center gap-1"
                                        >
                                            <Sparkles size={12} /> Load Sample Template
                                        </button>
                                    </div>
                                    <textarea
                                        value={importData}
                                        onChange={(e) => setImportData(e.target.value)}
                                        placeholder='JSON:&#10;[&#10;  { "title": "Ergonomic Bed", "brand": "Orthopedic Pup" }&#10;]&#10;&#10;CSV:&#10;title,brand,price&#10;Ergonomic Bed,Orthopedic Pup,69.99'
                                        className="w-full h-80 p-4 rounded-xl border border-slate-200 font-mono text-xs focus:ring-2 focus:ring-black outline-none bg-slate-50 transition-all"
                                    />
                                </div>

                                <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 space-y-4">
                                    <h3 className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                        <AlertCircle size={14} /> Importer Notes
                                    </h3>
                                    <div className="text-xs text-slate-600 space-y-3 font-medium">
                                        <p>1. Paste raw comma-separated CSV values (with headers in the first row) or a valid JSON array.</p>
                                        <p>2. In the next step, you can visually map any column in your dataset to the fields of this page type.</p>
                                        <p>3. Slugs will be auto-generated from the Title if not mapped.</p>
                                        <p>4. Existing slugs will be automatically skipped to prevent conflicts.</p>
                                    </div>

                                    <div className="border-t border-slate-200 pt-4 space-y-2">
                                        <span className="block text-[10px] font-black text-slate-400 uppercase tracking-wider">Target Page Fields:</span>
                                        <div className="flex flex-wrap gap-2">
                                            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded">title</span>
                                            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded">slug</span>
                                            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded">metaTitle</span>
                                            <span className="text-[10px] font-mono font-bold bg-white border border-slate-200 px-2 py-0.5 rounded">metaDescription</span>
                                            {pageType.fields.map((f: ICustomField) => (
                                                <span key={f.name} className="text-[10px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-600 px-2 py-0.5 rounded">{f.name}</span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4 border-t border-slate-100 pt-6">
                                <button
                                    onClick={handleAnalyzePaste}
                                    disabled={isPending || !importData}
                                    className="flex-1 bg-black hover:bg-slate-800 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-xl transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                                >
                                    Analyze Paste & Configure Map
                                </button>
                                <button
                                    onClick={() => { setImportData(""); setImportMessage(""); setImportStatus("idle"); }}
                                    className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all uppercase tracking-widest text-xs"
                                >
                                    Clear
                                </button>
                            </div>
                        </div>
                    )}

                    {importStep === "map" && (
                        <div className="space-y-6">
                            <div className="p-4 bg-indigo-50/50 border border-indigo-100 rounded-xl text-xs text-indigo-700 font-medium">
                                💡 <strong>Pasted Data Analyzed:</strong> Found <strong>{parsedRecords.length}</strong> records and <strong>{columns.length}</strong> source columns. Map them to your database fields below.
                            </div>

                            <div className="border border-slate-200 rounded-2xl overflow-hidden bg-white">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Database Field</th>
                                            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Description</th>
                                            <th className="px-6 py-3 text-xs font-black text-slate-500 uppercase tracking-widest">Map to Pasted Column</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100 text-sm">
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-900">Title <span className="text-red-500">*</span></td>
                                            <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-wider">Required base field</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={mapping["title"] || ""}
                                                    onChange={(e) => setMapping(prev => ({ ...prev, title: e.target.value }))}
                                                    className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-black outline-none bg-white"
                                                >
                                                    <option value="">-- Choose Column --</option>
                                                    {columns.map(col => (
                                                        <option key={col} value={col}>{col}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-900">Slug</td>
                                            <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-wider">Auto-generated if empty</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={mapping["slug"] || ""}
                                                    onChange={(e) => setMapping(prev => ({ ...prev, slug: e.target.value }))}
                                                    className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-black outline-none bg-white"
                                                >
                                                    <option value="">-- Auto-generate from Title --</option>
                                                    {columns.map(col => (
                                                        <option key={col} value={col}>{col}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-900">Meta Title</td>
                                            <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-wider">SEO Title attribute</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={mapping["metaTitle"] || ""}
                                                    onChange={(e) => setMapping(prev => ({ ...prev, metaTitle: e.target.value }))}
                                                    className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-black outline-none bg-white"
                                                >
                                                    <option value="">-- Same as Title --</option>
                                                    {columns.map(col => (
                                                        <option key={col} value={col}>{col}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td className="px-6 py-4 font-bold text-slate-900">Meta Description</td>
                                            <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-wider">SEO Description snippet</td>
                                            <td className="px-6 py-4">
                                                <select
                                                    value={mapping["metaDescription"] || ""}
                                                    onChange={(e) => setMapping(prev => ({ ...prev, metaDescription: e.target.value }))}
                                                    className="w-full max-w-xs px-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-1 focus:ring-black outline-none bg-white"
                                                >
                                                    <option value="">-- Empty / Default snippet --</option>
                                                    {columns.map(col => (
                                                        <option key={col} value={col}>{col}</option>
                                                    ))}
                                                </select>
                                            </td>
                                        </tr>
                                        {pageType.fields.map((f: ICustomField) => (
                                            <tr key={f.name}>
                                                <td className="px-6 py-4 font-bold text-indigo-600 flex items-center gap-1.5">
                                                    {f.label}
                                                    <span className="text-[9px] font-mono font-bold bg-indigo-50 border border-indigo-100 text-indigo-500 px-1.5 py-0.5 rounded uppercase">{f.type}</span>
                                                </td>
                                                <td className="px-6 py-4 text-xs text-slate-400 font-bold uppercase tracking-wider">Custom field ({f.name})</td>
                                                <td className="px-6 py-4">
                                                    <select
                                                        value={mapping[f.name] || ""}
                                                        onChange={(e) => setMapping(prev => ({ ...prev, [f.name]: e.target.value }))}
                                                        className="w-full max-w-xs px-3 py-2 border border-indigo-200 rounded-lg text-xs focus:ring-1 focus:ring-black outline-none bg-white text-indigo-900 font-bold"
                                                    >
                                                        <option value="">-- Do Not Import / Leave Blank --</option>
                                                        {columns.map(col => (
                                                            <option key={col} value={col}>{col}</option>
                                                        ))}
                                                    </select>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="flex gap-4 border-t border-slate-100 pt-6">
                                <button
                                    onClick={handleRunImport}
                                    disabled={isPending}
                                    className="flex-1 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-black py-4 rounded-xl shadow-xl shadow-indigo-600/15 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs animate-pulse"
                                >
                                    🚀 Run Bulk Import
                                </button>
                                <button
                                    onClick={() => setImportStep("paste")}
                                    className="px-6 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl border border-slate-200 transition-all uppercase tracking-widest text-xs"
                                >
                                    Back to Paste
                                </button>
                            </div>
                        </div>
                    )}

                    {importStep === "importing" && (
                        <div className="flex flex-col items-center justify-center py-12 space-y-4">
                            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                            <h3 className="text-base font-black text-slate-800">Processing Import...</h3>
                            <p className="text-xs text-slate-500">Creating custom database content entries for matched records.</p>
                        </div>
                    )}

                    {importStatus !== "idle" && (
                        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${importStatus === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
                            {importStatus === "success" ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            <p className="text-sm">{importMessage}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
