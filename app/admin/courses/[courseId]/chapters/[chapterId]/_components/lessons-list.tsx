"use client";

import { useEffect, useState } from "react";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface LessonsListProps {
    items: any[];
    onReorder: (updateData: { id: string; position: number }[]) => void;
    onEdit: (id: string) => void;
    onDelete?: (id: string) => void;
}

export const LessonsList = ({
    items,
    onReorder,
    onEdit,
    onDelete
}: LessonsListProps) => {
    const [isMounted, setIsMounted] = useState(false);
    const [lessons, setLessons] = useState(items);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        setLessons(items);
    }, [items]);

    const onDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const items = Array.from(lessons);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        const startIndex = Math.min(result.source.index, result.destination.index);
        const endIndex = Math.max(result.source.index, result.destination.index);

        const updatedLessons = items.slice(startIndex, endIndex + 1);

        setLessons(items);

        const bulkUpdateData = updatedLessons.map((lesson) => ({
            id: lesson._id,
            position: items.findIndex((item) => item._id === lesson._id)
        }));

        onReorder(bulkUpdateData);
    };

    if (!isMounted) {
        return null;
    }

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="lessons">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2 mt-2">
                        {lessons.map((lesson, index) => (
                            <Draggable
                                key={lesson._id}
                                draggableId={lesson._id}
                                index={index}
                            >
                                {(provided) => (
                                    <div
                                        className="flex items-center gap-x-3 bg-slate-950 border border-slate-800 text-slate-100 rounded-2xl text-xs font-mono font-bold hover:border-cyan-500/80 transition-all p-1.5 shadow-md"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                    >
                                        <div
                                            className="px-2.5 py-2.5 border-r border-slate-800 hover:bg-slate-900 text-slate-400 hover:text-cyan-400 rounded-l-xl transition cursor-grab"
                                            {...provided.dragHandleProps}
                                        >
                                            <Grip className="h-4 w-4" />
                                        </div>
                                        <span className="truncate py-1 text-slate-200">{lesson.title}</span>
                                        <div className="ml-auto pr-2 flex items-center gap-x-2 shrink-0">
                                            {lesson.isFreePreview && (
                                                <Badge className="bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono text-[9px] uppercase">
                                                    Free Preview
                                                </Badge>
                                            )}
                                            <button
                                                onClick={() => onEdit(lesson._id)}
                                                className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-cyan-400 transition-colors cursor-pointer"
                                                title="Edit Lesson"
                                            >
                                                <Pencil className="h-3.5 w-3.5" />
                                            </button>
                                            {onDelete && (
                                                <button
                                                    onClick={() => {
                                                        if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
                                                            onDelete(lesson._id);
                                                        }
                                                    }}
                                                    className="p-1.5 rounded-xl hover:bg-slate-900 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
                                                    title="Delete Lesson"
                                                >
                                                    <Trash2 className="h-3.5 w-3.5" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </Draggable>
                        ))}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
