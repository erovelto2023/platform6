"use client";

import { Button } from "@/components/ui/button";
import {
    ChevronLeft,
    ChevronRight,
    Calendar as CalendarIcon,
    List,
    LayoutGrid
} from "lucide-react";
import { format } from "date-fns";

interface CalendarHeaderProps {
    currentDate: Date;
    view: "month" | "week" | "list";
    onPrev: () => void;
    onNext: () => void;
    onViewChange: (view: "month" | "week" | "list") => void;
    onToday: () => void;
}

export function CalendarHeader({
    currentDate,
    view,
    onPrev,
    onNext,
    onViewChange,
    onToday,
}: CalendarHeaderProps) {
    return (
        <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white hover:shadow-sm"
                        onClick={onPrev}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 px-3 font-medium hover:bg-white hover:shadow-sm"
                        onClick={onToday}
                    >
                        Today
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 hover:bg-white hover:shadow-sm"
                        onClick={onNext}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
                <h2 className="text-xl font-bold text-slate-900">
                    {format(currentDate, "MMMM yyyy")}
                </h2>
            </div>

            <div className="flex items-center bg-slate-100 rounded-lg p-1">
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-3 ${view === "month" ? "bg-white shadow-sm text-indigo-600" : "text-slate-600"}`}
                    onClick={() => onViewChange("month")}
                >
                    <LayoutGrid className="h-4 w-4 mr-2" />
                    Month
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-3 ${view === "week" ? "bg-white shadow-sm text-indigo-600" : "text-slate-600"}`}
                    onClick={() => onViewChange("week")}
                >
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    Week
                </Button>
                <Button
                    variant="ghost"
                    size="sm"
                    className={`h-8 px-3 ${view === "list" ? "bg-white shadow-sm text-indigo-600" : "text-slate-600"}`}
                    onClick={() => onViewChange("list")}
                >
                    <List className="h-4 w-4 mr-2" />
                    List
                </Button>
            </div>
        </div>
    );
}
