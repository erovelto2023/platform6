"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createOffer, updateOffer } from '@/lib/actions/offer.actions';
import { 
    Save, Globe, Code, Megaphone, DollarSign, Zap, 
    Wand2, ShoppingBag, Layers, Plus, Trash2, 
    BarChart3, Eye, Check, ArrowLeft 
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { SMART_VARIABLES } from '@/lib/constants/smart-variables';
import Link from 'next/link';

interface OfferBuilderFormProps {
    initialData?: any;
}

export default function OfferBuilderForm({ initialData }: OfferBuilderFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [slugModified, setSlugModified] = useState(!!initialData?._id);
    const [copiedVar, setCopiedVar] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        description: initialData?.description || '',
        keywords: initialData?.keywords || '',
        headerCode: initialData?.headerCode || '',
        bodyCode: initialData?.bodyCode || '',
        footerCode: initialData?.footerCode || '',
        isPublished: initialData?.isPublished ?? false,
        showInMarketplace: initialData?.showInMarketplace ?? false,
        pageType: initialData?.pageType || 'sales',
        price: initialData?.price || '',
        buyUrl: initialData?.buyUrl || '',
        ogTitle: initialData?.ogTitle || '',
        ogDescription: initialData?.ogDescription || '',
        ogImage: initialData?.ogImage || '',
        marketplaceTitle: initialData?.marketplaceTitle || '',
        marketplaceDescription: initialData?.marketplaceDescription || '',
        marketplaceImage: initialData?.marketplaceImage || '',
        marketplaceColor: initialData?.marketplaceColor || '#3b82f6',
        useColorAsDefault: initialData?.useColorAsDefault ?? true,
        marketplaceFeatures: initialData?.marketplaceFeatures || ['Instant Access', 'Premium Content'],
        abEnabled: initialData?.abEnabled ?? false,
        bodyCodeB: initialData?.bodyCodeB || '',
        recurring: initialData?.recurring ?? false,
    });

    // Stats
    const views = initialData?.views || 0;
    const clicks = initialData?.clicks || 0;
    const cvr = views > 0 ? ((clicks / views) * 100).toFixed(2) : "0.00";

    const viewsA = initialData?.viewsA || 0;
    const clicksA = initialData?.clicksA || 0;
    const cvrA = viewsA > 0 ? ((clicksA / viewsA) * 100).toFixed(2) : "0.00";

    const viewsB = initialData?.viewsB || 0;
    const clicksB = initialData?.clicksB || 0;
    const cvrB = viewsB > 0 ? ((clicksB / viewsB) * 100).toFixed(2) : "0.00";

    const generateSlug = (text: string) => {
        return text
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/[\s_-]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const result = initialData?._id 
                ? await updateOffer(initialData._id, formData)
                : await createOffer(formData);
            
            if (result.success) {
                toast.success('Offer saved successfully!');
                if (!initialData?._id) {
                    router.push('/admin/offers');
                }
            } else {
                toast.error('Error: ' + result.error);
            }
        } catch (error) {
            toast.error('Failed to save offer');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const next = { ...prev, [name]: val };
            if (name === 'name' && !slugModified) {
                next.slug = generateSlug(value);
            }
            return next;
        });

        if (name === 'slug') {
            setSlugModified(true);
        }
    };

    const handleSwitchChange = (name: string, val: boolean) => {
        setFormData(prev => ({ ...prev, [name]: val }));
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        setCopiedVar(text);
        setTimeout(() => setCopiedVar(null), 2000);
        toast.info(`Copied ${text}`);
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.marketplaceFeatures];
        newFeatures[index] = value;
        setFormData(prev => ({ ...prev, marketplaceFeatures: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({ ...prev, marketplaceFeatures: [...prev.marketplaceFeatures, ''] }));
    };

    const removeFeature = (index: number) => {
        setFormData(prev => ({
            ...prev,
            marketplaceFeatures: prev.marketplaceFeatures.filter((_: string, i: number) => i !== index)
        }));
    };

    const handleSmartPaste = () => {
        const fullCode = prompt("Paste your full HTML code here. I will automatically split it into Header, Body, and Footer fields:");
        if (!fullCode) return;

        let header = '';
        let body = '';
        let footer = '';

        const headMatch = fullCode.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
        if (headMatch) header = headMatch[1].trim();

        const bodyMatch = fullCode.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        if (bodyMatch) {
            body = bodyMatch[1].trim();
            const scriptMatches = body.match(/<script[\s\S]*?<\/script>|<img[^>]*tracking\.groovesell[\s\S]*?>/gi);
            if (scriptMatches) {
                const lastItems = scriptMatches.filter(s => s.toLowerCase().includes('tracking') || s.toLowerCase().includes('toggle') || s.toLowerCase().includes('modal'));
                if (lastItems.length > 0) {
                    footer = lastItems.join('\n');
                    lastItems.forEach(item => { body = body.replace(item, '').trim(); });
                }
            }
        } else if (!fullCode.includes('<html')) {
            // If it's just a snippet, put it in body
            body = fullCode.trim();
        }

        if (header || body) {
            setFormData(prev => ({
                ...prev,
                headerCode: header || prev.headerCode,
                bodyCode: body || prev.bodyCode,
                footerCode: footer || prev.footerCode
            }));
            toast.success("Code successfully split into respective fields!");
        } else {
            toast.error("Could not identify <body> tags. Please paste standard HTML.");
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-6xl mx-auto space-y-12 pb-20">
            {/* Header Control Panel */}
            <div className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 bg-white/80 backdrop-blur-md p-6 rounded-3xl border border-slate-200 shadow-xl border-t-blue-500 border-t-4 transition-all">
                <div className="flex items-center gap-6">
                    <Link href="/admin/offers">
                        <Button variant="ghost" size="icon">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600">Offer Builder</span>
                        <h2 className="text-xl font-black text-slate-900 truncate max-w-[200px]">{formData.name || 'Untitled Offer'}</h2>
                    </div>

                    <div className="h-10 w-[1px] bg-slate-200 hidden md:block"></div>

                    <div className="hidden lg:flex gap-1 bg-slate-100 p-1 rounded-2xl">
                        <button type="button" onClick={() => scrollToSection('section-basics')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Basics</button>
                        <button type="button" onClick={() => scrollToSection('section-stats')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Analytics</button>
                        <button type="button" onClick={() => scrollToSection('section-content')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Engineering</button>
                        <button type="button" onClick={() => scrollToSection('section-monetization')} className="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all text-slate-500 hover:text-slate-900 hover:bg-white/50">Economics</button>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button type="button" variant="outline" onClick={handleSmartPaste} className="gap-2 rounded-2xl">
                        <Wand2 className="h-4 w-4" /> Import Code
                    </Button>
                    <Button type="submit" disabled={loading} className="gap-2 rounded-2xl bg-blue-600 hover:bg-blue-700">
                        <Save className="h-4 w-4" /> Save Offer
                    </Button>
                </div>
            </div>

            {/* QUICK STATS BAR */}
            <section id="section-stats" className="scroll-mt-32">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-slate-50 text-slate-400 rounded-2xl"><Globe size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Views</span>
                            <span className="block text-2xl font-black text-slate-900">{views.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Buy Clicks</span>
                            <span className="block text-2xl font-black text-green-600">{clicks.toLocaleString()}</span>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4">
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><BarChart3 size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Avg Conversion</span>
                            <span className="block text-2xl font-black text-blue-600">{cvr}%</span>
                        </div>
                    </div>
                    <div className={`${formData.abEnabled ? 'bg-sky-600' : 'bg-blue-600'} p-6 rounded-3xl shadow-lg flex items-center gap-4 text-white transition-colors`}>
                        <div className="p-3 bg-white/10 rounded-2xl"><Layers size={20} /></div>
                        <div>
                            <span className="block text-[10px] font-black text-white/70 uppercase tracking-widest">A/B Status</span>
                            <span className="block text-lg font-black">{formData.abEnabled ? 'Active Test' : 'Single Version'}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* MAIN FORM SECTIONS */}
            <div className="space-y-16">
                {/* 1. BASIC INFO */}
                <section id="section-basics" className="scroll-mt-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl"><Globe size={24} /></div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Configuration</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Offer Name</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} required className="rounded-2xl font-bold text-lg h-14" placeholder="Ultimate Marketing Course" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">URL Slug</Label>
                                <div className="flex items-center">
                                    <span className="bg-slate-50 border border-r-0 border-slate-200 px-4 py-[15px] rounded-l-2xl text-slate-400 font-bold text-sm">/offers/</span>
                                    <Input name="slug" value={formData.slug} onChange={handleChange} required className="rounded-l-none rounded-r-2xl font-bold text-blue-600 h-14" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Page Type</Label>
                                <select 
                                    name="pageType" 
                                    value={formData.pageType} 
                                    onChange={handleChange} 
                                    className="w-full h-14 px-5 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold bg-white appearance-none cursor-pointer"
                                >
                                    <option value="sales">Sales Page</option>
                                    <option value="upsell">Upsell Page</option>
                                    <option value="downsell">Downsell Page</option>
                                    <option value="thank-you">Thank You Page</option>
                                </select>
                            </div>
                        </div>

                        <div className="flex items-center gap-8 pt-4">
                            <div className="flex items-center gap-2">
                                <Switch checked={formData.isPublished} onCheckedChange={(val) => handleSwitchChange('isPublished', val)} />
                                <Label className="font-bold">Published</Label>
                            </div>
                            <div className="flex items-center gap-2">
                                <Switch checked={formData.recurring} onCheckedChange={(val) => handleSwitchChange('recurring', val)} />
                                <Label className="font-bold">Recurring Subscription</Label>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. ENGINEERING & CONTENT */}
                <section id="section-content" className="scroll-mt-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-sky-50 text-sky-600 rounded-2xl"><Code size={24} /></div>
                                <div>
                                    <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Engineering Lab</h3>
                                    <p className="text-sm text-slate-500 font-medium font-bold">Build your high-converting HTML environment.</p>
                                </div>
                            </div>

                            {/* SMART VARIABLES */}
                            <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest px-2">Smart Variables</span>
                                <div className="flex flex-wrap gap-2">
                                    {Object.keys(SMART_VARIABLES).map(key => (
                                        <Button
                                            key={key}
                                            type="button"
                                            variant="secondary"
                                            size="sm"
                                            onClick={() => copyToClipboard(key)}
                                            className="h-8 text-[10px] font-black uppercase rounded-xl bg-white border border-slate-200"
                                        >
                                            {copiedVar === key ? <Check className="h-3 w-3 text-green-500" /> : <Zap className="h-3 w-3 mr-1" />}
                                            {key.replace(/{|}/g, '')}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Header (CSS / Styles)</Label>
                                <textarea name="headerCode" value={formData.headerCode} onChange={handleChange} rows={6} className="w-full p-6 rounded-3xl border border-slate-200 font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="<style>...</style>" />
                            </div>
                            <div className="space-y-3">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Footer (Scripts)</Label>
                                <textarea name="footerCode" value={formData.footerCode} onChange={handleChange} rows={6} className="w-full p-6 rounded-3xl border border-slate-200 font-mono text-xs bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="<script>...</script>" />
                            </div>
                        </div>

                        <div className="space-y-8 p-8 bg-slate-50 rounded-[3rem] border border-slate-100">
                            <div className="flex flex-wrap items-center justify-between gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="p-3 bg-white text-blue-600 rounded-2xl shadow-sm"><Layers size={24} /></div>
                                    <div>
                                        <h4 className="text-xl font-black text-slate-900 uppercase tracking-tight">Main Content</h4>
                                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mt-1">Version A: Primary Control Group</p>
                                    </div>
                                </div>

                                <label className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl border border-slate-200 cursor-pointer hover:border-blue-300 transition-all shadow-sm">
                                    <input type="checkbox" name="abEnabled" checked={formData.abEnabled} onChange={handleChange} className="w-5 h-5 rounded-lg border-slate-300 text-blue-600 focus:ring-blue-500" />
                                    <div className="text-left leading-none">
                                        <span className="block text-[10px] font-black text-slate-800 uppercase tracking-widest">A/B Testing</span>
                                        <span className="text-[9px] text-slate-400 font-bold">50/50 Traffic Split</span>
                                    </div>
                                </label>
                            </div>

                            <div className="group space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.3em]">Version A (Master)</span>
                                    <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase">
                                        <span>{viewsA} Views</span>
                                        <span className="text-green-600">{cvrA}% CV</span>
                                    </div>
                                </div>
                                <textarea name="bodyCode" value={formData.bodyCode} onChange={handleChange} required rows={15} className="w-full p-8 rounded-[2rem] border-2 border-slate-200 focus:border-blue-500 outline-none font-mono text-sm bg-white shadow-lg" placeholder="Enter Version A HTML here..." />
                            </div>

                            {formData.abEnabled && (
                                <div className="group space-y-4 animate-in slide-in-from-top-4 duration-500">
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-black text-sky-600 uppercase tracking-[0.3em]">Version B (Challenger)</span>
                                        <div className="flex gap-4 text-[10px] font-bold text-slate-400 uppercase">
                                            <span>{viewsB} Views</span>
                                            <span className="text-sky-600">{cvrB}% CV</span>
                                        </div>
                                    </div>
                                    <textarea name="bodyCodeB" value={formData.bodyCodeB} onChange={handleChange} rows={15} className="w-full p-8 rounded-[2rem] border-2 border-sky-200 focus:border-sky-500 outline-none font-mono text-sm bg-white shadow-lg" placeholder="Enter Version B HTML here..." />
                                </div>
                            )}
                        </div>
                    </div>
                </section>

                {/* 3. ECONOMICS & MARKETPLACE */}
                <section id="section-monetization" className="scroll-mt-32">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Transaction Details */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-green-50 text-green-600 rounded-2xl"><DollarSign size={24} /></div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Economics</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Checkout Link</Label>
                                    <div className="flex items-center">
                                        <span className="bg-slate-50 border border-r-0 border-slate-200 px-4 py-[14px] rounded-l-2xl text-slate-400 font-bold text-xs">BUYURL</span>
                                        <Input type="url" name="buyUrl" value={formData.buyUrl} onChange={handleChange} className="rounded-l-none rounded-r-2xl h-12 font-bold" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price ($)</Label>
                                        <Input type="number" name="price" value={formData.price} onChange={handleChange} className="rounded-2xl h-12 font-black text-xl text-green-600" placeholder="97" />
                                    </div>
                                    <div className="flex flex-col justify-end">
                                        <label className="flex items-center gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-100 transition-all font-black text-[10px] uppercase tracking-widest text-blue-600">
                                            <input type="checkbox" name="showInMarketplace" checked={formData.showInMarketplace} onChange={handleChange} className="w-5 h-5 rounded-lg border-blue-300 text-blue-600" />
                                            Marketplace View
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Marketplace Card Settings */}
                        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-8">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-slate-900 text-white rounded-2xl"><ShoppingBag size={24} /></div>
                                <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Marketplace Card</h3>
                            </div>
                            <div className="space-y-6">
                                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex items-center justify-between">
                                    <div>
                                        <span className="block text-[10px] font-black text-slate-800 uppercase tracking-widest">Card Priority</span>
                                        <span className="block text-[9px] text-slate-400 font-bold uppercase italic">Visual lead element</span>
                                    </div>
                                    <div className="flex bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData(prev => ({ ...prev, useColorAsDefault: false }))}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${!formData.useColorAsDefault ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                                        >Image</button>
                                        <button 
                                            type="button" 
                                            onClick={() => setFormData(prev => ({ ...prev, useColorAsDefault: true }))}
                                            className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all ${formData.useColorAsDefault ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'}`}
                                        >Color</button>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Brand Color</Label>
                                        <div className="flex items-center gap-3">
                                            <input type="color" name="marketplaceColor" value={formData.marketplaceColor} onChange={handleChange} className="w-12 h-12 rounded-xl cursor-pointer border-none p-0" />
                                            <Input value={formData.marketplaceColor} onChange={handleChange} name="marketplaceColor" className="rounded-xl font-mono text-xs" />
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Card Image URL</Label>
                                        <Input type="url" name="marketplaceImage" value={formData.marketplaceImage} onChange={handleChange} className="rounded-xl font-medium text-xs" placeholder="https://..." />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <Label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Card Description</Label>
                                    <Input name="marketplaceDescription" value={formData.marketplaceDescription} onChange={handleChange} className="rounded-xl font-bold text-xs" />
                                </div>
                                <div className="space-y-3">
                                    <Label className="flex items-center justify-between text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                                        Highlights
                                        <Button type="button" variant="ghost" size="icon" onClick={addFeature} className="h-6 w-6 text-blue-600"><Plus size={16}/></Button>
                                    </Label>
                                    <div className="grid grid-cols-1 gap-2">
                                        {formData.marketplaceFeatures.map((f: string, i: number) => (
                                            <div key={i} className="flex gap-2">
                                                <Input value={f} onChange={(e) => handleFeatureChange(i, e.target.value)} className="rounded-xl h-8 text-[10px] font-bold bg-slate-50 uppercase tracking-widest" />
                                                <Button type="button" variant="ghost" size="icon" onClick={() => removeFeature(i)} className="h-8 w-8 text-red-400"><Trash2 size={14}/></Button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 4. SEO & SOCIAL */}
                <section id="section-seo" className="scroll-mt-32">
                    <div className="bg-white p-10 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-10">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-orange-50 text-orange-600 rounded-2xl"><Megaphone size={24} /></div>
                            <h3 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Social Visibility</h3>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            <div className="space-y-6">
                                <Label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Search Engine Settings</Label>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600">Meta Description</Label>
                                        <textarea name="description" value={formData.description} onChange={handleChange} rows={3} className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600">Meta Keywords</Label>
                                        <Input name="keywords" value={formData.keywords} onChange={handleChange} className="rounded-xl" />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <Label className="block text-[10px] font-black text-blue-500 uppercase tracking-[0.2em] animate-pulse">Social Preview Injection</Label>
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600">OpenGraph Image URL</Label>
                                        <Input type="url" name="ogImage" value={formData.ogImage} onChange={handleChange} className="rounded-xl text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600">Override Title</Label>
                                        <Input name="ogTitle" value={formData.ogTitle} onChange={handleChange} className="rounded-xl text-xs" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-xs font-bold text-slate-600">Override Description</Label>
                                        <textarea name="ogDescription" value={formData.ogDescription} onChange={handleChange} rows={2} className="w-full p-4 rounded-2xl border border-slate-200 text-sm font-medium focus:ring-2 focus:ring-blue-500 outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </form>
    );
}
