"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft, ArrowRight, Award, HelpCircle, BarChart3, Sparkles, CheckCircle2, Search, Target, Users, BookOpen, Heart, Briefcase, ShoppingBag, Lightbulb, TrendingUp, Star, Zap, Gift, Shield, Brain, Palette, Rocket } from "lucide-react";
import { useUser } from "@clerk/nextjs";

const CATEGORIES = [
    { id: "all", label: "All Templates", count: 0 },
    { id: "lead", label: "Lead Capture & Funnels", count: 4 },
    { id: "education", label: "Education & Assessment", count: 4 },
    { id: "feedback", label: "Feedback & Insights", count: 4 },
    { id: "ecommerce", label: "E-commerce", count: 4 },
    { id: "health", label: "Health & Wellness", count: 2 },
    { id: "b2b", label: "B2B Professional", count: 2 },
];

const TEMPLATES = [
    { id: "lead-qualifier", title: "Lead Qualifier Quiz", desc: "Identify high-intent leads and segment them for sales follow-up", icon: Target, subtype: "Quiz" as const, category: "lead", color: "indigo" },
    { id: "product-match", title: "Product Match Quiz", desc: "Recommend the right product or service based on customer needs", icon: ShoppingBag, subtype: "Quiz" as const, category: "lead", color: "indigo" },
    { id: "pain-point", title: "Pain Point Discovery Quiz", desc: "Identify customer struggles and position your solution", icon: Lightbulb, subtype: "Quiz" as const, category: "lead", color: "indigo" },
    { id: "personality", title: "Personality Type Quiz", desc: "Fun personality quiz designed for social sharing", icon: Star, subtype: "Quiz" as const, category: "lead", color: "indigo" },
    { id: "knowledge-check", title: "Knowledge Assessment", desc: "Test and evaluate knowledge on any subject with scored results", icon: Brain, subtype: "Quiz" as const, category: "education", color: "amber" },
    { id: "course-placement", title: "Course Placement Quiz", desc: "Assess skill level to recommend the right course or learning path", icon: BookOpen, subtype: "Quiz" as const, category: "education", color: "amber" },
    { id: "learning-style", title: "Learning Style Quiz", desc: "Help learners discover how they learn best", icon: Palette, subtype: "Quiz" as const, category: "education", color: "amber" },
    { id: "cert-readiness", title: "Certification Readiness Check", desc: "Assess if learners are prepared for a certification exam", icon: Award, subtype: "Quiz" as const, category: "education", color: "amber" },
    { id: "nps-survey", title: "NPS Survey", desc: "Measure customer loyalty with Net Promoter Score", icon: TrendingUp, subtype: "Survey" as const, category: "feedback", color: "cyan" },
    { id: "csat-survey", title: "Customer Satisfaction Survey", desc: "Gather feedback on customer experience and satisfaction", icon: Heart, subtype: "Survey" as const, category: "feedback", color: "cyan" },
    { id: "feature-request", title: "Feature Request Survey", desc: "Collect and prioritize feature requests from users", icon: Rocket, subtype: "Survey" as const, category: "feedback", color: "cyan" },
    { id: "product-feedback", title: "Product Feedback Survey", desc: "Detailed feedback on product experience and usability", icon: HelpCircle, subtype: "Survey" as const, category: "feedback", color: "cyan" },
    { id: "gift-finder", title: "Gift Finder Quiz", desc: "Help shoppers find the perfect gift for any occasion", icon: Gift, subtype: "Quiz" as const, category: "ecommerce", color: "indigo" },
    { id: "style-quiz", title: "Style Quiz", desc: "Help customers find their personal style and get tailored recommendations", icon: Sparkles, subtype: "Quiz" as const, category: "ecommerce", color: "indigo" },
    { id: "size-fit", title: "Size & Fit Finder", desc: "Help customers find their perfect size and reduce returns", icon: Shield, subtype: "Quiz" as const, category: "ecommerce", color: "indigo" },
    { id: "roi-calc", title: "ROI Calculator Quiz", desc: "Help prospects understand potential return on investment", icon: Briefcase, subtype: "Quiz" as const, category: "ecommerce", color: "indigo" },
    { id: "wellness", title: "Wellness Assessment", desc: "Comprehensive wellness check covering sleep, stress, diet, and exercise", icon: Heart, subtype: "Survey" as const, category: "health", color: "cyan" },
    { id: "fitness-goal", title: "Fitness Goal Finder", desc: "Match users with the right fitness program based on their goals", icon: Zap, subtype: "Quiz" as const, category: "health", color: "indigo" },
    { id: "vendor-selection", title: "Vendor Selection Helper", desc: "Guide prospects to the right solution based on their needs", icon: Users, subtype: "Quiz" as const, category: "b2b", color: "indigo" },
    { id: "maturity", title: "Maturity Assessment", desc: "Evaluate organizational maturity in a specific area", icon: BarChart3, subtype: "Quiz" as const, category: "b2b", color: "indigo" },
];

const SUBTYPE_COLORS: Record<string, string> = {
    Quiz: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    Survey: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
    Poll: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
};

export default function CreateSurveyPage() {
    const router = useRouter();
    const { user } = useUser();
    const [isLoading, setIsLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [typeFilter, setTypeFilter] = useState<"All" | "Quiz" | "Survey">("All");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [formData, setFormData] = useState({ title: "", description: "" });
    const [selectedSubtype, setSelectedSubtype] = useState<"Survey" | "Poll" | "Quiz">("Quiz");

    const filteredTemplates = TEMPLATES.filter(t => {
        if (typeFilter !== "All" && t.subtype !== typeFilter) return false;
        if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
        if (searchQuery && !t.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
        return true;
    });

    CATEGORIES[0].count = TEMPLATES.length;

    const handleSelectTemplate = (t: typeof TEMPLATES[0]) => {
        setSelectedTemplate(t.id);
        setSelectedSubtype(t.subtype);
        setFormData({ title: t.title, description: t.desc });
    };

    const handleSubmit = async () => {
        if (!formData.title.trim()) { toast.error("Please enter a title"); return; }
        setIsLoading(true);
        try {
            const payload = {
                title: formData.title, description: formData.description,
                owner: user?.publicMetadata?.userId || user?.id,
                status: "Draft", subtype: selectedSubtype, questions: [],
                settings: { quizMode: selectedSubtype === "Quiz", passingScore: 70, showCorrectAnswersAfterSubmit: true, allowAnonymous: true, showResultsAfterSubmit: selectedSubtype !== "Quiz" },
            };
            const res = await fetch('/api/surveys', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
            if (!res.ok) throw new Error("Failed");
            const survey = await res.json();
            toast.success(`${selectedSubtype} created!`);
            router.push(`/admin/surveys/${survey._id}`);
        } catch { toast.error("Failed to create"); }
        finally { setIsLoading(false); }
    };

    return (
        <div className="max-w-6xl mx-auto p-6 pb-24 text-slate-100">
            {/* Wizard Progress Bar */}
            <div className="flex items-center gap-3 mb-8">
                <Button variant="ghost" size="icon" onClick={() => step === 1 ? router.back() : setStep(1)} className="text-slate-400 hover:text-white hover:bg-slate-800"><ArrowLeft className="h-5 w-5" /></Button>
                <div className="flex items-center gap-0 flex-1">
                    {["Choose Template", "Quiz Basics"].map((label, i) => (
                        <div key={i} className="flex items-center flex-1">
                            <div className={`flex items-center gap-2 ${step > i + 1 ? 'text-indigo-400' : step === i + 1 ? 'text-white' : 'text-slate-500'}`}>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold border-2 ${step > i + 1 ? 'bg-indigo-600 border-indigo-500 text-white' : step === i + 1 ? 'border-indigo-500 text-indigo-400' : 'border-slate-700 text-slate-500'}`}>
                                    {step > i + 1 ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
                                </div>
                                <span className="text-sm font-medium hidden sm:inline">{label}</span>
                            </div>
                            {i < 1 && <div className={`flex-1 h-0.5 mx-4 ${step > i + 1 ? 'bg-indigo-500' : 'bg-slate-800'}`} />}
                        </div>
                    ))}
                </div>
            </div>

            {/* STEP 1 - Template Gallery */}
            {step === 1 && (
                <div className="space-y-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-extrabold text-white">Choose Template</h1>
                            <p className="text-sm text-slate-400">Start with a template or from scratch</p>
                        </div>
                        <div className="relative w-72">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <Input placeholder="Search templates..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10 bg-slate-900 border-slate-700 text-slate-200" />
                        </div>
                    </div>

                    {/* Type Filter + Category Sidebar */}
                    <div className="flex gap-6">
                        <div className="w-52 shrink-0 space-y-4 hidden md:block">
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400 uppercase font-bold">Type</Label>
                                {(["All", "Quiz", "Survey"] as const).map(t => (
                                    <button key={t} onClick={() => setTypeFilter(t)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${typeFilter === t ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{t}</button>
                                ))}
                            </div>
                            <div className="space-y-1">
                                <Label className="text-xs text-slate-400 uppercase font-bold">Categories</Label>
                                {CATEGORIES.map(c => (
                                    <button key={c.id} onClick={() => setCategoryFilter(c.id)} className={`block w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-all ${categoryFilter === c.id ? 'bg-indigo-600 text-white' : 'text-slate-300 hover:bg-slate-800'}`}>{c.label}</button>
                                ))}
                            </div>
                            {/* Start from scratch */}
                            <div className="bg-slate-900 border border-dashed border-slate-700 rounded-xl p-4 text-center cursor-pointer hover:border-indigo-500/50 transition-all" onClick={() => { setSelectedTemplate(null); setStep(2); }}>
                                <div className="text-2xl mb-1">+</div>
                                <div className="text-sm font-semibold text-slate-300">Start from Scratch</div>
                                <div className="text-xs text-slate-500">Build entirely custom</div>
                            </div>
                        </div>

                        {/* Template Grid */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {filteredTemplates.map(t => {
                                const Icon = t.icon;
                                return (
                                    <Card key={t.id} onClick={() => handleSelectTemplate(t)} className={`cursor-pointer transition-all bg-slate-900 border hover:shadow-lg ${selectedTemplate === t.id ? 'ring-2 ring-indigo-500 border-transparent' : 'border-slate-800 hover:border-slate-700'}`}>
                                        <CardHeader className="p-5">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="p-2 rounded-lg bg-slate-800 text-slate-300"><Icon className="h-5 w-5" /></div>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${SUBTYPE_COLORS[t.subtype]}`}>{t.subtype}</span>
                                            </div>
                                            <CardTitle className="text-sm font-bold text-slate-100">{t.title}</CardTitle>
                                            <CardDescription className="text-xs text-slate-400 mt-1">{t.desc}</CardDescription>
                                        </CardHeader>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button onClick={() => setStep(2)} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6">
                            Next Step <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}

            {/* STEP 2 - Quiz Basics */}
            {step === 2 && (
                <div className="max-w-2xl mx-auto space-y-6">
                    <h1 className="text-2xl font-extrabold text-white">Quiz Basics</h1>
                    <p className="text-sm text-slate-400">Configure the foundation of your quiz funnel.</p>

                    <Card className="bg-slate-900 border-slate-800 shadow-2xl">
                        <CardContent className="p-6 space-y-5">
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-semibold">Quiz Title *</Label>
                                <Input value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="e.g. What Marketing Strategy Fits You Best?" className="bg-slate-800 border-slate-700 text-white font-semibold text-lg" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-semibold">Description</Label>
                                <Textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Welcome text or instructions shown before quiz starts..." rows={3} className="bg-slate-800 border-slate-700 text-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-slate-300 font-semibold">Subtype</Label>
                                <div className="grid grid-cols-3 gap-3">
                                    {(["Survey", "Quiz", "Poll"] as const).map(st => (
                                        <button key={st} type="button" onClick={() => setSelectedSubtype(st)} className={`p-3 rounded-xl border text-sm font-bold transition-all text-center ${selectedSubtype === st ? 'bg-indigo-600 border-indigo-500 text-white' : 'bg-slate-800 border-slate-700 text-slate-300 hover:border-slate-600'}`}>
                                            {st === "Quiz" && <Award className="h-4 w-4 mx-auto mb-1" />}
                                            {st === "Survey" && <HelpCircle className="h-4 w-4 mx-auto mb-1" />}
                                            {st === "Poll" && <BarChart3 className="h-4 w-4 mx-auto mb-1" />}
                                            {st}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-between">
                        <Button variant="ghost" onClick={() => setStep(1)} className="text-slate-400 hover:text-white"><ArrowLeft className="mr-2 h-4 w-4" /> Previous</Button>
                        <Button onClick={handleSubmit} disabled={isLoading} className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8">
                            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Create & Open Builder
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
