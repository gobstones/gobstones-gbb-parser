import { program } from 'commander';
import { availableLocales, Locale } from './translations';
import { GBBParserOptions } from './parser';
import { GBBUnparserOptions } from './unparser';

interface ParseCLIArguments {
    language: string;
}

interface UnparseCLIArguments {
    language: string;
    colorFullNames: boolean;
    newlineSeparation: boolean;
    tabSeparation: boolean;
    zeroStonesPreserved: boolean;
    zeroStonesCellsPreserved: boolean;
}

program.name('gobstones-gbb-parser');

program
    .command('parse <gbbFile>')
    .option(
        '-l, --language <locale>',
        'Localization language, one of "en" or "es".' +
            'Only affects error messages localization, not the language spec.',
        'en'
    )
    .action((gbbFile: string, cmdArgs: ParseCLIArguments) => {
        generateParserOptionsFrom(cmdArgs);
        // eslint-disable-next-line no-console
        console.log(`Should parse ${gbbFile} with language ${cmdArgs.language}`);
    });

program
    .command('unparse <jsonFile>')
    .option(
        '-l, --language <locale>',
        'Localization language, one of "en" or "es".' +
            'Only affects error messages localization, not the language spec.',
        'en'
    )
    .option('-c, --color-full-names', 'Use full color names on produced output.', true)
    .option(
        '-z, --zero-stones-preserved',
        'Preserve the color declaration even if value is zero, for empty cells.',
        false
    )
    .option(
        '-Z, --zero-stones-cells-preserved',
        'Preserve the cell declaration even if cell is empty.',
        false
    )
    .option('-n, --newline-separation', 'Use newlines as separator anywhere possible.', true)
    .option('-t, --tab-separation', 'Use tab as separator anywhere possible.', false)
    .option(
        '-S, --separators <between-keywords> <between-colors> <color-ke-to-number>' +
            '<between-coordinates> <keyword-to-coordinates>',
        'Specify the type of separator to use on each case.'
    )
    .action((gbbFile: string, cmdArgs: UnparseCLIArguments) => {
        generateUnparserOptionsFrom(cmdArgs);
        // eslint-disable-next-line no-console
        console.log(`Should unparse ${gbbFile} with language ${cmdArgs.language}`);
    });

const generateParserOptionsFrom = (cmdArgs: ParseCLIArguments): GBBParserOptions => {
    validateLanguageFlag(cmdArgs.language);
    return {
        language: cmdArgs.language as Locale
    };
};

const generateUnparserOptionsFrom = (cmdArgs: UnparseCLIArguments): GBBUnparserOptions => {
    validateLanguageFlag(cmdArgs.language);
    return {
        language: cmdArgs.language as Locale,
        useFullColorNames: cmdArgs.colorFullNames,
        declareColorsWithZeroStones: cmdArgs.zeroStonesPreserved,
        declareColorsWithAllZeroStones: cmdArgs.zeroStonesCellsPreserved,
        separators: {
            betweenKeywords: 'newline',
            betweenColors: 'space',
            colorKeyToNumber: 'tab',
            betweenCoordinates: 'space',
            keywordToCoordinates: 'space'
        }
    };
};

export const cli = program;

const validateLanguageFlag = (languageArg: string): void => {
    ensureOrFail(
        availableLocales.indexOf(languageArg) !== -1,
        new Error(
            `You specified ${languageArg} as the -l/--language option, but valid options are:` +
                `${availableLocales}`
        )
    );
};

const ensureOrFail = (condition: boolean, error: Error): void => {
    if (condition) {
        throw error;
    }
};

cli.parse(process.argv);
