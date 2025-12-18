"use client";

import { useState, useEffect } from "react";
import { addMonths, subMonths, startOfToday } from "date-fns";
import { CalendarHeader } from "./calendar-header";
import { CalendarGrid, ContentItem } from "./calendar-grid";
import { useRouter } from "next/navigation";

interface ContentCalendarProps {
    posts?: any[];
}

export function ContentCalendar({ posts = [] }: ContentCalendarProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(startOfToday());
    const [view, setView] = useState<"month" | "week" | "list">("month");
    const [items, setItems] = useState<ContentItem[]>([]);

    useEffect(() => {
        if (posts) {
            const mappedItems: ContentItem[] = posts.map(p => ({
                id: p._id,
                title: p.title,
                date: p.scheduledFor ? new Date(p.scheduledFor) : new Date(), // Fallback to now if not scheduled, though calendar usually shows scheduled
                platform: p.platforms?.[0]?.name || 'blog', // Default to first platform or blog
                type: p.contentType as any,
                status: p.status as any,
                pillar: p.contentPillar as any
            })).filter(p => p.date); // Only show items with dates
            setItems(mappedItems);
        }
    }, [posts]);

    const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
    const handleToday = () => setCurrentDate(startOfToday());

    const handleDateClick = (date: Date) => {
        router.push(`/tools/content-planner/create?date=${date.toISOString()}`);
    };

    const handleItemClick = (item: ContentItem) => {
        // Open item details or edit
        console.log("Item clicked:", item);
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-sm h-full flex flex-col">
            <CalendarHeader
                currentDate={currentDate}
                view={view}
                onPrev={handlePrevMonth}
                onNext={handleNextMonth}
                onViewChange={setView}
                onToday={handleToday}
            />

            <div className="flex-1 overflow-y-auto mt-4">
                {view === "month" && (
                    <CalendarGrid
                        currentDate={currentDate}
                        items={items}
                        onDateClick={handleDateClick}
                        onItemClick={handleItemClick}
                    />
                )}

                {view !== "month" && (
                    <div className="h-96 flex items-center justify-center border-2 border-dashed rounded-lg bg-slate-50">
                        <p className="text-slate-500">
                            {view === "week" ? "Week" : "List"} view coming soon
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
