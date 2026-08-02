'use client';

import { useEffect, useRef } from 'react';
import { Canvas } from 'fabric';

interface CanvasAreaProps {
    onCanvasReady: (canvas: Canvas) => void;
}

export default function CanvasArea({ onCanvasReady }: CanvasAreaProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = new Canvas(canvasRef.current, {
            backgroundColor: '#ffffff',
            width: 800,
            height: 600,
            preserveObjectStacking: true,
        });

        const updateCanvasSize = () => {
            if (containerRef.current) {
                // Logic to resize or center if needed
            }
        };

        window.addEventListener('resize', updateCanvasSize);
        onCanvasReady(canvas);

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            canvas.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="flex-1 bg-slate-950 flex items-center justify-center overflow-auto p-10 h-full">
            <div className="shadow-2xl border border-slate-800 rounded-xl overflow-hidden">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
