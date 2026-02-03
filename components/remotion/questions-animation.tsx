"use client";

import React from 'react';
import { AbsoluteFill, useCurrentFrame, interpolate, spring, useVideoConfig } from 'remotion';
import { HelpCircle, Search, Lightbulb, MessageCircle } from 'lucide-react';

const FloatingQuestionMark = ({ size, x, y, delay, color }: { size: number, x: number, y: number, delay: number, color: string }) => {
    const frame = useCurrentFrame();

    // Float animation
    const float = Math.sin((frame + delay * 10) / 40) * 15;
    const rotate = Math.sin((frame + delay * 5) / 50) * 10;

    const opacity = interpolate(frame, [delay, delay + 20], [0, 0.4]);

    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <div
            style={{
                position: 'absolute',
                left: `${x}%`,
                top: `${y}%`,
                opacity: Number(opacity),
                transform: `translateY(${float}px) rotate(${rotate}deg)`
            }}
        >
            <HelpCircle size={size} className={color} strokeWidth={2} />
        </div>
    );
};

export const QuestionsAnimation = () => {
    const frame = useCurrentFrame();
    const { fps } = useVideoConfig();

    const scale = spring({ frame, fps, config: { mass: 0.6, stiffness: 60 } });
    const opacity = interpolate(frame, [0, 30], [0, 1]);

    // Search bar expansion
    const searchWidth = interpolate(frame, [20, 50], [0, 600], { extrapolateRight: 'clamp' });
    const searchOpacity = interpolate(frame, [20, 40], [0, 1]);

    return (
        <AbsoluteFill className="bg-slate-950 flex items-center justify-center overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10" style={{
                backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                backgroundSize: '40px 40px',
            }}></div>

            {/* Ambient Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-900/10 to-slate-950"></div>

            {/* Floating Elements */}
            <FloatingQuestionMark size={120} x={10} y={20} delay={0} color="text-slate-700" />
            <FloatingQuestionMark size={80} x={85} y={15} delay={10} color="text-slate-600" />
            <FloatingQuestionMark size={150} x={15} y={75} delay={20} color="text-slate-700" />
            <FloatingQuestionMark size={60} x={80} y={80} delay={30} color="text-slate-600" />

            {/* Central Content */}
            <div className="z-10 flex flex-col items-center">
                {/* Main Icon */}
                <div
                    className="mb-8 relative"
                    style={{ transform: `scale(${scale})`, opacity }}
                >
                    <div className="w-32 h-32 bg-slate-900 rounded-3xl flex items-center justify-center shadow-2xl shadow-blue-500/20 border-2 border-slate-700 transform -rotate-6">
                        <MessageCircle size={64} className="text-blue-500" />
                    </div>
                    <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-slate-800 rounded-3xl flex items-center justify-center shadow-xl border-2 border-slate-600 transform rotate-12 z-[-1]">
                        <Lightbulb size={48} className="text-yellow-500" />
                    </div>
                </div>

                {/* Typography */}
                <h1 className="text-7xl font-black text-white tracking-tighter mb-8 drop-shadow-2xl">
                    Popular <span className="text-blue-500">Questions</span>
                </h1>

                {/* Animated Search Bar Mockup */}
                <div
                    className="h-16 bg-white/5 backdrop-blur-md rounded-full border border-white/10 flex items-center px-6 overflow-hidden mx-auto shadow-lg shadow-blue-500/5"
                    style={{
                        width: `${searchWidth}px`,
                        opacity: searchOpacity
                    }}
                >
                    <Search className="text-slate-400 mr-4 shrink-0" size={24} />
                    <div className="h-4 bg-slate-700/50 rounded-full w-32 animate-pulse"></div>
                </div>
            </div>

            {/* Typing Effect Particles (optional, kept simple for now) */}
        </AbsoluteFill>
    );
};
