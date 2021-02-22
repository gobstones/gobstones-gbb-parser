import { GBB, GBBStringifyingOptions } from '../src/index';

import { Board } from '@gobstones/gobstones-core';
import { GBBParsingOptions } from '../src/parser';
import { Token } from '../src/grammar';
import { describe } from '@jest/globals';

export const given = describe;
export const t = (str: string): Token[] => GBB.tokenize(str);
export const p = (str: string, options?: Partial<GBBParsingOptions>): Board =>
    GBB.parse(str, options);
export const s = (board: Board | any, options?: Partial<GBBStringifyingOptions>): string =>
    GBB.stringify(board, options);

/*
const emptyCell = () => {
    return { a: 0, n: 0, r: 0, v: 0 };
};
*/
/*
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
*/
