/* eslint-disable max-len */
import { Locale } from './translation';

export const en: Locale = {
    parser: {
        errors: {
            CellBoundaryExceeded:
                'The definition for ${coordinate} in cell definition for ${x} ${y} at line ${line}, column ${column} is invalid, as it falls outside of the board.',
            DuplicateCellDefinition:
                'The definition for cell ${x} ${y} was found twice. Once at line ${lineFirstAppearance}, column ${colFirstAppearance} and again at line ${lineSecondAppearance}, column ${colSecondAppearance}',
            DuplicateColorDefinition:
                'The color definition for ${color} at cell ${x} ${y} is declared twice. Once at line ${lineFirstAppearance}, column ${colFirstAppearance} and again at line ${lineSecondAppearance}, column ${colSecondAppearance}.',
            HeadBoundaryExceeded:
                'The head position falls outside of the board. The ${coordinate} is declared as ${coordinateValue} at line ${coordinateLine} column ${coordinateCol}, but it cannot be grater than the ${dimension} of the board which is declared as ${dimensionValue} at line ${dimensionLine} column ${dimensionCol}',
            InvalidSizeDefinition:
                'The ${dimension} of a board cannot be zero. Error at line ${line}, column ${col}',
            UnexpectedEOF:
                "We've reached to the end of the file, but some data is still missing. Are you sure you're passing the full input?.",
            UnexpectedToken:
                'An unnexpected token was found at line ${lineNumber}, column ${columnNumber}:\n${lineText}\n${lineMarker}'
        }
    },
    stringifier: {
        errors: {
            HeadBoundaryExceeded:
                'The head ${coordinate} value is invalid, as it falls outside of the board. You specified ${value}, but should be a value grater or equal than ${min} and lower than ${max}.',
            InvalidSizeDefinition:
                'The ${dimension} of a board cannot be zero nor negative, but you defined it as ${value}.',
            InvalidCellDefinition: {
                main:
                    "The definition of a cell should contain values for all 'a', 'n', 'r' and 'v', and nothing else. ",
                missing:
                    'Yet you are lacking a value for the key ${key} at cell definition at position ${x}, ${y}.',
                added:
                    'Yet you are have additional keys for cell definition at position ${x}, ${y}.'
            },
            InvalidBoardDefinition: {
                main:
                    'The amount of elements in the board array definition should match the defined width and height of the board for any array element. ',
                width:
                    'Yet the array has ${encountered} elements while the width stated ${declared} was required.',
                height:
                    'Yet the element at position ${position} of the array has ${encountered} elements while the height stated ${declared} was required.'
            }
        }
    },
    keywords: {
        width: 'width',
        height: 'height',
        xCoordinate: 'x-coordinate',
        yCoordinate: 'y-coordinate',
        a: 'Blue',
        n: 'Black',
        r: 'Red',
        v: 'Green'
    },
    cli: {
        descriptions: {
            tool: 'A Parser/Stringifier for GBB (Gobstones Board) file format',
            help: 'Display command help',
            version: 'Display version information',
            parse: 'Parse a GBB string and produce a JSON',
            stringify: 'Stringify a JSON and produce a GBB string',
            language:
                'Localization language, one of ${availableLangs}. Only affects error messages localization, not the language spec.',
            file:
                'Use the contents of a file as input instead of inline input. If this is specified, inline input is ignored.',
            out: 'Write the output to a file. If file already exists file contents are overriten.',
            pretty: 'Pretty print the output'
        },
        errors: {
            language:
                'You specified "${lang}" as the language, but that\'s not a valid language. Select one of ${availableLangs}.',
            file: 'The file ${fileName} does not exist or cannot be read.',
        }
    }
};
