'use client';

import { Search, Maximize2, MoreVertical, Clock } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { PostData } from "./Types";

function DraggableDraft({ draft }: { draft: PostData }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: draft.id,
    data: draft
  });

  return (
    <div 
      ref={setNodeRef} 
      {...listeners} 
      {...attributes}
      className={`border rounded-xl p-3 bg-white group cursor-grab active:cursor-grabbing transform transition-all 
        ${isDragging ? 'opacity-50 border-primary border-dashed shadow-sm' : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}
    >
      <div className="flex items-center justify-between mb-3 text-slate-400">
        <div className="flex gap-1.5 text-slate-300 px-1">
           <div className="w-1 h-1 bg-current rounded-full"></div>
           <div className="w-1 h-1 bg-current rounded-full"></div>
           <div className="w-1 h-1 bg-current rounded-full"></div>
           <div className="w-1 h-1 bg-current rounded-full"></div>
        </div>
        <span className="text-xs">{draft.timeAgo}</span>
        <button className="hover:text-slate-600 p-1"><MoreVertical className="h-4 w-4" /></button>
      </div>
      <div className="flex gap-3">
        <img src={draft.image} alt={draft.title} className="w-16 h-16 rounded-lg object-cover bg-slate-100 shrink-0 pointer-events-none select-none" />
        <div className="flex-1 min-w-0">
          <div className="flex gap-1 mb-1.5 flex-wrap">
            {draft.platforms.map((p: string) => (
              <div key={p} className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500 uppercase pointer-events-none select-none">{p[0]}</div>
            ))}
            <div className="flex ml-auto items-center text-slate-400">
              <Clock className="w-3 h-3" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-slate-900 leading-tight line-clamp-2 pointer-events-none select-none">{draft.title}</h3>
        </div>
      </div>
    </div>
  );
}

export function RightSidebar({ drafts, onOpenComposer }: { drafts: PostData[], onOpenComposer: () => void }) {
  return (
    <aside className="w-80 h-full bg-white border-l border-slate-100 flex flex-col hidden lg:flex shrink-0 h-screen sticky top-0 overflow-hidden z-20">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white text-slate-900">
        <h2 className="font-semibold">Drafts & Ideas</h2>
        <div className="flex items-center gap-2 text-slate-400">
          <button className="hover:text-slate-600 transition-colors"><Search className="h-4 w-4" /></button>
          <button className="hover:text-slate-600 transition-colors"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>
      
      <div className="px-4 py-4 shrink-0 flex gap-2">
        <button 
          onClick={onOpenComposer}
          className="flex-1 bg-slate-50 text-slate-600 hover:bg-slate-100 transition-colors text-sm font-medium py-2 rounded-full border border-slate-200"
        >
          Post
        </button>
        <button className="flex-1 bg-primary text-white text-sm font-medium py-2 rounded-full shadow-[0_2px_8px_rgba(96,108,56,0.3)] hover:bg-primary/90 transition-colors">Draft ({drafts.length})</button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 pb-8">
        {drafts.map((draft) => (
          <DraggableDraft key={draft.id} draft={draft} />
        ))}
        {drafts.length === 0 && (
          <div className="text-center text-slate-400 text-sm mt-10 p-6 border-2 border-dashed border-slate-100 rounded-xl">
            No drafts remaining.<br/>Awesome job!
          </div>
        )}
      </div>
    </aside>
  );
}
