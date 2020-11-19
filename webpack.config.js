const path = require('path');

const commonConfig = {
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ],
    /*
    fallback: {
        fs: false,
        path: false,
        child_process: false
    }
    */
  },
};

const libraryTarget = Object.assign({}, commonConfig, {
    entry: './src/index.ts',
    target: 'web',
    output: {
        filename: 'gobstones-gbb-parser.js',
        path: path.resolve(__dirname, 'dist'),
    }
});

const cliTarget =  Object.assign({}, commonConfig, {
    entry: './src/cli.ts',
    target: 'node',
    output: {
        filename: 'gobstones-gbb-parser-cli.js',
        path: path.resolve(__dirname, 'dist'),
    }
});

module.exports = [libraryTarget, cliTarget]
