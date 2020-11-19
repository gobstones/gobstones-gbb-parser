import { Locale, defaultLocale } from '../translations';

export type WhiteOption = 'space' | 'tab';
export type WhiteWithNewlineOption = 'space' | 'tab' | 'newline';

export interface GBBUnparserOptions {
    language: Locale;
    separators: {
        betweenKeywords: WhiteWithNewlineOption;
        betweenColors: WhiteOption;
        colorKeyToNumber: WhiteOption;
        betweenCoordinates: WhiteOption;
        keywordToCoordinates: WhiteOption;
    };
    useFullColorNames: boolean;
    declareColorsWithZeroStones: boolean;
    declareColorsWithAllZeroStones: boolean;
}

export const defaultGBBUnparserOptions: GBBUnparserOptions = {
    language: defaultLocale,
    separators: {
        betweenKeywords: 'newline',
        betweenColors: 'space',
        colorKeyToNumber: 'tab',
        betweenCoordinates: 'space',
        keywordToCoordinates: 'space'
    },
    useFullColorNames: true,
    declareColorsWithZeroStones: false,
    declareColorsWithAllZeroStones: false
};

export const stringFromSeparator = (
    separatorOption: WhiteWithNewlineOption | WhiteOption
): string =>
    ({
        newline: '\n',
        tab: '\t',
        space: ' '
    }[separatorOption]);

export const getColorNameFor = (colorKey: string, useFullColorName: boolean = false): string =>
    !useFullColorName
        ? colorKey
        : {
              a: 'Azul',
              n: 'Negro',
              r: 'Rojo',
              v: 'Verde'
          }[colorKey];
