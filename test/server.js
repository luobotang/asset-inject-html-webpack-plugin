var path = require('path')
var express = require('express')
var freemarkerMiddleware = require('freemarker-middleware')
var webpackMiddleware = require('webpack-dev-middleware')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')

var app = express()
app.use('/images', express.static('dist/images'))
app.use(webpackMiddleware(webpack(webpackConfig), {stats: 'errors-only'}))
app.use(freemarkerMiddleware(path.join(__dirname, 'dist/ftl')))
app.listen(8899, function () {
    console.log('listen on 8899')
})