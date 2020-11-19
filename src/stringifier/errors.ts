import { intl } from '../translations';

export namespace GBBStringifyingErrors {
    export class GBBStringifyingError extends Error {
        public isError: boolean;

        public constructor(name: string, message: string) {
            super(message);
            this.name = name;
            this.isError = true;
            Object.setPrototypeOf(this, GBBStringifyingError.prototype);
        }
    }

    export class HeadBoundaryExceeded extends GBBStringifyingError {
        public constructor(coordinate: string, value: number, min: number, max: number) {
            super(
                'HeadBoundaryExceeded',
                intl.translate('stringifier.errors.HeadBoundaryExceeded', {
                    coordinate: intl.translate(`keywords.${coordinate}`),
                    value: `${value}`,
                    min: `${min}`,
                    max: `${max}`
                })
            );
            Object.setPrototypeOf(this, HeadBoundaryExceeded.prototype);
        }
    }
    export class InvalidSizeDefinition extends GBBStringifyingError {
        public constructor(dimension: string, value: number) {
            super(
                'InvalidSizeDefinition',
                intl.translate('stringifier.errors.InvalidSizeDefinition', {
                    dimension: intl.translate(`keywords.${dimension}`),
                    value: `${value}`
                })
            );
            Object.setPrototypeOf(this, InvalidSizeDefinition.prototype);
        }
    }
    export class InvalidCellDefinition extends GBBStringifyingError {
        public constructor(x: number, y: number, key?: string) {
            const values: any = {
                x,
                y
            };
            const secondaryMessageKey =
                'stringifier.errors.InvalidCellDefinition.' + (key ? 'missing' : 'added');
            if (key) {
                values.key = key;
            }

            const secondaryMessage = intl.translate(secondaryMessageKey, values);
            super(
                'InvalidCellDefinition',
                intl.translate('stringifier.errors.InvalidCellDefinition') + secondaryMessage
            );
            Object.setPrototypeOf(this, InvalidCellDefinition.prototype);
        }
    }
    export class InvalidBoardDefinition extends GBBStringifyingError {
        public constructor(encountered: number, declared: number, position?: number) {
            const values: any = {
                encountered,
                declared
            };
            const secondaryMessageKey =
                'stringifier.errors.InvalidBoardDefinition.' + (position ? 'height' : 'width');
            if (position) {
                values.position = position;
            }

            const secondaryMessage = intl.translate(secondaryMessageKey, values);
            super(
                'InvalidBoardDefinition',
                intl.translate('stringifier.errors.InvalidBoardDefinition.main') +
                    secondaryMessage
            );
            Object.setPrototypeOf(this, InvalidBoardDefinition.prototype);
        }
    }
}
