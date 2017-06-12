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
		ga: uglify.minify(
			fs.readFileSync(path.join(__dirname, './ga.js'), 'UTF-8'),
			{fromString: true}
		).code
	},
	args: {
		local: false,
		online: true
	},
	favicons: {
		default: '/images/example.ico'
	}
}