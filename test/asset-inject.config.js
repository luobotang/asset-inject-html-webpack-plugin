var fs = require('fs')
var path = require('path')
var uglify = require('uglify-js')

module.exports = {
	assets: {
		'index-local-test': '/index-local-test.js',
		'index-online-test': '/index-online-test.js',
		$find: function (name, type) {
			return 'http://example.com/' + name + '.' + type
		}
	},
	texts: {
		$find: function(name, type) {
			return getJsText(path.join(__dirname, './inject/' + name + '.js'))
		}
	},
	args: {
		local: false,
		online: true
	},
	favicons: {
		default: '/images/example.ico'
	}
}

function getJsText(file) {
	return uglify.minify(fs.readFileSync(file, 'UTF-8'), {fromString: true}).code
}