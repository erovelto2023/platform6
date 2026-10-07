import { useState, useTransition, useMemo, useEffect } from "react";
import { createGlossaryTerm, updateGlossaryTerm } from "@/lib/actions/glossary.actions";
import { getPersonalOffers } from "@/lib/actions/personal-affiliate.actions";
import { getHtmlCodeTools } from "@/lib/actions/html-code-tool.actions";
import { 
    Save, AlertCircle, Loader2, Link as LinkIcon, Rocket, Sparkles, BookOpen, Layers, ShieldCheck, 
    DollarSign, Wrench, Search, Trash, ExternalLink, Plus, Check, Code, HelpCircle, FileText, 
    UserCheck, Tag, History, Users, Compass, Lightbulb, CheckSquare, AlertTriangle
} from "lucide-react";
import { IGlossaryTerm, IQuestionVariation, IDeepPathway } from "@/lib/db/models/GlossaryTerm";
import { IDirectoryProduct } from "@/lib/db/models/DirectoryProduct";

interface GlossaryFormProps {
    initialData?: IGlossaryTerm;
    onComplete: () => void;
    products: IDirectoryProduct[];
}

function buildInitialFormData(initialData?: IGlossaryTerm): Partial<IGlossaryTerm> {
    return {
        id: initialData?.id || "",
        term: initialData?.term || "",
        slug: initialData?.slug || "",
        category: initialData?.category || "General",
        subCategory: initialData?.subCategory || "",
        shortDefinition: initialData?.shortDefinition || "",
        definition: initialData?.definition || "",

        // Featured Editorial Article
        articleTitle: initialData?.articleTitle || "",
        articleContent: initialData?.articleContent || "",

        // AEO & Entity Graph Layer
        aeoSummary: initialData?.aeoSummary || "",
        entityType: initialData?.entityType || "Core Concept",
        parentTermSlug: initialData?.parentTermSlug || "",
        childTermSlugs: initialData?.childTermSlugs || [],
        deepPathways: initialData?.deepPathways || [],
        questionVariations: initialData?.questionVariations || [],
        realWorldScenario: initialData?.realWorldScenario || { context: "", stepByStep: [], citableMetric: "", outcome: "" },

        // History, Meaning & Context
        origin: initialData?.origin || "",
        traditionalMeaning: initialData?.traditionalMeaning || "",
        modernUsage: initialData?.modernUsage || "",
        expandedExplanation: initialData?.expandedExplanation || "",

        // Practical Application
        howItWorks: initialData?.howItWorks || "",
        benefits: initialData?.benefits || "",
        commonPractices: initialData?.commonPractices || "",
        useCases: initialData?.useCases || "",
        whoUsesIt: initialData?.whoUsesIt || "",

        // Learning & Guidance
        beginnerExplanation: initialData?.beginnerExplanation || "",
        advancedPerspective: initialData?.advancedPerspective || "",
        misconceptions: initialData?.misconceptions || "",
        warningsOrNotes: initialData?.warningsOrNotes || "",

        // Media & Experience
        guidedPractice: initialData?.guidedPractice || "",
        affirmations: initialData?.affirmations || "",
        visualizations: initialData?.visualizations || "",
        audioOrVideoResources: initialData?.audioOrVideoResources || "",

        // Monetization & Business (MMO)
        howItMakesMoney: initialData?.howItMakesMoney || "",
        bestFor: initialData?.bestFor || "",
        gettingStartedChecklist: initialData?.gettingStartedChecklist || [],
        commonMistakes: initialData?.commonMistakes || "",
        realExamples: initialData?.realExamples || "",
        startupCost: initialData?.startupCost || "$0",
        timeToFirstDollar: initialData?.timeToFirstDollar || "",
        skillRequired: initialData?.skillRequired || "Beginner",
        platformPreference: initialData?.platformPreference || "",
        lowPhysicalEffort: initialData?.lowPhysicalEffort || false,

        // Relationships & Linking
        relatedTermIds: initialData?.relatedTermIds || [],
        synonyms: initialData?.synonyms || [],
        antonyms: initialData?.antonyms || [],
        oppositeTerms: initialData?.oppositeTerms || [],
        seeAlso: initialData?.seeAlso || [],
        recommendedTools: initialData?.recommendedTools || [],

        // SEO & Content Generation Sandbox
        whyItMatters: initialData?.whyItMatters || "",
        videoUrl: initialData?.videoUrl || "",
        faqs: initialData?.faqs || [],
        caseStudies: initialData?.caseStudies || [],
        takeaways: initialData?.takeaways || [],
        headlines: initialData?.headlines || [],
        youtubeTitles: initialData?.youtubeTitles || [],
        pinterestIdeas: initialData?.pinterestIdeas || [],
        instagramIdeas: initialData?.instagramIdeas || [],
        amazonProducts: initialData?.amazonProducts || [],
        websitesRanking: initialData?.websitesRanking || [],
        podcastsRanking: initialData?.podcastsRanking || [],

        // SEO & Metadata
        metaTitle: initialData?.metaTitle || "",
        metaDescription: initialData?.metaDescription || "",
        keywords: initialData?.keywords || [],
        tags: initialData?.tags || [],
        searchIntent: initialData?.searchIntent || "",
        contentLevel: initialData?.contentLevel || "Beginner",

        // Trust & Authority
        sources: initialData?.sources || "",
        lineageOrTradition: initialData?.lineageOrTradition || "",
        scientificPerspective: initialData?.scientificPerspective || "",
        culturalNotes: initialData?.culturalNotes || "",

        // Technical & Admin
        status: initialData?.status || "Published",
        authorOrReviewer: initialData?.authorOrReviewer || "KB Academy Editorial Board",
        aiTrainingEligible: initialData?.aiTrainingEligible !== false,
        sponsoredBy: initialData?.sponsoredBy || "",

        // Custom Selections
        selectedAffiliateOfferId: initialData?.selectedAffiliateOfferId || "",
        htmlCodeToolIds: initialData?.htmlCodeToolIds || [],

        // AI Generation Prompts
        imagePrompt: initialData?.imagePrompt || "",
        productPrompt: initialData?.productPrompt || "",
        socialPrompt: initialData?.socialPrompt || ""
    };
}

export default function GlossaryForm({ initialData, onComplete, products = [] }: GlossaryFormProps) {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const [productSearch, setProductSearch] = useState("");
    const [affiliateOffers, setAffiliateOffers] = useState<any[]>([]);
    const [htmlToolsList, setHtmlToolsList] = useState<any[]>([]);
    const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'directory' | 'affiliate'>('all');

    useEffect(() => {
        const fetchOffersAndTools = async () => {
            const [resOffers, resTools] = await Promise.all([
                getPersonalOffers(),
                getHtmlCodeTools()
            ]);
            if (resOffers.success && Array.isArray(resOffers.data)) {
                setAffiliateOffers(resOffers.data);
            }
            if (resTools.success && Array.isArray(resTools.data)) {
                setHtmlToolsList(resTools.data);
            }
        };
        fetchOffersAndTools();
    }, []);

    const [formData, setFormData] = useState<Partial<IGlossaryTerm>>(() => buildInitialFormData(initialData));

    // Keep state updated if initialData prop changes
    useEffect(() => {
        if (initialData) {
            setFormData(buildInitialFormData(initialData));
        }
    }, [initialData]);

    // Combine Directory Products + Personal Affiliate Offers
    const combinedCatalogItems = useMemo(() => {
        const directoryItems = products.map(p => ({
            keyId: `dir-${p.id}`,
            id: p.id,
            name: p.name,
            category: p.category || p.niche || 'Directory Product',
            link: p.affiliateLink || `/catalog/${p.slug || p.id}`,
            priceModel: p.priceModel,
            type: 'directory' as const,
            original: p
        }));

        const affiliateItems = affiliateOffers.map(o => ({
            keyId: `aff-${o._id}`,
            id: o._id,
            name: o.name,
            category: o.network || 'Affiliate Catalog Offer',
            link: o.affiliateLink,
            priceModel: undefined,
            type: 'affiliate' as const,
            original: o
        }));

        return [...directoryItems, ...affiliateItems];
    }, [products, affiliateOffers]);

    const filteredCatalogItems = useMemo(() => {
        let list = combinedCatalogItems;

        if (activeCatalogTab === 'directory') {
            list = list.filter(item => item.type === 'directory');
        } else if (activeCatalogTab === 'affiliate') {
            list = list.filter(item => item.type === 'affiliate');
        }

        if (productSearch.trim()) {
            const query = productSearch.toLowerCase();
            list = list.filter(item =>
                item.name.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query)
            );
        }

        return list;
    }, [combinedCatalogItems, activeCatalogTab, productSearch]);

    const attachedCatalogCount = useMemo(() => {
        const toolsCount = (formData.recommendedTools || []).length;
        const amazonCount = (formData.amazonProducts || []).filter(prod => {
            const isDirectoryInRec = (formData.recommendedTools || []).some(t => {
                const p = products.find(prodItem => String(prodItem.id) === String(t.productId));
                return p && p.name.toLowerCase().trim() === prod.name?.toLowerCase().trim();
            });
            return !isDirectoryInRec;
        }).length;
        return toolsCount + amazonCount;
    }, [formData.recommendedTools, formData.amazonProducts, products]);

    const handleToggleCatalogItem = (item: any) => {
        const currentTools = formData.recommendedTools || [];
        const currentAmazon = formData.amazonProducts || [];

        const isCurrentlyAttached =
            currentTools.some(t => String(t.productId) === String(item.id)) ||
            currentAmazon.some(p => p.name?.toLowerCase().trim() === item.name.toLowerCase().trim());

        if (isCurrentlyAttached) {
            const updatedTools = currentTools.filter(t => String(t.productId) !== String(item.id));
            const updatedAmazon = currentAmazon.filter(p => p.name?.toLowerCase().trim() !== item.name.toLowerCase().trim());

            setFormData(prev => ({
                ...prev,
                recommendedTools: updatedTools,
                amazonProducts: updatedAmazon
            }));
        } else {
            const updatedTools = [...currentTools];
            const numericId = Number(item.id);
            if (!isNaN(numericId) && item.id !== '' && !updatedTools.some(t => String(t.productId) === String(numericId))) {
                updatedTools.push({ productId: numericId, context: item.name });
            }

            const updatedAmazon = [...currentAmazon];
            if (!updatedAmazon.some(p => p.name?.toLowerCase().trim() === item.name.toLowerCase().trim())) {
                updatedAmazon.push({
                    name: item.name,
                    url: item.link || '',
                    description: `${item.type === 'affiliate' ? 'Affiliate Catalog Offer' : 'Directory Product'} (${item.category})`
                });
            }

            setFormData(prev => ({
                ...prev,
                recommendedTools: updatedTools,
                amazonProducts: updatedAmazon
            }));
        }
    };

    const handleUpdateToolContext = (productId: number, newContext: string) => {
        const updatedTools = (formData.recommendedTools || []).map(t => {
            if (t.productId === productId) {
                return { ...t, context: newContext };
            }
            return t;
        });
        setFormData(prev => ({ ...prev, recommendedTools: updatedTools }));
    };

    const handleChange = (field: keyof IGlossaryTerm, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleRemoveTool = (productId: number, productName?: string) => {
        const updatedTools = (formData.recommendedTools || []).filter(t => t.productId !== productId);
        let updatedAmazon = formData.amazonProducts || [];
        if (productName) {
            updatedAmazon = updatedAmazon.filter(p => p.name.toLowerCase() !== productName.toLowerCase());
        }
        setFormData(prev => ({
            ...prev,
            recommendedTools: updatedTools,
            amazonProducts: updatedAmazon
        }));
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
        <form onSubmit={handleSubmit} className="bg-slate-900 p-6 md:p-8 rounded-3xl shadow-2xl border border-slate-800 space-y-8 max-w-5xl mx-auto text-slate-100 font-sans">
            <div className="border-b border-slate-800 pb-6">
                <h2 className="text-2xl font-black text-slate-100 tracking-tight flex items-center gap-2 uppercase">
                    <Sparkles className="text-cyan-400" size={24} />
                    {initialData ? `Edit Term: ${initialData.term}` : "Create New Term"}
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-1">
                    Manage all 70+ term attributes, AEO snippets, editorial articles, custom tools, and monetization paths.
                </p>
            </div>

            {/* Core Info */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <BookOpen size={16} /> Core Concept &amp; Featured Editorial Article
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-full md:col-span-1">
                        <label className={labelClass}>Term Name *</label>
                        <input
                            required
                            type="text"
                            value={formData.term || ""}
                            onChange={e => handleChange("term", e.target.value)}
                            className="w-full p-3.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-100 focus:border-cyan-500 outline-none font-bold text-base shadow-inner"
                            placeholder="e.g. Affiliate Marketing"
                        />
                    </div>

                    <div className="col-span-full md:col-span-1">
                        <label className={labelClass}>URL Slug (Auto-generated if empty)</label>
                        <input
                            type="text"
                            value={formData.slug || ""}
                            onChange={e => handleChange("slug", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. affiliate-marketing"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Category</label>
                        <input
                            type="text"
                            value={formData.category || "General"}
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
                            value={formData.shortDefinition || ""}
                            onChange={e => handleChange("shortDefinition", e.target.value)}
                            className={inputClass}
                            placeholder="Foundational monetization model..."
                        />
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Full Definition / Concept</label>
                        <textarea
                            rows={6}
                            value={formData.definition || ""}
                            onChange={e => handleChange("definition", e.target.value)}
                            className={inputClass}
                            placeholder="## Detailed Concept Explanation..."
                        />
                    </div>

                    {/* Featured In-Depth Article Editor */}
                    <div className="col-span-full border-t border-slate-800/80 pt-4 space-y-4">
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label className={labelClass}>Featured Article Custom Title (Optional)</label>
                                <span className="text-[10px] font-mono text-cyan-400 font-bold bg-slate-900 border border-slate-800 px-2 py-0.5 rounded-md">In-Depth Editorial Article</span>
                            </div>
                            <input
                                type="text"
                                value={formData.articleTitle || ""}
                                onChange={e => handleChange("articleTitle", e.target.value)}
                                className={inputClass}
                                placeholder="e.g. Master Guide: How to Scale & Monetize 100 Animals Adult Coloring Books"
                            />
                        </div>

                        <div>
                            <label className={labelClass}>In-Depth Article Content (Markdown / HTML)</label>
                            <textarea
                                rows={10}
                                value={formData.articleContent || ""}
                                onChange={e => handleChange("articleContent", e.target.value)}
                                className={inputClass}
                                placeholder="Write or paste your full long-form masterclass article here. Renders directly under the Video Masterclass on the public page..."
                            />
                            <span className="text-[10px] font-mono text-slate-500 mt-1 block">Renders prominently in the Featured Editorial Masterclass Article section on the term page.</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* AEO & Entity Graph Optimization Section */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-cyan-900/60 space-y-6 shadow-xl text-slate-100">
                <h3 className="font-mono font-extrabold text-cyan-400 border-b border-cyan-900/60 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <Rocket size={16} className="text-cyan-400" />
                    AI-Search (AEO) &amp; Knowledge Graph Layer
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
                    <div className="col-span-full">
                        <label className={labelClass}>Child Term Slugs (Comma-separated)</label>
                        <input
                            type="text"
                            value={(formData.childTermSlugs || []).join(", ")}
                            onChange={e => handleChange("childTermSlugs", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className={inputClass}
                            placeholder="e.g. cpa-marketing, lead-generation, recurring-affiliate"
                        />
                    </div>

                    {/* Interactive User Intent Query Variations Builder */}
                    <div className="col-span-full border-t border-slate-800 pt-4 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                    <HelpCircle size={16} /> User Intent Query Variations (AEO Accordion)
                                </h4>
                                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                    Configure Q&amp;A pairs displayed in the User Intent &amp; Problem Query Variations section.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const current = formData.questionVariations || [];
                                    handleChange("questionVariations", [
                                        ...current,
                                        {
                                            question: `What is the best way to get started with ${formData.term || 'this term'}?`,
                                            intentType: "Problem-Solving",
                                            targetAnswer: `To get started, follow the action checklist, set up necessary tracking software, and test baseline offers.`
                                        }
                                    ]);
                                }}
                                className="px-3 py-1.5 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                                + Add Query Variation
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(formData.questionVariations || []).map((qv, idx) => (
                                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = (formData.questionVariations || []).filter((_, i) => i !== idx);
                                            handleChange("questionVariations", updated);
                                        }}
                                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 font-mono text-xs"
                                    >
                                        Remove ×
                                    </button>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">User Question / Query</label>
                                            <input
                                                type="text"
                                                value={qv.question || ""}
                                                onChange={e => {
                                                    const updated = [...(formData.questionVariations || [])];
                                                    updated[idx] = { ...updated[idx], question: e.target.value };
                                                    handleChange("questionVariations", updated);
                                                }}
                                                className={inputClass}
                                                placeholder="e.g. How does this term increase revenue?"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Intent Type</label>
                                            <select
                                                value={qv.intentType || "Informational"}
                                                onChange={e => {
                                                    const updated = [...(formData.questionVariations || [])];
                                                    updated[idx] = { ...updated[idx], intentType: e.target.value as any };
                                                    handleChange("questionVariations", updated);
                                                }}
                                                className={inputClass}
                                            >
                                                <option value="Informational">Informational</option>
                                                <option value="Transactional">Transactional</option>
                                                <option value="Commercial">Commercial</option>
                                                <option value="Problem-Solving">Problem-Solving</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Target Answer (Direct Answer)</label>
                                        <textarea
                                            rows={2}
                                            value={qv.targetAnswer || ""}
                                            onChange={e => {
                                                const updated = [...(formData.questionVariations || [])];
                                                updated[idx] = { ...updated[idx], targetAnswer: e.target.value };
                                                handleChange("questionVariations", updated);
                                            }}
                                            className={inputClass}
                                            placeholder="Fact-dense answer responding directly to the question..."
                                        />
                                    </div>
                                </div>
                            ))}
                            {(formData.questionVariations || []).length === 0 && (
                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs font-mono text-slate-500 italic">
                                    No custom query variations added. Default intent variations will render on the public page.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Meaning & Context */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-slate-200 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <History size={16} className="text-cyan-400" /> History, Meaning &amp; Context
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Origin &amp; Etymology</label>
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
                    <div className="col-span-full md:col-span-1">
                        <label className={labelClass}>Modern Usage</label>
                        <input
                            type="text"
                            value={formData.modernUsage || ""}
                            onChange={e => handleChange("modernUsage", e.target.value)}
                            className={inputClass}
                            placeholder="Current digital business usage..."
                        />
                    </div>
                    <div className="col-span-full">
                        <label className={labelClass}>Expanded History / Explanation</label>
                        <textarea
                            rows={3}
                            value={formData.expandedExplanation || ""}
                            onChange={e => handleChange("expandedExplanation", e.target.value)}
                            className={inputClass}
                            placeholder="Historical background and conceptual evolution..."
                        />
                    </div>
                </div>
            </div>

            {/* Practical Application */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-indigo-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Practical Application &amp; Practitioner Persona
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>How It Works (Mechanism)</label>
                        <textarea
                            rows={2}
                            value={formData.howItWorks || ""}
                            onChange={e => handleChange("howItWorks", e.target.value)}
                            className={inputClass}
                            placeholder="Operates by structuring workflows..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Key Benefits</label>
                        <textarea
                            rows={2}
                            value={formData.benefits || ""}
                            onChange={e => handleChange("benefits", e.target.value)}
                            className={inputClass}
                            placeholder="Increases operational efficiency..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Common Practices</label>
                        <input
                            type="text"
                            value={formData.commonPractices || ""}
                            onChange={e => handleChange("commonPractices", e.target.value)}
                            className={inputClass}
                            placeholder="Analytics audits, split testing..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Real-world Use Cases</label>
                        <input
                            type="text"
                            value={formData.useCases || ""}
                            onChange={e => handleChange("useCases", e.target.value)}
                            className={inputClass}
                            placeholder="Applied during landing page optimization..."
                        />
                    </div>
                    <div className="col-span-full">
                        <label className={labelClass}>Who Uses It (Practitioner Persona Audience)</label>
                        <input
                            type="text"
                            value={formData.whoUsesIt || ""}
                            onChange={e => handleChange("whoUsesIt", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Utilized by performance marketers, growth specialists, and online business operators."
                        />
                    </div>
                </div>
            </div>

            {/* Learning & Guidance */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-purple-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Lightbulb size={16} /> Learning, Guidance &amp; Safety
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Beginner Explanation (Simplified)</label>
                        <textarea
                            rows={3}
                            value={formData.beginnerExplanation || ""}
                            onChange={e => handleChange("beginnerExplanation", e.target.value)}
                            className={inputClass}
                            placeholder="Simplified plain-language summary for newcomers..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Advanced Perspective (Esoteric/Technical)</label>
                        <textarea
                            rows={3}
                            value={formData.advancedPerspective || ""}
                            onChange={e => handleChange("advancedPerspective", e.target.value)}
                            className={inputClass}
                            placeholder="Advanced technical analysis or deeper perspective..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Common Misconceptions (Myths vs. Reality)</label>
                        <textarea
                            rows={3}
                            value={formData.misconceptions || ""}
                            onChange={e => handleChange("misconceptions", e.target.value)}
                            className={inputClass}
                            placeholder="Structured setup guarantees scalable performance..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Ethical, Safety &amp; Compliance Notes</label>
                        <textarea
                            rows={3}
                            value={formData.warningsOrNotes || ""}
                            onChange={e => handleChange("warningsOrNotes", e.target.value)}
                            className={inputClass}
                            placeholder="Ensure compliance with privacy regulations (GDPR/CCPA)..."
                        />
                    </div>
                </div>
            </div>

            {/* Media & Experience */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-amber-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Compass size={16} /> Media, Mindset &amp; Guided Practices
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Guided Practice / Exercise Text</label>
                        <textarea
                            rows={3}
                            value={formData.guidedPractice || ""}
                            onChange={e => handleChange("guidedPractice", e.target.value)}
                            className={inputClass}
                            placeholder="Step-by-step meditation or practical exercise prompt..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Affirmations / Mindset Statements</label>
                        <textarea
                            rows={3}
                            value={formData.affirmations || ""}
                            onChange={e => handleChange("affirmations", e.target.value)}
                            className={inputClass}
                            placeholder="Conscious mindset statements..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Visualizations</label>
                        <textarea
                            rows={2}
                            value={formData.visualizations || ""}
                            onChange={e => handleChange("visualizations", e.target.value)}
                            className={inputClass}
                            placeholder="Imagery practices..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Audio or Video Resource Links</label>
                        <textarea
                            rows={2}
                            value={formData.audioOrVideoResources || ""}
                            onChange={e => handleChange("audioOrVideoResources", e.target.value)}
                            className={inputClass}
                            placeholder="Embeds or external links..."
                        />
                    </div>
                </div>
            </div>

            {/* Monetization & Business (MMO) */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-emerald-900/60 space-y-6">
                <h3 className="font-mono font-bold text-emerald-400 border-b border-emerald-900/60 pb-2 flex items-center gap-2 text-xs uppercase tracking-wider">
                    <DollarSign size={16} />
                    Monetization &amp; Business (MMO)
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

                    {/* Featured Affiliate Catalog Product Selection */}
                    <div className="col-span-full bg-slate-900 border border-purple-900/60 p-4 rounded-xl space-y-2">
                        <div className="flex items-center justify-between">
                            <label className={labelClass}>Featured Affiliate Catalog Product (Sidebar Banner Override)</label>
                            <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950 border border-purple-800 px-2 py-0.5 rounded-md">
                                Affiliate Catalog Selection
                            </span>
                        </div>
                        <p className="text-[11px] font-mono text-slate-400">
                            Select a specific product from your Affiliate Catalog (https://kbusinessacademy.com/admin/affiliate-catalog) to display on this page. If unselected, a random product will be shown.
                        </p>
                        <select
                            value={formData.selectedAffiliateOfferId || ""}
                            onChange={e => handleChange("selectedAffiliateOfferId", e.target.value)}
                            className={inputClass}
                        >
                            <option value="">-- Random Product from Affiliate Catalog (Default) --</option>
                            {affiliateOffers.map((offer: any) => (
                                <option key={offer._id} value={offer._id}>
                                    {offer.name} {offer.network ? `(${offer.network})` : ''} {offer.productPrice ? `- ${offer.productPrice}` : ''}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Best For (Target Audience)</label>
                        <textarea
                            rows={2}
                            value={formData.bestFor || ""}
                            onChange={e => handleChange("bestFor", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Digital entrepreneurs, affiliate marketers, e-commerce store owners..."
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
                            placeholder="e.g. Web-based, Shopify, WordPress"
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
                            placeholder="Select target offer and establish tracking metrics&#10;Set up recommended software&#10;Launch baseline strategy"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Common Mistakes</label>
                        <textarea
                            rows={3}
                            value={formData.commonMistakes || ""}
                            onChange={e => handleChange("commonMistakes", e.target.value)}
                            className={inputClass}
                            placeholder="Rushing execution without proper tracking..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Real Example / Case Study</label>
                        <textarea
                            rows={3}
                            value={formData.realExamples || ""}
                            onChange={e => handleChange("realExamples", e.target.value)}
                            className={inputClass}
                            placeholder="Short case study quote..."
                        />
                    </div>
                </div>
            </div>

            {/* Trust, Authority & Admin Control */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-sky-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <UserCheck size={16} /> Trust, Authority &amp; Editorial Information
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className={labelClass}>Publication Status</label>
                        <select
                            value={formData.status || "Published"}
                            onChange={e => handleChange("status", e.target.value)}
                            className={inputClass}
                        >
                            <option value="Draft">Draft</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Published">Published</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelClass}>Author / Reviewer Name</label>
                        <input
                            type="text"
                            value={formData.authorOrReviewer || "KB Academy Editorial Board"}
                            onChange={e => handleChange("authorOrReviewer", e.target.value)}
                            className={inputClass}
                            placeholder="KB Academy Editorial Board"
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Sponsored By (Vendor / Partner)</label>
                        <input
                            type="text"
                            value={formData.sponsoredBy || ""}
                            onChange={e => handleChange("sponsoredBy", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. ClickFunnels"
                        />
                    </div>

                    <div className="col-span-full">
                        <label className={labelClass}>Sources &amp; Citations Text</label>
                        <textarea
                            rows={2}
                            value={formData.sources || ""}
                            onChange={e => handleChange("sources", e.target.value)}
                            className={inputClass}
                            placeholder="Reference papers, books, or documentation..."
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Lineage or Tradition</label>
                        <input
                            type="text"
                            value={formData.lineageOrTradition || ""}
                            onChange={e => handleChange("lineageOrTradition", e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Scientific Perspective</label>
                        <input
                            type="text"
                            value={formData.scientificPerspective || ""}
                            onChange={e => handleChange("scientificPerspective", e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div>
                        <label className={labelClass}>Cultural Notes</label>
                        <input
                            type="text"
                            value={formData.culturalNotes || ""}
                            onChange={e => handleChange("culturalNotes", e.target.value)}
                            className={inputClass}
                        />
                    </div>

                    <div className="col-span-full flex items-center gap-3 p-4 bg-slate-900 rounded-xl border border-slate-800">
                        <div className="flex-1">
                            <h4 className="font-bold text-slate-100 text-xs">AI Training Eligible</h4>
                            <p className="text-[10px] text-slate-400 font-mono">Allow this term data to be indexed for internal AI search &amp; training.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input 
                                type="checkbox" 
                                checked={formData.aiTrainingEligible !== false}
                                onChange={e => handleChange("aiTrainingEligible", e.target.checked)}
                                className="sr-only peer"
                            />
                            <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-slate-300 after:border-slate-800 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                        </label>
                    </div>
                </div>
            </div>

            {/* SEO & Metadata Expansion */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-slate-200 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Tag size={16} className="text-cyan-400" /> SEO &amp; Content Generation Sandbox
                </h3>
                
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
                            placeholder="https://youtu.be/8z5t3dRqOxo"
                        />
                        <p className="text-[10px] text-slate-400 font-mono mt-1">
                            Leave blank to use default placeholder video (https://youtu.be/8z5t3dRqOxo).
                        </p>
                    </div>

                    {/* Deep Content Pathways & Conversion Funnels Editor */}
                    <div className="col-span-full pt-4 border-t border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                    <Rocket size={16} /> Deep Content Pathways &amp; Conversion Funnels
                                </h4>
                                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                    Link high-converting blog posts, strategy guides, or affiliate funnels. Defaults to https://kbusinessacademy.com/blog if empty.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => {
                                    const current = formData.deepPathways || [];
                                    handleChange("deepPathways", [
                                        ...current,
                                        {
                                            title: "Comprehensive Strategy Guide",
                                            url: "https://kbusinessacademy.com/blog",
                                            type: "blog",
                                            description: "Read step-by-step strategy guides on the KBusiness Academy Blog."
                                        }
                                    ]);
                                }}
                                className="px-3 py-1.5 bg-cyan-950 border border-cyan-800 hover:bg-cyan-900 text-cyan-300 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-1 cursor-pointer"
                            >
                                + Add Default Blog Pathway
                            </button>
                        </div>

                        <div className="space-y-3">
                            {(formData.deepPathways || []).map((pathway, idx) => (
                                <div key={idx} className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 relative group">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const updated = (formData.deepPathways || []).filter((_, i) => i !== idx);
                                            handleChange("deepPathways", updated);
                                        }}
                                        className="absolute right-3 top-3 text-slate-500 hover:text-rose-400 font-mono text-xs"
                                    >
                                        Remove ×
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        <div className="sm:col-span-2">
                                            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Pathway Title</label>
                                            <input
                                                type="text"
                                                value={pathway.title || ""}
                                                onChange={e => {
                                                    const updated = [...(formData.deepPathways || [])];
                                                    updated[idx] = { ...updated[idx], title: e.target.value };
                                                    handleChange("deepPathways", updated);
                                                }}
                                                className={inputClass}
                                                placeholder="e.g. Master Guide to CRO"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Pathway Type</label>
                                            <select
                                                value={pathway.type || "blog"}
                                                onChange={e => {
                                                    const updated = [...(formData.deepPathways || [])];
                                                    updated[idx] = { ...updated[idx], type: e.target.value as any };
                                                    handleChange("deepPathways", updated);
                                                }}
                                                className={inputClass}
                                            >
                                                <option value="blog">Blog Guide</option>
                                                <option value="tool">Software Tool</option>
                                                <option value="product">Digital Product</option>
                                                <option value="conversion">Conversion Funnel</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">URL Link</label>
                                        <input
                                            type="text"
                                            value={pathway.url || ""}
                                            onChange={e => {
                                                const updated = [...(formData.deepPathways || [])];
                                                updated[idx] = { ...updated[idx], url: e.target.value };
                                                handleChange("deepPathways", updated);
                                            }}
                                            className={inputClass}
                                            placeholder="https://kbusinessacademy.com/blog"
                                        />
                                    </div>

                                    <div>
                                        <label className="text-[10px] font-mono font-bold uppercase text-slate-400 block mb-1">Description</label>
                                        <input
                                            type="text"
                                            value={pathway.description || ""}
                                            onChange={e => {
                                                const updated = [...(formData.deepPathways || [])];
                                                updated[idx] = { ...updated[idx], description: e.target.value };
                                                handleChange("deepPathways", updated);
                                            }}
                                            className={inputClass}
                                            placeholder="Short description of where this pathway leads..."
                                        />
                                    </div>
                                </div>
                            ))}

                            {(formData.deepPathways || []).length === 0 && (
                                <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center text-xs font-mono text-slate-500 italic">
                                    No custom pathways added. Will default to https://kbusinessacademy.com/blog on the public term page.
                                </div>
                            )}
                        </div>
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

                {/* Related Resources & Tools Database Picker */}
                <div className="pt-6 mt-6 border-t border-slate-800 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div>
                            <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                <LinkIcon size={16} /> Related Resources / Tools
                            </h4>
                            <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                Select tools or resources from the database to recommend with this term:
                            </p>
                        </div>
                        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                            {(formData.recommendedTools || []).length} Selected
                        </span>
                    </div>

                    {/* Filter Tabs & Search */}
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setActiveCatalogTab('all')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeCatalogTab === 'all'
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                            >
                                <Layers size={13} /> All Items ({combinedCatalogItems.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveCatalogTab('directory')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeCatalogTab === 'directory'
                                        ? 'bg-cyan-600 text-white shadow-md'
                                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                            >
                                <Wrench size={13} /> Directory Products ({products.length})
                            </button>
                            <button
                                type="button"
                                onClick={() => setActiveCatalogTab('affiliate')}
                                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                                    activeCatalogTab === 'affiliate'
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                                }`}
                            >
                                <LinkIcon size={13} /> Affiliate Catalog ({affiliateOffers.length})
                            </button>
                        </div>

                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                            <input
                                type="text"
                                value={productSearch}
                                onChange={e => setProductSearch(e.target.value)}
                                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-xl text-xs font-mono text-slate-100 placeholder:text-slate-500 outline-none"
                                placeholder="Search products..."
                            />
                        </div>
                    </div>

                    {/* Interactive 2-Column Grid Card Checkbox Picker */}
                    <div className="bg-slate-950 border border-slate-800/90 rounded-2xl p-4 max-h-80 overflow-y-auto custom-scrollbar">
                        {filteredCatalogItems.length === 0 ? (
                            <div className="p-4 text-xs text-slate-400 italic text-center font-mono">
                                No tools or resources found matching your search filter.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                                {filteredCatalogItems.map(item => {
                                    const isAttached = (formData.recommendedTools || []).some(t => String(t.productId) === String(item.id)) ||
                                        (formData.amazonProducts || []).some(p => p.name?.toLowerCase().trim() === item.name.toLowerCase().trim());

                                    return (
                                        <div
                                            key={item.keyId}
                                            onClick={() => handleToggleCatalogItem(item)}
                                            className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3.5 group select-none ${
                                                isAttached
                                                    ? 'bg-slate-900/90 border-cyan-500/90 shadow-lg shadow-cyan-950/40'
                                                    : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors ${
                                                isAttached
                                                    ? 'bg-cyan-500 text-slate-950 font-black'
                                                    : 'bg-slate-950 border border-slate-700 group-hover:border-slate-500'
                                            }`}>
                                                {isAttached && <Check size={14} strokeWidth={3} />}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h5 className={`font-black text-xs truncate transition-colors ${isAttached ? 'text-cyan-300' : 'text-slate-100'}`}>
                                                    {item.name}
                                                </h5>
                                                <p className="text-[10px] font-mono text-cyan-400/90 truncate mt-0.5 font-semibold">
                                                    {item.category} {item.original?.niche ? `• ${item.original.niche}` : ''}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Attached Tools List */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className={labelClass}>
                                Currently Attached Tools &amp; Products ({attachedCatalogCount})
                            </label>
                        </div>

                        {attachedCatalogCount === 0 ? (
                            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl text-xs text-slate-400 italic text-center font-mono">
                                No database tools or affiliate offers attached yet. Check boxes above to link software or products to this term.
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {(formData.recommendedTools || []).map((tool, idx) => {
                                    const matchedProduct = products.find(p => String(p.id) === String(tool.productId));
                                    const name = matchedProduct?.name || tool.context || `Tool #${tool.productId}`;
                                    const link = matchedProduct?.affiliateLink || (matchedProduct ? `/catalog/${matchedProduct.slug || matchedProduct.id}` : "");

                                    return (
                                        <div key={`rec-${idx}`} className="p-3.5 bg-slate-900 border border-slate-800 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 ${matchedProduct?.logoColor || "bg-cyan-600"}`}>
                                                    {name.charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-100 text-xs">{name}</span>
                                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/80 font-bold">
                                                            Directory Product
                                                        </span>
                                                        {link && (
                                                            <a href={link} target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline flex items-center gap-0.5 text-[10px]">
                                                                Link <ExternalLink size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <div className="mt-1 flex items-center gap-2">
                                                        <span className="text-[10px] text-slate-400 font-mono shrink-0">Best For Context:</span>
                                                        <input
                                                            type="text"
                                                            value={tool.context || ""}
                                                            onChange={e => handleUpdateToolContext(Number(tool.productId), e.target.value)}
                                                            className="text-xs bg-slate-950 border border-slate-800 rounded-lg px-2 py-0.5 text-slate-200 focus:outline-none focus:border-cyan-500 flex-1"
                                                            placeholder="e.g. Best for automated email marketing..."
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleRemoveTool(Number(tool.productId), matchedProduct?.name)}
                                                className="p-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-lg transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
                                                title="Detach tool"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    );
                                })}

                                {(formData.amazonProducts || []).map((prod, idx) => {
                                    const isDirectoryInRec = (formData.recommendedTools || []).some(t => {
                                        const p = products.find(prodItem => String(prodItem.id) === String(t.productId));
                                        return p && p.name.toLowerCase().trim() === prod.name?.toLowerCase().trim();
                                    });
                                    if (isDirectoryInRec) return null;

                                    return (
                                        <div key={`aff-${idx}`} className="p-3.5 bg-slate-900 border border-purple-900/60 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0 flex-1">
                                                <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-black text-xs shrink-0 bg-purple-600">
                                                    {(prod.name || "A").charAt(0)}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-bold text-slate-100 text-xs">{prod.name}</span>
                                                        <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-800/80 font-bold">
                                                            Affiliate Catalog Offer
                                                        </span>
                                                        {prod.url && (
                                                            <a href={prod.url} target="_blank" rel="noopener noreferrer" className="text-purple-400 hover:underline flex items-center gap-0.5 text-[10px]">
                                                                Link <ExternalLink size={10} />
                                                            </a>
                                                        )}
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">
                                                        {prod.description || prod.url || "Attached Affiliate Offer"}
                                                    </p>
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const updatedAmazon = (formData.amazonProducts || []).filter(p => p.name?.toLowerCase().trim() !== prod.name?.toLowerCase().trim());
                                                    setFormData(prev => ({ ...prev, amazonProducts: updatedAmazon }));
                                                }}
                                                className="p-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800/80 text-rose-300 rounded-lg transition-colors shrink-0 self-end sm:self-auto cursor-pointer"
                                                title="Detach offer"
                                            >
                                                <Trash size={14} />
                                            </button>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Attached HTML CODE Tools Section */}
                    <div className="pt-6 mt-6 border-t border-slate-800 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                            <div>
                                <h4 className="font-mono font-bold text-cyan-400 text-xs uppercase tracking-wider flex items-center gap-2">
                                    <Code size={16} /> Attached HTML CODE Tools
                                </h4>
                                <p className="text-[11px] text-slate-400 font-sans mt-0.5">
                                    Select custom HTML/JS code tools from your HTML CODE Tools library to embed into this glossary page:
                                </p>
                            </div>
                            <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-cyan-950 text-cyan-400 border border-cyan-800/60">
                                {(formData.htmlCodeToolIds || []).length} Tools Attached
                            </span>
                        </div>

                        {htmlToolsList.length === 0 ? (
                            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-center text-xs font-mono text-slate-400 italic">
                                No HTML CODE Tools created yet. You can create them in <a href="/admin/html-code-tools" target="_blank" className="text-cyan-400 underline font-bold">Admin -&gt; HTML CODE Tools</a>.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto p-2 bg-slate-950 border border-slate-800 rounded-2xl">
                                {htmlToolsList.map((tool: any) => {
                                    const isAttached = (formData.htmlCodeToolIds || []).includes(tool._id);

                                    return (
                                        <div
                                            key={tool._id}
                                            onClick={() => {
                                                const current = formData.htmlCodeToolIds || [];
                                                const updated = isAttached
                                                    ? current.filter((id: string) => id !== tool._id)
                                                    : [...current, tool._id];
                                                handleChange("htmlCodeToolIds", updated);
                                            }}
                                            className={`p-3 rounded-xl border cursor-pointer flex items-center gap-3 transition-all select-none ${
                                                isAttached
                                                    ? 'bg-cyan-950/80 border-cyan-500 text-cyan-200 shadow-md shadow-cyan-950/40'
                                                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                                            }`}
                                        >
                                            <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                                                isAttached ? 'bg-cyan-500 text-slate-950 font-black' : 'border border-slate-700'
                                            }`}>
                                                {isAttached && <Check size={12} strokeWidth={3} />}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h5 className="font-bold text-xs truncate">{tool.name}</h5>
                                                <p className="text-[10px] font-mono text-slate-400 truncate">
                                                    [html-tool:{tool.slug}]
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-800 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className={labelClass}>Standard Meta Title</label>
                        <input
                            type="text"
                            value={formData.metaTitle || ""}
                            onChange={e => handleChange("metaTitle", e.target.value)}
                            className={inputClass}
                            placeholder="e.g. Affiliate Marketing - Complete Guide 2026"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Standard Meta Description</label>
                        <input
                            type="text"
                            value={formData.metaDescription || ""}
                            onChange={e => handleChange("metaDescription", e.target.value)}
                            className={inputClass}
                            placeholder="Search engine meta description..."
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Keywords (comma separated)</label>
                        <input
                            type="text"
                            value={(formData.keywords || []).join(", ")}
                            onChange={e => handleChange("keywords", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className={inputClass}
                            placeholder="affiliate, marketing, passive income"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Freeform Tags (comma separated)</label>
                        <input
                            type="text"
                            value={(formData.tags || []).join(", ")}
                            onChange={e => handleChange("tags", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className={inputClass}
                            placeholder="monetization, strategy, beginner"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Synonyms / Also Known As (comma separated)</label>
                        <input
                            type="text"
                            value={(formData.synonyms || []).join(", ")}
                            onChange={e => handleChange("synonyms", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className={inputClass}
                            placeholder="performance marketing, partner marketing"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Antonyms / Opposite Terms (comma separated)</label>
                        <input
                            type="text"
                            value={(formData.antonyms || []).join(", ")}
                            onChange={e => handleChange("antonyms", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className={inputClass}
                        />
                    </div>
                    <div>
                        <label className={labelClass}>See Also Slugs (comma separated)</label>
                        <input
                            type="text"
                            value={(formData.seeAlso || []).join(", ")}
                            onChange={e => handleChange("seeAlso", e.target.value.split(",").map(s => s.trim()).filter(Boolean))}
                            className={inputClass}
                            placeholder="seo, digital-marketing, conversion-rate"
                        />
                    </div>
                    <div>
                        <label className={labelClass}>Search Intent</label>
                        <input
                            type="text"
                            value={formData.searchIntent || ""}
                            onChange={e => handleChange("searchIntent", e.target.value)}
                            className={inputClass}
                            placeholder="Informational, Commercial, etc."
                        />
                    </div>
                </div>
            </div>

            {/* AI Prompts Section */}
            <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 space-y-6">
                <h3 className="font-mono font-bold text-cyan-400 border-b border-slate-800 pb-2 text-xs uppercase tracking-wider flex items-center gap-2">
                    <Sparkles size={16} /> AI Generation Prompts
                </h3>
                
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
