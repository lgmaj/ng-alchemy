const path = require('path');

module.exports = {
    entry: {
        'core': './packages/core/index.ts',
        'compiler': './packages/compiler/index.ts'
    },
    output: {
        path: path.resolve(__dirname, 'dist/packages'),
        filename: '[name]/index.js'
    },
    mode: "development",
    devtool: "inline-source-map",
    resolve: {extensions: [".ts"]},
    module: {rules: [{test: /\.ts?$/, loader: "ts-loader"}]}
};