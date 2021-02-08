import { Board, CellDataDefinition, Color, expect } from '@gobstones/gobstones-core';
import {
    GBBParsingOptions,
    ParsedBoardCell,
    ParsedBoardInfo,
    defaultGBBParsingOptions
} from './models';
import { Grammar, Parser } from 'nearley';

import { GBBParsingErrors } from './errors';
import { grammar } from '../grammar';
import { intl } from '../translations';

export const parse = (data: string, options?: Partial<GBBParsingOptions>): Board => {
    const fullOptions = Object.assign({}, defaultGBBParsingOptions, options) as GBBParsingOptions;
    intl.setLocale(fullOptions.language);
    const parsedByNearly = readFromNearleyParser(data);
    return generateBoard(parsedByNearly);
};

/**
 * Run the input string through Nearley's generated parser to produce
 * an initial JS object that we can process to find errors or others.
 * Note that incomplete string (string that do comply with parser but
 * more input is expected) or string that have error in it will produce
 * an exception.
 *
 * @param data: A string with the GBB Board definition to parse.
 * @returns A ParsedBoardInfo
 */
const readFromNearleyParser = (data: string): ParsedBoardInfo => {
    const parser = new Parser(Grammar.fromCompiled(grammar));
    try {
        parser.feed(data);
        if (parser.results.length === 0) {
            throw new GBBParsingErrors.UnexpectedEOF();
        }
        return parser.results[0];
    } catch (e) {
        /* istanbul ignore next */
        if (e instanceof GBBParsingErrors.GBBParsingError) throw e;
        /* istanbul ignore next */
        if (e.message.startsWith('invalid syntax') || e.message.startsWith('Syntax error '))
            throw new GBBParsingErrors.UnexpectedToken(e.message);
        /* istanbul ignore next */
        throw e;
    }
};

const generateBoard = (parsedBoardInfo: ParsedBoardInfo): Board => {
    const size = getParsedSize(parsedBoardInfo);
    const head = getHeadLocation(parsedBoardInfo);
    const cells = getAllCellsData(parsedBoardInfo);
    return new Board(size.width, size.height, head, cells);
};

/**
 * Return the width and height information of the parsed board,
 * or fail if such information has logical errors.
 *
 * @params parsedBoardInfo A RAW Nearley parsed board data.
 * @returns An object with `width` and `height` values.
 * @throws `InvalidSizeDefinition` if an invalid definition for size was declared.
 */
const getParsedSize = (parsedBoardInfo: ParsedBoardInfo): { width: number; height: number } => {
    expect(parsedBoardInfo.width.value)
        .not.toBe(0)
        .orThrow(new GBBParsingErrors.InvalidSizeDefinition('width', parsedBoardInfo.width));
    expect(parsedBoardInfo.height.value)
        .not.toBe(0)
        .orThrow(new GBBParsingErrors.InvalidSizeDefinition('height', parsedBoardInfo.height));
    return {
        width: parsedBoardInfo.width.value,
        height: parsedBoardInfo.height.value
    };
};

/**
 * Return the parsed head location, if any, or undefined, if none
 * was declared, or fail if such information has logical errors.
 *
 * @params parsedBoardInfo A RAW Nearley parsed board data.
 * @returns The head's location as a two element array, or undefined.
 * @throws `HeadBoundaryExceeded` if an invalid definition for the head was declared.
 */
const getHeadLocation = (parsedBoardInfo: ParsedBoardInfo): [number, number] => {
    if (!parsedBoardInfo.head) return undefined;
    expect(parsedBoardInfo.head[0].value)
        .toBeLowerThan(parsedBoardInfo.width.value)
        .orThrow(
            new GBBParsingErrors.HeadBoundaryExceeded(
                'x-coordinate',
                parsedBoardInfo.head[0],
                'width',
                parsedBoardInfo.width
            )
        );
    expect(parsedBoardInfo.head[1].value)
        .toBeLowerThan(parsedBoardInfo.height.value)
        .orThrow(
            new GBBParsingErrors.HeadBoundaryExceeded(
                'y-coordinate',
                parsedBoardInfo.head[1],
                'height',
                parsedBoardInfo.height
            )
        );
    return [parsedBoardInfo.head[0].value, parsedBoardInfo.head[1].value];
};

/**
 * Generate a Partial Board with the board information,
 * or fail if such information has logical errors.
 *
 * @params parsedBoardInfo - A RAW Nearley parsed board data.
 * @returns a `Partial<Board>` with only the board value.
 * @throws
 *  `CellBoundaryExceeded` if any cell definition has a location that falls outside the board.\
 *  `DuplicateCellError` if any cell information is declared two or more ttimes.
 */
const getAllCellsData = (parsedBoardInfo: ParsedBoardInfo): CellDataDefinition[] => {
    const cellInfo = [];
    const alreadyDeclaredCells = {};
    for (const cell of parsedBoardInfo.cells || []) {
        const x = cell.x;
        const y = cell.y;
        const previousStateOfCurrentCell = alreadyDeclaredCells[`${x.value},${y.value}`];
        expect(x.value)
            .toBeLowerThan(parsedBoardInfo.width.value)
            .orThrow(
                new GBBParsingErrors.CellBoundaryExceeded(
                    'xCoordinate',
                    x.value,
                    y.value,
                    x.line,
                    x.col
                )
            );
        expect(y.value)
            .toBeLowerThan(parsedBoardInfo.height.value)
            .orThrow(
                new GBBParsingErrors.CellBoundaryExceeded(
                    'yCoordinate',
                    x.value,
                    y.value,
                    y.line,
                    y.col
                )
            );
        expect(previousStateOfCurrentCell)
            .toBeUndefined()
            .orThrow(
                new GBBParsingErrors.DuplicatedCellDefinition(
                    x.value,
                    y.value,
                    previousStateOfCurrentCell?.line,
                    previousStateOfCurrentCell?.col,
                    x.line,
                    x.col
                )
            );
        alreadyDeclaredCells[`${x.value},${y.value}`] = { line: x.line, col: x.col };
        cellInfo.push(getCellData(cell));
    }
    return cellInfo;
};

/**
 * Generate cell contents for a given board cell definition
 * encountered by Nearley, or failed if the definition is not
 * correct.
 *
 * @params info - A RAW Nearley parsed cell data.
 * @returns a `CellInfo` with both declared and default values.
 * @throws
 *  `DuplicateColorError` if any cell definition has a color defined more than once.
 */
const getCellData = (info: ParsedBoardCell): CellDataDefinition => {
    const cellDefinition = { x: info.x.value, y: info.y.value };
    const alreadyDeclaredColors = {};
    for (const declaration of info.declaring) {
        const previousStateOfCurrentColor = alreadyDeclaredColors[declaration.color.value];
        expect(previousStateOfCurrentColor)
            .toBeUndefined()
            .orThrow(
                new GBBParsingErrors.DuplicatedColorDefinition(
                    declaration.color.value,
                    info.x.value,
                    info.y.value,
                    previousStateOfCurrentColor?.line,
                    previousStateOfCurrentColor?.col,
                    declaration.color.line,
                    declaration.color.col
                )
            );
        alreadyDeclaredColors[declaration.color.value] = {
            line: declaration.color.line,
            col: declaration.color.col
        };
        cellDefinition[colorFor(declaration.color.value)] = declaration.value.value;
    }
    return cellDefinition;
};

const colorFor = (stringColorName: string): Color => {
    switch (stringColorName) {
        case 'a':
            return Color.Blue;
        case 'n':
            return Color.Black;
        case 'r':
            return Color.Red;
        case 'v':
            return Color.Green;
        /* istanbul ignore next */
        default:
            return undefined;
    }
};
