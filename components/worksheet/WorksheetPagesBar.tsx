"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Copy, Trash2, GripVertical, FileText } from "lucide-react";
import { useWorksheetStore, WorksheetPage } from "@/lib/worksheet-store";
import {
    DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent
} from "@dnd-kit/core";
import {
    SortableContext, horizontalListSortingStrategy, useSortable
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface PageItemProps {
    page: WorksheetPage;
    index: number;
    isActive: boolean;
    onSelect: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}

const SortablePageItem: React.FC<PageItemProps> = ({
    page,
    index,
    isActive,
    onSelect,
    onDuplicate,
    onDelete,
}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: page.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            className={`flex items-center gap-2 p-1.5 rounded-xl border transition-all cursor-pointer group shrink-0 ${
                isActive
                    ? "bg-indigo-50/90 dark:bg-indigo-950/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/30"
                    : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300"
            }`}
            onClick={onSelect}
        >
            <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 pl-0.5">
                <GripVertical className="w-3.5 h-3.5" />
            </div>

            {/* Thumbnail Box */}
            <div className="w-10 h-14 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 flex items-center justify-center relative shadow-inner">
                {page.thumbnail ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={page.thumbnail} alt={page.name} className="w-full h-full object-cover" />
                ) : (
                    <FileText className="w-4 h-4 text-slate-400" />
                )}
            </div>

            <div className="flex flex-col pr-1">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                    {page.name || `Page ${index + 1}`}
                </span>
                <span className="text-[10px] font-semibold text-slate-400">Page {index + 1}</span>
            </div>

            <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 ml-1 transition-opacity">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md hover:bg-slate-200 dark:hover:bg-slate-800"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDuplicate();
                    }}
                    title="Duplicate Page"
                >
                    <Copy className="w-3 h-3 text-slate-500" />
                </Button>
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-md text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                    }}
                    title="Delete Page"
                >
                    <Trash2 className="w-3 h-3" />
                </Button>
            </div>
        </div>
    );
};

export const WorksheetPagesBar: React.FC = () => {
    const { pages, currentPageIndex, setCurrentPageIndex, addPage, duplicatePage, deletePage, reorderPages } = useWorksheetStore();

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor)
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (over && active.id !== over.id) {
            const oldIndex = pages.findIndex((p) => p.id === active.id);
            const newIndex = pages.findIndex((p) => p.id === over.id);
            reorderPages(oldIndex, newIndex);
        }
    };

    return (
        <footer className="h-16 border-t border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-4 flex items-center gap-3 overflow-x-auto z-20">
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={pages.map((p) => p.id)} strategy={horizontalListSortingStrategy}>
                    <div className="flex items-center gap-2">
                        {pages.map((page, index) => (
                            <SortablePageItem
                                key={page.id}
                                page={page}
                                index={index}
                                isActive={index === currentPageIndex}
                                onSelect={() => setCurrentPageIndex(index)}
                                onDuplicate={() => duplicatePage(index)}
                                onDelete={() => deletePage(index)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            <Button
                variant="outline"
                size="sm"
                className="h-14 w-20 rounded-xl border-dashed border-2 border-slate-300 dark:border-slate-700 flex flex-col gap-1 items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-400 shrink-0 transition-all"
                onClick={() => addPage()}
            >
                <Plus className="w-3.5 h-3.5 text-indigo-500" />
                <span className="text-[10px] font-bold">New Page</span>
            </Button>
        </footer>
    );
};
