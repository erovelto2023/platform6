"use client";

import { useState, useTransition } from "react";
import { createDirectoryProduct, updateDirectoryProduct } from "@/lib/actions/directory-product.actions";
import { IDirectoryProduct } from "@/lib/db/models/DirectoryProduct";
import MediaPicker from "./MediaPicker";
import AffiliateLinkPicker from "./AffiliateCatalog/AffiliateLinkPicker";

export default function ProductForm({ initialData, onComplete }: { initialData?: IDirectoryProduct, onComplete?: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");
    const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || "");
    const [affiliateLink, setAffiliateLink] = useState(initialData?.affiliateLink || "");

    async function handleSubmit(formData: FormData) {
        setMessage("");
        formData.set("logoUrl", logoUrl);
        formData.set("affiliateLink", affiliateLink);

        const split = (key: string) => (formData.get(key) as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [];

        const data: any = {
            name: formData.get("name"),
            slug: formData.get("slug") || undefined,
            logoUrl: formData.get("logoUrl"),
            niche: formData.get("niche"),
            category: formData.get("category"),
            type: formData.get("type"),
            resourceType: formData.get("resourceType"),
            author: formData.get("author"),
            shortDescription: formData.get("shortDescription"),
            description: formData.get("description"),
            affiliateLink: formData.get("affiliateLink"),
            ctaButtonText: formData.get("ctaButtonText"),
            commissionRate: formData.get("commissionRate"),
            affiliateNetwork: formData.get("affiliateNetwork"),
            priceModel: formData.get("priceModel"),
            startingPrice: Number(formData.get("startingPrice")) || undefined,
            freeTrialDuration: formData.get("freeTrialDuration"),
            deal: formData.get("deal"),
            skillLevel: formData.get("skillLevel"),
            tags: split("tags"),
            featured: formData.get("featured") === "on",
            pros: split("pros"),
            cons: split("cons"),
            features: split("features"),
            supportedPlatforms: split("supportedPlatforms"),
            alternativeTo: formData.get("alternativeTo"),
            videoUrl: formData.get("videoUrl"),
            refundPolicy: formData.get("refundPolicy"),
            supportOptions: split("supportOptions"),
            metaTitle: formData.get("metaTitle"),
            metaDescription: formData.get("metaDescription"),
        };

        if (initialData) {
            data.id = initialData.id;
        }

        startTransition(async () => {
            const result = initialData ? await updateDirectoryProduct(data) : await createDirectoryProduct(data);
            if (result.error) {
                setMessage("Error: " + result.error);
            } else {
                setMessage(initialData ? "Product updated successfully!" : "Product created successfully!");
                if (onComplete) onComplete();
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-slate-900 p-6 md:p-10 rounded-3xl border border-slate-800 shadow-2xl space-y-8 font-sans">
            <div className="border-b border-slate-800 pb-4 flex items-center justify-between">
                <h2 className="text-xl md:text-2xl font-black text-slate-100 uppercase tracking-tight">
                    {initialData ? `Edit Tool: ${initialData.name}` : "Add New Tool"}
                </h2>
                <span className="px-3 py-1 bg-cyan-950 border border-cyan-800 text-cyan-300 text-xs font-mono font-bold rounded-full">
                    RECOMMENDED TOOL SYSTEM
                </span>
            </div>

            {/* Core Info */}
            <section className="space-y-4">
                <h3 className="text-xs font-black text-cyan-400 uppercase tracking-widest block border-b border-slate-800/80 pb-2">
                    Core Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Tool Name *</label>
                        <input name="name" defaultValue={initialData?.name} required className="input-field" placeholder="e.g. SEMrush" />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Slug (URL) *</label>
                        <input name="slug" defaultValue={initialData?.slug} className="input-field" placeholder="e.g. semrush-review" />
                        <p className="text-[10px] text-cyan-400 mt-1 font-mono font-bold uppercase">Leave blank to auto-generate from name.</p>
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Logo URL</label>
                        <div className="flex flex-col gap-3">
                            <div className="flex gap-3 items-center">
                                <input 
                                    name="logoUrl" 
                                    value={logoUrl} 
                                    onChange={(e) => setLogoUrl(e.target.value)}
                                    className="input-field" 
                                    placeholder="https://..." 
                                />
                                <MediaPicker onSelect={setLogoUrl} />
                            </div>
                            {logoUrl && (
                                <div className="w-20 h-20 shrink-0 bg-slate-950 rounded-2xl p-2 border border-slate-800 flex items-center justify-center shadow-xl">
                                    <img src={logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Niche *</label>
                        <input name="niche" defaultValue={initialData?.niche} required className="input-field" placeholder="e.g. SEO" />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Category *</label>
                        <input name="category" defaultValue={initialData?.category} required className="input-field" placeholder="e.g. All-in-One" />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Directory Type *</label>
                        <select name="type" defaultValue={initialData?.type || 'tool'} className="input-field font-bold">
                            <option value="tool">Tool / Software</option>
                            <option value="resource">Resource / Template</option>
                            <option value="course">Course / Education</option>
                            <option value="service">Service / Agency</option>
                            <option value="platform">Platform / Network</option>
                            <option value="community">Community</option>
                            <option value="deal">Deal / Offer</option>
                            <option value="program">Affiliate Program</option>
                            <option value="media">Media / Content (Blog, Podcast)</option>
                            <option value="event">Event / Conference</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Resource Type</label>
                        <input name="resourceType" defaultValue={initialData?.resourceType} className="input-field" placeholder="e.g. eBook, Template" />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Author / Creator</label>
                        <input name="author" defaultValue={initialData?.author} className="input-field" placeholder="e.g. Name or Company" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Short Description</label>
                        <input name="shortDescription" defaultValue={initialData?.shortDescription} className="input-field" placeholder="One-line summary for cards" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Full Description *</label>
                        <textarea name="description" defaultValue={initialData?.description} required rows={6} className="input-field font-mono text-xs" placeholder="Detailed review/description (Markdown supported)" />
                    </div>
                </div>
            </section>

            {/* Affiliate & Revenue */}
            <section className="p-6 bg-slate-950 border border-emerald-800/60 rounded-2xl space-y-4 shadow-xl">
                <h3 className="text-xs font-black text-emerald-400 uppercase tracking-widest block border-b border-emerald-900/50 pb-2">
                    Revenue & Affiliate Links
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <div className="flex items-center justify-between mb-1.5">
                            <label className="block text-xs font-extrabold text-emerald-300 uppercase tracking-wider">Affiliate Link *</label>
                            <AffiliateLinkPicker onSelect={setAffiliateLink} useTrackingLink={false} />
                        </div>
                        <input 
                            name="affiliateLink" 
                            value={affiliateLink} 
                            onChange={(e) => setAffiliateLink(e.target.value)}
                            className="input-field border-emerald-800/80 text-emerald-200 font-mono" 
                            placeholder="https://partner.xyz/..." 
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">Button Text</label>
                        <input name="ctaButtonText" defaultValue={initialData?.ctaButtonText || "Visit Website"} className="input-field border-emerald-800/60" />
                    </div>
                    <div>
                        <label className="block text-xs font-extrabold text-emerald-300 uppercase tracking-wider mb-1.5">Deal / Special Offer</label>
                        <input name="deal" defaultValue={initialData?.deal} className="input-field border-emerald-800/60" placeholder="e.g. 50% off" />
                    </div>
                </div>
            </section>

            {/* Classification */}
            <section className="space-y-4">
                <h3 className="text-xs font-black text-purple-400 uppercase tracking-widest block border-b border-slate-800/80 pb-2">
                    Classification & Pricing
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Price Model *</label>
                        <select name="priceModel" defaultValue={initialData?.priceModel} className="input-field">
                            <option value="Paid">Paid</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Free">Free</option>
                            <option value="One-time">One-time</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Price ($)</label>
                        <input type="number" step="0.01" name="startingPrice" defaultValue={initialData?.startingPrice} className="input-field" placeholder="29.00" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Free Trial</label>
                        <input name="freeTrialDuration" defaultValue={initialData?.freeTrialDuration} className="input-field" placeholder="e.g. 14 Days" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Skill Level</label>
                        <select name="skillLevel" defaultValue={initialData?.skillLevel} className="input-field">
                            <option value="Beginner Friendly">Beginner Friendly</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Technical/Developer">Technical/Developer</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Details & Features */}
            <section className="space-y-4 border-t border-slate-800 pt-6">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest block border-b border-slate-800/80 pb-2">
                    Features & Comparison
                </h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Tags (comma separated)</label>
                            <input name="tags" defaultValue={initialData?.tags?.join(", ")} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-xs font-extrabold text-slate-200 uppercase tracking-wider mb-1.5">Alternative To (SEO)</label>
                            <input name="alternativeTo" defaultValue={initialData?.alternativeTo} className="input-field" placeholder="e.g. Salesforce" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-xs font-extrabold text-emerald-400 uppercase tracking-wider mb-1.5">Pros (comma separated)</label>
                            <textarea name="pros" defaultValue={initialData?.pros?.join(", ")} rows={4} className="input-field border-emerald-800/50" />
                        </div>
                        <div>
                            <label className="block text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-1.5">Cons (comma separated)</label>
                            <textarea name="cons" defaultValue={initialData?.cons?.join(", ")} rows={4} className="input-field border-indigo-800/50" />
                        </div>
                        <div>
                            <label className="block text-xs font-extrabold text-blue-400 uppercase tracking-wider mb-1.5">Key Features</label>
                            <textarea name="features" defaultValue={initialData?.features?.join(", ")} rows={4} className="input-field border-blue-800/50" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="pt-6 border-t border-slate-800">
                <button
                    type="submit"
                    disabled={isPending}
                    className="w-full bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-extrabold py-4 rounded-2xl transition-all uppercase tracking-widest shadow-xl shadow-indigo-600/30 disabled:opacity-50 cursor-pointer"
                >
                    {isPending ? 'Processing...' : (initialData ? 'Update Directory Entry' : 'Publish to Directory')}
                </button>
            </div>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    border-radius: 0.85rem;
                    border: 1px solid #334155;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all 0.2s;
                    background: #090d16;
                    color: #f8fafc;
                }
                .input-field:focus {
                    background: #020617;
                    border-color: #38bdf8;
                    box-shadow: 0 0 0 2px rgba(56, 189, 248, 0.25);
                }
                .input-field option {
                    background: #090d16;
                    color: #f8fafc;
                }
            `}</style>

            {message && (
                <p className={`p-4 rounded-2xl font-bold text-center text-xs ${
                    message.startsWith('Error')
                        ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                        : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                }`}>
                    {message}
                </p>
            )}
        </form>
    );
}
