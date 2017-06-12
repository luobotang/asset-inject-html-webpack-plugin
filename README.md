# asset-inject-html-webpack-plugin

Inject assets into HTML template, extension plugin of the webpack plugin [html-webpack-plugin](https://www.npmjs.com/package/html-webpack-plugin).

## usage

In ```webpack.config.js```:

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin')
var AssetInjectHtmlWebpackPlugin = require('asset-inject-html-webpack-plugin')

module.exports = {
    plugins: [
        // ...
        new HtmlWebpackPlugin({
            template: 'template.html',
            filename: 'output.html'
        }),
        new AssetInjectHtmlWebpackPlugin({
            assets: {
                bootstrap: 'http://localhost/css/bootstrap.css',
                jquery: 'http://localhost/js/jquery.js'
            },
            texts: {
                foo: 'var bar = {}; /* ... */',
                base: 'h1 { color: red; } p { font-size: 24px; } /* ... */'
            },
            favicons: {
                default: 'http://example.com/favicon.png'
            }
        })
    ]
}
```

## inject-point

To inject asset, just put comment tag like ```<!-- css_inject_point -->``` in your HTML template file.

### main type

- ```js_inject_point```
- ```css_inject_point```
- ```favicon_inject_point```

### sub type

Js and css inject points, have ```sub-type```:

- chunk: ```<!-- js_inject_point chunk_index -->```
- asset: ```<!-- js_inject_point asset_jquery -->```
- text: ```<!-- js_inject_point asset_foo -->```
- inline: ```<!-- js_inject_point inline_bar -->```

Favicon inject points can have a optional name:

```html
<!-- favicon_inject_point example -->
```

If not set, use options ```favicons.default``` as the favicon path.

### conditional replace

e.g. ```<!-- js_inject_point asset_test if_local -->``` only do replace when ```options.args.local``` is true value.

## demo

See ```test/webpack.config.js```.