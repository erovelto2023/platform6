"use client";

import React, { useState } from "react";
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Target, Layers, Rocket, HelpCircle } from "lucide-react";

interface CampaignWizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (campaignData: any) => void;
}

export const CampaignWizardModal: React.FC<CampaignWizardModalProps> = ({
  isOpen,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    productName: "",
    productType: "Digital Product / eBook",
    targetAudience: "Aspiring online entrepreneurs & side hustlers",
    corePainPoint: "Overwhelmed by confusing tools & low ad conversion",
    uniqueValue: "Simple 10-minute setup with step-by-step guidance",
    objective: "Lead Generation",
    platforms: ["Meta", "Pinterest"],
    dailyBudget: 25,
  });

  if (!isOpen) return null;

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlatformToggle = (platform: string) => {
    setFormData((prev) => {
      const exists = prev.platforms.includes(platform);
      return {
        ...prev,
        platforms: exists
          ? prev.platforms.filter((p) => p !== platform)
          : [...prev.platforms, platform],
      };
    });
  };

  const handleFinish = () => {
    onComplete({
      title: `${formData.productName || "New"} Starter Campaign`,
      objective: formData.objective,
      status: "Draft",
      platforms: formData.platforms,
      dailyBudget: formData.dailyBudget,
      totalBudget: formData.dailyBudget * 14,
      startDate: new Date(),
      metrics: { spend: 0, impressions: 0, clicks: 0, ctr: 0, cpc: 0, cpa: 0, roas: 0 },
      gapAlerts: [
        "💡 Newbie Tip: Set up your Meta Pixel & Pinterest Tag before scaling daily spend above $50.",
      ],
      productDetails: formData,
    });
    setStep(1);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 text-slate-100 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 text-white relative">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl">
              <Sparkles className="w-6 h-6 text-yellow-300" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Newbie-First Campaign Setup Wizard</h2>
              <p className="text-xs text-blue-100/90 mt-0.5">
                Answer 3 simple questions to auto-generate your complete marketing blueprint
              </p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-6 flex items-center justify-between text-xs text-blue-100/80 font-medium">
            <span>Step {step} of 4</span>
            <span>
              {step === 1 && "What are you selling?"}
              {step === 2 && "Who is your customer?"}
              {step === 3 && "Where will you launch?"}
              {step === 4 && "Review & Auto-Generate Package"}
            </span>
          </div>
          <div className="w-full bg-white/20 h-2 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-yellow-400 h-full transition-all duration-300 ease-out"
              style={{ width: `${(step / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-3 bg-blue-950/40 border border-blue-800/40 rounded-xl text-xs text-blue-200">
                <HelpCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold">Why this matters:</span> Clear product positioning guarantees your ad copy and media assets hook the right audience from second one.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is the name of your product, course, or offer?
                </label>
                <input
                  type="text"
                  value={formData.productName}
                  onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                  placeholder="e.g., Affiliate Launch Accelerator, Eco-Water Bottle, Coaching Call"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Offer Category
                </label>
                <select
                  value={formData.productType}
                  onChange={(e) => setFormData({ ...formData, productType: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Digital Product / eBook">Digital Product / eBook / Course</option>
                  <option value="Affiliate Offer">Affiliate Promotion Link</option>
                  <option value="Physical Product">Physical Product / E-Commerce</option>
                  <option value="Service / Coaching">Coaching / Service / Agency</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Campaign Objective
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {["Lead Generation", "Sales", "Brand Awareness", "Traffic"].map((obj) => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setFormData({ ...formData, objective: obj })}
                      className={`p-3 rounded-xl border text-left text-xs font-medium transition-all ${
                        formData.objective === obj
                          ? "bg-blue-600/20 border-blue-500 text-blue-300 shadow-sm"
                          : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                      }`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Who is your ideal customer?
                </label>
                <input
                  type="text"
                  value={formData.targetAudience}
                  onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                  placeholder="e.g., Busy moms seeking side income, Tech freelancers, Gym-goers"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is their #1 Pain Point or Struggle?
                </label>
                <textarea
                  value={formData.corePainPoint}
                  onChange={(e) => setFormData({ ...formData, corePainPoint: e.target.value })}
                  rows={2}
                  placeholder="e.g., Tired of spending hours trying to figure out ad graphics and copy that fails"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  What is your unique story or advantage? (AI + Human Touch)
                </label>
                <textarea
                  value={formData.uniqueValue}
                  onChange={(e) => setFormData({ ...formData, uniqueValue: e.target.value })}
                  rows={2}
                  placeholder="e.g., I built this after failing for 6 months, now saving 10 hours a week"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Select Platforms to Launch (Asset Auto-Mapping enabled)
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "Meta", name: "Meta (Facebook & IG)", ratio: "1:1, 4:5, 9:16" },
                    { id: "Pinterest", name: "Pinterest Pins", ratio: "2:3 Vertical" },
                    { id: "TikTok", name: "TikTok Ads & Spark", ratio: "9:16 Vertical" },
                    { id: "LinkedIn", name: "LinkedIn Ads", ratio: "1.91:1 / PDF" },
                    { id: "Google Ads", name: "Google Search Ads", ratio: "Text Headlines" },
                    { id: "Email", name: "Email Broadcasts", ratio: "Html / Text" },
                  ].map((p) => {
                    const selected = formData.platforms.includes(p.id);
                    return (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handlePlatformToggle(p.id)}
                        className={`p-3.5 rounded-xl border text-left transition-all ${
                          selected
                            ? "bg-indigo-600/20 border-indigo-500 text-indigo-200 shadow-sm"
                            : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold text-sm">
                          <span>{p.name}</span>
                          {selected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                        </div>
                        <div className="text-[11px] opacity-70 mt-1">Recommended Specs: {p.ratio}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
                  Target Daily Ad Spend ($ USD)
                </label>
                <div className="flex items-center gap-4 bg-slate-950 p-4 border border-slate-800 rounded-xl">
                  <input
                    type="range"
                    min="5"
                    max="200"
                    step="5"
                    value={formData.dailyBudget}
                    onChange={(e) => setFormData({ ...formData, dailyBudget: Number(e.target.value) })}
                    className="w-full accent-blue-500"
                  />
                  <span className="text-lg font-bold text-blue-400 min-w-[60px] text-right">
                    ${formData.dailyBudget}/day
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4 */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 text-xs flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold">Starter Blueprint Ready!</span> We will construct your asset prompts, copy frameworks (AIDA/PAS), and launch timeline.
                </div>
              </div>

              <div className="bg-slate-950 p-4 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Offer Name:</span>
                  <span className="font-semibold text-slate-100">{formData.productName || "Untitled Offer"}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Category:</span>
                  <span>{formData.productType}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Audience:</span>
                  <span>{formData.targetAudience}</span>
                </div>
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">Connected Platforms:</span>
                  <span className="text-indigo-400 font-semibold">{formData.platforms.join(", ") || "None"}</span>
                </div>
                <div className="flex justify-between pt-1">
                  <span className="text-slate-400">Daily Test Spend:</span>
                  <span className="text-emerald-400 font-bold">${formData.dailyBudget}/day</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
          {step > 1 ? (
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold flex items-center gap-2 transition"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 text-slate-400 hover:text-slate-200 text-xs font-semibold transition"
            >
              Cancel
            </button>
          )}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-lg shadow-blue-600/30"
            >
              Next Step <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-lg shadow-emerald-600/30"
            >
              <Rocket className="w-4 h-4" /> Build Campaign Blueprint
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
