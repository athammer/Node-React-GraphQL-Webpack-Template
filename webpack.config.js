'use strict';

const path = require('path');
var webpack = require('webpack');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
    mode: 'production',
    devtool: 'source-map',
    entry: {
        home: './src/react/pages/home.tsx',
    },
    output: {
        path: path.resolve(__dirname, 'public/javascripts'),
        filename: '[name].js',
        sourceMapFilename: '[file].map',
        pathinfo: true,
    },
    module: {
        rules: [
            {
                test: /\.ts(x?)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react', '@babel/typescript'], //most recent supported
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            }
        ]
    },
    plugins: [
        // new webpack.DefinePlugin({
        //     'process.env': {
        //         'DB_HOST': JSON.stringify(process.env.DB_HOST),
        //         'DB_NAME': JSON.stringify(process.env.DB_NAME),
        //         'DB_PASSWORD': JSON.stringify(process.env.DB_PASSWORD),
        //         'DB_PORT': JSON.stringify(process.env.DB_PORT),
        //         'DB_USERNAME': JSON.stringify(process.env.DB_USERNAME)
        //     }
        // })
    ],
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                exclude: '/node_modules/',
                cache: true
            }),
        ],
    },
    context: path.resolve(__dirname)
    // performance: {
    //     hints: true
    // }
};
