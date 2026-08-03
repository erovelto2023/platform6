"use client";

import { useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Lightbulb, 
    Plus, 
    Search, 
    Filter, 
    Trash2, 
    Pencil, 
    Building2, 
    Sparkles, 
    CheckCircle2, 
    Clock, 
    AlertTriangle, 
    TrendingUp, 
    BarChart3, 
    Layers, 
    Tag,
    Archive,
    ArchiveRestore,
    Eye,
    ExternalLink,
    DollarSign,
    Target,
    Zap,
    Shield
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
import { createIdea, updateIdea, deleteIdea } from "@/lib/actions/idea-pipeline.actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const CATEGORIES = [
    "Products", "Features", "Improvements", "Marketing", "Content", "SEO", 
    "Social Media", "Sales", "Pricing", "Customer Experience", "Community", 
    "Brand", "Partnerships", "AI Opportunities", "Automation", "Revenue", 
    "Competitive Advantages", "Customer Pain Points", "Expansion", "Experiments", 
    "Research", "Operations", "Legal & Trust"
];

const OPPORTUNITY_TYPES = [
    "Copy", "Improve", "Differentiate", "Innovate", "Disrupt", "Automate", 
    "Simplify", "Bundle", "Unbundle", "Premiumize", "Reduce Cost", "Increase Speed", 
    "Increase Trust", "Increase Convenience", "Increase Value", "Fill Market Gap", 
    "Expand Audience", "Enter New Market", "Add AI", "Replace Existing Tool", 
    "Build Alternative", "Solve Complaint", "Solve Missing Feature", "Niche Down", "Scale Up"
];

const DEFAULT_FORM_DATA = {
    title: "",
    competitorId: "",
    competitorName: "",
    category: "Products",
    opportunityType: "Innovate",
    relatedProductOrFeature: "",
    problemIdentified: "",
    proposedSolution: "",
    targetAudience: "",
    customerBenefit: "",
    estimatedEffort: 5,
    estimatedCost: "",
    estimatedTimeToBuild: "",
    estimatedRevenuePotential: "",
    strategicImpact: 5,
    confidenceLevel: 5,
    priority: "Medium",
    status: "Backlog",
    owner: "",
    dueDate: "",
    dependencies: "",
    notes: "",
    links: "",
    successMetrics: "",
    validationEvidence: "",
    risks: "",
    nextAction: ""
};

interface IdeaPipelineClientProps {
    initialIdeas: any[];
    competitors: any[];
}

export function IdeaPipelineClient({ initialIdeas, competitors }: IdeaPipelineClientProps) {
    const [ideas, setIdeas] = useState(initialIdeas);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedStatus, setSelectedStatus] = useState("active"); // "active", "archived", "all"

    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingIdeaId, setEditingIdeaId] = useState<string | null>(null);
    const [viewingIdea, setViewingIdea] = useState<any | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const router = useRouter();

    const [formData, setFormData] = useState(DEFAULT_FORM_DATA);

    const handleOpenCreate = () => {
        setEditingIdeaId(null);
        setFormData(DEFAULT_FORM_DATA);
        setIsAddOpen(true);
    };

    const handleOpenEdit = (idea: any) => {
        setEditingIdeaId(idea._id);
        setFormData({
            title: idea.title || "",
            competitorId: idea.competitorId || "",
            competitorName: idea.competitorName || "",
            category: idea.category || "Products",
            opportunityType: idea.opportunityType || "Innovate",
            relatedProductOrFeature: idea.relatedProductOrFeature || "",
            problemIdentified: idea.problemIdentified || "",
            proposedSolution: idea.proposedSolution || "",
            targetAudience: idea.targetAudience || "",
            customerBenefit: idea.customerBenefit || "",
            estimatedEffort: idea.estimatedEffort || 5,
            estimatedCost: idea.estimatedCost || "",
            estimatedTimeToBuild: idea.estimatedTimeToBuild || "",
            estimatedRevenuePotential: idea.estimatedRevenuePotential || "",
            strategicImpact: idea.strategicImpact || 5,
            confidenceLevel: idea.confidenceLevel || 5,
            priority: idea.priority || "Medium",
            status: idea.status || "Backlog",
            owner: idea.owner || "",
            dueDate: idea.dueDate || "",
            dependencies: idea.dependencies || "",
            notes: idea.notes || "",
            links: idea.links || "",
            successMetrics: idea.successMetrics || "",
            validationEvidence: idea.validationEvidence || "",
            risks: idea.risks || "",
            nextAction: idea.nextAction || ""
        });
        setIsAddOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title.trim()) {
            toast.error("Idea title is required");
            return;
        }

        try {
            setIsSubmitting(true);
            if (editingIdeaId) {
                const res = await updateIdea(editingIdeaId, formData);
                if (res.success) {
                    toast.success("Updated counter-idea!");
                    setIdeas(prev => prev.map(i => i._id === editingIdeaId ? res.idea : i));
                    setIsAddOpen(false);
                    setEditingIdeaId(null);
                    router.refresh();
                } else {
                    toast.error("Failed to update idea");
                }
            } else {
                const res = await createIdea(formData);
                if (res.success) {
                    toast.success("Created counter-idea!");
                    setIdeas(prev => [res.idea, ...prev]);
                    setIsAddOpen(false);
                    setFormData(DEFAULT_FORM_DATA);
                    router.refresh();
                } else {
                    toast.error("Failed to create idea");
                }
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string, title: string) => {
        if (!confirm(`Are you sure you want to permanently delete: "${title}"?`)) return;
        try {
            const res = await deleteIdea(id);
            if (res.success) {
                toast.success("Idea deleted");
                setIdeas(prev => prev.filter(i => i._id !== id));
                if (viewingIdea?._id === id) setViewingIdea(null);
                router.refresh();
            } else {
                toast.error("Failed to delete idea");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleToggleArchive = async (idea: any) => {
        const newStatus = idea.status === "Archived" ? "Backlog" : "Archived";
        try {
            const res = await updateIdea(idea._id, { status: newStatus });
            if (res.success) {
                toast.success(newStatus === "Archived" ? "Archived idea" : "Restored idea to Backlog");
                setIdeas(prev => prev.map(i => i._id === idea._id ? res.idea : i));
                router.refresh();
            } else {
                toast.error("Failed to update status");
            }
        } catch {
            toast.error("Something went wrong");
        }
    };

    const handleStatusChange = async (id: string, newStatus: string) => {
        try {
            const res = await updateIdea(id, { status: newStatus });
            if (res.success) {
                toast.success(`Updated status to ${newStatus}`);
                setIdeas(prev => prev.map(i => i._id === id ? { ...i, status: newStatus } : i));
                router.refresh();
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    const activeCount = ideas.filter(i => i.status !== "Archived").length;
    const archivedCount = ideas.filter(i => i.status === "Archived").length;

    const filteredIdeas = ideas.filter(i => {
        const matchesSearch = 
            i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (i.competitorName && i.competitorName.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (i.proposedSolution && i.proposedSolution.toLowerCase().includes(searchQuery.toLowerCase())) ||
            (i.notes && i.notes.toLowerCase().includes(searchQuery.toLowerCase()));

        const matchesCat = selectedCategory === "all" || i.category === selectedCategory;

        let matchesStat = true;
        if (selectedStatus === "active") matchesStat = i.status !== "Archived";
        else if (selectedStatus === "archived") matchesStat = i.status === "Archived";
        else if (selectedStatus === "leaderboard") matchesStat = i.status !== "Archived";
        else if (selectedStatus !== "all") matchesStat = i.status === selectedStatus;

        return matchesSearch && matchesCat && matchesStat;
    }).sort((a, b) => {
        if (selectedStatus === "leaderboard") {
            const scoreA = ((a.strategicImpact || 5) * (a.confidenceLevel || 5)) / (a.estimatedEffort || 5);
            const scoreB = ((b.strategicImpact || 5) * (b.confidenceLevel || 5)) / (b.estimatedEffort || 5);
            return scoreB - scoreA; // Descending score
        }
        return 0;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            
            {/* TOP NAVIGATION & HERO */}
            <div className="space-y-4">
                <Link href="/tools/competition-black-book" className="inline-flex items-center text-xs font-mono font-bold text-amber-400 hover:text-amber-300 transition">
                    <ArrowLeft className="h-4 w-4 mr-1.5" />
                    Back to Competition Black Book
                </Link>

                <div className="relative rounded-3xl p-8 md:p-10 overflow-hidden border border-slate-800 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 shadow-2xl space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                        <div className="space-y-3 max-w-3xl">
                            <span className="inline-flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-widest px-3.5 py-1.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                                <Lightbulb className="h-4 w-4" /> COMPETITIVE IDEA PIPELINE & INNOVATION MATRIX
                            </span>
                            <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-100 uppercase font-mono">
                                Counter-Idea <span className="bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">Pipeline</span>
                            </h1>
                            <p className="text-slate-300 text-sm font-mono leading-relaxed">
                                Log, edit, score, and track competitive counter-ideas across 23+ categories. Manage ideas from concept to launch, archive completed projects, and execute market-dominating strategies.
                            </p>
                        </div>

                        <Button 
                            onClick={handleOpenCreate}
                            className="bg-gradient-to-r from-amber-500 to-emerald-500 hover:from-amber-400 hover:to-emerald-400 text-slate-950 font-black font-mono text-xs uppercase tracking-wider h-12 px-6 rounded-xl shadow-xl flex items-center gap-2 cursor-pointer shrink-0"
                        >
                            <Plus className="h-5 w-5" />
                            Log New Counter-Idea
                        </Button>
                    </div>

                    {/* METRICS BAR */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800/80 font-mono">
                        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Active Ideas</span>
                            <div className="text-2xl font-black text-amber-400 mt-1">{activeCount}</div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Archived / Done</span>
                            <div className="text-2xl font-black text-slate-400 mt-1">{archivedCount}</div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                            <span className="text-[10px] font-bold uppercase text-slate-400">In Progress</span>
                            <div className="text-2xl font-black text-emerald-400 mt-1">
                                {ideas.filter(i => i.status === "In Progress" || i.status === "Testing").length}
                            </div>
                        </div>

                        <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4">
                            <span className="text-[10px] font-bold uppercase text-slate-400">Total Innovation Log</span>
                            <div className="text-2xl font-black text-cyan-400 mt-1">{ideas.length}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-400" />
                    <Input 
                        placeholder="Search idea title, competitor, solution..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        className="bg-slate-950 border-slate-800 text-slate-100 pl-10 font-mono text-xs h-10 rounded-xl"
                    />
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
                    <select 
                        value={selectedCategory}
                        onChange={e => setSelectedCategory(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs h-10 rounded-xl px-3 focus:outline-none cursor-pointer"
                    >
                        <option value="all">All Categories ({ideas.length})</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>

                    <select 
                        value={selectedStatus}
                        onChange={e => setSelectedStatus(e.target.value)}
                        className="bg-slate-950 border border-slate-800 text-slate-200 font-mono text-xs h-10 rounded-xl px-3 focus:outline-none cursor-pointer"
                    >
                        <option value="active">Active Ideas ({activeCount})</option>
                        <option value="leaderboard">⚡ Quick Wins / High-ROI Leaderboard</option>
                        <option value="archived">Archived / Done ({archivedCount})</option>
                        <option value="all">All Statuses ({ideas.length})</option>
                        <option value="Backlog">Backlog</option>
                        <option value="Researching">Researching</option>
                        <option value="Planned">Planned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Testing">Testing</option>
                        <option value="Launched">Launched</option>
                    </select>
                </div>
            </div>

            {/* IDEAS GRID */}
            <div className="space-y-4">
                <h2 className="text-lg font-black font-mono uppercase text-slate-100 tracking-tight flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    Counter-Idea Pipeline ({filteredIdeas.length})
                </h2>

                {filteredIdeas.length === 0 ? (
                    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-12 text-center shadow-xl space-y-3">
                        <Lightbulb className="h-12 w-12 text-slate-600 mx-auto" />
                        <h3 className="text-base font-bold font-mono text-slate-200">No Counter-Ideas Found</h3>
                        <p className="text-xs font-mono text-slate-400 max-w-md mx-auto">
                            Click <span className="text-amber-400 font-bold">+ Log New Counter-Idea</span> above to capture strategies and market opportunities.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredIdeas.map((idea) => {
                            const isArchived = idea.status === "Archived";
                            return (
                                <div key={idea._id} className={`bg-slate-900 border rounded-3xl p-6 shadow-xl space-y-4 flex flex-col justify-between hover:border-amber-500/50 transition-all ${isArchived ? "opacity-70 border-slate-850" : "border-slate-800"}`}>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between gap-2">
                                            <span className="text-[10px] font-mono font-bold text-amber-400 bg-amber-950 border border-amber-800 px-2.5 py-0.5 rounded-full uppercase">
                                                {idea.category} &bull; {idea.opportunityType}
                                            </span>
                                            
                                            <div className="flex items-center gap-1.5">
                                                {/* EDIT BUTTON */}
                                                <button 
                                                    onClick={() => handleOpenEdit(idea)} 
                                                    className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                                    title="Edit Full Idea"
                                                >
                                                    <Pencil className="h-3.5 w-3.5" />
                                                </button>

                                                {/* ARCHIVE BUTTON */}
                                                <button 
                                                    onClick={() => handleToggleArchive(idea)} 
                                                    className={`p-1.5 rounded-lg transition cursor-pointer ${isArchived ? "text-slate-400 hover:text-emerald-400" : "text-slate-400 hover:text-amber-400"}`}
                                                    title={isArchived ? "Unarchive Idea" : "Archive Idea"}
                                                >
                                                    {isArchived ? <ArchiveRestore className="h-3.5 w-3.5" /> : <Archive className="h-3.5 w-3.5" />}
                                                </button>

                                                {/* DELETE BUTTON */}
                                                <button 
                                                    onClick={() => handleDelete(idea._id, idea.title)} 
                                                    className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition cursor-pointer"
                                                    title="Delete Idea"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            </div>
                                        </div>

                                        <h3 className="text-base font-bold font-mono text-slate-100">{idea.title}</h3>

                                        {idea.competitorName && (
                                            <div className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
                                                <Building2 className="h-3.5 w-3.5 text-rose-400" />
                                                <span>Target Competitor: <strong className="text-slate-200">{idea.competitorName}</strong></span>
                                            </div>
                                        )}

                                        {idea.proposedSolution && (
                                            <p className="text-xs font-mono text-slate-300 leading-relaxed bg-slate-950 p-3 rounded-xl border border-slate-850 line-clamp-3">
                                                {idea.proposedSolution}
                                            </p>
                                        )}

                                        {/* SCORING PILLS */}
                                        <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] font-mono text-center">
                                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                                <span className="block text-slate-400">Impact</span>
                                                <strong className="text-amber-400 text-xs">{idea.strategicImpact || 5}/10</strong>
                                            </div>
                                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                                <span className="block text-slate-400">Effort</span>
                                                <strong className="text-rose-400 text-xs">{idea.estimatedEffort || 5}/10</strong>
                                            </div>
                                            <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                                                <span className="block text-slate-400">Confidence</span>
                                                <strong className="text-emerald-400 text-xs">{idea.confidenceLevel || 5}/10</strong>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                                        <Button 
                                            onClick={() => setViewingIdea(idea)}
                                            variant="ghost"
                                            size="sm"
                                            className="text-xs font-mono text-amber-400 hover:text-amber-300 hover:bg-slate-950 p-0 h-auto"
                                        >
                                            <Eye className="h-3.5 w-3.5 mr-1" />
                                            View Details
                                        </Button>

                                        <select 
                                            value={idea.status} 
                                            onChange={e => handleStatusChange(idea._id, e.target.value)}
                                            className="bg-slate-950 border border-slate-800 text-amber-400 font-mono text-xs rounded-lg px-2 py-1 font-bold focus:outline-none cursor-pointer"
                                        >
                                            <option value="Backlog">Backlog</option>
                                            <option value="Researching">Researching</option>
                                            <option value="Planned">Planned</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Testing">Testing</option>
                                            <option value="Launched">Launched</option>
                                            <option value="Archived">Archived</option>
                                        </select>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* CREATE / EDIT IDEA DIALOG */}
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-4xl max-h-[90vh] overflow-y-auto font-sans">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100 flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-amber-400" />
                            {editingIdeaId ? "Edit Counter-Idea Record" : "Log New Counter-Idea Record"}
                        </DialogTitle>
                        <DialogDescription className="text-xs font-mono text-slate-400">
                            Enter idea positioning, market gap, effort estimates, risk analysis, and execution details.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 pt-2 font-mono text-xs">
                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Idea Title *</label>
                            <Input 
                                required
                                placeholder="e.g. Launch 24/7 AI Support Chatbot to outperform Acme Corp" 
                                value={formData.title}
                                onChange={e => setFormData({ ...formData, title: e.target.value })}
                                className="bg-slate-950 border-slate-800 text-sm h-11"
                            />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Link Competitor</label>
                                <select 
                                    value={formData.competitorId}
                                    onChange={e => {
                                        const selectedComp = competitors.find(c => c._id === e.target.value);
                                        setFormData({
                                            ...formData,
                                            competitorId: e.target.value,
                                            competitorName: selectedComp ? selectedComp.name : ""
                                        });
                                    }}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                >
                                    <option value="">-- None (Global Idea) --</option>
                                    {competitors.map(c => (
                                        <option key={c._id} value={c._id}>{c.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Category</label>
                                <select 
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                >
                                    {CATEGORIES.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Opportunity Type</label>
                                <select 
                                    value={formData.opportunityType}
                                    onChange={e => setFormData({ ...formData, opportunityType: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-800 text-slate-100 rounded-xl p-2.5"
                                >
                                    {OPPORTUNITY_TYPES.map(opp => (
                                        <option key={opp} value={opp}>{opp}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Related Product or Feature</label>
                            <Input 
                                placeholder="e.g. Acme Pro Tier / Checkout Page" 
                                value={formData.relatedProductOrFeature} 
                                onChange={e => setFormData({ ...formData, relatedProductOrFeature: e.target.value })} 
                                className="bg-slate-950 border-slate-800" 
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Problem Identified</label>
                                <textarea rows={3} value={formData.problemIdentified} onChange={e => setFormData({ ...formData, problemIdentified: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl" placeholder="What customer pain point or gap did you find?" />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Proposed Solution</label>
                                <textarea rows={3} value={formData.proposedSolution} onChange={e => setFormData({ ...formData, proposedSolution: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2.5 rounded-xl" placeholder="How will your product/campaign solve this better?" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Target Audience</label>
                                <Input placeholder="Who is this specifically for?" value={formData.targetAudience} onChange={e => setFormData({ ...formData, targetAudience: e.target.value })} className="bg-slate-950 border-slate-800" />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Customer Benefit</label>
                                <Input placeholder="Primary benefit customers gain" value={formData.customerBenefit} onChange={e => setFormData({ ...formData, customerBenefit: e.target.value })} className="bg-slate-950 border-slate-800" />
                            </div>
                        </div>

                        {/* SCORING STRIP */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-950 p-4 rounded-2xl border border-slate-800">
                            <div>
                                <label className="block font-bold text-amber-400 mb-1">Strategic Impact (1-10): {formData.strategicImpact}</label>
                                <input type="range" min="1" max="10" value={formData.strategicImpact} onChange={e => setFormData({ ...formData, strategicImpact: Number(e.target.value) })} className="w-full accent-amber-400 cursor-pointer" />
                            </div>

                            <div>
                                <label className="block font-bold text-rose-400 mb-1">Estimated Effort (1-10): {formData.estimatedEffort}</label>
                                <input type="range" min="1" max="10" value={formData.estimatedEffort} onChange={e => setFormData({ ...formData, estimatedEffort: Number(e.target.value) })} className="w-full accent-rose-400 cursor-pointer" />
                            </div>

                            <div>
                                <label className="block font-bold text-emerald-400 mb-1">Confidence Level (1-10): {formData.confidenceLevel}</label>
                                <input type="range" min="1" max="10" value={formData.confidenceLevel} onChange={e => setFormData({ ...formData, confidenceLevel: Number(e.target.value) })} className="w-full accent-emerald-400 cursor-pointer" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Estimated Cost</label>
                                <Input placeholder="e.g. $500 / Free" value={formData.estimatedCost} onChange={e => setFormData({ ...formData, estimatedCost: e.target.value })} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Time to Build</label>
                                <Input placeholder="e.g. 3 Days / 2 Weeks" value={formData.estimatedTimeToBuild} onChange={e => setFormData({ ...formData, estimatedTimeToBuild: e.target.value })} className="bg-slate-950 border-slate-800" />
                            </div>
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Revenue Potential</label>
                                <Input placeholder="e.g. $10k/mo MRR" value={formData.estimatedRevenuePotential} onChange={e => setFormData({ ...formData, estimatedRevenuePotential: e.target.value })} className="bg-slate-950 border-slate-800" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Priority</label>
                                <select value={formData.priority} onChange={e => setFormData({ ...formData, priority: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2">
                                    <option value="Low">Low</option>
                                    <option value="Medium">Medium</option>
                                    <option value="High">High</option>
                                    <option value="Critical">Critical</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Status</label>
                                <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2">
                                    <option value="Backlog">Backlog</option>
                                    <option value="Researching">Researching</option>
                                    <option value="Planned">Planned</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Testing">Testing</option>
                                    <option value="Launched">Launched</option>
                                    <option value="Archived">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Owner</label>
                                <Input value={formData.owner} onChange={e => setFormData({ ...formData, owner: e.target.value })} placeholder="Owner" className="bg-slate-950 border-slate-800" />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Due Date</label>
                                <Input type="date" value={formData.dueDate} onChange={e => setFormData({ ...formData, dueDate: e.target.value })} className="bg-slate-950 border-slate-800" />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Success Metrics & KPIs</label>
                                <textarea rows={2} value={formData.successMetrics} onChange={e => setFormData({ ...formData, successMetrics: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl" placeholder="How will you measure success?" />
                            </div>

                            <div>
                                <label className="block font-bold text-slate-300 mb-1">Risks & Next Action</label>
                                <textarea rows={2} value={formData.risks} onChange={e => setFormData({ ...formData, risks: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl" placeholder="Key risks or immediate next steps..." />
                            </div>
                        </div>

                        <div>
                            <label className="block font-bold text-slate-300 mb-1">Additional Notes & Reference Links</label>
                            <textarea rows={3} value={formData.notes} onChange={e => setFormData({ ...formData, notes: e.target.value })} className="w-full bg-slate-950 border border-slate-800 text-slate-100 p-2 rounded-xl" placeholder="Additional notes, web URLs, attachments..." />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button type="button" variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isSubmitting} className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase text-xs px-6">
                                {isSubmitting ? "Saving..." : (editingIdeaId ? "Save Idea Changes" : "Log Idea Record")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* DETAIL VIEW MODAL */}
            {viewingIdea && (
                <Dialog open={!!viewingIdea} onOpenChange={() => setViewingIdea(null)}>
                    <DialogContent className="bg-slate-900 border-slate-800 text-slate-100 max-w-3xl max-h-[90vh] overflow-y-auto font-sans">
                        <DialogHeader>
                            <DialogTitle className="text-xl font-black uppercase font-mono text-slate-100 flex items-center justify-between pr-6">
                                <div className="flex items-center gap-2">
                                    <Lightbulb className="h-5 w-5 text-amber-400" />
                                    {viewingIdea.title}
                                </div>
                                <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full uppercase">
                                    {viewingIdea.status}
                                </span>
                            </DialogTitle>
                            <DialogDescription className="text-xs font-mono text-slate-400">
                                {viewingIdea.category} &bull; {viewingIdea.opportunityType} {viewingIdea.competitorName && `(vs ${viewingIdea.competitorName})`}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-5 pt-2 font-mono text-xs">
                            <div className="grid grid-cols-3 gap-3 text-center">
                                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Impact</span>
                                    <strong className="text-amber-400 text-base">{viewingIdea.strategicImpact || 5}/10</strong>
                                </div>
                                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Effort</span>
                                    <strong className="text-rose-400 text-base">{viewingIdea.estimatedEffort || 5}/10</strong>
                                </div>
                                <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800">
                                    <span className="block text-slate-400 font-bold uppercase text-[10px]">Confidence</span>
                                    <strong className="text-emerald-400 text-base">{viewingIdea.confidenceLevel || 5}/10</strong>
                                </div>
                            </div>

                            {viewingIdea.problemIdentified && (
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-300 uppercase text-[10px]">Problem Identified</label>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed">
                                        {viewingIdea.problemIdentified}
                                    </div>
                                </div>
                            )}

                            {viewingIdea.proposedSolution && (
                                <div className="space-y-1">
                                    <label className="font-bold text-emerald-400 uppercase text-[10px]">Proposed Solution</label>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-200 leading-relaxed font-bold">
                                        {viewingIdea.proposedSolution}
                                    </div>
                                </div>
                            )}

                            <div className="grid grid-cols-3 gap-3">
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Cost</span>
                                    <span className="text-slate-200 font-bold">{viewingIdea.estimatedCost || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Time to Build</span>
                                    <span className="text-slate-200 font-bold">{viewingIdea.estimatedTimeToBuild || "N/A"}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Revenue Potential</span>
                                    <span className="text-amber-400 font-bold">{viewingIdea.estimatedRevenuePotential || "N/A"}</span>
                                </div>
                            </div>

                            {viewingIdea.notes && (
                                <div className="space-y-1">
                                    <label className="font-bold text-slate-300 uppercase text-[10px]">Notes & Links</label>
                                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-slate-300 leading-relaxed whitespace-pre-wrap">
                                        {viewingIdea.notes}
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end gap-3 border-t border-slate-800 pt-4">
                                <Button 
                                    onClick={() => handleToggleArchive(viewingIdea)}
                                    variant="outline"
                                    className="bg-slate-950 border-slate-800 text-amber-400 hover:text-amber-300 font-mono text-xs font-bold"
                                >
                                    {viewingIdea.status === "Archived" ? "Unarchive Idea" : "Archive Idea"}
                                </Button>
                                <Button 
                                    onClick={() => {
                                        setViewingIdea(null);
                                        handleOpenEdit(viewingIdea);
                                    }}
                                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono text-xs font-bold uppercase"
                                >
                                    Edit Full Idea
                                </Button>
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            )}

        </div>
    );
}
