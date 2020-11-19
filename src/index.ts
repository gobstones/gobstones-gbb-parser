import { tokenize } from './grammar';
import { parse } from './parser';
import { stringify } from './stringifier';
import { defaultBoard, defaultHeadDefinition, defaultCellDefinition } from './defaults';
export { Board, BoardInfo, CellInfo, CellLocation } from './models';
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
    tokenize,
    defaults: {
        board: defaultBoard(),
        head: defaultHeadDefinition(),
        cell: defaultCellDefinition()
    }
};
