import { LocaleName, defaultLocale } from '../translations';

export interface TokenInfo<T> {
    type: string;
    value: T;
    text: string;
    offset: number;
    lineBreaks: number;
    line: number;
    col: number;
}

export interface ParsedBoardCell {
    at: [TokenInfo<number>, TokenInfo<number>];
    declaring: {
        color: TokenInfo<string>;
        value: TokenInfo<number>;
    }[];
}

export interface ParsedBoardInfo {
    format: TokenInfo<string>;
    width: TokenInfo<number>;
    height: TokenInfo<number>;
    head: [TokenInfo<number>, TokenInfo<number>];
    cells: ParsedBoardCell[];
}

/**
 * Options you can pass to `parse` command.
 */
export interface GBBParsingOptions {
    /** The error message output language */
    language: LocaleName;
}

export const defaultGBBParsingOptions: GBBParsingOptions = {
    language: defaultLocale
};
