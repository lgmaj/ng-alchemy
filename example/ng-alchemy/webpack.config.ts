import * as path from 'path';
import {optionsBuilder} from "../../dist/loader";
import {ComponentTransformer, InjectableTransformer, NgModuleTransformer} from "../../dist/compiler";
import {NodeCompilerFileSystem} from "../../node-compiler-file-system";

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
        alias: {
            "ng-alchemy/platform-browser-dynamic": path.resolve(__dirname, "../../dist/platform-browser-dynamic")
        },
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
                        transformers: optionsBuilder()
                            .addStaticInjectTransformer()
                            .addTransformer(new ComponentTransformer())
                            .addTransformer(new InjectableTransformer())
                            .addTransformer(new NgModuleTransformer())
                            .addTemplateLoader(new NodeCompilerFileSystem())
                            .build('ng-alchemy')
                    }
                }
            ]
        }]
    }
};