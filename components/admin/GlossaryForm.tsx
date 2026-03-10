"use client";

import { useState, useTransition } from "react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary.actions";
import { Save, AlertCircle, Loader2, Link as LinkIcon } from "lucide-react";
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

            // Energy & Consciousness
            energyType: "Subtle",
            consciousnessLevel: "",
            chakraAssociation: "",
            elementalAssociation: "",
            frequencyLevel: "",

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
            recommendedTools: []
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

            {/* Energy & Consciousness */}
            <div className="bg-purple-50 p-6 rounded-xl border border-purple-100 space-y-6">
                <h3 className="font-bold text-purple-900 border-b border-purple-200 pb-2">Energy & Consciousness</h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Energy Type</label>
                        <select
                            value={formData.energyType || "Subtle"}
                            onChange={e => handleChange("energyType", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm"
                        >
                            <option value="Subtle">Subtle</option>
                            <option value="Biofield">Biofield</option>
                            <option value="Physical">Physical</option>
                            <option value="Cosmic">Cosmic</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Consciousness Level</label>
                        <input
                            type="text"
                            value={formData.consciousnessLevel || ""}
                            onChange={e => handleChange("consciousnessLevel", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm"
                            placeholder="e.g. Turiya"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Frequency</label>
                        <input
                            type="text"
                            value={formData.frequencyLevel || ""}
                            onChange={e => handleChange("frequencyLevel", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm"
                            placeholder="e.g. Beyond measurable"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Chakra</label>
                        <input
                            type="text"
                            value={formData.chakraAssociation || ""}
                            onChange={e => handleChange("chakraAssociation", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm"
                            placeholder="e.g. Crown"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-purple-800 uppercase mb-1">Element</label>
                        <input
                            type="text"
                            value={formData.elementalAssociation || ""}
                            onChange={e => handleChange("elementalAssociation", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-purple-200 text-sm"
                            placeholder="e.g. Ether"
                        />
                    </div>
                </div>
            </div>

            {/* Beginner & Guidance */}
            <div className="bg-amber-50 p-6 rounded-xl border border-amber-100 space-y-6">
                <h3 className="font-bold text-amber-900 border-b border-amber-200 pb-2">Guidance & Experience</h3>

                <div>
                    <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Beginner's Intro</label>
                    <textarea
                        rows={2}
                        value={formData.beginnerExplanation || ""}
                        onChange={e => handleChange("beginnerExplanation", e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-amber-200 text-sm"
                        placeholder="Imagine the sky..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Guided Practice Script</label>
                    <textarea
                        rows={3}
                        value={formData.guidedPractice || ""}
                        onChange={e => handleChange("guidedPractice", e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-amber-200 text-sm"
                        placeholder="Close your eyes..."
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Daily Affirmations</label>
                    <textarea
                        rows={2}
                        value={formData.affirmations || ""}
                        onChange={e => handleChange("affirmations", e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-amber-200 text-sm"
                        placeholder="I am pure awareness..."
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Warnings / Notes</label>
                        <input
                            type="text"
                            value={formData.warningsOrNotes || ""}
                            onChange={e => handleChange("warningsOrNotes", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-amber-200 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-amber-800 uppercase mb-1">Common Misconceptions</label>
                        <input
                            type="text"
                            value={formData.misconceptions || ""}
                            onChange={e => handleChange("misconceptions", e.target.value)}
                            className="w-full p-2.5 rounded-lg border border-amber-200 text-sm"
                        />
                    </div>
                </div>
            </div>

            {/* Metadata */}
            <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 space-y-6">
                <h3 className="font-bold text-gray-900 border-b border-gray-200 pb-2">SEO Metadata</h3>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Meta Title</label>
                    <input
                        type="text"
                        value={formData.metaTitle || ""}
                        onChange={e => handleChange("metaTitle", e.target.value)}
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                    />
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Keywords (comma separated)</label>
                    <input
                        type="text"
                        value={formData.keywords?.join(", ") || ""}
                        onChange={e => handleChange("keywords", e.target.value.split(",").map(s => s.trim()))}
                        className="w-full p-2.5 rounded-lg border border-gray-200 text-sm"
                    />
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
