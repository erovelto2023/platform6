"use client";

import { useState, useTransition, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { IGlossaryTerm } from '@/lib/db/models/GlossaryTerm';
import { IDirectoryProduct } from '@/lib/db/models/DirectoryProduct';
import { Edit, Trash2, Plus, ArrowLeft, Search, Download, Copy, ExternalLink, ChevronLeft, ChevronRight, CheckSquare, Square, Trash, RotateCcw, Sparkles, AlertCircle, Video, ShoppingCart, Globe, Mic, FileText, Lightbulb, TrendingUp, Image as ImageIcon } from 'lucide-react';
import GlossaryForm from './GlossaryForm';
import GlossaryImporter from '@/components/admin/GlossaryImporter';
import { deleteGlossaryTerm, deleteGlossaryTerms, bulkCreateGlossaryTerms, removeDuplicateGlossaryTerms, scrubGlossaryUrls, backfillAiPrompts, backfillAffiliateTags, verifyYouTubeLinksBatch, autoReplaceBrokenVideos, autoReplaceSingleVideo, normalizeGlossaryData } from '@/lib/actions/glossary.actions';

interface GlossaryManagerProps {
    initialTerms: IGlossaryTerm[];
    products: IDirectoryProduct[];
}

export default function GlossaryManager({ initialTerms = [], products = [] }: GlossaryManagerProps) {
    const [view, setView] = useState<'list' | 'create' | 'edit' | 'import' | 'performance'>('list');
    const [editingTerm, setEditingTerm] = useState<IGlossaryTerm | undefined>(undefined);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPending, startTransition] = useTransition();
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [brokenVideos, setBrokenVideos] = useState<{ id: string; term: string; videoUrl: string; reason: string }[]>([]);
    const [auditStatus, setAuditStatus] = useState<"idle" | "running" | "done">("idle");
    const [auditProgress, setAuditProgress] = useState<string>("");
    const [singleFixingId, setSingleFixingId] = useState<string | null>(null);
    const [isAutoFixingAll, setIsAutoFixingAll] = useState(false);
    const searchParams = useSearchParams();
    const router = useRouter();

    const legendStats = useMemo(() => {
        let images = 0, videos = 0, products = 0, websites = 0, podcasts = 0, caseStudies = 0, aiPrompts = 0, aeoFaqs = 0;
        initialTerms.forEach(t => {
            if (t.imageUrl) images++;
            if (t.videoUrl) videos++;
            if ((t.amazonProducts && t.amazonProducts.length > 0) || (t.recommendedTools && t.recommendedTools.length > 0)) products++;
            if (t.websitesRanking && t.websitesRanking.length > 0) websites++;
            if (t.podcastsRanking && t.podcastsRanking.length > 0) podcasts++;
            if (t.caseStudies && t.caseStudies.length > 0) caseStudies++;
            if (t.imagePrompt || t.productPrompt || t.socialPrompt || (t.youtubeTitles && t.youtubeTitles.length > 0) || (t.pinterestIdeas && t.pinterestIdeas.length > 0) || (t.instagramIdeas && t.instagramIdeas.length > 0)) aiPrompts++;
            if ((t.faqs && t.faqs.length > 0) || (t.questionVariations && t.questionVariations.length > 0) || t.aeoSummary) aeoFaqs++;
        });
        return { images, videos, products, websites, podcasts, caseStudies, aiPrompts, aeoFaqs };
    }, [initialTerms]);

    // Auto-edit / tab from query param
    useEffect(() => {
        if (!searchParams) return;
        const tab = searchParams.get('tab') || searchParams.get('view');
        const editId = searchParams.get('edit');
        if (tab === 'import') {
            setView('import');
        } else if (tab === 'create') {
            setView('create');
        } else if (tab === 'performance') {
            setView('performance');
        } else if (editId && initialTerms.length > 0) {
            const term = initialTerms.find(t => t.id === editId || (t as any)._id === editId);
            if (term) {
                setEditingTerm(term);
                setView('edit');
            }
        }
    }, [searchParams, initialTerms]);

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

    const handleBackfillPrompts = () => {
        if (!confirm('This will automatically generate Image, Product, and Social prompts for all terms that are currently missing them. Continue?')) return;
        startTransition(async () => {
            const res = await backfillAiPrompts();
            if (res.success) {
                if (res.updatedCount === 0) {
                    alert('✅ All terms already have AI prompts! No updates needed.');
                } else {
                    alert(`✅ Successfully added/updated prompts for ${res.updatedCount} terms. Page will reload.`);
                    window.location.reload();
                }
            } else {
                alert('Error: ' + (res as any).error);
            }
        });
    };

    const handleScrubUrls = () => {
        if (!confirm('Scan all terms and remove placeholder URLs like "example.com"? This will also clean up dead links in podcasts and authority sites. Continue?')) return;
        startTransition(async () => {
            const res = await scrubGlossaryUrls();
            if (res.success) {
                if (res.updatedTerms === 0) {
                    alert('✅ All URLs are already clean! No placeholders found.');
                } else {
                    alert(`✅ Successfully scrubbed ${res.scrubbedFields} invalid fields across ${res.updatedTerms} terms. Page will reload.`);
                    window.location.reload();
                }
            } else {
                alert('Error scrubbing URLs: ' + (res as any).error);
            }
        });
    };

    const handleAffiliateAudit = () => {
        if (!confirm('This will scan all Glossary Terms and Directory Products for Amazon links and automatically attach your affiliate ID (weightlo0f57d-20) where missing. Continue?')) return;
        startTransition(async () => {
            const res = await backfillAffiliateTags();
            if (res.success) {
                if (res.glossaryUpdated === 0 && res.productUpdated === 0) {
                    alert('✅ All Amazon links already have your affiliate tag! No updates needed.');
                } else {
                    alert(`✅ Done! Updated ${res.glossaryUpdated} Glossary Terms and ${res.productUpdated} Directory Products. Page will reload.`);
                    window.location.reload();
                }
            } else {
                alert('Error updating affiliate tags: ' + (res as any).error);
            }
        });
    };

    const handleVideoAudit = async () => {
        setAuditStatus("running");
        setAuditProgress("0%");
        
        const videoTerms = initialTerms.filter(t => t.videoUrl);
        if (videoTerms.length === 0) {
            alert('✅ No videos found to audit!');
            setAuditStatus("idle");
            setAuditProgress("");
            return;
        }

        const brokenUrls: any[] = [];
        const batchSize = 10;
        let processedCount = 0;
        
        for (let i = 0; i < videoTerms.length; i += batchSize) {
            const batch = videoTerms.slice(i, i + batchSize).map(t => ({ id: t.id, term: t.term, videoUrl: t.videoUrl! }));
            const res = await verifyYouTubeLinksBatch(batch);
            
            if (res.success && res.brokenTerms) {
                brokenUrls.push(...res.brokenTerms);
            }
            
            processedCount += batch.length;
            setAuditProgress(`${Math.round((processedCount / videoTerms.length) * 100)}%`);
        }

        setAuditStatus("done");
        setAuditProgress("");
        
        if (brokenUrls.length === 0) {
            alert('✅ All YouTube videos are live and available!');
            setBrokenVideos([]);
        } else {
            setBrokenVideos(brokenUrls);
            alert(`⚠️ Found ${brokenUrls.length} broken or unavailable YouTube links. See the report below.`);
        }
    };

    const handleAutoReplaceSingle = async (item: { id: string; term: string }) => {
        setSingleFixingId(item.id);
        try {
            const res = await autoReplaceSingleVideo(item.id, item.term);
            if (res.success && res.newVideoUrl) {
                alert(`✅ Successfully auto-replaced video for "${item.term}"!\nNew Video URL: ${res.newVideoUrl}`);
                setBrokenVideos(prev => prev.filter(v => v.id !== item.id));
            } else {
                alert(`⚠️ Could not auto-fix "${item.term}": ${res.error || "No video found"}`);
            }
        } catch (e: any) {
            alert(`Error auto-replacing video: ${e.message}`);
        }
        setSingleFixingId(null);
    };

    const handleAutoReplace = async () => {
        if (!confirm(`Sequentially auto-fix ${brokenVideos.length} broken video(s)? This replaces 1 video at a time to prevent server timeouts.`)) return;
        setIsAutoFixingAll(true);
        let fixed = 0;
        const currentList = [...brokenVideos];

        for (let i = currentList.length - 1; i >= 0; i--) {
            const item = currentList[i];
            setSingleFixingId(item.id);
            try {
                const res = await autoReplaceSingleVideo(item.id, item.term);
                if (res.success) {
                    fixed++;
                    currentList.splice(i, 1);
                    setBrokenVideos([...currentList]);
                }
            } catch (err) {
                console.error(`Error fixing ${item.term}:`, err);
            }
        }
        setIsAutoFixingAll(false);
        setSingleFixingId(null);
        alert(`✅ Process complete! Successfully auto-replaced ${fixed} video(s).`);
    };

    const handleExportCSV = () => {
        if (initialTerms.length === 0) {
            alert('No terms to export.');
            return;
        }

        // CSV Header
        const headers = ["Term", "Short Definition", "Category", "SubCategory", "Views", "Slug", "Startup Cost", "Time to Entry", "Skill Level"];
        
        // Helper to escape CSV values
        const escapeCsv = (val: any) => {
            if (val === undefined || val === null) return "";
            const str = String(val);
            if (str.includes(",") || str.includes('"') || str.includes("\n")) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const rows = initialTerms.map(t => [
            escapeCsv(t.term),
            escapeCsv(t.shortDefinition),
            escapeCsv(t.category),
            escapeCsv(t.subCategory),
            escapeCsv((t as any).views || 0),
            escapeCsv(`${window.location.origin}/glossary/${t.slug}`),
            escapeCsv(t.startupCost),
            escapeCsv(t.timeToFirstDollar),
            escapeCsv(t.skillRequired)
        ]);

        const csvContent = [headers, ...rows].map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        
        const date = new Date().toISOString().split('T')[0];
        link.setAttribute("href", url);
        link.setAttribute("download", `glossary_export_${date}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-slate-900 p-6 md:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6 font-sans">
            {(view === 'list' || view === 'performance') && (
                <>
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                        <div>
                            <h2 className="text-2xl font-black text-slate-100 tracking-tight">Glossary & AEO Ecosystem Management</h2>
                            <p className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider mt-1">Terminology Database, AI Extraction & Keyword Ecosystem</p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <button
                                onClick={() => setView(view === 'performance' ? 'list' : 'performance')}
                                className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs shadow-md cursor-pointer"
                            >
                                <TrendingUp size={14} /> {view === 'performance' ? 'Standard View' : 'Performance Analytics'}
                            </button>
                            <button
                                onClick={handleBackfillPrompts}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-sky-600 hover:bg-sky-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs shadow-md"
                            >
                                <Sparkles size={14} /> Backfill Prompts
                            </button>
                            <button
                                onClick={handleVideoAudit}
                                disabled={isPending || initialTerms.length === 0 || auditStatus === "running"}
                                className="bg-rose-600 hover:bg-rose-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs shadow-md"
                            >
                                {auditStatus === "running" ? `Auditing... ${auditProgress}` : "Video Audit"}
                            </button>
                            <button
                                onClick={handleScrubUrls}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-indigo-600 hover:bg-indigo-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs shadow-md"
                            >
                                <ExternalLink size={14} /> Scrub URLs
                            </button>
                            <button
                                onClick={handleAffiliateAudit}
                                disabled={isPending}
                                className="bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs shadow-md"
                            >
                                <ExternalLink size={14} /> Affiliate Audit
                            </button>
                            <button
                                onClick={handleRemoveDuplicates}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-amber-600 hover:bg-amber-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs shadow-md"
                            >
                                <Copy size={14} /> Remove Duplicates
                            </button>
                            <button
                                onClick={() => {
                                    if (!confirm('This will fix data structural issues to prevent save errors. Continue?')) return;
                                    startTransition(async () => {
                                        const res = await normalizeGlossaryData();
                                        if (res.success) {
                                            alert(`✅ Successfully normalized ${res.updatedCount} terms.`);
                                            window.location.reload();
                                        } else {
                                            alert('Error: ' + (res as any).error);
                                        }
                                    });
                                }}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-blue-600 hover:bg-blue-500 text-white px-3.5 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs shadow-md"
                            >
                                <RotateCcw size={14} /> Normalize
                            </button>
                            <button
                                onClick={handleFlushGlossary}
                                disabled={isPending || initialTerms.length === 0}
                                className="bg-rose-950 border border-rose-800 text-rose-300 hover:bg-rose-900 px-3 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all disabled:opacity-50 text-xs"
                            >
                                <RotateCcw size={14} /> Flush All
                            </button>
                            <button
                                onClick={() => { setEditingTerm(undefined); setView('create'); router.push('/admin/glossary?tab=create', { scroll: false }); }}
                                className="bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white px-5 py-2 rounded-xl font-extrabold flex items-center gap-1.5 transition-all shadow-lg shadow-indigo-600/30 text-xs cursor-pointer"
                            >
                                <Plus size={16} /> New Term
                            </button>
                            <button
                                onClick={() => { setView('import'); router.push('/admin/glossary?tab=import', { scroll: false }); }}
                                className="bg-slate-950 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs cursor-pointer"
                            >
                                <Download size={14} /> Bulk Import
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="bg-slate-950 border border-indigo-800/80 text-cyan-300 hover:bg-indigo-950 px-4 py-2 rounded-xl font-bold flex items-center gap-1.5 transition-all text-xs shadow-md"
                            >
                                <FileText size={14} /> Export CSV
                            </button>
                        </div>
                    </div>
                    
                    {/* Broken Videos Report */}
                    {brokenVideos.length > 0 && (
                        <div className="p-6 bg-rose-950/60 border border-rose-800 rounded-2xl space-y-4 shadow-2xl">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-rose-900/60 pb-3">
                                <h3 className="text-xs font-black text-rose-300 uppercase tracking-widest flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    Broken YouTube Links Found ({brokenVideos.length})
                                </h3>
                                <button
                                    onClick={handleAutoReplace}
                                    disabled={isPending || isAutoFixingAll}
                                    className="bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-rose-500 transition-all disabled:opacity-50 flex items-center gap-2 cursor-pointer shadow-md self-start sm:self-auto"
                                >
                                    <Sparkles size={14} className={isAutoFixingAll ? "animate-spin" : ""} /> 
                                    {isAutoFixingAll ? `Auto-Fixing All (${brokenVideos.length} left)...` : "Auto-Fix All (Safe Sequential)"}
                                </button>
                            </div>
                            <div className="space-y-3 max-h-72 overflow-y-auto pr-2">
                                {brokenVideos.map((item) => (
                                    <div key={item.id} className="bg-slate-950 p-4 rounded-2xl border border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
                                        <div className="min-w-0 flex-1">
                                            <p className="text-sm font-extrabold text-slate-100">{item.term}</p>
                                            <p className="text-xs text-rose-400 font-mono truncate max-w-lg mt-0.5" title={item.videoUrl}>{item.videoUrl}</p>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button
                                                onClick={() => handleAutoReplaceSingle(item)}
                                                disabled={singleFixingId === item.id || isAutoFixingAll}
                                                className="px-3.5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-[10px] font-mono font-bold uppercase rounded-xl transition-all disabled:opacity-50 flex items-center gap-1.5 cursor-pointer shadow-md"
                                            >
                                                <Sparkles size={13} className={singleFixingId === item.id ? "animate-spin" : ""} />
                                                {singleFixingId === item.id ? "Fixing..." : "Auto-Fix"}
                                            </button>
                                            <button
                                                onClick={() => {
                                                    const termToEdit = initialTerms.find(t => t.id === item.id || (t as any)._id === item.id);
                                                    if (termToEdit) {
                                                        setEditingTerm(termToEdit);
                                                        setView('edit');
                                                    } else {
                                                        window.open(`/admin/glossary?edit=${item.id}`, '_blank');
                                                    }
                                                }}
                                                className="px-3.5 py-2 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-200 hover:text-white text-[10px] font-mono font-bold uppercase rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                                            >
                                                <Edit size={13} /> Fix / Edit
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {view === 'list' && (
                        <>
                            <div className="flex flex-col sm:flex-row gap-3 items-center">
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Search terms or categories..."
                                className="w-full pl-10 pr-4 py-3 border border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-cyan-500 transition-all bg-slate-950 text-slate-100 placeholder:text-slate-500 text-xs font-sans"
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                            />
                        </div>
                        <div className="flex items-center gap-2 text-xs font-mono text-slate-400 whitespace-nowrap">
                            <span>Per page:</span>
                            {[10, 20, 50, 100].map(n => (
                                <button
                                    key={n}
                                    onClick={() => { setItemsPerPage(n); setCurrentPage(1); }}
                                    className={`px-3 py-1.5 rounded-xl border font-bold text-xs transition-all ${
                                        itemsPerPage === n
                                            ? 'bg-cyan-600 text-white border-cyan-500'
                                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bulk Action Bar (when terms are selected) */}
                    {selectedIds.size > 0 && (
                        <div className="flex items-center justify-between bg-rose-950/80 border border-rose-800 rounded-2xl px-5 py-3 shadow-lg">
                            <span className="text-xs font-extrabold text-rose-200 font-mono">
                                {selectedIds.size} term{selectedIds.size > 1 ? 's' : ''} selected
                            </span>
                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => setSelectedIds(new Set())}
                                    className="text-xs text-rose-400 hover:underline font-bold cursor-pointer"
                                >
                                    Deselect All
                                </button>
                                <button
                                    onClick={handleBulkDelete}
                                    disabled={isPending}
                                    className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold px-4 py-2 rounded-xl transition-all disabled:opacity-50 cursor-pointer shadow-md"
                                >
                                    <Trash size={14} /> Delete {selectedIds.size} Selected
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Icon Legend Bar */}
                    <div className="p-4 bg-slate-950 border border-slate-800/80 rounded-2xl flex flex-wrap items-center gap-x-5 gap-y-2 shadow-inner">
                        <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            Icon Legend:
                        </span>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.images} terms have an Image`}>
                            <ImageIcon size={14} className="text-cyan-400" /> Image <span className="text-[10px] font-mono text-cyan-400 font-bold">({legendStats.images})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.videos} terms have a Video`}>
                            <Video size={14} className="text-rose-400" /> Video <span className="text-[10px] font-mono text-rose-400 font-bold">({legendStats.videos})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.products} terms have Products or Tools`}>
                            <ShoppingCart size={14} className="text-amber-400" /> Products <span className="text-[10px] font-mono text-amber-400 font-bold">({legendStats.products})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.websites} terms have Authority Websites`}>
                            <Globe size={14} className="text-blue-400" /> Website <span className="text-[10px] font-mono text-blue-400 font-bold">({legendStats.websites})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.podcasts} terms have Podcasts`}>
                            <Mic size={14} className="text-sky-400" /> Podcast <span className="text-[10px] font-mono text-sky-400 font-bold">({legendStats.podcasts})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.caseStudies} terms have Case Studies`}>
                            <FileText size={14} className="text-emerald-400" /> Case Study <span className="text-[10px] font-mono text-emerald-400 font-bold">({legendStats.caseStudies})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.aiPrompts} terms have AI Prompts`}>
                            <Lightbulb size={14} className="text-indigo-400" /> AI Prompts <span className="text-[10px] font-mono text-indigo-400 font-bold">({legendStats.aiPrompts})</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200" title={`${legendStats.aeoFaqs} terms have AEO Summaries or FAQs`}>
                            <Sparkles size={14} className="text-purple-400" /> AEO / FAQs <span className="text-[10px] font-mono text-purple-400 font-bold">({legendStats.aeoFaqs})</span>
                        </div>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="min-w-full divide-y divide-slate-800">
                            <thead className="bg-slate-950">
                                <tr>
                                    <th className="pl-4 pr-2 py-4 w-10">
                                        <button onClick={toggleSelectAll} className="text-slate-400 hover:text-white transition-colors">
                                            {allPageSelected ? <CheckSquare size={18} className="text-cyan-400" /> : <Square size={18} />}
                                        </button>
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Term</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Views</th>
                                    <th className="px-6 py-4 text-left text-xs font-extrabold text-slate-300 uppercase tracking-wider">Slug</th>
                                    <th className="px-6 py-4 text-right text-xs font-extrabold text-slate-300 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-950 divide-y divide-slate-800/80">
                                {paginatedTerms.map(term => (
                                    <tr key={term.id} className={selectedIds.has(term.id) ? 'bg-rose-950/40' : 'hover:bg-slate-900/60 transition'}>
                                        <td className="pl-4 pr-2 py-4">
                                            <button onClick={() => toggleSelect(term.id)} className="text-slate-400 hover:text-white transition-colors">
                                                {selectedIds.has(term.id) ? <CheckSquare size={16} className="text-rose-400" /> : <Square size={16} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="text-sm font-extrabold text-slate-100">{term.term}</div>
                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    {term.imageUrl && <span title="Image Available"><ImageIcon size={12} className="text-cyan-400" /></span>}
                                                    {term.videoUrl && <span title="Video Available"><Video size={12} className="text-rose-400" /></span>}
                                                    {((term.amazonProducts && term.amazonProducts.length > 0) || (term.recommendedTools && term.recommendedTools.length > 0)) && (
                                                        <span title="Has Products/Tools"><ShoppingCart size={12} className="text-amber-400" /></span>
                                                    )}
                                                    {term.websitesRanking && term.websitesRanking.length > 0 && <span title="Has Authority Sites"><Globe size={12} className="text-blue-400" /></span>}
                                                    {term.podcastsRanking && term.podcastsRanking.length > 0 && <span title="Has Podcasts"><Mic size={12} className="text-sky-400" /></span>}
                                                    {term.caseStudies && term.caseStudies.length > 0 && <span title="Has Case Studies"><FileText size={12} className="text-emerald-400" /></span>}
                                                    {((term.youtubeTitles && term.youtubeTitles.length > 0) || (term.pinterestIdeas && term.pinterestIdeas.length > 0) || (term.instagramIdeas && term.instagramIdeas.length > 0) || term.imagePrompt || term.productPrompt || term.socialPrompt) && (
                                                        <span title="Has AI Prompts"><Lightbulb size={12} className="text-indigo-400" /></span>
                                                    )}
                                                    {((term.faqs && term.faqs.length > 0) || (term.questionVariations && term.questionVariations.length > 0) || term.aeoSummary) && (
                                                        <span title="Has AEO Summary / FAQs"><Sparkles size={12} className="text-purple-400" /></span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="text-xs text-slate-400 truncate max-w-xs mt-0.5">{term.shortDefinition}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className="bg-slate-900 border border-slate-800 text-cyan-300 px-2.5 py-1 rounded-xl text-[10px] font-mono font-bold uppercase">{term.category}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-mono font-bold text-slate-200">{(term as any).views || 0}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-mono bg-slate-900 border border-slate-800 text-cyan-400 px-2 py-1 rounded-xl">/glossary/{term.slug}</span>
                                                <button onClick={() => { navigator.clipboard.writeText(`${window.location.origin}/glossary/${term.slug}`); alert('Copied link!'); }} className="text-slate-400 hover:text-white" title="Copy Link">
                                                    <Copy size={12} />
                                                </button>
                                                <Link href={`/glossary/${term.slug}`} target="_blank" className="text-slate-400 hover:text-emerald-400 transition-colors" title="Visit Page">
                                                    <ExternalLink size={12} />
                                                </Link>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                                            <button
                                                onClick={() => { setEditingTerm(term); setView('edit'); }}
                                                className="p-2 bg-slate-950 border border-slate-800 hover:border-cyan-500 text-slate-300 hover:text-white rounded-xl transition mr-2"
                                                title="Edit Term"
                                            >
                                                <Edit size={14} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(term.id)}
                                                className="p-2 bg-slate-950 border border-slate-800 hover:border-rose-500 text-slate-400 hover:text-rose-400 rounded-xl transition"
                                                title="Delete Term"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                                {paginatedTerms.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-12 text-center text-slate-400 font-mono font-bold uppercase text-xs tracking-widest">No terms found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between border-t border-slate-800 pt-4 gap-4">
                            <p className="text-xs font-mono text-slate-400">
                                Showing <strong className="text-slate-200">{(currentPage - 1) * itemsPerPage + 1}–{Math.min(currentPage * itemsPerPage, filteredTerms.length)}</strong> of <strong className="text-slate-200">{filteredTerms.length}</strong> terms
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                                    let page: number;
                                    if (totalPages <= 7) page = i + 1;
                                    else if (currentPage <= 4) page = i + 1;
                                    else if (currentPage >= totalPages - 3) page = totalPages - 6 + i;
                                    else page = currentPage - 3 + i;
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => setCurrentPage(page)}
                                            className={`w-9 h-9 rounded-xl border text-xs font-mono font-bold transition-all ${
                                                currentPage === page
                                                    ? 'bg-cyan-600 text-white border-cyan-500 shadow-md'
                                                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white hover:bg-slate-800'
                                            }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                })}
                                <button
                                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}

            {view === 'performance' && (
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                        <div>
                            <h3 className="text-xl font-black text-slate-100 uppercase tracking-tight">Performance & AEO Readiness Analytics</h3>
                            <p className="text-xs font-mono text-slate-400">Track organic search views, deep pathway clicks, and AEO AI-citation readiness across all concepts.</p>
                        </div>
                        <button
                            onClick={() => setView('list')}
                            className="px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition"
                        >
                            <ArrowLeft size={16} /> Back to Standard List
                        </button>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-slate-800">
                        <table className="min-w-full divide-y divide-slate-800 font-mono text-xs">
                            <thead className="bg-slate-950 text-slate-300 uppercase">
                                <tr>
                                    <th className="px-6 py-4 text-left font-extrabold">Term & Entity</th>
                                    <th className="px-6 py-4 text-left font-extrabold">Views</th>
                                    <th className="px-6 py-4 text-left font-extrabold">Pathway Clicks</th>
                                    <th className="px-6 py-4 text-left font-extrabold">AEO Direct Answer</th>
                                    <th className="px-6 py-4 text-left font-extrabold">Intent Variations</th>
                                    <th className="px-6 py-4 text-left font-extrabold">Readiness Score</th>
                                </tr>
                            </thead>
                            <tbody className="bg-slate-950 divide-y divide-slate-800/80">
                                {initialTerms.map((term: any) => {
                                    const hasAeo = Boolean(term.aeoSummary || term.shortDefinition);
                                    const hasQuestions = Boolean(term.questionVariations && term.questionVariations.length > 0);
                                    const hasScenario = Boolean(term.realWorldScenario?.stepByStep && term.realWorldScenario.stepByStep.length > 0);
                                    const hasPathways = Boolean(term.deepPathways && term.deepPathways.length > 0);

                                    let score = 0;
                                    if (hasAeo) score += 30;
                                    if (hasQuestions) score += 25;
                                    if (hasScenario) score += 25;
                                    if (hasPathways) score += 20;

                                    return (
                                        <tr key={term.id} className="hover:bg-slate-900/60 transition">
                                            <td className="px-6 py-4">
                                                <div className="font-extrabold text-slate-100">{term.term}</div>
                                                <div className="text-[10px] text-cyan-400">{term.entityType || 'Core Concept'} • {term.category}</div>
                                            </td>
                                            <td className="px-6 py-4 font-bold text-slate-200">{term.views || 0}</td>
                                            <td className="px-6 py-4 font-bold text-purple-400">{term.deepLinkClicks || 0}</td>
                                            <td className="px-6 py-4">
                                                {hasAeo ? <span className="text-emerald-400 font-bold">✅ Configured</span> : <span className="text-rose-400">❌ Missing</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="text-slate-300 font-bold">{term.questionVariations?.length || 0} Queries</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-3 py-1 rounded-xl font-bold text-[10px] ${score >= 75 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-amber-950 text-amber-300 border border-amber-800'}`}>
                                                    {score}% Ready
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            </>
            )}

            {(view === 'create' || view === 'edit') && (
                <div>
                     <button
                        onClick={() => { setView('list'); setEditingTerm(undefined); router.push('/admin/glossary', { scroll: false }); }}
                        className="mb-6 px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back to Glossary Terms List
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
                        onClick={() => { setView('list'); router.push('/admin/glossary', { scroll: false }); }}
                        className="mb-6 px-4 py-2 bg-slate-950 border border-slate-800 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-2 transition cursor-pointer"
                    >
                        <ArrowLeft size={16} /> Back to Glossary Terms List
                    </button>
                    <GlossaryImporter />
                </div>
            )}
        </div>
    );
}

