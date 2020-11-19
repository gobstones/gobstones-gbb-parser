import { intl } from '../translations';
import { Board, CellInfo } from '../models';
import { GBBStringifyingErrors } from './errors';
import {
    GBBStringifyingOptions,
    defaultGBBStringifyingOptions,
    stringFromSeparator,
    getColorNameFor
} from './models';

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
    const fullOptions = Object.assign(
        {},
        defaultGBBStringifyingOptions,
        options
    ) as GBBStringifyingOptions;
    intl.setLanguage(fullOptions.language);
    return stringifyBoardWith(board, fullOptions);
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
const stringifyBoardWith = (
    board: Board,
    options: GBBStringifyingOptions = defaultGBBStringifyingOptions
): string => {
    ensureOrFail(
        board.width > 0,
        new GBBStringifyingErrors.InvalidSizeDefinition('width', board.width)
    );
    ensureOrFail(
        board.height > 0,
        new GBBStringifyingErrors.InvalidSizeDefinition('height', board.height)
    );
    ensureOrFail(
        board.head[0] >= 0 && board.head[0] < board.width,
        new GBBStringifyingErrors.HeadBoundaryExceeded(
            'xCoordinate',
            board.head[0],
            0,
            board.width
        )
    );
    ensureOrFail(
        board.head[1] >= 0 && board.head[1] < board.height,
        new GBBStringifyingErrors.HeadBoundaryExceeded(
            'yCoordinate',
            board.head[1],
            0,
            board.height
        )
    );
    ensureOrFail(
        board.board.length === board.width,
        new GBBStringifyingErrors.InvalidBoardDefinition(board.board.length, board.width)
    );

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

    const gbbCells = [];

    for (let i = 0; i < board.board.length; i++) {
        const column = board.board[i];
        ensureOrFail(
            column.length === board.height,
            new GBBStringifyingErrors.InvalidBoardDefinition(column.length, board.height, i)
        );

        for (let j = 0; j < column.length; j++) {
            const cell = column[j];
            ensureOrFail(
                Object.prototype.hasOwnProperty.call(cell, 'a'),
                new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'a')
            );
            ensureOrFail(
                Object.prototype.hasOwnProperty.call(cell, 'n'),
                new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'n')
            );
            ensureOrFail(
                Object.prototype.hasOwnProperty.call(cell, 'r'),
                new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'r')
            );
            ensureOrFail(
                Object.prototype.hasOwnProperty.call(cell, 'v'),
                new GBBStringifyingErrors.InvalidCellDefinition(i, j, 'v')
            );
            ensureOrFail(
                Object.keys(cell).length === 4,
                new GBBStringifyingErrors.InvalidCellDefinition(i, j)
            );

            const colorInfo = getColorInfo(cell, options);
            if (colorInfo !== '') {
                gbbCells.push(
                    `cell${separatorKeywordToCoordinates}${i}` +
                        `${separatorBetweenCoordinates}${j}` +
                        `${separatorBetweenCoordinates}${colorInfo}`
                );
            }
        }
    }
    return gbbCells;
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
const getColorInfo = (cell: CellInfo, options: GBBStringifyingOptions): string => {
    const separatorColorKeyToNumber = stringFromSeparator(options.separators.colorKeyToNumber);
    const separatorBetweenColors = stringFromSeparator(options.separators.betweenColors);

    const colorKeySum = cell['a'] + cell['n'] + cell['r'] + cell['v'];

    const getColorInfoString = (colorKey: string): string =>
        !(
            cell[colorKey] !== 0 ||
            (options.declareColorsWithZeroStones && colorKeySum > 0) ||
            (options.declareColorsWithAllZeroStones && colorKeySum === 0)
        )
            ? ''
            : `${getColorNameFor(colorKey, options.useFullColorNames)}${separatorColorKeyToNumber}${
                  cell[colorKey]
              }`;

    return [
        getColorInfoString('a'),
        getColorInfoString('n'),
        getColorInfoString('r'),
        getColorInfoString('v')
    ]
        .join(separatorBetweenColors)
        .trim();
};

/**
 * Simple validation utility function to throw an error in case the condition is not met
 */
const ensureOrFail = (
    condition: boolean,
    error: GBBStringifyingErrors.GBBStringifyingError
): void => {
    if (!condition) {
        throw error;
    }
};
