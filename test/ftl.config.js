var path = require('path')

module.exports = {
    port: '8000',
    public: path.join(__dirname, 'dist'),
    ftl: {
        base: path.join(__dirname, 'dist/ftl')
    }
}