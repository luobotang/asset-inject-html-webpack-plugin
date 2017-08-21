var path = require('path')

/**
 * <!-- <type>_inject_point[ <ex-type>_<ex-name>][ if_<arg>] -->
 * type: js | css
 * ex-type: chunk | inline | asset | text
 * ex-name: *
 * arg: *
 * 
 * or:
 * 
 * <!-- favicon_inject_point[ <name>][ if_<arg>] -->
 * name: *
 */
var RE_INJECT_POINT = /<!--\s*(js|css)_inject_point((?:_|\s+)(chunk|asset|text|inline)_(\S+))?(\s+if_(\S+)\s*)?\s*-->/gi
var RE_INJECT_POINT_FAVICON = /<!--\s*favicon_inject_point((?:\s+)(\S+))?(\s+if_(\S+)\s*)?\s*-->/gi

function AssetInjectHTMLWebpackPlugin(options) {
    this.options = Object.assign({
        assets: null,
        texts: null
    }, options)
}

/**
 * @throw AssetInjectError
 */
AssetInjectHTMLWebpackPlugin.prototype.apply = function (compiler) {
    var self = this
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (htmlPluginArgs, callback) {
            try {
                htmlPluginArgs.html = htmlPluginArgs.html.replace(
                    RE_INJECT_POINT,
                    function (match, type, ex, exType, exName, ifMatch, ifArg) {
                        return self.replaceInjectPoint(compilation, htmlPluginArgs, {
                            match: match,
                            type: type,
                            ex: ex,
                            exType: exType,
                            exName: exName,
                            ifArg: ifMatch ? ifArg : null
                        })
                    }
                ).replace(
                    RE_INJECT_POINT_FAVICON,
                    function (match, ex, exName, ifMatch, ifArg) {
                        return self.replaceInjectPointFavicon(compilation, htmlPluginArgs, {
                            match: match,
                            ex: ex,
                            exName: exName,
                            ifArg: ifMatch ? ifArg : null
                        })
                    }
                )
                callback(null, htmlPluginArgs)
            } catch (e) {
                callback(e)
            }
        })
    })
}

AssetInjectHTMLWebpackPlugin.prototype.replaceInjectPoint = function (compilation, htmlPluginArgs, match) {
    var args = this.options.args
    var assets = this.options.assets
    var texts = this.options.texts
    var self = this

    // do not replace if arg value not `true` in options.args
    if (match.ifArg && (!args || !args[match.ifArg])) {
        return ''
    }

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
                throw new AssetInjectError(`no chunk "${match.exName}"`, match)
            }
        case 'inline':
            var chunk = htmlPluginArgs.assets.chunks[match.exName]
            if (chunk) {
                var _assets = match.type === 'js' ? chunk.entry : chunk.css
            } else {
                throw new AssetInjectError(`no chunk "${match.exName}" for inline`, match)
            }
            if (!Array.isArray(_assets)) {
                _assets = [_assets]
            }
            return _assets.map(function (assetUrl) {
                return renderInlineTagFn(self.getAssetSource(compilation, assetUrl))
            }).join('\n')
        case 'asset':
            var asset = assets && assets[match.exName]
            if (!asset && assets && typeof assets.$find === 'function') {
                asset = assets.$find.call(null, match.exName, match.type)
            }
            if (asset) {
                return renderTagFn(asset)
            } else {
                throw new AssetInjectError(`no asset "${match.exName}"`, match)
            }
        case 'text':
            var text = texts && texts[match.exName]
            if (!text && texts && typeof texts.$find === 'function') {
                text = texts.$find.call(null, match.exName, match.type)
            }
            if (text) {
                return renderInlineTagFn(text)
            } else {
                throw new AssetInjectError(`no text "${match.exName}"`, match)
            }
        default:
            throw new AssetInjectError(`unsupported type "${match.exType}"`, match)
    }
}

AssetInjectHTMLWebpackPlugin.prototype.replaceInjectPointFavicon = function (compilation, htmlPluginArgs, match) {
    var args = this.options.args
    var favicons = this.options.favicons

    // do not replace if arg value not `true` in options.args
    if (match.ifArg && (!args || !args[match.ifArg])) {
        return ''
    }

    var faviconPath = match.ex ?
        favicons && favicons[match.exName] :
        favicons && favicons.default

    if (faviconPath) {
        return renderFaviconTag(faviconPath)
    } else {
        throw new AssetInjectError(`no favicon "${match.exName}"`, match)
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

function renderFaviconTag(path) {
    return '<link rel="icon" href="' + path + '">'
}

/* AssetInjectError */

function AssetInjectError(message, match) {
    this.name = 'AssetInjectError'
    this.message = `${message}, match "${match.match}"`
    this.match = match
    Error.captureStackTrace(this, AssetInjectError)
}

AssetInjectError.prototype = new Error()