"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Clock, Plus, ChevronLeft, ChevronRight, AlertCircle, CheckCircle2, ShieldAlert } from "lucide-react";

export interface ScheduledCampaignItem {
  id: string;
  title: string;
  platform: string;
  scheduledDate: string;
  status: "Scheduled" | "Active" | "Completed" | "Draft";
  assetTitle: string;
  copyTitle: string;
  budget: number;
}

interface VisualCalendarProps {
  schedules: ScheduledCampaignItem[];
  onAddSchedule: (item: ScheduledCampaignItem) => void;
}

export const VisualCalendar: React.FC<VisualCalendarProps> = ({
  schedules,
  onAddSchedule,
}) => {
  const [currentMonth, setCurrentMonth] = useState<string>("July 2026");
  const [showAddModal, setShowAddModal] = useState<boolean>(false);

  const [newItem, setNewItem] = useState<ScheduledCampaignItem>({
    id: String(Date.now()),
    title: "Summer Sales Blast",
    platform: "Meta",
    scheduledDate: "2026-07-25",
    status: "Scheduled",
    assetTitle: "Summer_Sale_Hero_v1.mp4 (1:1)",
    copyTitle: "AIDA Hook Framework",
    budget: 45,
  });

  const handleCreateSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    onAddSchedule({ ...newItem, id: String(Date.now()) });
    setShowAddModal(false);
  };

  // Mock days of July 2026 (1 to 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);

  const platformColors: Record<string, string> = {
    Meta: "bg-blue-600/30 text-blue-300 border-blue-500/50",
    Pinterest: "bg-rose-600/30 text-rose-300 border-rose-500/50",
    TikTok: "bg-emerald-600/30 text-emerald-300 border-emerald-500/50",
    LinkedIn: "bg-sky-600/30 text-sky-300 border-sky-500/50",
    "Google Ads": "bg-amber-600/30 text-amber-300 border-amber-500/50",
    Email: "bg-purple-600/30 text-purple-300 border-purple-500/50",
  };

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="bg-slate-900 border border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-400" />
            <h3 className="text-lg font-bold text-slate-100">Cross-Platform Unified Scheduler</h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Visual launch calendar with automated asset aspect-ratio and spec length mapping.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300 font-semibold">
            <button className="p-1 hover:text-white"><ChevronLeft className="w-4 h-4" /></button>
            <span>{currentMonth}</span>
            <button className="p-1 hover:text-white"><ChevronRight className="w-4 h-4" /></button>
          </div>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 transition shadow-md shadow-emerald-600/20"
          >
            <Plus className="w-4 h-4" /> Schedule Launch
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        {/* Days Header */}
        <div className="grid grid-cols-7 bg-slate-950 border-b border-slate-800 text-center py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">
          <span>Sun</span>
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 auto-rows-fr bg-slate-900 border-l border-t border-slate-800">
          {daysInMonth.map((day) => {
            const formattedDate = `2026-07-${day < 10 ? `0${day}` : day}`;
            const daySchedules = schedules.filter((s) => s.scheduledDate === formattedDate);
            const isToday = day === 21;

            return (
              <div
                key={day}
                className={`min-h-[110px] p-2 border-r border-b border-slate-800/80 flex flex-col justify-between transition ${
                  isToday ? "bg-blue-950/20" : "hover:bg-slate-800/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center ${
                      isToday ? "bg-blue-600 text-white" : "text-slate-400"
                    }`}
                  >
                    {day}
                  </span>
                  {daySchedules.length > 0 && (
                    <span className="text-[10px] text-slate-400 font-semibold">
                      {daySchedules.length} launch
                    </span>
                  )}
                </div>

                {/* Scheduled Items for this day */}
                <div className="space-y-1.5 mt-2 flex-1">
                  {daySchedules.map((item) => (
                    <div
                      key={item.id}
                      className={`p-1.5 rounded-lg border text-[11px] font-semibold truncate flex items-center justify-between ${
                        platformColors[item.platform] || "bg-slate-800 border-slate-700 text-slate-200"
                      }`}
                    >
                      <span className="truncate">{item.title}</span>
                      <span className="text-[9px] font-bold uppercase opacity-80 shrink-0 ml-1">
                        {item.platform}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Launch Schedule List Details */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h4 className="font-bold text-sm text-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-emerald-400" /> Upcoming Launch Queue
        </h4>

        <div className="space-y-3">
          {schedules.map((item) => (
            <div
              key={item.id}
              className="bg-slate-950 p-4 border border-slate-800 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-slate-100">{item.title}</span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded border font-bold ${
                      platformColors[item.platform] || "bg-slate-800 text-slate-300"
                    }`}
                  >
                    {item.platform}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex flex-wrap gap-4 pt-1">
                  <span>📅 Date: <strong className="text-slate-200">{item.scheduledDate}</strong></span>
                  <span>🖼️ Asset: <strong className="text-slate-200">{item.assetTitle}</strong></span>
                  <span>✍️ Copy: <strong className="text-slate-200">{item.copyTitle}</strong></span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-400">${item.budget}/day</div>
                  <div className="text-[10px] text-slate-400">{item.status}</div>
                </div>
                <div className="p-2 bg-emerald-950/40 border border-emerald-800/40 rounded-xl text-emerald-300 text-xs flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Specs Mapped
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Schedule Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-emerald-400" /> Schedule New Campaign Launch
            </h3>

            <form onSubmit={handleCreateSchedule} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Campaign Launch Title
                </label>
                <input
                  type="text"
                  required
                  value={newItem.title}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Platform
                  </label>
                  <select
                    value={newItem.platform}
                    onChange={(e) => setNewItem({ ...newItem, platform: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="Meta">Meta (Facebook/IG)</option>
                    <option value="Pinterest">Pinterest</option>
                    <option value="TikTok">TikTok</option>
                    <option value="LinkedIn">LinkedIn</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Email">Email Marketing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                    Launch Date
                  </label>
                  <input
                    type="date"
                    required
                    value={newItem.scheduledDate}
                    onChange={(e) => setNewItem({ ...newItem, scheduledDate: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1">
                  Daily Budget ($ USD)
                </label>
                <input
                  type="number"
                  value={newItem.budget}
                  onChange={(e) => setNewItem({ ...newItem, budget: Number(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm text-slate-100"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30"
                >
                  Add to Launch Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
