"use client";
import { useState, useTransition } from 'react';
import { IFAQ } from '@/lib/db/models/FAQ';
import { Plus, Edit, Trash2, Search, ArrowLeft, Download, RefreshCw, Eye, FileUp, EyeOff, AlertTriangle, CheckCircle2, Pencil, Send } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';
import { createFAQ, updateFAQ, deleteFAQ, importFAQs, importCSVFAQs, bulkUnpublishEmptyFAQs, publishFAQWithAnswer } from '@/lib/actions/faq.actions';
import { useRouter, useSearchParams } from 'next/navigation';

interface FAQManagerProps {
    faqs: IFAQ[];
    draftFaqs: IFAQ[];
    offers?: any[];
    initialPage?: number;
    totalPages?: number;
    totalCount?: number;
    initialSearch?: string;
    draftPage?: number;
    draftTotalPages?: number;
    draftTotal?: number;
    draftSearch?: string;
    emptyCount?: number;
}

export default function FAQManager({ 
    faqs = [], 
    draftFaqs = [],
    offers = [], 
    initialPage = 1, 
    totalPages = 1, 
    totalCount = 0,
    initialSearch = "",
    draftPage = 1,
    draftTotalPages = 1,
    draftTotal = 0,
    draftSearch = "",
    emptyCount = 0,
}: FAQManagerProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [activeTab, setActiveTab] = useState<'published' | 'drafts'>('published');
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'import' | 'import-csv'>('list');
    const [editingFAQ, setEditingFAQ] = useState<IFAQ | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState(initialSearch);
    const [draftSearchTerm, setDraftSearchTerm] = useState(draftSearch);
    const [importText, setImportText] = useState('');
    const [isPending, startTransition] = useTransition();

    const updateSearch = (term: string) => {
        setSearchTerm(term);
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (term) params.set('search', term); else params.delete('search');
        params.set('page', '1');
        router.push(`?${params.toString()}`);
    };

    const updateDraftSearch = (term: string) => {
        setDraftSearchTerm(term);
        const params = new URLSearchParams(searchParams?.toString() || "");
        if (term) params.set('draftSearch', term); else params.delete('draftSearch');
        params.set('draftPage', '1');
        router.push(`?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set('page', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleDraftPageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams?.toString() || "");
        params.set('draftPage', newPage.toString());
        router.push(`?${params.toString()}`);
    };

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        startTransition(async () => {
            const res = await deleteFAQ(id);
            if (res.success) { alert('Deleted successfully'); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleBulkUnpublish = () => {
        if (!confirm(`This will unpublish ${emptyCount} questions with no text answer. Continue?`)) return;
        startTransition(async () => {
            const res = await bulkUnpublishEmptyFAQs();
            if (res.success) { alert(`✅ Unpublished ${res.count} empty questions. They are now in the "Needs Answers" tab.`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleImport = async () => {
        if (!importText) return;
        try {
            const faqs = JSON.parse(importText);
            startTransition(async () => {
                const res = await importFAQs(faqs);
                if (res.success) { alert(`Imported ${res.count} FAQs`); window.location.reload(); }
                else alert('Error: ' + res.error);
            });
        } catch { alert('Invalid JSON format'); }
    };

    if (view !== 'list') {
        return (
            <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                {view === 'create' || view === 'edit' ? (
                    <FAQForm initialData={editingFAQ} onCancel={() => setView('list')} offers={offers} />
                ) : view === 'import' ? (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></button>
                            <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Import JSON</h2>
                        </div>
                        <textarea className="w-full h-96 p-6 font-mono text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-black outline-none bg-slate-50" placeholder='[{"question": "...", "answerSnippet": "..."}]' value={importText} onChange={(e) => setImportText(e.target.value)} />
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleImport} disabled={isPending || !importText} className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all shadow-xl">
                                {isPending ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />} Import FAQ Data
                            </button>
                        </div>
                    </div>
                ) : view === 'import-csv' ? (
                    <CSVImportView onCancel={() => setView('list')} isPending={isPending} startTransition={startTransition} />
                ) : null}
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Questions / FAQs</h2>
                    <p className="text-xs text-slate-400 mt-1">{totalCount} published · <span className="text-amber-600 font-bold">{draftTotal} need answers</span></p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    {emptyCount > 0 && (
                        <button onClick={handleBulkUnpublish} disabled={isPending} className="bg-amber-50 text-amber-700 px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-amber-200 hover:bg-amber-100 transition-all text-sm disabled:opacity-50">
                            <EyeOff size={15} />
                            Unpublish Empty
                            <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{emptyCount}</span>
                        </button>
                    )}
                    <button onClick={() => { setEditingFAQ(undefined); setView('create'); }} className="bg-black text-white px-5 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all text-sm">
                        <Plus size={15} /> Add New
                    </button>
                    <button onClick={() => setView('import-csv')} className="bg-emerald-50 text-emerald-700 px-5 py-2 rounded-lg font-bold flex items-center gap-2 border border-emerald-100 hover:bg-emerald-100 transition-all text-sm">
                        <FileUp size={15} /> Import CSV
                    </button>
                    <button onClick={() => setView('import')} className="bg-slate-100 text-slate-700 px-5 py-2 rounded-lg font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-all text-sm">
                        <Download size={15} /> Import JSON
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-100">
                <button
                    onClick={() => setActiveTab('published')}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all ${activeTab === 'published' ? 'border-black text-black' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    ✅ Published <span className="ml-1 bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{totalCount}</span>
                </button>
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`px-8 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all flex items-center gap-2 ${activeTab === 'drafts' ? 'border-amber-500 text-amber-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
                >
                    <AlertTriangle size={13} /> Needs Answers
                    {draftTotal > 0 && <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{draftTotal}</span>}
                </button>
            </div>

            {/* Published Tab */}
            {activeTab === 'published' && (
                <div className="p-6">
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search published questions..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50" value={searchTerm} onChange={(e) => updateSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Question ({totalCount})</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Parent</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {faqs.map(faq => (
                                    <tr key={(faq._id as unknown) as string} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900 line-clamp-1">{faq.question}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{faq.answerSnippet}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{faq.parentQuestion || '-'}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-400">/{faq.slug}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <Link href={`/questions/${faq.slug}`} target="_blank" className="text-slate-400 hover:text-black mr-4 transition-colors inline-block"><Eye size={18} /></Link>
                                            <button onClick={() => { setEditingFAQ(faq); setView('edit'); }} className="text-slate-400 hover:text-blue-600 mr-4 transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete((faq._id as unknown) as string)} className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {faqs.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">No published FAQs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Page <span className="text-black">{initialPage}</span> of {totalPages}</div>
                            <div className="flex gap-2">
                                <button onClick={() => handlePageChange(initialPage - 1)} disabled={initialPage === 1} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all">Prev</button>
                                <button onClick={() => handlePageChange(initialPage + 1)} disabled={initialPage >= totalPages} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Drafts / Needs Answers Tab */}
            {activeTab === 'drafts' && (
                <div className="p-6">
                    <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                        <AlertTriangle className="text-amber-600 mt-0.5 shrink-0" size={18} />
                        <div>
                            <p className="text-sm font-bold text-amber-800">These questions have no answer text and are hidden from the public.</p>
                            <p className="text-xs text-amber-600 mt-1">Add an answer to each question and click "Publish" to make it live.</p>
                        </div>
                    </div>
                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search questions needing answers..." className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 transition-all bg-slate-50" value={draftSearchTerm} onChange={(e) => updateDraftSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {draftFaqs.map(faq => (
                            <DraftFAQCard key={(faq._id as unknown) as string} faq={faq} />
                        ))}
                        {draftFaqs.length === 0 && (
                            <div className="text-center py-16">
                                <CheckCircle2 className="text-emerald-500 mx-auto mb-3" size={48} />
                                <p className="font-black text-slate-800 text-lg">All questions have answers!</p>
                                <p className="text-slate-500 text-sm mt-1">There are no unpublished questions needing attention.</p>
                            </div>
                        )}
                    </div>

                    {draftTotalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Page <span className="text-black">{draftPage}</span> of {draftTotalPages}</div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDraftPageChange(draftPage - 1)} disabled={draftPage === 1} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all">Prev</button>
                                <button onClick={() => handleDraftPageChange(draftPage + 1)} disabled={draftPage >= draftTotalPages} className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// Draft FAQ Card — inline answer + publish
// ────────────────────────────────────────────────────────────
function DraftFAQCard({ faq }: { faq: IFAQ }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [answer, setAnswer] = useState('');
    const [isPending, startTransition] = useTransition();
    const [saved, setSaved] = useState(false);

    const handlePublish = () => {
        if (!answer.trim()) { alert('Please write an answer before publishing.'); return; }
        startTransition(async () => {
            const res = await publishFAQWithAnswer((faq._id as unknown) as string, answer.trim());
            if (res.success) {
                setSaved(true);
                setTimeout(() => window.location.reload(), 800);
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    if (saved) {
        return (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-3 animate-pulse">
                <CheckCircle2 className="text-emerald-500" size={20} />
                <span className="font-bold text-emerald-700 text-sm">Published! Refreshing…</span>
            </div>
        );
    }

    return (
        <div className={`border rounded-xl transition-all overflow-hidden ${isExpanded ? 'border-amber-300 shadow-md shadow-amber-100' : 'border-slate-200 hover:border-amber-300'}`}>
            {/* Question Row */}
            <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-800 line-clamp-2">{faq.question}</p>
                    {faq.parentQuestion && <p className="text-xs text-slate-400 mt-1">{faq.parentQuestion}</p>}
                </div>
                <button className={`shrink-0 text-xs font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${isExpanded ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-500 hover:bg-amber-50 hover:text-amber-600'}`}>
                    {isExpanded ? 'Cancel' : 'Add Answer'}
                </button>
            </div>

            {/* Inline Answer Panel */}
            {isExpanded && (
                <div className="border-t border-amber-100 p-4 bg-amber-50/50">
                    <label className="block text-xs font-black text-amber-700 uppercase tracking-widest mb-2 flex items-center gap-1">
                        <Pencil size={12} /> Write the Answer
                    </label>
                    <textarea
                        className="w-full p-4 text-sm border border-amber-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white resize-y min-h-[120px] transition-all"
                        placeholder={`Answer: "${faq.question}"`}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs text-slate-400">{answer.length} characters</p>
                        <button
                            onClick={handlePublish}
                            disabled={isPending || !answer.trim()}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-black uppercase tracking-widest hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 text-sm"
                        >
                            {isPending ? <RefreshCw className="animate-spin" size={14} /> : <Send size={14} />}
                            Publish Answer
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// CSV Import View
// ────────────────────────────────────────────────────────────
function CSVImportView({ onCancel, isPending, startTransition }: { onCancel: () => void, isPending: boolean, startTransition: any }) {
    const [file, setFile] = useState<File | null>(null);
    const [progress, setProgress] = useState<{ current: number; total: number; done: boolean } | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) { setFile(e.target.files[0]); setProgress(null); }
    };

    const handleImport = () => {
        if (!file) return;
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: async (results) => {
                const data = (results.data as any[])
                    .map((row: any) => ({
                        question: row['Question'] || row['question'],
                        parentQuestion: row['Parent Question'] || row['parentQuestion'],
                        linkTitle: row['Link Title'] || row['linkTitle'],
                        linkUrl: row['Link'] || row['linkUrl'] || row['link'],
                        sourceText: row['Text'] || row['sourceText'] || row['text']
                    }))
                    .filter((row: any) => row.question);

                const BATCH_SIZE = 50;
                const batches: any[][] = [];
                for (let i = 0; i < data.length; i += BATCH_SIZE) batches.push(data.slice(i, i + BATCH_SIZE));

                setIsProcessing(true);
                setProgress({ current: 0, total: batches.length, done: false });

                let totalImported = 0;
                for (let bIdx = 0; bIdx < batches.length; bIdx++) {
                    try {
                        const res = await importCSVFAQs(batches[bIdx]);
                        if (res.success) { totalImported += res.count ?? batches[bIdx].length; }
                        else { alert(`Batch ${bIdx + 1} failed: ${res.error}`); setIsProcessing(false); return; }
                    } catch (err: any) { alert(`Batch ${bIdx + 1} error: ${err.message}`); setIsProcessing(false); return; }
                    setProgress({ current: bIdx + 1, total: batches.length, done: bIdx === batches.length - 1 });
                }

                setIsProcessing(false);
                alert(`✅ Import complete! ${totalImported} FAQs imported.`);
                window.location.reload();
            },
            error: (err) => alert('Parsing error: ' + err.message)
        });
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-6">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></button>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Import CSV</h2>
            </div>
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center">
                <div className="bg-white p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4 shadow-sm border border-slate-100"><FileUp className="text-slate-400" /></div>
                <h3 className="text-lg font-bold text-slate-800 mb-2">Upload your FAQ CSV</h3>
                <p className="text-sm text-slate-500 mb-6 max-w-sm mx-auto">Headers: <strong>Question, Parent Question, Link Title, Link, Text</strong></p>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-upload" disabled={isProcessing} />
                <label htmlFor="csv-upload" className="bg-white border border-slate-200 px-6 py-2 rounded-lg font-bold cursor-pointer hover:bg-slate-50 transition-all shadow-sm inline-block mb-4">
                    {file ? file.name : 'Select CSV File'}
                </label>
                {file && !isProcessing && (
                    <div className="mt-4">
                        <button onClick={handleImport} className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 flex items-center gap-2 transition-all shadow-xl mx-auto">
                            <Download size={16} /> Process &amp; Import Data
                        </button>
                    </div>
                )}
                {isProcessing && progress && (
                    <div className="mt-6 max-w-sm mx-auto">
                        <div className="flex justify-between text-xs font-black text-slate-500 uppercase tracking-widest mb-2">
                            <span className="flex items-center gap-2"><RefreshCw className="animate-spin" size={12} /> Importing...</span>
                            <span>{progress.current} / {progress.total} batches</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                            <div className="bg-emerald-500 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-3 italic">Please keep this tab open until the import completes.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

// ────────────────────────────────────────────────────────────
// FAQ Form (Create / Edit)
// ────────────────────────────────────────────────────────────
function FAQForm({ initialData, onCancel, offers = [] }: { initialData?: IFAQ, onCancel: () => void, offers?: any[] }) {
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const data: any = Object.fromEntries(formData.entries());

        data.deepDive = {
            problem: data['deepDive.problem'],
            methodology: data['deepDive.methodology'],
            application: data['deepDive.application']
        };
        delete data['deepDive.problem'];
        delete data['deepDive.methodology'];
        delete data['deepDive.application'];

        if (initialData) data._id = (initialData._id as unknown) as string;

        startTransition(async () => {
            const res = initialData ? await updateFAQ(data) : await createFAQ(data);
            if (res.success) { alert('Saved successfully!'); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-8">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors"><ArrowLeft size={20} /></button>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{initialData ? 'Edit Question' : 'New Question'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Question Text *</label>
                        <input name="question" defaultValue={initialData?.question} required className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" placeholder="e.g. How does energy healing work?" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Parent Context</label>
                        <input name="parentQuestion" defaultValue={initialData?.parentQuestion} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" />
                    </div>
                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Custom Slug</label>
                        <input name="slug" defaultValue={initialData?.slug} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">H1 Title (SEO)</label>
                        <input name="h1Title" defaultValue={initialData?.h1Title} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Answer Snippet</label>
                        <textarea name="answerSnippet" defaultValue={initialData?.answerSnippet} rows={3} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" />
                    </div>

                    <div className="col-span-2 border-t pt-8">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Deep Dive Content</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-red-500 uppercase tracking-widest mb-2">The Problem / Pain Point</label>
                                <textarea name="deepDive.problem" defaultValue={initialData?.deepDive?.problem} rows={4} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-red-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-blue-500 uppercase tracking-widest mb-2">The Methodology / Science</label>
                                <textarea name="deepDive.methodology" defaultValue={initialData?.deepDive?.methodology} rows={5} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-blue-400" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-green-500 uppercase tracking-widest mb-2">Practical Application</label>
                                <textarea name="deepDive.application" defaultValue={initialData?.deepDive?.application} rows={5} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-emerald-400" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 border-t pt-8">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">References</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link Title</label><input name="linkTitle" defaultValue={initialData?.linkTitle} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" /></div>
                            <div><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link URL</label><input name="linkUrl" defaultValue={initialData?.linkUrl} className="w-full border rounded-xl p-3 text-sm bg-slate-50 focus:outline-none focus:border-black" /></div>
                            <div className="col-span-2"><label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Source Text</label><textarea name="sourceText" defaultValue={initialData?.sourceText} rows={2} className="w-full border rounded-xl p-3 text-sm bg-slate-50 font-mono text-[10px] focus:outline-none focus:border-black" /></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t">
                    <button type="button" onClick={onCancel} className="px-8 py-3 text-xs font-black uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" disabled={isPending} className="px-8 py-3 bg-black text-white rounded-xl hover:bg-slate-800 font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50">
                        {isPending ? 'Processing...' : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
}
