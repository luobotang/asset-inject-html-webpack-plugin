# asset-inject-html-webpack-plugin

Inject assets into HTML template, extension plugin of html-webpack-plugin.

## usage

In ```template.html```:

```html
<!DOCTYPE html>
<html>
<head>
...
<!-- css_inject_point -->
...
</head>
<body>
...
<!-- chunk_vendor_js_inject_point -->
<!-- chunk_common_js_inject_point -->
<!-- chunk_index_js_inject_point -->
...
</body>
</html>
```

In ```webpack.config.js```:

```javascript
var HtmlWebpackPlugin = require('html-webpack-plugin')
var AssetInjectHtmlWebpackPlugin = require('asset-inject-html-webpack-plugin')

module.exports = {
    // ...
    plugins: [
        // ...
        new HtmlWebpackPlugin({
            template: 'template.html'
        }),
        new AssetInjectHtmlWebpackPlugin()
    ]
}
```

After webpack bundle, the output ```output.html``` is:

```html
<!DOCTYPE html>
<html>
<head>
...
<link rel="stylesheet" href="css/common.css">
<link rel="stylesheet" href="css/index.css">
...
</head>
<body>
...
<script src="js/vendor.js"></script>
<script src="js/common.js"></script>
<script src="js/index.js"></script>
...
</body>
</html>
```