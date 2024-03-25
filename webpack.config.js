const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const Dotenv = require('dotenv-webpack');
const webpack = require('webpack');
const { blake2AsHex } = require('@polkadot/util-crypto');

const path = require('path');
const outputPath = 'dist';
const manifest = require('./manifest.json');

const EXT_NAME = manifest.short_name;

const entryPoints = {
    main: [
        path.resolve(__dirname, 'src', 'main.ts'),
        path.resolve(__dirname, 'scss', 'main.scss')
    ],
    background: path.resolve(__dirname, 'src', 'background.ts')
};

module.exports = {
    entry: entryPoints,
    output: {
        path: path.join(__dirname, outputPath),
        filename: '[name].js',
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.(sa|sc)ss$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ]
            },
            {
                test: /\.(jpg|jpeg|png|gif|woff|woff2|eot|ttf|svg)$/i,
                use: 'url-loader?limit=1024'
            }
        ],
    },
    plugins: [
        new CopyPlugin({
            patterns: [{ from: '.', to: '.', context: 'public' }]
        }),
        new MiniCssExtractPlugin({
            filename: '[name].css',
        }),
        new Dotenv(),
        new webpack.DefinePlugin({
            'process.env': {
            //   EXTENSION_PREFIX: JSON.stringify(process.env.EXTENSION_PREFIX || EXT_NAME),
            EXTENSION_PREFIX: JSON.stringify(EXT_NAME),
            NODE_ENV: JSON.stringify('production'),
            PORT_PREFIX: JSON.stringify(blake2AsHex(JSON.stringify(manifest), 64))
            }
        }),
    ]
};