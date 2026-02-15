'use client';

import { useState, useRef, useEffect } from 'react';
import { fabric } from 'fabric';
import CanvasArea from './canvas-area';
import EditorSidebar from './sidebar';
import EditorToolbar from './toolbar';

import AISidebarPanel from './ai-sidebar-panel';

export default function DesignEditorDetails() {
    const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
    const [hasSelection, setHasSelection] = useState(false);
    const [selectedColor, setSelectedColor] = useState("#000000");
    const [isAIOpen, setIsAIOpen] = useState(false);


    useEffect(() => {
        if (!canvas) return;

        const updateSelection = () => {
            const active = canvas.getActiveObject();
            setHasSelection(!!active);

            if (active) {
                // Safely get fill color
                const fill = active.get('fill');
                if (typeof fill === 'string') {
                    setSelectedColor(fill);
                } else {
                    setSelectedColor("#000000");
                }
            }
        };

        canvas.on('selection:created', updateSelection);
        canvas.on('selection:updated', updateSelection);
        canvas.on('selection:cleared', updateSelection);

        return () => {
            canvas.off('selection:created', updateSelection);
            canvas.off('selection:updated', updateSelection);
            canvas.off('selection:cleared', updateSelection);
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
        }, { crossOrigin: 'anonymous' });
    };

    const handleDelete = () => {
        if (!canvas) return;
        const active = canvas.getActiveObjects();
        if (active.length) {
            canvas.discardActiveObject();
            active.forEach((obj) => {
                canvas.remove(obj);
            });
            canvas.renderAll();
        }
    };

    const handleDownload = () => {
        if (!canvas) return;
        const dataURL = canvas.toDataURL({
            format: 'png',
            quality: 1,
            multiplier: 2
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
            setSelectedColor(color);
        }
    }

    const handleAddAIText = (text: string) => {
        if (!canvas) return;
        const textObj = new fabric.IText(text, {
            left: 100,
            top: 100,
            fontSize: 24,
            fill: '#333333',
            width: 300,
        });
        canvas.add(textObj);
        canvas.setActiveObject(textObj);
        canvas.renderAll();
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 overflow-hidden">
            <EditorToolbar
                hasSelection={hasSelection}
                selectedColor={selectedColor}
                onDelete={handleDelete}
                onDownload={handleDownload}
                onColorChange={handleColorChange}
            />
            <div className="flex-1 flex overflow-hidden relative">
                <EditorSidebar
                    onAddText={handleAddText}
                    onAddRectangle={handleAddRectangle}
                    onAddCircle={handleAddCircle}
                    onAddTriangle={handleAddTriangle}
                    onAddImage={handleAddImage}
                    onToggleAI={() => setIsAIOpen(!isAIOpen)}
                    isAIOpen={isAIOpen}
                />

                {isAIOpen && (
                    <AISidebarPanel
                        onAddImage={handleAddImage}
                        onAddText={handleAddAIText}
                    />
                )}

                <CanvasArea onCanvasReady={setCanvas} />
            </div>
        </div>
    );
}
