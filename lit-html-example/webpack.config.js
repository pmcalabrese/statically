const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    devtool: 'inline-source-map',
    entry: {
        './index.static': './src/index.static.ts'
    },
    output: {
        path: path.join(__dirname, "dist"),
        filename: "[name].js"
    },
    plugins: [
        new CopyWebpackPlugin([
            // {output}/file.txt
            { from: './src/index.html' }
        ])
    ],
    resolve: {
        // Add `.ts` and `.tsx` as a resolvable extension.
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            // all files with a `.ts` or `.tsx` extension will be handled by `ts-loader`
            { test: /\.tsx?$/, loader: 'ts-loader' }
        ]
    }
}