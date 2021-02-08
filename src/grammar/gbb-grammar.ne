# Import the custom lexer and load it into Nearley
@{%
const lexer = require('./gbb-lexer.js');
const h = require('./nearly-helper.js');
%}

@lexer lexer

# Define the parser
Main ->	FormatDeclaration __
        SizeDeclaration __:?                                            {% function (d) { return { format: d[0], width: d[2][1], height: d[2][2] }; } %}
	  | FormatDeclaration __
        SizeDeclaration __
		CellDeclarationList __:?                                        {% function (d) { return { format: d[0], width: d[2][1], height: d[2][2], cells: d[4] }; } %}
	  | FormatDeclaration __
        SizeDeclaration __
        (CellDeclarationList __):?
        HeadDeclaration __:?                                            {% function(d) { return { format: d[0], width: d[2][1], height: d[2][2], head: [d[5][1], d[5][2]], cells: d[4] ? d[4][0] : [] }; } %}

FormatDeclaration       ->  %version                                    {% h.id() %}

SizeDeclaration         ->  "size" _ Number _ Number                    {% h.array([0, 2, 4]) %}

HeadDeclaration         ->  "head" _ Number _ Number                    {% h.array([0, 2, 4]) %}

CellDeclarationList     ->  CellDeclaration                             {% h.list.head() %}
                        |   CellDeclaration __ CellDeclarationList      {% h.list.tail() %}

CellDeclaration         ->  "cell" _ Number _ Number _ StonesDefinition {% h.object({x: 2, y: 4, declaring: 6}) %}

StonesDefinition        ->  SingleStoneDefinition                       {% h.list.head() %}
                        |   SingleStoneDefinition _ StonesDefinition    {% h.list.tail() %}

SingleStoneDefinition   ->  Color _ Number                              {% h.object({color: 0, value: 2}) %}

Color   -> %color                                                       {% h.id() %}
Number  -> %number                                                      {% h.id() %}
_       -> %whitespace                                                  {% h.null() %}
__      -> (%whitespace | %newline):+                                   {% h.null() %}
