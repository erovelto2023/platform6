
"use client";

import { useState, useEffect } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addDays,
    isToday,
    addWeeks,
    subWeeks,
    addHours,
    startOfDay,
    endOfDay,
    getHours,
    setHours,
    setMinutes
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export type CalendarViewType = 'month' | 'week' | 'day';

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    color?: string; // class name for background
    data?: any; // original object
    onClick?: () => void;
}

interface UnifiedCalendarProps {
    events: CalendarEvent[];
    view: CalendarViewType;
    date: Date;
    onViewChange: (view: CalendarViewType) => void;
    onDateChange: (date: Date) => void;
    onEventClick?: (event: CalendarEvent) => void;
    onEmptySlotClick?: (date: Date) => void;
}

export function UnifiedCalendar({
    events,
    view,
    date,
    onViewChange,
    onDateChange,
    onEventClick,
    onEmptySlotClick
}: UnifiedCalendarProps) {

    // View Navigation
    const next = () => {
        if (view === 'month') onDateChange(addMonths(date, 1));
        if (view === 'week') onDateChange(addWeeks(date, 1));
        if (view === 'day') onDateChange(addDays(date, 1));
    };

    const prev = () => {
        if (view === 'month') onDateChange(subMonths(date, 1));
        if (view === 'week') onDateChange(subWeeks(date, 1));
        if (view === 'day') onDateChange(subDays(date, 1)); // We need subDays imported or just addDays(date, -1)
    };

    // Missing subDays in import, using addDays -1
    const subDays = (d: Date, n: number) => addDays(d, -n);

    const today = () => onDateChange(new Date());

    // --- RENDERERS ---

    const renderMonthView = () => {
        const monthStart = startOfMonth(date);
        const monthEnd = endOfMonth(monthStart);
        const startDate = startOfWeek(monthStart);
        const endDate = endOfWeek(monthEnd);

        const weeks = [];
        let days = [];
        let day = startDate;

        while (day <= endDate) {
            for (let i = 0; i < 7; i++) {
                days.push(day);
                day = addDays(day, 1);
            }
            weeks.push(days);
            days = [];
        }

        return (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                        <div key={dayName} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {dayName}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col bg-slate-200 gap-px border-b border-slate-200">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-px bg-slate-200">
                            {week.map((day, dayIndex) => {
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isCurrentDay = isToday(day);
                                const dayEvents = events.filter(e => isSameDay(e.start, day));

                                return (
                                    <div
                                        key={dayIndex}
                                        className={cn(
                                            "min-h-[120px] bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50",
                                            !isCurrentMonth && "bg-slate-50/50 text-slate-400"
                                        )}
                                        onClick={() => onEmptySlotClick?.(day)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-xs font-semibold h-6 w-6 flex items-center justify-center rounded-full",
                                                isCurrentDay ? "bg-indigo-600 text-white" : "text-slate-500"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1 mt-1">
                                            {dayEvents.slice(0, 3).map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                                    className={cn(
                                                        "text-[10px] p-1 rounded border truncate font-medium cursor-pointer flex items-center gap-1",
                                                        event.color ? event.color : "bg-indigo-50 text-indigo-700 border-indigo-100 hover:bg-indigo-100"
                                                    )}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0 opacity-70" />
                                                    <span className="truncate">{format(event.start, 'h:mm a')} {event.title}</span>
                                                </div>
                                            ))}
                                            {dayEvents.length > 3 && (
                                                <div className="text-[10px] text-slate-500 pl-1 font-medium hover:text-indigo-600 cursor-pointer">
                                                    + {dayEvents.length - 3} more
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    const renderWeekView = () => {
        const weekStart = startOfWeek(date);
        const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
        const hours = Array.from({ length: 24 }, (_, i) => i); // 0-23 hours

        return (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] overflow-y-auto">
                {/* Header */}
                <div className="grid grid-cols-[60px_1fr] sticky top-0 z-10 bg-white border-b border-slate-200">
                    <div className="border-r border-slate-200 bg-slate-50"></div> {/* Time axis header */}
                    <div className="grid grid-cols-7">
                        {weekDays.map((day, i) => (
                            <div key={i} className={cn(
                                "py-2 text-center border-r border-slate-100 last:border-0",
                                isToday(day) && "bg-indigo-50/50"
                            )}>
                                <div className={cn("text-xs font-semibold uppercase", isToday(day) ? "text-indigo-600" : "text-slate-500")}>
                                    {format(day, 'EEE')}
                                </div>
                                <div className={cn(
                                    "text-sm font-bold w-8 h-8 rounded-full flex items-center justify-center mx-auto mt-1",
                                    isToday(day) ? "bg-indigo-600 text-white" : "text-slate-900"
                                )}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-[60px_1fr] flex-1">
                    {/* Time Axis */}
                    <div className="border-r border-slate-200 bg-slate-50">
                        {hours.map(hour => (
                            <div key={hour} className="h-12 text-xs text-slate-400 text-right pr-2 pt-1 border-b border-slate-100 relativ">
                                {format(setHours(new Date(), hour), 'h a')}
                            </div>
                        ))}
                    </div>

                    {/* Columns */}
                    <div className="grid grid-cols-7 relative">
                        {/* Horizontal Hour Lines (background) */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {hours.map(hour => (
                                <div key={hour} className="h-12 border-b border-slate-100 w-full"></div>
                            ))}
                        </div>

                        {weekDays.map((day, dayIndex) => {
                            const dayEvents = events.filter(e => isSameDay(e.start, day));

                            return (
                                <div key={dayIndex} className="relative border-r border-slate-100 last:border-0 h-[1152px]"> {/* 24 * 48px */}
                                    {/* Click handlers for empty slots could go here by mapping hours again */}
                                    {dayEvents.map(event => {
                                        // Calculate position
                                        const startHour = getHours(event.start);
                                        const startMin = event.start.getMinutes();
                                        const durationMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);

                                        const top = (startHour * 48) + (startMin / 60 * 48); // 48px per hour
                                        const height = (durationMinutes / 60) * 48;

                                        return (
                                            <div
                                                key={event.id}
                                                onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                                className={cn(
                                                    "absolute left-0.5 right-0.5 rounded border text-[10px] p-1 overflow-hidden cursor-pointer hover:z-20",
                                                    event.color ? event.color : "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100"
                                                )}
                                                style={{ top: `${top}px`, height: `${Math.max(height, 20)}px` }}
                                            >
                                                <div className="font-semibold truncate">{event.title}</div>
                                                <div className="truncate opacity-80">{format(event.start, 'h:mm a')}</div>
                                            </div>
                                        );
                                    })}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    const renderDayView = () => {
        const hours = Array.from({ length: 24 }, (_, i) => i);
        const dayEvents = events.filter(e => isSameDay(e.start, date));

        return (
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col h-[600px] overflow-y-auto">
                <div className="grid grid-cols-[60px_1fr] sticky top-0 z-10 bg-white border-b border-slate-200 p-4">
                    <div className="col-start-2 text-xl font-bold text-slate-900">
                        {format(date, 'EEEE, MMMM d, yyyy')}
                    </div>
                </div>

                <div className="grid grid-cols-[60px_1fr] flex-1">
                    <div className="border-r border-slate-200 bg-slate-50">
                        {hours.map(hour => (
                            <div key={hour} className="h-20 text-xs text-slate-400 text-right pr-2 pt-1 border-b border-slate-100">
                                {format(setHours(new Date(), hour), 'h a')}
                            </div>
                        ))}
                    </div>

                    <div className="relative h-[1920px]"> {/* 24 * 80px for standard 80px height per hour */}
                        <div className="absolute inset-0 z-0 pointer-events-none">
                            {hours.map(hour => (
                                <div key={hour} className="h-20 border-b border-slate-100 w-full"></div>
                            ))}
                        </div>

                        {dayEvents.map(event => {
                            const startHour = getHours(event.start);
                            const startMin = event.start.getMinutes();
                            const durationMinutes = (event.end.getTime() - event.start.getTime()) / (1000 * 60);

                            const top = (startHour * 80) + (startMin / 60 * 80);
                            const height = (durationMinutes / 60) * 80;

                            return (
                                <div
                                    key={event.id}
                                    onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                    className={cn(
                                        "absolute left-2 right-2 rounded border p-2 overflow-hidden cursor-pointer hover:shadow-md transition-shadow",
                                        event.color ? event.color : "bg-indigo-50 text-indigo-700 border-indigo-200"
                                    )}
                                    style={{ top: `${top}px`, height: `${Math.max(height, 40)}px` }}
                                >
                                    <div className="font-bold">{event.title}</div>
                                    <div className="text-xs opacity-80 flex items-center gap-1">
                                        <Clock className="h-3 w-3" />
                                        {format(event.start, 'h:mm a')} - {format(event.end, 'h:mm a')}
                                    </div>
                                    {event.data?.description && (
                                        <div className="text-xs mt-1 opacity-70 line-clamp-2">{event.data.description}</div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-4">
            {/* Toolbar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                <div className="flex items-center gap-2">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={prev}>
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="h-8 px-2 font-medium" onClick={today}>
                            Today
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={next}>
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <h2 className="text-xl font-bold text-slate-900 ml-2">
                        {view === 'month' && format(date, 'MMMM yyyy')}
                        {view === 'week' && `Week of ${format(startOfWeek(date), 'MMM d, yyyy')}`}
                        {view === 'day' && format(date, 'MMMM d, yyyy')}
                    </h2>
                </div>

                <div className="flex bg-slate-100 rounded-lg p-1">
                    <Button
                        variant={view === 'month' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn("h-8 text-xs", view === 'month' && "bg-white shadow-sm text-slate-900")}
                        onClick={() => onViewChange('month')}
                    >
                        Month
                    </Button>
                    <Button
                        variant={view === 'week' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn("h-8 text-xs", view === 'week' && "bg-white shadow-sm text-slate-900")}
                        onClick={() => onViewChange('week')}
                    >
                        Week
                    </Button>
                    <Button
                        variant={view === 'day' ? 'secondary' : 'ghost'}
                        size="sm"
                        className={cn("h-8 text-xs", view === 'day' && "bg-white shadow-sm text-slate-900")}
                        onClick={() => onViewChange('day')}
                    >
                        Day
                    </Button>
                </div>
            </div>

            {/* Views */}
            {view === 'month' && renderMonthView()}
            {view === 'week' && renderWeekView()}
            {view === 'day' && renderDayView()}
        </div>
    );
}
