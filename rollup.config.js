import commonjs from '@rollup/plugin-commonjs';
import executable from 'rollup-plugin-executable';
import nodeResolve from '@rollup/plugin-node-resolve';
import pluginSizes from 'rollup-plugin-sizes';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';

// Expected arguments:
// configMinify (boolean: default undefined)
// configShowSizes (boolean: default undefined)
export default (commandLineArgs) => [
    {
        input: 'src/index.ts',
        output: [
            {
                sourcemap: true,
                dir: 'dist',
                format: 'es'
            },
            {
                sourcemap: true,
                file: 'dist/index.cjs',
                format: 'cjs'
            }
        ],
        plugins: [
            commonjs(),
            nodeResolve(),
            typescript(),
            commandLineArgs.configMinify && terser(),
            commandLineArgs.configShowSizes && pluginSizes()
        ]
    },
    {
        input: 'src/cli.ts',
        output: [
            {
                sourcemap: false,
                file: 'dist/gobstones-gbb-parser',
                format: 'cjs',
                banner: '#!/usr/bin/env node'
            }
        ],
        plugins: [
            commonjs(),
            nodeResolve(),
            typescript({ sourceMap: false }),
            terser(),
            commandLineArgs.configShowSizes && pluginSizes(),
            executable()
        ]
    }
];
