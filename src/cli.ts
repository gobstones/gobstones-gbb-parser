import { GBB } from './index';
import { GBBParsingOptions } from './parser';
import { GBBStringifyingOptions } from './stringifier';
import { cli } from '@gobstones/gobstones-core';
import { intl } from './translations';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJSON = require('../package.json');

interface CLIArguments {
    language: string;
    file: string;
    out: string;
    pretty: boolean;
}

// Read from the package.json in order to retrieve the name and version
const name = (packageJSON.name as string).split('/').slice(-1).pop();
const versionNumber = packageJSON.version;

cli({
    translator: intl,
    texts: {
        name,
        versionNumber,
        help: 'cli.descriptions.help',
        tool: 'cli.descriptions.tool',
        language: 'cli.descriptions.language',
        version: 'cli.descriptions.version'
    }
})
    .command('parse [gbbString]', 'cli.descriptions.parse', (cmd) => {
        cmd.input('cli.descriptions.in', 'cli.errors.file')
            .output('cli.descriptions.in')
            .option('pretty', 'cli.descriptions.pretty')
            .action((app, _, opts: CLIArguments) => {
                app.outputHelpOnNoArgs();
                const gbbString = app.read();
                const parseOpts: GBBParsingOptions = { language: opts.language };
                const jsonBoard = GBB.parse(gbbString, parseOpts);
                const result = JSON.stringify(jsonBoard, undefined, opts.pretty ? 2 : undefined);
                app.write(result);
            });
    })
    .command('stringify [jsonBoard]', 'cli.descriptions.stringify', (cmd) => {
        cmd.input('cli.descriptions.in', 'cli.errors.file')
            .output('cli.descriptions.in')
            .option('pretty', 'cli.descriptions.pretty')
            .action((app, _, opts: CLIArguments) => {
                app.outputHelpOnNoArgs();
                const jsonBoardString = app.read();
                const jsonBoard = JSON.parse(jsonBoardString);
                const stringifyOpts: GBBStringifyingOptions = {
                    language: opts.language,
                    useFullColorNames: opts.pretty,
                    declareColorsWithZeroStones: false,
                    declareColorsWithAllZeroStones: false,
                    separators: {
                        betweenKeywords: opts.pretty ? 'newline' : 'space',
                        betweenColors: 'space',
                        colorKeyToNumber: opts.pretty ? 'tab' : 'space',
                        betweenCoordinates: 'space',
                        keywordToCoordinates: 'space'
                    }
                };
                const result = GBB.stringify(jsonBoard, stringifyOpts);
                app.write(result);
            });
    })
    .run();
