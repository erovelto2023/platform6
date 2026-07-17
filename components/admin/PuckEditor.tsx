"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/lib/actions/page-builder.actions";
import { toast } from "sonner";
import { puckConfig } from "@/lib/puck-config";
import { useState, useRef } from "react";
import { ArrowLeft, Download, Upload, Lock } from "lucide-react";
import Link from "next/link";
import { PageTheme, defaultTheme } from "@/lib/theme-config";

interface PuckEditorProps {
    initialData?: {
        _id?: string;
        name: string;
        slug: string;
        isPublished: boolean;
        metaTitle?: string;
        metaDescription?: string;
        headerCode?: string;
        bodyCode?: string;
        footerCode?: string;
        accessControl?: "free" | "student" | "admin";
        theme?: Partial<PageTheme>;
        sections?: Array<{
            templateId: string;
            content: any;
            style: any;
            order: number;
            customHTML?: string;
        }>;
    } | null;
}

const FONT_OPTIONS = [
  { label: "Inter (Modern Sans)", value: "inter" },
  { label: "Roboto (Clean Sans)", value: "roboto" },
  { label: "Outfit (Geometric)", value: "outfit" },
  { label: "Georgia (Classic Serif)", value: "georgia" },
  { label: "Merriweather (Editorial)", value: "merriweather" },
];

const RADIUS_OPTIONS = [
  { label: "Sharp (0px)", value: "sharp" },
  { label: "Soft (4px)", value: "soft" },
  { label: "Rounded (12px)", value: "rounded" },
  { label: "Pill (9999px)", value: "pill" },
];

export function PuckEditor({ initialData }: PuckEditorProps) {
  const router = useRouter();
  
  const [name, setName] = useState(initialData?.name || "Untitled Page");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [isPublished, setIsPublished] = useState(initialData?.isPublished || false);
  const [metaTitle, setMetaTitle] = useState(initialData?.metaTitle || "");
  const [metaDescription, setMetaDescription] = useState(initialData?.metaDescription || "");
  const [headerCode, setHeaderCode] = useState(initialData?.headerCode || "");
  const [bodyCode, setBodyCode] = useState(initialData?.bodyCode || "");
  const [footerCode, setFooterCode] = useState(initialData?.footerCode || "");
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState<"seo" | "code" | "theme">("seo");
  const [accessControl, setAccessControl] = useState<"free" | "student" | "admin">(initialData?.accessControl || "free");

  // Theme State
  const [theme, setTheme] = useState<PageTheme>({
    ...defaultTheme,
    ...initialData?.theme,
  });
  const updateTheme = (key: keyof PageTheme, value: string) =>
    setTheme((t) => ({ ...t, [key]: value }));

  // Parse existing Puck JSON or start empty
  let initialPuckData = {};
  if (initialData?.sections?.[0]?.templateId === 'puck-blocks' && initialData?.sections?.[0]?.customHTML) {
      try {
          initialPuckData = JSON.parse(initialData.sections[0].customHTML);
      } catch (e) {
          console.error("Failed to parse Puck data", e);
      }
  }

  const [puckData, setPuckData] = useState(initialPuckData);
  const [puckKey, setPuckKey] = useState(0);
  const puckDataRef = useRef<any>(initialPuckData);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportTemplate = () => {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(puckDataRef.current, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `${name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-template.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      toast.success("Template layout exported successfully!");
  };

  const handleImportTemplate = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const json = JSON.parse(event.target?.result as string);
              if (!json.content && !json.root) {
                  toast.error("Invalid template format. Must be a valid Puck page state JSON.");
                  return;
              }
              setPuckData(json);
              puckDataRef.current = json;
              setPuckKey(prev => prev + 1);
              toast.success("Template layout imported successfully!");
          } catch (err) {
               toast.error("Failed to parse template JSON.");
          }
      };
      reader.readAsText(file);
  };

  const handlePublish = async (data: any) => {
      const finalSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      try {
          const pageData = {
              name,
              slug: finalSlug,
              isPublished,
              metaTitle,
              metaDescription,
              headerCode,
              bodyCode,
              footerCode,
              accessControl,
              theme,
              sections: [
                  {
                      templateId: 'puck-blocks',
                      order: 0,
                      content: {},
                      style: {},
                      customHTML: JSON.stringify(data)
                  }
              ]
          };

          if (initialData?._id) {
              await updatePage(initialData._id, pageData);
              toast.success("Page updated successfully!");
          } else {
              const res = await createPage(pageData);
              if (res.success && res.page) {
                  toast.success("Page created successfully!");
                  router.push(`/admin/page-builder-simple/${res.page._id}`);
              } else {
                  toast.error("Failed to create page");
              }
          }
      } catch (error) {
          console.error(error);
          toast.error("Failed to save page");
      }
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50">
        {/* Top Meta Bar */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <Link href="/admin/page-builder-simple" className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <div className="flex items-center gap-3">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Page Name"
                        className="font-semibold text-sm border-none bg-transparent focus:ring-0 w-48 placeholder-slate-400"
                    />
                    <span className="text-slate-300">/</span>
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="bg-slate-100 px-2 py-1 rounded-l-md border border-r-0 text-xs">/p/</span>
                        <input 
                            type="text" 
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="url-slug"
                            className="text-sm border border-slate-200 rounded-r-md px-2 py-1 w-48 focus:outline-none focus:border-sky-500"
                        />
                    </div>
                </div>
            </div>
            <div className="flex items-center gap-3 relative">
                <button 
                    onClick={handleExportTemplate}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Export Template JSON"
                >
                    <Download size={13} /> Export Layout
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md border font-medium bg-white border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
                    title="Import Template JSON"
                >
                    <Upload size={13} /> Import Layout
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleImportTemplate} 
                    accept=".json" 
                    className="hidden" 
                />

                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors ${showSettings ? 'bg-sky-50 border-sky-200 text-sky-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    Page Settings
                </button>
                
                {showSettings && (
                    <div className="absolute top-10 right-24 w-[440px] bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[600px]">
                        {/* Tab Bar */}
                        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
                            {(["seo", "theme", "code"] as const).map((tab) => (
                              <button 
                                key={tab}
                                onClick={() => setSettingsTab(tab)} 
                                className={`flex-1 py-3 text-xs font-semibold capitalize ${settingsTab === tab ? "bg-white text-sky-600 border-b-2 border-sky-500" : "text-slate-500 hover:text-slate-700"}`}
                              >
                                {tab === "seo" ? "SEO & Access" : tab === "theme" ? "🎨 Theme" : "Custom Code"}
                              </button>
                            ))}
                        </div>
                        
                        <div className="p-5 overflow-y-auto flex-1">
                            {/* ── SEO Tab ── */}
                            {settingsTab === "seo" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Meta Title</label>
                                        <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500" placeholder="e.g. My Awesome Page" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Meta Description</label>
                                        <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 h-24 resize-none" placeholder="Write a compelling description for search engines..." />
                                    </div>
                                    <div className="border-t pt-4">
                                        <label className="block text-xs font-bold text-slate-700 mb-1.5 flex items-center gap-1.5">
                                            <Lock size={13} className="text-slate-500" /> Page Access Level
                                        </label>
                                        <select 
                                            value={accessControl} 
                                            onChange={(e) => setAccessControl(e.target.value as any)} 
                                            className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 bg-white"
                                        >
                                            <option value="free">🔓 Free / Public (Anyone can view)</option>
                                            <option value="student">🎓 Student Only (Logged-in students/admins)</option>
                                            <option value="admin">🛡️ Admin Only (Only administrative accounts)</option>
                                        </select>
                                    </div>
                                </div>
                            )}

                            {/* ── THEME Tab ── */}
                            {settingsTab === "theme" && (
                                <div className="space-y-5">
                                  <div>
                                    <p className="text-xs text-slate-500 mb-4 leading-relaxed">Global design tokens applied to the entire page. These override default styles.</p>
                                    
                                    {/* Font Family */}
                                    <div className="space-y-1 mb-4">
                                      <label className="block text-xs font-semibold text-slate-700">Font Family</label>
                                      <select value={theme.fontFamily} onChange={(e) => updateTheme("fontFamily", e.target.value as any)} className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 bg-white">
                                        {FONT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                      </select>
                                    </div>

                                    {/* Border Radius */}
                                    <div className="space-y-1 mb-4">
                                      <label className="block text-xs font-semibold text-slate-700">Global Border Radius</label>
                                      <select value={theme.borderRadius} onChange={(e) => updateTheme("borderRadius", e.target.value as any)} className="w-full text-sm border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 bg-white">
                                        {RADIUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                      </select>
                                    </div>

                                    {/* Colors */}
                                    <div className="grid grid-cols-2 gap-3">
                                      {([
                                        { label: "Primary Color", key: "colorPrimary" },
                                        { label: "Accent Color", key: "colorAccent" },
                                        { label: "Text Color", key: "colorText" },
                                        { label: "Background", key: "colorBackground" },
                                      ] as { label: string; key: keyof PageTheme }[]).map(({ label, key }) => (
                                        <div key={key} className="space-y-1">
                                          <label className="block text-xs font-semibold text-slate-700">{label}</label>
                                          <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 py-1.5">
                                            <input type="color" value={theme[key] as string} onChange={(e) => updateTheme(key, e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                            <span className="text-xs font-mono text-slate-600">{theme[key] as string}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Live Preview Swatch */}
                                    <div className="mt-5 rounded-lg overflow-hidden border border-slate-200">
                                      <div className="p-4 text-sm font-semibold" style={{ background: theme.colorBackground, color: theme.colorText }}>
                                        <span style={{ color: theme.colorPrimary }}>Primary text</span> · <span style={{ color: theme.colorAccent }}>Accent</span> · Body text
                                        <div className="mt-2 flex gap-2">
                                          <span className="px-3 py-1 text-xs font-bold text-white" style={{ background: theme.colorPrimary, borderRadius: theme.borderRadius === "sharp" ? "0" : theme.borderRadius === "soft" ? "4px" : theme.borderRadius === "rounded" ? "8px" : "9999px" }}>Button</span>
                                          <span className="px-3 py-1 text-xs font-bold text-white" style={{ background: theme.colorAccent, borderRadius: theme.borderRadius === "sharp" ? "0" : theme.borderRadius === "soft" ? "4px" : theme.borderRadius === "rounded" ? "8px" : "9999px" }}>Secondary</span>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                            )}

                            {/* ── CODE Tab ── */}
                            {settingsTab === "code" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Header Code (inside &lt;head&gt;)</label>
                                        <textarea value={headerCode} onChange={(e) => setHeaderCode(e.target.value)} className="w-full text-xs font-mono bg-slate-900 text-green-400 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 h-24 resize-none" placeholder="<!-- Google Analytics, Facebook Pixel, etc. -->" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Body Start Code (after &lt;body&gt;)</label>
                                        <textarea value={bodyCode} onChange={(e) => setBodyCode(e.target.value)} className="w-full text-xs font-mono bg-slate-900 text-green-400 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 h-24 resize-none" placeholder="<!-- GTM NoScript, etc. -->" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-slate-700 mb-1">Footer Code (before &lt;/body&gt;)</label>
                                        <textarea value={footerCode} onChange={(e) => setFooterCode(e.target.value)} className="w-full text-xs font-mono bg-slate-900 text-green-400 border border-slate-200 rounded-md px-3 py-2 focus:outline-none focus:border-sky-500 h-24 resize-none" placeholder="<!-- Chat widgets, tracking scripts, etc. -->" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="rounded text-sky-500 focus:ring-sky-500"
                    />
                    Published
                </label>
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
            <Puck 
                key={puckKey}
                config={puckConfig} 
                data={puckData as any} 
                onChange={(data) => {
                    puckDataRef.current = data;
                }}
                onPublish={handlePublish}
            />
        </div>
    </div>
  );
}
