
"use client";

import { useState } from "react";
import { UnifiedCalendar, CalendarViewType, CalendarEvent } from "@/components/calendar/UnifiedCalendar";
import { Button } from "@/components/ui/button";
import { Plus, Check, FileText, Video, Share2, Mail, MoreHorizontal } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from "@/components/ui/dialog";
import { ContentForm } from "@/components/content/ContentForm";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface ContentCalendarClientProps {
    items: any[];
}

export function ContentCalendarClient({ items }: ContentCalendarClientProps) {
    const [date, setDate] = useState<Date>(new Date());
    const [view, setView] = useState<CalendarViewType>('month');
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [isEditOpen, setIsEditOpen] = useState(false);
    const router = useRouter();

    const getColorForType = (type: string) => {
        switch (type) {
            case 'video': return "bg-red-50 text-red-700 border-red-100 hover:bg-red-100";
            case 'blog': return "bg-blue-50 text-blue-700 border-blue-100 hover:bg-blue-100";
            case 'social': return "bg-pink-50 text-pink-700 border-pink-100 hover:bg-pink-100";
            case 'email': return "bg-amber-50 text-amber-700 border-amber-100 hover:bg-amber-100";
            default: return "bg-slate-50 text-slate-700 border-slate-100 hover:bg-slate-100";
        }
    };

    const getIconForType = (type: string) => {
        switch (type) {
            case 'video': return Video;
            case 'blog': return FileText;
            case 'social': return Share2;
            case 'email': return Mail;
            default: return MoreHorizontal;
        }
    }

    const events: CalendarEvent[] = items.map(item => ({
        id: item._id,
        title: item.title,
        start: new Date(item.scheduledAt),
        end: new Date(new Date(item.scheduledAt).getTime() + 60 * 60 * 1000), // Default 1 hour duration for visualization
        color: getColorForType(item.type),
        data: item
    }));

    const handleEventClick = (event: CalendarEvent) => {
        setSelectedItem(event.data);
        setIsEditOpen(true);
    };

    const handleSuccess = () => {
        setIsCreateOpen(false);
        setIsEditOpen(false);
        setSelectedItem(null);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center mb-4">
                <div>
                    {/* Toolbar handled by UnifiedCalendar mostly, but we can add filters here later */}
                </div>
                <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                            <Plus className="mr-2 h-4 w-4" /> New Content
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Create Content</DialogTitle>
                            <DialogDescription>Schedule a new piece of content.</DialogDescription>
                        </DialogHeader>
                        <ContentForm onSuccess={handleSuccess} />
                    </DialogContent>
                </Dialog>
            </div>

            <UnifiedCalendar
                events={events}
                view={view}
                date={date}
                onViewChange={setView}
                onDateChange={setDate}
                onEventClick={handleEventClick}
                onEmptySlotClick={(d) => {
                    // Optional: pre-fill date in create form
                    setDate(d);
                    setIsCreateOpen(true);
                }}
            />

            {/* Edit Modal */}
            <Dialog open={isEditOpen} onOpenChange={(open) => {
                setIsEditOpen(open);
                if (!open) setSelectedItem(null);
            }}>
                <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                        <DialogTitle>Edit Content</DialogTitle>
                        <DialogDescription>Update details for {selectedItem?.title}</DialogDescription>
                    </DialogHeader>
                    {selectedItem && (
                        <ContentForm initialData={selectedItem} onSuccess={handleSuccess} />
                    )}
                </DialogContent>
            </Dialog>

            {/* Content List / Legend (Optional, below calendar) */}
            <div className="flex gap-4 mt-4 text-xs text-slate-500">
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-blue-100 border border-blue-200"></div> Blog Post</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-red-100 border border-red-200"></div> Video</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-pink-100 border border-pink-200"></div> Social</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 rounded bg-amber-100 border border-amber-200"></div> Email</div>
            </div>
        </div>
    );
}
