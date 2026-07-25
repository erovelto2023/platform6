"use client";

import { useState, useTransition } from "react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary.actions";
import { Save, AlertCircle, Loader2, Link as LinkIcon, Rocket, Sparkles, BookOpen, Layers, ShieldCheck, DollarSign } from "lucide-react";
import { IGlossaryTerm } from "@/lib/db/models/GlossaryTerm";
import { IDirectoryProduct } from "@/lib/db/models/DirectoryProduct";

interface GlossaryFormProps {
    initialData?: IGlossaryTerm;
    onComplete: () => void;
    products: IDirectoryProduct[];
}

export default function GlossaryForm({ initialData, onComplete, products = [] }: GlossaryFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const [formData, setFormData] = useState<Partial<IGlossaryTerm>>(
        initialData || {
            term: "",
            category: "General",
            subCategory: "",
            shortDefinition: "",
            definition: "",
            aeoSummary: "",
            entityType: "Core Concept",
            parentTermSlug: "",

            // Meaning & Context
            origin: "",
            traditionalMeaning: "",
            expandedExplanation: "",

            // Practical Application
            howItWorks: "",
            benefits: "",
            commonPractices: "",
            useCases: "",

            // Learning & Guidance
            beginnerExplanation: "",
            guidedPractice: "",
            affirmations: "",
            warningsOrNotes: "",
            misconceptions: "",

            // SEO
            metaTitle: "",
            keywords: [],

            // Relationships
            recommendedTools: [],

            // MMO
            howItMakesMoney: "",
            bestFor: "",
            gettingStartedChecklist: [],
            commonMistakes: "",
            realExamples: "",
            startupCost: "$0",
            timeToFirstDollar: "",
            skillRequired: "Beginner",
            platformPreference: "",

            // SEO & Social Gen
            faqs: [],
            caseStudies: [],
            takeaways: [],
            headlines: [],
            youtubeTitles: [],
            pinterestIdeas: [],
            instagramIdeas: [],
            amazonProducts: [],
            websitesRanking: [],
            podcastsRanking: [],
            whyItMatters: "",
            videoUrl: "",
            imagePrompt: "",
            productPrompt: "",
            socialPrompt: ""
        }
    );

    const handleChange = (field: keyof IGlossaryTerm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        startTransition(async () => {
            let result;
            if (initialData && initialData.id) {
                result = await updateGlossaryTerm({ ...formData, id: initialData.id });
            } else {
                result = await createGlossaryTerm(formData);
            }

            if (result.error) {
                setError(result.error);
            } else {
                onComplete();
            }
        });
    };

    const inputClass = "w-full p-3 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 placeholder:text-slate-500 focus:border-cyan-500 outline-none font-mono text-xs shadow-inner";
    const labelClass = "block text-xs font-mono font-bold text-slate-300 uppercase tracking-wider mb-1.5";

    return (
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-8 max-w-4xl mx-auto text-slate-100 font-sans">
            <div className="border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 uppercase">
                    <Sparkles className="text-cyan-400" size={24} />
                    {initialData ? "Edit Glossary Term" : "Create New Term"}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">Configure keyword metadata, AEO direct answer snippets, and monetization paths.</p>
            </div>

            {/* Core Info */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <BookOpen size={16} /> Core Concept Details
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className={labelClass}>Term Name *</label>
                        <input
                            required
                            type="text"
                            value={formData.term}
                            onChange={e => handleChange("term", e.target.value)}
                            className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 focus:border-cyan-500 outline-none font-bold text-base shadow-inner"
                            placeholder="e.g. Affiliate Marketing"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Category</label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={e => handleChange("category", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Business Models"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Sub-Category</label>
                        <input
                            type="text"
                            value={formData.subCategory || ""}
                            onChange={e => handleChange("subCategory", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Performance Marketing"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Short Definition (One Sentence)</label>
                        <textarea
                            rows={2}
                            value={formData.shortDefinition}
                            onChange={e => handleChange("shortDefinition", e.target.value)}
                            className={inputClass}
                            placeholder="Foundational monetization model..."
                        />
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Full Definition / Concept</label>
                        <textarea
                            rows={6}
                            value={formData.definition}
                            onChange={e => handleChange("definition", e.target.value)}
                            className={inputClass}
                            placeholder="## Detailed Concept Explanation..."
                        />
                    </div>
                </div>
            </div>

            {/* AEO & Entity Graph Optimization Section */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-900/60 space-y-6 shadow-xl text-slate-100">
                <h3 className="font-mono font-extrabold text-cyan-400 border-b border-cyan-900/60 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Rocket size={16} className="text-cyan-400" />
                    AI-Search (AEO) & Knowledge Graph Layer
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider mb-1.5">AEO Direct Answer Summary (~50 Words for ChatGPT/SearchGPT Extraction)</label>
                        <textarea
                            rows={3}
                            value={formData.aeoSummary || ""}
                            onChange={e => handleChange("aeoSummary", e.target.value)}
                            className={inputClass}
                            placeholder="Direct, fact-dense 50-word answer optimized for AI search engine citations..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Entity Type / Classification</label>
                        <input
                            type="text"
                            value={formData.entityType || "Core Concept"}
                            onChange={e => handleChange("entityType", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Performance Metric, Revenue System, Core Concept"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Parent Term Slug (Knowledge Hierarchy)</label>
                        <input
                            type="text"
                            value={formData.parentTermSlug || ""}
                            onChange={e => handleChange("parentTermSlug", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. affiliate-marketing"
                        />
                    </div>
                </div>
            </div>

            {/* Meaning & Context */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-slate-200 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider">History & Meaning</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Origin & Etymology</label>
                        <input
                            type="text"
                            value={formData.origin || ""}
                            onChange={e => handleChange("origin", e.target.value)}
                            className={inputClass}
                            placeholder="Term origins..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Traditional Meaning</label>
                        <input
                            type="text"
                            value={formData.traditionalMeaning || ""}
                            onChange={e => handleChange("traditionalMeaning", e.target.value)}
                            className={inputClass}
                            placeholder="Traditional context..."
                        />
                    </div>
                    <div className="col-span-full">
                        <label className={labelClass}>Expanded History / Explanation</label>
                        <textarea
                            rows={3}
                            value={formData.expandedExplanation || ""}
                            onChange={e => handleChange("expandedExplanation", e.target.value)}
                            className={inputClass}
                            placeholder="Historical background..."
                        />
                    </div>
                </div>
            </div>

            {/* Practical Application */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-indigo-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider">Practical Application</h3>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className={labelClass}>How It Works (Mechanism)</label>
                        <textarea
                            rows={2}
                            value={formData.howItWorks || ""}
                            onChange={e => handleChange("howItWorks", e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Key Benefits</label>
                        <textarea
                            rows={2}
                            value={formData.benefits || ""}
                            onChange={e => handleChange("benefits", e.target.value)}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Common Practices</label>
                        <input
                            type="text"
                            value={formData.commonPractices || ""}
                            onChange={e => handleChange("commonPractices", e.target.value)}
                            className={inputClass}
                            placeholder="Common practices..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Real-world Use Case</label>
                        <input
                            type="text"
                            value={formData.useCases || ""}
                            onChange={e => handleChange("useCases", e.target.value)}
                            className={inputClass}
                            placeholder="Real-world scenario..."
                        />
                    </div>
                </div>
            </div>

            {/* Related Tools / Resources */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-extrabold text-cyan-400 border-b border-slate-800 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <LinkIcon size={16} className="text-cyan-400" />
                    Related Resources / Tools
                </h3>
                <div className="space-y-4">
                    <p className="text-xs font-mono text-slate-400">Select tools or resources from the database to recommend with this term:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-slate-900 rounded-xl border border-slate-800">
                        {products.map(product => {
                            const isSelected = formData.recommendedTools?.some(t => t.productId === product.id);
                            return (
                                <label key={product.id} className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${isSelected ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200' : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'}`}>
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={(e) => {
                                            const current = formData.recommendedTools || [];
                                            if (e.target.checked) {
                                                handleChange("recommendedTools", [...current, { productId: product.id, context: "Recommended Resource" }]);
                                            } else {
                                                handleChange("recommendedTools", current.filter(t => t.productId !== product.id));
                                            }
                                        }}
                                        className="mt-1 w-4 h-4 rounded border-cyan-500 text-cyan-500 focus:ring-cyan-500"
                                    />
                                    <div>
                                        <span className="font-extrabold text-slate-100 block text-xs">{product.name}</span>
                                        <span className="text-[10px] text-cyan-400 font-mono block mt-0.5">{product.category} • {product.niche}</span>
                                    </div>
                                </label>
                            );
                        })}
                        {products.length === 0 && (
                            <div className="col-span-full text-center text-slate-500 text-xs py-4 font-mono">
                                No tools found in product database.
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Monetization & Business (MMO) */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-900/60 space-y-6">
                <h3 className="font-mono font-bold text-emerald-400 border-b border-emerald-900/60 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <DollarSign size={16} />
                    Monetization & Business (MMO)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className={labelClass}>How It Makes Money</label>
                        <textarea
                            rows={2}
                            value={formData.howItMakesMoney || ""}
                            onChange={e => handleChange("howItMakesMoney", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Earn commissions by promoting third-party products..."
                        />
                    </div>
                    <div className="col-span-full">
                        <label className={labelClass}>Best For (Target Audience)</label>
                        <textarea
                            rows={2}
                            value={formData.bestFor || ""}
                            onChange={e => handleChange("bestFor", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Beginners with no product of their own..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Startup Cost</label>
                        <select
                            value={formData.startupCost || "$0"}
                            onChange={e => handleChange("startupCost", e.target.value)}
                            className={inputClass}
                        >
                            <option value="$0">$0</option>
                            <option value="<$100">&lt;$100</option>
                            <option value="$100+">$100+</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Skill Level Required</label>
                        <select
                            value={formData.skillRequired || "Beginner"}
                            onChange={e => handleChange("skillRequired", e.target.value)}
                            className={inputClass}
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Time to First Dollar</label>
                        <input
                            type="text"
                            value={formData.timeToFirstDollar || ""}
                            onChange={e => handleChange("timeToFirstDollar", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. 1-30 days"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Platform Preference</label>
                        <input
                            type="text"
                            value={formData.platformPreference || ""}
                            onChange={e => handleChange("platformPreference", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Mobile-first, WordPress, Shopify"
                        />
                    </div>

                    <div className="col-span-full flex items-center gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-100 text-xs">Low-Physical-Effort Path</h4>
                            <p className="text-[10px] text-slate-400 font-mono">Highlight this path for users with physical limitations or chronic pain.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.lowPhysicalEffort || false}
                                onChange={e => handleChange("lowPhysicalEffort", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-800 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Getting Started Checklist (One per line)</label>
                        <textarea
                            rows={4}
                            value={formData.gettingStartedChecklist?.join("\n") || ""}
                            onChange={e => handleChange("gettingStartedChecklist", e.target.value.split("\n").filter(l => l.trim() !== ""))}
                            className={inputClass}
                            placeholder="Choose a niche&#10;Join an affiliate program&#10;Create content"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Common Mistakes</label>
                        <textarea
                            rows={3}
                            value={formData.commonMistakes || ""}
                            onChange={e => handleChange("commonMistakes", e.target.value)}
                            className={inputClass}
                            placeholder="Ignoring audience trust..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Real Example / Case Study</label>
                        <textarea
                            rows={3}
                            value={formData.realExamples || ""}
                            onChange={e => handleChange("realExamples", e.target.value)}
                            className={inputClass}
                            placeholder="Short case study of a real person..."
                        />
                    </div>
                </div>
            </div>

            {/* Metadata & SEO Expansion */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-slate-200 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider">SEO & Content Generation Sandbox</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className={labelClass}>Why It Matters</label>
                        <textarea
                            rows={2}
                            value={formData.whyItMatters || ""}
                            onChange={e => handleChange("whyItMatters", e.target.value)}
                            className={inputClass}
                            placeholder="Explain why someone should care..."
                        />
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Video URL (YouTube Embed)</label>
                        <input
                            type="text"
                            value={formData.videoUrl || ""}
                            onChange={e => handleChange("videoUrl", e.target.value)}
                            className={inputClass}
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Key Takeaways (One per line)</label>
                        <textarea
                            rows={3}
                            value={formData.takeaways?.join("\n") || ""}
                            onChange={e => handleChange("takeaways", e.target.value.split("\n").filter(l => l.trim() !== ""))}
                            className={inputClass}
                        />
                    </div>

                    {['headlines', 'youtubeTitles', 'pinterestIdeas', 'instagramIdeas'].map((fieldKey) => (
                        <div key={fieldKey}>
                            <label className={labelClass}>
                                {fieldKey.replace(/([A-Z])/g, ' $1').trim()} (One per line)
                            </label>
                            <textarea
                                rows={3}
                                value={(formData[fieldKey as keyof IGlossaryTerm] as string[])?.join("\n") || ""}
                                onChange={e => handleChange(fieldKey as keyof IGlossaryTerm, e.target.value.split("\n").filter(l => l.trim() !== ""))}
                                className={inputClass}
                            />
                        </div>
                    ))}
                    
                    <div className="col-span-full mt-4 p-4 border border-cyan-900/60 bg-slate-900 rounded-xl space-y-4">
                        <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider">Advanced Structured Data (JSON)</h4>
                        <p className="text-[10px] font-mono text-slate-400">Paste valid JSON arrays to populate FAQs and Case Studies.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>FAQs (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.faqs || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("faqs", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className={inputClass}
                                    placeholder='[{"question": "Q?", "answer": "A"}]'
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Case Studies (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.caseStudies || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("caseStudies", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className={inputClass}
                                    placeholder='[{"title": "Title", "description": "Desc"}]'
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Amazon Products (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.amazonProducts || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("amazonProducts", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className={inputClass}
                                    placeholder='[{"name": "Product", "url": "https..."}]'
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Websites Ranking (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.websitesRanking || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("websitesRanking", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className={inputClass}
                                    placeholder='[{"name": "Site", "url": "https..."}]'
                                />
                            </div>
                            <div>
                                <label className={labelClass}>Podcasts Ranking (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.podcastsRanking || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("podcastsRanking", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className={inputClass}
                                    placeholder='[{"name": "Podcast", "url": "https..."}]'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800">
                    <label className={labelClass}>Standard Meta Title</label>
                    <input
                        type="text"
                        value={formData.metaTitle || ""}
                        onChange={e => handleChange("metaTitle", e.target.value)}
                        className={`${inputClass} mb-4`}
                    />
                    <label className={labelClass}>Keywords (comma separated)</label>
                    <input
                        type="text"
                        value={formData.keywords?.join(", ") || ""}
                        onChange={e => handleChange("keywords", e.target.value.split(",").map(s => s.trim()))}
                        className={inputClass}
                    />
                </div>
            </div>

            {/* AI Prompts Section */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider">AI Generation Prompts</h3>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className={labelClass}>AI Image Prompt (Midjourney/DALL-E)</label>
                        <textarea
                            rows={3}
                            value={formData.imagePrompt || ""}
                            onChange={e => handleChange("imagePrompt", e.target.value)}
                            className={inputClass}
                            placeholder="A detailed visual description for AI image generation..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>AI Product Idea Prompt</label>
                        <textarea
                            rows={3}
                            value={formData.productPrompt || ""}
                            onChange={e => handleChange("productPrompt", e.target.value)}
                            className={inputClass}
                            placeholder="A prompt to help the user brainstorm product ideas for this keyword..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>AI Content/Social Logic Prompt</label>
                        <textarea
                            rows={3}
                            value={formData.socialPrompt || ""}
                            onChange={e => handleChange("socialPrompt", e.target.value)}
                            className={inputClass}
                            placeholder="A strategy prompt for viral social content or content planning..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-rose-950/80 text-rose-300 border border-rose-800 rounded-2xl flex items-center gap-2 font-mono text-xs">
                    <AlertCircle size={18} />
                    {error}
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold py-3.5 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-xs uppercase tracking-wider cursor-pointer"
                >
                    {isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Term
                </button>
                <button
                    type="button"
                    onClick={() => onComplete()}
                    className="px-6 py-3.5 bg-slate-950 border border-slate-800 text-slate-300 hover:text-white rounded-xl font-bold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
