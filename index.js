var RE_CSS_INJECT_POINT = /<!--\s*css_inject_point\s*-->/i
var RE_JS_INJECT_POINT = /<!--\s*js_inject_point\s*-->/i

function renderStyleTag(path) {
    return '<link rel="stylesheet" href="' + path + '">'
}

function renderScriptTag(path) {
    return '<script src="' + path + '"></script>'
}

function AssetInjectHTMLWebpackPlugin() { }

AssetInjectHTMLWebpackPlugin.prototype.apply = function (compiler) {
    compiler.plugin('compilation', function (compilation) {
        compilation.plugin('html-webpack-plugin-before-html-processing', function (args, callback) {
            args.html = args.html.replace(RE_CSS_INJECT_POINT, function () {
                return args.assets.css.map(renderStyleTag).join('\n')
            }).replace(RE_JS_INJECT_POINT, function () {
                return args.assets.js.map(renderScriptTag).join('\n')
            })
            callback(null, args)
        })
    })
}

module.exports = AssetInjectHTMLWebpackPlugin