'use client';

import { useEffect, useRef } from 'react';
import { fabric } from 'fabric';

interface CanvasAreaProps {
    onCanvasReady: (canvas: fabric.Canvas) => void;
}

export default function CanvasArea({ onCanvasReady }: CanvasAreaProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!canvasRef.current || !containerRef.current) return;

        const canvas = new fabric.Canvas(canvasRef.current, {
            backgroundColor: '#ffffff',
            width: 800,
            height: 600,
            preserveObjectStacking: true,
        });

        // Center the canvas in the container initially
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
        <div ref={containerRef} className="flex-1 bg-slate-100 flex items-center justify-center overflow-auto p-10 h-full">
            <div className="shadow-2xl">
                <canvas ref={canvasRef} />
            </div>
        </div>
    );
}
