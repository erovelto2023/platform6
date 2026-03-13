"use client";

import { useState } from "react";
import { FileText, Save, AlertCircle, CheckCircle, Bot, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface NicheImporterProps {
  onImport: (data: any) => void;
}

export default function NicheImporter({ onImport }: NicheImporterProps) {
  const [importData, setImportData] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleImport = () => {
    if (!importData.trim()) {
      setMessage("Please paste some JSON data first.");
      setStatus("error");
      return;
    }

    try {
      let trimmedData = importData.trim();
      
      // Strip markdown blocks if AI generated them
      if (trimmedData.startsWith('```')) {
        const lines = trimmedData.split('\n');
        if (lines.length > 2) {
          trimmedData = lines.slice(1, -1).join('\n').trim();
        }
      }

      const parsedData = JSON.parse(trimmedData);
      
      // Map arrays in ideas to newline-separated strings
      if (parsedData.ideas) {
        Object.keys(parsedData.ideas).forEach(key => {
          if (Array.isArray(parsedData.ideas[key])) {
            parsedData.ideas[key] = parsedData.ideas[key].join('\n');
          }
        });
      }

      // Basic validation - check if it looks like a niche box object
      if (!parsedData.nicheName && !parsedData.nicheSlug) {
        throw new Error("Invalid format: Missing required fields (nicheName or nicheSlug)");
      }

      onImport(parsedData);
      setMessage("Data successfully parsed and loaded into form.");
      setStatus("success");
      setImportData("");
    } catch (e: any) {
      setMessage(`JSON Error: ${e.message}. Please check your syntax.`);
      setStatus("error");
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-3 bg-slate-900 text-white rounded-xl">
          <FileText size={20} />
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">Niche JSON Importer</h2>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest Italice">Paste your generated JSON below</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="block text-xs font-black text-slate-500 uppercase tracking-widest">
            JSON DATA INPUT
          </label>
          <Textarea
            value={importData}
            onChange={(e) => setImportData(e.target.value)}
            placeholder='{ "nicheName": "Eco-Friendly Gardening", ... }'
            className="h-80 bg-slate-50 border-slate-200 font-mono text-xs p-4 rounded-xl focus:ring-black"
          />
          <Button 
            onClick={handleImport}
            disabled={!importData}
            className="w-full bg-black hover:bg-slate-800 text-white font-black uppercase tracking-widest py-6 rounded-xl shadow-lg transition-transform hover:-translate-y-1"
          >
            LOAD DATA INTO FORM
          </Button>
        </div>

        <div className="space-y-6">
          <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
            <h3 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-4 flex items-center justify-between">
              <span className="flex items-center gap-2"><Bot size={14} /> HOW TO USE</span>
              <span className="bg-indigo-600 text-white px-2 py-0.5 rounded text-[8px]">PRO TIP</span>
            </h3>
            <div className="space-y-3 text-xs text-indigo-900 font-medium leading-relaxed">
              <p>1. Copy the <span className="font-black italic">AI Importer Prompt</span> from the first tab.</p>
              <p>2. Paste it into an AI (Claude/GPT-4o) to generate your niche data.</p>
              <p>3. Copy the resulting <span className="font-black italic">JSON Block</span> and paste it here.</p>
              <p>4. Click "Load Data" to instantly populate all tabs!</p>
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 border-dashed">
             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 flex items-center gap-2">
                <AlertCircle size={14} /> IMPORTANT
             </h3>
             <p className="text-[10px] text-slate-500 font-bold uppercase leading-tight">
                This will overwrite existing fields in the form. Make sure you've backed up any manual changes.
             </p>
          </div>
        </div>
      </div>

      {status !== 'idle' && (
        <div className={`p-4 rounded-xl flex items-center gap-3 font-bold ${status === 'success' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
          {status === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
          <p className="text-sm">{message}</p>
        </div>
      )}
    </div>
  );
}
