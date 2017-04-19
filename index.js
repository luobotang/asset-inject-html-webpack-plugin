var path = require('path')

var RE_CSS_INJECT_POINT = /<!--\s*css_inject_point\s*-->/gi
var RE_JS_INJECT_POINT = /<!--\s*js_inject_point\s*-->/gi
var RE_CHUNK_INJECT_POINT = /<!--\s*chunk_(\S+)_(js|css)_inject_point\s*-->/gi
var RE_ASSERT_INJECT_POINT = /<!--\s*asset_(\S+)_(js|css)_inject_point\s*-->/gi
var RE_TEXT_INJECT_POINT = /<!--\s*text_(\S+)_(js|css)_inject_point\s*-->/gi
var RE_INLINE_INJECT_POINT = /<!--\s*inline_(\S+)_(js|css)_inject_point\s*-->/gi

function AssetInjectHTMLWebpackPlugin(options) {
    this.options = Object.assign({
        assets: null,
        texts: null
    }, options)
}

AssetInjectHTMLWebpackPlugin.prototype.apply = function (compiler) {
    var assets = this.options.assets
    var texts = this.options.texts
    var self = this

    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (args, callback) {
            try {
                args.html = args.html
                    .replace(RE_CSS_INJECT_POINT, function () {
                        return renderStyleTag(args.assets.css)
                    })
                    .replace(RE_JS_INJECT_POINT, function () {
                        return renderScriptTag(args.assets.js)
                    })
                    .replace(RE_CHUNK_INJECT_POINT, function (match, name, type) {
                        var chunk = args.assets.chunks[name]
                        if (chunk) {
                            return type === 'js' ?
                                renderScriptTag(chunk.entry) :
                                renderStyleTag(chunk.css)
                        } else {
                            throw new Error('can not find chunk: ' + name)
                        }
                    })
                    .replace(RE_ASSERT_INJECT_POINT, function (match, name, type) {
                        var asset = assets && assets[name]
                        if (asset) {
                            return type === 'js' ?
                                renderScriptTag(asset) :
                                renderStyleTag(asset)
                        } else {
                            throw new Error('can not find asset: ' + name + ', from: ' + match)
                        }
                    })
                    .replace(RE_TEXT_INJECT_POINT, function (match, name, type) {
                        var text = texts && texts[name]
                        if (text) {
                            return type === 'js' ?
                                renderInlineScriptTag(text) :
                                renderInlineStyleTag(text)
                        } else {
                            throw new Error('can not find text: ' + name + ', from: ' + match)
                        }
                    })
                    .replace(RE_INLINE_INJECT_POINT, function (match, name, type) {
                        var chunk = args.assets.chunks[name]
                        if (chunk) {
                            var assets = type === 'js' ? chunk.entry : chunk.css
                        } else {
                            throw new Error('can not find chunk: ' + name)
                        }
                        var renderFn = type === 'js' ? renderInlineScriptTag : renderInlineStyleTag
                        if (!Array.isArray(assets)) {
                            assets = [assets]
                        }
                        return assets.map(function (assetUrl) {
                            return renderFn(self.getAssetSource(compilation, assetUrl))
                        }).join('\n')
                    })
                callback(null, args)
            } catch (e) {
                callback(e)
            }
        })
    })
}

/**
 * `https://github.com/DustinJackson/html-webpack-inline-source-plugin`
 */
AssetInjectHTMLWebpackPlugin.prototype.getAssetSource = function (compilation, assetUrl) {
    var publicUrlPrefix = compilation.outputOptions.publicPath || ''
    var assetName = path.posix.relative(publicUrlPrefix, assetUrl)
    var asset = compilation.assets[assetName]
    return asset.source()
}

module.exports = AssetInjectHTMLWebpackPlugin

function renderStyleTag(path) {
    return renderTag(path, _renderStyleTag)
}

function renderScriptTag(path) {
    return renderTag(path, _renderScriptTag)
}

function renderTag(path, renderFn) {
    if (Array.isArray(path)) {
        return path.map(renderFn).join('\n')
    } else {
        return renderFn(path)
    }
}

function _renderStyleTag(path) {
    return '<link rel="stylesheet" href="' + path + '">'
}

function _renderScriptTag(path) {
    return '<script src="' + path + '"></script>'
}

function renderInlineStyleTag(text) {
    return '<style>' + text + '</style>'
}

function renderInlineScriptTag(text) {
    return '<script>' + text + '</script>'
}