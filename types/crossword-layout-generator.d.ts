declare module "crossword-layout-generator" {
    export interface LayoutResult {
        result: Array<{
            clue: string;
            answer: string;
            startx: number;
            starty: number;
            position: number;
            orientation: "across" | "down" | "none";
        }>;
        rows: number;
        cols: number;
        table: string[][];
        table_string: string;
    }

    export function generateLayout(input: Array<{ clue?: string; answer: string }>): LayoutResult;
}
