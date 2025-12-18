"use client";

import {
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    format,
    isSameMonth,
    isSameDay,
    isToday
} from "date-fns";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
    Facebook,
    Instagram,
    Linkedin,
    Twitter,
    Youtube,
    Mail,
    Video,
    Image as ImageIcon,
    FileText
} from "lucide-react";

// Types (Move to a types file later)
export interface ContentItem {
    id: string;
    title: string;
    date: Date;
    platform: "facebook" | "instagram" | "twitter" | "linkedin" | "youtube" | "tiktok" | "pinterest" | "blog" | "email";
    type: "post" | "reel" | "story" | "video" | "article" | "newsletter";
    status: "draft" | "scheduled" | "published" | "idea";
    pillar?: "education" | "promotion" | "engagement" | "authority" | "lifestyle";
}

interface CalendarGridProps {
    currentDate: Date;
    items: ContentItem[];
    onItemClick: (item: ContentItem) => void;
    onDateClick: (date: Date) => void;
}

const PLATFORM_ICONS: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    twitter: Twitter,
    linkedin: Linkedin,
    youtube: Youtube,
    blog: FileText,
    email: Mail,
};

const PLATFORM_COLORS: Record<string, string> = {
    facebook: "text-blue-600 bg-blue-50 border-blue-100",
    instagram: "text-pink-600 bg-pink-50 border-pink-100",
    twitter: "text-slate-900 bg-slate-50 border-slate-200",
    linkedin: "text-blue-700 bg-blue-50 border-blue-100",
    youtube: "text-red-600 bg-red-50 border-red-100",
    blog: "text-indigo-600 bg-indigo-50 border-indigo-100",
    email: "text-emerald-600 bg-emerald-50 border-emerald-100",
};

const STATUS_COLORS: Record<string, string> = {
    draft: "bg-slate-200 text-slate-700",
    scheduled: "bg-blue-100 text-blue-700",
    published: "bg-emerald-100 text-emerald-700",
    idea: "bg-amber-100 text-amber-700",
};

export function CalendarGrid({ currentDate, items, onItemClick, onDateClick }: CalendarGridProps) {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    const getItemsForDate = (date: Date) => {
        return items.filter(item => isSameDay(item.date, date));
    };

    return (
        <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
            {/* Weekday Headers */}
            <div className="grid grid-cols-7 border-b bg-slate-50">
                {weekDays.map((day) => (
                    <div key={day} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Days */}
            <div className="grid grid-cols-7 auto-rows-fr bg-slate-200 gap-px">
                {calendarDays.map((day, dayIdx) => {
                    const dayItems = getItemsForDate(day);
                    const isCurrentMonth = isSameMonth(day, monthStart);

                    return (
                        <div
                            key={day.toString()}
                            onClick={() => onDateClick(day)}
                            className={cn(
                                "min-h-[140px] bg-white p-2 transition-colors hover:bg-slate-50 cursor-pointer relative group",
                                !isCurrentMonth && "bg-slate-50/50 text-slate-400"
                            )}
                        >
                            {/* Date Number */}
                            <div className="flex justify-between items-start mb-2">
                                <span
                                    className={cn(
                                        "text-sm font-medium w-7 h-7 flex items-center justify-center rounded-full",
                                        isToday(day)
                                            ? "bg-indigo-600 text-white"
                                            : "text-slate-700"
                                    )}
                                >
                                    {format(day, "d")}
                                </span>

                                {/* Add Button (Visible on Hover) */}
                                <button className="opacity-0 group-hover:opacity-100 text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded hover:bg-indigo-100 transition">
                                    + Add
                                </button>
                            </div>

                            {/* Content Items */}
                            <div className="space-y-1.5">
                                {dayItems.map((item) => {
                                    const Icon = PLATFORM_ICONS[item.platform] || FileText;
                                    const colorClass = PLATFORM_COLORS[item.platform] || "text-slate-600 bg-slate-100";

                                    return (
                                        <div
                                            key={item.id}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onItemClick(item);
                                            }}
                                            className={cn(
                                                "text-xs p-1.5 rounded border flex items-center gap-2 transition hover:shadow-sm hover:scale-[1.02]",
                                                colorClass
                                            )}
                                        >
                                            <Icon className="h-3 w-3 shrink-0" />
                                            <span className="truncate font-medium">{item.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
