export interface Board {
    format: string;
    width: number;
    height: number;
    head: CellLocation;
    board: BoardInfo;
}

export type BoardInfo = CellInfo[][];

export type CellLocation = [number, number];

export interface CellInfo {
    a: number;
    n: number;
    r: number;
    v: number;
}
