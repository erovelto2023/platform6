"use client";

import { useState, useTransition } from "react";
import { createDirectoryProduct, updateDirectoryProduct } from "@/lib/actions/directory-product.actions";
import { IDirectoryProduct } from "@/lib/db/models/DirectoryProduct";

export default function ProductForm({ initialData, onComplete }: { initialData?: IDirectoryProduct, onComplete?: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [message, setMessage] = useState("");

    async function handleSubmit(formData: FormData) {
        setMessage("");

        // Helper to split comma-separated strings
        const split = (key: string) => (formData.get(key) as string)?.split(",").map((s) => s.trim()).filter(Boolean) || [];

        const data: any = {
            // Core Info
            name: formData.get("name"),
            slug: formData.get("slug") || undefined,
            logoUrl: formData.get("logoUrl"),
            niche: formData.get("niche"),
            category: formData.get("category"),

            // Directory Type
            type: formData.get("type"),
            resourceType: formData.get("resourceType"),
            author: formData.get("author"),

            shortDescription: formData.get("shortDescription"),
            description: formData.get("description"),

            // Affiliate & Revenue
            affiliateLink: formData.get("affiliateLink"),
            ctaButtonText: formData.get("ctaButtonText"),
            commissionRate: formData.get("commissionRate"),
            affiliateNetwork: formData.get("affiliateNetwork"),

            // Classification & Pricing
            priceModel: formData.get("priceModel"),
            startingPrice: Number(formData.get("startingPrice")) || undefined,
            freeTrialDuration: formData.get("freeTrialDuration"),
            deal: formData.get("deal"),
            skillLevel: formData.get("skillLevel"),

            // Details
            tags: split("tags"),
            featured: formData.get("featured") === "on",
            pros: split("pros"),
            cons: split("cons"),
            features: split("features"),
            supportedPlatforms: split("supportedPlatforms"),
            alternativeTo: formData.get("alternativeTo"),

            // Trust & Media
            videoUrl: formData.get("videoUrl"),
            refundPolicy: formData.get("refundPolicy"),
            supportOptions: split("supportOptions"),

            // SEO
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
                setMessage(initialData ? "Product updated!" : "Product created successfully!");
                if (onComplete) onComplete();
            }
        });
    }

    return (
        <form action={handleSubmit} className="bg-zinc-950 p-6 rounded-lg shadow-sm border border-zinc-800 lg:p-10">
            <h2 className="text-xl font-black text-white border-b border-zinc-800 pb-4 mb-6 uppercase tracking-tight">
                {initialData ? `Edit Tool: ${initialData.name}` : "Add New Tool"}
            </h2>

            {/* Core Info */}
            <section className="mb-8">
                <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wide text-xs opacity-60">Core Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Tool Name *</label>
                        <input name="name" defaultValue={initialData?.name} required className="input-field" placeholder="e.g. SEMrush" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Slug (URL) *</label>
                        <input name="slug" defaultValue={initialData?.slug} className="input-field" placeholder="e.g. semrush-review" />
                        <p className="text-[10px] text-zinc-500 mt-1 font-bold uppercase">Leave blank to auto-generate from name.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Logo URL</label>
                        <div className="flex gap-4 items-start">
                            <input name="logoUrl" defaultValue={initialData?.logoUrl} className="input-field" placeholder="https://..." />
                            {initialData?.logoUrl && (
                                <div className="w-[42px] h-[42px] shrink-0 bg-white rounded-lg p-1 border border-zinc-800 flex items-center justify-center">
                                    <img src={initialData.logoUrl} alt="Logo preview" className="max-w-full max-h-full object-contain mix-blend-multiply" />
                                </div>
                            )}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Niche *</label>
                        <input name="niche" defaultValue={initialData?.niche} required className="input-field" placeholder="e.g. SEO" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Category *</label>
                        <input name="category" defaultValue={initialData?.category} required className="input-field" placeholder="e.g. All-in-One" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Directory Type *</label>
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
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Resource Type</label>
                        <input name="resourceType" defaultValue={initialData?.resourceType} className="input-field" placeholder="e.g. eBook, Template" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Author / Creator</label>
                        <input name="author" defaultValue={initialData?.author} className="input-field" placeholder="e.g. Name or Company" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Short Description</label>
                        <input name="shortDescription" defaultValue={initialData?.shortDescription} className="input-field" placeholder="One-line summary for cards" />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Full Description *</label>
                        <textarea name="description" defaultValue={initialData?.description} required rows={6} className="input-field font-mono text-xs" placeholder="Detailed review/description (Markdown supported)" />
                    </div>
                </div>
            </section>

            {/* Affiliate & Revenue */}
            <section className="mb-8 p-6 bg-emerald-950/20 border border-emerald-900/30 rounded-2xl">
                <h3 className="text-md font-bold text-emerald-400 mb-4 uppercase tracking-wide text-xs">Revenue & Affiliate</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-emerald-300 mb-1">Affiliate Link *</label>
                        <input name="affiliateLink" defaultValue={initialData?.affiliateLink} className="input-field border-emerald-900/50 focus:ring-emerald-500" placeholder="https://partner.xyz/..." />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-emerald-300 mb-1">Button Text</label>
                        <input name="ctaButtonText" defaultValue={initialData?.ctaButtonText || "Visit Website"} className="input-field border-emerald-900/50" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-emerald-300 mb-1">Deal / Special Offer</label>
                        <input name="deal" defaultValue={initialData?.deal} className="input-field border-emerald-900/50" placeholder="e.g. 50% off" />
                    </div>
                </div>
            </section>

            {/* Classification */}
            <section className="mb-8">
                <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wide text-xs opacity-60">Classification & Pricing</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Price Model *</label>
                        <select name="priceModel" defaultValue={initialData?.priceModel} className="input-field">
                            <option value="Paid">Paid</option>
                            <option value="Freemium">Freemium</option>
                            <option value="Free">Free</option>
                            <option value="One-time">One-time</option>
                        </select>
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Price ($)</label>
                        <input type="number" step="0.01" name="startingPrice" defaultValue={initialData?.startingPrice} className="input-field" placeholder="29.00" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Free Trial</label>
                        <input name="freeTrialDuration" defaultValue={initialData?.freeTrialDuration} className="input-field" placeholder="e.g. 14 Days" />
                    </div>
                    <div className="md:col-span-1">
                        <label className="block text-sm font-bold text-zinc-300 mb-1">Skill Level</label>
                        <select name="skillLevel" defaultValue={initialData?.skillLevel} className="input-field">
                            <option value="Beginner Friendly">Beginner Friendly</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Technical/Developer">Technical/Developer</option>
                        </select>
                    </div>
                </div>
            </section>

            {/* Details & Features */}
            <section className="mb-8 border-t pt-6 border-zinc-800">
                <h3 className="text-md font-bold text-white mb-4 uppercase tracking-wide text-xs opacity-60">The Details</h3>
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-1">Tags (comma separated)</label>
                            <input name="tags" defaultValue={initialData?.tags?.join(", ")} className="input-field" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-zinc-300 mb-1">Alternative To (SEO)</label>
                            <input name="alternativeTo" defaultValue={initialData?.alternativeTo} className="input-field" placeholder="e.g. Salesforce" />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-bold text-emerald-400 mb-1">Pros (comma separated)</label>
                            <textarea name="pros" defaultValue={initialData?.pros?.join(", ")} rows={4} className="input-field border-emerald-900/30 focus:ring-emerald-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-pink-400 mb-1">Cons (comma separated)</label>
                            <textarea name="cons" defaultValue={initialData?.cons?.join(", ")} rows={4} className="input-field border-pink-900/30 focus:ring-pink-500" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-blue-400 mb-1">Key Features</label>
                            <textarea name="features" defaultValue={initialData?.features?.join(", ")} rows={4} className="input-field border-blue-900/30 focus:ring-blue-500" />
                        </div>
                    </div>
                </div>
            </section>

            <div className="pt-8 flex gap-4 border-t border-zinc-800 mt-10">
                <button
                    type="submit"
                    disabled={isPending}
                    className="flex-1 bg-white text-black font-black py-4 rounded-xl hover:bg-zinc-200 transition-all uppercase tracking-widest disabled:opacity-50"
                >
                    {isPending ? 'Processing...' : (initialData ? 'Update Directory Entry' : 'Publish to Directory')}
                </button>
            </div>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    border-radius: 0.75rem;
                    border: 1px solid #27272a;
                    padding: 0.75rem 1rem;
                    font-size: 0.875rem;
                    outline: none;
                    transition: all 0.2s;
                    background: #18181b;
                    color: white;
                }
                .input-field:focus {
                    background: #09090b;
                    border-color: #a855f7;
                    box-shadow: 0 0 0 2px rgba(168, 85, 247, 0.2);
                }
            `}</style>

            {message && <p className={`mt-6 p-4 rounded-xl font-bold text-center ${message.startsWith('Error') ? 'bg-pink-950/50 text-pink-400 border border-pink-900' : 'bg-emerald-950/50 text-emerald-400 border border-emerald-900'}`}>{message}</p>}
        </form>
    );
}
