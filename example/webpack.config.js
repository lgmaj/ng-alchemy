const path = require('path');

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: "production",
    devtool: "inline-source-map",
    resolve: {extensions: [".ts"]},
    module: {
        rules: [{
            test: /\.ts?$/, loader: [
                "ts-loader",
                path.resolve(__dirname, '../dist/@ng-alchemy/loader/loader/index.js')
            ]
        }]
    }
};