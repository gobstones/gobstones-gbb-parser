/**
 * This file defines a Lexer for the GBB Language.
 * It uses plain old JS as it need to be loaded into Nearley and executed through it.
*/
const moo = require('moo');

const lexer = moo.compile({
    version: {
        match: /(?:GBB\/1\.0)|(?:GBB)|(?:gbb)/,
        value: s => "GBB/1.0"
    },
    keyword:			{
        match: /(?:size)|(?:cell)|(?:head)/,
        value: s => s
    },
    color:				{
        match: /(?:Azul)|(?:A)|(?:a)|(?:Negro)|(?:N)|(?:n)|(?:Rojo)|(?:R)|(?:r)|(?:Verde)|(?:V)|(?:v)/,
        value: s => s.toLowerCase().charAt(0)
    },
    number:				{
        match: /[0-9]+/,
        value: s => parseInt(s)
    },
    newline:			{
        match: /[\n\v\f]+/,
        lineBreaks: true,
        value: s => '\n'
    },
    whitespace:	{
        match: /[ \t]+/,
        value: s => ' '
    }
});

module.exports = lexer;
