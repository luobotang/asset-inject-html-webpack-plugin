var path = require('path')
var webpack = require('webpack')
var CleanWebpackPlugin = require('clean-webpack-plugin')
var HtmlWebpackPlugin = require('html-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var AssetInjectHtmlPlugin = require('..')

var baseCssExtract = new ExtractTextPlugin('css/base.[hash].css')
var indexCssExtract = new ExtractTextPlugin('css/index.[hash].css')

module.exports = {
    context: __dirname,
    entry: {
        index: './src/js/index.js',
        common: './src/js/common.js'
    },
    output: {
        path: path.join(__dirname, 'dist'),
        publicPath: '/',
        filename: 'js/[name].[hash].js'
    },
    module: {
        rules: [{
            test: /base\.css$/,
            use: baseCssExtract.extract('css-loader')
        }, {
            test: /index\.css$/,
            use: indexCssExtract.extract('css-loader')
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
        baseCssExtract,
        indexCssExtract,
        new HtmlWebpackPlugin({
            filename: 'ftl/index.ftl',
            template: './src/ftl/index.ftl',
            chunks: ['index'],
            inject: false
        }),
        new HtmlWebpackPlugin({
            filename: 'ftl/head.ftl',
            template: './src/ftl/head.ftl',
            chunks: ['common'],
            inject: false
        }),
        new HtmlWebpackPlugin({
            filename: 'ftl/foot.ftl',
            template: './src/ftl/foot.ftl',
            chunks: ['common'],
            inject: false
        }),
        new AssetInjectHtmlPlugin()
    ]
}