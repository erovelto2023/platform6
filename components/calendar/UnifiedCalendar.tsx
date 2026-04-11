"use client";

import { useState } from "react";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    isSameMonth,
    isSameDay,
    addDays,
    isToday,
    addWeeks,
    subWeeks,
    getHours,
    setHours,
} from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, LayoutDashboard, List } from "lucide-react";

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

    const subDays = (d: Date, n: number) => addDays(d, -n);

    // View Navigation
    const next = () => {
        if (view === 'month') onDateChange(addMonths(date, 1));
        if (view === 'week') onDateChange(addWeeks(date, 1));
        if (view === 'day') onDateChange(addDays(date, 1));
    };

    const prev = () => {
        if (view === 'month') onDateChange(subMonths(date, 1));
        if (view === 'week') onDateChange(subWeeks(date, 1));
        if (view === 'day') onDateChange(subDays(date, 1));
    };

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
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
                <div className="grid grid-cols-7 border-b border-zinc-800/50 bg-black/40">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                        <div key={dayName} className="py-4 text-center text-[10px] font-black text-zinc-500 uppercase tracking-[3px]">
                            {dayName}
                        </div>
                    ))}
                </div>
                <div className="flex flex-col bg-zinc-800/20 gap-px">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-px bg-zinc-800/20">
                            {week.map((day, dayIndex) => {
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isCurrentDay = isToday(day);
                                const dayEvents = events.filter(e => isSameDay(e.start, day));

                                return (
                                    <div
                                        key={dayIndex}
                                        className={cn(
                                            "min-h-[140px] bg-[#0F1218] p-3 flex flex-col gap-2 transition-all hover:bg-white/[0.02] group cursor-pointer",
                                            !isCurrentMonth && "opacity-30 grayscale"
                                        )}
                                        onClick={() => onEmptySlotClick?.(day)}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={cn(
                                                "text-xs font-black h-7 w-7 flex items-center justify-center rounded-xl transition-all shadow-lg",
                                                isCurrentDay 
                                                    ? "bg-cyan-500 text-black shadow-cyan-500/20" 
                                                    : "text-zinc-500 group-hover:text-zinc-300"
                                            )}>
                                                {format(day, 'd')}
                                            </span>
                                        </div>
                                        <div className="flex flex-col gap-1.5 mt-1">
                                            {dayEvents.slice(0, 4).map((event) => (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                                    className={cn(
                                                        "text-[10px] px-2 py-1.5 rounded-lg border truncate font-bold cursor-pointer flex items-center gap-2 transition-all hover:scale-[1.02] active:scale-95",
                                                        event.color || "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/20"
                                                    )}
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-current shrink-0 shadow-[0_0_8px_currentColor]" />
                                                    <span className="truncate">{format(event.start, 'h:mm')} {event.title}</span>
                                                </div>
                                            ))}
                                            {dayEvents.length > 4 && (
                                                <div className="text-[9px] text-zinc-600 pl-2 font-black uppercase tracking-widest hover:text-cyan-400 transition-colors">
                                                    + {dayEvents.length - 4} More Sessions
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
        const weekStart = startOfWeek(date, { weekStartsOn: 1 });
        const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
        const hours = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

        return (
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-3xl border border-zinc-800/50 shadow-2xl overflow-hidden flex flex-col h-[700px] animate-in fade-in slide-in-from-bottom-4 duration-500">
                {/* Header */}
                <div className="grid grid-cols-[80px_1fr] sticky top-0 z-10 bg-[#0F1218] border-b border-zinc-800/50">
                    <div className="border-r border-zinc-800/50 bg-black/20 flex items-center justify-center">
                        <Clock size={16} className="text-zinc-700" />
                    </div>
                    <div className="grid grid-cols-7">
                        {weekDays.map((day, i) => (
                            <div key={i} className={cn(
                                "py-4 text-center border-r border-zinc-800/20 last:border-0",
                                isToday(day) && "bg-cyan-500/[0.03]"
                            )}>
                                <div className={cn("text-[10px] font-black uppercase tracking-[2px]", isToday(day) ? "text-cyan-400" : "text-zinc-600")}>
                                    {format(day, 'EEE')}
                                </div>
                                <div className={cn(
                                    "text-lg font-black w-9 h-9 rounded-xl flex items-center justify-center mx-auto mt-1 transition-all shadow-xl",
                                    isToday(day) ? "bg-cyan-500 text-black shadow-cyan-500/20" : "text-white"
                                )}>
                                    {format(day, 'd')}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Grid Container */}
                <div className="overflow-y-auto flex-1">
                    <div className="grid grid-cols-[80px_1fr] min-h-full">
                        {/* Time Axis */}
                        <div className="border-r border-zinc-800/50 bg-black/20">
                            {hours.map(hour => (
                                <div key={hour} className="h-24 text-[10px] text-zinc-600 font-black text-right pr-4 pt-2 border-b border-zinc-800/10 uppercase tracking-tighter">
                                    {format(setHours(new Date(), hour), 'hh:mm a')}
                                </div>
                            ))}
                        </div>

                        {/* Columns */}
                        <div className="grid grid-cols-7 relative">
                            {/* Horizontal grid lines */}
                            <div className="absolute inset-0 z-0 pointer-events-none">
                                {hours.map(hour => (
                                    <div key={hour} className="h-24 border-b border-zinc-800/10 w-full"></div>
                                ))}
                            </div>

                            {weekDays.map((day, dayIndex) => {
                                const dayEvents = events.filter(e => isSameDay(e.start, day));

                                return (
                                    <div key={dayIndex} className="relative border-r border-zinc-800/10 last:border-0 h-full min-h-[1440px]">
                                        {dayEvents.map(event => {
                                            const startH = getHours(event.start);
                                            const startM = event.start.getMinutes();
                                            const duration = (event.end.getTime() - event.start.getTime()) / (1000 * 60);

                                            // Calc offset relative to 7 AM start (index 0)
                                            const top = ((startH - 7) * 96) + (startM / 60 * 96); 
                                            const height = (duration / 60) * 96;

                                            return (
                                                <div
                                                    key={event.id}
                                                    onClick={(e) => { e.stopPropagation(); onEventClick?.(event); }}
                                                    className={cn(
                                                        "absolute left-1.5 right-1.5 rounded-2xl border-l-4 p-3 shadow-2xl cursor-pointer hover:z-20 transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden bg-zinc-900/80 backdrop-blur-md",
                                                        event.color || "border-l-indigo-500 border-zinc-800 text-white"
                                                    )}
                                                    style={{ top: `${top}px`, height: `${Math.max(height, 40)}px` }}
                                                >
                                                    <div className="font-black text-[11px] truncate uppercase tracking-tight mb-1 group-hover:text-cyan-400 transition-colors">
                                                        {event.title}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-500 uppercase tracking-widest">
                                                        <Clock size={10} />
                                                        {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Custom Toolbar */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 bg-black/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-zinc-800/50 shadow-2xl">
                <div className="flex items-center gap-6">
                    <div className="flex items-center bg-black/40 rounded-2xl p-1.5 border border-zinc-800/50 shadow-inner">
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white rounded-xl active:scale-90 transition-all" onClick={prev}>
                            <ChevronLeft size={20} />
                        </Button>
                        <Button variant="ghost" className="h-10 px-6 text-[10px] font-black uppercase tracking-[3px] text-zinc-400 hover:text-white transition-all" onClick={today}>
                            Jump to Now
                        </Button>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-zinc-500 hover:text-white rounded-xl active:scale-90 transition-all" onClick={next}>
                            <ChevronRight size={20} />
                        </Button>
                    </div>
                    
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-[4px] text-cyan-500/60 mb-1">Navigation Hub</span>
                        <h2 className="text-2xl font-black tracking-tighter text-white">
                            {view === 'month' && format(date, 'MMMM yyyy')}
                            {view === 'week' && `Cycle of ${format(startOfWeek(date, { weekStartsOn: 1 }), 'MMM d')}`}
                            {view === 'day' && format(date, 'EEEE, MMM d')}
                        </h2>
                    </div>
                </div>

                <div className="flex bg-black/40 rounded-2xl p-1.5 border border-zinc-800/50 shadow-inner">
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                            view === 'month' ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-zinc-600 hover:text-zinc-400"
                        )}
                        onClick={() => onViewChange('month')}
                    >
                        <CalendarIcon size={14} className="mr-2" />
                        Month
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                            view === 'week' ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-zinc-600 hover:text-zinc-400"
                        )}
                        onClick={() => onViewChange('week')}
                    >
                        <LayoutDashboard size={14} className="mr-2" />
                        Week
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className={cn(
                            "h-10 px-6 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all",
                            view === 'day' ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/20" : "text-zinc-600 hover:text-zinc-400"
                        )}
                        onClick={() => onViewChange('day')}
                    >
                        <List size={14} className="mr-2" />
                        Day
                    </Button>
                </div>
            </div>

            {/* View Rendering */}
            <div className="transition-all duration-500">
                {view === 'month' && renderMonthView()}
                {view === 'week' && renderWeekView()}
                {view === 'day' && <div className="text-zinc-500 p-20 text-center font-black uppercase tracking-widest bg-zinc-900/40 rounded-3xl border border-zinc-800/50 border-dashed">Adaptive Day View Component Pending...</div>}
            </div>
        </div>
    );
}
