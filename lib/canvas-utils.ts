
export interface CanvasElementJSON {
    id: number;
    type: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
}

export abstract class CanvasElement {
    id: number;
    type: string;
    name: string;
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    opacity: number;

    constructor(type: string, name: string, x: number, y: number, width: number, height: number) {
        this.id = Date.now() + Math.random();
        this.type = type;
        this.name = name;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.rotation = 0;
        this.opacity = 1;
    }

    abstract drawContent(context: CanvasRenderingContext2D): void;

    draw(context: CanvasRenderingContext2D): void {
        context.save();
        context.globalAlpha = this.opacity;

        // Translate to center of element
        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Handle rotation
        if (this.rotation !== 0) {
            context.translate(centerX, centerY);
            context.rotate((this.rotation * Math.PI) / 180);
            context.translate(-centerX, -centerY);
        }

        this.drawContent(context);
        context.restore();
    }

    isHit(px: number, py: number): boolean {
        // Simple bounding box check (doesn't account for rotation perfectly but good enough for simple UI)
        // To do it properly, we'd rotate the point (px, py) around the center in reverse
        if (this.rotation === 0) {
            return px >= this.x && px <= this.x + this.width && py >= this.y && py <= this.y + this.height;
        }

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        // Rotate point around center by -rotation
        const rad = (-this.rotation * Math.PI) / 180;
        const dx = px - centerX;
        const dy = py - centerY;

        const rotatedX = dx * Math.cos(rad) - dy * Math.sin(rad) + centerX;
        const rotatedY = dx * Math.sin(rad) + dy * Math.cos(rad) + centerY;

        return rotatedX >= this.x && rotatedX <= this.x + this.width && rotatedY >= this.y && rotatedY <= this.y + this.height;
    }

    toJSON(): CanvasElementJSON {
        const { id, type, name, x, y, width, height, rotation, opacity } = this;
        return { id, type, name, x, y, width, height, rotation, opacity };
    }
}

export class TextElement extends CanvasElement {
    text: string;
    font: string;
    size: number;
    color: string;
    bold: boolean;
    italic: boolean;
    shadow: boolean;
    outline: boolean;
    align: 'left' | 'center' | 'right';
    letterSpacing: number;
    lineHeight: number;

    constructor(name: string, x: number, y: number) {
        super('text', name, x, y, 0, 0);
        this.text = `Edit ${name}`;
        this.font = 'Poppins';
        this.size = 50;
        this.color = '#333333';
        this.bold = true;
        this.italic = false;
        this.shadow = false;
        this.outline = false;
        this.align = 'center';
        this.letterSpacing = 0;
        this.lineHeight = 1.2;
    }

    getLines(context: CanvasRenderingContext2D, maxWidth: number): string[] {
        const words = this.text.split(' ');
        const lines: string[] = [];
        let currentLine = '';

        // Apply letter spacing estimation to measureText if possible, but canvas API doesn't support it directly in measureText easily.
        // We'll just rely on standard measureText for line breaking for now, as letterSpacing is visual.

        for (let i = 0; i < words.length; i++) {
            const testLine = currentLine + words[i] + ' ';
            const metrics = context.measureText(testLine);
            if (metrics.width > maxWidth && i > 0) {
                lines.push(currentLine.trim());
                currentLine = words[i] + ' ';
            } else {
                currentLine = testLine;
            }
        }
        lines.push(currentLine.trim());
        return lines;
    }

    drawContent(context: CanvasRenderingContext2D) {
        const style = `${this.italic ? 'italic ' : ''}${this.bold ? 'bold ' : ''}${this.size}px '${this.font}'`;
        context.font = style;
        context.fillStyle = this.color;
        context.textAlign = this.align;
        context.textBaseline = 'top';

        // Canvas doesn't support letterSpacing natively in all browsers/contexts easily without manual rendering.
        // However, modern browsers support context.letterSpacing (experimental).
        // Let's try to use it if available, or ignore it if not (safer than manual char rendering for now).
        if (context.letterSpacing !== undefined) {
            context.letterSpacing = `${this.letterSpacing}px`;
        }

        if (this.shadow) {
            context.shadowColor = 'rgba(0,0,0,0.5)';
            context.shadowBlur = 5;
            context.shadowOffsetX = 5;
            context.shadowOffsetY = 5;
        }

        const maxWidth = context.canvas ? context.canvas.width * 0.9 : 800;
        const lines = this.getLines(context, maxWidth);

        this.width = Math.max(...lines.map(line => context.measureText(line).width));
        this.height = lines.length * (this.size * this.lineHeight);

        lines.forEach((line, index) => {
            let lineX = this.x;
            if (this.align === 'center') lineX = this.x + this.width / 2;
            else if (this.align === 'right') lineX = this.x + this.width;

            const lineY = this.y + (index * this.size * this.lineHeight);

            if (this.outline) {
                context.strokeStyle = '#000';
                context.lineWidth = 2;
                context.strokeText(line, lineX, lineY);
            }
            context.fillText(line, lineX, lineY);
        });

        // Reset letter spacing
        if (context.letterSpacing !== undefined) {
            context.letterSpacing = '0px';
        }
    }

    // Override isHit because text alignment makes x/y different from bounding box top-left
    isHit(px: number, py: number): boolean {
        return super.isHit(px, py);
    }

    toJSON() {
        const base = super.toJSON();
        const { text, font, size, color, bold, italic, shadow, outline, align, letterSpacing, lineHeight } = this;
        return { ...base, text, font, size, color, bold, italic, shadow, outline, align, letterSpacing, lineHeight };
    }
}

export class ButtonElement extends CanvasElement {
    textElement: TextElement;
    bgColor: string;
    borderRadius: number;

    constructor(name: string, x: number, y: number) {
        super('button', name, x, y, 300, 100);
        this.textElement = new TextElement('Button Text', x, y);
        this.textElement.text = 'Click Here';
        this.textElement.size = 40;
        this.textElement.color = '#FFFFFF';
        this.textElement.bold = true;
        this.bgColor = '#ff5c5c';
        this.borderRadius = 15;
    }

    drawContent(context: CanvasRenderingContext2D) {
        context.font = `${this.textElement.bold ? 'bold ' : ''}${this.textElement.size}px '${this.textElement.font}'`;
        const textMetrics = context.measureText(this.textElement.text);

        // Update dimensions based on text
        this.width = Math.max(this.width, textMetrics.width + 60);
        this.height = Math.max(this.height, this.textElement.size + 40);

        context.fillStyle = this.bgColor;
        context.beginPath();
        if (context.roundRect) {
            context.roundRect(this.x, this.y, this.width, this.height, [this.borderRadius]);
        } else {
            context.rect(this.x, this.y, this.width, this.height);
        }
        context.fill();

        const textX = this.x + this.width / 2;
        const textY = this.y + this.height / 2;

        context.fillStyle = this.textElement.color;
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(this.textElement.text, textX, textY);
    }

    toJSON() {
        const base = super.toJSON();
        const { bgColor, borderRadius } = this;
        return { ...base, bgColor, borderRadius, textElement: this.textElement.toJSON() };
    }
}

export class ImageElement extends CanvasElement {
    image: HTMLImageElement;
    src: string = '';

    constructor(name: string, x: number, y: number) {
        super('image', name, x, y, 200, 200);
        if (typeof window !== 'undefined') {
            this.image = new Image();
            this.image.crossOrigin = "anonymous";
        } else {
            this.image = {} as HTMLImageElement;
        }
    }

    drawContent(context: CanvasRenderingContext2D) {
        if (this.image.src && this.image.complete && this.image.naturalWidth !== 0) {
            context.drawImage(this.image, this.x, this.y, this.width, this.height);
        } else {
            context.strokeStyle = '#ccc';
            context.lineWidth = 2;
            context.strokeRect(this.x, this.y, this.width, this.height);
            context.fillStyle = '#666';
            context.font = '20px Inter';
            context.textAlign = 'center';
            context.textBaseline = 'middle';
            context.fillText('Image', this.x + this.width / 2, this.y + this.height / 2);
        }
    }

    toJSON() {
        const base = super.toJSON();
        return { ...base, src: this.image.src };
    }
}

export class ShapeElement extends CanvasElement {
    shapeType: 'rectangle' | 'circle' | 'triangle';
    fillColor: string;
    strokeColor: string;
    strokeWidth: number;

    constructor(name: string, x: number, y: number, shapeType: 'rectangle' | 'circle' | 'triangle' = 'rectangle') {
        super('shape', name, x, y, 200, 200);
        this.shapeType = shapeType;
        this.fillColor = '#3b82f6';
        this.strokeColor = 'transparent';
        this.strokeWidth = 0;
    }

    drawContent(context: CanvasRenderingContext2D) {
        context.fillStyle = this.fillColor;
        context.strokeStyle = this.strokeColor;
        context.lineWidth = this.strokeWidth;

        context.beginPath();
        if (this.shapeType === 'rectangle') {
            context.rect(this.x, this.y, this.width, this.height);
        } else if (this.shapeType === 'circle') {
            const centerX = this.x + this.width / 2;
            const centerY = this.y + this.height / 2;
            const radius = Math.min(this.width, this.height) / 2;
            context.arc(centerX, centerY, radius, 0, 2 * Math.PI);
        } else if (this.shapeType === 'triangle') {
            context.moveTo(this.x + this.width / 2, this.y);
            context.lineTo(this.x + this.width, this.y + this.height);
            context.lineTo(this.x, this.y + this.height);
            context.closePath();
        }

        context.fill();
        if (this.strokeWidth > 0) {
            context.stroke();
        }
    }

    toJSON() {
        const base = super.toJSON();
        const { shapeType, fillColor, strokeColor, strokeWidth } = this;
        return { ...base, shapeType, fillColor, strokeColor, strokeWidth };
    }
}

export class LineElement extends CanvasElement {
    color: string;
    lineWidth: number;

    constructor(name: string, x: number, y: number) {
        super('line', name, x, y, 200, 5); // Default width 200, height 5 (thickness)
        this.color = '#000000';
        this.lineWidth = 5;
    }

    drawContent(context: CanvasRenderingContext2D) {
        context.strokeStyle = this.color;
        context.lineWidth = this.lineWidth;
        context.lineCap = 'round';

        context.beginPath();
        // Draw line centered vertically in the bounding box
        const centerY = this.y + this.height / 2;
        context.moveTo(this.x, centerY);
        context.lineTo(this.x + this.width, centerY);
        context.stroke();
    }

    toJSON() {
        const base = super.toJSON();
        const { color, lineWidth } = this;
        return { ...base, color, lineWidth };
    }
}

export interface PlacedWord {
    word: string;
    start: { r: number; c: number };
    end: { r: number; c: number };
    direction: [number, number];
}

export class WordSearchElement extends CanvasElement {
    grid: string[][];
    cellSize: number;
    fontSize: number;
    font: string;
    color: string;
    strokeColor: string;
    showGridLines: boolean;
    words: string[];
    placedWords: PlacedWord[];
    showSolution: boolean;
    highlightColor: string;

    constructor(name: string, x: number, y: number, grid: string[][], words: string[] = [], placedWords: PlacedWord[] = []) {
        const rows = grid.length;
        const cols = grid[0]?.length || 0;
        const cellSize = 40;
        super('wordsearch', name, x, y, cols * cellSize, rows * cellSize);
        this.grid = grid;
        this.cellSize = cellSize;
        this.fontSize = 24;
        this.font = 'Courier New'; // Monospace default
        this.color = '#000000';
        this.strokeColor = '#cccccc';
        this.showGridLines = true;
        this.words = words;
        this.placedWords = placedWords;
        this.showSolution = false;
        this.highlightColor = 'rgba(255, 255, 0, 0.3)';
    }

    drawContent(context: CanvasRenderingContext2D) {
        context.font = `${this.fontSize}px '${this.font}'`;
        context.textAlign = 'center';
        context.textBaseline = 'middle';

        const rows = this.grid.length;
        const cols = this.grid[0]?.length || 0;

        // Update dimensions
        this.width = cols * this.cellSize;
        this.height = rows * this.cellSize;

        // Draw Solution Highlights
        if (this.showSolution) {
            context.lineCap = 'round';
            context.lineWidth = this.cellSize * 0.8;
            context.strokeStyle = this.highlightColor;

            this.placedWords.forEach(pw => {
                const startX = this.x + pw.start.c * this.cellSize + this.cellSize / 2;
                const startY = this.y + pw.start.r * this.cellSize + this.cellSize / 2;
                const endX = this.x + pw.end.c * this.cellSize + this.cellSize / 2;
                const endY = this.y + pw.end.r * this.cellSize + this.cellSize / 2;

                context.beginPath();
                context.moveTo(startX, startY);
                context.lineTo(endX, endY);
                context.stroke();
            });
        }

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cellX = this.x + c * this.cellSize;
                const cellY = this.y + r * this.cellSize;

                // Draw grid line
                if (this.showGridLines) {
                    context.strokeStyle = this.strokeColor;
                    context.lineWidth = 1;
                    context.strokeRect(cellX, cellY, this.cellSize, this.cellSize);
                }

                // Draw letter
                const letter = this.grid[r][c];
                if (letter) {
                    context.fillStyle = this.color;
                    context.fillText(letter, cellX + this.cellSize / 2, cellY + this.cellSize / 2);
                }
            }
        }
    }

    toJSON() {
        const base = super.toJSON();
        const { grid, cellSize, fontSize, font, color, strokeColor, showGridLines, words, placedWords, showSolution, highlightColor } = this;
        return { ...base, grid, cellSize, fontSize, font, color, strokeColor, showGridLines, words, placedWords, showSolution, highlightColor };
    }
}

export interface CrosswordClue {
    number: number;
    direction: 'across' | 'down';
    text: string;
    answer: string;
    row: number;
    col: number;
}

export interface CrosswordCell {
    char: string;
    number?: number;
    isActive: boolean; // true if part of a word, false if empty/black
}

export class CrosswordElement extends CanvasElement {
    grid: CrosswordCell[][];
    clues: CrosswordClue[];
    cellSize: number;
    fontSize: number;
    font: string;
    color: string;
    strokeColor: string;
    showSolution: boolean;

    constructor(name: string, x: number, y: number, grid: CrosswordCell[][], clues: CrosswordClue[]) {
        const rows = grid.length;
        const cols = grid[0]?.length || 0;
        const cellSize = 40;
        super('crossword', name, x, y, cols * cellSize, rows * cellSize);
        this.grid = grid;
        this.clues = clues;
        this.cellSize = cellSize;
        this.fontSize = 18;
        this.font = 'Arial';
        this.color = '#000000';
        this.strokeColor = '#000000';
        this.showSolution = false;
    }

    drawContent(context: CanvasRenderingContext2D) {
        const rows = this.grid.length;
        const cols = this.grid[0]?.length || 0;

        // Update dimensions
        this.width = cols * this.cellSize;
        this.height = rows * this.cellSize;

        context.textAlign = 'center';
        context.textBaseline = 'middle';

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const cell = this.grid[r][c];
                const cellX = this.x + c * this.cellSize;
                const cellY = this.y + r * this.cellSize;

                if (cell.isActive) {
                    // Draw cell box
                    context.fillStyle = '#ffffff';
                    context.fillRect(cellX, cellY, this.cellSize, this.cellSize);
                    context.strokeStyle = this.strokeColor;
                    context.lineWidth = 1;
                    context.strokeRect(cellX, cellY, this.cellSize, this.cellSize);

                    // Draw number
                    if (cell.number) {
                        context.fillStyle = this.color;
                        context.font = `10px '${this.font}'`;
                        context.textAlign = 'left';
                        context.textBaseline = 'top';
                        context.fillText(cell.number.toString(), cellX + 2, cellY + 2);
                    }

                    // Draw solution letter
                    if (this.showSolution && cell.char) {
                        context.fillStyle = this.color;
                        context.font = `${this.fontSize}px '${this.font}'`;
                        context.textAlign = 'center';
                        context.textBaseline = 'middle';
                        context.fillText(cell.char, cellX + this.cellSize / 2, cellY + this.cellSize / 2);
                    }
                } else {
                    // Empty/Black cell - usually transparent in freeform, or black in dense
                    // For freeform, we just don't draw anything, or maybe a faint guide if editing?
                    // Let's leave it transparent for now.
                }
            }
        }
    }

    toJSON() {
        const base = super.toJSON();
        const { grid, clues, cellSize, fontSize, font, color, strokeColor, showSolution } = this;
        return { ...base, grid, clues, cellSize, fontSize, font, color, strokeColor, showSolution };
    }
}

export interface FillInTheBlankSegment {
    text: string;
    isBlank: boolean;
    answer?: string;
    id: string; // Unique ID for the blank
}

export class FillInTheBlankElement extends CanvasElement {
    segments: FillInTheBlankSegment[];
    wordBank: string[];
    showWordBank: boolean;
    blankStyle: 'line' | 'box';
    fontSize: number;
    font: string;
    color: string;
    lineHeight: number;
    showSolution: boolean;

    constructor(
        name: string,
        x: number,
        y: number,
        segments: FillInTheBlankSegment[],
        wordBank: string[] = []
    ) {
        super('fillin', name, x, y, 500, 300); // type, name, x, y, width, height
        this.segments = segments;
        this.wordBank = wordBank;
        this.showWordBank = true;
        this.blankStyle = 'line';
        this.fontSize = 24;
        this.font = "Arial";
        this.color = "#000000";
        this.lineHeight = 1.5;
        this.showSolution = false;
        this.width = 500; // Default width
        this.height = 300; // Default height estimate
    }

    drawContent(context: CanvasRenderingContext2D) {
        context.font = `${this.fontSize}px ${this.font}`;
        context.textBaseline = "top";
        context.textAlign = "left";
        context.fillStyle = this.color;

        let cursorX = 0;
        let cursorY = 0;
        const maxWidth = this.width;

        // Draw Text Segments
        this.segments.forEach(seg => {
            const textToDraw = seg.isBlank && !this.showSolution ? (this.blankStyle === 'line' ? '______' : '[      ]') : seg.text;
            const metrics = context.measureText(textToDraw);
            const wordWidth = metrics.width;

            if (cursorX + wordWidth > maxWidth) {
                cursorX = 0;
                cursorY += this.fontSize * this.lineHeight;
            }

            if (seg.isBlank) {
                if (this.showSolution) {
                    context.fillStyle = "blue"; // Highlight solution
                    context.fillText(seg.answer || "", this.x + cursorX, this.y + cursorY);
                    context.fillStyle = this.color; // Reset

                    // Draw underline for solution too
                    if (this.blankStyle === 'line') {
                        context.beginPath();
                        context.moveTo(this.x + cursorX, this.y + cursorY + this.fontSize);
                        context.lineTo(this.x + cursorX + wordWidth, this.y + cursorY + this.fontSize);
                        context.stroke();
                    }
                } else {
                    if (this.blankStyle === 'line') {
                        context.beginPath();
                        context.moveTo(this.x + cursorX, this.y + cursorY + this.fontSize);
                        context.lineTo(this.x + cursorX + wordWidth, this.y + cursorY + this.fontSize);
                        context.stroke();
                        // Draw number if needed? For now just line.
                    } else {
                        context.strokeRect(this.x + cursorX, this.y + cursorY, wordWidth, this.fontSize * 1.2);
                    }
                }
            } else {
                context.fillText(textToDraw, this.x + cursorX, this.y + cursorY);
            }

            cursorX += wordWidth;
        });

        // Update height based on content
        const textHeight = cursorY + this.fontSize * this.lineHeight;

        // Draw Word Bank
        if (this.showWordBank && this.wordBank.length > 0) {
            const bankY = textHeight + 40;
            context.font = `${this.fontSize * 0.8}px ${this.font}`;
            context.fillText("Word Bank:", this.x, this.y + bankY);

            let bankX = 0;
            let bankCursorY = bankY + 30;
            const bankLineHeight = this.fontSize * 1.2;

            this.wordBank.forEach((word, i) => {
                const wMetrics = context.measureText(word + "   ");
                if (bankX + wMetrics.width > maxWidth) {
                    bankX = 0;
                    bankCursorY += bankLineHeight;
                }
                context.fillText(word, this.x + bankX, this.y + bankCursorY);
                bankX += wMetrics.width;
            });

            this.height = bankCursorY + bankLineHeight;
        } else {
            this.height = textHeight;
        }
    }

    toJSON() {
        const base = super.toJSON();
        const { segments, wordBank, showWordBank, blankStyle, fontSize, font, color, lineHeight, showSolution } = this;
        return { ...base, segments, wordBank, showWordBank, blankStyle, fontSize, font, color, lineHeight, showSolution };
    }
}
