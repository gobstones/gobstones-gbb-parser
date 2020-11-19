import { makeMatrix } from './helpers';
import { Board, CellInfo, CellLocation } from './models';

/** The default head location  */
export const defaultHeadDefinition: () => CellLocation = () => [0, 0];
/** The default cell contents */
export const defaultCellDefinition: () => CellInfo = () => ({ a: 0, n: 0, r: 0, v: 0 });
/** The default board */
export const defaultBoard: () => Board = () => ({
    format: 'GBB/1.0',
    width: 4,
    height: 4,
    head: defaultHeadDefinition(),
    board: makeMatrix(4, 4, () => defaultCellDefinition())
});
