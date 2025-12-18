"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
    Undo, Redo, Type, Square, Image as ImageIcon,
    Download, Layers, Trash2, MoveUp, MoveDown,
    Upload, FileText, Save, FolderOpen, X
} from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";
import JSZip from "jszip";
import { saveAs } from "file-saver";

import { CanvasElement, TextElement, ButtonElement, ImageElement, CanvasElementJSON } from "@/lib/canvas-utils";

interface HistoryState {
    pinSize: string;
    elements: CanvasElementJSON[];
    bgColor: string;
    bgImageSrc: string | null;
}

export default function PinGeneratorPage() {
    // --- Refs ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bgImageInputRef = useRef<HTMLInputElement>(null);
    const templateInputRef = useRef<HTMLInputElement>(null);
    const csvInputRef = useRef<HTMLInputElement>(null);

    // --- State ---
    const [elements, setElements] = useState<CanvasElement[]>([]);
    const [selectedElementId, setSelectedElementId] = useState<number | null>(null);
    const [pinSize, setPinSize] = useState("1000x1500");
    const [bgColor, setBgColor] = useState("#ffffff");
    const [bgImageSrc, setBgImageSrc] = useState<string | null>(null);
    const [history, setHistory] = useState<HistoryState[]>([]);
    const [historyIndex, setHistoryIndex] = useState(-1);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

    // Bulk Create State
    const [csvData, setCsvData] = useState<any[]>([]);
    const [csvHeaders, setCsvHeaders] = useState<string[]>([]);
    const [csvMappings, setCsvMappings] = useState<Record<string, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedPins, setGeneratedPins] = useState<{ name: string, data: string }[]>([]);
    const [showBulkModal, setShowBulkModal] = useState(false);

    // --- Initialization ---
    useEffect(() => {
        // Initial setup
        const [w, h] = pinSize.split('x').map(Number);
        if (canvasRef.current) {
            canvasRef.current.width = w;
            canvasRef.current.height = h;

            // Add some default elements if empty
            if (elements.length === 0 && history.length === 0) {
                const title = new TextElement('Title', w / 2, 150);
                title.text = "Your Catchy Title";
                title.size = 80;

                const url = new TextElement('URL', w / 2, h - 100);
                url.text = "yourwebsite.com";
                url.size = 30;
                url.bold = false;
                url.color = "#555555";

                const btn = new ButtonElement('CTA', (w - 300) / 2, h - 250);

                const newElements = [url, btn, title];
                setElements(newElements);
                saveState(newElements, bgColor, bgImageSrc, pinSize);
            } else {
                drawCanvas();
            }
        }
    }, []);

    // Redraw when state changes
    useEffect(() => {
        drawCanvas();
    }, [elements, bgColor, bgImageSrc, selectedElementId, pinSize]);

    // --- Canvas Logic ---
    const drawCanvas = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Background Color
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Background Image
        if (bgImageSrc) {
            const img = new Image();
            img.src = bgImageSrc;
            img.crossOrigin = "anonymous";
            if (img.complete && img.naturalWidth !== 0) {
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            } else {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    // Re-draw elements on top after image loads
                    elements.forEach(el => el.draw(ctx));
                    drawSelection(ctx);
                };
            }
        }

        // Elements
        elements.forEach(el => el.draw(ctx));

        // Selection Box
        drawSelection(ctx);

    }, [elements, bgColor, bgImageSrc, selectedElementId]);

    const drawSelection = (ctx: CanvasRenderingContext2D) => {
        if (selectedElementId) {
            const el = elements.find(e => e.id === selectedElementId);
            if (el) {
                ctx.save();
                ctx.strokeStyle = '#007bff';
                ctx.lineWidth = 4;
                ctx.setLineDash([8, 8]);

                let { x, y, width, height } = el;
                // Adjust for text alignment if needed (TextElement handles drawing differently)
                if (el instanceof TextElement) {
                    if (el.align === 'center') x = x - width / 2;
                    else if (el.align === 'right') x = x - width;
                }

                ctx.strokeRect(x - 2, y - 2, width + 4, height + 4);
                ctx.restore();
            }
        }
    };

    // --- History ---
    const saveState = (currElements: CanvasElement[], currBg: string, currBgImg: string | null, currSize: string) => {
        const state: HistoryState = {
            pinSize: currSize,
            elements: currElements.map(el => el.toJSON()),
            bgColor: currBg,
            bgImageSrc: currBgImg
        };

        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(state);
        setHistory(newHistory);
        setHistoryIndex(newHistory.length - 1);
    };

    const loadState = (state: HistoryState) => {
        setPinSize(state.pinSize);
        setBgColor(state.bgColor);
        setBgImageSrc(state.bgImageSrc);

        const loadedElements = state.elements.map(data => {
            let el: CanvasElement | null = null;
            if (data.type === 'text') {
                el = new TextElement(data.name, data.x, data.y);
                Object.assign(el, data);
            } else if (data.type === 'button') {
                el = new ButtonElement(data.name, data.x, data.y);
                // @ts-ignore
                const { textElement, ...btnData } = data;
                Object.assign(el, btnData);
                // @ts-ignore
                if (textElement) Object.assign((el as ButtonElement).textElement, textElement);
            } else if (data.type === 'image') {
                el = new ImageElement(data.name, data.x, data.y);
                Object.assign(el, data);
                // @ts-ignore
                if (data.src) (el as ImageElement).image.src = data.src;
            }
            return el;
        }).filter(Boolean) as CanvasElement[];

        setElements(loadedElements);
    };

    const handleUndo = () => {
        if (historyIndex > 0) {
            const newIndex = historyIndex - 1;
            setHistoryIndex(newIndex);
            loadState(history[newIndex]);
        }
    };

    const handleRedo = () => {
        if (historyIndex < history.length - 1) {
            const newIndex = historyIndex + 1;
            setHistoryIndex(newIndex);
            loadState(history[newIndex]);
        }
    };

    const pushToHistory = () => {
        saveState(elements, bgColor, bgImageSrc, pinSize);
    };

    // --- Interaction ---
    const getMousePos = (e: React.MouseEvent) => {
        const canvas = canvasRef.current;
        if (!canvas) return { x: 0, y: 0 };
        const rect = canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        return {
            x: (e.clientX - rect.left) * scaleX,
            y: (e.clientY - rect.top) * scaleY
        };
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        const pos = getMousePos(e);
        let clicked = null;
        // Check from top to bottom (reverse array)
        for (let i = elements.length - 1; i >= 0; i--) {
            if (elements[i].isHit(pos.x, pos.y)) {
                clicked = elements[i];
                break;
            }
        }

        setSelectedElementId(clicked ? clicked.id : null);

        if (clicked) {
            setIsDragging(true);
            setDragOffset({ x: pos.x - clicked.x, y: pos.y - clicked.y });
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDragging && selectedElementId) {
            const pos = getMousePos(e);
            setElements(prev => prev.map(el => {
                if (el.id === selectedElementId) {
                    el.x = pos.x - dragOffset.x;
                    el.y = pos.y - dragOffset.y;
                }
                return el;
            }));
        }
    };

    const handleMouseUp = () => {
        if (isDragging) {
            setIsDragging(false);
            pushToHistory();
        }
    };

    // --- Element Management ---
    const addText = () => {
        const [w, h] = pinSize.split('x').map(Number);
        const el = new TextElement(`Text ${elements.length + 1}`, w / 2, h / 2);
        setElements([...elements, el]);
        setSelectedElementId(el.id);
        pushToHistory();
    };

    const addButton = () => {
        const [w, h] = pinSize.split('x').map(Number);
        const el = new ButtonElement(`Button ${elements.length + 1}`, w / 2 - 150, h / 2);
        setElements([...elements, el]);
        setSelectedElementId(el.id);
        pushToHistory();
    };

    const addImage = () => {
        const [w, h] = pinSize.split('x').map(Number);
        const el = new ImageElement(`Image ${elements.length + 1}`, w / 2 - 100, h / 2);
        setElements([...elements, el]);
        setSelectedElementId(el.id);
        pushToHistory();
    };

    const deleteElement = (id: number) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElementId === id) setSelectedElementId(null);
        pushToHistory();
    };

    const moveLayer = (id: number, direction: 'up' | 'down') => {
        const index = elements.findIndex(el => el.id === id);
        if (index === -1) return;

        const newElements = [...elements];
        if (direction === 'up' && index < newElements.length - 1) {
            [newElements[index], newElements[index + 1]] = [newElements[index + 1], newElements[index]];
        } else if (direction === 'down' && index > 0) {
            [newElements[index], newElements[index - 1]] = [newElements[index - 1], newElements[index]];
        }
        setElements(newElements);
        pushToHistory();
    };

    // --- Property Updates ---
    const updateSelectedProperty = (prop: string, value: any, isTextElementProp = false) => {
        if (!selectedElementId) return;

        setElements(prev => prev.map(el => {
            if (el.id === selectedElementId) {
                if (el instanceof ButtonElement && isTextElementProp) {
                    // @ts-ignore
                    el.textElement[prop] = value;
                } else {
                    // @ts-ignore
                    el[prop] = value;
                }
                // Handle image src update specifically to reload image
                if (prop === 'src' && el instanceof ImageElement) {
                    el.image.src = value;
                }
            }
            return el;
        }));
        // We don't push to history on every keystroke, maybe debounce or on blur?
        // For simplicity, we'll push on specific actions or let user rely on manual save for now, 
        // but ideally 'change' vs 'input' events. 
        // For now, let's just trigger redraw.
    };

    // --- Bulk Create ---
    const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
                setCsvData(results.data);
                setCsvHeaders(results.meta.fields || []);
                toast.success(`Loaded ${results.data.length} rows`);
            }
        });
    };

    const generateBulkPins = async () => {
        if (csvData.length === 0) {
            toast.error("No CSV data");
            return;
        }

        setIsGenerating(true);
        setShowBulkModal(true);
        setGeneratedPins([]);

        const pins = [];
        const canvas = document.createElement('canvas');
        const [w, h] = pinSize.split('x').map(Number);
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Helper to load image
        const loadImage = (src: string): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "anonymous";
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        try {
            // Preload background if exists
            let bgImg: HTMLImageElement | null = null;
            if (bgImageSrc) {
                bgImg = await loadImage(bgImageSrc);
            }

            for (let i = 0; i < csvData.length; i++) {
                const row = csvData[i];

                // Clear
                ctx.clearRect(0, 0, w, h);
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, w, h);
                if (bgImg) ctx.drawImage(bgImg, 0, 0, w, h);

                // Draw elements with replacements
                for (const el of elements) {
                    // Clone element to avoid modifying state
                    const elJson = el.toJSON();
                    let tempEl: CanvasElement | null = null;

                    if (elJson.type === 'text') {
                        tempEl = new TextElement(elJson.name, elJson.x, elJson.y);
                        Object.assign(tempEl, elJson);
                        // Map text
                        const mapKey = csvMappings[el.id];
                        if (mapKey && row[mapKey]) (tempEl as TextElement).text = row[mapKey];

                    } else if (elJson.type === 'button') {
                        tempEl = new ButtonElement(elJson.name, elJson.x, elJson.y);
                        // @ts-ignore
                        const { textElement, ...rest } = elJson;
                        Object.assign(tempEl, rest);
                        // @ts-ignore
                        Object.assign((tempEl as ButtonElement).textElement, textElement);

                        // Map button text
                        // @ts-ignore
                        const mapKey = csvMappings[(el as ButtonElement).textElement.id] || csvMappings[el.id];
                        if (mapKey && row[mapKey]) (tempEl as ButtonElement).textElement.text = row[mapKey];
                    } else if (elJson.type === 'image') {
                        tempEl = new ImageElement(elJson.name, elJson.x, elJson.y);
                        Object.assign(tempEl, elJson);
                        // Map image src?
                        const mapKey = csvMappings[el.id];
                        if (mapKey && row[mapKey]) {
                            (tempEl as ImageElement).image.src = row[mapKey];
                            // Wait for image load
                            await new Promise(r => (tempEl as ImageElement).image.onload = r);
                        } else if ((tempEl as ImageElement).src) {
                            (tempEl as ImageElement).image.src = (tempEl as ImageElement).src;
                            await new Promise(r => (tempEl as ImageElement).image.onload = r);
                        }
                    }

                    if (tempEl) tempEl.draw(ctx);
                }

                const dataUrl = canvas.toDataURL('image/png');
                // Use first mapped column for filename or index
                const nameKey = Object.values(csvMappings)[0];
                const nameSuffix = nameKey ? row[nameKey] : i + 1;
                const safeName = `pin_${nameSuffix}`.replace(/[^a-z0-9]/gi, '_');

                pins.push({ name: safeName, data: dataUrl });
            }

            setGeneratedPins(pins);
        } catch (error) {
            console.error(error);
            toast.error("Error generating pins");
        } finally {
            setIsGenerating(false);
        }
    };

    const downloadZip = async () => {
        const zip = new JSZip();
        generatedPins.forEach(pin => {
            const data = pin.data.split(',')[1];
            zip.file(`${pin.name}.png`, data, { base64: true });
        });
        const content = await zip.generateAsync({ type: "blob" });
        saveAs(content, "pins.zip");
    };

    // --- Render Helpers ---
    const getSelectedElement = () => elements.find(el => el.id === selectedElementId);

    return (
        <div className="flex flex-col h-[calc(100vh-80px)]">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
                <div>
                    <h1 className="text-2xl font-bold">Pin Creator Pro</h1>
                    <p className="text-sm text-muted-foreground">Design high-converting Pinterest pins.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleUndo} disabled={historyIndex <= 0}>
                        <Undo className="h-4 w-4 mr-2" /> Undo
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleRedo} disabled={historyIndex >= history.length - 1}>
                        <Redo className="h-4 w-4 mr-2" /> Redo
                    </Button>
                    <Button onClick={() => {
                        if (canvasRef.current) {
                            const link = document.createElement('a');
                            link.download = 'pin.png';
                            link.href = canvasRef.current.toDataURL();
                            link.click();
                        }
                    }}>
                        <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                </div>
            </div>

            <div className="flex flex-1 overflow-hidden">
                {/* Left Sidebar: Controls */}
                <div className="w-[400px] bg-slate-50 border-r overflow-y-auto p-4 space-y-6">

                    {/* Size & Background */}
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">Canvas Settings</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Size</Label>
                                <Select value={pinSize} onValueChange={(v) => {
                                    setPinSize(v); setTimeout(() => {
                                        const [w, h] = v.split('x').map(Number);
                                        if (canvasRef.current) { canvasRef.current.width = w; canvasRef.current.height = h; drawCanvas(); }
                                    }, 100);
                                }}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1000x1500">Standard (1000x1500)</SelectItem>
                                        <SelectItem value="1000x1000">Square (1000x1000)</SelectItem>
                                        <SelectItem value="1080x1920">Idea Pin (1080x1920)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Background Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="w-12 h-10 p-1" />
                                    <Input type="text" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="flex-1" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Background Image</Label>
                                <div className="flex gap-2">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        className="text-xs"
                                        onChange={(e) => {
                                            const file = e.target.files?.[0];
                                            if (file) setBgImageSrc(URL.createObjectURL(file));
                                        }}
                                    />
                                    {bgImageSrc && (
                                        <Button variant="ghost" size="icon" onClick={() => setBgImageSrc(null)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Add Elements */}
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">Add Elements</CardTitle></CardHeader>
                        <CardContent className="grid grid-cols-3 gap-2">
                            <Button variant="outline" onClick={addText} className="flex flex-col h-auto py-3 gap-1">
                                <Type className="h-5 w-5" /> <span className="text-xs">Text</span>
                            </Button>
                            <Button variant="outline" onClick={addButton} className="flex flex-col h-auto py-3 gap-1">
                                <Square className="h-5 w-5" /> <span className="text-xs">Button</span>
                            </Button>
                            <Button variant="outline" onClick={addImage} className="flex flex-col h-auto py-3 gap-1">
                                <ImageIcon className="h-5 w-5" /> <span className="text-xs">Image</span>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Properties Panel */}
                    {selectedElementId && getSelectedElement() && (
                        <Card className="border-blue-200 shadow-sm">
                            <CardHeader className="pb-2 bg-blue-50/50">
                                <div className="flex justify-between items-center">
                                    <CardTitle className="text-sm font-bold text-blue-700">
                                        Edit: {getSelectedElement()?.name}
                                    </CardTitle>
                                    <Button variant="destructive" size="icon" className="h-6 w-6" onClick={() => deleteElement(selectedElementId!)}>
                                        <Trash2 className="h-3 w-3" />
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4 pt-4">
                                {getSelectedElement() instanceof TextElement && (
                                    <>
                                        <div className="space-y-1">
                                            <Label>Text</Label>
                                            <Input
                                                value={(getSelectedElement() as TextElement).text}
                                                onChange={(e) => updateSelectedProperty('text', e.target.value)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label>Font Size</Label>
                                                <Input type="number" value={(getSelectedElement() as TextElement).size} onChange={(e) => updateSelectedProperty('size', Number(e.target.value))} />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Color</Label>
                                                <Input type="color" value={(getSelectedElement() as TextElement).color} onChange={(e) => updateSelectedProperty('color', e.target.value)} className="h-9" />
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <Label>Font Family</Label>
                                            <Select value={(getSelectedElement() as TextElement).font} onValueChange={(v) => updateSelectedProperty('font', v)}>
                                                <SelectTrigger><SelectValue /></SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="Poppins">Poppins</SelectItem>
                                                    <SelectItem value="Inter">Inter</SelectItem>
                                                    <SelectItem value="Oswald">Oswald</SelectItem>
                                                    <SelectItem value="Playfair Display">Playfair Display</SelectItem>
                                                    <SelectItem value="Lobster">Lobster</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </>
                                )}
                                {getSelectedElement() instanceof ButtonElement && (
                                    <>
                                        <div className="space-y-1">
                                            <Label>Button Text</Label>
                                            <Input
                                                value={(getSelectedElement() as ButtonElement).textElement.text}
                                                onChange={(e) => updateSelectedProperty('text', e.target.value, true)}
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div className="space-y-1">
                                                <Label>Bg Color</Label>
                                                <Input type="color" value={(getSelectedElement() as ButtonElement).bgColor} onChange={(e) => updateSelectedProperty('bgColor', e.target.value)} className="h-9" />
                                            </div>
                                            <div className="space-y-1">
                                                <Label>Text Color</Label>
                                                <Input type="color" value={(getSelectedElement() as ButtonElement).textElement.color} onChange={(e) => updateSelectedProperty('color', e.target.value, true)} className="h-9" />
                                            </div>
                                        </div>
                                    </>
                                )}
                                {getSelectedElement() instanceof ImageElement && (
                                    <div className="space-y-1">
                                        <Label>Image Source</Label>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                const file = e.target.files?.[0];
                                                if (file) updateSelectedProperty('src', URL.createObjectURL(file));
                                            }}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {/* Layers */}
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">Layers</CardTitle></CardHeader>
                        <CardContent className="space-y-2">
                            {[...elements].reverse().map((el) => (
                                <div
                                    key={el.id}
                                    className={`flex items-center justify-between p-2 rounded text-sm border cursor-pointer ${selectedElementId === el.id ? 'bg-blue-50 border-blue-200' : 'bg-white'}`}
                                    onClick={() => setSelectedElementId(el.id)}
                                >
                                    <span className="truncate max-w-[150px]">{el.name}</span>
                                    <div className="flex gap-1">
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'up'); }}>
                                            <MoveUp className="h-3 w-3" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={(e) => { e.stopPropagation(); moveLayer(el.id, 'down'); }}>
                                            <MoveDown className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Bulk Create */}
                    <Card>
                        <CardHeader className="pb-2"><CardTitle className="text-sm">Bulk Create</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label>Upload CSV</Label>
                                <Input type="file" accept=".csv" onChange={handleCsvUpload} />
                            </div>
                            {csvHeaders.length > 0 && (
                                <div className="space-y-2">
                                    <Label>Map Layers</Label>
                                    <div className="space-y-2 border rounded p-2 bg-slate-50 text-xs">
                                        {elements.filter(el => el instanceof TextElement || el instanceof ButtonElement).map(el => (
                                            <div key={el.id} className="flex items-center justify-between">
                                                <span>{el.name}</span>
                                                <Select
                                                    onValueChange={(v) => setCsvMappings(prev => ({ ...prev, [el instanceof ButtonElement ? el.textElement.id : el.id]: v }))}
                                                >
                                                    <SelectTrigger className="w-[120px] h-7 text-xs"><SelectValue placeholder="Column" /></SelectTrigger>
                                                    <SelectContent>
                                                        {csvHeaders.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        ))}
                                    </div>
                                    <Button className="w-full" onClick={generateBulkPins} disabled={isGenerating}>
                                        {isGenerating ? "Generating..." : "Generate Pins"}
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Main Canvas Area */}
                <div className="flex-1 bg-slate-200 flex items-center justify-center p-8 overflow-auto">
                    <div className="shadow-2xl bg-white">
                        <canvas
                            ref={canvasRef}
                            onMouseDown={handleMouseDown}
                            onMouseMove={handleMouseMove}
                            onMouseUp={handleMouseUp}
                            onMouseLeave={handleMouseUp}
                            className="max-w-full max-h-[85vh] object-contain cursor-crosshair"
                            style={{ width: 'auto', height: 'auto' }}
                        />
                    </div>
                </div>
            </div>

            {/* Bulk Preview Modal */}
            {showBulkModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-8">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] flex flex-col">
                        <div className="p-4 border-b flex justify-between items-center">
                            <h2 className="text-xl font-bold">Generated Pins ({generatedPins.length})</h2>
                            <Button variant="ghost" size="icon" onClick={() => setShowBulkModal(false)}>
                                <X className="h-6 w-6" />
                            </Button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-6 bg-slate-100">
                            {isGenerating ? (
                                <div className="flex items-center justify-center h-full">Generating...</div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                    {generatedPins.map((pin, i) => (
                                        <div key={i} className="bg-white p-2 rounded shadow">
                                            <img src={pin.data} alt={pin.name} className="w-full h-auto rounded" />
                                            <p className="text-xs mt-2 truncate text-center">{pin.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="p-4 border-t bg-white flex justify-end">
                            <Button onClick={downloadZip} disabled={generatedPins.length === 0} className="w-full sm:w-auto">
                                <Download className="h-4 w-4 mr-2" /> Download All (ZIP)
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
