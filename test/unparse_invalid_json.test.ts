import { test, expect } from '@jest/globals';

import { GBB, CellLocation, BoardInfo, CellInfo, Board } from '../src/index';

const u = (board: Board) => GBB.unparse(board);

const emptyCell = () => {
    return { a: 0, n: 0, r: 0, v: 0 };
};
const buildBoardOf = (
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

test.todo('We should write tests here');
