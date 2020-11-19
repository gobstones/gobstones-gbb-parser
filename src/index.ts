import { tokenize } from './grammar';
import { parse } from './parser';
import { unparse } from './unparser';
import { defaultBoard, defaultHeadDefinition, defaultCellDefinition } from './defaults';
export { Board, BoardInfo, CellInfo, CellLocation } from './models';
export { GBBParsingErrors, GBBParserOptions } from './parser';
export {
    GBBUnparsingErrors,
    GBBUnparserOptions,
    WhiteOption,
    WhiteWithNewlineOption
} from './unparser';

export const GBB = {
    parse,
    unparse,
    tokenize,
    defaults: {
        board: defaultBoard(),
        head: defaultHeadDefinition(),
        cell: defaultCellDefinition()
    }
};
