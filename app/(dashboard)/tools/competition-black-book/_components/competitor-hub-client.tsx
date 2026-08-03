"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ShieldAlert, 
    Plus, 
    Search, 
    Globe, 
    MapPin, 
    Building2, 
    Phone, 
    Mail, 
    Key, 
    Sparkles, 
    ExternalLink, 
    ArrowRight, 
    Lightbulb, 
    BarChart3, 
    CheckCircle2, 
    Trash2, 
    Tag
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
import { createCompetitor, deleteCompetitor } from "@/lib/actions/competitor.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface CompetitorHubClientProps {
    initialCompetitors: any[];
    initialIdeas: any[];
}

export function CompetitorHubClient({ initialCompetitors, initialIdeas }: CompetitorHubClientProps) {
    const [competitors, setCompetitors] = useState(initialCompetitors);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedNiche, setSelectedNiche] = useState("all");
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    // Form state for creating a new competitor
    const [formData, setFormData] = useState({
        name: "",
        webAddress: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        country: "",
        phone: "",
        fax: "",
        email: "",
        nicheMarket: "",
        primaryKeyword: "",
        notes: "",
        logoUrl: ""
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            toast.error("Competitor name is required");
            return;
        }

        try {
            setIsSubmitting(true);
            const res = await createCompetitor(formData);
            if (res.success) {
                toast.success(`Created competitor: ${formData.name}`);
                setIsAddOpen(false);
                setFormData({
                    name: "",
                    webAddress: "",
                    address: "",
                    city: "",
                    state: "",
                    zip: "",
                    country: "",
                    phone: "",
                    fax: "",
                    email: "",
                    nicheMarket: "",
                    primaryKeyword: "",
                    notes: "",
                    logoUrl: ""
                });
                router.refresh();
            } else {
                toast.error(res.error || "Failed to create competitor");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}? All associated intelligence data will be lost.`)) return;

        try {
            const res = await deleteCompetitor(id);
            if (res.success) {
                toast.success("Competitor deleted");
                setCompetitors(prev => prev.filter(c => c._id !== id));
                router.refresh();
            } else {
                toast.error("Failed to delete competitor");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    // Filter niches
    const niches = Array.from(new Set(competitors.map(c => c.nicheMarket).filter(Boolean)));

    const filteredCompetitors = competitors.filter(c => {
        const matchesSearch = 
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.webAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.nicheMarket.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.primaryKeyword.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesNiche = selectedNiche === "all" || c.nicheMarket === selectedNiche;

        return matchesSearch && matchesNiche;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* HERO HEADER */}
            <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                    <div className="space-y-3 max-w-3xl">
                        <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            <ShieldAlert className="h-4 w-4" /> COMPETITION BLACK BOOK
                        </span>
                        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase font-mono">
                            Ethical Intelligence & <span className="bg-gradient-to-r from-rose-400 via-amber-400 to-orange-400 bg-clip-text text-transparent">Counter-Strategy Suite</span>
                        </h1>
                        <p className="text-slate-300 text-sm font-mono leading-relaxed">
                            Collect, analyze, and ethically spy on competitors across 33 intelligence categories. Uncover why customers buy from them, locate market gaps, generate AI marketing prompts, and execute counter-strategies.
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
                        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                            <DialogTrigger asChild>
                                <Button className="bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-12 px-6 rounded-xl shadow-xl flex items-center gap-2 cursor-pointer">
                                    <Plus className="h-5 w-5" />
                                    Add Competitor
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-2xl max-h-[90vh] overflow-y-auto font-sans">
                                <DialogHeader>
                                    <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100 flex items-center gap-2">
                                        <Building2 className="h-5 w-5 text-rose-400" />
                                        Create New Competitor Profile
                                    </DialogTitle>
                                    <DialogDescription className="text-xs font-mono text-slate-400">
                                        Enter baseline contact and market details to unlock the 33-module intelligence dashboard.
                                    </DialogDescription>
                                </DialogHeader>

                                <form onSubmit={handleCreate} className="space-y-4 pt-2">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Competitor Name *</label>
                                            <Input 
                                                required
                                                placeholder="e.g. Acme Corp" 
                                                value={formData.name}
                                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Web Address (URL)</label>
                                            <Input 
                                                placeholder="https://competitor.com" 
                                                value={formData.webAddress}
                                                onChange={e => setFormData({ ...formData, webAddress: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Niche Market</label>
                                            <Input 
                                                placeholder="e.g. High-Ticket SaaS / Pet Supplies" 
                                                value={formData.nicheMarket}
                                                onChange={e => setFormData({ ...formData, nicheMarket: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Primary Target Keyword</label>
                                            <Input 
                                                placeholder="e.g. Best Dog Training Software" 
                                                value={formData.primaryKeyword}
                                                onChange={e => setFormData({ ...formData, primaryKeyword: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Phone Number</label>
                                            <Input 
                                                placeholder="+1 (555) 000-0000" 
                                                value={formData.phone}
                                                onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Fax Number</label>
                                            <Input 
                                                placeholder="+1 (555) 000-0001" 
                                                value={formData.fax}
                                                onChange={e => setFormData({ ...formData, fax: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Email Address</label>
                                            <Input 
                                                placeholder="support@competitor.com" 
                                                value={formData.email}
                                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Physical Address</label>
                                        <Input 
                                            placeholder="Street address of corporate HQ" 
                                            value={formData.address}
                                            onChange={e => setFormData({ ...formData, address: e.target.value })}
                                            className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">City</label>
                                            <Input 
                                                placeholder="City" 
                                                value={formData.city}
                                                onChange={e => setFormData({ ...formData, city: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">State / Region</label>
                                            <Input 
                                                placeholder="State" 
                                                value={formData.state}
                                                onChange={e => setFormData({ ...formData, state: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Zip Code</label>
                                            <Input 
                                                placeholder="Zip" 
                                                value={formData.zip}
                                                onChange={e => setFormData({ ...formData, zip: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Country</label>
                                            <Input 
                                                placeholder="Country" 
                                                value={formData.country}
                                                onChange={e => setFormData({ ...formData, country: e.target.value })}
                                                className="bg-slate-950 border-slate-800 text-slate-100 font-mono text-xs h-10 rounded-xl"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-mono font-bold text-slate-300 mb-1">Initial Notes</label>
                                        <textarea 
                                            rows={3}
                                            placeholder="Initial observations or reasons for tracking..." 
                                            value={formData.notes}
                                            onChange={e => setFormData({ ...formData, notes: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-800 text-slate-100 font-mono text-xs p-3 rounded-xl focus:outline-none resize-none"
                                        />
                                    </div>

                                    <div className="pt-2 flex justify-end gap-3">
                                        <Button 
                                            type="button"
                                            variant="ghost"
                                            onClick={() => setIsAddOpen(false)}
                                            className="text-slate-400 font-mono text-xs hover:bg-slate-800"
                                        >
                                            Cancel
                                        </Button>
                                        <Button 
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="bg-rose-600 hover:bg-rose-500 text-white font-mono text-xs font-bold uppercase px-6"
                                        >
                                            {isSubmitting ? "Creating..." : "Create Competitor Profile"}
                                        </Button>
                                    </div>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Link href="/tools/competition-black-book/ideas">
                            <Button variant="outline" className="w-full sm:w-auto bg-slate-900 border-slate-800 text-amber-400 hover:text-amber-300 hover:bg-slate-800 font-mono text-xs font-bold uppercase h-12 px-5 rounded-xl flex items-center gap-2 cursor-pointer">
                                <Lightbulb className="h-4 w-4" />
                                Idea Pipeline ({initialIdeas.length})
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* METRICS BAR */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80">
                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Tracked Competitors</span>
                        <div className="text-2xl font-black font-mono text-rose-400 mt-1">{competitors.length}</div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Intelligence Modules</span>
                        <div className="text-2xl font-black font-mono text-amber-400 mt-1">33 Categories</div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">Counter-Ideas Logged</span>
                        <div className="text-2xl font-black font-mono text-emerald-400 mt-1">{initialIdeas.length}</div>
                    </div>

                    <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                        <span className="text-[10px] font-mono font-bold uppercase text-slate-400">AI Prompt Generator</span>
                        <div className="text-2xl font-black font-mono text-cyan-400 mt-1 flex items-center gap-1">
                            <Sparkles className="h-5 w-5" /> Ready
                        </div>
                    </div>
                </div>
            </div>

            {/* SEARCH & FILTERS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search competitor name, URL, keyword..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-100 pl-10 font-mono text-xs h-10 rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {niches.length > 0 && (
                        <select 
                            value={selectedNiche}
                            onChange={e => setSelectedNiche(e.target.value)}
                            className="bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs h-10 rounded-xl px-3 focus:outline-none"
                        >
                            <option value="all">All Niches ({competitors.length})</option>
                            {niches.map(niche => (
                                <option key={niche} value={niche}>{niche}</option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            {/* COMPETITORS GRID */}
            <div className="space-y-4">
                <h2 className="text-lg font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                    <Building2 className="h-5 w-5 text-rose-400" />
                    Competitor Intelligence Vault ({filteredCompetitors.length})
                </h2>

                {filteredCompetitors.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl space-y-4">
                        <Building2 className="h-12 w-12 text-slate-600 mx-auto" />
                        <div className="max-w-md mx-auto space-y-1">
                            <h3 className="text-lg font-bold font-mono text-slate-200">No Competitors Found</h3>
                            <p className="text-xs font-mono text-slate-400">
                                Click <span className="text-rose-400 font-bold">+ Add Competitor</span> above to start tracking competitor intelligence and market gaps.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCompetitors.map((competitor) => {
                            const completedModulesCount = Object.keys(competitor.modulesData || {}).filter(k => {
                                const val = competitor.modulesData[k];
                                return val && Object.keys(val).length > 0;
                            }).length;

                            return (
                                <div key={competitor._id} className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5 flex flex-col justify-between hover:border-rose-500/50 transition-all group">
                                    <div className="space-y-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-rose-500/20 to-amber-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400 font-black font-mono text-lg shrink-0">
                                                    {competitor.name.slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <h3 className="text-base font-black text-slate-100 group-hover:text-rose-400 transition-colors font-mono">
                                                        {competitor.name}
                                                    </h3>
                                                    {competitor.webAddress && (
                                                        <a 
                                                            href={competitor.webAddress.startsWith('http') ? competitor.webAddress : `https://${competitor.webAddress}`} 
                                                            target="_blank" 
                                                            rel="noopener noreferrer"
                                                            className="text-xs font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1"
                                                        >
                                                            <Globe className="h-3 w-3" />
                                                            {competitor.webAddress.replace(/^https?:\/\//, '')}
                                                            <ExternalLink className="h-2.5 w-2.5" />
                                                        </a>
                                                    )}
                                                </div>
                                            </div>

                                            <button 
                                                onClick={() => handleDelete(competitor._id, competitor.name)}
                                                className="p-1.5 text-slate-600 hover:text-rose-400 rounded-lg transition opacity-0 group-hover:opacity-100 cursor-pointer"
                                                title="Delete Competitor"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>

                                        {/* TAGS & METADATA */}
                                        <div className="space-y-2 pt-1 font-mono text-xs">
                                            {competitor.nicheMarket && (
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Tag className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                                                    <span className="truncate">{competitor.nicheMarket}</span>
                                                </div>
                                            )}

                                            {competitor.primaryKeyword && (
                                                <div className="flex items-center gap-2 text-slate-300">
                                                    <Key className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
                                                    <span className="truncate">{competitor.primaryKeyword}</span>
                                                </div>
                                            )}

                                            {(competitor.city || competitor.country) && (
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <MapPin className="h-3.5 w-3.5 text-rose-400 shrink-0" />
                                                    <span className="truncate">
                                                        {[competitor.city, competitor.state, competitor.country].filter(Boolean).join(", ")}
                                                    </span>
                                                </div>
                                            )}
                                        </div>

                                        {/* INTEL MODULES PROGRESS */}
                                        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-3.5 space-y-2">
                                            <div className="flex items-center justify-between text-[11px] font-mono">
                                                <span className="text-slate-400">Intelligence Progress</span>
                                                <span className="text-amber-400 font-bold">{completedModulesCount} / 33 Modules</span>
                                            </div>
                                            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                                                <div 
                                                    className="bg-gradient-to-r from-rose-500 to-amber-400 h-full rounded-full transition-all"
                                                    style={{ width: `${Math.min(100, Math.round((completedModulesCount / 33) * 100))}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-2">
                                        <Link href={`/tools/competition-black-book/${competitor._id}`}>
                                            <Button className="w-full bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/50 text-slate-100 font-mono text-xs font-bold uppercase h-11 rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer">
                                                Open Intel Dashboard
                                                <ArrowRight className="h-4 w-4 text-rose-400" />
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

        </div>
    );
}
