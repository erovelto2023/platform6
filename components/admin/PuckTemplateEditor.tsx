"use client";

import { Puck } from "@puckeditor/core";
import "@puckeditor/core/puck.css";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { puckConfig } from "@/lib/puck-config";
import { useState } from "react";
import { ArrowLeft, Copy, Info } from "lucide-react";
import Link from "next/link";
import { savePageTypeTemplate } from "@/lib/actions/custom-pages.actions";
import { IPageType } from "@/lib/db/models/PageType";

interface PuckTemplateEditorProps {
    pageType: IPageType;
}

export function PuckTemplateEditor({ pageType }: PuckTemplateEditorProps) {
  const router = useRouter();
  const [showPlaceholders, setShowPlaceholders] = useState(false);

  // Parse existing template JSON or start empty
  let initialPuckData = { content: [], root: {} };
  if (pageType.puckTemplate) {
      try {
          initialPuckData = typeof pageType.puckTemplate === 'string' 
              ? JSON.parse(pageType.puckTemplate) 
              : pageType.puckTemplate;
      } catch (e) {
          console.error("Failed to parse Puck template data", e);
      }
  }

  const handlePublish = async (data: any) => {
      try {
          const res = await savePageTypeTemplate(pageType.slug, data);
          if (res.success) {
              toast.success("Page template saved successfully!");
          } else {
              toast.error(res.error || "Failed to save template.");
          }
      } catch (error) {
          console.error(error);
          toast.error("Failed to save template.");
      }
  };

  const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
      toast.success(`Copied placeholder: ${text}`);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-slate-50">
        {/* Top Meta Bar */}
        <div className="h-14 bg-white border-b flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-4">
                <Link href="/admin/custom-pages" className="p-2 hover:bg-slate-100 rounded-md text-slate-500 transition-colors">
                    <ArrowLeft className="w-5 h-5" />
                </Link>
                <div className="h-6 w-px bg-slate-200" />
                <div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block leading-none mb-1">Page Type Template</span>
                    <h2 className="font-bold text-sm text-slate-800 leading-none">{pageType.name}</h2>
                </div>
            </div>
            
            <div className="flex items-center gap-4 relative">
                <button 
                    onClick={() => setShowPlaceholders(!showPlaceholders)}
                    className={`text-xs px-3 py-1.5 rounded-md border font-medium transition-colors flex items-center gap-1.5 ${showPlaceholders ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                >
                    <Info className="w-3.5 h-3.5" /> Placeholders / Schema Fields
                </button>

                {showPlaceholders && (
                    <div className="absolute top-10 right-0 w-80 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden flex flex-col max-h-[400px]">
                        <div className="p-4 border-b bg-slate-50">
                            <h4 className="text-xs font-black text-slate-700 uppercase tracking-widest">Template Placeholders</h4>
                            <p className="text-[10px] text-slate-400 mt-1">Copy and paste these tags into any Puck text block or heading. They will resolve dynamically at runtime.</p>
                        </div>
                        <div className="p-4 overflow-y-auto space-y-3">
                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Standard Fields</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button 
                                        onClick={() => copyToClipboard("{{title}}")} 
                                        className="text-left text-xs bg-slate-50 hover:bg-slate-100 border p-2 rounded flex justify-between items-center group font-mono"
                                    >
                                        <span>{"{{"}title{"}}"}</span>
                                        <Copy size={10} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                                    </button>
                                    <button 
                                        onClick={() => copyToClipboard("{{slug}}")} 
                                        className="text-left text-xs bg-slate-50 hover:bg-slate-100 border p-2 rounded flex justify-between items-center group font-mono"
                                    >
                                        <span>{"{{"}slug{"}}"}</span>
                                        <Copy size={10} className="opacity-0 group-hover:opacity-100 text-slate-400" />
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Custom Schema Fields</span>
                                <div className="space-y-2">
                                    {pageType.fields.map(field => (
                                        <button 
                                            key={field.name}
                                            onClick={() => copyToClipboard(`{{${field.name}}}`)} 
                                            className="w-full text-left text-xs bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 text-indigo-700 p-2 rounded flex justify-between items-center group font-mono"
                                        >
                                            <span>{"{{"}{field.name}{"}}"}</span>
                                            <div className="flex items-center gap-1.5">
                                                <span className="text-[8px] bg-indigo-200 text-indigo-800 px-1 rounded uppercase">{field.type}</span>
                                                <Copy size={10} className="opacity-0 group-hover:opacity-100 text-indigo-500" />
                                            </div>
                                        </button>
                                    ))}
                                    {pageType.fields.length === 0 && (
                                        <p className="text-[10px] text-slate-400 italic text-center py-2">No custom fields defined. Go back and edit schema fields to use placeholders.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Editor Area */}
        <div className="flex-1 overflow-hidden">
            <Puck 
                config={puckConfig} 
                data={initialPuckData as any} 
                onPublish={handlePublish}
            />
        </div>
    </div>
  );
}
