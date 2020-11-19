import { Locale, defaultLocale } from '../translations';

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

export interface GBBParserOptions {
    language: Locale;
}

export const defaultGBBParserOptions: GBBParserOptions = {
    language: defaultLocale
};
