module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-webpack'
        ],
        browsers: ['Chrome'],
        preprocessors: {'packages/**/*.spec.ts': ['webpack']},
        webpack: {
            mode: "development",
            devtool: "inline-source-map",
            resolve: {extensions: [".js",".ts"]},
            externals: {
                typescript: 'root ts'
            },
            module: {rules: [{test: /\.ts?$/, loader: "ts-loader"}]}
        },
        files: [
            'node_modules/typescript/lib/typescript.js',
            'dist/packages/**/*.js',
            'packages/**/*.spec.ts'
        ]
    })
};