import gbbGrammar from './gbb-grammar';
import Lexer from './gbb-lexer';

export const grammar = gbbGrammar;

export const lexer = Lexer;

export const tokenize = (str: string): Token[] => {
    lexer.reset(str);
    const result = [];
    let next = lexer.next();
    while (next) {
        result.push(next);
        next = lexer.next();
    }
    return result;
};

export interface Token {
    type: string;
    value: any;
    text: string;
    toString: () => string;
    offset: number;
    lineBreaks: number;
    line: number;
    col: number;
}
