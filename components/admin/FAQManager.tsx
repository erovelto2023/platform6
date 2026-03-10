"use client";
import { useState, useTransition } from 'react';
import { IFAQ } from '@/lib/db/models/FAQ';
import { Plus, Edit, Trash2, Search, ArrowLeft, Download, RefreshCw, Eye } from 'lucide-react';
import Link from 'next/link';
import { createFAQ, updateFAQ, deleteFAQ, importFAQs } from '@/lib/actions/faq.actions';

interface FAQManagerProps {
    faqs: IFAQ[];
    offers?: any[];
}

export default function FAQManager({ faqs = [], offers = [] }: FAQManagerProps) {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'import'>('list');
    const [editingFAQ, setEditingFAQ] = useState<IFAQ | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [importText, setImportText] = useState('');
    const [isPending, startTransition] = useTransition();
    const [page, setPage] = useState(1);
    const itemsPerPage = 20;

    // Filter FAQs
    const filteredFAQs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        f.parentQuestion?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredFAQs.length / itemsPerPage);
    const paginatedFAQs = filteredFAQs.slice((page - 1) * itemsPerPage, page * itemsPerPage);

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        startTransition(async () => {
            const res = await deleteFAQ(id);
            if (res.success) {
                alert('Deleted successfully');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    const handleImport = async () => {
        if (!importText) return;
        try {
            const faqs = JSON.parse(importText);
            startTransition(async () => {
                const res = await importFAQs(faqs);
                if (res.success) {
                    alert(`Imported ${res.count} FAQs`);
                    window.location.reload();
                } else {
                    alert('Error: ' + res.error);
                }
            });
        } catch (e) {
            alert('Invalid JSON format');
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Questions / FAQs</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setEditingFAQ(undefined); setView('create'); }}
                                className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                <Plus size={16} /> Add New
                            </button>
                            <button
                                onClick={() => setView('import')}
                                className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-all"
                            >
                                <Download size={16} /> Import JSON
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search questions..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Question</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Parent</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {paginatedFAQs.map(faq => (
                                    <tr key={(faq._id as unknown) as string}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">{faq.question}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{faq.answerSnippet}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">{faq.parentQuestion || '-'}</td>
                                        <td className="px-6 py-4 text-sm text-slate-500 text-xs font-mono bg-slate-50 p-1 rounded">/{faq.slug}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <Link
                                                href={`/questions/${faq.slug}`}
                                                target="_blank"
                                                className="text-slate-400 hover:text-black mr-4 transition-colors"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                onClick={() => { setEditingFAQ(faq); setView('edit'); }}
                                                className="text-slate-400 hover:text-blue-600 mr-4 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete((faq._id as unknown) as string)}
                                                className="text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedFAQs.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">No FAQs found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-6 border-t border-slate-100">
                            <div className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Page <span className="text-black">{page}</span> of {totalPages}
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
                                >
                                    Prev
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                    disabled={page >= totalPages}
                                    className="px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-30 hover:bg-slate-50 transition-all"
                                >
                                    Next
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <FAQForm
                    initialData={editingFAQ}
                    onCancel={() => setView('list')}
                    offers={offers}
                />
            )}

            {view === 'import' && (
                <div>
                    <div className="flex items-center gap-2 mb-6">
                        <button onClick={() => setView('list')} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">Import JSON</h2>
                    </div>
                    <textarea
                        className="w-full h-96 p-6 font-mono text-xs border border-slate-200 rounded-2xl focus:ring-2 focus:ring-black outline-none bg-slate-50"
                        placeholder='[{"question": "...", "answerSnippet": "..."}]'
                        value={importText}
                        onChange={(e) => setImportText(e.target.value)}
                    ></textarea>
                    <div className="mt-6 flex justify-end">
                        <button
                            onClick={handleImport}
                            disabled={isPending || !importText}
                            className="bg-black text-white px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2 transition-all shadow-xl"
                        >
                            {isPending ? <RefreshCw className="animate-spin" size={16} /> : <Download size={16} />}
                            Import FAQ Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

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

        if (initialData) {
            data._id = (initialData._id as unknown) as string;
        }

        startTransition(async () => {
            const res = initialData ? await updateFAQ(data) : await createFAQ(data);
            if (res.success) {
                alert('Saved successfully!');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    return (
        <div>
            <div className="flex items-center gap-2 mb-8">
                <button onClick={onCancel} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                    <ArrowLeft size={20} />
                </button>
                <h2 className="text-xl font-black text-slate-800 uppercase tracking-tight">{initialData ? 'Edit Question' : 'New Question'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Question Text *</label>
                        <input name="question" defaultValue={initialData?.question} required className="input-field-2" placeholder="e.g. How does energy healing work?" />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Parent Context (Optional)</label>
                        <input name="parentQuestion" defaultValue={initialData?.parentQuestion} className="input-field-2" placeholder="e.g. Reiki Basics" />
                    </div>

                    <div>
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Custom Slug (Optional)</label>
                        <input name="slug" defaultValue={initialData?.slug} className="input-field-2" placeholder="how-it-works" />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">H1 Title (SEO)</label>
                        <input name="h1Title" defaultValue={initialData?.h1Title} className="input-field-2" placeholder="The Ultimate Guide to..." />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Answer Snippet (Fast Summary)</label>
                        <textarea name="answerSnippet" defaultValue={initialData?.answerSnippet} rows={3} className="input-field-2" placeholder="Short summary for preview cards..." />
                    </div>

                    <div className="col-span-2">
                        <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Connected Offer</label>
                        <select name="relatedOfferId" defaultValue={initialData?.relatedOfferId || ''} className="input-field-2 font-bold bg-white">
                            <option value="">-- No Offer Linked --</option>
                            {offers.map((offer: any) => (
                                <option key={offer._id || offer.id} value={offer._id || offer.id}>
                                    {offer.title || offer.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-2 border-t pt-8">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">Deep Dive Content (Full Page)</h3>
                        
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-red-600">The Problem / Pain Point</label>
                                <textarea name="deepDive.problem" defaultValue={initialData?.deepDive?.problem} rows={4} className="input-field-2 border-red-50 focus:ring-red-500" />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-blue-600">The Methodology / Science</label>
                                <textarea name="deepDive.methodology" defaultValue={initialData?.deepDive?.methodology} rows={6} className="input-field-2 border-blue-50 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2 text-green-600">Practical Application</label>
                                <textarea name="deepDive.application" defaultValue={initialData?.deepDive?.application} rows={6} className="input-field-2 border-green-50 focus:ring-green-500" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 border-t pt-8">
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest mb-6">References</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link Title</label>
                                <input name="linkTitle" defaultValue={initialData?.linkTitle} className="input-field-2" />
                            </div>
                            <div>
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Link URL</label>
                                <input name="linkUrl" defaultValue={initialData?.linkUrl} className="input-field-2" />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-2">Source Text Clip</label>
                                <textarea name="sourceText" defaultValue={initialData?.sourceText} rows={2} className="input-field-2 text-slate-500 font-mono text-[10px]" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t">
                    <button type="button" onClick={onCancel} className="px-8 py-3 text-xs font-black uppercase tracking-widest border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Cancel</button>
                    <button type="submit" disabled={isPending} className="px-8 py-3 bg-black text-white rounded-xl hover:bg-slate-800 font-black uppercase tracking-widest shadow-xl transition-all disabled:opacity-50">
                        {isPending ? 'Processing...' : 'Publish Question'}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .input-field-2 {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid #e2e8f0;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all 0.2s;
                    background: #f8fafc;
                }
                .input-field-2:focus {
                    background: white;
                    border-color: #000;
                    ring: 2px solid #000;
                }
            `}</style>
        </div>
    );
}

