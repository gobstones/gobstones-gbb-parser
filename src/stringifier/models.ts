import { intl } from '../translations';

export type WhiteOption = 'space' | 'tab';
export type WhiteWithNewlineOption = 'space' | 'tab' | 'newline';

/**
 * Options you can pass to `stringify` command.
 */
export interface GBBStringifyingOptions {
    /** The error message output language */
    language: string;
    /** Different separator options */
    separators: {
        /** The separator to use between each language keyword.
         * Defaults to 'newline' */
        betweenKeywords: WhiteWithNewlineOption;
        /** The separator to use between different color names in the same line.
         * Defaults to 'space' */
        betweenColors: WhiteOption;
        /** The separator to use between a color name and the number that follows.
         * Defaults to 'tab' */
        colorKeyToNumber: WhiteOption;
        /** The separator to use between different elements of a coordinate.
         * Defaults to 'space' */
        betweenCoordinates: WhiteOption;
        /** The separator to use between the keyword and the first element of a coordinate.
         * Defaults to 'space' */
        keywordToCoordinates: WhiteOption;
    };
    /** Use the full color name in output. Defaults to 'true' */
    useFullColorNames: boolean;
    /** Maintain the color key for colors which have zero stone for cells
     * which have at least one stone. Defaults to 'false' */
    declareColorsWithZeroStones: boolean;
    /** Maintain the color key for colors which have zero stone for cells
     * even for cells that have no stones at all. This indeed produces a
     * 'cell' line for each cell of the board, which is not desirable for
     * large board. Defaults to 'false' */
    declareColorsWithAllZeroStones: boolean;
}

export const defaultGBBStringifyingOptions: GBBStringifyingOptions = {
    language: intl.getDefaultLocale(),
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
