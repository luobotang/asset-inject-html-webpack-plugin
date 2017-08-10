var fs = require('fs')
var path = require('path')
var uglify = require('uglify-js')

module.exports = {
	assets: {
		bootstrap: 'http://example.com/bootstrap.css',
		'index-local-test': '/index-local-test.js',
		'index-online-test': '/index-online-test.js'
	},
	texts: {
		ga: getText(path.join(__dirname, './ga.js'))
	},
	args: {
		local: false,
		online: true
	},
	favicons: {
		default: '/images/example.ico'
	}
}

function getText(file) {
	return function() {
		console.log('get file: ' + file)
		return uglify.minify(fs.readFileSync(file, 'UTF-8'), {fromString: true}).code
	}
}