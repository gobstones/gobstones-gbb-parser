# gobstones-gbb-parser

A Gobstones Board Parser and Stringifier.

[![Licence](https://img.shields.io/github/license/gobstones/gobstones-gbb-parser?style=plastic&label=License&logo=open-source-initiative&logoColor=white&color=olivegreen)](https://github.com/gobstones/gobstones-gbb-parser/blob/main/LICENSE) [![Version](https://img.shields.io/github/package-json/v/gobstones/gobstones-gbb-parser?style=plastic&label=Version&logo=git-lfs&logoColor=white&color=crimson)](https://www.npmjs.com/package/@gobstones/gobstones-gbb-parser) [![API Docs](https://img.shields.io/github/package-json/homepage/gobstones/gobstones-gbb-parser?color=blue&label=API%20Docs&logo=gitbook&logoColor=white&style=plastic)](https://gobstones.github.io/gobstones-gbb-parser)

![GitHub Workflow Tests](https://img.shields.io/github/workflow/status/gobstones/gobstones-gbb-parser/test-on-commit?style=plastic&label=Tests&logo=github-actions&logoColor=white) ![GitHub Workflow Build](https://img.shields.io/github/workflow/status/gobstones/gobstones-gbb-parser/build-on-commit?style=plastic&label=Build&logo=github-actions&logoColor=white)


## Gobstones Board Language Specification

The Gobstones Board Language is a declarative language for specifying boards for the Gobstones Language.
The language follows the following EBNF spec:

```
Main ->	FormatDeclaration __
        SizeDeclaration __
        (CellDeclarationList __)?
        (HeadDeclaration)?
        __?

FormatDeclaration   ->  "GBB/1.0"
                    |   "GBB"
                    |   "gbb"

SizeDeclaration     ->  "size" _ Number _ Number

HeadDeclaration     ->  "head" _ Number _ Number

CellDeclarationList ->  CellDeclaration
                    |   CellDeclaration __ CellDeclarationList

CellDeclaration     ->  "cell" _ Number _ Number _ StonesDefinition

StonesDefinition    ->  SingleStoneDefinition
                    |   SingleStoneDefinition __ StonesDefinition

SingleStoneDefinition   ->  ("Azul"|"A"|"a")  _ Number
                        |   ("Negro"|"N"|"n") _ Number
                        |   ("Rojo"|"R"|"r")  _ Number
                        |   ("Verde"|"V"|"v") _ Number

Number -> [0-9]+
_ -> [ \t]+
__ -> [ \t\n\v\f]+
```

Here is a simple example of a Gobstones Board definition:

```
GBB/1.0
size 3 4
cell 2 1 a 1
cell 1 2 n 1 r 3
cell 3 1 r 2 a 1
head 1 1
```

So to break it down in simple words. A Gobstones Board Definition:
* Must start with the format declaration at first line ("GBB/1.0")
* Must be followed by a size declaration of the form "size <width> <height>"
* May contain any number of cell declarations "cell <x-coordinate> <y-coordinate>" followed by stone amount definitions in the form "<color> <amount>"
* May end with a head declaration in the form "head <x-coordinate> <y-coordinate>".

Where:
* <width> is a positive non zero number.
* <height> is a positive non zero number.
* <x-coordinate> is a positive zero based coordinate such that <x-coordinate> < <width>
* <y-coordinate> is a positive zero based coordinate such that <y-coordinate> < <height>
* <amount> is a positive or zero number
* <color> is any of:
    * "Azul" (which may also be refered as "A" or "a")
    * "Negro" (which may also be refered as "N" or "n")
    * "Rojo" (which may also be refered as "R" or "r")
    * "Verde" (which may also be refered as "V" or "v")
* Blanks are important in the language, and numbers and keywords should be separated by a space or tab.
* Each line definition must be separated by a blank, whether is a space, a tab or line feed character.

Some additional considerations include:
* There cannot be two cell definitions for the same cell.
* There cannot be two definitions for the same color in the same cell
* There can be any amount of blank lines at the end of the file

## Gobstones Board Output/Input

The parsed result produced/consumed by the parser is a Board as the one exported by
[gobstones-core](https://github.com/gobstones/gobstones-core). We recommend to check it's
API in order to better understand the object and all it's associated methods. To
sum up, it's a TypeScript/JavaScript object that has the Board type. where:

```typescript
type Board = {
    width: number;          // width of the board
    height: number;         // height of the board
    head: [number, number]; // array [x, y] with the position of the head
    getColumns(): Cell[][]; // array of <width> elements,
                            // each of which is an array of <height> elements,
                            // each of which is a Cell
};
type Cell = {
    x: number;              // The cell's x location
    y: number;              // The cell's x location
    getStonesOf(color: Color): number;   // Returns the amount of stones
                            // for the given color.
}
```

Parsing may also produce errors which live in the GBBParsingErrors namespace (when parsing) or GBBStringifyingErrors (when stringifying).

When parsing a given string for a GBB definition you may find:

```typescript
GBBParsingErrors.UnexpectedToken           // If an invalid token is found in the string,
GBBParsingErrors.UnexpectedEOF             // If the EOF is reached but a valid board could not yet be produced.
GBBParsingErrors.InvalidSizeDefinition     // If the size is zero in any of their components.
GBBParsingErrors.HeadBoundaryExceeded      // If the head position exceeds the size of the board.
GBBParsingErrors.DuplicatedCellDefinition  // If there is more than one definition for the same cell.
GBBParsingErrors.DuplicatedColorDefinition // If there is more than one definition for the same color in any given cell.
GBBParsingErrors.CellBoundaryExceeded     // If for any given cell declaration the coordinates exceeds the size of the board.
```

These all inherit from `GBBParsingErrors.GBBParsingError`.

Unparsing on the other hand may produce similar errors if the provided
object contains errors that makes it an invalid board. These include:

```typescript
GBBStringifyingErrors.InvalidSizeDefinition       // If the size is zero or negative in any of their components.
GBBStringifyingErrors.HeadBoundaryExceeded        // If the head position exceeds the size of the board.
GBBStringifyingErrors.InvalidCellDefinition       // If the data for the stones in a cell are incomplete or contains more info than needed.
GBBStringifyingErrors.InvalidBoardDefinition      // If the board information provided does not match width and height of the board.
```

This all inherit from `GBBStringifyingErrors.GBBStringifyingError`.

## Translations

Error messages are translated to the user desired language, although this does not change the language
definition in any way. See below on how to translate error messages to a given language.

## Installing

To install run

```sh
npm install @gobstones/gobstones-gbb-parser
```

or if you are using yarn.

```sh
yarn add @gobstones/gobstones-gbb-parser
```

## Usage as a module

Import `GBB` from the module and parse a string defining a Gobstones Board.

```typescript
import { GBB } from '@gobstones/gobstones-gbb-parser';

const myBoard = "GBB/1.0 size 3 4 cell 2 1 a 1 cell 1 2 n 1 r 3 cell 1 3 r 2 a 1 head 1 1";

const BoardObject = GBB.parse(myBoard);

console.log(BoardObject)
```

The output of the parser is a JSON output with the aforementioned spec.
You could also pass the object representing a Board and produce a GBB string
by calling `stringify`, as follows:

```typescript
import { GBB } from '@gobstones/gobstones-gbb-parser';
import { Board, Color } from '@gobstones/gobstones-core';

const myBoard = new Board(3, 4, [1, 1], [
    {x: 2, y: 1, [Color.Black]: 1, [Color.Red]: 3},
    {x: 3, y: 1, [Color.Blue]: 1, [Color.Red]: 3},
]);

const GBBBoardString = GBB.stringify(myBoard);

console.log(GBBBoardString)
```

Additionally, you can pass an object that it's not a board, but has all it's properties,
this is the expected behavior when working from the CLI:

```typescript
import { GBB } from '@gobstones/gobstones-gbb-parser';

const myBoard = {
    x: 3,
    y: 4,
    head: [1, 1],
    cellData: [
        {x: 2, y: 1, [Color.Black]: 1, [Color.Red]: 3},
        {x: 3, y: 1, [Color.Blue]: 1, [Color.Red]: 3},
    ]
};

const GBBBoardString = GBB.stringify(myBoard);

console.log(GBBBoardString)
```

#### Passing options

You can pass an object of type `GBBParsingOptions` to `parse` to specify additional options as a second argument.

```typescript
interface GBBParsingOptions = {
    /** The error message output language */
    language: Locale;
}
```

Whereas for `stringify` you can pass a `GBBStringifyingOptions` as a second argument.

```typescript
interface GBBStringifyingOptions {
    /** The error message output language */
    language: Locale;
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

type WhiteOption = 'space' | 'tab';
type WhiteWithNewlineOption = 'space' | 'tab' | 'newline';
```

where you can configure the produced output string when unparsing, but specifying different separator symbols,
choose to use full color names or short names, and maintain or remove empty color names and cells.

Available locales are currently `en` and `es`, and defaults to 'en'.

```typescript
type Locale = 'en' | 'es'; // Defaults to 'en'.
```
## Usage as CLI

This module installs a `gobstones-gbb-parser` command in the NPM bin folder. You can use the parser from the
command line. If you want to use it from anywhere on your machine, install the module globally with:

```sh
npm install --global @gobstones/gobstones-gbb-parser
```

Then you can call the parser with the version option to check the currently installed version.

```
gobstones-gbb-parser --version
```

Use help to chek available commands.
```
gobstones-gbb-parser --help
```

## Modifying and compiling

If you want to modify the code, just download the project with git

```
git clone https://github.com/gobstones/gobstones-gbb-parser
cd gobstones-gbb-parser
```

You may compile the project with
```
npm start build
```

which produces the output in the `dist` directory.

If you want to run the tests, run
```
npm test
```

## Minimal source code guide

The project structre is as follows:
```
src
 |- grammar       // Lexer and Parser definitions
 |- parser        // Parsing functions, models and error definitions
 |- stringifier   // Stringify functions, models and error definitions
 |- helpers       // Helper functions and definitions
 |- translations  // JSON files containing translation strings
 |- models.ts     // The exported types for the module
 |- models.ts     // Some defaults the module exports
 |- index.ts      // The main exported module, including the GBB object
 |- cli.ts        // The CLI definition
```
The project uses mainly a lexer/tokenizer written using [moo](https://github.com/no-context/moo) that you can
find in `src/grammar/gbb-lexer.js` and a parser generated by [nearley](https://nearley.js.org) parser, whose spec
you may find in `src/grammar/gbb-grammar.ne`. The code in that file is mostly self explanatory and follows the
EBNF spec of the language, with additional code used by nearley to produce an intermediate output.

The output of the grammar produces an intermediate AST which is managed by `src/parser/parser.ts`.
This files exports the `parse` function, that validates the consistency of data and produces a ready for
interpreter consumption object.

On the other hand `src/stringifier/stringifier.ts` exports the `stringify` function, that takes an object and
produces a GBB format string.

Other files include the definition of types for Board, CellInfo and other
utilities, as well as errors for parse and stringify.

Everything is then wrapped up by the `src/index.js` file that exports
all defined types and a `GBB` object which the aforementioned functions
`parse` and `stringify`, types, and defaults.
