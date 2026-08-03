"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Image, 
    Plus, 
    Search, 
    Filter, 
    Trash2, 
    Pencil, 
    Building2, 
    Star, 
    ExternalLink, 
    Copy, 
    Check,
    Tag,
    Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
} from "@/components/ui/dialog";
import { createSwipe, updateSwipe, deleteSwipe } from "@/lib/actions/competitor-swipe.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const PLATFORMS = [
    "Meta / Facebook", "Instagram", "TikTok", "YouTube", 
    "Google Ads", "Email Newsletter", "Landing Page", "X / Twitter", "LinkedIn"
];

const HOOK_TYPES = [
    "Problem / Solution", "Curiosity", "Urgency / Scarcity", 
    "Price Drop / Deal", "Social Proof / Review", "Disruptive / Controversial", "Feature Highlight"
];

interface AdSwipeClientProps {
    initialSwipes: any[];
    competitors: any[];
}

export function AdSwipeClient({ initialSwipes, competitors }: AdSwipeClientProps) {
    const [swipes, setSwipes] = useState(initialSwipes);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPlatform, setSelectedPlatform] = useState("all");
    const [selectedHook, setSelectedHook] = useState("all");

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingSwipeId, setEditingSwipeId] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const router = useRouter();

    const [formData, setFormData] = useState({
        title: "",
        competitorId: "",
        competitorName: "",
        platform: "Meta / Facebook",
        hookType: "Problem / Solution",
        adCopyText: "",
        mediaUrl: "",
        landingPageUrl: "",
        notes: "",
        rating: 5
    });

    const handleOpenCreate = () => {
        setEditingSwipeId(null);
        setFormData({
            title: "",
            competitorId: "",
            competitorName: "",
            platform: "Meta / Facebook",
            hookType: "Problem / Solution",
            adCopyText: "",
            mediaUrl: "",
            landingPageUrl: "",
            notes: "",
            rating: 5
        });
        setIsAddOpen(true);
    };

    const handleOpenEdit = (swipe: any) => {
        setEditingSwipeId(swipe._id);
        setFormData({
            title: swipe.title || "",
            competitorId: swipe.competitorId || "",
            competitorName: swipe.competitorName || "",
            platform: swipe.platform || "Meta / Facebook",
            hookType: swipe.hookType || "Problem / Solution",
            adCopyText: swipe.adCopyText || "",
            mediaUrl: swipe.mediaUrl || "",
            landingPageUrl: swipe.landingPageUrl || "",
            notes: swipe.notes || "",
            rating: swipe.rating || 5
        });
        setIsAddOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Swipe title is required");
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingSwipeId) {
                const res = await updateSwipe(editingSwipeId, formData);
                if (res.success) {
                    toast.success("Updated ad swipe!");
                    setSwipes(prev => prev.map(s => s._id === editingSwipeId ? res.swipe : s));
                    setIsAddOpen(false);
                    router.refresh();
                } else {
                    toast.error("Failed to update swipe");
                }
            } else {
                const res = await createSwipe(formData);
                if (res.success) {
                    toast.success("Added new ad swipe to vault!");
                    setSwipes(prev => [res.swipe, ...prev]);
                    setIsAddOpen(false);
                    router.refresh();
                } else {
                    toast.error("Failed to add swipe");
                }
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Delete swipe: "${title}"?`)) return;
        try {
            const res = await deleteSwipe(id);
            if (res.success) {
                toast.success("Deleted swipe");
                setSwipes(prev => prev.filter(s => s._id !== id));
                router.refresh();
            } else {
                toast.error("Failed to delete");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const copyText = (text: string, id: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        toast.success("Copied ad copy to clipboard!");
        setTimeout(() => setCopiedId(null), 2000);
    };

    const filteredSwipes = swipes.filter(s => {
        const matchesSearch = 
            s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (s.competitorName && s.competitorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (s.adCopyText && s.adCopyText.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesPlatform = selectedPlatform === "all" || s.platform === selectedPlatform;
        const matchesHook = selectedHook === "all" || s.hookType === selectedHook;

        return matchesSearch && matchesPlatform && matchesHook;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* HERO */}
            <div className="space-y-4">
                <Link href="/tools/competition-black-book" className="inline-flex items-center text-xs font-mono font-bold text-rose-400 hover:text-amber-300 transition">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Competition Black Book
                </Link>

                <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-3 max-w-3xl">
                            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                <Image className="h-4 w-4" /> COMPETITIVE AD & COPY SWIPE VAULT
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase font-mono">
                                Ad & Copy <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-cyan-400 bg-clip-text text-transparent">Swipe Vault</span>
                            </h1>
                            <p className="text-slate-300 text-sm font-mono leading-relaxed">
                                Collect, tag, and model high-converting ads, email copy, landing page headlines, and offer graphics from top market competitors.
                            </p>
                        </div>

                        <Button 
                            onClick={handleOpenCreate}
                            className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-12 px-6 rounded-xl shadow-xl flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <Plus className="h-5 w-5" />
                            + Add Ad Swipe
                        </Button>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl font-mono text-xs">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search swipe title, copy text, competitor..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-100 pl-10 h-10 rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <select 
                        value={selectedPlatform}
                        onChange={e => setSelectedPlatform(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 h-10 rounded-xl px-3 focus:outline-none cursor-pointer"
                    >
                        <option value="all">All Platforms ({swipes.length})</option>
                        {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>

                    <select 
                        value={selectedHook}
                        onChange={e => setSelectedHook(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 h-10 rounded-xl px-3 focus:outline-none cursor-pointer"
                    >
                        <option value="all">All Hook Types</option>
                        {HOOK_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                    </select>
                </div>
            </div>

            {/* SWIPES GALLERY */}
            <div className="space-y-4 font-mono">
                <h2 className="text-lg font-black uppercase text-slate-100 tracking-tight flex items-center gap-2">
                    <Image className="h-5 w-5 text-rose-400" />
                    Saved Competitive Swipes ({filteredSwipes.length})
                </h2>

                {filteredSwipes.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl space-y-3">
                        <Image className="h-12 w-12 text-slate-600 mx-auto" />
                        <h3 className="text-base font-bold text-slate-200">No Ad Swipes Saved Yet</h3>
                        <p className="text-xs text-slate-400 max-w-md mx-auto">
                            Click <span className="text-rose-400 font-bold">+ Add Ad Swipe</span> to capture high-converting ads and email copy.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSwipes.map(swipe => (
                            <div key={swipe._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-rose-500/50 transition">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold text-rose-400 bg-rose-950 border border-rose-800 px-2.5 py-0.5 rounded-full uppercase">
                                            {swipe.platform} &bull; {swipe.hookType}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => handleOpenEdit(swipe)} className="p-1 text-slate-400 hover:text-amber-300 transition">
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            <button onClick={() => handleDelete(swipe._id, swipe.title)} className="p-1 text-slate-400 hover:text-rose-400 transition">
                                                <Trash2 className="h-3.5 w-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-100">{swipe.title}</h3>

                                    {swipe.competitorName && (
                                        <div className="text-xs text-slate-400 flex items-center gap-1.5">
                                            <Building2 className="h-3.5 w-3.5 text-amber-400" />
                                            <span>Competitor: <strong className="text-slate-200">{swipe.competitorName}</strong></span>
                                        </div>
                                    )}

                                    {/* OPTIONAL IMAGE PREVIEW */}
                                    {swipe.mediaUrl && (
                                        <div className="rounded-xl overflow-hidden border border-slate-800 max-h-48 bg-slate-950 flex items-center justify-center">
                                            <img src={swipe.mediaUrl} alt={swipe.title} className="w-full h-full object-cover" />
                                        </div>
                                    )}

                                    {swipe.adCopyText && (
                                        <p className="text-xs text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850 line-clamp-4 whitespace-pre-wrap">
                                            {swipe.adCopyText}
                                        </p>
                                    )}
                                </div>

                                <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                                    {swipe.landingPageUrl ? (
                                        <a href={swipe.landingPageUrl.startsWith('http') ? swipe.landingPageUrl : `https://${swipe.landingPageUrl}`} target="_blank" rel="noopener noreferrer" className="text-amber-400 hover:underline flex items-center gap-1 font-bold text-[11px]">
                                            <Globe className="h-3 w-3" /> Visit Landing Page <ExternalLink className="h-2.5 w-2.5" />
                                        </a>
                                    ) : <span className="text-[11px] text-slate-500">No URL</span>}

                                    {swipe.adCopyText && (
                                        <Button 
                                            onClick={() => copyText(swipe.adCopyText, swipe._id)}
                                            size="sm"
                                            variant="ghost"
                                            className="text-xs text-rose-400 hover:text-rose-300 p-0 h-auto font-bold"
                                        >
                                            {copiedId === swipe._id ? <Check className="h-3.5 w-3.5 mr-1" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                                            Copy Copy
                                        </Button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* ADD / EDIT DIALOG */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl font-sans">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100">
                            {editingSwipeId ? "Edit Ad Swipe" : "+ Add Ad & Copy Swipe to Vault"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-mono text-xs">
                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Swipe Title *</label>
                            <Input 
                                required
                                placeholder="e.g. Scaled FB Video Ad - 'Stop Paying $50/mo for CRM'" 
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Competitor</label>
                                <select 
                                    value={formData.competitorId}
                                    onChange={e => {
                                        const comp = competitors.find(c => c._id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            competitorId: e.target.value,
                                            competitorName: comp ? comp.name : ""
                                        });
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                >
                                    <option value="">-- Optional --</option>
                                    {competitors.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Platform</label>
                                <select 
                                    value={formData.platform}
                                    onChange={e => setFormData({ ...formData, platform: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                >
                                    {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Hook Type</label>
                                <select 
                                    value={formData.hookType}
                                    onChange={e => setFormData({ ...formData, hookType: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                >
                                    {HOOK_TYPES.map(h => <option key={h} value={h}>{h}</option>)}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Media / Image Screenshot URL (Optional)</label>
                            <Input 
                                placeholder="https://example.com/ad-screenshot.jpg" 
                                value={formData.mediaUrl}
                                onChange={e => setFormData({ ...formData, mediaUrl: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Landing Page URL (Optional)</label>
                            <Input 
                                placeholder="https://competitor.com/special-offer" 
                                value={formData.landingPageUrl}
                                onChange={e => setFormData({ ...formData, landingPageUrl: e.target.value })}
                                className="bg-slate-950 border-slate-800"
                            />
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Ad Copy / Script Text</label>
                            <textarea 
                                rows={5}
                                placeholder="Paste full ad text, headline, email body, or video script..." 
                                value={formData.adCopyText}
                                onChange={e => setFormData({ ...formData, adCopyText: e.target.value })}
                                className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-3 rounded-xl focus:outline-none resize-y leading-relaxed"
                            />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-rose-600 hover:bg-rose-500 text-white font-bold uppercase">
                                {isSubmitting ? "Saving..." : (editingSwipeId ? "Save Changes" : "+ Save to Vault")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

        </div>
    );
}
