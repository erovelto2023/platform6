"use client";

import { useState, useTransition } from 'react';
import { IGlossaryTerm } from '@/lib/db/models/GlossaryTerm';
import { IDirectoryProduct } from '@/lib/db/models/DirectoryProduct';
import { Edit, Trash2, Plus, ArrowLeft, Search, Download, Copy } from 'lucide-react';
import GlossaryForm from './GlossaryForm';
import GlossaryImporter from '@/components/admin/GlossaryImporter';
import { deleteGlossaryTerm } from '@/lib/actions/glossary.actions';

interface GlossaryManagerProps {
    initialTerms: IGlossaryTerm[];
    products: IDirectoryProduct[];
}

export default function GlossaryManager({ initialTerms = [], products = [] }: GlossaryManagerProps) {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'import'>('list');
    const [editingTerm, setEditingTerm] = useState<IGlossaryTerm | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();

    const filteredTerms = initialTerms.filter(t =>
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const handleDelete = (id: string) => {
        if (!confirm('Are you sure you want to delete this term?')) return;
        startTransition(async () => {
            const res = await deleteGlossaryTerm(id);
            if (res.success) {
                alert('Deleted successfully');
                window.location.reload();
            } else {
                alert('Error: ' + res.error);
            }
        });
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            {view === 'list' && (
                <>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-black text-slate-800 tracking-tight">Glossary Management</h2>
                        <div className="flex gap-2">
                            <button
                                onClick={() => { setEditingTerm(undefined); setView('create'); }}
                                className="bg-black text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-slate-800 transition-all"
                            >
                                <Plus size={16} /> New Term
                            </button>
                            <button
                                onClick={() => setView('import')}
                                className="bg-slate-100 text-slate-700 px-6 py-2 rounded-lg font-bold flex items-center gap-2 border border-slate-200 hover:bg-slate-200 transition-all"
                            >
                                <Download size={16} /> Bulk Import
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search terms or categories..."
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
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Term</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {filteredTerms.map(term => (
                                    <tr key={term.id}>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-slate-900">{term.term}</div>
                                            <div className="text-xs text-slate-500 truncate max-w-xs">{term.shortDefinition}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-slate-500">
                                            <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-[10px] font-black uppercase">{term.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono bg-slate-50 p-1 rounded border border-slate-100 italic">/glossary/{term.slug}</span>
                                                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/glossary/${term.slug}`); alert('Copied!'); }} className="text-slate-300 hover:text-black">
                                                    <Copy size={12} />
                                                </button>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <button
                                                onClick={() => { setEditingTerm(term); setView('edit'); }}
                                                className="text-slate-400 hover:text-blue-600 mr-4 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(term.id)}
                                                className="text-slate-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {filteredTerms.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">No terms found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div>
                     <button
                        onClick={() => setView('list')}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest transition-all"
                    >
                        <ArrowLeft size={16} /> Back to List
                    </button>
                    <GlossaryForm
                        initialData={editingTerm}
                        products={products}
                        onComplete={() => { window.location.reload(); }}
                    />
                </div>
            )}

            {view === 'import' && (
                <div>
                    <button
                        onClick={() => setView('list')}
                        className="mb-6 flex items-center gap-2 text-slate-500 hover:text-black font-bold uppercase text-xs tracking-widest transition-all"
                    >
                        <ArrowLeft size={16} /> Back to List
                    </button>
                    <GlossaryImporter />
                </div>
            )}
        </div>
    );
}

