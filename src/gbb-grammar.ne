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

FormatDeclaration       ->  ("GBB/1.0" | "GBB" | "gbb")
                            {% function(d) {return "GBB/1.0";} %}

SizeDeclaration         ->  "size" _ Number _ Number
                            {% function(d) {return [d[0], d[2], d[4]];} %}

HeadDeclaration         ->  "head" _ Number _ Number
                            {% function(d) {return [d[0], d[2], d[4]];} %}

CellDeclarationList     ->  CellDeclaration
                            {% function(d) {return [d[0]]; } %}
                        |   CellDeclaration __ CellDeclarationList
                            {% function(d) {return [d[0]].concat(d[2]); } %}

CellDeclaration         ->  "cell" _ Number _ Number _ StonesDefinition
                            {% function(d) {
                                    return { at: [d[2], d[4]], declaring: d[6]};
                                }
                            %}

StonesDefinition        ->  SingleStoneDefinition   {% function(d) {return [d[0]];} %}
                        |   SingleStoneDefinition __ StonesDefinition
                            {% function(d) {return [d[0]].concat(d[2]);} %}

SingleStoneDefinition   ->  (BlueKeyword _ Number
                        |   BlackKeyword _ Number
                        |   RedKeyword _ Number
                        |   GreenKeyword _ Number)
                        {% function(d) {
                            var cellDef = (d[0] || d[1] || d[2] || d[3]);
                            return {color: cellDef[0], value: cellDef[2]};
                         } %}

BlueKeyword             ->  ("Azul"  | "A" | "a") {% function(d) {return "a";} %}
BlackKeyword            ->  ("Negro" | "N" | "n") {% function(d) {return "n";} %}
RedKeyword              ->  ("Rojo"  | "R" | "r") {% function(d) {return "r";} %}
GreenKeyword            ->  ("Verde" | "V" | "v") {% function(d) {return "v";} %}

Number -> [0-9]:+       {% function(d) { return parseInt(d[0].join('')); }%}
_ -> [ \t]:+            {% function(d) {return null;} %}
__ -> [ \t\n\v\f]:+     {% function(d) {return null;} %}
