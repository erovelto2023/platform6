"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useRouter } from "next/navigation";
import { createPage, updatePage } from "@/lib/actions/page-builder.actions";
import { toast } from "sonner";
import { puckConfig } from "@/lib/puck-config";
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Download, Upload, Lock, Eye } from "lucide-react";
import Link from "next/link";
import { PageTheme, defaultTheme } from "@/lib/theme-config";
import { blockTemplates, BlockTemplate } from "@/lib/block-library";

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

const TYPE_CATEGORIES = {
  designer: [
    "Empty blocks", "Alert bars", "Call to action", "Checkout forms", "Contact Us",
    "Content", "Countdown timers", "Download boxes", "Features", "Footers",
    "Gallery", "Headers", "Navigation bars", "Opt-in forms", "Pricing",
    "Progress bars", "Tabs", "Team", "Testimonials"
  ],
  modern: [
    "Hero", "Navigation", "Team", "Pricing", "Stats", "Testimonial", "Contact",
    "Blog", "Newsletter", "FAQ", "Guarantee", "CTA", "Thank You", "Logos", "Footer"
  ],
  wireframe: ["Empty blocks", "Containers", "Grid lists"],
  "direct-response": ["Sales letters", "Call to action", "Guarantees"],
  popups: ["optin-forms", "Sales announcements"],
  megamenus: ["navigation bars", "Header menus"]
};

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
  let initialHtmlMode = false;
  let initialHtmlContent = "";

  if (initialData?.sections?.[0]?.templateId === 'puck-blocks' && initialData?.sections?.[0]?.customHTML) {
      try {
          initialPuckData = JSON.parse(initialData.sections[0].customHTML);
      } catch (e) {
          console.error("Failed to parse Puck data", e);
      }
  } else if (initialData?.sections?.[0]?.customHTML) {
      initialHtmlMode = true;
      initialHtmlContent = initialData.sections[0].customHTML;
  }

  const [editorMode, setEditorMode] = useState<"visual" | "code">(initialHtmlMode ? "code" : "visual");
  const [showBlockLibrary, setShowBlockLibrary] = useState(false);
  const [selectedBlockType, setSelectedBlockType] = useState<"designer" | "modern" | "wireframe" | "direct-response" | "popups" | "megamenus">("designer");
  const [selectedBlockCategory, setSelectedBlockCategory] = useState<string>("Alert bars");
  const [savedBlocks, setSavedBlocks] = useState<BlockTemplate[]>([]);
  const [showSaveBlockModal, setShowSaveBlockModal] = useState(false);
  const [newBlockName, setNewBlockName] = useState("");

  const [grooveHtml, setGrooveHtml] = useState("");
  const [grooveCss, setGrooveCss] = useState("");

  const handleImportGroove = () => {
    if (!grooveHtml.trim()) {
      toast.error("Please paste the Groove HTML content first.");
      return;
    }

    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(grooveHtml, 'text/html');

      // Parse CSS if provided
      if (grooveCss.trim()) {
        const ruleRegex = /([^{]+)\s*\{\s*([^}]+)\s*\}/g;
        let match;
        const rules: Array<{ selector: string; declarations: string }> = [];
        
        while ((match = ruleRegex.exec(grooveCss)) !== null) {
          const selectors = match[1].trim();
          const declarations = match[2].trim();
          
          if (selectors.startsWith('@')) continue; // Skip media queries for inline CSS
          
          selectors.split(',').forEach(sel => {
            rules.push({ selector: sel.trim(), declarations });
          });
        }

        // Apply styles
        rules.forEach(({ selector, declarations }) => {
          try {
            const elements = doc.querySelectorAll(selector);
            elements.forEach(el => {
              const currentStyle = el.getAttribute('style') || '';
              el.setAttribute('style', currentStyle + (currentStyle && !currentStyle.endsWith(';') ? ';' : '') + declarations);
            });
          } catch (err) {
            // Ignore invalid CSS selectors
          }
        });
      }

      // Find blocks/sections
      const blocks: BlockTemplate[] = [];
      const sections = doc.querySelectorAll('section, [data-gp-component="block"], [data-gp-block="true"]');

      if (sections.length > 0) {
        sections.forEach((sec, idx) => {
          const h1 = sec.querySelector('h1');
          const h2 = sec.querySelector('h2');
          let name = `Groove Section ${idx + 1}`;
          if (h1 && h1.textContent?.trim()) {
            name = `Groove: ${h1.textContent.trim().slice(0, 30)}`;
          } else if (h2 && h2.textContent?.trim()) {
            name = `Groove: ${h2.textContent.trim().slice(0, 30)}`;
          }

          // Clean up the cloned section
          const cleanSec = sec.cloneNode(true) as HTMLElement;
          cleanSec.removeAttribute('tabindex');
          cleanSec.removeAttribute('data-gp-block-id');
          cleanSec.removeAttribute('data-gp-block-type');
          cleanSec.removeAttribute('data-gp-block-data');

          blocks.push({
            id: `groove-imported-${Date.now()}-${idx}`,
            name,
            type: 'designer',
            category: 'Saved',
            html: cleanSec.outerHTML,
            css: grooveCss.trim() || undefined
          });
        });
      } else {
        // Fallback to body or root elements
        const bodyContent = doc.body.innerHTML;
        if (bodyContent.trim()) {
          blocks.push({
            id: `groove-imported-${Date.now()}`,
            name: 'Groove Imported Block',
            type: 'designer',
            category: 'Saved',
            html: bodyContent,
            css: grooveCss.trim() || undefined
          });
        }
      }

      if (blocks.length === 0) {
        toast.error("Could not find any HTML content to import.");
        return;
      }

      // Save to savedBlocks state & localStorage
      const updated = [...savedBlocks, ...blocks];
      setSavedBlocks(updated);
      localStorage.setItem("puck_saved_blocks", JSON.stringify(updated));

      // Reset fields and select Saved category to view them!
      setGrooveHtml("");
      setGrooveCss("");
      setSelectedBlockCategory("Saved");
      toast.success(`Successfully imported ${blocks.length} block(s) into your Saved library!`);
    } catch (err) {
      console.error(err);
      toast.error("An error occurred during template import.");
    }
  };

  useEffect(() => {
    const stored = localStorage.getItem("puck_saved_blocks");
    if (stored) {
      try {
        setSavedBlocks(JSON.parse(stored));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleSaveCustomBlock = () => {
    if (!newBlockName.trim()) {
      toast.error("Please enter a block name");
      return;
    }
    const newBlock: BlockTemplate = {
      id: "saved-" + Date.now(),
      name: newBlockName,
      type: "designer",
      category: "Saved",
      html: htmlContent
    };
    const updated = [...savedBlocks, newBlock];
    setSavedBlocks(updated);
    localStorage.setItem("puck_saved_blocks", JSON.stringify(updated));
    setShowSaveBlockModal(false);
    setNewBlockName("");
    toast.success(`Successfully saved "${newBlockName}" block!`);
  };

  const handleDeleteSavedBlock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = savedBlocks.filter(b => b.id !== id);
    setSavedBlocks(updated);
    localStorage.setItem("puck_saved_blocks", JSON.stringify(updated));
    toast.success("Saved block deleted.");
  };

  const [editingBlock, setEditingBlock] = useState<BlockTemplate | null>(null);
  const [editingBlockName, setEditingBlockName] = useState("");
  const [editingBlockHtml, setEditingBlockHtml] = useState("");
  const [editingBlockCss, setEditingBlockCss] = useState("");
  const [editTab, setEditTab] = useState<"html" | "css">("html");

  const handleStartEditBlock = (b: BlockTemplate, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBlock(b);
    setEditingBlockName(b.name);
    setEditingBlockHtml(b.html);
    setEditingBlockCss(b.css || "");
    setEditTab("html");
  };

  const handleSaveChangesBlock = () => {
    if (!editingBlock) return;
    if (!editingBlockName.trim()) {
      toast.error("Please enter a block name");
      return;
    }
    if (!editingBlockHtml.trim()) {
      toast.error("Block content cannot be empty");
      return;
    }

    const updated = savedBlocks.map(b => {
      if (b.id === editingBlock.id) {
        return {
          ...b,
          name: editingBlockName,
          html: editingBlockHtml,
          css: editingBlockCss.trim() || undefined
        };
      }
      return b;
    });

    setSavedBlocks(updated);
    localStorage.setItem("puck_saved_blocks", JSON.stringify(updated));
    setEditingBlock(null);
    toast.success("Block template updated successfully!");
  };

  const [htmlContent, setHtmlContent] = useState(initialHtmlContent);
  const [iframeSrcDoc, setIframeSrcDoc] = useState("");
  const lastUpdateFromIframeRef = useRef(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === 'HTML_EDIT') {
        const newHtml = event.data.html;
        if (newHtml && newHtml.trim() !== htmlContent.trim()) {
          lastUpdateFromIframeRef.current = true;
          setHtmlContent(newHtml);
        }
      }
    };

    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [htmlContent]);

  useEffect(() => {
    if (lastUpdateFromIframeRef.current) {
      lastUpdateFromIframeRef.current = false;
    } else {
      const docTemplate = `
        <!DOCTYPE html>
        <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <script src="https://cdn.tailwindcss.com"></script>
                <style>
                    body { margin: 0; padding: 0; font-family: sans-serif; }
                </style>
            </head>
            <body>
                ${htmlContent || '<div class="h-full min-h-screen flex flex-col items-center justify-center text-slate-400 font-sans p-6 text-center"><p class="text-lg font-bold">Empty HTML Page</p><p class="text-xs text-slate-400 mt-2">Type or paste your code on the left to see the changes rendered instantly.</p></div>'}
                <script>
                    const cleanAndSend = () => {
                        const clone = document.body.cloneNode(true);
                        clone.querySelectorAll('[contenteditable]').forEach(el => {
                            el.removeAttribute('contenteditable');
                            if (el.style.outline) el.style.outline = '';
                            if (el.style.outlineOffset) el.style.outlineOffset = '';
                            if (el.getAttribute('style') === '') el.removeAttribute('style');
                        });
                        clone.querySelectorAll('script').forEach(el => el.remove());
                        
                        window.parent.postMessage({
                            type: 'HTML_EDIT',
                            html: clone.innerHTML
                        }, '*');
                    };

                    const initEditable = () => {
                        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, button, li, td, th');
                        textElements.forEach(el => {
                            const hasText = Array.from(el.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent.trim().length > 0);
                            if (hasText) {
                                el.contentEditable = 'true';
                                el.style.outline = 'none';
                                
                                el.addEventListener('mouseenter', () => {
                                    el.style.outline = '2px dashed #0ea5e9';
                                    el.style.outlineOffset = '2px';
                                });
                                el.addEventListener('mouseleave', () => {
                                    el.style.outline = 'none';
                                });
                                
                                el.addEventListener('blur', () => {
                                    cleanAndSend();
                                });

                                el.addEventListener('input', () => {
                                    cleanAndSend();
                                });
                            }
                        });
                    };

                    window.addEventListener('DOMContentLoaded', initEditable);
                    if (document.readyState === 'complete' || document.readyState === 'interactive') {
                        initEditable();
                    }
                </script>
            </body>
        </html>
      `;
      setIframeSrcDoc(docTemplate);
    }
  }, [htmlContent]);

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

  const handleSaveCodeMode = async () => {
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
                      templateId: 'custom-html',
                      order: 0,
                      content: {},
                      style: {},
                      customHTML: htmlContent
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

  useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
          if ((e.ctrlKey || e.metaKey) && e.key === 's') {
              e.preventDefault();
              if (editorMode === 'code') {
                  handleSaveCodeMode();
              }
          }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
  }, [editorMode, htmlContent, name, slug, isPublished, metaTitle, metaDescription, headerCode, bodyCode, footerCode, accessControl, theme]);

  return (
    <div className="h-screen w-full flex flex-col bg-slate-950 text-slate-100">
        {/* Top Meta Bar */}
        <div className="h-16 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-6 shrink-0 text-slate-100 shadow-xl z-30">
            <div className="flex items-center gap-4">
                <Link href="/admin/page-builder-simple" className="p-2 hover:bg-slate-950 rounded-xl text-slate-400 hover:text-cyan-400 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-px bg-slate-800" />
                <div className="flex items-center gap-3">
                    <input 
                        type="text" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Page Name"
                        className="font-bold text-sm border border-slate-800 bg-slate-950 text-slate-100 rounded-xl px-3 py-1.5 focus:outline-none focus:border-cyan-500 font-mono w-48 placeholder:text-slate-600"
                    />
                    <span className="text-cyan-400 font-mono font-bold">/</span>
                    <div className="flex items-center text-xs font-mono font-bold">
                        <span className="bg-slate-950 text-cyan-400 px-3 py-1.5 rounded-l-xl border border-r-0 border-slate-800">/p/</span>
                        <input 
                            type="text" 
                            value={slug}
                            onChange={(e) => setSlug(e.target.value)}
                            placeholder="url-slug"
                            className="text-xs font-mono font-bold border border-slate-800 bg-slate-950 text-slate-100 rounded-r-xl px-3 py-1.5 w-44 focus:outline-none focus:border-cyan-500 placeholder:text-slate-600"
                        />
                    </div>
                </div>
            </div>

            {/* Mode Switcher */}
            <div className="flex border border-slate-800 rounded-xl overflow-hidden p-1 bg-slate-950 font-mono text-xs">
                <button
                    onClick={() => {
                        if (editorMode === "code") {
                            if (confirm("Switching to Visual Editor will clear your custom HTML. Are you sure you want to proceed?")) {
                                setEditorMode("visual");
                            }
                        }
                    }}
                    className={`text-xs px-3.5 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${editorMode === "visual" ? "bg-cyan-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                >
                    🎨 Visual Builder
                </button>
                <button
                    onClick={() => {
                        if (editorMode === "visual") {
                            if (confirm("Switching to HTML Mode will replace the visual builder layout with custom HTML code. Are you sure you want to proceed?")) {
                                setEditorMode("code");
                            }
                        }
                    }}
                    className={`text-xs px-3.5 py-1.5 font-bold rounded-lg transition-all cursor-pointer ${editorMode === "code" ? "bg-cyan-600 text-white shadow-md" : "text-slate-400 hover:text-white"}`}
                >
                    💻 Pure HTML Editor
                </button>
            </div>

            <div className="flex items-center gap-3 relative">
                {editorMode === "visual" ? (
                    <>
                        <button 
                            onClick={handleExportTemplate}
                            className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Export Template JSON"
                        >
                            <Download size={13} className="text-cyan-400" /> Export Layout
                        </button>
                        <button 
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Import Template JSON"
                        >
                            <Upload size={13} className="text-purple-400" /> Import Layout
                        </button>
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleImportTemplate} 
                            accept=".json" 
                            className="hidden" 
                        />
                    </>
                ) : (
                    <button
                        onClick={handleSaveCodeMode}
                        className="flex items-center gap-1.5 text-xs font-mono font-bold px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-lg cursor-pointer uppercase tracking-wider"
                    >
                        Save Page
                    </button>
                )}

                <a
                    href={`/p/${slug || initialData?.slug || ''}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 text-xs font-mono font-bold px-3 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <Eye size={13} className="text-cyan-400" /> Live Preview
                </a>

                <button 
                    onClick={() => setShowSettings(!showSettings)}
                    className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${showSettings ? 'bg-cyan-950 border-cyan-800 text-cyan-400' : 'bg-slate-950 border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800'}`}
                >
                    Page Settings
                </button>
                
                {showSettings && (
                    <div className="absolute top-12 right-24 w-[440px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[600px] text-slate-100">
                        {/* Tab Bar */}
                        <div className="flex border-b border-slate-800 bg-slate-950 shrink-0 font-mono text-xs font-bold">
                            {(["seo", "theme", "code"] as const).map((tab) => (
                              <button 
                                key={tab}
                                onClick={() => setSettingsTab(tab)} 
                                className={`flex-1 py-3 text-xs font-bold uppercase transition-colors cursor-pointer ${settingsTab === tab ? "bg-slate-900 text-cyan-400 border-b-2 border-cyan-500" : "text-slate-400 hover:text-white"}`}
                              >
                                {tab === "seo" ? "SEO & Access" : tab === "theme" ? "🎨 Theme" : "Custom Code"}
                              </button>
                            ))}
                        </div>
                        
                        <div className="p-5 overflow-y-auto flex-1 font-sans">
                            {/* ── SEO Tab ── */}
                            {settingsTab === "seo" && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Meta Title</label>
                                        <input type="text" value={metaTitle} onChange={(e) => setMetaTitle(e.target.value)} className="w-full text-xs font-mono border border-slate-800 bg-slate-950 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500" placeholder="e.g. My Awesome Page" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Meta Description</label>
                                        <textarea value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} className="w-full text-xs font-mono border border-slate-800 bg-slate-950 text-slate-100 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 h-24 resize-none" placeholder="Write a compelling description for search engines..." />
                                    </div>
                                    <div className="border-t border-slate-800 pt-4">
                                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1.5 flex items-center gap-1.5">
                                            <Lock size={13} className="text-cyan-400" /> Page Access Level
                                        </label>
                                        <select 
                                            value={accessControl} 
                                            onChange={(e) => setAccessControl(e.target.value as any)} 
                                            className="w-full text-xs font-mono border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 bg-slate-950 text-slate-100"
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
                                    <p className="text-xs text-slate-400 font-mono mb-4 leading-relaxed">Global design tokens applied to the entire page. These override default styles.</p>
                                    
                                    {/* Font Family */}
                                    <div className="space-y-1 mb-4">
                                      <label className="block text-xs font-mono font-bold text-slate-300 uppercase">Font Family</label>
                                      <select value={theme.fontFamily} onChange={(e) => updateTheme("fontFamily", e.target.value as any)} className="w-full text-xs font-mono border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 bg-slate-950 text-slate-100">
                                        {FONT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                      </select>
                                    </div>

                                    {/* Border Radius */}
                                    <div className="space-y-1 mb-4">
                                      <label className="block text-xs font-mono font-bold text-slate-300 uppercase">Global Border Radius</label>
                                      <select value={theme.borderRadius} onChange={(e) => updateTheme("borderRadius", e.target.value as any)} className="w-full text-xs font-mono border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 bg-slate-950 text-slate-100">
                                        {RADIUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                                      </select>
                                    </div>

                                    {/* Colors */}
                                    <div className="grid grid-cols-2 gap-3 mb-6">
                                      {([
                                        { label: "Primary Color", key: "colorPrimary" },
                                        { label: "Accent Color", key: "colorAccent" },
                                        { label: "Text Color", key: "colorText" },
                                        { label: "Background", key: "colorBackground" },
                                      ] as { label: string; key: keyof PageTheme }[]).map(({ label, key }) => (
                                        <div key={key} className="space-y-1">
                                          <label className="block text-xs font-mono font-bold text-slate-300 uppercase">{label}</label>
                                          <div className="flex items-center gap-2 border border-slate-800 rounded-xl px-2 py-1.5 bg-slate-950">
                                            <input type="color" value={theme[key] as string} onChange={(e) => updateTheme(key, e.target.value)} className="w-7 h-7 rounded cursor-pointer border-0 p-0 bg-transparent" />
                                            <span className="text-xs font-mono text-slate-300">{theme[key] as string}</span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>

                                    {/* Base Font Size */}
                                    <div className="space-y-1.5 mb-4 font-mono text-xs">
                                      <div className="flex justify-between items-center">
                                        <label className="block font-bold text-slate-300 uppercase">Base Font Size</label>
                                        <span className="font-bold text-cyan-400">{theme.fontSizeBase || "16px"}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min="12" 
                                        max="24" 
                                        value={parseInt(theme.fontSizeBase || "16")} 
                                        onChange={(e) => updateTheme("fontSizeBase", e.target.value + "px")} 
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                      />
                                    </div>

                                    {/* Line Height */}
                                    <div className="space-y-1.5 mb-4 font-mono text-xs">
                                      <div className="flex justify-between items-center">
                                        <label className="block font-bold text-slate-300 uppercase">Line Height</label>
                                        <span className="font-bold text-cyan-400">{theme.lineHeight || "1.5"}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min="1.0" 
                                        max="2.2" 
                                        step="0.1"
                                        value={parseFloat(theme.lineHeight || "1.5")} 
                                        onChange={(e) => updateTheme("lineHeight", e.target.value)} 
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                      />
                                    </div>

                                    {/* Content Padding */}
                                    <div className="space-y-1.5 mb-4 font-mono text-xs">
                                      <div className="flex justify-between items-center">
                                        <label className="block font-bold text-slate-300 uppercase">Page Spacing / Padding</label>
                                        <span className="font-bold text-cyan-400">{theme.contentPadding || "1.5rem"}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min="0.0" 
                                        max="5.0" 
                                        step="0.5"
                                        value={parseFloat(theme.contentPadding || "1.5")} 
                                        onChange={(e) => updateTheme("contentPadding", e.target.value + "rem")} 
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                      />
                                    </div>

                                    {/* Container Width */}
                                    <div className="space-y-1.5 mb-4 font-mono text-xs">
                                      <div className="flex justify-between items-center">
                                        <label className="block font-bold text-slate-300 uppercase">Max Container Width</label>
                                        <span className="font-bold text-cyan-400">{theme.containerWidth || "1200px"}</span>
                                      </div>
                                      <input 
                                        type="range" 
                                        min="600" 
                                        max="1600" 
                                        step="50"
                                        value={parseInt(theme.containerWidth || "1200")} 
                                        onChange={(e) => updateTheme("containerWidth", e.target.value + "px")} 
                                        className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500" 
                                      />
                                    </div>

                                    {/* Live Preview Swatch */}
                                    <div className="mt-5 rounded-xl overflow-hidden border border-slate-800">
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
                                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Header Code (inside &lt;head&gt;)</label>
                                        <textarea value={headerCode} onChange={(e) => setHeaderCode(e.target.value)} className="w-full text-xs font-mono bg-slate-950 text-cyan-400 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 h-24 resize-none" placeholder="<!-- Google Analytics, Facebook Pixel, etc. -->" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Body Start Code (after &lt;body&gt;)</label>
                                        <textarea value={bodyCode} onChange={(e) => setBodyCode(e.target.value)} className="w-full text-xs font-mono bg-slate-950 text-cyan-400 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-sky-500 h-24 resize-none" placeholder="<!-- GTM NoScript, etc. -->" />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-mono font-bold text-slate-300 uppercase mb-1">Footer Code (before &lt;/body&gt;)</label>
                                        <textarea value={footerCode} onChange={(e) => setFooterCode(e.target.value)} className="w-full text-xs font-mono bg-slate-950 text-cyan-400 border border-slate-800 rounded-xl px-3 py-2 focus:outline-none focus:border-cyan-500 h-24 resize-none" placeholder="<!-- Chat widgets, tracking scripts, etc. -->" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                <label className="flex items-center gap-2 text-xs font-mono font-bold text-slate-200 cursor-pointer">
                    <input 
                        type="checkbox" 
                        checked={isPublished}
                        onChange={(e) => setIsPublished(e.target.checked)}
                        className="rounded border-slate-700 bg-slate-950 text-cyan-500 focus:ring-cyan-500"
                    />
                    Published
                </label>
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
            {editorMode === "visual" ? (
                <Puck 
                    key={puckKey}
                    config={puckConfig} 
                    data={puckData as any} 
                    onChange={(data) => {
                        puckDataRef.current = data;
                    }}
                    onPublish={handlePublish}
                    overrides={{
                        iframe: ({ children, document }) => {
                            useEffect(() => {
                                if (document) {
                                    if (!document.getElementById('puck-canvas-contrast-css')) {
                                        const style = document.createElement('style');
                                        style.id = 'puck-canvas-contrast-css';
                                        style.textContent = `
                                            html, body {
                                                background-color: #020617 !important;
                                                color: #f8fafc !important;
                                                font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
                                                margin: 0;
                                                padding: 0;
                                                min-height: 100vh;
                                            }
                                            h1, h2, h3, h4, h5, h6, p, span, div, li, label, td, th {
                                                color: inherit;
                                            }
                                            .puck-component {
                                                color: #f8fafc;
                                            }
                                        `;
                                        document.head.appendChild(style);
                                    }

                                    if (!document.getElementById('tailwind-cdn')) {
                                        const tag = document.createElement('script');
                                        tag.id = 'tailwind-cdn';
                                        tag.src = 'https://cdn.tailwindcss.com';
                                        tag.async = true;
                                        document.head.appendChild(tag);
                                    }
                                }
                            }, [document]);
                            
                            return <>{children}</>;
                        },
                    }}
                />
            ) : (
                <div className="flex-1 flex overflow-hidden">
                    {/* Left: Code Editor Input Panel */}
                    <div className="w-1/2 border-r border-slate-800 flex flex-col bg-slate-950">
                        {/* Editor Header */}
                        <div className="h-10 bg-slate-900 border-b border-slate-800 flex items-center justify-between px-4 shrink-0 text-slate-400">
                            <span className="text-xs font-semibold tracking-wider uppercase font-mono text-slate-355">index.html</span>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => {
                                        setSelectedBlockType("designer");
                                        setSelectedBlockCategory("Alert bars");
                                        setShowBlockLibrary(true);
                                    }}
                                    className="text-[11px] bg-sky-600 hover:bg-sky-505 text-white px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1.5"
                                >
                                    <span>📚 Browse Block Library</span>
                                </button>
                                <button
                                    onClick={() => setShowSaveBlockModal(true)}
                                    className="text-[11px] bg-emerald-600 hover:bg-emerald-500 text-white px-2.5 py-1 rounded font-semibold transition-colors flex items-center gap-1.5"
                                >
                                    <span>💾 Save Custom Block</span>
                                </button>
                                <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded font-mono text-emerald-400">HTML5 + Tailwind CDN</span>
                            </div>
                        </div>
                        {/* Textarea Container */}
                        <div className="flex-1 p-4 relative flex">
                            <textarea
                                value={htmlContent}
                                onChange={(e) => setHtmlContent(e.target.value)}
                                className="flex-1 w-full bg-transparent text-slate-200 font-mono text-sm leading-relaxed focus:outline-none resize-none selection:bg-indigo-500/30 selection:text-white"
                                placeholder={`<!-- Paste your custom HTML layout here -->\n<div class="min-h-screen flex flex-col justify-center items-center bg-slate-900 text-white p-8">\n  <h1 class="text-4xl font-extrabold tracking-tight">Custom HTML Page</h1>\n  <p class="text-slate-400 mt-2">Design exactly what you want using HTML, CSS, and Tailwind utilities.</p>\n</div>`}
                            />
                        </div>
                        {/* Editor Footer / Tips */}
                        <div className="h-8 bg-slate-900 border-t border-slate-800 flex items-center px-4 shrink-0 text-[10px] text-slate-500 font-mono">
                            Press Ctrl+S to save · Tailwind CSS script is automatically injected in the live preview.
                        </div>
                    </div>

                    {/* Right: Live Preview Panel */}
                    <div className="w-1/2 flex flex-col bg-white">
                        {/* Preview Header */}
                        <div className="h-10 bg-slate-50 border-b border-slate-200 flex items-center justify-between px-4 shrink-0 text-slate-500">
                            <span className="text-xs font-semibold uppercase tracking-wider">Live Preview</span>
                            <span className="text-[10px] font-mono bg-sky-50 text-sky-600 px-2 py-0.5 rounded border border-sky-100">Interactive</span>
                        </div>
                        {/* Live Frame */}
                        <div className="flex-1 bg-slate-100 p-6 flex items-center justify-center">
                            <div className="w-full h-full bg-white rounded-xl shadow-xl overflow-hidden border border-slate-200">
                                <iframe
                                    srcDoc={iframeSrcDoc}
                                    className="w-full h-full border-none bg-white"
                                    title="HTML Preview"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Save Custom Block Modal */}
            {showSaveBlockModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-slate-200 overflow-hidden">
                        <div className="h-12 border-b flex items-center justify-between px-4 bg-slate-50">
                            <h3 className="font-bold text-slate-900 text-sm">Save Current HTML as Custom Block</h3>
                            <button onClick={() => setShowSaveBlockModal(false)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Block Template Name</label>
                                <input 
                                    type="text" 
                                    value={newBlockName} 
                                    onChange={(e) => setNewBlockName(e.target.value)} 
                                    placeholder="e.g. My Premium Call to Action" 
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500" 
                                />
                            </div>
                            <p className="text-[10px] text-slate-500 leading-normal">
                                This will capture the current HTML markup in your editor and save it as a reusable card in your custom <b>Saved</b> library.
                            </p>
                            <div className="flex justify-end gap-2 pt-2">
                                <button onClick={() => setShowSaveBlockModal(false)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                                <button onClick={handleSaveCustomBlock} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold shadow-sm">Save Block</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Custom Block Modal */}
            {editingBlock && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl border border-slate-200 overflow-hidden flex flex-col h-[75vh]">
                        <div className="h-12 border-b flex items-center justify-between px-4 bg-slate-50 shrink-0">
                            <h3 className="font-bold text-slate-900 text-sm">Edit Saved Block Template</h3>
                            <button onClick={() => setEditingBlock(null)} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
                        </div>
                        
                        {/* Tab Headers */}
                        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0 px-4">
                            <button
                                onClick={() => setEditTab("html")}
                                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${editTab === "html" ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                            >
                                📄 HTML Structure
                            </button>
                            <button
                                onClick={() => setEditTab("css")}
                                className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${editTab === "css" ? "border-sky-500 text-sky-600" : "border-transparent text-slate-500 hover:text-slate-700"}`}
                            >
                                🎨 CSS Stylesheet
                            </button>
                        </div>

                        <div className="p-4 flex-1 flex flex-col space-y-4 overflow-hidden">
                            <div className="shrink-0">
                                <label className="block text-xs font-semibold text-slate-700 mb-1">Block Template Name</label>
                                <input 
                                    type="text" 
                                    value={editingBlockName} 
                                    onChange={(e) => setEditingBlockName(e.target.value)} 
                                    placeholder="e.g. My Premium Call to Action" 
                                    className="w-full text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-sky-500 text-slate-800" 
                                />
                            </div>
                            
                            {editTab === "html" ? (
                                <div className="flex-1 flex flex-col min-h-0">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 shrink-0 text-slate-600">Block HTML Code</label>
                                    <textarea
                                        value={editingBlockHtml}
                                        onChange={(e) => setEditingBlockHtml(e.target.value)}
                                        className="flex-1 w-full bg-slate-900 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800 resize-none focus:outline-none"
                                        placeholder="Paste HTML structure here..."
                                    />
                                </div>
                            ) : (
                                <div className="flex-1 flex flex-col min-h-0">
                                    <label className="block text-xs font-semibold text-slate-700 mb-1 shrink-0 text-slate-600">Block CSS Stylesheet</label>
                                    <textarea
                                        value={editingBlockCss}
                                        onChange={(e) => setEditingBlockCss(e.target.value)}
                                        className="flex-1 w-full bg-slate-900 text-slate-200 font-mono text-xs p-3 rounded-lg border border-slate-800 resize-none focus:outline-none"
                                        placeholder="Paste custom CSS stylesheet rules here..."
                                    />
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 shrink-0">
                            <button onClick={() => setEditingBlock(null)} className="px-4 py-2 border border-slate-200 rounded-lg text-xs font-semibold hover:bg-slate-50">Cancel</button>
                            <button onClick={handleSaveChangesBlock} className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shadow-sm">Save Changes</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Block Library Modal */}
            {showBlockLibrary && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-sm p-8">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-6xl h-[85vh] flex overflow-hidden border border-slate-200">
                        {/* Sidebar */}
                        <div className="w-64 bg-slate-900 text-slate-300 flex flex-col border-r border-slate-850">
                            {/* Types List */}
                            <div className="p-4 border-b border-slate-800 shrink-0">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Block Type</h4>
                                <div className="space-y-1">
                                    {(["designer", "modern", "wireframe", "direct-response", "popups", "megamenus"] as const).map(t => (
                                        <button
                                            key={t}
                                            onClick={() => {
                                                setSelectedBlockType(t);
                                                setSelectedBlockCategory(TYPE_CATEGORIES[t][0]);
                                            }}
                                            className={`w-full text-left text-xs px-3 py-2 rounded-md font-semibold capitalize transition-colors flex items-center justify-between ${selectedBlockType === t ? "bg-sky-600 text-white" : "hover:bg-slate-800 text-slate-405"}`}
                                        >
                                            <span>{t.replace("-", " ")}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Categories List */}
                            <div className="flex-1 overflow-y-auto p-4 space-y-1">
                                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">Categories</h4>
                                {TYPE_CATEGORIES[selectedBlockType].concat(selectedBlockType === "designer" ? ["Saved"] : []).map(cat => {
                                    const count = cat === "Saved" 
                                        ? savedBlocks.length 
                                        : blockTemplates.filter(b => b.type === selectedBlockType && b.category.toLowerCase() === cat.toLowerCase()).length;
                                    return (
                                        <button
                                            key={cat}
                                            onClick={() => setSelectedBlockCategory(cat)}
                                            className={`w-full text-left text-xs px-3 py-2 rounded-md transition-colors flex items-center justify-between ${selectedBlockCategory.toLowerCase() === cat.toLowerCase() ? "bg-slate-800 text-sky-400 font-bold" : "hover:bg-slate-800/50 text-slate-400"}`}
                                        >
                                            <span>{cat}</span>
                                            {count > 0 && (
                                                <span className="text-[10px] bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded font-mono font-bold">
                                                    {count}
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                            
                            {/* Importer Section */}
                            <div className="p-4 border-t border-slate-800 shrink-0">
                                <h4 className="text-xs font-bold text-slate-405 uppercase tracking-widest mb-3">Importers</h4>
                                <button
                                    onClick={() => setSelectedBlockCategory("Import Groove")}
                                    className={`w-full text-left text-xs px-3 py-2 rounded-md font-semibold transition-colors flex items-center gap-2 ${selectedBlockCategory === "Import Groove" ? "bg-amber-600 text-white" : "hover:bg-slate-850 text-amber-400"}`}
                                >
                                    <span>⚡ Import Groove Template</span>
                                </button>
                            </div>
                        </div>

                        {/* Main Area */}
                        <div className="flex-1 flex flex-col bg-slate-50">
                            {/* Modal Header */}
                            <div className="h-14 border-b flex items-center justify-between px-6 bg-white shrink-0">
                                <div>
                                    <h3 className="font-bold text-slate-905 text-lg capitalize">
                                        {selectedBlockCategory === "Import Groove" ? "Template Importer" : selectedBlockCategory}
                                    </h3>
                                    <p className="text-xs text-slate-500">
                                        {selectedBlockCategory === "Import Groove" ? "Convert raw Groove code to block templates" : `${selectedBlockType.replace("-", " ")} Block library category`}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowBlockLibrary(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors text-lg font-bold"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* Grid Area */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {selectedBlockCategory === "Import Groove" ? (
                                    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md border border-slate-200 p-6 space-y-6">
                                        <div className="space-y-1">
                                            <h4 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                                <span>⚡</span> GroovePages Template Importer
                                            </h4>
                                            <p className="text-xs text-slate-505 leading-relaxed">
                                                Convert static GroovePages layouts into clean, production-ready blocks. Paste the page HTML and CSS stylesheets below. The importer will automatically inline style rules, normalize layout columns, and save the sections to your custom <strong>Saved</strong> block library.
                                            </p>
                                        </div>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Groove HTML Code</label>
                                                <textarea
                                                    value={grooveHtml}
                                                    onChange={(e) => setGrooveHtml(e.target.value)}
                                                    rows={8}
                                                    placeholder="Paste the raw Groove HTML page/section code here..."
                                                    className="w-full text-xs font-mono border border-slate-200 rounded-lg p-3 bg-slate-50 focus:outline-none focus:border-sky-500 text-slate-800"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-xs font-semibold text-slate-700 mb-1">Groove CSS Code (Optional)</label>
                                                <textarea
                                                    value={grooveCss}
                                                    onChange={(e) => setGrooveCss(e.target.value)}
                                                    rows={6}
                                                    placeholder="Paste the contents of your index.css stylesheet here to resolve custom styles..."
                                                    className="w-full text-xs font-mono border border-slate-200 rounded-lg p-3 bg-slate-50 focus:outline-none focus:border-sky-500 text-slate-800"
                                                />
                                            </div>

                                            <button
                                                onClick={handleImportGroove}
                                                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-3 rounded-lg text-sm shadow-md transition-colors flex items-center justify-center gap-2"
                                            >
                                                <span>⚡</span> Convert & Import Blocks
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {(selectedBlockCategory === "Saved" ? savedBlocks : blockTemplates.filter(b => b.type === selectedBlockType && b.category.toLowerCase() === selectedBlockCategory.toLowerCase()))
                                                .map(b => (
                                                    <div
                                                        key={b.id}
                                                        onClick={() => {
                                                            const blockCode = b.css ? `<!-- ${b.name} Stylesheet -->\n<style>\n${b.css}\n</style>\n${b.html}` : b.html;
                                                            setHtmlContent(prev => prev + "\n" + blockCode);
                                                            setShowBlockLibrary(false);
                                                            toast.success(`Inserted ${b.name}!`);
                                                        }}
                                                        className="group cursor-pointer bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-sky-500 transition-all flex flex-col h-72"
                                                    >
                                                        {/* Preview simulated card container */}
                                                        <div className="flex-1 bg-slate-100 flex items-center justify-center p-6 relative overflow-hidden border-b border-slate-100">
                                                            {/* Mini simulated browser layout */}
                                                            <div className="w-full h-full bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col">
                                                                <div className="h-3 bg-slate-200 flex items-center gap-1 px-2 shrink-0">
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                                                                </div>
                                                                <div className="flex-1 p-3 overflow-hidden text-[6px] text-slate-400 font-mono scale-95 origin-top-left leading-normal whitespace-pre-wrap select-none pointer-events-none">
                                                                    {b.html.slice(0, 180)}...
                                                                </div>
                                                            </div>

                                                            {/* Hover Overlay */}
                                                            <div className="absolute inset-0 bg-sky-600/90 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                <span className="text-white font-bold text-sm">➕ Insert Block</span>
                                                                <span className="text-sky-100 text-xs font-mono font-medium">Click to paste code</span>
                                                            </div>
                                                        </div>

                                                        {/* Footer Card info */}
                                                        <div className="p-4 bg-white flex items-center justify-between shrink-0">
                                                            <div className="truncate pr-2">
                                                                <span className="font-semibold text-sm text-slate-800 block truncate">{b.name}</span>
                                                                <span className="text-[10px] text-slate-400 capitalize">{b.category}</span>
                                                            </div>
                                                            {selectedBlockCategory === "Saved" ? (
                                                                <div className="flex items-center gap-1.5 shrink-0">
                                                                    <button
                                                                        onClick={(e) => handleStartEditBlock(b, e)}
                                                                        className="p-1.5 hover:bg-slate-100 rounded text-slate-500 hover:text-sky-650 transition-colors"
                                                                        title="Edit Template"
                                                                    >
                                                                        ✏️
                                                                    </button>
                                                                    <button
                                                                        onClick={(e) => handleDeleteSavedBlock(b.id, e)}
                                                                        className="p-1.5 hover:bg-red-50 rounded text-slate-500 hover:text-red-650 transition-colors"
                                                                        title="Delete Template"
                                                                    >
                                                                        🗑️
                                                                    </button>
                                                                </div>
                                                            ) : (
                                                                <span className="text-[10px] bg-slate-105 text-slate-500 px-2 py-0.5 rounded font-bold uppercase tracking-wider shrink-0">Tailwind</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>

                                        {(selectedBlockCategory === "Saved" ? savedBlocks : blockTemplates.filter(b => b.type === selectedBlockType && b.category.toLowerCase() === selectedBlockCategory.toLowerCase())).length === 0 && (
                                            <div className="text-center py-20 bg-white border border-dashed rounded-xl border-slate-300">
                                                <span className="text-3xl block mb-2">📁</span>
                                                <h4 className="font-semibold text-slate-900">No blocks configured yet</h4>
                                                <p className="text-slate-500 text-sm">This category will be prefilled with beautiful ready-to-use template snippets soon.</p>
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    </div>
  );
}
