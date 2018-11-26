module.exports = function (config) {
    config.set({
        frameworks: ['jasmine'],
        plugins: [
            'karma-jasmine',
            'karma-chrome-launcher',
            'karma-webpack'
        ],
        browsers: ['Chrome'],
        preprocessors: {'dist/@ng-alchemy/**/*.spec.js': ['webpack']},
        files: [
            'dist/packages/**/*.js',
            'dist/@ng-alchemy/**/*.spec.js'
        ]
    })
};