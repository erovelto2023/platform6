"use client";
import { useState, useTransition } from 'react';
import { IFAQ } from '@/lib/db/models/FAQ';
import { Plus, Edit, Trash2, Search, ArrowLeft, Download, RefreshCw, Eye, FileUp, EyeOff, AlertTriangle, CheckCircle2, Pencil, Send, Sparkles, ExternalLink, Copy, RotateCcw, AlertCircle, Video } from 'lucide-react';
import Link from 'next/link';
import Papa from 'papaparse';
import { createFAQ, updateFAQ, deleteFAQ, importFAQs, importCSVFAQs, bulkUnpublishEmptyFAQs, publishFAQWithAnswer, flushAllFAQs, removeDuplicateFAQs, scrubFaqUrls, normalizeFaqData, backfillFaqAffiliateLinks, backfillFaqAnswers, verifyFaqVideoLinksBatch, autoReplaceBrokenFaqVideos } from '@/lib/actions/faq.actions';
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

    const [brokenVideos, setBrokenVideos] = useState<{ id: string; term: string; videoUrl: string; reason: string }[]>([]);
    const [auditStatus, setAuditStatus] = useState<"idle" | "running" | "done">("idle");
    const [auditProgress, setAuditProgress] = useState<string>("");

    const handleBackfillAnswers = () => {
        if (!confirm('This will use AI to automatically generate answers for all draft FAQs. Continue?')) return;
        startTransition(async () => {
            const res = await backfillFaqAnswers();
            if (res.success) { alert(`✅ Generated and published answers for ${res.updatedCount} questions!`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleVideoAudit = async () => {
        setAuditStatus("running");
        setAuditProgress("0%");
        
        const videoFaqs = faqs.filter(f => f.videoUrl);
        if (videoFaqs.length === 0) {
            alert('✅ No videos found to audit!');
            setAuditStatus("idle"); setAuditProgress(""); return;
        }

        const brokenUrls: any[] = [];
        const batchSize = 10;
        let processedCount = 0;
        
        for (let i = 0; i < videoFaqs.length; i += batchSize) {
            const batch = videoFaqs.slice(i, i + batchSize).map(f => ({ id: (f._id as unknown as string), question: f.question, videoUrl: f.videoUrl! }));
            const res = await verifyFaqVideoLinksBatch(batch);
            if (res.success && res.brokenTerms) brokenUrls.push(...res.brokenTerms);
            processedCount += batch.length;
            setAuditProgress(`${Math.round((processedCount / videoFaqs.length) * 100)}%`);
        }

        setAuditStatus("done"); setAuditProgress("");
        if (brokenUrls.length === 0) { alert('✅ All YouTube videos are live!'); setBrokenVideos([]); } 
        else { setBrokenVideos(brokenUrls); alert(`⚠️ Found ${brokenUrls.length} broken YouTube links.`); }
    };

    const handleAutoReplace = () => {
        if (!confirm('Auto-search YouTube and replace broken videos? Continue?')) return;
        startTransition(async () => {
            const res = await autoReplaceBrokenFaqVideos(brokenVideos.map(v => ({ id: v.id, term: v.term })));
            if (res.success) {
                if (res.fixedCount > 0) alert(`✅ Auto-replaced ${res.fixedCount} videos!`);
                else alert(`Unable to find relevant replacements.`);
                setBrokenVideos(res.remainingBroken || []);
            } else alert('Error: ' + res.error);
        });
    };

    const handleScrubUrls = () => {
        if (!confirm('Scrub tracking parameters from external URLs across all FAQs? Continue?')) return;
        startTransition(async () => {
            const res = await scrubFaqUrls();
            if (res.success) { alert(`✅ Cleaned URLs in ${res.updatedTerms} FAQs!`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleNormalizeData = () => {
        if (!confirm('Normalize FAQ titles, trim whitespace, and clean formatting? Continue?')) return;
        startTransition(async () => {
            const res = await normalizeFaqData();
            if (res.success) { alert(`✅ Normalized ${res.updatedCount} FAQs!`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleAffiliateAudit = () => {
        if (!confirm('Scan all FAQ links and attach tracking parameters? Continue?')) return;
        startTransition(async () => {
            const res = await backfillFaqAffiliateLinks();
            if (res.success) { alert(`✅ Backfilled affiliate links in ${res.updatedCount} FAQs!`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleRemoveDuplicates = () => {
        if (!confirm('Find and remove duplicate FAQ entries? Continue?')) return;
        startTransition(async () => {
            const res = await removeDuplicateFAQs();
            if (res.success) { alert(`✅ Removed ${res.removed} duplicate FAQs!`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleFlushFAQs = () => {
        if (!confirm('⚠️ PERMANENTLY DELETE ALL FAQS? This cannot be undone!')) return;
        startTransition(async () => {
            const res = await flushAllFAQs();
            if (res.success) { alert('Flushed all FAQs'); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleBulkUnpublish = () => {
        if (!confirm(`Unpublish ${emptyCount} empty FAQs? Continue?`)) return;
        startTransition(async () => {
            const res = await bulkUnpublishEmptyFAQs();
            if (res.success) { alert(`Unpublished ${res.count} empty FAQs`); window.location.reload(); }
            else alert('Error: ' + res.error);
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this FAQ?')) return;
        startTransition(async () => {
            const res = await deleteFAQ(id);
            if (res.success) window.location.reload();
            else alert('Error: ' + res.error);
        });
    };

    const updateSearch = (term: string) => {
        setSearchTerm(term);
        const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
        if (term) params.set('search', term); else params.delete('search');
        params.set('page', '1');
        router.push(`/admin/faqs?${params.toString()}`);
    };

    const updateDraftSearch = (term: string) => {
        setDraftSearchTerm(term);
        const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
        if (term) params.set('draftSearch', term); else params.delete('draftSearch');
        params.set('draftPage', '1');
        router.push(`/admin/faqs?${params.toString()}`);
    };

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
        params.set('page', newPage.toString());
        router.push(`/admin/faqs?${params.toString()}`);
    };

    const handleDraftPageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams ? searchParams.toString() : "");
        params.set('draftPage', newPage.toString());
        router.push(`/admin/faqs?${params.toString()}`);
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
            <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 text-slate-100 font-sans">
                {view === 'create' || view === 'edit' ? (
                    <FAQForm initialData={editingFAQ} onCancel={() => setView('list')} offers={offers} />
                ) : view === 'import' ? (
                    <div>
                        <div className="flex items-center gap-2 mb-6">
                            <button onClick={() => setView('list')} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300"><ArrowLeft size={20} /></button>
                            <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">Import JSON FAQ Data</h2>
                        </div>
                        <textarea className="w-full h-96 p-6 font-mono text-xs border border-slate-800 rounded-2xl focus:ring-2 focus:ring-cyan-500 outline-none bg-slate-950 text-slate-100 placeholder:text-slate-500" placeholder='[{"question": "...", "answerSnippet": "..."}]' value={importText} onChange={(e) => setImportText(e.target.value)} />
                        <div className="mt-6 flex justify-end">
                            <button onClick={handleImport} disabled={isPending || !importText} className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-wider hover:opacity-90 disabled:opacity-50 flex items-center gap-2 transition-all shadow-xl border-0 cursor-pointer">
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
        <div className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden font-sans">
            {/* Header */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center p-6 border-b border-slate-800 gap-4">
                <div>
                    <h2 className="text-2xl font-black text-slate-100 tracking-tight uppercase">Questions & FAQs Manager</h2>
                    <p className="text-xs font-mono font-bold text-slate-400 mt-1">{totalCount} published · <span className="text-amber-400">{draftTotal} need answers</span></p>
                </div>
                <div className="flex gap-2 flex-wrap justify-end">
                    <Link href="/admin/glossary" className="bg-slate-950 text-slate-300 hover:text-white px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border border-slate-800 hover:bg-slate-800 transition-all">
                        Glossary Manager
                    </Link>
                    <button onClick={handleBackfillAnswers} disabled={isPending || draftTotal === 0} className="bg-cyan-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-cyan-500 transition-all disabled:opacity-50 text-xs font-mono">
                        <Sparkles size={15} /> Backfill Answers
                    </button>
                    <button onClick={handleVideoAudit} disabled={isPending || faqs.length === 0 || auditStatus === "running"} className="bg-rose-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-rose-500 transition-all disabled:opacity-50 text-xs font-mono">
                        {auditStatus === "running" ? `Auditing... ${auditProgress}` : "Video Audit"}
                    </button>
                    <button onClick={handleScrubUrls} disabled={isPending || faqs.length === 0} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-500 transition-all disabled:opacity-50 text-xs font-mono">
                        <ExternalLink size={15} /> Scrub URLs
                    </button>
                    <button onClick={handleAffiliateAudit} disabled={isPending || faqs.length === 0} className="bg-emerald-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-emerald-500 transition-all disabled:opacity-50 text-xs font-mono">
                        <ExternalLink size={15} /> Affiliate Audit
                    </button>
                    <button onClick={handleRemoveDuplicates} disabled={isPending || faqs.length === 0} className="bg-amber-600 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:bg-amber-500 transition-all disabled:opacity-50 text-xs font-mono">
                        <Copy size={15} /> Remove Duplicates
                    </button>
                    <button onClick={() => { setEditingFAQ(undefined); setView('create'); }} className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white px-5 py-2 rounded-xl font-extrabold flex items-center gap-2 hover:opacity-90 transition-all text-xs uppercase border-0 cursor-pointer">
                        <Plus size={15} /> Add New FAQ
                    </button>
                    <button onClick={() => setView('import-csv')} className="bg-slate-950 text-emerald-400 px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border border-emerald-900/60 hover:bg-emerald-950 transition-all">
                        <FileUp size={15} /> Import CSV
                    </button>
                    <button onClick={() => setView('import')} className="bg-slate-950 text-cyan-400 px-4 py-2 rounded-xl font-mono text-xs font-bold flex items-center gap-2 border border-cyan-900/60 hover:bg-cyan-950 transition-all">
                        <Download size={15} /> Import JSON
                    </button>
                </div>
            </div>

            {/* Broken Videos Report */}
            {view === 'list' && brokenVideos.length > 0 && (
                <div className="m-6 p-6 bg-rose-950/80 border border-rose-800 rounded-3xl">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xs font-mono font-bold text-rose-300 uppercase tracking-wider flex items-center gap-2">
                            <AlertCircle size={16} />
                            Broken YouTube Links Found ({brokenVideos.length})
                        </h3>
                        <button onClick={handleAutoReplace} disabled={isPending} className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-500 transition-all disabled:opacity-50 flex items-center gap-2">
                            <Sparkles size={14} /> Auto-Fix All
                        </button>
                    </div>
                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                        {brokenVideos.map((item) => (
                            <div key={item.id} className="bg-slate-900 p-3 rounded-2xl border border-rose-900/60 flex items-center justify-between shadow-sm">
                                <div>
                                    <p className="text-sm font-extrabold text-slate-100">{item.term}</p>
                                    <p className="text-xs text-rose-400 font-mono truncate max-w-lg">{item.videoUrl}</p>
                                </div>
                                <button
                                    onClick={() => { const faqToEdit = faqs.find(f => (f._id as unknown as string) === item.id); if (faqToEdit) { setEditingFAQ(faqToEdit); setView('edit'); } }}
                                    className="px-4 py-2 bg-slate-950 text-white text-[10px] font-mono font-bold uppercase rounded-xl hover:bg-slate-800 transition-all border border-slate-800"
                                >
                                    Fix Now
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="flex border-b border-slate-800 bg-slate-950">
                <button
                    onClick={() => setActiveTab('published')}
                    className={`px-8 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all ${activeTab === 'published' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    ✅ Published <span className="ml-1.5 bg-slate-900 text-cyan-400 border border-slate-800 px-2 py-0.5 rounded-xl">{totalCount}</span>
                </button>
                <button
                    onClick={() => setActiveTab('drafts')}
                    className={`px-8 py-4 text-xs font-mono font-bold uppercase tracking-wider border-b-2 transition-all flex items-center gap-2 ${activeTab === 'drafts' ? 'border-amber-400 text-amber-400' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                    <AlertTriangle size={13} /> Needs Answers
                    {draftTotal > 0 && <span className="bg-amber-500 text-white text-xs font-black px-2 py-0.5 rounded-xl">{draftTotal}</span>}
                </button>
            </div>

            {/* Published Tab */}
            {activeTab === 'published' && (
                <div className="p-6 space-y-4">
                    <div>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search published questions..." className="w-full pl-10 pr-4 py-3 border border-slate-800 rounded-2xl focus:outline-none focus:border-cyan-500 transition-all bg-slate-950 text-slate-100 placeholder:text-slate-500 text-xs font-mono" value={searchTerm} onChange={(e) => updateSearch(e.target.value)} />
                        </div>
                    </div>
                    <div className="overflow-x-auto rounded-3xl border border-slate-800 bg-slate-950">
                        <table className="min-w-full divide-y divide-slate-800/80">
                            <thead className="bg-slate-950">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Question ({totalCount})</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Parent</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-950 divide-y divide-slate-800/80">
                                {faqs.map(faq => (
                                    <tr key={(faq._id as unknown) as string} className="hover:bg-slate-900/60 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-extrabold text-slate-100 line-clamp-1">{faq.question}</div>
                                                {faq.videoUrl && <span title="Video Available"><Video size={12} className="text-rose-400" /></span>}
                                            </div>
                                            <div className="text-xs text-slate-400 truncate max-w-md font-mono mt-0.5">{faq.answerSnippet}</div>
                                        </td>
                                        <td className="px-6 py-4 text-xs font-mono text-slate-400">{faq.parentQuestion || '-'}</td>
                                        <td className="px-6 py-4 text-xs font-mono text-cyan-400">/{faq.slug}</td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <Link href={`/questions/${faq.slug}`} target="_blank" className="text-slate-400 hover:text-emerald-400 mr-4 transition-colors inline-block"><Eye size={18} /></Link>
                                            <button onClick={() => { setEditingFAQ(faq); setView('edit'); }} className="text-slate-400 hover:text-cyan-300 mr-4 transition-colors"><Edit size={18} /></button>
                                            <button onClick={() => handleDelete((faq._id as unknown) as string)} className="text-slate-400 hover:text-rose-400 transition-colors"><Trash2 size={18} /></button>
                                        </td>
                                    </tr>
                                ))}
                                {faqs.length === 0 && (
                                    <tr><td colSpan={4} className="px-6 py-12 text-center text-slate-400 font-mono font-bold uppercase text-xs tracking-widest">No published FAQs found.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
                            <div className="text-xs font-mono text-slate-400 uppercase">Page <span className="text-cyan-400 font-bold">{initialPage}</span> of {totalPages}</div>
                            <div className="flex gap-2">
                                <button onClick={() => handlePageChange(initialPage - 1)} disabled={initialPage === 1} className="px-4 py-2 text-xs font-bold uppercase text-slate-300 bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all">Prev</button>
                                <button onClick={() => handlePageChange(initialPage + 1)} disabled={initialPage >= totalPages} className="px-4 py-2 text-xs font-bold uppercase text-slate-300 bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all">Next</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Drafts / Needs Answers Tab */}
            {activeTab === 'drafts' && (
                <div className="p-6 space-y-4">
                    <div className="p-4 bg-amber-950/60 border border-amber-800/80 rounded-2xl flex items-start gap-3">
                        <AlertTriangle className="text-amber-400 mt-0.5 shrink-0" size={18} />
                        <div>
                            <p className="text-sm font-bold text-amber-200">These questions have no answer text and are hidden from the public.</p>
                            <p className="text-xs text-amber-400 mt-1 font-mono">Add an answer to each question and click "Publish" to make it live.</p>
                        </div>
                    </div>
                    <div>
                        <div className="relative">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input type="text" placeholder="Search questions needing answers..." className="w-full pl-10 pr-4 py-3 border border-slate-800 rounded-2xl focus:outline-none focus:border-amber-400 transition-all bg-slate-950 text-slate-100 placeholder:text-slate-500 text-xs font-mono" value={draftSearchTerm} onChange={(e) => updateDraftSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-3">
                        {draftFaqs.map(faq => (
                            <DraftFAQCard key={(faq._id as unknown) as string} faq={faq} />
                        ))}
                        {draftFaqs.length === 0 && (
                            <div className="text-center py-16 bg-slate-950 rounded-3xl border border-slate-800">
                                <CheckCircle2 className="text-emerald-400 mx-auto mb-3" size={48} />
                                <p className="font-extrabold text-slate-100 text-lg">All questions have answers!</p>
                                <p className="text-slate-400 text-xs font-mono mt-1">There are no unpublished questions needing attention.</p>
                            </div>
                        )}
                    </div>

                    {draftTotalPages > 1 && (
                        <div className="flex justify-between items-center mt-6 pt-4 border-t border-slate-800">
                            <div className="text-xs font-mono text-slate-400 uppercase">Page <span className="text-amber-400 font-bold">{draftPage}</span> of {draftTotalPages}</div>
                            <div className="flex gap-2">
                                <button onClick={() => handleDraftPageChange(draftPage - 1)} disabled={draftPage === 1} className="px-4 py-2 text-xs font-bold uppercase text-slate-300 bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all">Prev</button>
                                <button onClick={() => handleDraftPageChange(draftPage + 1)} disabled={draftPage >= draftTotalPages} className="px-4 py-2 text-xs font-bold uppercase text-slate-300 bg-slate-950 border border-slate-800 rounded-xl disabled:opacity-30 hover:bg-slate-800 transition-all">Next</button>
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
            <div className="p-4 bg-emerald-950/80 border border-emerald-800 rounded-2xl flex items-center gap-3 animate-pulse">
                <CheckCircle2 className="text-emerald-400" size={20} />
                <span className="font-bold text-emerald-300 text-xs font-mono">Published! Refreshing…</span>
            </div>
        );
    }

    return (
        <div className={`border rounded-2xl transition-all overflow-hidden bg-slate-950 ${isExpanded ? 'border-amber-500/80 shadow-lg' : 'border-slate-800 hover:border-amber-500/50'}`}>
            {/* Question Row */}
            <div className="flex items-start gap-4 p-4 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div className="mt-1 w-2 h-2 rounded-full bg-amber-400 shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-slate-100 line-clamp-2">{faq.question}</p>
                    {faq.parentQuestion && <p className="text-xs text-slate-400 font-mono mt-1">{faq.parentQuestion}</p>}
                </div>
                <button className={`shrink-0 text-xs font-mono font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl transition-colors ${isExpanded ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-slate-900 text-slate-300 border border-slate-800 hover:text-white'}`}>
                    {isExpanded ? 'Cancel' : 'Add Answer'}
                </button>
            </div>

            {/* Inline Answer Panel */}
            {isExpanded && (
                <div className="border-t border-slate-800 p-4 bg-slate-900">
                    <label className="block text-xs font-mono font-bold text-amber-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Pencil size={12} /> Write the Answer
                    </label>
                    <textarea
                        className="w-full p-4 text-xs font-mono border border-slate-800 rounded-2xl focus:outline-none focus:border-amber-400 bg-slate-950 text-slate-100 placeholder:text-slate-500 resize-y min-h-[120px] transition-all"
                        placeholder={`Answer: "${faq.question}"`}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        autoFocus
                    />
                    <div className="flex items-center justify-between mt-3">
                        <p className="text-xs font-mono text-slate-400">{answer.length} characters</p>
                        <button
                            onClick={handlePublish}
                            disabled={isPending || !answer.trim()}
                            className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl font-extrabold uppercase tracking-wider hover:bg-emerald-500 disabled:opacity-50 flex items-center gap-2 transition-all shadow-lg shadow-emerald-500/20 text-xs"
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
                const rows = results.data as any[];
                if (!rows || rows.length === 0) { alert("CSV file appears to be empty."); return; }
                const validRows = rows.filter(r => (r.question || r.Question || r.term || r.Term) && (r.answer || r.Answer || r.answerSnippet));
                if (validRows.length === 0) { alert("No valid rows found. CSV must contain 'question' and 'answer' columns."); return; }

                setIsProcessing(true);
                const batchSize = 100;
                const totalBatches = Math.ceil(validRows.length / batchSize);
                let totalImported = 0;

                for (let i = 0; i < totalBatches; i++) {
                    const batch = validRows.slice(i * batchSize, (i + 1) * batchSize);
                    setProgress({ current: i + 1, total: totalBatches, done: false });
                    const res = await importCSVFAQs(batch);
                    if (res.success) totalImported += res.count;
                }

                setIsProcessing(false);
                setProgress({ current: totalBatches, total: totalBatches, done: true });
                alert(`✅ Successfully imported ${totalImported} FAQs from CSV!`);
                window.location.reload();
            },
            error: (err) => { alert("Error parsing CSV: " + err.message); }
        });
    };

    return (
        <div className="font-sans">
            <div className="flex items-center gap-2 mb-6">
                <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300"><ArrowLeft size={20} /></button>
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">Import CSV FAQ Data</h2>
            </div>
            <div className="border-2 border-dashed border-slate-800 bg-slate-950 p-8 rounded-3xl text-center space-y-4">
                <FileUp className="mx-auto text-cyan-400" size={48} />
                <div>
                    <p className="text-sm font-extrabold text-slate-100">Select a CSV file containing FAQ questions and answers</p>
                    <p className="text-xs text-slate-400 font-mono mt-1">Columns needed: <code className="bg-slate-900 text-cyan-400 px-2 py-0.5 rounded border border-slate-800">question</code>, <code className="bg-slate-900 text-cyan-400 px-2 py-0.5 rounded border border-slate-800">answer</code></p>
                </div>
                <input type="file" accept=".csv" onChange={handleFileChange} className="hidden" id="csv-file-input" />
                <label htmlFor="csv-file-input" className="inline-block bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 px-6 py-3 rounded-2xl font-bold text-xs uppercase tracking-wider cursor-pointer transition-all">
                    {file ? file.name : "Choose CSV File"}
                </label>
                {file && (
                    <div>
                        <button onClick={handleImport} disabled={isProcessing} className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 text-white px-8 py-3 rounded-2xl font-extrabold text-xs uppercase tracking-wider hover:opacity-90 disabled:opacity-50 flex items-center gap-2 mx-auto transition-all shadow-xl border-0 cursor-pointer">
                            {isProcessing ? <RefreshCw className="animate-spin" size={16} /> : <FileUp size={16} />} Start CSV Import
                        </button>
                    </div>
                )}
                {progress && (
                    <div className="mt-6 max-w-sm mx-auto">
                        <div className="flex justify-between text-xs font-mono text-slate-400 uppercase mb-2">
                            <span className="flex items-center gap-2"><RefreshCw className="animate-spin" size={12} /> Importing...</span>
                            <span>{progress.current} / {progress.total} batches</span>
                        </div>
                        <div className="w-full bg-slate-900 rounded-full h-3 overflow-hidden border border-slate-800">
                            <div className="bg-cyan-500 h-3 rounded-full transition-all duration-300" style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }} />
                        </div>
                        <p className="text-xs text-slate-400 mt-3 italic font-mono">Please keep this tab open until the import completes.</p>
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
        <div className="font-sans text-slate-100">
            <div className="flex items-center gap-2 mb-8">
                <button onClick={onCancel} className="p-2 hover:bg-slate-800 rounded-full transition-colors text-slate-300"><ArrowLeft size={20} /></button>
                <h2 className="text-xl font-black text-slate-100 uppercase tracking-tight">{initialData ? 'Edit Question' : 'New Question'}</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 max-w-4xl">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="col-span-2">
                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Question Text *</label>
                        <input name="question" defaultValue={initialData?.question} required className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" placeholder="e.g. How does energy healing work?" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Parent Context</label>
                        <input name="parentQuestion" defaultValue={initialData?.parentQuestion} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div>
                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Custom Slug</label>
                        <input name="slug" defaultValue={initialData?.slug} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">H1 Title (SEO)</label>
                        <input name="h1Title" defaultValue={initialData?.h1Title} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" />
                    </div>
                    <div className="col-span-2">
                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Answer Snippet</label>
                        <textarea name="answerSnippet" defaultValue={initialData?.answerSnippet} rows={3} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" />
                    </div>

                    <div className="col-span-2 border-t border-slate-800 pt-8">
                        <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider mb-6">Deep Dive Content</h3>
                        <div className="space-y-6">
                            <div>
                                <label className="block text-xs font-mono font-bold text-rose-400 uppercase tracking-wider mb-2">The Problem / Pain Point</label>
                                <textarea name="deepDive.problem" defaultValue={initialData?.deepDive?.problem} rows={4} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider mb-2">The Methodology / Science</label>
                                <textarea name="deepDive.methodology" defaultValue={initialData?.deepDive?.methodology} rows={5} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" />
                            </div>
                            <div>
                                <label className="block text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider mb-2">Practical Application</label>
                                <textarea name="deepDive.application" defaultValue={initialData?.deepDive?.application} rows={5} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500" />
                            </div>
                        </div>
                    </div>

                    <div className="col-span-2 border-t border-slate-800 pt-8">
                        <h3 className="text-sm font-black text-slate-100 uppercase tracking-wider mb-6">References</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div><label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Link Title</label><input name="linkTitle" defaultValue={initialData?.linkTitle} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" /></div>
                            <div><label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Link URL</label><input name="linkUrl" defaultValue={initialData?.linkUrl} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500" /></div>
                            <div className="col-span-2"><label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Video URL</label><input name="videoUrl" defaultValue={initialData?.videoUrl} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-rose-500" placeholder="https://youtube.com/watch?v=..." /></div>
                            <div className="col-span-2"><label className="block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-2">Source Text</label><textarea name="sourceText" defaultValue={initialData?.sourceText} rows={2} className="w-full border border-slate-800 rounded-2xl p-3.5 text-xs font-mono bg-slate-950 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500 text-[10px]" /></div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end gap-4 pt-8 border-t border-slate-800">
                    <button type="button" onClick={onCancel} className="px-8 py-3 text-xs font-bold uppercase tracking-wider bg-slate-950 border border-slate-800 text-slate-300 rounded-2xl hover:bg-slate-800 transition-all">Cancel</button>
                    <button type="submit" disabled={isPending} className="px-8 py-3 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white rounded-2xl font-extrabold uppercase tracking-wider shadow-xl transition-all disabled:opacity-50 border-0 cursor-pointer text-xs">
                        {isPending ? 'Processing...' : 'Save Question'}
                    </button>
                </div>
            </form>
        </div>
    );
}
