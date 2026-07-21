"use client";

import React, { useState } from "react";
import { FileImage, Video, Palette, Tag, Upload, AlertTriangle, CheckCircle, Info, Trash2, Plus, ShieldCheck } from "lucide-react";

export interface DigitalAssetItem {
  _id?: string;
  title: string;
  url: string;
  mediaType: "image" | "video" | "logo" | "palette";
  width: number;
  height: number;
  aspectRatio: string;
  version: string;
  tags: string[];
  category: string;
  platformTarget: string;
}

interface DigitalAssetManagerProps {
  assets: DigitalAssetItem[];
  onAddAsset: (asset: Omit<DigitalAssetItem, "_id">) => void;
  onDeleteAsset: (id: string) => void;
}

export const DigitalAssetManager: React.FC<DigitalAssetManagerProps> = ({
  assets,
  onAddAsset,
  onDeleteAsset,
}) => {
  const [filterType, setFilterType] = useState<string>("all");
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);
  const [newAsset, setNewAsset] = useState<Omit<DigitalAssetItem, "_id">>({
    title: "",
    url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
    mediaType: "image",
    width: 1080,
    height: 1080,
    aspectRatio: "1:1",
    version: "v1.0",
    tags: ["Social Feed", "Meta"],
    category: "Feed Post",
    platformTarget: "Meta",
  });

  const filteredAssets = assets.filter((a) => {
    if (filterType === "all") return true;
    return a.mediaType === filterType;
  });

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAsset.title) return;
    onAddAsset(newAsset);
    setShowUploadModal(false);
    setNewAsset({
      title: "",
      url: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&auto=format&fit=crop&q=60",
      mediaType: "image",
      width: 1080,
      height: 1080,
      aspectRatio: "1:1",
      version: "v1.0",
      tags: ["Social Feed", "Meta"],
      category: "Feed Post",
      platformTarget: "Meta",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-2xl">
        <div>
          <div className="flex items-center gap-2">
            <FileImage className="w-5 h-5 text-blue-400" />
            <h3 className="text-lg font-bold text-slate-100">Digital Asset Manager (DAM)</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Store, version control, and tag your ad creatives with built-in aspect-ratio mismatch protection.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition shadow-md shadow-blue-600/20"
        >
          <Plus className="w-4 h-4" /> Add New Media Asset
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {[
          { id: "all", label: "All Assets", icon: FileImage },
          { id: "image", label: "Images", icon: FileImage },
          { id: "video", label: "Videos", icon: Video },
          { id: "logo", label: "Logos", icon: ShieldCheck },
          { id: "palette", label: "Palettes", icon: Palette },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = filterType === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition ${
                isActive
                  ? "bg-blue-600 text-white shadow-sm"
                  : "bg-slate-900 border border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200"
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Assets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredAssets.map((asset, idx) => {
          // Dynamic Ratio Check Alert
          const isPinterestWarning =
            asset.platformTarget === "Pinterest" && asset.aspectRatio !== "2:3";
          const isReelsWarning =
            (asset.platformTarget === "TikTok" || asset.category.includes("Reels")) &&
            asset.aspectRatio !== "9:16";

          return (
            <div
              key={asset._id || idx}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden transition-all flex flex-col justify-between group"
            >
              {/* Media Preview Container */}
              <div className="relative aspect-video bg-slate-950 overflow-hidden flex items-center justify-center">
                {asset.mediaType === "image" || asset.mediaType === "logo" ? (
                  <img
                    src={asset.url}
                    alt={asset.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : asset.mediaType === "video" ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-indigo-950/40 text-indigo-300 p-4 text-center">
                    <Video className="w-10 h-10 mb-2 text-indigo-400" />
                    <span className="text-xs font-semibold">{asset.title}</span>
                    <span className="text-[10px] opacity-75 mt-0.5">({asset.aspectRatio} Video)</span>
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-slate-950 p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-500" />
                      <div className="w-8 h-8 rounded-full bg-emerald-500" />
                      <div className="w-8 h-8 rounded-full bg-amber-500" />
                    </div>
                  </div>
                )}

                {/* Aspect Ratio Badge */}
                <div className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-slate-200 border border-slate-800">
                  {asset.aspectRatio} ({asset.width}x{asset.height})
                </div>

                {/* Version Badge */}
                <div className="absolute top-3 right-3 bg-blue-600/90 text-white px-2 py-0.5 rounded-md text-[10px] font-bold shadow-md">
                  {asset.version}
                </div>
              </div>

              {/* Asset Details */}
              <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-bold text-sm text-slate-100">{asset.title}</h4>
                    <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-medium">
                      {asset.platformTarget}
                    </span>
                  </div>

                  {/* Aspect Ratio Mismatch Alerts */}
                  {isPinterestWarning && (
                    <div className="mt-2.5 p-2.5 bg-amber-950/60 border border-amber-800/60 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Spec Warning:</span> Pinterest algorithm heavily rewards vertical 2:3 images (1000x1500px). Square assets may lose reach.
                      </div>
                    </div>
                  )}

                  {isReelsWarning && (
                    <div className="mt-2.5 p-2.5 bg-amber-950/60 border border-amber-800/60 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold">Spec Warning:</span> TikTok & Reels mandate 9:16 vertical orientation (1080x1920px).
                      </div>
                    </div>
                  )}

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {asset.tags.map((t, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 bg-slate-950 border border-slate-800 text-slate-400 rounded-md flex items-center gap-1"
                      >
                        <Tag className="w-2.5 h-2.5 text-blue-400" /> {t}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="text-[11px] text-slate-400">{asset.category}</span>
                  {asset._id && (
                    <button
                      onClick={() => onDeleteAsset(asset._id!)}
                      className="text-rose-400 hover:text-rose-300 text-xs flex items-center gap-1 transition"
                    >
                      <Trash2 className="w-3.5 h-3.5" /> Delete
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-400" /> Register Media Asset
            </h3>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Asset Title / File Name
                </label>
                <input
                  type="text"
                  required
                  value={newAsset.title}
                  onChange={(e) => setNewAsset({ ...newAsset, title: e.target.value })}
                  placeholder="e.g. Summer_Sale_Hero_v1.mp4"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Media Type
                </label>
                <select
                  value={newAsset.mediaType}
                  onChange={(e) =>
                    setNewAsset({ ...newAsset, mediaType: e.target.value as any })
                  }
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                >
                  <option value="image">Image (Feed / Display)</option>
                  <option value="video">Video (Reels / TikTok)</option>
                  <option value="logo">Brand Logo</option>
                  <option value="palette">Color Swatch Palette</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Target Platform
                  </label>
                  <select
                    value={newAsset.platformTarget}
                    onChange={(e) => setNewAsset({ ...newAsset, platformTarget: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Meta">Meta (Facebook/IG)</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Google">Google Ads</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Aspect Ratio
                  </label>
                  <select
                    value={newAsset.aspectRatio}
                    onChange={(e) => setNewAsset({ ...newAsset, aspectRatio: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="1:1">1:1 Square (1080x1080)</option>
                    <option value="9:16">9:16 Vertical (1080x1920)</option>
                    <option value="2:3">2:3 Pin Ratio (1000x1500)</option>
                    <option value="1.91:1">1.91:1 Landscape (1200x628)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Image or Media URL
                </label>
                <input
                  type="text"
                  value={newAsset.url}
                  onChange={(e) => setNewAsset({ ...newAsset, url: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  Save Asset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
