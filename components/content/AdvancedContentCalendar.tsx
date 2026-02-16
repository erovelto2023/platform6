
"use client";

import { useState } from "react";
import {
    format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
    eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths,
    isToday, startOfToday
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Filter as FilterIcon, Plus } from "lucide-react";
import { ContentCard } from "./ContentCard";
import { ContentFilters, FilterState } from "./ContentFilters";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ContentWizard } from "./ContentWizard";
import { CampaignWizard } from "./CampaignWizard";
import { OfferWizard } from "./OfferWizard";

interface AdvancedContentCalendarProps {
    posts: any[];
    campaigns: any[];
    offers: any[];
}

export function AdvancedContentCalendar({ posts, campaigns, offers }: AdvancedContentCalendarProps) {
    const [currentDate, setCurrentDate] = useState(startOfToday());
    const [filters, setFilters] = useState<FilterState>({
        platforms: [],
        status: [],
        campaignId: null,
        offerId: null,
        funnelStage: null
    });

    const [selectedPost, setSelectedPost] = useState<any | null>(null);

    // Navigation
    const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));

    const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
    const today = () => setCurrentDate(startOfToday());

    // Filtering Logic
    const filteredPosts = posts.filter(post => {
        if (filters.platforms.length > 0) {
            const hasPlatform = post.platforms?.some((p: any) => filters.platforms.includes(p.name)) ||
                filters.platforms.includes(post.contentType);
            if (!hasPlatform) return false;
        }
        if (filters.status.length > 0 && !filters.status.includes(post.status)) return false;
        if (filters.campaignId && post.campaignId?._id !== filters.campaignId) return false;
        if (filters.offerId && post.offerId?._id !== filters.offerId) return false;
        if (filters.funnelStage && post.funnelStage !== filters.funnelStage) return false;
        return true;
    });

    // Calendar Grid Generation
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

    const weeks = [];
    let days = [];
    let day = startDate;

    // chunk days into weeks
    for (let i = 0; i < calendarDays.length; i += 7) {
        weeks.push(calendarDays.slice(i, i + 7));
    }

    return (
        <div className="flex h-[calc(100vh-200px)] gap-6">
            {/* Main Calendar Area */}
            <div className="flex-1 flex flex-col bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                {/* Header */}
                <div className="p-4 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center bg-slate-100 rounded-lg p-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prevMonth}>
                                <ChevronLeft className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 px-2 font-medium" onClick={today}>
                                Today
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={nextMonth}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                        <h2 className="text-xl font-bold text-slate-900">
                            {format(currentDate, 'MMMM yyyy')}
                        </h2>
                    </div>

                    <div className="flex items-center gap-2">
                        {/* Mobile Filters Trigger */}
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="sm" className="lg:hidden">
                                    <FilterIcon className="mr-2 h-4 w-4" /> Filters
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left">
                                <SheetHeader>
                                    <SheetTitle>Filters</SheetTitle>
                                </SheetHeader>
                                <div className="mt-4">
                                    <ContentFilters
                                        filters={filters}
                                        onChange={setFilters}
                                        campaigns={campaigns}
                                        offers={offers}
                                    />
                                </div>
                            </SheetContent>
                        </Sheet>


                        <CampaignWizard />
                        <OfferWizard />
                        <ContentWizard
                            campaigns={campaigns}
                            offers={offers}
                        />
                    </div>
                </div>

                {/* Days Header */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                        <div key={dayName} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {dayName}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="flex-1 overflow-y-auto bg-slate-100">
                    <div className="grid grid-cols-7 auto-rows-fr min-h-full border-l border-t border-slate-200">
                        {weeks.map((week, wIndex) => (
                            week.map((day, dIndex) => {
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isCurrentDay = isToday(day);
                                const dayPosts = filteredPosts.filter(p => p.scheduledFor && isSameDay(new Date(p.scheduledFor), day));

                                return (
                                    <div
                                        key={day.toString()}
                                        className={cn(
                                            "min-h-[140px] bg-white border-b border-r border-slate-200 p-2 flex flex-col gap-2 transition-colors hover:bg-slate-50",
                                            !isCurrentMonth && "bg-slate-50/50 text-slate-400"
                                        )}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-xs font-semibold h-6 w-6 flex items-center justify-center rounded-full",
                                                isCurrentDay ? "bg-indigo-600 text-white" : "text-slate-500"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                        </div>

                                        <div className="flex flex-col gap-2 flex-1">
                                            {dayPosts.map(post => (
                                                <ContentCard key={post._id} item={post} onClick={() => setSelectedPost(post)} />
                                            ))}
                                        </div>
                                    </div>
                                );
                            })
                        ))}
                    </div>
                </div>
            </div>

            {/* Sidebar Filters (Desktop) */}
            <div className="hidden lg:block w-72 bg-white rounded-xl border border-slate-200 shadow-sm p-4 h-full overflow-y-auto">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                    <FilterIcon className="h-4 w-4" /> Filters
                </h3>
                <ContentFilters
                    filters={filters}
                    onChange={setFilters}
                    campaigns={campaigns}
                    offers={offers}
                />
            </div>

            {/* Edit Wizard */}
            {selectedPost && (
                <ContentWizard
                    open={!!selectedPost}
                    onOpenChange={(open) => !open && setSelectedPost(null)}
                    campaigns={campaigns}
                    offers={offers}
                    initialData={selectedPost}
                    onSuccess={() => setSelectedPost(null)}
                />
            )}
        </div>
    );
}
