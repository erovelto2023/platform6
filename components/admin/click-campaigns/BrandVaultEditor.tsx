"use client";

import React, { useState } from "react";
import { ShieldCheck, Palette, Save, Sparkles, CheckCircle2 } from "lucide-react";

export interface BrandVaultData {
  brandName: string;
  brandVoice: string;
  toneRules: string;
  visualRules: string;
  targetAudienceProfile: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
}

interface BrandVaultEditorProps {
  brandData?: BrandVaultData;
  onSaveBrand: (data: BrandVaultData) => void;
}

export const BrandVaultEditor: React.FC<BrandVaultEditorProps> = ({
  brandData = {
    brandName: "KB Academy",
    brandVoice: "Empowering, authoritative, friendly, authentic, beginner-accessible",
    toneRules: "Conversational, direct, no overwhelming jargon, highly solution-oriented",
    visualRules: "Clean modern typography, high contrast dark-mode UI, warm natural lighting in photography",
    targetAudienceProfile: "Aspiring online entrepreneurs, affiliate marketers, side-hustlers looking for clarity",
    primaryColor: "#3b82f6",
    secondaryColor: "#10b981",
    accentColor: "#f59e0b",
  },
  onSaveBrand,
}) => {
  const [formData, setFormData] = useState<BrandVaultData>(brandData);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveBrand(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Brand Guidelines Vault</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Define your core brand voice, visual style rules, and color palettes so AI Co-Pilot & manual assets stay 100% on-brand.
          </p>
        </div>

        {savedSuccess && (
          <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Brand Vault Updated!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Brand / Business Name
            </label>
            <input
              type="text"
              required
              value={formData.brandName}
              onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Target Customer Profile (Persona)
            </label>
            <input
              type="text"
              required
              value={formData.targetAudienceProfile}
              onChange={(e) => setFormData({ ...formData, targetAudienceProfile: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Brand Voice & Personality Traits
            </label>
            <textarea
              rows={3}
              value={formData.brandVoice}
              onChange={(e) => setFormData({ ...formData, brandVoice: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Tone & Copywriting Rules
            </label>
            <textarea
              rows={3}
              value={formData.toneRules}
              onChange={(e) => setFormData({ ...formData, toneRules: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
            Visual Style Guidelines
          </label>
          <textarea
            rows={2}
            value={formData.visualRules}
            onChange={(e) => setFormData({ ...formData, visualRules: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-100"
          />
        </div>

        {/* Color Palette Swatches */}
        <div className="border-t border-slate-800 pt-5 space-y-3">
          <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
            <Palette className="w-4 h-4 text-indigo-400" /> Brand Color Swatch Palette
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <input
                type="color"
                value={formData.primaryColor}
                onChange={(e) => setFormData({ ...formData, primaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <div>
                <div className="text-xs font-bold text-slate-200">Primary Color</div>
                <div className="text-[11px] font-mono text-slate-400">{formData.primaryColor}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <input
                type="color"
                value={formData.secondaryColor}
                onChange={(e) => setFormData({ ...formData, secondaryColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <div>
                <div className="text-xs font-bold text-slate-200">Secondary Color</div>
                <div className="text-[11px] font-mono text-slate-400">{formData.secondaryColor}</div>
              </div>
            </div>

            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center gap-3">
              <input
                type="color"
                value={formData.accentColor}
                onChange={(e) => setFormData({ ...formData, accentColor: e.target.value })}
                className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
              />
              <div>
                <div className="text-xs font-bold text-slate-200">Accent Color</div>
                <div className="text-[11px] font-mono text-slate-400">{formData.accentColor}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition"
          >
            <Save className="w-4 h-4" /> Save Brand Vault Rules
          </button>
        </div>
      </form>
    </div>
  );
};
