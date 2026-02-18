import { create } from "zustand";

interface Clip {
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
}

interface VideoEditorStore {
    project: any | null;
    clips: Clip[];
    currentTime: number;
    isPlaying: boolean;
    activeClipId: string | null;

    setProject: (project: any) => void;
    setClips: (clips: Clip[]) => void;
    addClip: (clip: Clip) => void;
    removeClip: (clipId: string) => void;
    updateClip: (clipId: string, updates: Partial<Clip>) => void;
    setCurrentTime: (time: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setActiveClipId: (clipId: string | null) => void;
}

export const useVideoEditorStore = create<VideoEditorStore>((set) => ({
    project: null,
    clips: [],
    currentTime: 0,
    isPlaying: false,
    activeClipId: null,

    setProject: (project) => set({ project, clips: project.clips || [] }),
    setClips: (clips) => set({ clips }),
    addClip: (clip) => set((state) => ({ clips: [...state.clips, clip] })),
    removeClip: (clipId) => set((state) => ({
        clips: state.clips.filter((c) => c.id !== clipId),
        activeClipId: state.activeClipId === clipId ? null : state.activeClipId
    })),
    updateClip: (clipId, updates) => set((state) => ({
        clips: state.clips.map((c) => c.id === clipId ? { ...c, ...updates } : c)
    })),
    setCurrentTime: (time) => set({ currentTime: time }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setActiveClipId: (clipId) => set({ activeClipId: clipId }),
}));
