import { Board, Cell, Color, expect } from '@gobstones/gobstones-core';
import {
    GBBStringifyingOptions,
    defaultGBBStringifyingOptions,
    stringFromSeparator
} from './models';

import { GBBStringifyingErrors } from './errors';
import { intl } from '../translations';

/**
 * Convert the given JS Object representing a Board into a String representing a GBB board.
 *
 * @param board   - The `Board` to convert to a GBB board string.
 * @param options - The options on how to produce the final string
 * @returns A String with a GBB Board format representation of the given board.
 *
 * @throws
 *  `GBBUnparsingErrors.InvalidSizeDefinition`  -
 *      If the board has cero or negative size in any width or height.
 *  `GBBUnparsingErrors.HeadBoundaryExceeded`   -
 *      If the head position is negative or exceeds the board size in any of it's coordinates.
 *  `GBBUnparsingErrors.InvalidBoardDefinition` -
 *      If the board array has incorrect size (not matching the board defined size)
 *      in the main array or any of it's elements.
 *  `GBBUnparsingErrors.InvalidCellDefinition`  -
 *      If any cell of the board array includes more than 4 keys or is missing any of
 *      'a', 'n', 'r' or 'v' keys.
 */
export const stringify = (board: Board, options?: Partial<GBBStringifyingOptions>): string => {
    // Only for compatibility reasons should use Board directly and not custom objects
    const theBoard = convertToBoardIfSimpleJSON(board);
    const fullOptions = Object.assign(
        {},
        defaultGBBStringifyingOptions,
        options
    ) as GBBStringifyingOptions;
    intl.setLocale(fullOptions.language);
    return stringifyBoardWith(theBoard, fullOptions);
};

/**
 * Convert the given JS Object representing a Board into a String representing a GBB board.
 * This is called by stringify as an inner implementation, as stringify may present additional
 * logic in the future.
 *
 * @param board   - The `Board` to convert to a GBB board string.
 * @param options - The options on how to produce the final string
 * @returns A String with a GBB Board format representation of the given board.
 *
 * @throws
 *  `GBBUnparsingErrors.InvalidSizeDefinition`  -
 *      If the board has cero or negative size in any width or height.
 *  `GBBUnparsingErrors.HeadBoundaryExceeded`   -
 *      If the head position is negative or exceeds the board size in any of it's coordinates.
 *  `GBBUnparsingErrors.InvalidBoardDefinition` -
 *      If the board array has incorrect size (not matching the board defined size)
 *      in the main array or any of it's elements.
 *  `GBBUnparsingErrors.InvalidCellDefinition`  -
 *      If any cell of the board array includes more than 4 keys or is missing any of
 *      'a', 'n', 'r' or 'v' keys.
 */
const stringifyBoardWith = (board: Board, options: GBBStringifyingOptions): string => {
    const separatorBetweenCoordinates = stringFromSeparator(options.separators.betweenCoordinates);
    const separatorKeywordToCoordinates = stringFromSeparator(
        options.separators.keywordToCoordinates
    );
    const separatorBetweenKeywords = stringFromSeparator(options.separators.betweenKeywords);

    let gbbStrings = [`GBB/1.0`];
    gbbStrings.push(
        `size${separatorKeywordToCoordinates}${board.width}` +
            `${separatorBetweenCoordinates}${board.height}`
    );
    gbbStrings = gbbStrings.concat(getCellInfoArray(board, options));
    gbbStrings.push(
        `head${separatorKeywordToCoordinates}${board.head[0]}` +
            `${separatorBetweenCoordinates}${board.head[1]}`
    );

    return gbbStrings.join(separatorBetweenKeywords);
};

/**
 * Get the "cells" part of a GBB part format string for a given board object.
 *
 * @param board - The `Board` to convert to a GBB board string.
 * @param options - The options on how to produce the final string
 * @returns A String with the cells in GBB Board format representation of the given board.
 *
 *  `GBBUnparsingErrors.InvalidBoardDefinition` -
 *      If the board array has incorrect size (not matching the board defined size)
 *      in the main array or any of it's elements.
 *  `GBBUnparsingErrors.InvalidCellDefinition`  -
 *      If any cell of the board array includes more than 4 keys or is missing any of
 *     'a', 'n', 'r' or 'v' keys.
 */
const getCellInfoArray = (board: Board, options: GBBStringifyingOptions): string[] => {
    const separatorBetweenCoordinates = stringFromSeparator(options.separators.betweenCoordinates);
    const separatorKeywordToCoordinates = stringFromSeparator(
        options.separators.keywordToCoordinates
    );

    return board.foldCells((gbbCells: string[], cell: Cell) => {
        const colorInfo = getColorInfo(cell, options);
        if (colorInfo !== '') {
            gbbCells.push(
                `cell${separatorKeywordToCoordinates}${cell.x}` +
                    `${separatorBetweenCoordinates}${cell.y}` +
                    `${separatorBetweenCoordinates}${colorInfo}`
            );
        }
        return gbbCells;
    }, []);
};

/**
 * Obtain the string representation of a cell color information for a given cell
 * information object.
 *
 * @param cell - The `CellInfo` to convert to a string.
 * @param options - The options on how to produce the final string
 * @returns A String with a cell representation of the given cell.
 *
 */
const getColorInfo = (cell: Cell, options: GBBStringifyingOptions): string => {
    const separatorColorKeyToNumber = stringFromSeparator(options.separators.colorKeyToNumber);
    const separatorBetweenColors = stringFromSeparator(options.separators.betweenColors);

    const colorKeySum = cell.getStonesAmount();

    const getColorInfoString = (colorKey: Color): string =>
        !(
            cell.hasStonesOf(colorKey) ||
            (options.declareColorsWithZeroStones && colorKeySum > 0) ||
            (options.declareColorsWithAllZeroStones && colorKeySum === 0)
        )
            ? ''
            : `${nameForColor(
                  colorKey,
                  options.useFullColorNames
              )}${separatorColorKeyToNumber}${cell.getStonesOf(colorKey)}`;

    return [
        getColorInfoString(Color.Blue),
        getColorInfoString(Color.Black),
        getColorInfoString(Color.Red),
        getColorInfoString(Color.Green)
    ]
        .join(separatorBetweenColors)
        .trim();
};

const nameForColor = (color: Color, fullName: boolean): string => {
    switch (color) {
        case Color.Blue:
            return fullName ? 'Azul' : 'a';
        case Color.Black:
            return fullName ? 'Negro' : 'n';
        case Color.Red:
            return fullName ? 'Rojo' : 'r';
        case Color.Green:
            return fullName ? 'Verde' : 'v';
        /* istanbul ignore next */
        default:
            return undefined;
    }
};

/**
 * If the given Board is an instance of [[Board]], then the board is returned,
 * otherwise, the board is checked for consistency, and it should be an object
 * containing at least width, height, and head location. Then, it can supply
 * a list of cell data (where each element is an object containing x, y location
 * of the cell, and a set of keys that are a [[Color]] with a numeric value), like
 * @example
 * ```
 *  { x: 5, y: 3, [Color.Red]: 3 }
 * ```
 *
 * Otherwise, the old method of providing a `board` attribute with the full definition
 * for the board, is also accepted, although deprecated and discouraged.
 *
 * The preference is to always work with an instance of a board, so defining a custom
 * object is discouraged, and should be left only for the CLI prompt.
 *
 * @param board The board, or board definition.
 * @throws [GBBStringifyError] or one of it's instances, depending on the
 *      lacking or not of parts of the board in the definition, if not an instance
 *      of a board was given.
 * @returns an instance of a board
 */
const convertToBoardIfSimpleJSON = (board: any): Board => {
    let cellData: any;
    if (board.isBoard || (typeof board === 'object' && board instanceof Board)) {
        return board;
    } else {
        expect(board.width as number)
            .toBeDefined()
            .toBeGreaterThan(0)
            .orThrow(new GBBStringifyingErrors.InvalidSizeDefinition('width', board.width));
        expect(board.height as number)
            .toBeDefined()
            .toBeGreaterThan(0)
            .orThrow(new GBBStringifyingErrors.InvalidSizeDefinition('height', board.height));
        expect(board.head as number[])
            .toBeDefined()
            .toHaveType('array')
            .toHaveLength(2)
            .orThrow(new GBBStringifyingErrors.InvalidHeadDefinition());
        expect(board.head[0] as number)
            .toBeGreaterThanOrEqual(0)
            .toBeLowerThan(board.width)
            .orThrow(
                new GBBStringifyingErrors.HeadBoundaryExceeded(
                    'xCoordinate',
                    board.head[0],
                    0,
                    board.width
                )
            );
        expect(board.head[1] as number)
            .toBeGreaterThanOrEqual(0)
            .toBeLowerThan(board.height)
            .orThrow(
                new GBBStringifyingErrors.HeadBoundaryExceeded(
                    'yCoordinate',
                    board.head[1],
                    0,
                    board.height
                )
            );
        // New mode of defining
        if (board.cellData) {
            expect(board.cellData as any[])
                .toHaveType('array')
                .orThrow(new GBBStringifyingErrors.InvalidBoardDataDefinition());
            (board.cellData as any[]).forEach((cell) => {
                expect(cell)
                    .toHaveType('object')
                    .toHaveNoOtherThan(['a', 'n', 'r', 'v', 'x', 'y'])
                    .orThrow(new GBBStringifyingErrors.InvalidCellDefinition(cell.x, cell.y));
                expect(cell)
                    .toHaveType('object')
                    .toHaveProperty('x')
                    .toHaveProperty('y')
                    .orThrow(new GBBStringifyingErrors.InvalidBoardDataDefinition());
                expect(cell.x as number)
                    .toHaveType('number')
                    .toBeGreaterThanOrEqual(0)
                    .toBeLowerThan(board.width)
                    .orThrow(new GBBStringifyingErrors.InvalidBoardDataDefinition());
                expect(cell.y as number)
                    .toHaveType('number')
                    .toBeGreaterThanOrEqual(0)
                    .toBeLowerThan(board.height)
                    .orThrow(new GBBStringifyingErrors.InvalidBoardDataDefinition());
                expect(cell)
                    .toHaveNoOtherThan([
                        'x',
                        'y',
                        [Color.Blue].toString(),
                        [Color.Black].toString(),
                        [Color.Red].toString(),
                        [Color.Green].toString()
                    ])
                    .orThrow(
                        new GBBStringifyingErrors.InvalidCellDefinition(cell.x, cell.y, 'added')
                    );
            });
            cellData = board.cellData;
        }
        // Board
        /* istanbul ignore next */
        if (board.board) {
            cellData = [];
            expect(board.board as any[][])
                .toHaveType('array')
                .toHaveLength(board.width)
                .orThrow(
                    new GBBStringifyingErrors.InvalidBoardDefinition(
                        board.board.length,
                        board.width
                    )
                );
            (board.board as any[][]).forEach((column, i) => {
                expect(column)
                    .toHaveType('array')
                    .toHaveLength(board.height)
                    .orThrow(
                        new GBBStringifyingErrors.InvalidBoardDefinition(
                            column.length,
                            board.height,
                            i
                        )
                    );
                column.forEach((cell, j) => {
                    expect(cell)
                        .toHaveType('object')
                        .toHaveNoOtherThan(['a', 'n', 'r', 'v', 'x', 'y'])
                        .orThrow(new GBBStringifyingErrors.InvalidCellDefinition(i, j));
                    expect(cell)
                        .toHaveProperty('a')
                        .orThrow(new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'a'));
                    expect(cell)
                        .toHaveProperty('n')
                        .orThrow(new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'n'));
                    expect(cell)
                        .toHaveProperty('r')
                        .orThrow(new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'r'));
                    expect(cell)
                        .toHaveProperty('v')
                        .orThrow(new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'v'));
                    cellData.push({
                        x: i,
                        y: j,
                        [Color.Blue]: cell['a'],
                        [Color.Blue]: cell['n'],
                        [Color.Red]: cell['r'],
                        [Color.Green]: cell['v']
                    });
                });
            });
        }
    }
    return new Board(board.width, board.height, board.head, cellData);
};
