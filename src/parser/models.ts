import { intl } from '../translations';

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
    x: TokenInfo<number>;
    y: TokenInfo<number>;
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
    language: string;
}

export const defaultGBBParsingOptions: GBBParsingOptions = {
    language: intl.getDefaultLocale()
};
