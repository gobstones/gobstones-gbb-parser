import { GBB, Board, CellLocation, BoardInfo, CellInfo } from '../src/index';

export const p = (str: string) => () => GBB.parse(str);
export const u = (board: Board) => GBB.unparse(board);

const emptyCell = () => {
    return { a: 0, n: 0, r: 0, v: 0 };
};

export const buildBoardOf = (
    width: number,
    height: number,
    cells?: Array<{ at: CellLocation; with: CellInfo }>
): BoardInfo => {
    const board = [];
    for (let i = 0; i < width; i++) {
        board[i] = [];
        for (let j = 0; j < height; j++) {
            board[i][j] = emptyCell();
        }
    }
    for (let cell of cells || []) {
        board[cell.at[0]][cell.at[1]] = Object.assign(emptyCell(), cell.with);
    }
    return board;
};
