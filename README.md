# ng-alchemy
```typescript
const alchemy = angularjs => angular;
```

#example

example integration with **angular-ts-decorators**

webpack.config.ts

```typescript
import {optionsBuilder} from 'ng-alchemy/loader';
import {Ng1InjectableTransformer} from 'ng-alchemy/compiler';

module.exports = {
    entry: './src/index.ts',
    output: {
        path:  'dist',
        filename: 'bundle.js'
    },
    mode: "development",
    devtool: "inline-source-map",
    externals: {"angular": "root angular"},
    resolve: {
        extensions: [".ts"]
    },
    module: {
        rules: [{
            test: /\.ts?$/,
            use: [
                {loader: "ts-loader"},
                {
                    loader: 'ng-alchemy',
                    options: {
                        transformers: optionsBuilder()
                            .addStaticInjectTransformer()
                            .addTransformer(new Ng1InjectableTransformer())
                            .build('angular-ts-decorators-integration')
                    }
                }
            ]
        }]
    }
}
```
