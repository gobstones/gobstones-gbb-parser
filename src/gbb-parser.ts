import { Parser, Grammar } from 'nearley';
import grammar from './gbb-grammar';
import { Board, CellLocation, CellInfo } from './types';
import {
    GBBParsingError,
    UnexpectedTokenError,
    InvalidSizeDefinition,
    DuplicateCellError,
    DuplicateColorError,
    HeadBoundaryExceeded,
    CellBoundaryExceeded,
    UnexpectedEOFError
} from './gbb-parsing-errors';

export interface GBBParserOptions {
    avoidThrow: boolean;
}

const defaultGBBParserOptions: GBBParserOptions = {
    avoidThrow: false
};

export const parse = (
    data: string,
    options: GBBParserOptions = defaultGBBParserOptions
): Board | GBBParsingError => {
    const parsed = innerParse(data);
    if (parsed instanceof GBBParsingError) {
        if (options.avoidThrow) return parsed;
        else throw parsed;
    }
    return parsed;
};

const generateCell = (info?: { at: CellLocation; with: CellInfo }): CellInfo => {
    const viewed = {};
    for (const key in info ? info.with : {}) {
        if (viewed[key]) {
            throw new DuplicateColorError(
                `Duplicate color definition for ${key} in the definition of ` +
                    `cell ${info.at[0]}, ${info.at[1]}`
            );
        }
        viewed[key] = info.with[key] || 0;
    }
    return Object.assign({ a: 0, n: 0, r: 0, v: 0 }, viewed);
};

export const generateBoardFromCellData = (
    width: number,
    height: number,
    cells?: { at: CellLocation; with: CellInfo }[]
): CellInfo[][] => {
    const board = [];
    for (let i = 0; i < width; i++) {
        board[i] = [];
        for (let j = 0; j < height; j++) {
            board[i][j] = generateCell();
        }
    }
    const touched = {};
    for (const cell of cells || []) {
        const [x, y] = cell.at;
        if (x >= width || y >= height) {
            throw new CellBoundaryExceeded(
                `The definition for cell ${x} ${y} is invalid, as it falls outside of the board`
            );
        }
        if (touched[`${x},${y}`]) {
            throw new DuplicateCellError(`The definition for cell ${x} ${y} is repeated`);
        }
        touched[`${x},${y}`] = true;
        board[cell.at[0]][cell.at[1]] = generateCell(cell);
    }
    return board;
};

const defaultBoardData: Partial<Board> = {
    format: 'GBB/1.0',
    width: 4,
    height: 4,
    head: [0, 0]
};

const generateCellColorData = (
    cells?: { at: CellLocation; declaring: { color: string; value: number }[] }[]
): { at: CellLocation; with: CellInfo }[] => {
    const newCells = [];
    for (const cell of cells || []) {
        const viewed = {};
        const colorInfo = {};
        for (const data of cell.declaring) {
            if (viewed[`${data.color}`]) {
                throw new DuplicateColorError(
                    `Duplicate color definition for ${data.color} ` +
                        `in the definition of cell ${cell.at[0]}, ${cell.at[1]}`
                );
            }
            viewed[data.color] = true;
            colorInfo[data.color] = data.value;
        }
        newCells.push({ at: cell.at, with: colorInfo });
    }
    return newCells;
};

const generateBoard = (
    boardInfo: Partial<Board> & {
        cells?: { at: CellLocation; declaring: { color: string; value: number }[] }[];
    }
): Board => {
    const { cells, ...others } = boardInfo;
    const generated: Board = Object.assign({}, defaultBoardData, others) as Board;
    if (generated.width === 0 || generated.height === 0) {
        throw new InvalidSizeDefinition(`The width and height of a board cannot be zero`);
    }
    if (generated.head[0] >= generated.width || generated.head[1] >= generated.height) {
        throw new HeadBoundaryExceeded(`The head position falls outside of the board`);
    }
    generated.board =
        generated.board ||
        generateBoardFromCellData(generated.width, generated.height, generateCellColorData(cells));
    return generated;
};

const innerParse = (data: string): Board | GBBParsingError => {
    const parser = new Parser(Grammar.fromCompiled(grammar));
    try {
        parser.feed(data);
        if (parser.results.length === 0) {
            throw new UnexpectedEOFError(
                "We've reached to the end of the file, but some data is still missing. " +
                    "Are you sure you're passing the full input?."
            );
        }
        return generateBoard(parser.results[0]);
    } catch (e) {
        if (e instanceof GBBParsingError) {
            return e;
        }
        return new UnexpectedTokenError(e.message);
    }
};
