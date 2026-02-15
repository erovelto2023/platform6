'use client';

import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import CanvasArea from './canvas-area';
import EditorSidebar from './sidebar';
import EditorToolbar from './toolbar';

export default function DesignEditorDetails() {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [activeObject, setActiveObject] = useState<fabric.Object | null>(null);

    useEffect(() => {
        if (!canvas) return;

        const handleSelection = () => {
            setActiveObject(canvas.getActiveObject());
        };

        canvas.on('selection:created', handleSelection);
        canvas.on('selection:updated', handleSelection);
        canvas.on('selection:cleared', handleSelection);

        return () => {
            canvas.off('selection:created', handleSelection);
            canvas.off('selection:updated', handleSelection);
            canvas.off('selection:cleared', handleSelection);
        };
    }, [canvas]);

    const handleAddText = () => {
        if (!canvas) return;
        const text = new fabric.IText('Double click to edit', {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: '#333333'
        });
        canvas.add(text);
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const handleAddRectangle = () => {
        if (!canvas) return;
        const rect = new fabric.Rect({
            left: 100,
            top: 100,
            fill: '#cbd5e1',
            width: 100,
            height: 100
        });
        canvas.add(rect);
        canvas.setActiveObject(rect);
        canvas.renderAll();
    };

    const handleAddCircle = () => {
        if (!canvas) return;
        const circle = new fabric.Circle({
            left: 150,
            top: 150,
            radius: 50,
            fill: '#94a3b8'
        });
        canvas.add(circle);
        canvas.setActiveObject(circle);
        canvas.renderAll();
    };

    const handleAddTriangle = () => {
        if (!canvas) return;
        const triangle = new fabric.Triangle({
            left: 200,
            top: 200,
            width: 100,
            height: 100,
            fill: '#64748b'
        });
        canvas.add(triangle);
        canvas.setActiveObject(triangle);
        canvas.renderAll();
    };

    const handleAddImage = (url: string) => {
        if (!canvas) return;
        fabric.Image.fromURL(url, (img) => {
            img.set({
                left: 100,
                top: 100,
                scaleX: 0.5,
                scaleY: 0.5
            });
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        }, { crossOrigin: 'anonymous' }); // Added crossOrigin
    };

    const handleDelete = () => {
        if (!canvas) return;
        const active = canvas.getActiveObjects();
        if (active.length) {
            canvas.discardActiveObject();
            active.forEach((obj) => {
                canvas.remove(obj);
            });
            canvas.renderAll(); // Ensure re-render
        }
    };

    const handleDownload = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2 // High res export
        });
        const link = document.createElement('a');
        link.download = 'design.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleColorChange = (color: string) => {
        if (!canvas) return;
        const active = canvas.getActiveObject();
        if (active) {
            active.set('fill', color);
            canvas.renderAll();
            // Force update state to reflect change immediately if needed
            setActiveObject({ ...active } as fabric.Object);
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            <EditorToolbar
                activeObject={activeObject}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onColorChange={handleColorChange}
            />
            <div className="flex-1 flex overflow-hidden">
                <EditorSidebar
                    onAddText={handleAddText}
                    onAddRectangle={handleAddRectangle}
                    onAddCircle={handleAddCircle}
                    onAddTriangle={handleAddTriangle}
                    onAddImage={handleAddImage}
                />
                <CanvasArea onCanvasReady={setCanvas} />
            </div>
        </div>
    );
}
