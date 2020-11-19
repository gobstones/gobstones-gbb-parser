import fs from 'fs';
import commander, { program } from 'commander';
import { availableLocales, LocaleName } from './translations';
import { intl, defaultLocale } from './translations';
import { GBBParsingOptions } from './parser';
import { GBBStringifyingOptions } from './stringifier';
import { Board, GBB } from './index';

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
const version = packageJSON.version;

// Add translations and default language
const availableLangs = availableLocales.map((e) => '"' + e + '"').join(' | ');
const language = defaultLocale;
intl.setLanguage(language);

const generateCLI = (theProgram: commander.Command): commander.Command => {
    theProgram.name(name);
    theProgram.description(intl.translate('cli.descriptions.tool'));
    theProgram.version(version, '-v, --version', intl.translate('cli.descriptions.version'));
    theProgram.helpOption('-h, --help', intl.translate('cli.descriptions.help'));
    theProgram.addHelpCommand(false);

    withGeneralOptions(theProgram.command('parse [gbbString]'))
        .description(intl.translate('cli.descriptions.parse'))
        .action((gbbString: string, cmdArgs: CLIArguments) => {
            const [gbbStringToParse, options] = generateParserOptionsFrom(cmdArgs, gbbString);
            const parsed = GBB.parse(gbbStringToParse, options);
            const result = JSON.stringify(parsed, undefined, cmdArgs.pretty ? 2 : undefined);
            if (cmdArgs.out) {
                writeToFile(cmdArgs.out, result);
            } else {
                writeToConsole(result);
            }
        });

    withGeneralOptions(theProgram.command('stringify [jsonString]'))
        .description(intl.translate('cli.descriptions.stringify'))
        .action((jsonString: string, cmdArgs: CLIArguments) => {
            const [board, options] = generateStringifyOptionsFrom(cmdArgs, jsonString);
            const result = GBB.stringify(board, options);
            if (cmdArgs.out) {
                writeToFile(cmdArgs.out, result);
            } else {
                writeToConsole(result);
            }
        });

    return theProgram;
};

const withGeneralOptions = (command: commander.Command): commander.Command =>
    command
        .option(
            '-l, --language <locale>',
            intl.translate('cli.descriptions.language', { availableLangs }),
            language
        )
        .option('-f, --file <filename>', intl.translate('cli.descriptions.file'))
        .option('-o, --out <filename>', intl.translate('cli.descriptions.out'))
        .option('-p, --pretty', intl.translate('cli.descriptions.pretty'));

const generateParserOptionsFrom = (
    cmdArgs: CLIArguments,
    gbbString?: string
): [string, GBBParsingOptions] => {
    validateLanguageFlag(cmdArgs.language);
    if (cmdArgs.file) {
        gbbString = readFileInput(cmdArgs.file);
    }
    return [
        gbbString,
        {
            language: cmdArgs.language as LocaleName
        }
    ];
};

const generateStringifyOptionsFrom = (
    cmdArgs: CLIArguments,
    jsonString?: string
): [Board, GBBStringifyingOptions] => {
    validateLanguageFlag(cmdArgs.language);
    if (cmdArgs.file) {
        jsonString = readFileInput(cmdArgs.file);
    }
    try {
        const json = JSON.parse(jsonString);
        return [
            json as Board,
            {
                language: cmdArgs.language as LocaleName,
                useFullColorNames: cmdArgs.pretty,
                declareColorsWithZeroStones: false,
                declareColorsWithAllZeroStones: false,
                separators: {
                    betweenKeywords: cmdArgs.pretty ? 'newline' : 'space',
                    betweenColors: 'space',
                    colorKeyToNumber: cmdArgs.pretty ? 'tab' : 'space',
                    betweenCoordinates: 'space',
                    keywordToCoordinates: 'space'
                }
            }
        ];
    } catch (e) {
        ensureOrFailAndExit(false, e.message);
    }
};

const validateLanguageFlag = (lang: string): void => {
    ensureOrFailAndExit(
        availableLocales.indexOf(lang) !== -1,
        intl.translate('cli.errors.language', { lang, availableLangs })
    );
};

const readFileInput = (fileName: string): string => {
    ensureOrFailAndExit(fs.existsSync(fileName), intl.translate('cli.errors.file', { fileName }));
    return fs.readFileSync(fileName).toString();
};

const writeToFile = (fileName: string, contents: string): void =>
    fs.writeFileSync(fileName, contents);

const writeToConsole = (contents: string): void =>
    // eslint-disable-next-line no-console
    console.log(contents);

const ensureOrFailAndExit = (condition: boolean, error: string): void => {
    if (!condition) {
        // eslint-disable-next-line no-console
        console.error(error);
        process.exit(1);
    }
};

export const cli = generateCLI(program);
cli.parse(process.argv);
