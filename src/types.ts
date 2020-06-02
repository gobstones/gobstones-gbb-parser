export interface CellInfo {
    a: number;
    n: number;
    r: number;
    v: number;
}
export type CellLocation = [number, number];
export type BoardInfo = CellInfo[][];
export interface Board {
    format: string;
    width: number;
    height: number;
    head: CellLocation;
    board: BoardInfo;
}
