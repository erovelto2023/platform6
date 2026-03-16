"use client";

import { useState, useTransition } from "react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary.actions";
import { Save, AlertCircle, Loader2, Link as LinkIcon, Rocket } from "lucide-react";
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

    return (
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 space-y-8 max-w-4xl mx-auto">
            <div className="border-b border-slate-100 pb-6">
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                    {initialData ? "Edit Glossary Term" : "Create New Term"}
                </h2>
                <p className="text-slate-500">Fill in the details below to add a comprehensive healing term.</p>
            </div>

            {/* Core Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-full">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Term Name *</label>
                    <input
                        required
                        type="text"
                        value={formData.term}
                        onChange={e => handleChange("term", e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-bold text-lg"
                        placeholder="e.g. Absolute Awareness"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Category</label>
                    <input
                        type="text"
                        value={formData.category}
                        onChange={e => handleChange("category", e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Energy Healing"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Sub-Category</label>
                    <input
                        type="text"
                        value={formData.subCategory || ""}
                        onChange={e => handleChange("subCategory", e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="e.g. Non-duality"
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Short Definition (One Sentence)</label>
                    <textarea
                        rows={2}
                        value={formData.shortDefinition}
                        onChange={e => handleChange("shortDefinition", e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="Foundational state of consciousness..."
                    />
                </div>

                <div className="col-span-full">
                    <label className="block text-sm font-bold text-slate-700 mb-2">Full Definition / Concept</label>
                    <textarea
                        rows={6}
                        value={formData.definition}
                        onChange={e => handleChange("definition", e.target.value)}
                        className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none font-mono text-sm"
                        placeholder="## Concept..."
                    />
                </div>
            </div>

            {/* Meaning & Context */}
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-100 space-y-6">
                <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">History & Meaning</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Origin & Etymology</label>
                        <input
                            type="text"
                            value={formData.origin || ""}
                            onChange={e => handleChange("origin", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
                            placeholder="Sanskrit 'Cit'..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Traditional Meaning</label>
                        <input
                            type="text"
                            value={formData.traditionalMeaning || ""}
                            onChange={e => handleChange("traditionalMeaning", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
                            placeholder="In Eastern philosophy..."
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-slate-600 uppercase mb-1">Expanded History / Explanation</label>
                        <textarea
                            rows={3}
                            value={formData.expandedExplanation || ""}
                            onChange={e => handleChange("expandedExplanation", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-slate-200 text-sm"
                            placeholder="Rooted in Advaita Vedanta..."
                        />
                    </div>
                </div>
            </div>

            {/* Practical Application */}
            <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-6">
                <h3 className="font-bold text-blue-900 border-b border-blue-200 pb-2">Practical Application</h3>

                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-1">How It Works (Mechanism)</label>
                        <textarea
                            rows={2}
                            value={formData.howItWorks || ""}
                            onChange={e => handleChange("howItWorks", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-blue-200 text-sm focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Key Benefits</label>
                        <textarea
                            rows={2}
                            value={formData.benefits || ""}
                            onChange={e => handleChange("benefits", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-blue-200 text-sm focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Common Practices</label>
                        <input
                            type="text"
                            value={formData.commonPractices || ""}
                            onChange={e => handleChange("commonPractices", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-blue-200 text-sm"
                            placeholder="Self-inquiry, meditation..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Real-world Use Case</label>
                        <input
                            type="text"
                            value={formData.useCases || ""}
                            onChange={e => handleChange("useCases", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-blue-200 text-sm"
                            placeholder="During emotional overwhelm..."
                        />
                    </div>
                </div>
            </div>

            {/* Related Tools / Resources */}
            <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100 space-y-6">
                <h3 className="font-bold text-indigo-900 border-b border-indigo-200 pb-2 flex items-center gap-2">
                    <LinkIcon size={18} />
                    Related Resources / Tools
                </h3>
                <div className="space-y-4">
                    <p className="text-sm text-indigo-800">Select tools or resources from the database to recommend with this term:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-4 bg-white rounded-lg border border-indigo-100">
                        {products.map(product => {
                            const isSelected = formData.recommendedTools?.some(t => t.productId === product.id);
                            return (
                                <label key={product.id} className={`flex items-start gap-3 p-3 rounded border cursor-pointer transition-all ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-transparent hover:bg-slate-50'}`}>
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
                                        className="mt-1 w-4 h-4 rounded border-indigo-300 text-indigo-600 focus:ring-indigo-500"
                                    />
                                    <div>
                                        <span className="font-bold text-slate-800 block text-sm">{product.name}</span>
                                        <span className="text-xs text-slate-500 block">{product.category} • {product.niche}</span>
                                    </div>
                                </label>
                            );
                        })}
                        {products.length === 0 && (
                            <div className="col-span-full text-center text-slate-500 text-sm py-4">
                                No products found in database.
                            </div>
                        )}
                    </div>
                </div>
            </div>



            {/* Monetization & Business (MMO) */}
            <div className="bg-emerald-50 p-6 rounded-xl border border-emerald-100 space-y-6">
                <h3 className="font-bold text-emerald-900 border-b border-emerald-200 pb-2 flex items-center gap-2">
                    <Rocket size={18} />
                    Monetization & Business (MMO)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">How It Makes Money</label>
                        <textarea
                            rows={2}
                            value={formData.howItMakesMoney || ""}
                            onChange={e => handleChange("howItMakesMoney", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm focus:ring-emerald-500"
                            placeholder="e.g. Earn commissions by promoting third-party products..."
                        />
                    </div>
                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Best For (Target Audience)</label>
                        <textarea
                            rows={2}
                            value={formData.bestFor || ""}
                            onChange={e => handleChange("bestFor", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm focus:ring-emerald-500"
                            placeholder="e.g. Beginners with no product of their own..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Startup Cost</label>
                        <select
                            value={formData.startupCost || "$0"}
                            onChange={e => handleChange("startupCost", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                        >
                            <option value="$0">$0</option>
                            <option value="<$100">&lt;$100</option>
                            <option value="$100+">$100+</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Skill Level Required</label>
                        <select
                            value={formData.skillRequired || "Beginner"}
                            onChange={e => handleChange("skillRequired", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                        >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Advanced">Advanced</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Time to First Dollar</label>
                        <input
                            type="text"
                            value={formData.timeToFirstDollar || ""}
                            onChange={e => handleChange("timeToFirstDollar", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                            placeholder="e.g. 1-30 days"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Platform Preference</label>
                        <input
                            type="text"
                            value={formData.platformPreference || ""}
                            onChange={e => handleChange("platformPreference", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                            placeholder="e.g. Mobile-first, WordPress, Shopify"
                        />
                    </div>

                    <div className="col-span-full flex items-center gap-3 p-4 bg-white rounded-lg border border-emerald-100 shadow-sm">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-800 text-sm">Low-Physical-Effort Path</h4>
                            <p className="text-xs text-slate-500">Enable this to highlight this path for users with physical limitations or chronic pain.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.lowPhysicalEffort || false}
                                onChange={e => handleChange("lowPhysicalEffort", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-emerald-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                        </label>
                    </div>

                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Getting Started Checklist (One per line)</label>
                        <textarea
                            rows={4}
                            value={formData.gettingStartedChecklist?.join("\n") || ""}
                            onChange={e => handleChange("gettingStartedChecklist", e.target.value.split("\n").filter(l => l.trim() !== ""))}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                            placeholder="Choose a niche&#10;Join an affiliate program&#10;Create content"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Common Mistakes</label>
                        <textarea
                            rows={3}
                            value={formData.commonMistakes || ""}
                            onChange={e => handleChange("commonMistakes", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                            placeholder="Ignoring audience trust..."
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-emerald-800 uppercase mb-1">Real Example / Case Study</label>
                        <textarea
                            rows={3}
                            value={formData.realExamples || ""}
                            onChange={e => handleChange("realExamples", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-emerald-200 text-sm"
                            placeholder="Short case study of a real person..."
                        />
                    </div>
                </div>
            </div>

            {/* Metadata & SEO Expansion */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2 flex items-center gap-2">
                    <Rocket size={18} /> SEO & Content Generation Sandbox
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Why It Matters</label>
                        <textarea
                            rows={2}
                            value={formData.whyItMatters || ""}
                            onChange={e => handleChange("whyItMatters", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                            placeholder="Explain why someone should care..."
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Video URL (YouTube Embed)</label>
                        <input
                            type="text"
                            value={formData.videoUrl || ""}
                            onChange={e => handleChange("videoUrl", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                            placeholder="https://www.youtube.com/watch?v=..."
                        />
                    </div>

                    <div className="col-span-full">
                        <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Key Takeaways (One per line)</label>
                        <textarea
                            rows={3}
                            value={formData.takeaways?.join("\n") || ""}
                            onChange={e => handleChange("takeaways", e.target.value.split("\n").filter(l => l.trim() !== ""))}
                            className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                        />
                    </div>

                    {/* Array Generation Fields (Strings only) */}
                    {['headlines', 'youtubeTitles', 'pinterestIdeas', 'instagramIdeas'].map((fieldKey) => (
                        <div key={fieldKey}>
                            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">
                                {fieldKey.replace(/([A-Z])/g, ' $1').trim()} (One per line)
                            </label>
                            <textarea
                                rows={3}
                                value={(formData[fieldKey as keyof IGlossaryTerm] as string[])?.join("\n") || ""}
                                onChange={e => handleChange(fieldKey as keyof IGlossaryTerm, e.target.value.split("\n").filter(l => l.trim() !== ""))}
                                className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                            />
                        </div>
                    ))}
                    
                    <div className="col-span-full mt-4 p-4 border border-blue-200 bg-blue-50 rounded-xl">
                        <h4 className="font-bold text-blue-900 text-sm mb-2">Advanced Structured Data (JSON)</h4>
                        <p className="text-xs text-blue-700 mb-4">Paste valid JSON arrays to populate FAQs and Case Studies.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">FAQs (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.faqs || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("faqs", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className="w-full p-2.5 rounded-lg border border-blue-200 text-xs font-mono"
                                    placeholder='[{"question": "Q?", "answer": "A"}]'
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Case Studies (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.caseStudies || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("caseStudies", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className="w-full p-2.5 rounded-lg border border-blue-200 text-xs font-mono"
                                    placeholder='[{"title": "Title", "description": "Desc"}]'
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Amazon Products (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.amazonProducts || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("amazonProducts", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className="w-full p-2.5 rounded-lg border border-blue-200 text-xs font-mono"
                                    placeholder='[{"name": "Product", "url": "https..."}]'
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Websites Ranking (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.websitesRanking || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("websitesRanking", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className="w-full p-2.5 rounded-lg border border-blue-200 text-xs font-mono"
                                    placeholder='[{"name": "Site", "url": "https..."}]'
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-blue-800 uppercase mb-1">Podcasts Ranking (JSON Array)</label>
                                <textarea
                                    rows={4}
                                    value={JSON.stringify(formData.podcastsRanking || [], null, 2)}
                                    onChange={e => {
                                        try { handleChange("podcastsRanking", JSON.parse(e.target.value)); } catch(err) {} 
                                    }}
                                    className="w-full p-2.5 rounded-lg border border-blue-200 text-xs font-mono"
                                    placeholder='[{"name": "Podcast", "url": "https..."}]'
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-200">
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Standard Meta Title</label>
                    <input
                        type="text"
                        value={formData.metaTitle || ""}
                        onChange={e => handleChange("metaTitle", e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm mb-4"
                    />
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Keywords (comma separated)</label>
                    <input
                        type="text"
                        value={formData.keywords?.join(", ") || ""}
                        onChange={e => handleChange("keywords", e.target.value.split(",").map(s => s.trim()))}
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                </div>
            </div>

            {/* AI Prompts Section */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 space-y-6">
                <h3 className="font-bold text-purple-900 border-b border-purple-200 pb-2 flex items-center gap-2">
                    <Rocket size={18} /> AI Generation Prompts
                </h3>
                
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">AI Image Prompt (Midjourney/DALL-E)</label>
                        <textarea
                            rows={3}
                            value={formData.imagePrompt || ""}
                            onChange={e => handleChange("imagePrompt", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm focus:ring-purple-500"
                            placeholder="A detailed visual description for AI image generation..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">AI Product Idea Prompt</label>
                        <textarea
                            rows={3}
                            value={formData.productPrompt || ""}
                            onChange={e => handleChange("productPrompt", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm focus:ring-purple-500"
                            placeholder="A prompt to help the user brainstorm product ideas for this keyword..."
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">AI Content/Social Logic Prompt</label>
                        <textarea
                            rows={3}
                            value={formData.socialPrompt || ""}
                            onChange={e => handleChange("socialPrompt", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm focus:ring-purple-500"
                            placeholder="A strategy prompt for viral social content or content planning..."
                        />
                    </div>
                </div>
            </div>

            {error && (
                <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-2">
                    <AlertCircle size={20} />
                    {error}
                </div>
            )}

            <div className="flex gap-4 pt-4">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl shadow-lg shadow-green-200 transition-all flex items-center justify-center gap-2"
                >
                    {isPending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                    Save Term
                </button>
                <button
                    type="button"
                    onClick={() => onComplete()}
                    className="px-6 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
