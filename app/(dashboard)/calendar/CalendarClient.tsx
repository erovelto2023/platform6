
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Plus,
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    Clock,
    MoreHorizontal
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
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
    isToday
} from "date-fns";
import { cn } from "@/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface CalendarClientProps {
    bookings: any[];
}

type CalendarView = 'month' | 'week' | 'day';

export function CalendarClient({ bookings }: CalendarClientProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarView>('month');

    // Navigation handlers
    const next = () => {
        if (view === 'month') setDate(addMonths(date, 1));
        // Add week/day logic later
    };

    const prev = () => {
        if (view === 'month') setDate(subMonths(date, 1));
    };

    const today = () => setDate(new Date());

    // Generate Month Grid
    const monthStart = startOfMonth(date);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    // Create weeks array
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
        <div className="space-y-4">
            {/* Calendar Header / Toolbar */}
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
                        {format(date, 'MMMM yyyy')}
                    </h2>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto">
                    <div className="flex bg-slate-100 rounded-lg p-1">
                        <Button
                            variant={view === 'month' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={cn("h-8 text-xs", view === 'month' && "bg-white shadow-sm text-slate-900")}
                            onClick={() => setView('month')}
                        >
                            Month
                        </Button>
                        <Button
                            variant={view === 'week' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={cn("h-8 text-xs", view === 'week' && "bg-white shadow-sm text-slate-900")}
                            onClick={() => setView('week')}
                        >
                            Week
                        </Button>
                        <Button
                            variant={view === 'day' ? 'secondary' : 'ghost'}
                            size="sm"
                            className={cn("h-8 text-xs", view === 'day' && "bg-white shadow-sm text-slate-900")}
                            onClick={() => setView('day')}
                        >
                            Day
                        </Button>
                    </div>
                    {/* Placeholder for New Event Modal */}
                    <Link href="/calendar/services">
                        <Button className="ml-auto bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> New Event
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Main Calendar Grid (Month View) */}
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
                {/* Day Headers */}
                <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((dayName) => (
                        <div key={dayName} className="py-2 text-center text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            {dayName}
                        </div>
                    ))}
                </div>

                {/* Calendar Rows */}
                <div className="flex flex-col bg-slate-200 gap-px border-b border-slate-200">
                    {weeks.map((week, weekIndex) => (
                        <div key={weekIndex} className="grid grid-cols-7 gap-px bg-slate-200">
                            {week.map((day, dayIndex) => {
                                const isCurrentMonth = isSameMonth(day, monthStart);
                                const isCurrentDay = isToday(day);
                                const dayBookings = bookings.filter(b => isSameDay(new Date(b.startTime), day));

                                return (
                                    <div
                                        key={dayIndex}
                                        className={cn(
                                            "min-h-[120px] bg-white p-2 flex flex-col gap-1 transition-colors hover:bg-slate-50",
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

                                        {/* Events List */}
                                        <div className="flex flex-col gap-1 mt-1">
                                            {dayBookings.slice(0, 3).map((booking) => (
                                                <div
                                                    key={booking._id}
                                                    className="text-[10px] p-1 rounded bg-indigo-50 text-indigo-700 border border-indigo-100 truncate font-medium cursor-pointer hover:bg-indigo-100 flex items-center gap-1"
                                                >
                                                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0" />
                                                    <span className="truncate">{format(new Date(booking.startTime), 'h:mm a')} {booking.customerName}</span>
                                                </div>
                                            ))}
                                            {dayBookings.length > 3 && (
                                                <div className="text-[10px] text-slate-500 pl-1 font-medium hover:text-indigo-600 cursor-pointer">
                                                    + {dayBookings.length - 3} more
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
        </div>
    );
}
