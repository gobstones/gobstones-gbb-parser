import { parse } from './parser';
import { stringify } from './stringifier';
import { tokenize } from './grammar';
export { GBBParsingErrors, GBBParsingOptions as GBBParserOptions } from './parser';
export {
    GBBStringifyingErrors,
    GBBStringifyingOptions,
    WhiteOption,
    WhiteWithNewlineOption
} from './stringifier';

export const GBB = {
    parse,
    stringify,
    tokenize
};
