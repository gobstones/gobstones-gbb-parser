import { intl } from '../helpers';

export namespace GBBUnparsingErrors {
    export class GBBUnparsingError extends Error {
        public isError: boolean;

        public constructor(name: string, message: string) {
            super(message);
            this.name = name;
            this.isError = true;
            Object.setPrototypeOf(this, GBBUnparsingError.prototype);
        }
    }

    export class HeadBoundaryExceeded extends GBBUnparsingError {
        public constructor(coordinate: string, value: number, min: number, max: number) {
            super(
                'HeadBoundaryExceeded',
                intl('unparser.errors.head_boundary_exceeded', {
                    coordinate: intl(`keywords.${coordinate}`),
                    value: `${value}`,
                    min: `${min}`,
                    max: `${max}`
                })
            );
            Object.setPrototypeOf(this, HeadBoundaryExceeded.prototype);
        }
    }
    export class InvalidSizeDefinition extends GBBUnparsingError {
        public constructor(dimension: string, value: number) {
            super(
                'InvalidSizeDefinition',
                intl('unparser.errors.invalid_size_definition', {
                    dimension: intl(`keywords.${dimension}`),
                    value: `${value}`
                })
            );
            Object.setPrototypeOf(this, InvalidSizeDefinition.prototype);
        }
    }
    export class InvalidCellDefinition extends GBBUnparsingError {
        public constructor(x: number, y: number, key?: string) {
            const values: any = {
                x,
                y
            };
            const secondaryMessageKey =
                'unparser.errors.invalid_cell_definition.' + (key ? 'missing' : 'added');
            if (key) {
                values.key = key;
            }

            const secondaryMessage = intl(secondaryMessageKey, values);
            super(
                'InvalidCellDefinition',
                intl('unparser.errors.invalid_cell_definition') + secondaryMessage
            );
            Object.setPrototypeOf(this, InvalidCellDefinition.prototype);
        }
    }
    export class InvalidBoardDefinition extends GBBUnparsingError {
        public constructor(encountered: number, declared: number, position?: number) {
            const values: any = {
                encountered,
                declared
            };
            const secondaryMessageKey =
                'unparser.errors.invalid_board_definition.' + (position ? 'height' : 'width');
            if (position) {
                values.position = position;
            }

            const secondaryMessage = intl(secondaryMessageKey, values);
            super(
                'InvalidBoardDefinition',
                intl('unparser.errors.invalid_board_definition.main') + secondaryMessage
            );
            Object.setPrototypeOf(this, InvalidBoardDefinition.prototype);
        }
    }
}
