import { Board, Color } from '@gobstones/gobstones-core';
import { describe, expect, it } from '@jest/globals';
import { given, p } from './helpers';

import { GBBParsingErrors } from '../src/index';

describe('GBB.parse', () => {
    given('a valid grammar', () => {
        it('Parses minimal GBB with format size and head', () => {
            expect(p('GBB/1.0 size 3 4 head 0 1')).toEqual(new Board(3, 4, [0, 1]));
        });

        it('Parses if cell info for one cell if using short color names', () => {
            expect(p('GBB/1.0 size 3 4 cell 1 1 a 4 n 3 head 0 1')).toEqual(
                new Board(3, 4, [0, 1], [{ x: 1, y: 1, [Color.Blue]: 4, [Color.Black]: 3 }])
            );
        });

        it('Parses cell info for one cell if using full color names', () => {
            expect(p('GBB/1.0 size 3 4 cell 1 1 Azul 4 Negro 3 head 0 1')).toEqual(
                new Board(3, 4, [0, 1], [{ x: 1, y: 1, [Color.Blue]: 4, [Color.Black]: 3 }])
            );
        });

        it('Parses with multiple cells and head definition at end', () => {
            expect(
                p('GBB/1.0 size 3 4 cell 1 1 a 4 n 3 cell 1 2 Rojo 4 Negro 3  head 0 1')
            ).toEqual(
                new Board(
                    3,
                    4,
                    [0, 1],
                    [
                        { x: 1, y: 1, [Color.Blue]: 4, [Color.Black]: 3 },
                        { x: 1, y: 2, [Color.Black]: 3, [Color.Red]: 4 }
                    ]
                )
            );
        });

        it('Parses with multiple cells and no head definition', () => {
            expect(p('GBB/1.0 size 3 4 cell 1 1 a 4 n 3 cell 1 2 Rojo 4 Verde 3')).toEqual(
                new Board(
                    3,
                    4,
                    [0, 0],
                    [
                        { x: 1, y: 1, [Color.Blue]: 4, [Color.Black]: 3 },
                        { x: 1, y: 2, [Color.Green]: 3, [Color.Red]: 4 }
                    ]
                )
            );
        });

        it('Parses with no cells and no head', () => {
            expect(p('GBB/1.0 size 3 4')).toEqual(new Board(3, 4));
        });
    });

    given('an invalid grammar', () => {
        it('Throws InvalidSizeDefinition if any of height or width is 0', () => {
            expect(() => p('GBB/1.0 size 0 0 head 0 1')).toThrow(
                GBBParsingErrors.InvalidSizeDefinition as any
            );
            expect(() => p('GBB/1.0 size 0 5 head 0 1')).toThrow(
                GBBParsingErrors.InvalidSizeDefinition as any
            );
            expect(() => p('GBB/1.0 size 3 0 head 0 1')).toThrow(
                GBBParsingErrors.InvalidSizeDefinition as any
            );
        });

        it('Throws HeadBoundaryExceeded if head position exceeds board limits', () => {
            expect(() => p('GBB/1.0 size 3 3 head 3 1')).toThrow(
                GBBParsingErrors.HeadBoundaryExceeded as any
            );
            expect(() => p('GBB/1.0 size 3 3 head 1 3')).toThrow(
                GBBParsingErrors.HeadBoundaryExceeded as any
            );
            expect(() => p('GBB/1.0 size 3 3 head 3 3')).toThrow(
                GBBParsingErrors.HeadBoundaryExceeded as any
            );
        });

        it('Throws CellBoundaryExceeded if head position exceeds board limits', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 3 1 a 1 head 1 1')).toThrow(
                GBBParsingErrors.CellBoundaryExceeded as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 1 3 a 1 head 1 1')).toThrow(
                GBBParsingErrors.CellBoundaryExceeded as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 3 3 a 1 head 1 1')).toThrow(
                GBBParsingErrors.CellBoundaryExceeded as any
            );
        });

        // eslint-disable-next-line max-len
        it('Throws DuplicatedColorDefinition if a key for a given stone is defined twice for the same cell', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 1 1 a 1 a 3 head 1 1')).toThrow(
                GBBParsingErrors.DuplicatedColorDefinition as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 2 2 a 1 r 4 a 6 head 1 1')).toThrow(
                GBBParsingErrors.DuplicatedColorDefinition as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 0 a 1 n 3 n 4 head 1 1')).toThrow(
                GBBParsingErrors.DuplicatedColorDefinition as any
            );
        });

        it('Throws DuplicatedCellDefinition if a cell is defined twice', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 0 0 a 1 cell 0 0 n 1 head 1 1')).toThrow(
                GBBParsingErrors.DuplicatedCellDefinition as any
            );
            expect(() =>
                p('GBB/1.0 size 3 3 cell 2 1 a 1 cell 1 2 n 1 cell 2 1 a 1 head 1 1')
            ).toThrow(GBBParsingErrors.DuplicatedCellDefinition as any);
        });

        it('Throws UnexpectedToken if format is missing', () => {
            expect(() => p('size 3 3 cell 0 0 a 1 cell 0 1 n 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Throws UnexpectedToken if missing size info', () => {
            expect(() => p('GBB/1.0 cell 0 0 a 1 cell 0 1 n 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Throws UnexpectedToken if missing any number in size', () => {
            expect(() => p('GBB/1.0 size 3 cell 0 0 a 1 cell 0 1 n 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size cell 0 0 a 1 cell 0 1 n 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Throws UnexpectedEOF if string is blank', () => {
            expect(() => p('')).toThrow(GBBParsingErrors.UnexpectedEOF);
        });

        it('Throws UnexpectedEOF if only the format is specified', () => {
            expect(() => p('GBB/1.0')).toThrow(GBBParsingErrors.UnexpectedEOF);
        });

        it('Tthrows UnexpectedEOF if missing any number in head', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 0 0 a 1 cell 0 1 n 1 head 1')).toThrow(
                GBBParsingErrors.UnexpectedEOF as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 0 a 1 cell 0 1 n 1 head')).toThrow(
                GBBParsingErrors.UnexpectedEOF as any
            );
        });

        it('Throws UnexpectedToken if missing any number in a cell definition', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 0 a 1 cell 0 1 n 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell a 1 cell 0 1 n 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        // eslint-disable-next-line max-len
        it('Throws UnexpectedToken if missing at least one stone amount in a cell definition', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Throws UnexpectedToken if missing amount for a color definition', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Throws UnexpectedToken if missing space between definitions', () => {
            expect(() => p('GBB/1.0size 3 3 cell 0 1 a 4 n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size3 3 cell 0 1 a 4 n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3cell 0 1 a 4 n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell0 1 a 4 n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1a 4 n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a4 n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4n 3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4 n3 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4 n 3head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4n 3 head1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Throws UnexpectedToken when whitespaces at begining of file', () => {
            expect(() => p('  GBB/1.0 size 3 3 cell 0 1 a 4 head 1 1     ')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('    GBB/1.0 size 3 3 cell 0 1 a 4 head 1 1     ')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });

        it('Does not throw when whitespaces at end of file', () => {
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4 head 1 1     ')).not.toThrow();
        });

        it('Does not throw when spaces and tabs are used interchangeably', () => {
            expect(() => p('GBB/1.0\tsize\t3\t3\tcell\t0\t1\ta\t4\thead\t1\t1\t\t')).not.toThrow();
        });

        it('Does not throw when newlines in each main definition', () => {
            expect(() => p('GBB/1.0\nsize 3 3\ncell 0 1 a 4\nhead 1 1')).not.toThrow();
            expect(() => p('GBB/1.0\n\t\nsize 3 3\n\tcell 0 1 a 4\n\t head 1 1')).not.toThrow();
        });

        it('Throws UnexpectedToken if newlines in the middle of a specific definition', () => {
            expect(() => p('GBB/1.0 size\n3 3 cell 0 1 a 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3\n3 cell 0 1 a 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell\n0 1 a 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0\n1 a 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1\na 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a\n4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4 head\n1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 s\nize 3 3 cell 0 1 a 4 head 1\n1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 ce\nll 0 1 a 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/1.0 size 3 3 cell 0 1 a 4 he\nad 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
            expect(() => p('GBB/\n1.0 size 3 3 cell 0 1 a 4 head 1 1')).toThrow(
                GBBParsingErrors.UnexpectedToken as any
            );
        });
    });
});
