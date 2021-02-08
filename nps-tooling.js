/* eslint-disable */
/**
 * Windows: Please do not use trailing comma as windows will fail with token error
 */

const { series, concurrent, rimraf, copy, ifNotWindows } = require('nps-utils');
const path = require('path');

/**
 * Call another nps action.
 * @example nps('clean.dist')
 */
function nps(action) {
    return `nps ${action}`;
}

/**
 * General tooling related actions
 * @example tools.run('./src/index.ts')
 */

function onchange(files, action) {
    return `onchange -i -k '${files}' -- ${action}`;
}
function run(path) {
    return `ts-node ${path}`;
}
function webpack() {
    return `webpack`;
}
function jest(additionalArgs) {
    // Only for POSIX Based OSes, if a test file (withing test folder and ending in .test.ts)
    // contains the .only key, run exclusively that file, else, run all files as default behavior.
    // This fixes the ugly behavior of jest running all tests always, even on .only.
    // This does not work in Windows, which defaults to running all tests.
    return ifNotWindows(
        'if grep -l "\\.only" ./test/**/*.test.ts; ' +
            'then grep -l "\\.only" ./test/**/*.test.ts | xargs jest; ' +
            'else jest --coverage' +
            (additionalArgs ? ' ' + additionalArgs : '') +
            '; ' +
            'fi',
        'jest --coverage' + (additionalArgs ? ' ' + additionalArgs : '')
    );
}
function typedoc(path) {
    return `typedoc`;
}
function eslint(path, fix) {
    return `eslint ${path} --format stylish --ext ts --color` + (fix ? ' --fix' : '');
}
function prettier(path) {
    return `prettier --write ${path}`;
}

/**
 * Server related stuff, useful for serving docs and reports
 * @example server.serve('./coverage')
 */
function serve(path) {
    return `serve ${path}`;
}

/**
 * File related stuff
 * @example files.copy('./src', './dist')
 */
function rename(src, dest) {
    return series(copyFile(src, dest), remove(src));
}
function remove(src) {
    return rimraf(src);
}
function copyFile(src, dest) {
    const destFolder = path.dirname(dest);
    const destFile = path.basename(dest);
    if (!destFile) {
        return copy(`${src} ${dest}`);
    } else {
        return copy(`${src} ${destFolder} --rename ${destFile}`);
    }
}
function chmod(args, file) {
    return `chmod ${args} ${file}`;
}

function concurrently() {
    return concurrent(arguments);
}

module.exports = {
    nps,
    onchange,
    run,
    webpack,
    jest,
    typedoc,
    eslint,
    prettier,
    serve,
    rename,
    remove,
    copy: copyFile,
    chmod,
    series,
    concurrent: concurrently
};
