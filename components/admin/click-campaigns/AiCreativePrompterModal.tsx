"use client";

import React, { useState } from "react";
import { Sparkles, Copy, Check, Image as ImageIcon, Sliders } from "lucide-react";

export const AiCreativePrompterModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const [productTopic, setProductTopic] = useState<string>("Affiliate Marketing Masterclass");
  const [visualStyle, setVisualStyle] = useState<string>("Modern Minimalist Dark Mode UI with Neon Accents");
  const [aspectRatio, setAspectRatio] = useState<string>("--ar 1:1");
  const [targetPlatform, setTargetPlatform] = useState<string>("Meta");
  const [copiedPrompt, setCopiedPrompt] = useState<boolean>(false);

  if (!isOpen) return null;

  const generatedPrompt = `Ultra-detailed commercial ad hero visual for "${productTopic}", style: ${visualStyle}, photorealistic 8k lighting, cinematic depth of field, high contrast vibrant colors, optimized for ${targetPlatform} ad format ${aspectRatio} --v 6.0`;

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopiedPrompt(true);
    setTimeout(() => setCopiedPrompt(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in duration-200">
        <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">AI Ad Creative Prompt Generator</h2>
              <p className="text-xs text-purple-100/90 mt-0.5">
                Generate high-converting Midjourney / DALL-E / Flux prompts tailored to platform ratios.
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white text-lg font-bold">✕</button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Product / Subject Topic
            </label>
            <input
              type="text"
              value={productTopic}
              onChange={(e) => setProductTopic(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
              Visual Aesthetics Style
            </label>
            <select
              value={visualStyle}
              onChange={(e) => setVisualStyle(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
            >
              <option value="Modern Minimalist Dark Mode UI with Neon Accents">Modern Minimalist Dark Mode UI</option>
              <option value="Authentic Founder Lifestyle Studio Portrait">Authentic Founder Lifestyle Studio</option>
              <option value="3D Vibrant Isometric Infographic Graphic">3D Vibrant Isometric Infographic</option>
              <option value="Flat Vector Clean Graphic with High Contrast Typography">Flat Vector Graphic</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Target Platform
              </label>
              <select
                value={targetPlatform}
                onChange={(e) => {
                  setTargetPlatform(e.target.value);
                  if (e.target.value === "Pinterest") setAspectRatio("--ar 2:3");
                  else if (e.target.value === "TikTok") setAspectRatio("--ar 9:16");
                  else setAspectRatio("--ar 1:1");
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
              >
                <option value="Meta">Meta (1:1 / 4:5)</option>
                <option value="Pinterest">Pinterest (2:3)</option>
                <option value="TikTok">TikTok (9:16)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                Aspect Ratio Flag
              </label>
              <input
                type="text"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
          </div>

          {/* Prompt Output */}
          <div className="bg-slate-950 p-4 border border-purple-500/30 rounded-xl space-y-2">
            <div className="text-[10px] uppercase font-bold text-purple-300 flex items-center justify-between">
              <span>Generated Image Prompt</span>
              <span className="font-mono text-slate-400">Midjourney / Flux / DALL-E</span>
            </div>
            <p className="text-xs text-slate-200 font-mono leading-relaxed bg-slate-900 p-3 rounded-lg border border-slate-800">
              {generatedPrompt}
            </p>
          </div>
        </div>

        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          <span className="text-xs text-slate-400">Ready to copy into Midjourney or DALL-E</span>
          <button
            onClick={handleCopy}
            className="px-5 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-md shadow-purple-600/30"
          >
            {copiedPrompt ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            {copiedPrompt ? "Prompt Copied!" : "Copy Prompt"}
          </button>
        </div>
      </div>
    </div>
  );
};
