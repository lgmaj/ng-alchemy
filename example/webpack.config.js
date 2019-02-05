const path = require('path');
const compiler = require('../compiler');
const loader = require('../loader');

const ANGULAR_TS_DECORATORS_INTEGRATION = 'angular-ts-decorators-integration';

loader.registerTranformers(ANGULAR_TS_DECORATORS_INTEGRATION, [
    new compiler.Ng1StaticInjectTransformer(),
    new compiler.Ng1InjectableTransformer()
]);

module.exports = {
    entry: path.resolve(__dirname, './src/index.ts'),
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    mode: "development",
    devtool: "inline-source-map",
    externals: {"angular": "root angular"},
    resolve: {
        extensions: [".js", ".ts"]
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [
                {loader: "ts-loader"},
                {
                    loader: path.resolve(__dirname, '../loader.js'),
                    options: {
                        transformers: ANGULAR_TS_DECORATORS_INTEGRATION
                    }
                }
            ]
        }]
    }
};