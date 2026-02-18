import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface Clip {
    id: string;
    url: string;
    name: string;
    type: 'video' | 'audio' | 'image';
    startTime: number;
    endTime: number;
    duration: number;
    position: number;
    width?: number;
    height?: number;
    volume?: number;
}

export interface TextClip {
    id: string;
    text: string;
    position: number; // ms on timeline
    duration: number; // ms
    style: {
        fontSize: number;
        color: string;
        x: number; // 0-100 percentage
        y: number; // 0-100 percentage
    };
}

interface VideoEditorStore {
    project: any | null;
    clips: Clip[];
    textClips: TextClip[];
    currentTime: number;
    isPlaying: boolean;
    activeClipId: string | null;
    activeTextId: string | null;

    setProject: (project: any) => void;
    setClips: (clips: Clip[]) => void;
    addClip: (clip: Clip) => void;
    removeClip: (clipId: string) => void;
    updateClip: (clipId: string, updates: Partial<Clip>) => void;

    addTextClip: (text: string) => void;
    updateTextClip: (id: string, updates: Partial<TextClip>) => void;
    removeTextClip: (id: string) => void;

    setCurrentTime: (time: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setActiveClipId: (clipId: string | null) => void;
    setActiveTextId: (id: string | null) => void;

    // Actions
    splitClip: (clipId: string, timeAtTimeline: number) => void;
}

export const useVideoEditorStore = create<VideoEditorStore>()(
    persist(
        (set) => ({
            project: null,
            clips: [],
            textClips: [],
            currentTime: 0,
            isPlaying: false,
            activeClipId: null,
            activeTextId: null,

            setProject: (project) => set({
                project,
                clips: project.clips || [],
                textClips: project.textClips || []
            }),
            setClips: (clips) => set({ clips }),
            addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
            removeClip: (clipId) => set((state) => ({
                clips: state.clips.filter((c) => c.id !== clipId),
                activeClipId: state.activeClipId === clipId ? null : state.activeClipId
            })),
            updateClip: (clipId, updates) => set((state) => ({
                clips: state.clips.map((c) => c.id === clipId ? { ...c, ...updates } : c)
            })),

            addTextClip: (text) => set((state) => {
                const newText: TextClip = {
                    id: Math.random().toString(36).substr(2, 9),
                    text,
                    position: state.currentTime,
                    duration: 3000,
                    style: {
                        fontSize: 24,
                        color: "#ffffff",
                        x: 50,
                        y: 50
                    }
                };
                return { textClips: [...state.textClips, newText], activeTextId: newText.id };
            }),
            updateTextClip: (id, updates) => set((state) => ({
                textClips: state.textClips.map((t) => t.id === id ? { ...t, ...updates } : t)
            })),
            removeTextClip: (id) => set((state) => ({
                textClips: state.textClips.filter((t) => t.id !== id),
                activeTextId: state.activeTextId === id ? null : state.activeTextId
            })),

            setCurrentTime: (time) => set({ currentTime: time }),
            setIsPlaying: (isPlaying) => set({ isPlaying }),
            setActiveClipId: (clipId) => set({ activeClipId: clipId, activeTextId: null }),
            setActiveTextId: (id) => set({ activeTextId: id, activeClipId: null }),

            splitClip: (clipId, timeAtTimeline) => set((state) => {
                const clipIndex = state.clips.findIndex(c => c.id === clipId);
                if (clipIndex === -1) return state;

                const clip = state.clips[clipIndex];
                const splitPointInClip = timeAtTimeline - clip.position;

                if (splitPointInClip <= 0 || splitPointInClip >= clip.duration * 1000) return state;

                const clip1 = { ...clip, duration: splitPointInClip / 1000, endTime: (clip.startTime || 0) + splitPointInClip / 1000 };
                const clip2 = {
                    ...clip,
                    id: Math.random().toString(36).substr(2, 9),
                    position: timeAtTimeline,
                    duration: clip.duration - (splitPointInClip / 1000),
                    startTime: (clip.startTime || 0) + splitPointInClip / 1000
                };

                const newClips = [...state.clips];
                newClips.splice(clipIndex, 1, clip1, clip2);
                return { clips: newClips };
            }),
        }),
        {
            name: "video-editor-storage",
            storage: createJSONStorage(() => localStorage),
            partialize: (state) => ({
                clips: state.clips,
                textClips: state.textClips,
                currentTime: state.currentTime
            }),
        }
    )
);
