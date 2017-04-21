var fs = require('fs')
var path = require('path')
var webpack = require('webpack')
var uglify = require('uglify-js')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var AssetInjectHtmlPlugin = require('..')

var baseCssExtract = new ExtractTextPlugin('css/base.[hash].css')
var indexCssExtract = new ExtractTextPlugin('css/index.[hash].css')

var DEV_PORT = 8765

module.exports = {
    context: __dirname,
    entry: {
        index: './src/js/index.js',
        common: './src/js/common.js',
        vendor: './src/js/vendor.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: 'http://localhost:' + DEV_PORT + '/',
        filename: 'js/[name].[chunkhash].js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
                loader: 'css-loader',
                options: {
                    minimize: true
                }
            })
        }, {
            test: /\.ftl$/,
            use: './ftl-loader.js'
        }]
    },
    resolve: {
        alias: {
            css: path.join(__dirname, './src/css')
        }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            chunks: ['common', 'index']
        }),
        new ExtractTextPlugin({
            filename: 'css/[name].[chunkhash].css'
        }),
        new HtmlWebpackPlugin({
            filename: 'ftl/index.ftl',
            template: './src/ftl/index.ftl',
            chunks: ['index'],
            inject: false,
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackPlugin({
            filename: 'ftl/head.ftl',
            template: './src/ftl/head.ftl',
            chunks: ['common', 'vendor'],
            inject: false,
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackPlugin({
            filename: 'ftl/foot.ftl',
            template: './src/ftl/foot.ftl',
            chunks: ['common', 'vendor'],
            inject: false,
            alwaysWriteToDisk: true
        }),
        new HtmlWebpackHarddiskPlugin(),
        new AssetInjectHtmlPlugin({
            assets: {
                bootstrap: 'http://localhost:8765/css/bootstrap.css',
                'index-local-test': '/index-local-test.js',
                'index-online-test': '/index-online-test.js'
            },
            texts: {
                ga: uglify.minify(
                    fs.readFileSync(path.join(__dirname, './ga.js'), 'UTF-8'),
                    {fromString: true}
                ).code
            },
            args: {
                local: false,
                online: true
            }
        }),
        new webpack.optimize.UglifyJsPlugin()
    ],
    devServer: {
        hot: true,
        port: DEV_PORT
    }
}