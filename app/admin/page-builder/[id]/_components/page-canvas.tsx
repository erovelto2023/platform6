"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronUp, ChevronDown, Trash2, Copy, GripVertical } from "lucide-react";
import { SectionRenderer } from "./section-renderer";
import { cn } from "@/lib/utils";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface Section {
    _id?: string;
    templateId: string;
    content: any;
    style: any;
    order: number;
}

interface Template {
    id: string;
    name: string;
    category: string;
    componentType: string;
    defaultContent: any;
    defaultStyle: any;
}

interface PageCanvasProps {
    sections: Section[];
    templates: Template[];
    selectedSectionId: string | null;
    viewMode: "desktop" | "tablet" | "mobile";
    onSelectSection: (id: string | null) => void;
    onMoveSection: (id: string, direction: "up" | "down") => void;
    onDuplicateSection: (id: string) => void;
    onDeleteSection: (id: string) => void;
    onReorderSections: (sections: Section[]) => void;
}

function SortableSection({
    section,
    template,
    index,
    isSelected,
    sectionsLength,
    onSelect,
    onMoveUp,
    onMoveDown,
    onDuplicate,
    onDelete,
}: {
    section: Section;
    template: Template;
    index: number;
    isSelected: boolean;
    sectionsLength: number;
    onSelect: () => void;
    onMoveUp: () => void;
    onMoveDown: () => void;
    onDuplicate: () => void;
    onDelete: () => void;
}) {
    const sectionId = section._id || index.toString();

    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: sectionId });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    };

    return (
        <div ref={setNodeRef} style={style} className="relative group">
            <SectionRenderer
                section={section}
                template={template}
                isSelected={isSelected}
                onClick={onSelect}
            />

            {/* Drag Handle */}
            {isSelected && (
                <div
                    {...attributes}
                    {...listeners}
                    className="absolute top-4 left-4 bg-white rounded-lg shadow-lg p-2 border border-slate-200 cursor-move hover:bg-slate-50 z-10"
                    title="Drag to reorder"
                >
                    <GripVertical className="w-5 h-5 text-slate-600" />
                </div>
            )}

            {/* Action Toolbar */}
            {isSelected && (
                <div className="absolute top-4 right-4 flex gap-2 bg-white rounded-lg shadow-lg p-2 border border-slate-200 z-10">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveUp();
                        }}
                        disabled={index === 0}
                        title="Move up"
                    >
                        <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onMoveDown();
                        }}
                        disabled={index === sectionsLength - 1}
                        title="Move down"
                    >
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            onDuplicate();
                        }}
                        title="Duplicate section"
                    >
                        <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                            e.stopPropagation();
                            if (confirm("Are you sure you want to delete this section?")) {
                                onDelete();
                            }
                        }}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            )}

            {/* Template Name Badge */}
            {!isSelected && (
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="bg-white/90 backdrop-blur-sm rounded px-2 py-1 text-xs font-medium text-slate-600 border border-slate-200">
                        {template.name}
                    </div>
                </div>
            )}
        </div>
    );
}

export function PageCanvas({
    sections,
    templates,
    selectedSectionId,
    viewMode,
    onSelectSection,
    onMoveSection,
    onDuplicateSection,
    onDeleteSection,
    onReorderSections,
}: PageCanvasProps) {
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (over && active.id !== over.id) {
            const oldIndex = sections.findIndex((s) => (s._id || sections.indexOf(s).toString()) === active.id);
            const newIndex = sections.findIndex((s) => (s._id || sections.indexOf(s).toString()) === over.id);

            const reorderedSections = arrayMove(sections, oldIndex, newIndex);
            onReorderSections(reorderedSections);
        }
    };

    const canvasWidth = {
        desktop: "w-full max-w-7xl",
        tablet: "w-[768px]",
        mobile: "w-[375px]",
    };

    return (
        <ScrollArea className="h-full bg-gradient-to-b from-slate-50 to-white">
            <div className="py-8 px-4 flex justify-center">
                <div className={cn("transition-all duration-300", canvasWidth[viewMode])}>
                    {sections.length === 0 ? (
                        <div className="flex items-center justify-center min-h-[600px] text-slate-400">
                            <div className="text-center max-w-md">
                                <div className="mb-4 text-6xl">📄</div>
                                <p className="text-lg font-medium text-slate-600 mb-2">No sections yet</p>
                                <p className="text-sm">
                                    Add templates from the sidebar to start building your page
                                </p>
                            </div>
                        </div>
                    ) : (
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                        >
                            <SortableContext
                                items={sections.map((s, i) => s._id || i.toString())}
                                strategy={verticalListSortingStrategy}
                            >
                                <div className="space-y-4">
                                    {sections.map((section, index) => {
                                        const template = templates.find((t) => t.id === section.templateId);
                                        if (!template) return null;

                                        const sectionId = section._id || index.toString();
                                        const isSelected = selectedSectionId === sectionId;

                                        return (
                                            <SortableSection
                                                key={sectionId}
                                                section={section}
                                                template={template}
                                                index={index}
                                                isSelected={isSelected}
                                                sectionsLength={sections.length}
                                                onSelect={() => onSelectSection(sectionId)}
                                                onMoveUp={() => onMoveSection(sectionId, "up")}
                                                onMoveDown={() => onMoveSection(sectionId, "down")}
                                                onDuplicate={() => onDuplicateSection(sectionId)}
                                                onDelete={() => onDeleteSection(sectionId)}
                                            />
                                        );
                                    })}
                                </div>
                            </SortableContext>
                        </DndContext>
                    )}
                </div>
            </div>
        </ScrollArea>
    );
}
