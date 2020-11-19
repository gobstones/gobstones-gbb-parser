# gobstones-gbb-parser

A Gobstones Board Parser and Unparser.

## Gobstones Board Language Specification

The Gobstones Board Language is a declarative language for specifying boards for the Gobstones Language. The language follows the following EBNF spec:

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

## Gobstones Board JSON Output/Input

The parsed result produced/consumed by the parser is the same format produced/consumed by the [gobstones-interpreter](https://github.com/gobstones/gobstones-interpreter). It's a TypeScript/JavaScript object that has the Board type. where:

```
type Board = {
    format: string;     // should always be "GBB/1.0"
    width: number;      // width of the board
    height: number;     // height of the board
    head: CellLocation; // array [x, y] with the position of the head 
    board: BoardInfo;   // array of <width> elements,
                        // each of which is an array of <height> elements,
                        // each of which is a cell, of the form {"a": na, "n": nn, "r": nr, "v": nv}
                        // in such a way that:
                        //   * board[x][y].a = number of blue  stones at (x, y)
                        //   * board[x][y].n = number of black stones at (x, y)
                        //   * board[x][y].r = number of red   stones at (x, y)
                        //   * board[x][y].v = number of green stones at (x, y)
};
type CellLocation = [number, number];
type BoardInfo = Array<Array<CellInfo>>;
type CellInfo = { a: number; n: number; r: number; v: number };
```

Parsing may also produce errors which include:

```
UnexpectedTokenError    // If an invalid token is found in the string,
UnexpectedEOFError      // If the EOF is reached but a valid board could not yet be produced.
InvalidSizeDefinition   // If the size is zero in any of their components.
HeadBoundaryExceeded    // If the head position exceeds the size of the board.
DuplicateCellError      // If there is more than one definition for the same cell.
DuplicateColorError     // If there is more than one definition for the same color in any given cell.
CellBoundaryExceeded    // If for any given cell declaration the coordinates exceeds the size of the board.
```

These all inherit from `GBBParsingError`.

Unparsing on the other hand may produce similar errors if the provided
object contains errors that makes it an invalid board. These include:

```
InvalidSizeDefinition       // If the size is zero or negative in any of their components.
HeadBoundaryExceeded        // If the head position exceeds the size of the board.
CellBoundaryExceeded        // If for any given cell declaration the coordinates exceeds the size of the board.
InvalidCellDefinition       // If the data for the stones in a cell
are incomplete or contains more info than needed.
InvalidBoardDefinition      // If the board information provided does not match width and height of the board.
```

This all inherit from `GBBUnparsingError`.

## Installing

To install run

```
npm install @gobstones/gobstones-gbb-parser
```

or if you are using yarn.

```
yarn add @gobstones/gobstones-gbb-parser
```

## Usage

Import `GBB` from the module and parse a string defining a Gobstones Board.

```
import { GBB } from 'gobstones-gbb-parser';

const myBoard = "GBB/1.0 size 3 4 cell 2 1 a 1 cell 1 2 n 1 r 3 cell 1 3 r 2 a 1 head 1 1";

const BoardObject = GBB.parse(myBoard);

console.log(BoardObject)
```

The output of the parser is a JSON output with the aforementioned spec.
You could also pass the object representing a Board and produce a GBB string
by calling `unparse`, as follows:

```
import { GBB } from 'gobstones-gbb-parser';

const myBoardObject = {
    format: 'GBB/1.0',
    width:  3,
    height: 4,
    head:   [1, 1],
    board:  [
        [{a:0,n:0,r:0,v:0}, {a:0,n:0,r:0,v:0}, {a:0,n:0,r:0,v:0}, {a:0,n:0,r:0,v:0}],
        [{a:0,n:0,r:0,v:0}, {a:0,n:0,r:0,v:0}, {a:0,n:1,r:3,v:0}, {a:1,n:0,r:2,v:0}],
        [{a:0,n:0,r:0,v:0}, {a:1,n:0,r:0,v:0}, {a:0,n:0,r:0,v:0}, {a:0,n:0,r:0,v:0}],
    ]
}

const GBBBoardString = GBB.unparse(myBoard);

console.log(GBBBoardString)
```

## Modifying and compiling

If you want to modify the code, just download the project with git

```
git clone https://github.com/gobstones/gobstones-gbb-parser
cd gobstones-gbb-parser
```

You may compile the project with
```
npm run build
```

which produces the output in the `dist` directory.

If you want to run the tests, run
```
npm test
```

## Minimal source code guide

The project uses mainly a parser generated by `nearley` parser, whose spec
you may find in `src/gbb-grammar.ne`. The code in that file is mostly self
explanatory and follows the EBNF spec of the language, with additional code used by nearly to produce the expected output and validation.

The output of the grammar produces an intermediate AST which is managed by `src/gbs-parser.ts`. This files exports the `parse` function, that
validates the consistency of data and produces a ready for interpreter consumption object.

On the other hand `src/gbs-unparser.ts` exports the `unparse` function,
that takes an object and produces a GBB format string.

Other files include the definition of types for Board, CellInfo and other
utilities, as well as errors for parse and unparse.

Everything is then wrapped up by the `src/index.js` file that exports
all defined types and a `GBB` object which the aforementioned functions 
`parse` and `unparse`.
