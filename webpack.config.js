const path = require('path');
const webpack = require('webpack');

const commonConfig = {
    mode: 'production',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js']
    }
};

const libraryTarget = Object.assign({}, commonConfig, {
    entry: './src/index.ts',
    target: 'web',
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd',
        library: 'gobstones-gbb-parser',
        umdNamedDefine: true,
        globalObject: "typeof self !== 'undefined' ? self : this"
    },

    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
        fallback: {
            // eslint-disable-next-line camelcase
            child_process: false,
            fs: false,
            path: false
        }
    }
});

const cliTarget = Object.assign({}, commonConfig, {
    entry: './src/cli.ts',
    target: 'node',
    output: {
        filename: 'gobstones-gbb-parser.js',
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'umd'
    },
    plugins: [new webpack.BannerPlugin({ banner: '#!/usr/bin/env node', raw: true })]
});

module.exports = [libraryTarget, cliTarget];
