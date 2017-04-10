var RE_CSS_INJECT_POINT = /<!--\s*css_inject_point\s*-->/gi
var RE_JS_INJECT_POINT = /<!--\s*js_inject_point\s*-->/gi
var RE_CHUNK_INJECT_POINT = /<!--\s*chunk_(\S+)_(js|css)_inject_point\s*-->/gi

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
            }).replace(RE_CHUNK_INJECT_POINT, function (match, name, type) {
                var chunk = args.assets.chunks[name]
                console.log(chunk)
                if (chunk) {
                    return type === 'js' ?
                        renderScriptTag(chunk.entry) :
                        chunk.css.map(renderStyleTag).join('\n')
                } else {
                    console.error('can not find chunk: ' + name)
                    return ''
                }
            })
            callback(null, args)
        })
    })
}

module.exports = AssetInjectHTMLWebpackPlugin