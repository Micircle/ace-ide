const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const autoprefixer = require('autoprefixer');
const postcssVars = require('postcss-simple-vars');
const postcssImport = require('postcss-import');

module.exports = (env) => ({
    devServer: {
        open: true,
        host: '0.0.0.0',
        port: 8012,
        contentBase: path.join(__dirname, 'build')
    },
    devtool: 'source-map',
    mode: 'development',
    output: {
        path: path.join(__dirname, 'build'),
        filename: '[name].js'
    },
    entry: {
        ide: './src/index',
        app: './src/playground/app'
    },
    resolve: {
        extensions: ['.jsx', '.js', '.tsx', '.ts']
    },
    module: {
        rules: [
            {
                test: /(\.js|\.jsx)$/,
                use: {
                    loader: 'babel-loader'
                },
                exclude: [/node_modules/, /\/brython\//]
            },
            {
                test: /\.ts(x?)$/,
                use: ['babel-loader', 'ts-loader'],
                exclude: [/node_modules/]
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]_[local]'
                            },
                            importLoaders: 1,
                            localsConvention: 'camelCase'
                        }
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            ident: 'postcss',
                            plugins: [
                                postcssImport,
                                postcssVars,
                                autoprefixer({
                                    overrideBrowserslist: [
                                        'last 3 versions',
                                        'Safari >= 8',
                                        'iOS >= 8'
                                    ]
                                })
                            ]
                        }
                    }
                ]
            },
            {
                test: /\.svg|png|jpe?g$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 1024 * 10,
                            fallback: 'file-loader'
                        }
                    }
                ],
                exclude: [/node_modules/]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Ace Editor',
            template: 'src/playground/index.html',
            filename: 'index.html',
            chunks: ['app']
        }),
        new CopyWebpackPlugin([
            {
                from: 'src/libs/brython',
                to: 'brython'
            },
            {
                from: 'node_modules/skulpt/dist',
                to: 'skulpt'
            }
        ])
    ]
});
