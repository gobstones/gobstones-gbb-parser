# Import the custom lexer and load it into Nearley
@{%
const lexer = require('./gbb-lexer.js');
%}

@lexer lexer

# Define the parser
Main ->	FormatDeclaration __
        SizeDeclaration __:?
            {% function (d) {
                return { format: d[0], width: d[2][1], height: d[2][2] }
            }%}
	  | FormatDeclaration __
        SizeDeclaration __
		CellDeclarationList __:?
            {% function (d) {
                return { format: d[0], width: d[2][1], height: d[2][2], cells: d[4] }
            }%}
	  | FormatDeclaration __
        SizeDeclaration __
        (CellDeclarationList __):?
        HeadDeclaration __:?
            {% function(d) {
                return { format: d[0], width: d[2][1], height: d[2][2], head: [d[5][1], d[5][2]],
                    cells: d[4] ? d[4][0] : []
                };
            } %}

FormatDeclaration       ->  %version    {% id %}

SizeDeclaration         ->  "size" _ Number _ Number
                            {% function(tokenList) {
                                return [tokenList[0], tokenList[2], tokenList[4]];
                            } %}

HeadDeclaration         ->  "head" _ Number _ Number
                            {% function(tokenList) {
                                return [tokenList[0], tokenList[2], tokenList[4]];
                            } %}

CellDeclarationList     ->  CellDeclaration
                            {% function(tokenList) {
                                return [tokenList[0]];
                            } %}
                        |   CellDeclaration __ CellDeclarationList
                            {% function(tokenList) {
                                return [tokenList[0]].concat(tokenList[2]);
                            } %}

CellDeclaration         ->  "cell" _ Number _ Number _ StonesDefinition
                            {% function(tokenList) {
                                return { at: [tokenList[2], tokenList[4]], declaring: tokenList[6]};
                            } %}

StonesDefinition        ->  SingleStoneDefinition
                            {% function(tokenList) {
                                return [tokenList[0]];
                            } %}
                        |   SingleStoneDefinition _ StonesDefinition
                            {% function(tokenList) {
                                return [tokenList[0]].concat(tokenList[2]);
                            } %}

SingleStoneDefinition   ->  Color _ Number
                        {% function(tokenList) {
                            return {color: tokenList[0], value: tokenList[2]}
                        } %}

Color   -> %color                       {% id %}
Number  -> %number                      {% id %}
_       -> %whitespace                  {% () => null %}
__      -> (%whitespace | %newline):+   {% () => null %}
