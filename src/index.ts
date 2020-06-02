import { parse, generateBoardFromCellData } from './gbb-parser';
import { unparse } from './gbb-unparser';

export * from './types';
export * from './gbb-parsing-errors';

export const GBB = {
    parse,
    unparse
};

const x = GBB.unparse({
    format: 'GBB/1.0',
    width: 3,
    height: 4,
    head: [0, 1],
    board: generateBoardFromCellData(3, 4, [
        { at: [0, 0], with: { a: 0, n: 2, r: 1, v: 3 } },
        { at: [1, 1], with: { a: 0, n: 0, r: 0, v: 0 } },
        { at: [2, 2], with: { a: 4, n: 2, r: 1, v: 6 } }
    ])
});
console.log(x);
