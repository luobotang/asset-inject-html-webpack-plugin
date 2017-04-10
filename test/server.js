var express = require('express')
var ftlMiddleware = require('ftl-server/lib/ftl')
var webpackMiddleware = require('webpack-dev-middleware')
var webpack = require('webpack')
var webpackConfig = require('./webpack.config')

var app = express()
app.use(ftlMiddleware)
app.use(webpackMiddleware(webpack(webpackConfig)))
app.listen(8765, function () {
    console.log('listen on 8765')
})