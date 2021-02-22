// Generated automatically by nearley, version 2.20.1
// http://github.com/Hardmath123/nearley
(function () {
function id(x) { return x[0]; }

const lexer = require('./gbb-lexer.js');
const h = require('./nearley-helper.js');
var grammar = {
    Lexer: lexer,
    ParserRules: [
    {"name": "Main$ebnf$1", "symbols": ["__"], "postprocess": id},
    {"name": "Main$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Main", "symbols": ["FormatDeclaration", "__", "SizeDeclaration", "Main$ebnf$1"], "postprocess": function (d) { return { format: d[0], width: d[2][1], height: d[2][2] }; }},
    {"name": "Main$ebnf$2", "symbols": ["__"], "postprocess": id},
    {"name": "Main$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Main", "symbols": ["FormatDeclaration", "__", "SizeDeclaration", "__", "CellDeclarationList", "Main$ebnf$2"], "postprocess": function (d) { return { format: d[0], width: d[2][1], height: d[2][2], cells: d[4] }; }},
    {"name": "Main$ebnf$3$subexpression$1", "symbols": ["CellDeclarationList", "__"]},
    {"name": "Main$ebnf$3", "symbols": ["Main$ebnf$3$subexpression$1"], "postprocess": id},
    {"name": "Main$ebnf$3", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Main$ebnf$4", "symbols": ["__"], "postprocess": id},
    {"name": "Main$ebnf$4", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "Main", "symbols": ["FormatDeclaration", "__", "SizeDeclaration", "__", "Main$ebnf$3", "HeadDeclaration", "Main$ebnf$4"], "postprocess": function(d) { return { format: d[0], width: d[2][1], height: d[2][2], head: [d[5][1], d[5][2]], cells: d[4] ? d[4][0] : [] }; }},
    {"name": "FormatDeclaration", "symbols": [(lexer.has("version") ? {type: "version"} : version)], "postprocess": h.id()},
    {"name": "SizeDeclaration", "symbols": [{"literal":"size"}, "_", "Number", "_", "Number"], "postprocess": h.array([0, 2, 4])},
    {"name": "HeadDeclaration", "symbols": [{"literal":"head"}, "_", "Number", "_", "Number"], "postprocess": h.array([0, 2, 4])},
    {"name": "CellDeclarationList", "symbols": ["CellDeclaration"], "postprocess": h.list.head()},
    {"name": "CellDeclarationList", "symbols": ["CellDeclaration", "__", "CellDeclarationList"], "postprocess": h.list.tail()},
    {"name": "CellDeclaration", "symbols": [{"literal":"cell"}, "_", "Number", "_", "Number", "_", "StonesDefinition"], "postprocess": h.object({x: 2, y: 4, declaring: 6})},
    {"name": "StonesDefinition", "symbols": ["SingleStoneDefinition"], "postprocess": h.list.head()},
    {"name": "StonesDefinition", "symbols": ["SingleStoneDefinition", "_", "StonesDefinition"], "postprocess": h.list.tail()},
    {"name": "SingleStoneDefinition", "symbols": ["Color", "_", "Number"], "postprocess": h.object({color: 0, value: 2})},
    {"name": "Color", "symbols": [(lexer.has("color") ? {type: "color"} : color)], "postprocess": h.id()},
    {"name": "Number", "symbols": [(lexer.has("number") ? {type: "number"} : number)], "postprocess": h.id()},
    {"name": "_", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)], "postprocess": h.null()},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)]},
    {"name": "__$ebnf$1$subexpression$1", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1$subexpression$1"]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("whitespace") ? {type: "whitespace"} : whitespace)]},
    {"name": "__$ebnf$1$subexpression$2", "symbols": [(lexer.has("newline") ? {type: "newline"} : newline)]},
    {"name": "__$ebnf$1", "symbols": ["__$ebnf$1", "__$ebnf$1$subexpression$2"], "postprocess": function arrpush(d) {return d[0].concat([d[1]]);}},
    {"name": "__", "symbols": ["__$ebnf$1"], "postprocess": h.null()}
]
  , ParserStart: "Main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
