import { Board, CellInfo } from './types';
import {
    InvalidSizeDefinition,
    HeadBoundaryExceeded,
    InvalidBoardDefinition,
    InvalidCellDefinition,
    GBBUnparsingError
} from './gbb-unparsing-errors';

type WhiteOption = 'space' | 'tab';
type AnyWhiteOption = 'space' | 'tab' | 'newline';

export interface GBBUnparserOptions {
    separators: {
        betweenKeywords: AnyWhiteOption;
        betweenColors: WhiteOption;
        colorKeyToNumber: WhiteOption;
        betweenCoordinates: WhiteOption;
        keywordToCoordinates: WhiteOption;
    };
    useFullColorNames: boolean;
    avoidThrow: boolean;
}

const defaultGBBUnparsingOptions: GBBUnparserOptions = {
    separators: {
        betweenKeywords: 'newline',
        betweenColors: 'space',
        colorKeyToNumber: 'tab',
        betweenCoordinates: 'space',
        keywordToCoordinates: 'space'
    },
    useFullColorNames: true,
    avoidThrow: false
};

export const unparse = (
    board: Board,
    options: GBBUnparserOptions = defaultGBBUnparsingOptions
): string | GBBUnparsingError => {
    const error = validateOrFail(board);
    if (error) {
        if (options.avoidThrow) return error;
        else throw error;
    }
    return innerUnparse(board, options);
};

const stringFromSeparator = (separatorOption: AnyWhiteOption | WhiteOption): string =>
    ({
        newline: '\n',
        tab: '\t',
        space: ' '
    }[separatorOption]);

const fullColorNames = {
    a: 'Azul',
    n: 'Negro',
    r: 'Rojo',
    v: 'Verde'
};

const getColorInfo = (cell: CellInfo, options: GBBUnparserOptions): string => {
    const separatorColorKeyToNumber = stringFromSeparator(options.separators.colorKeyToNumber);
    const separatorBetweenColors = stringFromSeparator(options.separators.betweenColors);

    const getColorNameFor = (colorKey: string): string =>
        options.useFullColorNames ? fullColorNames[colorKey] : colorKey;

    const getColorInfoString = (colorKey: string): string =>
        cell[colorKey] !== 0
            ? `${getColorNameFor(colorKey)}${separatorColorKeyToNumber}${cell[colorKey]}`
            : '';

    return [
        getColorInfoString('a'),
        getColorInfoString('n'),
        getColorInfoString('r'),
        getColorInfoString('v')
    ]
        .join(separatorBetweenColors)
        .trim();
};

const getCellInfoArray = (boardInfo: CellInfo[][], options: GBBUnparserOptions): string[] => {
    const separatorBetweenCoordinates = stringFromSeparator(options.separators.betweenCoordinates);
    const separatorKeywordToCoordinates = stringFromSeparator(
        options.separators.keywordToCoordinates
    );

    const gbbCells = [];
    for (const i in boardInfo) {
        for (const j in boardInfo[i]) {
            const colorInfo = getColorInfo(boardInfo[i][j], options);
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

const innerUnparse = (
    board: Board,
    options: GBBUnparserOptions = defaultGBBUnparsingOptions
): string => {
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
    gbbStrings = gbbStrings.concat(getCellInfoArray(board.board, options));
    gbbStrings.push(
        `head${separatorKeywordToCoordinates}${board.head[0]}` +
            `${separatorBetweenCoordinates}${board.head[1]}`
    );

    return gbbStrings.join(separatorBetweenKeywords);
};

const validateOrFail = (board: Board): GBBUnparsingError | undefined => {
    if (board.width <= 0 || board.height <= 0) {
        return new InvalidSizeDefinition(
            `The width and height of a board cannot be zero nor negative`
        );
    }
    if (
        board.head[0] < 0 ||
        board.head[1] < 0 ||
        board.head[0] >= board.width ||
        board.head[1] >= board.height
    ) {
        return new HeadBoundaryExceeded(`The head position falls outside of the board`);
    }
    if (board.board.length !== board.width) {
        return new InvalidBoardDefinition(
            'The amount of elements in the board should match the width'
        );
    }
    for (const column of board.board) {
        if (column.length !== board.height) {
            return new InvalidBoardDefinition(
                'The amount of elements in the board should match the height for all columns'
            );
        }
        for (const cell of column) {
            if (
                Object.keys(cell).length !== 4 ||
                !Object.prototype.hasOwnProperty.call(cell, 'a') ||
                !Object.prototype.hasOwnProperty.call(cell, 'n') ||
                !Object.prototype.hasOwnProperty.call(cell, 'r') ||
                !Object.prototype.hasOwnProperty.call(cell, 'v')
            ) {
                return new InvalidCellDefinition(
                    'The definition of a cell should contain values for all "a", "n", "r" and "v"'
                );
            }
        }
    }
    return undefined;
};
