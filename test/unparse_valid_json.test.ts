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

test(`Should unparse minimal object to GBB`, () => {
    expect(u({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 1],
            board: buildBoardOf(3, 4)
        })
    ).toBe(`GBB/1.0\nsize 3 4\nhead 0 1`);
});

test(`Should unparse object to GBB with cell info`, () => {
    expect(u({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 1],
            board: buildBoardOf(3, 4, [{ at: [1, 1], with: { a: 0, n: 2, r: 1, v: 0 } }])
        })
    ).toBe(`GBB/1.0\nsize 3 4\ncell 1 1 Negro\t2 Rojo\t1\nhead 0 1`);
});

test(`Should unparse object to GBB with cell info, leaving blank on cells with all zeroes`, () => {
    expect(u({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 1],
            board: buildBoardOf(3, 4, [
                { at: [0, 0], with: { a: 0, n: 2, r: 1, v: 3 } },
                { at: [1, 1], with: { a: 0, n: 0, r: 0, v: 0 } },
                { at: [2, 2], with: { a: 4, n: 2, r: 1, v: 6 } }
            ])
        })
    ).toBe(`GBB/1.0\nsize 3 4\ncell 0 0 Negro\t2 Rojo\t1 Verde\t3\n` +
        `cell 2 2 Azul\t4 Negro\t2 Rojo\t1 Verde\t6\nhead 0 1`);
});
