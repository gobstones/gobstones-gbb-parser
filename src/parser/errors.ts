import { intl } from '../helpers';

export namespace GBBParsingErrors {
    export class GBBParsingError extends Error {
        public isError: boolean;
        public line: number;
        public col: number;

        public constructor(name: string, line: number, col: number, message: string) {
            super(message);
            this.name = name;
            this.isError = true;
            this.line = line;
            this.col = col;
            Object.setPrototypeOf(this, GBBParsingError.prototype);
        }
    }

    export class UnexpectedEOF extends GBBParsingError {
        public constructor() {
            super('UnexpectedEOF', 0, 0, intl('parser.errors.unexpected_eof'));
            Object.setPrototypeOf(this, UnexpectedEOF.prototype);
        }
    }

    export class UnexpectedToken extends GBBParsingError {
        public constructor(message: string) {
            const errorLines = message.split('\n');
            const msg = errorLines[0];
            //  This is fragile, but I can't seem to find a better way
            // of getting line and column info for the invalid token
            const [lineNumber, columnNumber] = [
                msg.substring(msg.indexOf('line ') + 5, msg.indexOf(' col')),
                msg.substring(msg.indexOf('col ') + 4, msg.indexOf(':'))
            ];
            super(
                'UnexpectedToken',
                parseInt(lineNumber, 10),
                parseInt(columnNumber, 10),
                intl('parser.errors.unexpected_token', {
                    lineNumber,
                    columnNumber,
                    lineText: errorLines[2],
                    lineMarker: errorLines[3]
                })
            );
            Object.setPrototypeOf(this, UnexpectedToken.prototype);
        }
    }

    export class InvalidSizeDefinition extends GBBParsingError {
        public constructor(dimension: string, location: { line: number; col: number }) {
            super(
                'InvalidSizeDefinition',
                location.line,
                location.col,
                intl('parser.errors.invalid_size_definition', {
                    dimension: intl(`keywords.${dimension}`),
                    line: `${location.line}`,
                    col: `${location.col}`
                })
            );
            Object.setPrototypeOf(this, InvalidSizeDefinition.prototype);
        }
    }

    export class HeadBoundaryExceeded extends GBBParsingError {
        public constructor(
            coordinate: string,
            coordinateLocation: { value: number; line: number; col: number },
            dimension: string,
            dimensionLocation: { value: number; line: number; col: number }
        ) {
            super(
                'HeadBoundaryExceeded',
                dimensionLocation.line,
                dimensionLocation.col,
                intl('parser.errors.head_boundary_exceeded', {
                    coordinate: intl(`keywords.${coordinate}`),
                    coordinateValue: `${coordinateLocation.value}`,
                    coordinateLine: `${coordinateLocation.line}`,
                    coordinateCol: `${coordinateLocation.col}`,
                    dimension: intl(`keywords.${dimension}`),
                    dimensionValue: `${dimensionLocation.value}`,
                    dimensionLine: `${dimensionLocation.line}`,
                    dimensionCol: `${dimensionLocation.col}`
                })
            );
            Object.setPrototypeOf(this, HeadBoundaryExceeded.prototype);
        }
    }

    export class CellBoundaryExceeded extends GBBParsingError {
        public constructor(coordinate: string, x: number, y: number, line: number, col: number) {
            super(
                'CellBoundaryExceeded',
                line,
                col,
                intl('parser.errors.cell_boundary_exceeded', {
                    coordinate: intl(`keywords.${coordinate}`),
                    x: `${x}`,
                    y: `${y}`,
                    line: `${line}`,
                    col: `${col}`
                })
            );
            Object.setPrototypeOf(this, CellBoundaryExceeded.prototype);
        }
    }

    export class DuplicatedCellDefinition extends GBBParsingError {
        public constructor(
            x: number,
            y: number,
            lineFirstAppearance: number,
            colFirstAppearance: number,
            lineSecondAppearance: number,
            colSecondAppearance: number
        ) {
            super(
                'DuplicatedCellDefinition',
                lineSecondAppearance,
                colSecondAppearance,
                intl('parser.errors.duplicate_cell_definition', {
                    x: `${x}`,
                    y: `${y}`,
                    lineFirstAppearance: `${lineFirstAppearance}`,
                    colFirstAppearance: `${colFirstAppearance}`,
                    lineSecondAppearance: `${lineSecondAppearance}`,
                    colSecondAppearance: `${colSecondAppearance}`
                })
            );
            Object.setPrototypeOf(this, DuplicatedCellDefinition.prototype);
        }
    }

    export class DuplicatedColorDefinition extends GBBParsingError {
        public constructor(
            color: string,
            x: number,
            y: number,
            lineFirstAppearance: number,
            colFirstAppearance: number,
            lineSecondAppearance: number,
            colSecondAppearance: number
        ) {
            super(
                'DuplicatedColorDefinition',
                lineSecondAppearance,
                colSecondAppearance,
                intl('parser.errors.duplicate_color_definition', {
                    color: intl(`keywords.${color}`),
                    x: `${x}`,
                    y: `${y}`,
                    lineFirstAppearance: `${lineFirstAppearance}`,
                    colFirstAppearance: `${colFirstAppearance}`,
                    lineSecondAppearance: `${lineSecondAppearance}`,
                    colSecondAppearance: `${colSecondAppearance}`
                })
            );
            Object.setPrototypeOf(this, DuplicatedColorDefinition.prototype);
        }
    }
}
