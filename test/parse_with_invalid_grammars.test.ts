import { test, expect } from '@jest/globals';

import {
    GBB,
    InvalidSizeDefinition,
    HeadBoundaryExceeded,
    CellBoundaryExceeded,
    DuplicateColorError,
    DuplicateCellError,
    UnexpectedTokenError,
    UnexpectedEOFError
} from '../src/index';

const p = (str: string) => () => GBB.parse(str);

test(`Should throw InvalidSizeDefinition if any of height or width is 0`, () => {
    expect(p(`GBB/1.0 size 0 0 head 0 1`)).toThrow(InvalidSizeDefinition);
    expect(p(`GBB/1.0 size 0 5 head 0 1`)).toThrow(InvalidSizeDefinition);
    expect(p(`GBB/1.0 size 3 0 head 0 1`)).toThrow(InvalidSizeDefinition);
});

test(`Should throw HeadBoundaryExceeded if head position exceeds board limits`, () => {
    expect(p(`GBB/1.0 size 3 3 head 3 1`)).toThrow(HeadBoundaryExceeded);
    expect(p(`GBB/1.0 size 3 3 head 1 3`)).toThrow(HeadBoundaryExceeded);
    expect(p(`GBB/1.0 size 3 3 head 3 3`)).toThrow(HeadBoundaryExceeded);
});

test(`Should throw CellBoundaryExceeded if head position exceeds board limits`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 3 1 a 1 head 1 1`)).toThrow(CellBoundaryExceeded);
    expect(p(`GBB/1.0 size 3 3 cell 1 3 a 1 head 1 1`)).toThrow(CellBoundaryExceeded);
    expect(p(`GBB/1.0 size 3 3 cell 3 3 a 1 head 1 1`)).toThrow(CellBoundaryExceeded);
});

test(`Should throw DuplicateColorError if a key for a given stone is defined twice for the same cell`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 1 1 a 1 a 3 head 1 1`)).toThrow(DuplicateColorError);
    expect(p(`GBB/1.0 size 3 3 cell 2 2 a 1 r 4 a 6 head 1 1`)).toThrow(DuplicateColorError);
    expect(p(`GBB/1.0 size 3 3 cell 0 0 a 1 n 3 n 4 head 1 1`)).toThrow(DuplicateColorError);
});

test(`Should throw DuplicateCellError if a cell is defined twice`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 0 0 a 1 cell 0 0 n 1 head 1 1`)).toThrow(DuplicateCellError);
    expect(p(`GBB/1.0 size 3 3 cell 2 1 a 1 cell 1 2 n 1 cell 2 1 a 1 head 1 1`)).toThrow(
        DuplicateCellError
    );
});

test(`Should throw UnexpectedTokenError if format is missing`, () => {
    expect(p(`size 3 3 cell 0 0 a 1 cell 0 1 n 1 head 1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should throw UnexpectedTokenError if missing size info`, () => {
    expect(p(`GBB/1.0 cell 0 0 a 1 cell 0 1 n 1 head 1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should throw UnexpectedTokenError if missing any number in size`, () => {
    expect(p(`GBB/1.0 size 3 cell 0 0 a 1 cell 0 1 n 1 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size cell 0 0 a 1 cell 0 1 n 1 head 1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should throw UnexpectedEOFError if string is blank`, () => {
    expect(p(``)).toThrow(UnexpectedEOFError);
});

test(`Should throw UnexpectedEOFError if only the format is specified`, () => {
    expect(p(`GBB/1.0`)).toThrow(UnexpectedEOFError);
});

test(`Should throw UnexpectedEOFError if missing any number in head`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 0 0 a 1 cell 0 1 n 1 head 1`)).toThrow(UnexpectedEOFError);
    expect(p(`GBB/1.0 size 3 3 cell 0 0 a 1 cell 0 1 n 1 head`)).toThrow(UnexpectedEOFError);
});

test(`Should throw UnexpectedTokenError if missing any number in a cell definition`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 0 a 1 cell 0 1 n 1 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell a 1 cell 0 1 n 1 head 1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should throw UnexpectedTokenError if missing at least one stone amount in a cell definition`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 0 1 head 1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should throw UnexpectedTokenError if missing amount for a color definition`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a head 1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should throw UnexpectedTokenError if missing space between definitions`, () => {
    expect(p(`GBB/1.0size 3 3 cell 0 1 a 4 n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size3 3 cell 0 1 a 4 n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3cell 0 1 a 4 n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell0 1 a 4 n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1a 4 n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a4 n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4n 3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4 n3 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4 n 3head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4n 3 head1 1`)).toThrow(UnexpectedTokenError);
});

test(`Should NOT ignore whitespaces at begining of file`, () => {
    expect(p(`  GBB/1.0 size 3 3 cell 0 1 a 4 head 1 1     `)).toThrow(UnexpectedTokenError);
    expect(p(`    GBB/1.0 size 3 3 cell 0 1 a 4 head 1 1     `)).toThrow(UnexpectedTokenError);
});

test(`Should ignore whitespaces at end of file`, () => {
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4 head 1 1     `)).not.toThrow();
});

test(`Should use spaces and tabs interchangeably`, () => {
    expect(p(`GBB/1.0\tsize\t3\t3\tcell\t0\t1\ta\t4\thead\t1\t1\t\t`)).not.toThrow();
});

test(`Should allow newlines in each main definition`, () => {
    expect(p(`GBB/1.0\nsize 3 3\ncell 0 1 a 4\nhead 1 1`)).not.toThrow();
    expect(p(`GBB/1.0\n\t\nsize 3 3\n\tcell 0 1 a 4\n\t head 1 1`)).not.toThrow();
});

test(`Should NOT allow newlines in the middle of a specific definition`, () => {
    expect(p(`GBB/1.0 size\n3 3 cell 0 1 a 4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3\n3 cell 0 1 a 4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell\n0 1 a 4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0\n1 a 4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1\na 4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a\n4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4 head\n1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 s\nize 3 3 cell 0 1 a 4 head 1\n1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 ce\nll 0 1 a 4 head 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/1.0 size 3 3 cell 0 1 a 4 he\nad 1 1`)).toThrow(UnexpectedTokenError);
    expect(p(`GBB/\n1.0 size 3 3 cell 0 1 a 4 head 1 1`)).toThrow(UnexpectedTokenError);
});
