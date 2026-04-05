'use client';

import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { format, startOfMonth, startOfWeek, endOfMonth, endOfWeek, eachDayOfInterval, isSameMonth, isToday, startOfDay, addMonths, subMonths, addWeeks, subWeeks, isSameDay } from "date-fns";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { PostData } from "./Types";
import { useDroppable } from "@dnd-kit/core";

function DroppableDateCell({ 
  day, 
  currentDate, 
  posts, 
  onOpenComposer,
  onEditPost,
  isWeekView = false
}: { 
  day: Date, 
  currentDate: Date, 
  posts: PostData[],
  onOpenComposer?: (date: Date) => void,
  onEditPost?: (post: PostData) => void,
  isWeekView?: boolean
}) {
  const isCurrentMonth = isSameMonth(day, currentDate);
  const dayStr = startOfDay(day).toISOString();
  
  const { setNodeRef, isOver } = useDroppable({
    id: dayStr,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "p-2 border-b border-r border-slate-100 transition-colors relative group overflow-y-auto custom-scrollbar",
        isWeekView ? "min-h-[400px] bg-white" : "min-h-[120px]",
        !isCurrentMonth && !isWeekView ? "bg-slate-50/40" : "bg-white",
        isOver && "bg-primary/5 outline outline-2 outline-primary outline-offset-[-2px] z-20"
      )}
    >
      <div className="flex justify-between items-start mb-2 sticky top-0 bg-inherit z-10 py-1">
        <div className="flex flex-col items-center">
          {isWeekView && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-0.5">{format(day, 'EEE')}</span>}
          <span className={cn(
            "w-7 h-7 flex items-center justify-center rounded-full text-sm font-medium",
            isToday(day) ? "text-white bg-primary font-bold shadow-sm" : isCurrentMonth || isWeekView ? "text-slate-900" : "text-slate-400"
          )}>
            {format(day, 'dd')}
          </span>
        </div>
        <button 
          onClick={() => onOpenComposer?.(day)}
          className="opacity-0 group-hover:opacity-100 w-6 h-6 flex items-center justify-center rounded text-slate-400 hover:bg-slate-100 hover:text-slate-900 transition-all font-bold"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2 z-10 relative pb-2">
        {posts.map(post => (
          <div 
            key={post.id} 
            onClick={() => onEditPost?.(post)}
            className="px-2.5 py-2 bg-white border border-slate-100 shadow-sm rounded-lg text-[10px] sm:text-xs font-semibold text-slate-700 flex flex-col gap-1 cursor-pointer hover:border-primary/30 hover:shadow-md transition-all group/post border-l-4"
            style={{ borderLeftColor: post.calendarColor || '#606c38' }}
          >
            <div className="flex items-center justify-between gap-1.5">
               <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] text-slate-400 font-bold">{post.time || "12:00 PM"}</span>
                  <span className="truncate group-hover/post:text-primary transition-colors">{post.title}</span>
               </div>
               <div className="flex items-center gap-1 shrink-0">
                  {post.platforms.map(p => (
                    <div key={p} className="w-1.5 h-1.5 rounded-full bg-slate-200" title={p}></div>
                  ))}
               </div>
            </div>
            {isWeekView && post.description && (
              <p className="text-[9px] text-slate-400 line-clamp-2 leading-relaxed font-medium pl-0.5">{post.description}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export function MonthGrid({ scheduledPosts, onOpenComposer, onEditPost }: { scheduledPosts: PostData[], onOpenComposer?: (date?: Date) => void, onEditPost?: (post: PostData) => void }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState<'Month' | 'Week'>('Month');

  const goToPrev = () => {
    if (view === 'Month') setCurrentDate(subMonths(currentDate, 1));
    else setCurrentDate(subWeeks(currentDate, 1));
  };

  const goToNext = () => {
    if (view === 'Month') setCurrentDate(addMonths(currentDate, 1));
    else setCurrentDate(addWeeks(currentDate, 1));
  };

  const start = view === 'Month' 
    ? startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 })
    : startOfWeek(currentDate, { weekStartsOn: 1 });
    
  const end = view === 'Month'
    ? endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 })
    : endOfWeek(currentDate, { weekStartsOn: 1 });

  const days = eachDayOfInterval({ start, end });
  const weekDays = ['Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat', 'Sun'];

  return (
    <div className="flex-1 flex flex-col bg-white rounded-2xl border border-slate-100 shadow-xl shadow-black/[0.02] overflow-hidden transition-all duration-500">
      <div className="flex items-center justify-between px-8 py-5 border-b border-slate-50 flex-wrap gap-4 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPrev}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button 
              onClick={goToNext}
              className="w-9 h-9 flex items-center justify-center rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 hover:text-slate-900 transition-all hover:scale-105 active:scale-95"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-slate-900 tracking-tight leading-none">
              {format(currentDate, view === 'Month' ? 'MMMM yyyy' : 'MMM dd, yyyy')}
            </h2>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
              {view} view Active
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-slate-100 p-1 rounded-xl">
             <button 
               onClick={() => setView('Month')}
               className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'Month' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Month
             </button>
             <button 
               onClick={() => setView('Week')}
               className={`px-4 py-1.5 text-xs font-bold rounded-lg transition-all ${view === 'Week' ? 'bg-white text-primary shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
             >
               Week
             </button>
          </div>
          
          <button 
            onClick={() => onOpenComposer?.()} 
            className="h-10 px-5 bg-primary text-white hover:bg-primary/90 rounded-xl flex items-center gap-2 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5 active:translate-y-0 text-xs font-bold"
          >
            <Plus className="w-4 h-4" />
            New Post
          </button>
        </div>
      </div>

      {view === 'Month' && (
        <div className="grid grid-cols-7 border-b border-slate-50 bg-slate-50/30">
          {weekDays.map(day => (
            <div key={day} className="py-3 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
      )}

      <div className={cn(
        "flex-1 grid auto-rows-fr transition-all duration-300",
        view === 'Month' ? "grid-cols-7" : "grid-cols-7 h-full"
      )}>
        {days.map((day) => {
          const dayPosts = scheduledPosts.filter(p => {
             if (!p.scheduledAt) return false;
             return isSameDay(new Date(p.scheduledAt), day);
          });
          return (
            <DroppableDateCell 
              key={day.toISOString()} 
              day={day} 
              currentDate={currentDate} 
              posts={dayPosts} 
              onOpenComposer={onOpenComposer}
              onEditPost={onEditPost}
              isWeekView={view === 'Week'}
            />
          );
        })}
      </div>
    </div>
  );
}
