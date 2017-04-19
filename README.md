# asset-inject-html-webpack-plugin

Inject assets into HTML template, extension plugin of html-webpack-plugin.

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
            }
        })
    ]
}
```

## inject-point

To inject asset, just put comment tag like ```<!-- css_inject_point -->``` in your HTML template file.

```js_inject_point``` and ```css_inject_point``` are two main type.

And ```sub-type```:

- chunk
- asset
- text
- inline

## demo

See ```test/webpack.config.js```.