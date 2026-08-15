// =========================================================================
// CONNECT THE DOTS PUZZLE ENGINE
// =========================================================================

export interface ConnectDotsConfig {
    title: string;
    subtitle?: string;
    instructions?: string;
    
    // Shape/Path options
    shape: "star" | "heart" | "circle" | "square" | "triangle" | "custom" | "svg";
    customPoints?: { x: number; y: number }[];
    svgPathData?: string;
    
    // Dot options
    numDots: number;
    dotSize: number;
    dotColor: string;
    
    // Number/Label options
    showNumbers: boolean;
    fontSize: number;
    fontColor: string;
    numberOffsetX: number;
    numberOffsetY: number;
    labelFunction?: (pathIndex: number, i: number) => string;
    
    // Line options
    showLines: boolean;
    lineColor: string;
    lineWidth: number;
    
    // Solution options
    showSolution: boolean;
    solutionColor: string;
    
    // Grid/Canvas options
    canvasWidth: number;
    canvasHeight: number;
    
    // Appearance
    backgroundColor: string;
    showPath: boolean;
    showBackground: boolean;
    
    // Point filtering
    pointAlpha: number; // Filter out points forming an angle above this value
    customPointFilter?: string; // Custom function to filter points
}

export interface ConnectDotsPoint {
    x: number;
    y: number;
    number: number;
    customLabelX?: number;
    customLabelY?: number;
}

export interface ConnectDotsGenerationResult {
    config: ConnectDotsConfig;
    points: ConnectDotsPoint[];
    lines: { from: number; to: number }[];
}

// Preset shapes
function getShapePoints(shape: string, width: number, height: number, numPoints: number, customPoints?: { x: number; y: number }[]): ConnectDotsPoint[] {
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.4;
    
    switch (shape) {
        case "svg":
            // SVG-based points will be handled separately
            return [];
            
        case "circle":
            return Array.from({ length: numPoints }, (_, i) => {
                const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
                return {
                    x: centerX + radius * Math.cos(angle),
                    y: centerY + radius * Math.sin(angle),
                    number: i + 1,
                };
            });
            
        case "star":
            return Array.from({ length: numPoints }, (_, i) => {
                const angle = (i / numPoints) * Math.PI * 2 - Math.PI / 2;
                const r = i % 2 === 0 ? radius : radius * 0.5;
                return {
                    x: centerX + r * Math.cos(angle),
                    y: centerY + r * Math.sin(angle),
                    number: i + 1,
                };
            });
            
        case "heart":
            return Array.from({ length: numPoints }, (_, i) => {
                const t = (i / numPoints) * Math.PI * 2;
                const x = 16 * Math.pow(Math.sin(t), 3);
                const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
                return {
                    x: centerX + (x / 16) * radius,
                    y: centerY + (y / 16) * radius,
                    number: i + 1,
                };
            });
            
        case "square":
            const side = radius * 1.5;
            const pointsPerSide = Math.floor(numPoints / 4);
            const squarePoints: ConnectDotsPoint[] = [];
            let counter = 1;
            
            // Top side
            for (let i = 0; i < pointsPerSide; i++) {
                squarePoints.push({
                    x: centerX - side/2 + (i / pointsPerSide) * side,
                    y: centerY - side/2,
                    number: counter++,
                });
            }
            // Right side
            for (let i = 0; i < pointsPerSide; i++) {
                squarePoints.push({
                    x: centerX + side/2,
                    y: centerY - side/2 + (i / pointsPerSide) * side,
                    number: counter++,
                });
            }
            // Bottom side
            for (let i = 0; i < pointsPerSide; i++) {
                squarePoints.push({
                    x: centerX + side/2 - (i / pointsPerSide) * side,
                    y: centerY + side/2,
                    number: counter++,
                });
            }
            // Left side
            for (let i = 0; i < pointsPerSide; i++) {
                squarePoints.push({
                    x: centerX - side/2,
                    y: centerY + side/2 - (i / pointsPerSide) * side,
                    number: counter++,
                });
            }
            return squarePoints.slice(0, numPoints);
            
        case "triangle":
            const triSize = radius * 1.5;
            const pointsPerSideTri = Math.floor(numPoints / 3);
            const triPoints: ConnectDotsPoint[] = [];
            let triCounter = 1;
            
            // Top to right
            for (let i = 0; i < pointsPerSideTri; i++) {
                triPoints.push({
                    x: centerX + (i / pointsPerSideTri) * triSize * 0.866,
                    y: centerY - triSize/2 + (i / pointsPerSideTri) * triSize,
                    number: triCounter++,
                });
            }
            // Right to left
            for (let i = 0; i < pointsPerSideTri; i++) {
                triPoints.push({
                    x: centerX + triSize * 0.866 - (i / pointsPerSideTri) * triSize * 0.866,
                    y: centerY + triSize/2,
                    number: triCounter++,
                });
            }
            // Left to top
            for (let i = 0; i < pointsPerSideTri; i++) {
                triPoints.push({
                    x: centerX - triSize * 0.866 + (i / pointsPerSideTri) * triSize * 0.866,
                    y: centerY + triSize/2 - (i / pointsPerSideTri) * triSize,
                    number: triCounter++,
                });
            }
            return triPoints.slice(0, numPoints);
            
        case "custom":
            return customPoints?.map((p: { x: number; y: number }, i: number) => ({ ...p, number: i + 1 })) || [];
            
        default:
            return getShapePoints("circle", width, height, numPoints);
    }
}

export function generateConnectDots(config: ConnectDotsConfig): ConnectDotsGenerationResult {
    let points: ConnectDotsPoint[] = [];
    
    if (config.shape === "svg" && config.svgPathData) {
        // Parse SVG path and sample points
        points = samplePointsFromSVGPath(config.svgPathData, config.numDots, config.canvasWidth, config.canvasHeight);
    } else {
        points = getShapePoints(
            config.shape,
            config.canvasWidth,
            config.canvasHeight,
            config.numDots,
            config.customPoints
        );
    }
    
    // Apply point optimization pipeline
    points = optimizePoints(points, config);
    
    // Re-number points after filtering
    points = points.map((p, i) => ({ ...p, number: i + 1 }));
    
    // Apply label collision detection and repositioning
    if (config.showNumbers) {
        points = resolveLabelCollisions(points, config);
    }
    
    // Generate lines connecting consecutive points
    const lines: { from: number; to: number }[] = [];
    if (config.showLines || config.showSolution) {
        for (let i = 0; i < points.length - 1; i++) {
            lines.push({ from: i, to: i + 1 });
        }
        // Close the shape if it's a closed shape
        if (config.shape !== "custom" && config.shape !== "svg") {
            lines.push({ from: points.length - 1, to: 0 });
        }
    }
    
    return {
        config,
        points,
        lines,
    };
}

// Point optimization pipeline
function optimizePoints(points: ConnectDotsPoint[], config: ConnectDotsConfig): ConnectDotsPoint[] {
    let optimized = [...points];
    
    // Pass 1: Remove points that are too close (minimum spacing)
    if (config.dotSize > 0) {
        const minDistance = config.dotSize * 2.5; // Minimum spacing based on dot size
        optimized = removeClosePoints(optimized, minDistance);
    }
    
    // Pass 2: Apply angle-based filtering
    if (config.pointAlpha > 0 && optimized.length > 2) {
        optimized = filterPointsByAngle(optimized, config.pointAlpha);
    }
    
    // Pass 3: Apply custom point filter if provided
    if (config.customPointFilter) {
        try {
            const filterFn = new Function('points', config.customPointFilter);
            const filtered = filterFn(optimized);
            if (Array.isArray(filtered)) {
                optimized = filtered.map((p: any) => ({ ...p, number: 0 }));
            }
        } catch (e) {
            console.error('Error applying custom point filter:', e);
        }
    }
    
    // Pass 4: Ensure we have enough points (resample if needed)
    const targetCount = config.numDots;
    if (optimized.length < targetCount && optimized.length > 1) {
        optimized = resamplePoints(optimized, targetCount);
    }
    
    return optimized;
}

// Remove points that are too close to each other
function removeClosePoints(points: ConnectDotsPoint[], minDistance: number): ConnectDotsPoint[] {
    if (points.length < 2) return points;
    
    const filtered: ConnectDotsPoint[] = [points[0]];
    
    for (let i = 1; i < points.length; i++) {
        const prev = filtered[filtered.length - 1];
        const curr = points[i];
        const distance = Math.sqrt(Math.pow(curr.x - prev.x, 2) + Math.pow(curr.y - prev.y, 2));
        
        if (distance >= minDistance) {
            filtered.push(curr);
        }
    }
    
    return filtered;
}

// Resample points to reach target count
function resamplePoints(points: ConnectDotsPoint[], targetCount: number): ConnectDotsPoint[] {
    if (points.length < 2) return points;
    if (targetCount <= points.length) return points.slice(0, targetCount);
    
    const resampled: ConnectDotsPoint[] = [];
    const totalLength = calculatePathLength(points);
    const step = totalLength / (targetCount - 1);
    
    let currentLength = 0;
    let pointIndex = 0;
    
    for (let i = 0; i < targetCount; i++) {
        const targetLength = i * step;
        const point = getPointAtLengthAlongPath(points, targetLength);
        if (point) {
            resampled.push({ ...point, number: 0 });
        }
    }
    
    return resampled;
}

// Calculate total path length
function calculatePathLength(points: ConnectDotsPoint[]): number {
    let length = 0;
    for (let i = 1; i < points.length; i++) {
        const dx = points[i].x - points[i - 1].x;
        const dy = points[i].y - points[i - 1].y;
        length += Math.sqrt(dx * dx + dy * dy);
    }
    return length;
}

// Get point at specific length along path
function getPointAtLengthAlongPath(points: ConnectDotsPoint[], targetLength: number): { x: number; y: number } | null {
    let currentLength = 0;
    
    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const dx = curr.x - prev.x;
        const dy = curr.y - prev.y;
        const segmentLength = Math.sqrt(dx * dx + dy * dy);
        
        if (currentLength + segmentLength >= targetLength) {
            const t = (targetLength - currentLength) / segmentLength;
            return {
                x: prev.x + t * dx,
                y: prev.y + t * dy,
            };
        }
        
        currentLength += segmentLength;
    }
    
    return { x: points[points.length - 1].x, y: points[points.length - 1].y };
}

// Label collision detection and resolution
function resolveLabelCollisions(points: ConnectDotsPoint[], config: ConnectDotsConfig): ConnectDotsPoint[] {
    const fontSize = config.fontSize || 12;
    const labelWidth = fontSize * 2; // Approximate label width
    const labelHeight = fontSize * 1.2; // Approximate label height
    
    // Calculate label positions based on offsets
    const labels = points.map((p, i) => ({
        index: i,
        x: p.x + config.numberOffsetX,
        y: p.y + config.numberOffsetY,
        width: labelWidth,
        height: labelHeight,
    }));
    
    // Check for collisions and reposition
    const resolved = [...points];
    const maxAttempts = 8;
    
    for (let i = 0; i < labels.length; i++) {
        const label = labels[i];
        let hasCollision = true;
        let attempt = 0;
        
        while (hasCollision && attempt < maxAttempts) {
            hasCollision = false;
            
            for (let j = 0; j < labels.length; j++) {
                if (i === j) continue;
                
                const other = labels[j];
                if (rectanglesIntersect(label, other)) {
                    hasCollision = true;
                    // Try different positions around the dot
                    const positions = [
                        { offsetX: 12, offsetY: -12 },   // Top-right
                        { offsetX: -12, offsetY: -12 },  // Top-left
                        { offsetX: -12, offsetY: 12 },   // Bottom-left
                        { offsetX: 12, offsetY: 12 },    // Bottom-right
                        { offsetX: 0, offsetY: -20 },    // Top
                        { offsetX: 0, offsetY: 20 },     // Bottom
                        { offsetX: -20, offsetY: 0 },    // Left
                        { offsetX: 20, offsetY: 0 },     // Right
                    ];
                    
                    const pos = positions[attempt % positions.length];
                    label.x = resolved[i].x + pos.offsetX;
                    label.y = resolved[i].y + pos.offsetY;
                    attempt++;
                    break;
                }
            }
        }
        
        // Store the resolved label position as custom offset for this point
        // We'll use a different approach - store in a separate map
        resolved[i] = {
            ...resolved[i],
            customLabelX: label.x,
            customLabelY: label.y,
        };
    }
    
    return resolved;
}

// Check if two rectangles intersect
function rectanglesIntersect(r1: any, r2: any): boolean {
    const padding = 2; // Small padding between labels
    return !(r1.x + r1.width + padding < r2.x - padding ||
             r2.x + r2.width + padding < r1.x - padding ||
             r1.y + r1.height + padding < r2.y - padding ||
             r2.y + r2.height + padding < r1.y - padding);
}

// Parse SVG path data and sample points along it
function samplePointsFromSVGPath(pathData: string, numPoints: number, width: number, height: number): ConnectDotsPoint[] {
    // Simple SVG path parser - handles basic commands (M, L, C, Q, A)
    const points: { x: number; y: number }[] = [];
    const commands = parseSVGPath(pathData);
    
    // Sample points along the path
    const totalLength = estimatePathLength(commands);
    const step = totalLength / (numPoints - 1);
    
    let currentLength = 0;
    let commandIndex = 0;
    let t = 0;
    
    for (let i = 0; i < numPoints; i++) {
        const targetLength = i * step;
        const point = getPointAtLength(commands, targetLength, width, height);
        if (point) {
            points.push(point);
        }
    }
    
    return points.map((p, i) => ({ ...p, number: i + 1 }));
}

// Simple SVG path parser
function parseSVGPath(pathData: string): any[] {
    const commands: any[] = [];
    const regex = /([MmLlHhVvCcSsQqTtAaZz])([^MmLlHhVvCcSsQqTtAaZz]*)/g;
    let match;
    
    while ((match = regex.exec(pathData)) !== null) {
        const command = match[1];
        const params = match[2].trim().split(/[\s,]+/).map(Number).filter(n => !isNaN(n));
        commands.push({ command, params });
    }
    
    return commands;
}

// Estimate total path length
function estimatePathLength(commands: any[]): number {
    let length = 0;
    let currentX = 0, currentY = 0;
    
    for (const cmd of commands) {
        const { command, params } = cmd;
        
        switch (command.toLowerCase()) {
            case 'm':
                currentX = params[0];
                currentY = params[1];
                break;
            case 'l':
                const dx = params[0] - currentX;
                const dy = params[1] - currentY;
                length += Math.sqrt(dx * dx + dy * dy);
                currentX = params[0];
                currentY = params[1];
                break;
            case 'h':
                length += Math.abs(params[0] - currentX);
                currentX = params[0];
                break;
            case 'v':
                length += Math.abs(params[0] - currentY);
                currentY = params[0];
                break;
            case 'c':
                // Approximate cubic bezier length
                const cdx = params[4] - currentX;
                const cdy = params[5] - currentY;
                length += Math.sqrt(cdx * cdx + cdy * cdy);
                currentX = params[4];
                currentY = params[5];
                break;
            case 'q':
                // Approximate quadratic bezier length
                const qdx = params[2] - currentX;
                const qdy = params[3] - currentY;
                length += Math.sqrt(qdx * qdx + qdy * qdy);
                currentX = params[2];
                currentY = params[3];
                break;
            case 'z':
                // Close path - return to start
                break;
        }
    }
    
    return length;
}

// Get point at specific length along path
function getPointAtLength(commands: any[], targetLength: number, width: number, height: number): { x: number; y: number } | null {
    let currentLength = 0;
    let currentX = 0, currentY = 0;
    let startX = 0, startY = 0;
    
    for (const cmd of commands) {
        const { command, params } = cmd;
        
        switch (command.toLowerCase()) {
            case 'm':
                startX = params[0];
                startY = params[1];
                currentX = params[0];
                currentY = params[1];
                break;
            case 'l':
                const dx = params[0] - currentX;
                const dy = params[1] - currentY;
                const segmentLength = Math.sqrt(dx * dx + dy * dy);
                
                if (currentLength + segmentLength >= targetLength) {
                    const t = (targetLength - currentLength) / segmentLength;
                    return {
                        x: currentX + t * dx,
                        y: currentY + t * dy,
                    };
                }
                
                currentLength += segmentLength;
                currentX = params[0];
                currentY = params[1];
                break;
            case 'h':
                const hLength = Math.abs(params[0] - currentX);
                if (currentLength + hLength >= targetLength) {
                    const t = (targetLength - currentLength) / hLength;
                    return {
                        x: currentX + t * (params[0] - currentX),
                        y: currentY,
                    };
                }
                currentLength += hLength;
                currentX = params[0];
                break;
            case 'v':
                const vLength = Math.abs(params[0] - currentY);
                if (currentLength + vLength >= targetLength) {
                    const t = (targetLength - currentLength) / vLength;
                    return {
                        x: currentX,
                        y: currentY + t * (params[0] - currentY),
                    };
                }
                currentLength += vLength;
                currentY = params[0];
                break;
            case 'c':
                // Simplified cubic bezier - treat as line for now
                const cdx = params[4] - currentX;
                const cdy = params[5] - currentY;
                const cLength = Math.sqrt(cdx * cdx + cdy * cdy);
                
                if (currentLength + cLength >= targetLength) {
                    const t = (targetLength - currentLength) / cLength;
                    return {
                        x: currentX + t * cdx,
                        y: currentY + t * cdy,
                    };
                }
                
                currentLength += cLength;
                currentX = params[4];
                currentY = params[5];
                break;
            case 'q':
                // Simplified quadratic bezier - treat as line for now
                const qdx = params[2] - currentX;
                const qdy = params[3] - currentY;
                const qLength = Math.sqrt(qdx * qdx + qdy * qdy);
                
                if (currentLength + qLength >= targetLength) {
                    const t = (targetLength - currentLength) / qLength;
                    return {
                        x: currentX + t * qdx,
                        y: currentY + t * qdy,
                    };
                }
                
                currentLength += qLength;
                currentX = params[2];
                currentY = params[3];
                break;
            case 'z':
                // Close path
                const zdx = startX - currentX;
                const zdy = startY - currentY;
                const zLength = Math.sqrt(zdx * zdx + zdy * zdy);
                
                if (currentLength + zLength >= targetLength) {
                    const t = (targetLength - currentLength) / zLength;
                    return {
                        x: currentX + t * zdx,
                        y: currentY + t * zdy,
                    };
                }
                
                currentLength += zLength;
                currentX = startX;
                currentY = startY;
                break;
        }
    }
    
    return { x: currentX, y: currentY };
}

// Filter points based on angle - removes points that form sharp angles
function filterPointsByAngle(points: ConnectDotsPoint[], maxAngle: number): ConnectDotsPoint[] {
    if (points.length < 3) return points;
    
    const filtered: ConnectDotsPoint[] = [points[0]];
    const angleThreshold = maxAngle * (Math.PI / 180); // Convert to radians
    
    for (let i = 1; i < points.length - 1; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const next = points[i + 1];
        
        // Calculate angle between vectors
        const v1x = curr.x - prev.x;
        const v1y = curr.y - prev.y;
        const v2x = next.x - curr.x;
        const v2y = next.y - curr.y;
        
        const dot = v1x * v2x + v1y * v2y;
        const mag1 = Math.sqrt(v1x * v1x + v1y * v1y);
        const mag2 = Math.sqrt(v2x * v2x + v2y * v2y);
        
        if (mag1 === 0 || mag2 === 0) {
            filtered.push(curr);
            continue;
        }
        
        const cosAngle = dot / (mag1 * mag2);
        const angle = Math.acos(Math.max(-1, Math.min(1, cosAngle)));
        
        // Keep point if angle is not too sharp
        if (angle >= angleThreshold) {
            filtered.push(curr);
        }
    }
    
    filtered.push(points[points.length - 1]);
    return filtered;
}

export function createDefaultConnectDotsConfig(): ConnectDotsConfig {
    return {
        title: "CONNECT THE DOTS",
        subtitle: "Connect the dots in order to reveal the picture",
        instructions: "Start at dot 1 and connect each dot in numerical order",
        shape: "star",
        numDots: 20,
        dotSize: 8,
        dotColor: "#0f172a",
        showNumbers: true,
        fontSize: 12,
        fontColor: "#0f172a",
        numberOffsetX: 12,
        numberOffsetY: -12,
        showLines: false,
        lineColor: "#94a3b8",
        lineWidth: 1,
        showSolution: false,
        solutionColor: "#16a34a",
        canvasWidth: 400,
        canvasHeight: 400,
        backgroundColor: "#ffffff",
        showPath: false,
        showBackground: true,
        pointAlpha: 20,
    };
}

// Difficulty presets
export interface DifficultyPreset {
    name: string;
    numDots: number;
    dotSize: number;
    fontSize: number;
    pointAlpha: number;
    minDistance: number;
}

export const DIFFICULTY_PRESETS: Record<string, DifficultyPreset> = {
    preschool: {
        name: "Preschool (3-5)",
        numDots: 15,
        dotSize: 12,
        fontSize: 16,
        pointAlpha: 30,
        minDistance: 40,
    },
    kindergarten: {
        name: "Kindergarten (5-7)",
        numDots: 25,
        dotSize: 10,
        fontSize: 14,
        pointAlpha: 25,
        minDistance: 35,
    },
    grade1_2: {
        name: "Grade 1-2 (7-9)",
        numDots: 40,
        dotSize: 8,
        fontSize: 12,
        pointAlpha: 20,
        minDistance: 30,
    },
    grade3_4: {
        name: "Grade 3-4 (9-11)",
        numDots: 75,
        dotSize: 6,
        fontSize: 10,
        pointAlpha: 15,
        minDistance: 25,
    },
    advanced: {
        name: "Advanced (12+)",
        numDots: 150,
        dotSize: 4,
        fontSize: 8,
        pointAlpha: 10,
        minDistance: 20,
    },
};

export function applyDifficultyPreset(config: ConnectDotsConfig, difficulty: string): ConnectDotsConfig {
    const preset = DIFFICULTY_PRESETS[difficulty];
    if (!preset) return config;
    
    return {
        ...config,
        numDots: preset.numDots,
        dotSize: preset.dotSize,
        fontSize: preset.fontSize,
        pointAlpha: preset.pointAlpha,
    };
}
