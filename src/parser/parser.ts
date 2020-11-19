import { Parser, Grammar } from 'nearley';
import { grammar } from '../grammar';
import { makeMatrix } from '../helpers';
import { intl } from '../translations';
import { defaultHeadDefinition, defaultCellDefinition } from '../defaults';
import { Board, CellInfo } from '../models';
import { GBBParsingErrors } from './errors';
import {
    ParsedBoardInfo,
    ParsedBoardCell,
    GBBParsingOptions,
    defaultGBBParsingOptions
} from './models';

export const parse = (data: string, options?: Partial<GBBParsingOptions>): Board => {
    const fullOptions = Object.assign({}, defaultGBBParsingOptions, options) as GBBParsingOptions;
    intl.setLanguage(fullOptions.language);
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
        if (e instanceof GBBParsingErrors.GBBParsingError) throw e;
        if (e.message.startsWith('invalid syntax') || e.message.startsWith('Syntax error '))
            throw new GBBParsingErrors.UnexpectedToken(e.message);
        throw e;
    }
};

const generateBoard = (parsedBoardInfo: ParsedBoardInfo): Board =>
    Object.assign(
        {},
        generateFormat(parsedBoardInfo),
        generateSize(parsedBoardInfo),
        generateHead(parsedBoardInfo),
        generateCells(parsedBoardInfo)
    ) as Board;

/**
 * Generate a Partial Board with the format information.
 *
 * @params parsedBoardInfo - A RAW Nearley parsed board data.
 * @returns a `Partial<Board>` with only the `format` value.
 */
const generateFormat = (parsedBoardInfo: ParsedBoardInfo): Partial<Board> =>
    // Format may be validated if needed, although now it's built into the language and
    // different formats than GBB/1.0 are classified as UnexpectedTokenError.
    ({
        format: parsedBoardInfo.format.value
    });

/**
 * Generate a Partial Board with the width and height information,
 * or fail if such information has logical errors.
 *
 * @params parsedBoardInfo - A RAW Nearley parsed board data.
 * @returns a `Partial<Board>` with only the `width` and `height`values.
 * @throws `InvalidSizeDefinition` if an invalid definition for size was declared.
 */
const generateSize = (parsedBoardInfo: ParsedBoardInfo): Partial<Board> => {
    ensureOrFail(
        parsedBoardInfo.width.value !== 0,
        new GBBParsingErrors.InvalidSizeDefinition('width', parsedBoardInfo.width)
    );
    ensureOrFail(
        parsedBoardInfo.height.value !== 0,
        new GBBParsingErrors.InvalidSizeDefinition('height', parsedBoardInfo.height)
    );

    return {
        width: parsedBoardInfo.width.value,
        height: parsedBoardInfo.height.value
    };
};

/**
 * Generate a Partial Board with the head information,
 * or fail if such information has logical errors.
 *
 * @params parsedBoardInfo - A RAW Nearley parsed board data.
 * @returns a `Partial<Board>` with only the `head` value.
 * @throws `HeadBoundaryExceeded` if an invalid definition for the head was declared.
 */
const generateHead = (parsedBoardInfo: ParsedBoardInfo): Partial<Board> => {
    if (!parsedBoardInfo.head) return { head: defaultHeadDefinition() };

    ensureOrFail(
        parsedBoardInfo.head[0].value < parsedBoardInfo.width.value,
        new GBBParsingErrors.HeadBoundaryExceeded(
            'x-coordinate',
            parsedBoardInfo.head[0],
            'width',
            parsedBoardInfo.width
        )
    );
    ensureOrFail(
        parsedBoardInfo.head[1].value < parsedBoardInfo.height.value,
        new GBBParsingErrors.HeadBoundaryExceeded(
            'y-coordinate',
            parsedBoardInfo.head[1],
            'height',
            parsedBoardInfo.height
        )
    );

    return {
        head: [parsedBoardInfo.head[0].value, parsedBoardInfo.head[1].value]
    };
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
const generateCells = (parsedBoardInfo: ParsedBoardInfo): Partial<Board> => {
    const generatedBoard = makeMatrix(
        parsedBoardInfo.width.value,
        parsedBoardInfo.height.value,
        defaultCellDefinition
    );
    const alreadyDeclaredCells = {};
    for (const cell of parsedBoardInfo.cells || []) {
        const [x, y] = cell.at;
        const previousStateOfCurrentCell = alreadyDeclaredCells[`${x.value},${y.value}`] || false;
        ensureOrFail(
            x.value < parsedBoardInfo.width.value,
            new GBBParsingErrors.CellBoundaryExceeded(
                'xCoordinate',
                x.value,
                y.value,
                x.line,
                x.col
            )
        );
        ensureOrFail(
            y.value < parsedBoardInfo.height.value,
            new GBBParsingErrors.CellBoundaryExceeded(
                'yCoordinate',
                x.value,
                y.value,
                y.line,
                y.col
            )
        );
        ensureOrFail(
            !previousStateOfCurrentCell,
            new GBBParsingErrors.DuplicatedCellDefinition(
                x.value,
                y.value,
                previousStateOfCurrentCell.line,
                previousStateOfCurrentCell.col,
                x.line,
                x.col
            )
        );
        alreadyDeclaredCells[`${x.value},${y.value}`] = { line: x.line, col: x.col };
        generatedBoard[x.value][y.value] = generateCell(cell);
    }
    return {
        board: generatedBoard
    };
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
const generateCell = (info: ParsedBoardCell): CellInfo => {
    const declaredColors = {};
    const alreadyDeclaredColors = {};
    for (const declaration of info.declaring) {
        const previousStateOfCurrentColor = alreadyDeclaredColors[declaration.color.value] || false;
        ensureOrFail(
            !previousStateOfCurrentColor,
            new GBBParsingErrors.DuplicatedColorDefinition(
                declaration.color.value,
                info.at[0].value,
                info.at[1].value,
                previousStateOfCurrentColor.line,
                previousStateOfCurrentColor.col,
                declaration.color.line,
                declaration.color.col
            )
        );
        alreadyDeclaredColors[declaration.color.value] = {
            line: declaration.color.line,
            col: declaration.color.col
        };
        declaredColors[declaration.color.value] = declaration.value.value;
    }
    return Object.assign(defaultCellDefinition(), declaredColors);
};

/**
 * Simple validation utility function to throw an error in case the condition is not met
 */
const ensureOrFail = (condition: boolean, error: GBBParsingErrors.GBBParsingError): void => {
    if (!condition) {
        throw error;
    }
};
