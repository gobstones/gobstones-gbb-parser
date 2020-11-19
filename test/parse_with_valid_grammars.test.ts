import { describe, test, expect } from '@jest/globals';
import { p, buildBoardOf } from './helpers';

describe(`Parse with valid grammars`, () => {
    test(`Should parse minimal GBB with format size and head`, () => {
        expect(p(`GBB/1.0 size 3 4 head 0 1`)()).toEqual({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 1],
            board: buildBoardOf(3, 4)
        });
    });

    test(`Should parse if cell info for one cell if using short color names`, () => {
        expect(p(`GBB/1.0 size 3 4 cell 1 1 a 4 n 3 head 0 1`)()).toEqual({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 1],
            board: buildBoardOf(3, 4, [{ at: [1, 1], with: { a: 4, n: 3, r: 0, v: 0 } }])
        });
    });

    test(`Should parse for cell info for one cell if using full color names`, () => {
        expect(p(`GBB/1.0 size 3 4 cell 1 1 Azul 4 Negro 3 head 0 1`)()).toEqual({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 1],
            board: buildBoardOf(3, 4, [{ at: [1, 1], with: { a: 4, n: 3, r: 0, v: 0 } }])
        });
    });

    test(`Should parse with multiple cells and head definition at end`, () => {
        expect(p(`GBB/1.0 size 3 4 cell 1 1 a 4 n 3 cell 1 2 Rojo 4 Negro 3  head 0 1`)()).toEqual({
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

    test(`Should parse with multiple cells and no head definition`, () => {
        expect(p(`GBB/1.0 size 3 4 cell 1 1 a 4 n 3 cell 1 2 Rojo 4 Negro 3`)()).toEqual({
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

    test(`Should parse with no cells and no head`, () => {
        expect(p(`GBB/1.0 size 3 4`)()).toEqual({
            format: 'GBB/1.0',
            width: 3,
            height: 4,
            head: [0, 0],
            board: buildBoardOf(3, 4)
        });
    });
});
