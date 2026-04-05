'use client';

import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { MonthGrid } from "./MonthGrid";
import { RightSidebar } from "./RightSidebar";
import { PostData } from "./Types";
import { ComposerModal } from "./ComposerModal";
import { updatePostSchedule } from "@/lib/actions/content-planner/post.actions";
import { Settings, Bell, Search } from "lucide-react";
import { startTransition, useState, useEffect } from "react";
import { UserButton, useUser } from "@clerk/nextjs";

export function ContentPlannerClient({ initialPosts, business }: { initialPosts: any[], business?: any }) {
  const { user, isLoaded } = useUser();
  
  const mapPosts = (posts: any[]): PostData[] => posts.map(p => ({
     ...p,
     id: p.id || p._id?.toString(),
     scheduledAt: p.scheduledFor ? new Date(p.scheduledFor) : null,
     platforms: p.platforms?.length ? p.platforms.map((plat: any) => plat.name || plat) : ["Social"],
     image: p.media?.[0]?.url || "https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=200&auto=format&fit=crop",
     contentType: p.contentType || "social",
     workflowStage: p.status || "idea",
     priority: p.priority || "medium",
     calendarColor: p.calendarColor || "#606c38",
     timeAgo: "Just now",
     time: p.scheduledFor ? new Date(p.scheduledFor).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "12:00 PM",
     status: p.status === 'scheduled' ? 'Scheduled' : 'Draft'
  }));

  const [posts, setPosts] = useState<PostData[]>(mapPosts(initialPosts));
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerDate, setComposerDate] = useState<Date | null>(null);
  const [editingPost, setEditingPost] = useState<any | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    setPosts(mapPosts(initialPosts));
  }, [initialPosts]);

  const openComposer = (date?: Date) => {
    setEditingPost(null);
    setComposerDate(date || null);
    setIsComposerOpen(true);
  };

  const handleEditPost = (post: PostData) => {
    setEditingPost(post);
    setComposerDate(null);
    setIsComposerOpen(true);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const handleDragStart = (event: DragStartEvent) => setActiveId(event.active.id as string);

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over) return;
    
    const targetDateStr = over.id as string;
    const targetDate = new Date(targetDateStr);
    
    // Optimistic cache update
    setPosts(prev => prev.map(post => {
      if (post.id === active.id) {
        return { ...post, status: 'Scheduled', scheduledAt: targetDate };
      }
      return post;
    }));

    // Server-side database update
    startTransition(() => {
        updatePostSchedule(active.id as string, targetDate.toISOString());
    });
  };

  const drafts = posts.filter(p => p.status === 'Draft' || p.status === 'idea' || p.status === 'draft');
  const scheduled = posts.filter(p => p.status === 'Scheduled' || p.status === 'scheduled');
  const activePost = activeId ? posts.find(p => p.id === activeId) : null;

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex-1 flex w-full h-full overflow-hidden bg-slate-50/30">
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto overflow-x-hidden">
          <header className="px-8 py-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 mb-1 font-headline">Content Planner</h1>
              <p className="text-sm text-slate-500 font-medium">Coordinate your ecosystem across all business channels.</p>
            </div>
            <div className="hidden md:flex items-center gap-4">
              <button className="w-10 h-10 rounded-full border border-slate-200 bg-white flex items-center justify-center text-slate-500 hover:bg-slate-50 transition-colors shadow-sm relative">
                 <Bell className="w-5 h-5" />
                 <span className="absolute top-2 right-2.5 w-2 h-2 rounded-full bg-red-500 border border-white"></span>
              </button>
              <div className="flex items-center gap-3 pl-2 border-l border-slate-100">
                <UserButton appearance={{ elements: { userButtonAvatarBox: "w-10 h-10 border-2 border-white shadow-sm" } }} />
                {isLoaded && user && (
                  <div className="hidden sm:block text-sm">
                      <div className="font-semibold text-slate-900 line-clamp-1">{user.username || user.firstName || 'Admin'}</div>
                      <div className="text-xs text-slate-500 line-clamp-1">{business?.name || 'My Business'}</div>
                  </div>
                )}
              </div>
            </div>
          </header>
          <main className="flex-1 px-8 pb-8 flex flex-col min-h-0">
            <MonthGrid scheduledPosts={scheduled} onOpenComposer={openComposer} onEditPost={handleEditPost} />
          </main>
        </div>
        <RightSidebar drafts={drafts} onOpenComposer={() => openComposer()} />
      </div>
      
      <ComposerModal 
        isOpen={isComposerOpen} 
        onClose={() => setIsComposerOpen(false)} 
        initialDate={composerDate} 
        initialPost={editingPost}
        business={business}
      />
      
      <DragOverlay dropAnimation={{ duration: 200, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activePost ? (
          <div className="bg-white border border-primary/40 shadow-xl rounded-xl p-3 opacity-95 scale-105 rotate-3 max-w-[280px]">
            <div className="flex items-center gap-3">
              <img src={activePost.image} className="w-12 h-12 rounded-lg object-cover bg-slate-100 shrink-0 shadow-sm" />
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold text-slate-900 line-clamp-2">{activePost.title}</h3>
                <div className="text-[10px] text-slate-400 mt-1 uppercase font-bold tracking-wider">{activePost.platforms.join(', ')}</div>
              </div>
            </div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
