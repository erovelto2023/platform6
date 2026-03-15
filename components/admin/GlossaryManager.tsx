"use client";

import { useState, useTransition, useMemo } from 'react';
import Link from 'next/link';
import { IGlossaryTerm } from '@/lib/db/models/GlossaryTerm';
import { IDirectoryProduct } from '@/lib/db/models/DirectoryProduct';
import { Edit, Trash2, Plus, ArrowLeft, Search, Download, Copy, ExternalLink, ChevronLeft, ChevronRight, CheckSquare, Square, Trash, RotateCcw } from 'lucide-react';
import GlossaryForm from './GlossaryForm';
import GlossaryImporter from '@/components/admin/GlossaryImporter';
import { deleteGlossaryTerm, deleteGlossaryTerms, bulkCreateGlossaryTerms, removeDuplicateGlossaryTerms } from '@/lib/actions/glossary.actions';

interface GlossaryManagerProps {
    initialTerms: IGlossaryTerm[];
    products: IDirectoryProduct[];
}

export default function GlossaryManager({ initialTerms = [], products = [] }: GlossaryManagerProps) {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'import'>('list');
    const [editingTerm, setEditingTerm] = useState<IGlossaryTerm | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const filteredTerms = useMemo(() => initialTerms.filter(t =>
        t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.category && t.category.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [initialTerms, searchTerm]);

    const totalPages = Math.ceil(filteredTerms.length / itemsPerPage);
    const paginatedTerms = filteredTerms.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

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

    const handleBulkDelete = () => {
        if (selectedIds.size === 0) return;
        if (!confirm(`Delete ${selectedIds.size} selected term${selectedIds.size > 1 ? 's' : ''}? This cannot be undone.`)) return;
        startTransition(async () => {
            const res = await deleteGlossaryTerms(Array.from(selectedIds));
            if (res.success) {
                alert(`Deleted ${selectedIds.size} terms.`);
                window.location.reload();
            } else {
                alert('Error: ' + (res as any).error);
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

    const allPageSelected = paginatedTerms.length > 0 && paginatedTerms.every(t => selectedIds.has(t.id));

    const toggleSelectAll = () => {
        if (allPageSelected) {
            setSelectedIds(prev => {
                const next = new Set(prev);
                paginatedTerms.forEach(t => next.delete(t.id));
                return next;
            });
        } else {
            setSelectedIds(prev => {
                const next = new Set(prev);
                paginatedTerms.forEach(t => next.add(t.id));
                return next;
            });
        }
    };

    const handleFlushGlossary = () => {
        if (!confirm('⚠️ WARNING: This will delete ALL glossary terms and cannot be undone. This will also clear any cached data. Continue?')) return;
        startTransition(async () => {
            // Delete all terms by selecting all IDs
            const allIds = initialTerms.map(t => t.id);
            if (allIds.length === 0) {
                alert('No terms to delete.');
                return;
            }
            
            const res = await deleteGlossaryTerms(allIds);
            if (res.success) {
                // Clear any client-side storage
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('glossary-mastered');
                    sessionStorage.clear();
                }
                
                alert(`Successfully flushed ${allIds.length} terms from glossary! Cache cleared.`);
                window.location.reload();
            } else {
                alert('Error flushing glossary: ' + (res as any).error);
            }
        });
    };

    const handleRemoveDuplicates = () => {
        if (!confirm('Scan for duplicate terms and delete extras? The oldest copy of each term will be kept. This cannot be undone.')) return;
        startTransition(async () => {
            const res = await removeDuplicateGlossaryTerms();
            if ('removed' in res && res.success) {
                if (res.removed === 0) {
                    alert('✅ No duplicate terms found! Your glossary is clean.');
                } else {
                    alert(`✅ Removed ${res.removed} duplicate term${res.removed !== 1 ? 's' : ''}. Page will reload.`);
                    window.location.reload();
                }
            } else {
                alert('Error: ' + (res as any).error);
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
                                onClick={handleRemoveDuplicates}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-amber-500 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-amber-600 transition-all disabled:opacity-50 text-sm"
                            >
                                <Copy size={15} /> Remove Duplicates
                            </button>
                            <button
                                onClick={handleFlushGlossary}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-red-700 transition-all disabled:opacity-50 text-sm"
                            >
                                <RotateCcw size={15} /> Flush All
                            </button>
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

                    <div className="mb-4 flex gap-3 items-center">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search terms or categories..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black transition-all bg-slate-50"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-500 whitespace-nowrap">
                            <span>Per page:</span>
                            {[10, 20, 50, 100].map(n => (
                                <button
                                    key={n}
                                    onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded-lg border font-bold text-xs transition-all ${
                                        itemsPerPage === n
                                            ? 'bg-black text-white border-black'
                                            : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bulk action bar */}
                    {selectedIds.size > 0 && (
                        <div className="mb-4 flex items-center justify-between bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                            <span className="text-sm font-bold text-red-700">
                                {selectedIds.size} term{selectedIds.size > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedIds(new Set())}
                                    className="text-xs text-red-500 hover:underline font-semibold"
                                >
                                    Deselect All
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isPending}
                                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-sm font-bold px-4 py-2 rounded-lg transition-all disabled:opacity-50"
                                >
                                    <Trash size={15} /> Delete {selectedIds.size} Selected
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="pl-4 pr-2 py-4 w-10">
                                        <button onClick={toggleSelectAll} className="text-slate-400 hover:text-black transition-colors">
                                            {allPageSelected ? <CheckSquare size={18} className="text-black" /> : <Square size={18} />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Term</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-black text-slate-500 uppercase tracking-widest">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-black text-slate-500 uppercase tracking-widest">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-slate-100">
                                {paginatedTerms.map(term => (
                                    <tr key={term.id} className={selectedIds.has(term.id) ? 'bg-red-50' : 'hover:bg-slate-50'}>
                                        <td className="pl-4 pr-2 py-4">
                                            <button onClick={() => toggleSelect(term.id)} className="text-slate-400 hover:text-black transition-colors">
                                                {selectedIds.has(term.id) ? <CheckSquare size={16} className="text-red-600" /> : <Square size={16} />}
                                            </button>
                                        </td>
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
                                                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/glossary/${term.slug}`); alert('Copied!'); }} className="text-slate-300 hover:text-black" title="Copy Link">
                                                    <Copy size={12} />
                                                </button>
                                                <Link href={`/glossary/${term.slug}`} target="_blank" className="text-slate-300 hover:text-emerald-600 transition-colors" title="Visit Page">
                                                    <ExternalLink size={12} />
                                                </Link>
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
                                {paginatedTerms.length === 0 && (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-12 text-center text-slate-500 font-bold uppercase text-xs tracking-widest">No terms found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                            <p className="text-sm text-slate-500">
                                Showing <strong>{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredTerms.length)}</strong> of <strong>{filteredTerms.length}</strong> terms
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    // Show pages around current page
                                    let page: number;
                                    if (totalPages <= 7) page = i + 1;
                                    else if (currentPage <= 4) page = i + 1;
                                    else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                                    else page = currentPage - 3 + i;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 rounded-lg border text-sm font-bold transition-all ${
                                                currentPage === page
                                                    ? 'bg-black text-white border-black'
                                                    : 'border-slate-200 text-slate-600 hover:bg-slate-100'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
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

