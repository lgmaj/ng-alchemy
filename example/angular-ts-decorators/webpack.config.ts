import * as path from 'path';
import {optionsBuilder} from "../../dist/loader";
import {Ng1ComponentTransformer, Ng1InjectableTransformer} from "../../dist/compiler";
import {NodeCompilerFileSystem} from "../../node-compiler-file-system";

const ANGULAR_TS_DECORATORS_INTEGRATION = optionsBuilder()
    .addStaticInjectTransformer()
    .addTransformer(new Ng1InjectableTransformer())
    .addTransformer(new Ng1ComponentTransformer())
    .withTemplateLoader(new NodeCompilerFileSystem())
    .withTemplateTranspiler()
    .withOptimizedTemplate()
    .build('angular-ts-decorators-integration');

export default {
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
                    loader: path.resolve(__dirname, '../../loader.js'),
                    options: {
                        transformers: ANGULAR_TS_DECORATORS_INTEGRATION
                    }
                }
            ]
        }]
    }
};
