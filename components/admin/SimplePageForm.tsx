"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createPage, updatePage } from '@/lib/actions/page-builder.actions';
import { Save, ArrowLeft, Code, Globe, Laptop, Smartphone } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface SimplePageFormProps {
    initialData?: any;
}

export default function SimplePageForm({ initialData }: SimplePageFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [view, setView] = useState<'edit' | 'preview'>('edit');
    const [device, setDevice] = useState<'desktop' | 'mobile'>('desktop');

    const [formData, setFormData] = useState({
        name: initialData?.name || '',
        slug: initialData?.slug || '',
        html: initialData?.sections?.[0]?.customHTML || '',
        isPublished: initialData?.isPublished ?? false,
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const data = {
                name: formData.name,
                slug: formData.slug,
                isPublished: formData.isPublished,
                sections: [
                    {
                        templateId: 'custom-html',
                        order: 0,
                        customHTML: formData.html,
                        content: {},
                        style: {}
                    }
                ]
            };

            const result = initialData?._id 
                ? await updatePage(initialData._id, data)
                : await createPage(data);
            
            if (result.success) {
                toast.success('Page saved successfully!');
                if (!initialData?._id) {
                    router.push('/admin/page-builder-simple');
                }
            } else {
                toast.error('Error: ' + result.error);
            }
        } catch (error) {
            toast.error('Failed to save page');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    return (
        <div className="max-w-6xl mx-auto space-y-8 pb-20">
            <div className="flex items-center justify-between bg-white p-6 rounded-3xl border border-slate-200 shadow-sm sticky top-0 z-10">
                <div className="flex items-center gap-4">
                    <Link href="/admin/page-builder-simple">
                        <Button variant="ghost" size="icon" className="rounded-full">
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                    </Link>
                    <div>
                        <h2 className="text-xl font-black text-slate-900">{initialData?._id ? 'Edit Page' : 'Create Simple Page'}</h2>
                        <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Pure HTML Mode</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-1 rounded-xl mr-4">
                        <Button 
                            variant={view === 'edit' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            onClick={() => setView('edit')}
                            className="rounded-lg text-xs font-bold"
                        >
                            <Code size={14} className="mr-2" /> Editor
                        </Button>
                        <Button 
                            variant={view === 'preview' ? 'secondary' : 'ghost'} 
                            size="sm" 
                            onClick={() => setView('preview')}
                            className="rounded-lg text-xs font-bold"
                        >
                            <Globe size={14} className="mr-2" /> Preview
                        </Button>
                    </div>
                    <Button onClick={handleSubmit} disabled={loading} className="rounded-xl bg-sky-600 hover:bg-sky-700 gap-2">
                        <Save size={18} /> Save Page
                    </Button>
                </div>
            </div>

            {view === 'edit' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                            <div className="space-y-2">
                                <Label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Page HTML Content</Label>
                                <textarea 
                                    name="html"
                                    value={formData.html}
                                    onChange={handleChange}
                                    className="w-full h-[600px] p-8 rounded-3xl border-2 border-slate-100 focus:border-sky-500 outline-none font-mono text-sm bg-slate-50/50"
                                    placeholder="Paste your pure HTML code here..."
                                />
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">
                        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-6">
                            <h3 className="font-black text-slate-900 uppercase tracking-tight">Settings</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">Page Name</Label>
                                    <Input name="name" value={formData.name} onChange={handleChange} placeholder="My Landing Page" className="rounded-xl" />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs font-bold text-slate-500">URL Slug</Label>
                                    <Input name="slug" value={formData.slug} onChange={handleChange} placeholder="landing-page" className="rounded-xl font-mono text-sky-600" />
                                </div>
                                <div className="flex items-center gap-3 pt-2">
                                    <input 
                                        type="checkbox" 
                                        id="published"
                                        checked={formData.isPublished}
                                        onChange={(e) => setFormData(prev => ({ ...prev, isPublished: e.target.checked }))}
                                        className="w-5 h-5 rounded border-slate-300 text-sky-600"
                                    />
                                    <Label htmlFor="published" className="font-bold cursor-pointer">Published</Label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-sky-50 p-8 rounded-[2.5rem] border border-sky-100 space-y-4">
                            <h4 className="font-black text-sky-900 uppercase tracking-tight text-sm">Pro Tip</h4>
                            <p className="text-xs text-sky-700 font-medium leading-relaxed">
                                You can paste full HTML documents including <code>&lt;style&gt;</code> tags. Our system will automatically isolate the styles to prevent them from affecting the admin interface.
                            </p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex justify-center gap-4">
                        <Button 
                            variant={device === 'desktop' ? 'secondary' : 'outline'} 
                            size="sm" 
                            onClick={() => setDevice('desktop')}
                            className="rounded-xl"
                        >
                            <Laptop size={16} className="mr-2" /> Desktop
                        </Button>
                        <Button 
                            variant={device === 'mobile' ? 'secondary' : 'outline'} 
                            size="sm" 
                            onClick={() => setDevice('mobile')}
                            className="rounded-xl"
                        >
                            <Smartphone size={16} className="mr-2" /> Mobile
                        </Button>
                    </div>
                    <div className={`mx-auto bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden transition-all duration-500 ${device === 'mobile' ? 'max-w-[375px]' : 'max-w-full'}`}>
                        <div className="h-6 bg-slate-100 flex items-center px-4 gap-1">
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                            <div className="w-2 h-2 rounded-full bg-slate-300" />
                        </div>
                        <div className="min-h-[600px] w-full bg-white">
                            <iframe 
                                title="Preview"
                                srcDoc={`
                                    <!DOCTYPE html>
                                    <html>
                                        <head>
                                            <meta charset="utf-8">
                                            <style>body { margin: 0; padding: 0; }</style>
                                        </head>
                                        <body>${formData.html}</body>
                                    </html>
                                `}
                                className="w-full h-[800px] border-none"
                            />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
