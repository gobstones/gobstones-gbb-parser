import { Board, Color } from '@gobstones/gobstones-core';
import { describe, expect, it } from '@jest/globals';

import { GBBStringifyingErrors } from '../src/index';
import { given } from 'jest-rspec-utils';
import { s } from './helpers';

describe('GBB.stringify', () => {
    given('A constructed GBB', () => {
        it('Stringifies minimal Board to GBB', () => {
            expect(s(new Board(3, 4, [0, 1]))).toBe('GBB/1.0\nsize 3 4\nhead 0 1');
        });

        it('Stringifies minimal object to GBB', () => {
            expect(s({ width: 3, height: 4, head: [0, 1] })).toBe('GBB/1.0\nsize 3 4\nhead 0 1');
        });

        it('Stringifies Board to GBB with cell info', () => {
            expect(
                s(new Board(3, 4, [0, 1], [{ x: 1, y: 1, [Color.Black]: 2, [Color.Red]: 1 }]))
            ).toBe('GBB/1.0\nsize 3 4\ncell 1 1 Negro\t2 Rojo\t1\nhead 0 1');
        });

        it('Stringifies Board to GBB with cell info with short names even if zero', () => {
            expect(
                s(new Board(3, 4, [0, 1], [{ x: 1, y: 1, [Color.Black]: 2, [Color.Red]: 1 }]), {
                    useFullColorNames: false,
                    declareColorsWithZeroStones: true
                })
            ).toBe('GBB/1.0\nsize 3 4\ncell 1 1 a\t0 n\t2 r\t1 v\t0\nhead 0 1');
        });

        it('Stringifies Board to GBB with cells all zeros', () => {
            expect(
                s(new Board(1, 1, [0, 0]), {
                    useFullColorNames: false,
                    declareColorsWithAllZeroStones: true
                })
            ).toBe('GBB/1.0\nsize 1 1\ncell 0 0 a\t0 n\t0 r\t0 v\t0\nhead 0 0');
        });

        it('Stringifies object to GBB with cell info', () => {
            expect(
                s({
                    width: 3,
                    height: 4,
                    head: [0, 1],
                    cellData: [{ x: 1, y: 1, [Color.Black]: 2, [Color.Red]: 1 }]
                })
            ).toBe('GBB/1.0\nsize 3 4\ncell 1 1 Negro\t2 Rojo\t1\nhead 0 1');
        });

        // eslint-disable-next-line max-len
        it('Stringifies Board to GBB with cell info, leaving blank on cells with all zeroes', () => {
            expect(
                s(
                    new Board(
                        3,
                        4,
                        [0, 1],
                        [
                            { x: 0, y: 0, [Color.Black]: 2, [Color.Red]: 1, [Color.Green]: 3 },
                            {
                                x: 1,
                                y: 1,
                                [Color.Blue]: 0,
                                [Color.Black]: 0,
                                [Color.Red]: 0,
                                [Color.Green]: 0
                            },
                            {
                                x: 2,
                                y: 2,
                                [Color.Blue]: 4,
                                [Color.Black]: 2,
                                [Color.Red]: 1,
                                [Color.Green]: 6
                            }
                        ]
                    )
                )
            ).toBe(
                'GBB/1.0\nsize 3 4\ncell 0 0 Negro\t2 Rojo\t1 Verde\t3\n' +
                    'cell 2 2 Azul\t4 Negro\t2 Rojo\t1 Verde\t6\nhead 0 1'
            );
        });

        // eslint-disable-next-line max-len
        it('Stringifies object to GBB with cell info, leaving blank on cells with all zeroes', () => {
            expect(
                s({
                    width: 3,
                    height: 4,
                    head: [0, 1],
                    cellData: [
                        { x: 0, y: 0, [Color.Black]: 2, [Color.Red]: 1, [Color.Green]: 3 },
                        {
                            x: 1,
                            y: 1,
                            [Color.Blue]: 0,
                            [Color.Black]: 0,
                            [Color.Red]: 0,
                            [Color.Green]: 0
                        },
                        {
                            x: 2,
                            y: 2,
                            [Color.Blue]: 4,
                            [Color.Black]: 2,
                            [Color.Red]: 1,
                            [Color.Green]: 6
                        }
                    ]
                })
            ).toBe(
                'GBB/1.0\nsize 3 4\ncell 0 0 Negro\t2 Rojo\t1 Verde\t3\n' +
                    'cell 2 2 Azul\t4 Negro\t2 Rojo\t1 Verde\t6\nhead 0 1'
            );
        });
    });

    given('An object', () => {
        it('Throws InvalidCellDefinition when x or y not in range', () => {
            expect(() =>
                s({
                    width: 2,
                    height: 2,
                    head: [1, 0],
                    cellData: [{ x: -1, y: 0, [Color.Red]: 2 }]
                })
            ).toThrow(GBBStringifyingErrors.InvalidBoardDataDefinition);

            expect(() =>
                s({
                    width: 2,
                    height: 2,
                    head: [1, 0],
                    cellData: [{ x: 0, y: -1, [Color.Red]: 2 }]
                })
            ).toThrow(GBBStringifyingErrors.InvalidBoardDataDefinition);

            expect(() =>
                s({ width: 2, height: 2, head: [1, 0], cellData: [{ x: 2, y: 0, [Color.Red]: 2 }] })
            ).toThrow(GBBStringifyingErrors.InvalidBoardDataDefinition);

            expect(() =>
                s({ width: 2, height: 2, head: [1, 0], cellData: [{ x: 0, y: 2, [Color.Red]: 2 }] })
            ).toThrow(GBBStringifyingErrors.InvalidBoardDataDefinition);
        });

        // eslint-disable-next-line max-len
        it('Throws InvalidCellDefinition when additional keys are added to cell definitions', () => {
            expect(() =>
                s({ width: 2, height: 2, head: [1, 0], cellData: [{ x: 0, y: 0, w: 2 }] })
            ).toThrow(GBBStringifyingErrors.InvalidCellDefinition);
        });
    });
});
