
'use client';

import React, { useState, useMemo } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  closestCorners, 
  KeyboardSensor, 
  PointerSensor, 
  useSensor, 
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import { 
  arrayMove, 
  SortableContext, 
  sortableKeyboardCoordinates, 
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Plus, 
  MoreHorizontal, 
  Clock, 
  MessageSquare, 
  Paperclip, 
  Calendar as CalendarIcon,
  Filter,
  Search,
  LayoutGrid,
  Trello
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

// --- Types ---
interface KanbanBoardProps {
  posts: any[];
  campaigns?: any[];
  offers?: any[];
}

const COLUMNS = [
  { id: 'idea', title: 'Ideas', color: 'bg-slate-100 text-slate-600' },
  { id: 'draft', title: 'Drafting', color: 'bg-blue-100/50 text-blue-700' },
  { id: 'review', title: 'Review', color: 'bg-amber-100/50 text-amber-700' },
  { id: 'scheduled', title: 'Scheduled', color: 'bg-emerald-100/50 text-emerald-700' },
  { id: 'published', title: 'Done', color: 'bg-indigo-100/50 text-indigo-700' },
];

export function KanbanBoard({ posts: initialPosts, campaigns, offers }: KanbanBoardProps) {
  const [posts, setPosts] = useState(initialPosts);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const columns = useMemo(() => {
    return COLUMNS.map(col => ({
      ...col,
      posts: posts.filter(p => p.status === col.id)
    }));
  }, [posts]);

  const activePost = useMemo(() => 
    activeId ? posts.find(p => (p._id || p.id) === activeId) : null
  , [activeId, posts]);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    const isActiveACard = active.data.current?.type === "Post";
    const isOverACard = over.data.current?.type === "Post";

    if (!isActiveACard) return;

    // Implemented logic for dropping over another card in the same/different column
    if (isActiveACard && isOverACard) {
      setPosts((items) => {
        const activeIndex = items.findIndex((i) => (i._id || i.id) === activeId);
        const overIndex = items.findIndex((i) => (i._id || i.id) === overId);

        if (items[activeIndex].status !== items[overIndex].status) {
          items[activeIndex].status = items[overIndex].status;
          return arrayMove(items, activeIndex, overIndex);
        }

        return arrayMove(items, activeIndex, overIndex);
      });
    }

    // Implemented logic for dropping over a column
    const isOverAColumn = over.data.current?.type === "Column";
    if (isActiveACard && isOverAColumn) {
      setPosts((items) => {
        const activeIndex = items.findIndex((i) => (i._id || i.id) === activeId);
        items[activeIndex].status = overId as any;
        return arrayMove(items, activeIndex, activeIndex);
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    
    // Here logic to persist to server would go
    // For now it's local only to satisfy "clean code" and build fixes
  };

  return (
    <div className="flex flex-col h-full bg-slate-50/50 rounded-xl border border-slate-200/60 overflow-hidden">
      {/* Kanban Header */}
      <div className="px-6 py-4 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                <Trello className="w-5 h-5" />
            </div>
            <div>
                <h2 className="text-sm font-bold text-slate-900 tracking-tight">Strategy Board</h2>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Workflow Management</p>
            </div>
        </div>
        <div className="flex items-center gap-2">
            <div className="relative hidden md:block">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                <input 
                    type="text" 
                    placeholder="Search cards..." 
                    className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 w-48"
                />
            </div>
            <Button variant="outline" size="sm" className="h-8 gap-2 border-slate-200 text-xs font-bold">
                <Filter className="w-3.5 h-3.5" />
                Filter
            </Button>
            <Button size="sm" className="h-8 gap-2 bg-indigo-600 hover:bg-indigo-700 text-xs font-bold px-4">
                <Plus className="w-3.5 h-3.5" />
                New Task
            </Button>
        </div>
      </div>

      <DndContext 
        sensors={sensors} 
        collisionDetection={closestCorners} 
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 p-6 overflow-x-auto scrollbar-hide">
            <div className="flex gap-6 h-full">
                {columns.map(col => (
                    <Column key={col.id} column={col} />
                ))}
            </div>
        </div>

        <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({
                styles: {
                    active: {
                        opacity: '0.5',
                    },
                },
            }),
        }}>
          {activePost ? <PostCard post={activePost} isOverlay /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}

// --- Subcomponents ---

function Column({ column }: { column: any }) {
  const { setNodeRef } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div 
        ref={setNodeRef}
        className="flex flex-col w-72 shrink-0 h-full"
    >
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2">
            <Badge variant="secondary" className={cn("rounded-md px-1.5 py-0.5 text-[10px] font-black uppercase tracking-widest border-none shadow-sm", column.color)}>
                {column.title}
            </Badge>
            <span className="text-xs font-bold text-slate-400">{column.posts.length}</span>
        </div>
        <button className="text-slate-400 hover:text-slate-600 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 flex flex-col gap-3 min-h-[100px]">
        <SortableContext items={column.posts.map((p: any) => p._id || p.id)} strategy={verticalListSortingStrategy}>
          {column.posts.map((post: any) => (
            <PostCard key={post._id || post.id} post={post} />
          ))}
        </SortableContext>
        
        <button className="mt-1 flex items-center justify-center gap-2 py-2 border border-dashed border-slate-200 rounded-lg text-slate-400 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/30 transition-all text-xs font-medium group">
            <Plus className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100" />
            Add Card
        </button>
      </div>
    </div>
  );
}

function PostCard({ post, isOverlay }: { post: any, isOverlay?: boolean }) {
  const id = post._id || post.id;
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: id,
    data: {
      type: "Post",
      post,
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  if (isDragging && !isOverlay) {
    return (
      <div 
        ref={setNodeRef}
        style={style}
        className="h-[120px] rounded-xl border-2 border-dashed border-indigo-200 bg-slate-50/50 w-full"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "group bg-white border border-slate-200 rounded-xl p-3 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all cursor-grab active:cursor-grabbing select-none",
        isOverlay && "shadow-2xl border-indigo-400 ring-2 ring-indigo-100 scale-[1.02] rotate-1"
      )}
    >
        <div className="flex flex-col gap-3">
            {/* Platform Badges */}
            <div className="flex flex-wrap gap-1">
                {(post.platforms || []).slice(0, 2).map((p: any) => (
                    <span key={p.name || p} className="px-1.5 py-0.5 rounded bg-slate-50 border border-slate-100 text-[9px] font-black uppercase text-slate-500 tracking-wider">
                        {p.name || p}
                    </span>
                ))}
                {(post.platforms || []).length > 2 && (
                    <span className="text-[9px] font-bold text-slate-400">+{post.platforms.length - 2}</span>
                )}
            </div>

            <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-relaxed">
                {post.title}
            </h4>

            {post.media?.length > 0 && (
                <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 border border-slate-100 relative group-hover:border-indigo-100 transition-colors">
                    <img src={post.media[0].url} className="w-full h-full object-cover" alt="" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
                </div>
            )}

            <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                        <Clock className="w-3 h-3" />
                        {post.scheduledFor ? new Date(post.scheduledFor).toLocaleDateString([], { month: 'short', day: 'numeric' }) : 'Draft'}
                    </div>
                </div>
                <div className="flex items-center -space-x-1">
                    <div className="w-5 h-5 rounded-full border-2 border-white bg-indigo-500 flex items-center justify-center text-[8px] font-bold text-white uppercase">
                        {post.userId?.slice(0, 2) || 'AD'}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
