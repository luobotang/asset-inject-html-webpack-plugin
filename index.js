var path = require('path')

/**
 * <!-- css_inject_point[_<ex-type>_<ex-name>] -->
 * ex-type: chunk | asset | text | inline
 * ex-name: (anything)
 */
var RE_INJECT_POINT  = /<!--\s*(js|css)_inject_point(_(chunk|asset|text|inline)_(\S+))?\s*-->/gi

function AssetInjectHTMLWebpackPlugin(options) {
    this.options = Object.assign({
        assets: null,
        texts: null
    }, options)
}

AssetInjectHTMLWebpackPlugin.prototype.apply = function (compiler) {
    var self = this
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginArgs, callback) {
            try {
                htmlPluginArgs.html = htmlPluginArgs.html.replace(RE_INJECT_POINT, function (match, type, ex, exType, exName) {
                    return self.replaceInjectPoint(compilation, htmlPluginArgs, {
                        match: match,
                        type: type,
                        ex: ex,
                        exType: exType,
                        exName: exName
                    })
                })
                callback(null, htmlPluginArgs)
            } catch (e) {
                callback(e)
            }
        })
    })
}

AssetInjectHTMLWebpackPlugin.prototype.replaceInjectPoint = function (compilation, htmlPluginArgs, match) {
    var assets = this.options.assets
    var texts = this.options.texts
    var self = this

    var renderTagFn = match.type === 'js' ? renderScriptTag : renderStyleTag
    var renderInlineTagFn = match.type === 'js' ? renderInlineScriptTag : renderInlineStyleTag

    if (!match.ex) {
        return renderTagFn(match.type === 'js' ? htmlPluginArgs.assets.js : htmlPluginArgs.assets.css)
    }

    switch (match.exType) {
        case 'chunk':
            var chunk = htmlPluginArgs.assets.chunks[match.exName]
            if (chunk) {
                return renderTagFn(match.type === 'js' ? chunk.entry : chunk.css)
            } else {
                throw new Error('can not find chunk: ' + match.exName)
            }
        case 'asset':
            var asset = assets && assets[match.exName]
            if (asset) {
                return renderTagFn(asset)
            } else {
                throw new Error('can not find asset: ' + name + ', from: ' + match.match)
            }
        case 'text':
            var text = texts && texts[match.exName]
            if (text) {
                return renderInlineTagFn(text)
            } else {
                throw new Error('can not find text: ' + match.exName + ', from: ' + match.match)
            }
        case 'inline':
            var chunk = htmlPluginArgs.assets.chunks[match.exName]
            if (chunk) {
                var _assets = match.type === 'js' ? chunk.entry : chunk.css
            } else {
                throw new Error('can not find chunk: ' + match.exName)
            }
            if (!Array.isArray(_assets)) {
                _assets = [_assets]
            }
            return _assets.map(function (assetUrl) {
                return renderInlineTagFn(self.getAssetSource(compilation, assetUrl))
            }).join('\n')
        default:
            throw new Error('unsupported type: ' + match.exType + ', from: ' + match.match)
    }
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