const path = require('path');
const compiler = require('../compiler');
const loader = require('../loader');

const ANGULAR_TS_DECORATORS_INTEGRATION = loader.optionsBuilder()
    .addStaticInjectTransformer()
    .addTransformer(new compiler.Ng1InjectableTransformer())
    .build('angular-ts-decorators-integration');

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