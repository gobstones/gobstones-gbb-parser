import { test, expect } from '@jest/globals';

import { GBB, CellLocation, BoardInfo, CellInfo } from '../src/index';

const p = (str: string) => GBB.parse(str);

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

test(`Should parse minimal GBB with format size and head`, () => {
    expect(p(`GBB/1.0 size 3 4 head 0 1`)).toEqual({
        format: 'GBB/1.0',
        width: 3,
        height: 4,
        head: [0, 1],
        board: buildBoardOf(3, 4)
    });
});

test(`Should parse if cell info for one cell if using short color names`, () => {
    expect(p(`GBB/1.0 size 3 4 cell 1 1 a 4 n 3 head 0 1`)).toEqual({
        format: 'GBB/1.0',
        width: 3,
        height: 4,
        head: [0, 1],
        board: buildBoardOf(3, 4, [{ at: [1, 1], with: { a: 4, n: 3, r: 0, v: 0 } }])
    });
});

test(`Should parse for cell info for one cell if using full color names`, () => {
    expect(p(`GBB/1.0 size 3 4 cell 1 1 Azul 4 Negro 3 head 0 1`)).toEqual({
        format: 'GBB/1.0',
        width: 3,
        height: 4,
        head: [0, 1],
        board: buildBoardOf(3, 4, [{ at: [1, 1], with: { a: 4, n: 3, r: 0, v: 0 } }])
    });
});

test(`Should parse with multiple cells`, () => {
    expect(p(`GBB/1.0 size 3 4 cell 1 1 a 4 n 3 cell 1 2 Rojo 4 Negro 3  head 0 1`)).toEqual({
        format: 'GBB/1.0',
        width: 3,
        height: 4,
        head: [0, 1],
        board: buildBoardOf(3, 4, [
            { at: [1, 1], with: { a: 4, n: 3, r: 0, v: 0 } },
            { at: [1, 2], with: { a: 0, n: 3, r: 4, v: 0 } }
        ])
    });
});

test(`Should parse with multiple cells`, () => {
    expect(p(`GBB/1.0 size 3 4 cell 1 1 a 4 n 3 cell 1 2 Rojo 4 Negro 3`)).toEqual({
        format: 'GBB/1.0',
        width: 3,
        height: 4,
        head: [0, 0],
        board: buildBoardOf(3, 4, [
            { at: [1, 1], with: { a: 4, n: 3, r: 0, v: 0 } },
            { at: [1, 2], with: { a: 0, n: 3, r: 4, v: 0 } }
        ])
    });
});

test(`Should parse with multiple cells`, () => {
    expect(p(`GBB/1.0 size 3 4`)).toEqual({
        format: 'GBB/1.0',
        width: 3,
        height: 4,
        head: [0, 0],
        board: buildBoardOf(3, 4)
    });
});
